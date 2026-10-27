
import { Routes, Route } from "react-router-dom";
import Layout from "./Components/Layout";
import GateActivate from "./page/GateActivate";
import Login from "./page/Auth/Login";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<GateActivate />} />
      </Route>
    </Routes>
  );
}