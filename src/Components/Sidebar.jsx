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
  { key: "logout", label: "Logout", icon: FiLogOut, disabled: true },
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
    <aside aria-label="Main sidebar" className="app-sidebar flex w-64 shrink-0 flex-col justify-between border-r p-4">
      <nav className="mt-2 space-y-2">
        {navigationItems.map(({ key, label, icon: Icon, path, disabled }) => {
          const isActive = pathname === path;

          return (
            <button
              key={key}
              type="button"
              disabled={disabled}
              aria-label={label}
              title={label}
              aria-current={isActive ? "page" : undefined}
              onClick={path ? () => navigate(path) : undefined}
              className={`flex w-full items-center space-x-3 rounded-lg px-4 py-2.5 text-left font-hanuman transition ${
                isActive
                  ? "sidebar-item-active"
                  : disabled
                    ? "cursor-not-allowed opacity-50"
                    : "sidebar-item"
              }`}
            >
              <Icon className={`h-8 w-8 rounded-lg p-2 ${
                isActive ? "sidebar-icon-active" : "sidebar-icon"
              }`} />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-utilities space-y-2 border-t pt-4">
        {utilityItems.map(({ key, label, icon: Icon, disabled }) => (
          <button
            key={key}
            type="button"
            disabled={disabled}
            aria-label={label}
            title={label}
            onClick={key === "logout" ? handleLogout : undefined}
            className={`flex w-full items-center space-x-3 rounded-lg px-4 py-2.5 text-left font-hanuman transition ${
              disabled
                ? "cursor-not-allowed opacity-50"
                : "sidebar-item"
            }`}
          >
            <Icon className="sidebar-icon h-8 w-8 rounded-lg p-2" />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
