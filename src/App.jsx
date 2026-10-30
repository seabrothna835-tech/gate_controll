
import { Routes, Route } from "react-router-dom";
import Layout from "./Components/Layout";
import GateActivate from "./page/GateActivate";
import Login from "./page/Auth/Login";
import Sidebar from "./sidebar/Sidebar";
import Content from "./maindashboard/content";





export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route  element={<Layout />}>
      {/* <Route path="/dashboard" element={<GateActivate />} /> */}
        <Route path="/main" element={<Content />} />
        <Route path="/dashboard" element={<GateActivate />} />
         <Route path="/sidebar" element={<Sidebar />} />
      </Route>
    </Routes>
  );
}