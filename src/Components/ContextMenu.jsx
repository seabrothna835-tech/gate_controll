
import { useEffect } from "react";
const ContextMenu = ({
    visible,
    x,
    y,
    row,
    items = [],
    isDark = false,
    onClose = () => { },
}) => {
    useEffect(() => {
        if (!visible) return;
        const handleClick = () => {
            onClose();
        };
        const handleEscape = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };
        document.addEventListener("click", handleClick);
        document.addEventListener("keydown", handleEscape);
        return () => {
            document.removeEventListener("click", handleClick);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [visible, onClose]);

    if (!visible || items.length === 0) return null;

    return (
        <div
            className={`absolute context-menu  ${isDark
                    ? "bg-blue-950 text-white border border-[#1A1A1A]"
                    : "bg-white border border-gray-300 text-gray-800"
                } rounded-lg shadow-lg border w-52 z-50 `}
            style={{ left: x, top: y-[-18] }}
            onClick={(event) => event.stopPropagation()}
        >
            {items.map((item) => (
                <button
                    key={item.key}
                    className={`flex gap-2 items-center w-full px-3 py-2 ${isDark ? "hover:bg-blue-800" : "hover:bg-gray-200"} rounded-lg ${item.className || ""
                        }`}
                    onClick={() => {
                        item.onClick?.(row);
                        onClose();
                    }}
                >
                    {item.icon && (
                        <span>{item.icon}</span>
                    )}
                    {item.label}
                </button>
            ))}
        </div>
    );
};

export default ContextMenu;