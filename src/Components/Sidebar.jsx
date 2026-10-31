import { useLocation, useNavigate } from "react-router-dom";
import { BiLogoMicrosoft, BiLineChart, BiLogoCodepen } from "react-icons/bi";
import { HiMiniArrowRightEndOnRectangle, HiMiniArrowLeftOnRectangle } from "react-icons/hi2";
import { CiPalette } from "react-icons/ci";
import { FiBox, FiLogOut } from "react-icons/fi";
import { initKeycloak, keycloak } from "../keyCloak";

const navigationItems = [
  { key: "dashboard", label: "Dashboard", icon: BiLogoMicrosoft, path: "/dashboard" },
  { key: "gate_in", label: "Gate In", icon: HiMiniArrowRightEndOnRectangle },
  { key: "gate_out", label: "Gate Out", icon: HiMiniArrowLeftOnRectangle},
  { key: "information", label: "Information", icon: BiLineChart },
  { key: "list_gate", label: "List Gate", icon: BiLogoCodepen},
  { key: "newgate", label: "New Gate", icon: CiPalette},
];

const utilityItems = [
  { key: "setting", label: "Settings", icon: FiBox, disabled: true },
  { key: "logout", label: "Logout", icon: FiLogOut },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = async () => {
    sessionStorage.removeItem("gate");
    sessionStorage.removeItem("lane");

    await initKeycloak();
    keycloak.logout({ redirectUri: `${window.location.origin}/` });
  };

  return (
    <aside aria-label="Main sidebar" className="flex w-64 shrink-0 flex-col justify-between border-r border-slate-200 bg-white p-4 text-slate-800">
      <nav className="mt-2 space-y-2">
        {navigationItems.map(({ key, label, icon: Icon, path, disabled }) => {
          const isActive = pathname === path;

          return (
            <button
              key={key}
              type="button"
              disabled={disabled}
              aria-current={isActive ? "page" : undefined}
              onClick={path ? () => navigate(path) : undefined}
              className={`flex w-full items-center space-x-3 rounded-lg px-4 py-2.5 text-left font-hanuman transition ${
                isActive
                  ? "bg-sky-100 text-sky-800"
                  : disabled
                    ? "cursor-not-allowed text-slate-400"
                    : "hover:bg-slate-100 hover:text-sky-800"
              }`}
            >
              <Icon className={`h-8 w-8 rounded-lg p-2 ${
                isActive ? "bg-sky-700 text-white" : "bg-slate-100 text-slate-600"
              }`} />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>

      <div className="space-y-2 border-t border-slate-200 pt-4">
        {utilityItems.map(({ key, label, icon: Icon, disabled }) => (
          <button
            key={key}
            type="button"
            disabled={disabled}
            onClick={key === "logout" ? handleLogout : undefined}
            className={`flex w-full items-center space-x-3 rounded-lg px-4 py-2.5 text-left font-hanuman transition ${
              disabled
                ? "cursor-not-allowed text-slate-400"
                : "text-slate-700 hover:bg-slate-100 hover:text-sky-800"
            }`}
          >
            <Icon className="h-8 w-8 rounded-lg bg-slate-100 p-2 text-slate-600" />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
