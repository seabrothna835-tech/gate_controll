import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

function Layout() {
    const [activeMode, setActiveMode] = useState(
        () => localStorage.getItem("activeMode") === "true"
    );

    useEffect(() => {
        localStorage.setItem("activeMode", activeMode);
    }, [activeMode]);

    return (
        <div
            data-mode={activeMode ? "light" : "dark"}
            className={`flex min-h-screen flex-col font-hanuman transition-colors duration-200 ${
                activeMode
                    ? "bg-lightModeBg text-lightModeTitle"
                    : "bg-darkModeBg text-darkModeContent"
            }`}
        >
            <Header
                isActiveLightMode={activeMode}
                setIsActiveLightMode={setActiveMode}
            />
            <div className="flex flex-1 items-stretch">
                {/* <Sidebar isActiveLightMode={activeMode} /> */}
                <div className="min-w-0 flex-1">
                    <Outlet context={{ activeMode }} />
                </div>
            </div>
        </div>
    );
}

export default Layout;