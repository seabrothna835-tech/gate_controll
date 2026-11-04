import { Link } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import logo from "../assets/ppap-header-logo.png";
import { useState, useEffect } from "react";
import { IoMdClock } from "react-icons/io";
import { MdDarkMode } from "react-icons/md";
import { MdLightMode } from "react-icons/md";
import { initKeycloak, keycloak } from "../keyCloak";

function Header({ isActiveLightMode, setIsActiveLightMode }) {
    const [currentDateTime, setCurrentDateTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);
    const khmerDays = [
        "អាទិត្យ",
        "ចន្ទ",
        "អង្គារ",
        "ពុធ",
        "ព្រហស្បតិ៍",
        "សុក្រ",
        "សៅរ៍",
    ];

    const khmerMonths = [
        "មករា",
        "កុម្ភៈ",
        "មីនា",
        "មេសា",
        "ឧសភា",
        "មិថុនា",
        "កក្កដា",
        "សីហា",
        "កញ្ញា",
        "តុលា",
        "វិច្ឆិកា",
        "ធ្នូ",
    ];

    // Get Cambodia's date parts
    const parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Phnom_Penh",
        weekday: "long",
        day: "numeric",
        month: "numeric",
        year: "numeric",
    }).formatToParts(currentDateTime);

    const getPart = (type) =>
        parts.find((part) => part.type === type)?.value;

    const weekdayIndex = new Date(
        currentDateTime.toLocaleString("en-US", {
            timeZone: "Asia/Phnom_Penh",
        })
    ).getDay();

    const day = getPart("day");
    const month = Number(getPart("month"));
    const year = getPart("year");

    const date = `ថ្ងៃ${khmerDays[weekdayIndex]} ទី${day} ខែ${khmerMonths[month - 1]} ឆ្នាំ${year}`;
    const time = currentDateTime.toLocaleTimeString("km-KH", {
        timeZone: "Asia/Phnom_Penh",
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
    }).replace("AM", "ព្រឹក").replace("PM", "ល្ងាច");

    const handleLogout = async () => {
        sessionStorage.removeItem("gate");
        sessionStorage.removeItem("lane");

        await initKeycloak(); // no-op if already initialised
        keycloak.logout({ redirectUri: `${window.location.origin}/` });
    };

    return (
        <header className="app-header border-b">
            <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
                <Link to="/dashboard" className="flex min-w-0 items-center gap-3" aria-label="PPAP camera dashboard">
                    <img src={logo} alt="PPAP" className="h-11 w-auto max-w-33 object-contain sm:h-12" />
                    <span className="header-divider hidden h-10 w-px sm:block" />
                    <span className="min-w-0">
                        <span className="header-title block truncate text-sm font-moul sm:text-base">ប្រព័ន្ធត្រួតពិនិត្យច្រកចូល</span>
                        <span className="header-subtitle block truncate text-xs">ត្រួតពិនិត្យនិងអនុញ្ញាតរថយន្ត</span>
                    </span>
                </Link>

                <div className="flex items-center gap-3 sm:gap-5">
                    <div className="flex items-center gap-2 rounded-full border border-[#cce9dc] bg-[#f1faf5] px-3 py-2 text-xs font-semibold tracking-wide text-[#26714d]">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-700 opacity-40" />
                            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-700" />
                        </span>
                        <span className="hidden sm:inline">SYSTEM ONLINE</span>
                        <span className="sm:hidden">ONLINE</span>
                    </div>

                    <div className="flex items-center gap-2 border-l h-full pl-3 text-xs sm:pl-5">
                        {/* Group Toggle */}
                        <div role="group" aria-label="Theme" className="theme-switch relative flex items-center rounded-full p-1">
                            {/* Animated Background */}
                            <div
                                className={`theme-switch-thumb absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full
                                        transition-all duration-500 ease-in-out
                                        ${isActiveLightMode
                                        ? "left-1"
                                        : "left-[calc(50%+0px)]"
                                    }`}
                            />

                            {/* Day Button */}
                            <button
                                type="button"
                                onClick={() => setIsActiveLightMode(true)}
                                aria-pressed={isActiveLightMode}
                                aria-label="Light mode"
                                className={`relative z-10 flex items-center justify-center gap-1 rounded-full px-4 py-2
                                        transition-all duration-300
                                        ${isActiveLightMode
                                        ? "text-amber-500"
                                        : "text-gray-600 hover:text-amber-500"
                                    }`}
                            >
                                <MdLightMode
                                    className={`text-base transition-transform duration-500 ${isActiveLightMode ? "rotate-180 scale-110" : ""
                                        }`}
                                />
                                <span>ថ្ងៃ</span>
                            </button>

                            {/* Night Button */}
                            <button
                                type="button"
                                onClick={() => setIsActiveLightMode(false)}
                                aria-pressed={!isActiveLightMode}
                                aria-label="Dark mode"
                                className={`relative z-10 flex items-center justify-center gap-1 rounded-full px-4 py-2
                                        transition-all duration-300
                                        ${!isActiveLightMode
                                        ? "text-indigo-500"
                                        : "text-gray-500 hover:text-indigo-500"
                                    }`}
                            >
                                <MdDarkMode
                                    className={`text-base transition-transform duration-500 ${!isActiveLightMode                                     ? "text-cyan-500 scale-110" : ""
                                        }`}
                                />
                                <span>យប់</span>
                            </button>
                        </div>
                    </div>

                    <div className="header-clock hidden items-center gap-2 border-l pl-5 text-xs md:flex">
                        <h2 className="text-3xl"><IoMdClock /></h2>
                        <div>
                            <p className="header-clock-time text-lg font-bold">{time}</p>
                            <p className="header-clock-date">{date}</p>
                        </div>
                    </div>

                    <div className="header-actions flex gap-2 border-l pl-3 sm:pl-5">
                        <div className="rounded-lg">
                            <button
                                type="button"
                                onClick={handleLogout}
                                aria-label="ចាកចេញ"
                                title="ចាកចេញ"
                                className="header-logout flex h-10 w-10 items-center justify-center rounded-lg border transition focus-visible:outline-2 focus-visible:outline-offset-2"
                            >
                                <FiLogOut size={18} aria-hidden="true" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="h-1 bg-cyan-700" />
        </header>
    );
}
export default Header;