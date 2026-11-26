import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

function getSavedCameras() {
    try {
        const data = localStorage.getItem("stream");
        if (!data) return { cameras: [], loadError: "" };

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
                name: item.ip_camera || `Camera ${index + 1}`,
                url: item.streamUrl
            })),
            loadError: ""
        };
    } catch (error) {
        return {
            cameras: [],
            loadError: error.message || "Unable to load camera information."
        };
    }
}

function CaptureImage() {

    const [status, setStatus] = useState({});
    const [capturedImages, setCapturedImages] = useState([]);
    const [{ cameras, loadError }] = useState(getSavedCameras);

    const videoRefs = useRef({});

    useEffect(() => {
        const cleanups = [];
        cameras.forEach((camera) => {

            const video = videoRefs.current[camera.id];

            if (!video) return;

            if (Hls.isSupported()) {

                const hls = new Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });

                cleanups.push(() => hls.destroy());

                hls.loadSource(camera.url);
                hls.attachMedia(video);

                hls.on(Hls.Events.MANIFEST_PARSED, () => {

                    setStatus(prev => ({
                        ...prev,
                        [camera.id]: "Connected"
                    }));

                    video.play().catch(console.error);
                });

                hls.on(Hls.Events.ERROR, (_, data) => {

                    console.error(`Camera ${camera.id} error:`, data);

                    if (data.fatal) {
                        setStatus(prev => ({
                            ...prev,
                            [camera.id]: "Connection failed"
                        }));

                        hls.destroy();
                    }
                });

                setStatus(prev => ({
                    ...prev,
                    [camera.id]: "Connecting..."
                }));

            } else if (video.canPlayType("application/vnd.apple.mpegurl")) {

                video.src = camera.url;
                const handleLoadedMetadata = () => {
                    setStatus(prev => ({
                        ...prev,
                        [camera.id]: "Connected"
                    }));
                };
                const handleError = () => {
                    setStatus(prev => ({
                        ...prev,
                        [camera.id]: "Connection failed"
                    }));
                };

                setStatus(prev => ({
                    ...prev,
                    [camera.id]: "Connecting..."
                }));

                video.addEventListener("loadedmetadata", handleLoadedMetadata);
                video.addEventListener("error", handleError);

                video.play().catch(console.error);

                cleanups.push(() => {
                    video.removeEventListener("loadedmetadata", handleLoadedMetadata);
                    video.removeEventListener("error", handleError);
                    video.removeAttribute("src");
                    video.load();
                });

            } else {

                setStatus(prev => ({
                    ...prev,
                    [camera.id]: "Browser does not support HLS"
                }));
            }

        });
        return () => {
            cleanups.forEach(cleanup => cleanup());
        };
    }, [cameras]);

    const captureImage = (camera) => {

        const video = videoRefs.current[camera.id];

        if (!video || video.readyState < 2 || !video.videoWidth || !video.videoHeight) {
            alert("Camera is not ready!");
            return;
        }

        const canvas = document.createElement("canvas");

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
            alert("Unable to capture an image from this camera.");
            return;
        }

        let imageDataUrl;
        try {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            imageDataUrl = canvas.toDataURL("image/png");
        } catch (error) {
            console.error("Unable to capture camera image:", error);
            alert("Unable to capture an image from this camera.");
            return;
        }

        const capturedImage = {
            id: Date.now(),
            cameraId: camera.id,
            cameraName: camera.name,
            image: imageDataUrl,
            capturedAt: new Date().toLocaleString()
        };

        setCapturedImages(prev => [
            capturedImage,
            ...prev
        ]);

        console.log("Captured image:", capturedImage);
    };

    return (
        <div className="p-5">

            <h2 className="text-2xl font-bold mb-4">
                PPAP Live CCTV Monitoring
            </h2>

            {loadError && (
                <p role="alert" className="mb-4 text-red-600">
                    {loadError}
                </p>
            )}

            {/* Camera Grid */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {!cameras.length && !loadError && (
                    <p className="text-gray-500">
                        No cameras connected. Return to the camera configuration form and connect cameras.
                    </p>
                )}

                {cameras.map(camera => (

                    <div
                        key={camera.id}
                        className="border rounded-lg p-3 shadow"
                    >

                        <div className="flex justify-between items-center mb-2">

                            <h3 className="font-semibold">
                                {camera.name}
                            </h3>

                            <span className="text-sm text-green-600">
                                {status[camera.id] || "Connecting..."}
                            </span>

                        </div>

                        <video
                            ref={el => {
                                videoRefs.current[camera.id] = el;
                            }}
                            autoPlay
                            muted
                            playsInline
                            controls
                            className="w-full aspect-video bg-black rounded"
                        />

                        <button
                            onClick={() => captureImage(camera)}
                            className="mt-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Capture Image
                        </button>

                    </div>

                ))}

            </div>

            {/* Captured Images */}

            {capturedImages.length > 0 && (

                <div className="mt-8">

                    <h2 className="text-xl font-bold mb-4">
                        Captured Images
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                        {capturedImages.map(image => (

                            <div
                                key={image.id}
                                className="border rounded-lg p-3"
                            >

                                <img
                                    src={image.image}
                                    alt={image.cameraName}
                                    className="w-full rounded"
                                />

                                <p className="font-semibold mt-2">
                                    {image.cameraName}
                                </p>

                                <p className="text-sm text-gray-500">
                                    {image.capturedAt}
                                </p>

                            </div>

                        ))}

                    </div>

                </div>

            )}

        </div>
    );
}

export default CaptureImage;