
import { useCallback, useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import Hls from "hls.js";
import { BsRecordBtn } from "react-icons/bs";
import { MdFullscreen, MdVideocam } from "react-icons/md";
import { TfiLayoutColumn2Alt, TfiLayoutColumn3Alt, TfiLayoutColumn4Alt } from "react-icons/tfi";
import { TbColumns1Filled } from "react-icons/tb";
import { keycloak } from "../keyCloak";
import { useDispatch, useSelector } from "react-redux";
import { setGateIn, setGateOut, setGateOutCallId } from "../Store/Filter/Activate";

const templateVideo = [
    {
        id: 1,
        show: "1 Video",
        icon: <TbColumns1Filled />
    },
    {
        id: 2,
        show: "2 Video",
        icon: <TfiLayoutColumn2Alt />
    },
    {
        id: 3,
        show: "3 Video",
        icon: <TfiLayoutColumn3Alt />
    },
    {
        id: 4,
        show: "4 Video",
        icon: <TfiLayoutColumn4Alt />
    }
];

function getSavedCameras() {
    try {
        const data = localStorage.getItem("stream");
        if (!data) return { cameras: [], cameraError: "Camera information is not configured." };

        const parsedData = JSON.parse(data);
        if (!Array.isArray(parsedData)) {
            throw new Error("Saved camera information must be an array.");
        }
        if (parsedData.some((item) => !item || !item.streamUrl)) {
            throw new Error("Saved camera information is missing a stream URL.");
        }

        return {
            cameras: parsedData.map((item, index) => ({
                id: item.id ?? index,
                name: item.ip_camera || item.gate_name || `Camera ${index + 1}`,
                url: item.streamUrl,
            })),
            cameraError: "",
        };
    } catch (error) {
        return {
            cameras: [],
            cameraError: error instanceof Error ? error.message : "Unable to load camera information.",
        };
    }
}

function CameraPlayer({ camera, registerVideo, onCameraReady, isActiveLightMode }) {
    const cardRef = useRef(null);
    const videoRef = useRef(null);

    const openFullscreen = async () => {
        const card = cardRef.current;
        const video = videoRef.current;
        if (!card || !video) return;

        try {
            if (document.fullscreenElement) {
                await document.exitFullscreen();
                return;
            }
            if (card.requestFullscreen) {
                await card.requestFullscreen();
            } else if (video.webkitEnterFullscreen) {
                video.webkitEnterFullscreen();
            } else {
                throw new Error("Fullscreen is not supported by this browser.");
            }
        } catch (error) {
            console.error(`${camera.name}: unable to open fullscreen.`, error);
        }
    };

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        registerVideo(camera.id, video);
        const updateReadiness = () => {
            onCameraReady(
                camera.id,
                video.readyState >= 2 && video.videoWidth > 0 && video.videoHeight > 0
            );
        };
        video.addEventListener("loadeddata", updateReadiness);
        video.addEventListener("canplay", updateReadiness);
        const baseUrl = camera.url.replace(
            "http://localhost:8889/",
            "http://localhost:8888/",
        );
        const streamUrl = baseUrl.toLowerCase().includes(".m3u8")
            ? baseUrl
            : `${baseUrl.replace(/\/$/, "")}/index.m3u8`;

        let hls;

        if (Hls.isSupported()) {
            hls = new Hls();

            hls.loadSource(streamUrl);
            hls.attachMedia(video);

            hls.on(Hls.Events.ERROR, (_, data) => {
                if (data.fatal) {
                    console.error(
                        `${camera.name} stream error:`,
                        data.details
                    );
                }
            });
        } else if (
            video.canPlayType("application/vnd.apple.mpegurl")
        ) {
            video.src = streamUrl;
        }

        return () => {
            registerVideo(camera.id, null);
            onCameraReady(camera.id, false);
            video.removeEventListener("loadeddata", updateReadiness);
            video.removeEventListener("canplay", updateReadiness);
            hls?.destroy();
            video.removeAttribute("src");
            video.load();
        };
    }, [camera, onCameraReady, registerVideo]);

    return (
        <div ref={cardRef} className={`overflow-hidden rounded-2xl border shadow-md font-hanuman ${isActiveLightMode ? "border-lightBorder bg-lightModeBg" : "border-darkBorder bg-darkModeBg"}`}>
            <div className="flex items-center justify-between bg-darkModeBg p-3 text-darkModeTitle">
                <div className="flex item-center gap-2">
                    <span className="text-2xl text-cyan-400"><BsRecordBtn /></span>
                    <h3>កាមេរ៉ា​​ {camera.id}</h3>
                </div>
                <div className="text-xs p-1 uppercase border border-green-300 rounded-2xl flex items-center gap-2">
                    <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#42a875] opacity-40" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#26915b]" />
                    </span>
                    <p>បញ្ចាំងផ្ទាល់</p>
                </div>
            </div>

            <div className="camera-player-frame relative">
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    crossOrigin="anonymous"
                    className="camera-player-video aspect-video w-full bg-black"
                />
                <button
                    type="button"
                    onClick={openFullscreen}
                    aria-label={`${document.fullscreenElement ? "បិទពេញអេក្រង់" : "បើកពេញអេក្រង់"}`}
                    title={`${document.fullscreenElement ? "បិទពេញអេក្រង់" : "បើកពេញអេក្រង់"}`}
                    className="absolute bottom-3 right-3 rounded-md bg-black/70 p-2 text-white transition-colors hover:bg-black/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                >
                    <MdFullscreen className="text-2xl" />
                </button>
            </div>
        </div>
    );
}

export default function GateActivate({ onStatusChange }) {
    const dispatch = useDispatch();
    const valueGateIn = useSelector((state) => state.activate.gateIn)
    const valueGateOut = useSelector((state) => state.activate.gateOut)
    const callid = useSelector((state) => state.activate.gateOutCallId)

    const url_vite = import.meta.env.VITE_API_URL;
    const { activeMode } = useOutletContext();
    const isActiveLightMode = activeMode;
    const mutedText = isActiveLightMode ? "text-lightModeSubTitle" : "text-darkModeSubTitle";
    const videoRefs = useRef({});
    const [capturedImages, setCapturedImages] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionMessage, setSubmissionMessage] = useState("");
    const [readyCameraIds, setReadyCameraIds] = useState([]);
    const [autoActivationTimedOut, setAutoActivationTimedOut] = useState(false);
    const [gateDataLoaded, setGateDataLoaded] = useState(false);
    const [gateDataError, setGateDataError] = useState("");
    const [showVdo, setShowVdo] = useState(3);
    const [gateData, setGateData] = useState({
        gatecall: {},
        gatecallCargo: {}
    });
    const [{ cameras, cameraError }] = useState(getSavedCameras);

    const isGateOut = Boolean(valueGateOut);
    const shouldAutoActivate = Boolean(valueGateIn || valueGateOut);
    const autoActivationStarted = useRef(false);
    const handledCaptureRequest = useRef(0);
    const [captureRequest, setCaptureRequest] = useState(0);
    const gridColumns = {
        1: "grid-cols-1",
        2: "grid-cols-1 sm:grid-cols-2",
        3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        4: "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4",
    };

    const registerVideo = useCallback((cameraId, video) => {
        if (video) {
            videoRefs.current[cameraId] = video;
        } else {
            delete videoRefs.current[cameraId];
        }
    }, []);
    const onCameraReady = useCallback((cameraId, isReady) => {
        setReadyCameraIds((current) => {
            if (isReady) {
                return current.includes(cameraId) ? current : [...current, cameraId];
            }
            return current.filter((id) => id !== cameraId);
        });
    }, []);
    const allCamerasReady =
        cameras.length > 0 && cameras.every((camera) => readyCameraIds.includes(camera.id));
    const isWaitingForActivation =
        shouldAutoActivate &&
        (!allCamerasReady || (valueGateIn && !gateDataLoaded)) &&
        !cameraError &&
        !gateDataError &&
        !autoActivationTimedOut &&
        !isSubmitting;

    useEffect(() => {
        if (!onStatusChange) return;
        const status = isWaitingForActivation
            ? valueGateIn
                ? "Waiting for cameras and gate data..."
                : "Waiting for cameras..."
            : isSubmitting
                ? "Capturing and sending..."
            : submissionMessage || cameraError || gateDataError;
        onStatusChange(status);
    }, [
        gateDataError,
        cameraError,
        isSubmitting,
        isWaitingForActivation,
        onStatusChange,
        submissionMessage,
        valueGateIn,
    ]);

    useEffect(() => {
        if (!shouldAutoActivate || autoActivationStarted.current || captureRequest > 0) return;
        if (!allCamerasReady || (valueGateIn && !gateDataLoaded)) return;

        autoActivationStarted.current = true;
        setCaptureRequest((current) => current + 1);
    }, [allCamerasReady, captureRequest, gateDataLoaded, shouldAutoActivate, valueGateIn]);

    useEffect(() => {
        if (!isWaitingForActivation || autoActivationStarted.current) return;
        const timeout = window.setTimeout(() => {
            if (!autoActivationStarted.current) {
                setAutoActivationTimedOut(true);
                setSubmissionMessage("Camera feeds or gate data did not become ready in time. Please check the connection and try again.");
            }
        }, 30000);
        return () => window.clearTimeout(timeout);
    }, [isWaitingForActivation]);

    const captureAll = () => {
        if (isSubmitting) return;
        setCaptureRequest((current) => current + 1);
    };

    useEffect(() => {
        if (!captureRequest || handledCaptureRequest.current === captureRequest) return;
        handledCaptureRequest.current = captureRequest;
        const submitGateAction = async () => {
            setIsSubmitting(true);
            setSubmissionMessage("");
            try {
                const capturedAt = new Date().toLocaleString();
                const images = cameras.map((camera) => {
                    const video = videoRefs.current[camera.id];
                    if (!video || video.readyState < 2) {
                        throw new Error(`${camera.name}: camera is not ready.`);
                    }
                    if (!video.videoWidth || !video.videoHeight) {
                        throw new Error(`${camera.name}: video dimensions are unavailable.`);
                    }
                    const canvas = document.createElement("canvas");
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    const context = canvas.getContext("2d");
                    if (!context) {
                        throw new Error("Unable to create a canvas for image capture.");
                    }
                    context.drawImage(video, 0, 0, canvas.width, canvas.height);
                    const dataUrl = canvas.toDataURL("image/png");
                    const base64Image = dataUrl.split(",")[1];
                    if (!base64Image) {
                        throw new Error(`${camera.name}: failed to encode the captured image.`);
                    }
                    return {
                        cameraId: camera.id,
                        dataUrl,
                        base64Image,
                        capturedAt,
                    };
                });
                setCapturedImages(
                    images.map(({ cameraId, dataUrl, capturedAt }) => ({
                        id: cameraId,
                        cameraId,
                        url: dataUrl,
                        capturedAt,
                    }))
                );
                const payload = isGateOut
                    ? {
                        gatecall: {
                            gatecallid: callid,
                            gateout_time: new Date().toISOString(),
                        },
                        gateImage: images.map(({ base64Image }) => ({
                            out_image: base64Image,
                        })),
                    }
                    : {
                        gatecall: gateData.gatecall ?? {},
                        gatecallCargo: gateData.gatecallCargo ?? {},
                        gateImage: images.map(({ base64Image }) => ({
                            in_image: base64Image,
                        })),
                    };
                const endpoint = isGateOut ? "/api/gateout" : "/api/gate";
                await keycloak.updateToken(30);
                const token = keycloak.token;
                const response = await fetch(`${url_vite}${endpoint}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(payload),
                });
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(
                        `${isGateOut ? "Gate-out" : "Gate-in"} request failed (${response.status})${errorText ? `: ${errorText}` : ""}`
                    );
                }

                const successMessage = `${isGateOut ? "Gate-out" : "Gate-in"} submitted successfully.`;
                setSubmissionMessage(successMessage);
                onStatusChange?.(successMessage);
                dispatch(setGateIn(false));
                dispatch(setGateOut(false));
                dispatch(setGateOutCallId(null));
            } catch (error) {
                console.error("Capture or gate submission failed:", error);

                setSubmissionMessage(
                    error instanceof Error
                        ? error.message
                        : `Unable to submit ${isGateOut ? "gate-out" : "gate-in"} payload.`
                );
            } finally {
                setIsSubmitting(false);
            }
        };

        submitGateAction();
    }, [captureRequest, cameras, isGateOut, gateData, url_vite, callid, dispatch, onStatusChange]);
    useEffect(() => {
        async function fetchGateData() {
            try {
                const response = await fetch(`http://localhost:3001/gateData`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch gate data: ${response.statusText}`);
                }
                const data = await response.json();
                setGateData(data);
                setGateDataLoaded(true);
                setGateDataError("");
            } catch (error) {
                console.error("Error fetching gate data:", error);
                setGateDataError(
                    error instanceof Error ? error.message : "Unable to load gate data."
                );
            }
        }
        fetchGateData();
    }, []);

    return (
        <main className={`mx-auto w-full max-w-[1600px] p-4 font-hanuman sm:p-6 lg:p-8 lg:pt-2 ${isActiveLightMode ? "text-lightModeTitle" : "text-darkModeContent"}`}>
            <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <MdVideocam className="shrink-0 text-3xl text-cyan-600" />
                    <div>
                        <p className="text-lg">ពិនិត្យតាមរយៈកាមេរ៉ា</p>
                        <p className={`text-xs ${mutedText}`}>
                            Live camera feed · use the fullscreen button to expand
                        </p>
                    </div>
                </div>
                <div className={`relative grid grid-cols-4 items-center justify-center rounded-full p-1 ${isActiveLightMode ? "bg-lightBorder" : "bg-darkBorder"}`}>
                    <div
                        className={`absolute bottom-1 left-1 top-1 w-[calc((100%-8px)/4)] rounded-full shadow-md transition-transform duration-300 ease-in-out ${isActiveLightMode ? "bg-lightModeBg" : "bg-darkModeBg"}`}
                        style={{ transform: `translateX(${(showVdo - 1) * 100}%)` }}
                    />
                    {templateVideo.map((value) => {
                        return (
                            <button
                                key={value.id}
                                type="button"
                                aria-label={value.show}
                                aria-pressed={showVdo === value.id}
                                title={value.show}
                                onClick={() => setShowVdo(value.id)}
                                className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-300 ${showVdo === value.id ? "text-cyan-500" : mutedText
                                    }`}
                            >
                                {value.icon}
                            </button>
                        );
                    })}
                </div>
            </div>
            <div className="">
                <div className={`grid ${gridColumns[showVdo]} gap-4`}>
                    {cameras.map((camera) => (
                        <CameraPlayer
                            key={camera.id}
                            camera={camera}
                            registerVideo={registerVideo}
                            onCameraReady={onCameraReady}
                            isActiveLightMode={isActiveLightMode}
                        />
                    ))}
                </div>
            </div>
            <section className="mt-2">
                <button
                    type="button"
                    onClick={captureAll}
                    disabled={
                        isSubmitting ||
                        Boolean(cameraError) ||
                        isWaitingForActivation ||
                        (valueGateIn && !gateDataLoaded)
                    }
                    className="rounded-lg bg-cyan-700 px-4 py-2 text-white transition-colors hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isSubmitting
                        ? "Capturing and sending..."
                        : isWaitingForActivation
                            ? valueGateIn
                                ? "Waiting for cameras and gate data..."
                                : "Waiting for cameras..."
                            : "Capture images and send"}
                </button>
                {gateDataError && (
                    <p role="alert" className={`mt-2 text-sm ${mutedText}`}>
                        Unable to load gate data: {gateDataError}
                    </p>
                )}
                {cameraError && (
                    <p role="alert" className={`mt-2 text-sm ${mutedText}`}>
                        Unable to load cameras: {cameraError}
                    </p>
                )}
                {submissionMessage && (
                    <p role="status" className={`mt-2 text-sm ${mutedText}`}>
                        {submissionMessage}
                    </p>
                )}
            </section>
            <section className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {capturedImages.map((image) => (
                    <figure key={image.id}>
                        <img
                            src={image.url}
                            alt={`Captured image from Gate ${image.cameraId}`}
                            className="w-full rounded-lg"
                        />
                        <figcaption className={`mt-1 text-sm ${mutedText}`}>
                            Gate {image.cameraId} · {image.capturedAt}
                        </figcaption>
                    </figure>
                ))}
            </section>
        </main>
    );
}
