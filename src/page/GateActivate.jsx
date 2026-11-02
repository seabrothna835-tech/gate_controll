
import { useCallback, useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import Hls from "hls.js";
import { BsRecordBtn } from "react-icons/bs";
import { MdVideocam } from "react-icons/md";
import { TfiLayoutColumn2Alt, TfiLayoutColumn3Alt, TfiLayoutColumn4Alt } from "react-icons/tfi";
import { TbColumns1Filled } from "react-icons/tb";
import { initKeycloak, keycloak } from "../keyCloak";

const cameras = [
    {
        id: 1,
        name: "Gate 1",
        url: "http://localhost:8889/gate1/",
    },
    
    {
        id: 2,
        name: "Gate 2",
        url: "http://localhost:8889/gate2/",
    },
    {
        id: 3,
        name: "Gate 3",
        url: "http://localhost:8889/gate3/",
    }
];

const gatecall = {
    gatecallid: 1018,
    licence_plate: "PP-3A-5653",
    truck_company: "Mekong Logistics Co., Ltd.",
    descriptions: "Truck entered through Gate 2 for container pickup",
    gatecall_status: "ACT",
    driver_name: "Sok Vannak",
    driver_id: "DRV-004",
    dropoff_or_pickup: "dropoff",
    terminal: "LM17",
    gatein_time: "2026-10-28T10:46:56"
};

const gatecallCargo = {
    cargo_id: 113,
    bl_id: 305,
    container_id: "TGHU7654385",
    handling_time: "2026-10-23T09:45:00",
    blnumber: "BL-2026-004",
    container_lenght: "20FT",
    fullorempty: "EMPTY",
    cont_grossweight: 12500.0,
    cont_tareweight: 2200.0,
    vgm: "14700",
    refer_flag: "Y",
    line_id: 11,
    shppingline_name: "CMA CGM",
    lineagent_id: 21,
    lineagent_name: "Mekong Shipping Agency",
    vsl_operator_id: 31,
    vsl_operator_name: "Pacific Vessel Operations",
    cfa_id: 41,
    cfa_name: "Cambodia Freight Agency",
    invrcv_id: 52,
    invrcv_name: "Mekong Import Solutions",
    cargo_status: "ACT",
    terminal: "LM17",
    create_by:1,
    create_time: "2026-10-28T10:46:56"
};

const gateInApiUrl = "http://localhost:8080/api/gate";

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

function CameraPlayer({ camera, registerVideo }) {
    const videoRef = useRef(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        registerVideo(camera.id, video);
        const streamUrl =
            camera.url.replace(
                "http://localhost:8889/",
                "http://localhost:8888/",
            ) + "index.m3u8";

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
            hls?.destroy();
            video.removeAttribute("src");
            video.load();
        };
    }, [camera, registerVideo]);

    return (
        <div className="overflow-hidden rounded-2xl border-2 color-animate shadow-md font-hanuman ">
            <div className="bg-gray-800 p-3 text-white flex items-center justify-between">
                <div className="flex item-center gap-2">
                    <span className="text-2xl color-animate"><BsRecordBtn /></span>
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

            <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                controls
                crossOrigin="anonymous"
                className="aspect-video w-full bg-black"
            />
        </div>
    );
}

export default function GateActivate() {
    const { activeMode } = useOutletContext();
    const videoRefs = useRef({});
    const [capturedImages, setCapturedImages] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionMessage, setSubmissionMessage] = useState("");
    const [showVdo, setShowVdo] = useState(3);
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

    const captureAll = async () => {
        capturedImages.forEach((e, index) => { console.log(`Captured image ${index + 1}:`, e); console.log("Image URL:", e.images?.url); });
        setIsSubmitting(true);
        setSubmissionMessage("");

        try {
            // await initKeycloak();
            // if (!keycloak.authenticated) {
            //     throw new Error("Your session has expired. Please sign in again.");
            // }

            // await keycloak.updateToken(30);
            // if (!keycloak.token) {
            //     throw new Error("Unable to retrieve an access token. Please sign in again.");
            // }

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

            const payload = {
                gatecall,
                gateImage: images.map(({ base64Image }) => ({
                    in_image: base64Image,
                })),
                gatecallCargo,
            };

            const response = await fetch(gateInApiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload),
            });
            //  Authorization: `Bearer ${keycloak.token}`,

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(
                    `Gate-in request failed (${response.status})${errorText ? `: ${errorText}` : ""}`
                );
            }

            setSubmissionMessage("Gate-in payload sent successfully.");
        } catch (error) {
            console.error("Capture or gate-in submission failed:", error);
            setSubmissionMessage(
                error instanceof Error ? error.message : "Unable to submit gate-in payload."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main data-mode={activeMode ? "light" : "dark"} className="mx-auto max-w-[1600px] p-4 sm:p-6 lg:p-8 lg:pt-2 font-hanuman">
            <div className="mb-4 flex items-center justify-between text-black">
                <div className="flex items-center gap-2">
                    <MdVideocam className="text-3xl color-animate shrink-0" />
                    <div>
                        <p className="text-lg">ពិនិត្យតាមរយៈកាមេរ៉ា</p>
                        <p className="text-xs text-gray-500">
                            ចុចលើរូបភាពដើម្បីបើកពេញអេក្រង់
                        </p>
                    </div>
                </div>
                <div className="relative grid grid-cols-4 items-center justify-center rounded-full bg-[#edf2f6] p-1">
                    <div
                        className="absolute bottom-1 left-1 top-1 w-[calc((100%-8px)/4)] rounded-full bg-white shadow-md transition-transform duration-300 ease-in-out"
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
                                className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-300 ${
                                    showVdo === value.id ? "text-cyan-500" : "text-gray-500 hover:text-cyan-400"
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
                        />
                    ))}
                </div>
            </div>
            <section className="mt-2">
                <button
                    type="button"
                    onClick={captureAll}
                    disabled={isSubmitting}
                    className="rounded-lg bg-blue-400 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isSubmitting ? "Capturing and sending..." : "Capture images and send"}
                </button>
                {submissionMessage && (
                    <p role="status" className="mt-2 text-sm">
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
                        <figcaption className="mt-1 text-sm">
                            Gate {image.cameraId} · {image.capturedAt}
                        </figcaption>
                    </figure>
                ))}
            </section>
        </main>
    );
}
