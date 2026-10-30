import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";

function Layout() {
    const [activeMode, setActiveMode] = useState(
        () => localStorage.getItem("activeMode") !== "false"
    );

    useEffect(() => {
        localStorage.setItem("activeMode", String(activeMode));
    }, [activeMode]);

    return (
        <div className="min-h-screen bg-white">
            <Header activeMode={activeMode} setActiveMode={setActiveMode} />
            <Outlet context={{ activeMode }} />
        </div>
    );
}

export default Layout;