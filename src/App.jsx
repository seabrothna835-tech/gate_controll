
import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";
import Layout from "./Components/Layout";
import GateActivate from "./page/GateActivate";
import Login from "./page/Auth/Login";
import ListGateCall from "./page/ListGateCall";
import ViewDetailGateCall from "./page/ViewDetailGateCall";
import ProtectRoute from "./utils/ProtectRoute";
import CaptureImage from "./page/CaptureImage";
import FormLog from "./page/FormLog";

function GatePage() {
  const isGateInActive = useSelector(
    (state) => state.activate.gateIn || state.activate.gateOut
  );
  const [activationStatus, setActivationStatus] = useState("");

  return (
    <>
      <ListGateCall />
      {isGateInActive && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed left-[-10000px] top-0 w-[1600px] opacity-0"
        >
          <GateActivate onStatusChange={setActivationStatus} />
        </div>
      )}
      {activationStatus && (
        <p
          role="status"
          aria-live="polite"
          className="fixed bottom-4 right-4 z-50 rounded-lg bg-darkModeBg px-4 py-3 text-sm text-darkModeContent shadow-lg"
        >
          {activationStatus}
        </p>
      )}
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route  element={<ProtectRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<GateActivate />} />
          <Route path="/gate" element={<GatePage />} />
          <Route path="/gate-call/:gateCallId" element={<ViewDetailGateCall />} />
          <Route path="testCapture" element={<CaptureImage />}/>
          <Route path="log" element={<FormLog />}/>
        </Route>
      </Route>
    </Routes>
  );
}