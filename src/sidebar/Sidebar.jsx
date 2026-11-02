import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BiLogoMicrosoft, BiLineChart, BiLogoCodepen } from "react-icons/bi";
import { HiMiniArrowRightEndOnRectangle, HiMiniArrowLeftOnRectangle } from "react-icons/hi2";
import { CiPalette } from "react-icons/ci";
import { FiBox, FiInbox } from "react-icons/fi";

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();
 
  const menuItems = [
    { key: "dashboard",
      label: "Dashboard", 
      path: "/main", 
      icon: <BiLogoMicrosoft 
      className="text-blue-900 rounded-xl h-8 w-8 bg-slate-300 p-2" /> 
    },

    { key: "gate_in", 
      label: "Gate In", 
      icon: <HiMiniArrowRightEndOnRectangle 
      className="text-blue-900 rounded-xl h-8 w-8 bg-slate-300 p-2" /> 
    },

    { key: "gate_out",
      label: "Gate Out", 
      icon: <HiMiniArrowLeftOnRectangle 
      className="text-blue-900 rounded-xl h-8 w-8 bg-slate-300 p-2" /> 
    },

    { key: "information", 
      label: "Information", 
      icon: <BiLineChart 
      className="text-blue-900 rounded-xl h-8 w-8 bg-slate-300 p-2" /> 
    },

    { key: "list_gate", 
      label: "List Gate", 
      icon: <BiLogoCodepen 
      className="text-blue-900 rounded-xl h-8 w-8 bg-slate-300 p-2" /> 
    },

    { key: "newgate", 
      label: "New Gate", 
      icon: <CiPalette 
      className="text-blue-900 rounded-xl h-8 w-8 bg-slate-300 p-2" /> 
    },
  ];

  
  const bottomMenuItems = [
    { key: "setting", 
      label: "Settings", 
      icon: <FiBox 
      className="text-blue-900 rounded-xl h-8 w-8 bg-slate-300 p-2" /> 
    },

    { key: "logout", 
      label: "Logout", 
      icon: <FiInbox 
      className="text-blue-900 rounded-xl h-8 w-8 bg-slate-300 p-2" /> 
    },
  ];

  const handleNavigation = (tabKey) => {
    setActiveTab(tabKey);
    // if (routePath) {
    //   navigate(routePath);
    // }
  };

  return (
    <div className="flex min-h-screen overflow-hidden">
      <aside className="w-64 bg-white text-blue-950 flex flex-col justify-between p-4 h-screen sticky top-0">
        <div>
          <nav className="mt-2 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.key}
                onClick={() => handleNavigation(item.key)}
                className={`w-full flex font-hanuman items-center space-x-3 px-4 py-2.5 rounded-lg transition ${
                  activeTab === item.key ? "bg-sky-600 text-blue-900" : "hover:bg-blue-300 hover:text-blue-900"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="border-t border-sky-400 pt-4 space-y-2">
          {/* Loop មើល Bottom Menu Items */}
          {bottomMenuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => handleNavigation(item.key)}
              className={`w-full flex font-hanuman items-center space-x-3 px-4 py-2.5 rounded-lg transition ${
                activeTab === item.key ? "bg-sky-600 text-blue-900" : "hover:bg-blue-300 hover:text-blue-900"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </aside>
    </div>
  );
}

export default Sidebar;