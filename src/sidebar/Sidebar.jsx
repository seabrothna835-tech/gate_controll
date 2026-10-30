import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BiLogoMicrosoft, BiLineChart, BiLogoCodepen } from "react-icons/bi";
import { HiMiniArrowRightEndOnRectangle, HiMiniArrowLeftOnRectangle } from "react-icons/hi2";
import { CiPalette } from "react-icons/ci";
import { FiBox, FiInbox } from "react-icons/fi";

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState("main");
  const navigate = useNavigate();

  const handleNavigation = (tabKey, routePath) => {
    setActiveTab(tabKey);
    if (routePath) {
      navigate(routePath);
    }
  };

  return (
    <div className="flex min-h-screen overflow-hidden">
      <aside className="w-64 bg-white text-blue-950 flex flex-col justify-between p-4 h-screen sticky top-0">
        <div>
          <nav className="mt-2 space-y-2">
            <button
              onClick={() => handleNavigation("dashboard", "/main")}
              className={`w-full flex font-hanuman items-center space-x-3 px-4 py-2.5 rounded-lg transition ${
                activeTab === "dashboard" ? "bg-sky-600 text-blue-900" : "hover:bg-blue-300 hover:text-blue-900"
              }`}
            >
              <BiLogoMicrosoft className="text-blue-900 rounded-xl h-8 w-8 bg-gray-400 p-2" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => handleNavigation("gate_in")}
              className={`w-full flex font-hanuman items-center space-x-3 px-4 py-2.5 rounded-lg transition ${
                activeTab === "gate_in" ? "bg-sky-600 text-blue-900" : "hover:bg-blue-300 hover:text-blue-900"
              }`}
            >
              <HiMiniArrowRightEndOnRectangle className="text-blue-900 rounded-xl h-8 w-8 bg-gray-400 p-2" />
              <span>Gate In</span>
            </button>

            <button
              onClick={() => handleNavigation("gate_out")}
              className={`w-full flex font-hanuman items-center space-x-3 px-4 py-2.5 rounded-lg transition ${
                activeTab === "gate_out" ? "bg-sky-600 text-blue-900" : "hover:bg-blue-300 hover:text-blue-900"
              }`}
            >
              <HiMiniArrowLeftOnRectangle className="text-blue-900 rounded-xl h-8 w-8 bg-gray-400 p-2" />
              <span>Gate Out</span>
            </button>

            <button
              onClick={() => handleNavigation("information")}
              className={`w-full flex font-hanuman items-center space-x-3 px-4 py-2.5 rounded-lg transition ${
                activeTab === "information" ? "bg-sky-600 text-blue-900" : "hover:bg-blue-300 hover:text-blue-900"
              }`}
            >
              <BiLineChart className="text-blue-900 rounded-xl h-8 w-8 bg-gray-400 p-2" />
              <span>Information</span>
            </button>

            <button
              onClick={() => handleNavigation("list_gate")}
              className={`w-full flex font-hanuman items-center space-x-3 px-4 py-2.5 rounded-lg transition ${
                activeTab === "list_gate" ? "bg-sky-600 text-blue-900" : "hover:bg-blue-300 hover:text-blue-900"
              }`}
            >
              <BiLogoCodepen className="text-blue-900 rounded-xl h-8 w-8 bg-gray-400 p-2" />
              <span>List Gate</span>
            </button>

            <button
              onClick={() => handleNavigation("newgate")}
              className={`w-full flex font-hanuman items-center space-x-3 px-4 py-2.5 rounded-lg transition ${
                activeTab === "newgate" ? "bg-sky-600 text-blue-900" : "hover:bg-blue-300 hover:text-blue-900"
              }`}
            >
              <CiPalette className="text-blue-900 rounded-xl h-8 w-8 bg-gray-400 p-2" />
              <span>New Gate</span>
            </button>
          </nav>
        </div>

        <div className="border-t border-sky-400 pt-4 space-y-2">
          <button
            onClick={() => handleNavigation("setting")}
            className={`w-full flex font-hanuman items-center space-x-3 px-4 py-2.5 rounded-lg transition ${
              activeTab === "setting" ? "bg-sky-600 text-blue-900" : "hover:bg-blue-300 hover:text-blue-900"
            }`}
          >
            <FiBox className="text-blue-900 rounded-xl h-8 w-8 bg-gray-400 p-2" />
            <span>Settings</span>
          </button>

          <button
            onClick={() => handleNavigation("logout")}
            className={`w-full flex font-hanuman items-center space-x-3 px-4 py-2.5 rounded-lg transition ${
              activeTab === "logout" ? "bg-sky-600 text-blue-900" : "hover:bg-blue-300 hover:text-blue-900"
            }`}
          >
            <FiInbox className="text-blue-900 rounded-xl h-8 w-8 bg-gray-400 p-2" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;