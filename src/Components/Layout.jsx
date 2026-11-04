import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

function Layout() {
    const [activeMode, setActiveMode] = useState(
        () => localStorage.getItem("activeMode") !== "false"
    );

    useEffect(() => {
        localStorage.setItem("activeMode", String(activeMode));
    }, [activeMode]);

    return (
        <div data-mode={activeMode ? "light" : "dark"} className="app-shell flex min-h-screen flex-col">
            <Header
                isActiveLightMode={activeMode}
                setIsActiveLightMode={setActiveMode}
            />
            <div className="flex flex-1 items-stretch">
                <Sidebar />
                <div className="min-w-0 flex-1">
                    <Outlet context={{ activeMode }} />
                </div>
            </div>
        </div>
    );
}

export default Layout;