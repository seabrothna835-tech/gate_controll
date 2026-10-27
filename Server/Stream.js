import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import ffmpegPath from "ffmpeg-static";
import Stream from "node-rtsp-stream";

if (ffmpegPath) {
    process.env.PATH = `${path.dirname(ffmpegPath)}${path.delimiter}${process.env.PATH || ""}`;
    console.log("Using ffmpeg binary:", ffmpegPath);
}

const envFilePath = path.resolve(process.cwd(), "Server/.env");
const envConfig = {};

if (fs.existsSync(envFilePath)) {
    for (const line of fs.readFileSync(envFilePath, "utf8").split(/\r?\n/)) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;

        const separatorIndex = trimmed.indexOf("=");
        if (separatorIndex === -1) continue;

        const key = trimmed.slice(0, separatorIndex).trim();
        const value = trimmed
            .slice(separatorIndex + 1)
            .trim()
            .replace(/^['"]|['"]$/g, "");

        envConfig[key] = value;
    }
}

const defaultCameraUrl =
    "rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov";
const cameraUrl = envConfig.CAMERA1_URL || defaultCameraUrl;
process.env.CAMERA1_URL = cameraUrl;

if (!envConfig.CAMERA1_URL) {
    console.warn(
        "CAMERA1_URL is not set. Using the public demo RTSP stream. Add your real URL in Server/.env to use your camera."
    );
}

const wsPort = 9999;
const httpPort = 8889;

const stream = new Stream({
    name: "gate1",
    streamUrl: cameraUrl,
    wsPort,
});

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Gate 1 Camera</title>
    <style>
      html, body {
        margin: 0;
        background: #000;
        display: grid;
        place-items: center;
        height: 100%;
        font-family: Arial, sans-serif;
      }
      canvas {
        width: 100vw;
        height: 100vh;
        display: block;
        background: #000;
      }
    </style>
  </head>
  <body>
    <canvas id="video"></canvas>
    <script src="https://cdn.jsdelivr.net/npm/jsmpeg@1.0.0/jsmpeg.min.js"></script>
    <script>
      const canvas = document.getElementById('video');
      const player = new JSMpeg.Player('ws://localhost:${wsPort}', {
        canvas,
        autoplay: true,
        audio: false,
      });
      const parentOrigin = document.referrer ? new URL(document.referrer).origin : null;
      window.addEventListener('message', (event) => {
        if (event.data?.type !== 'capture-frame' || event.origin !== parentOrigin) return;
        event.source?.postMessage({ type: 'captured-frame', image: canvas.toDataURL('image/png') }, event.origin);
      });
      window.onbeforeunload = () => player.destroy();
    </script>
  </body>
</html>`;

const server = http.createServer((req, res) => {
    const pathname = new URL(req.url || "/", "http://localhost").pathname;

    if (pathname === "/gate1/" || pathname === "/gate1" || pathname === "/gate2/" || pathname === "/gate2") {
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(html);
        return;
    }

    if (pathname === "/health") {
        res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify({ ok: true, streams: ["gate1", "gate2"] }));
        return;
    }

    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
});

server.listen(httpPort, "0.0.0.0", () => {
    console.log(`Browser stream page is ready: http://localhost:${httpPort}/gate1/`);
});

stream.on("error", (error) => {
    console.error("RTSP stream error:", error?.message || error);
});

stream.on("exit", (code) => {
    console.warn("RTSP stream process exited with code:", code);
});