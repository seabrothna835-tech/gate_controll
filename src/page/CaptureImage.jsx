import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

function CaptureImage() {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [status, setStatus] = useState("Connecting to CCTV...");
    const [imageDataUrl, setImageDataUrl] = useState(null);

    useEffect(() => {
        const video = videoRef.current;
        const url = "/live/cctv2/index.m3u8";
        // const url2 = "/live/cctv1/index.m3u8";
        // const url3 = "/live/cctv3/index.m3u8";
        // const url = process.env.CAMERA1_URL || "/live/cctv2/index.m3u8";
        if (!video) return;

        let hls;

        if (Hls.isSupported()) {
            hls = new Hls();

            hls.loadSource(url);
            hls.attachMedia(video);

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                setStatus("CCTV connected");
                video.play().catch(console.error);
            });

            hls.on(Hls.Events.ERROR, (_, data) => {
                console.error("HLS error:", data);

                if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
                    setStatus("Network error: Check CCTV access and CORS.");
                } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
                    setStatus("Media error: Unable to play CCTV.");
                } else if (data.fatal) {
                    setStatus("Unable to access CCTV stream.");
                }
            });
        } else if (video.canPlayType("CaptureImagelication/vnd.CaptureImagele.mpegurl")) {
            video.src = url;
            setStatus("Trying native HLS playback");

            video.addEventListener("error", () => {
                setStatus("Unable to play CCTV stream.");
            });
        } else {
            setStatus("Your browser does not support HLS.");
        }

        return () => {
            hls?.destroy();
        };
    }, []);
    const captureImage = () => {
        const video = videoRef.current;
        if (!video) return;

        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageDataUrl = canvas.toDataURL("image/png");
        setImageDataUrl(imageDataUrl);
        console.log("Image : ", imageDataUrl)
    };

    return (
        <div style={{ padding: 20 }}>
            <h2>PPAP Live CCTV</h2>

            <p>{status}</p>

            <video
                ref={videoRef}
                controls
                autoPlay
                muted
                playsInline
                style={{ width: "100%", maxWidth: 900 }}
            />

            <div className="mt-4 justify-center flex">
                <button onClick={captureImage} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Capture image
                </button>
                {/* <canvas ref={canvasRef} className="">{imageDataUrl && <img src={imageDataUrl} alt="Captured" />}</canvas> */}
            </div>
            {imageDataUrl && (
                <div className="mt-4">
                    <h3>Captured Image:</h3>
                    <img src={imageDataUrl} alt="Captured" className="border" />
                </div>
            )}
        </div>
    );
}

// const videoRef = useRef(null);
    // const [capturedImages, setCapturedImages] = useState([]);

    // useEffect(() => {
    //     const handleCapture = (event) => {
    //         if (event.data?.type !== "captured-frame") return;

    //         const camera = cameras.find((item) => {
    //             const iframe = document.querySelector(`iframe[data-camera-id="${item.id}"]`);
    //             return iframe?.contentWindow === event.source;
    //         });

    //         if (!camera || typeof event.data.image !== "string") return;

    //         setCapturedImages((previous) => [...previous, { cameraId: camera.id, imageUrl: event.data.image }]);
    //     };

    //     window.addEventListener("message", handleCapture);
    //     return () => window.removeEventListener("message", handleCapture);
    // }, []);

    // const captureImage = () => {
    //     const video = videoRef.current;

    //     if (!video || video.videoWidth === 0 || video.videoHeight === 0) {
    //         alert("Video is not ready!");
    //         return;
    //     }
    //     const canvas = document.createElement("canvas");
    //     canvas.width = video.videoWidth;
    //     canvas.height = video.videoHeight;
    //     const ctx = canvas.getContext("2d");
    //     ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    //     const imageDataUrl = canvas.toDataURL("image/png");
    //     // Store multiple images
    //     setCapturedImages((prevImages) => [...prevImages, imageDataUrl]);
    // };

export default CaptureImage;