
import { Routes, Route } from "react-router-dom";
import Layout from "./Components/Layout";
import GateActivate from "./page/GateActivate";
import Login from "./page/Auth/Login";
import Mainpage from "./content/Mainpage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route  element={<Layout />}>
        <Route path="/dashboard" element={<GateActivate />} />
         <Route path="/main" element={<Mainpage />} />
      </Route>
    </Routes>
  );
}