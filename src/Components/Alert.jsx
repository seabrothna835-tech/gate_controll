import React from "react";
import { IoWarningOutline } from "react-icons/io5";
import { LiaStopCircleSolid } from "react-icons/lia";
import { SiTicktick } from "react-icons/si";

function Alert({ message, type }) {
    const getAlertClass = () => {
        switch (type) {
        case "success":
            return {
            icon: <SiTicktick className="text-xl" />,
            title: "Success",
            style:
                "bg-green-50/95 border-r-4 border-l-4 border-green-300 text-green-800 shadow-green-200/60",
            iconStyle: "bg-green-100 text-green-600",
            };

        case "error":
            return {
            icon: <LiaStopCircleSolid className="text-2xl" />,
            title: "Error",
            style:
                "bg-red-50/95 border-l-4 border-red-300 text-red-800 shadow-red-200/60",
            iconStyle: "bg-red-100 text-red-600",
            };

        case "warning":
            return {
            icon: <IoWarningOutline className="text-2xl" />,
            title: "Warning",
            style:
                "bg-yellow-50/95 border-l-4 border-yellow-300 text-yellow-800 shadow-yellow-200/60",
            iconStyle: "bg-yellow-100 text-yellow-600",
            };

        default:
            return {
            icon: <IoWarningOutline className="text-2xl" />,
            title: "Information",
            style:
                "bg-blue-50/95 border-l-4 border-blue-300 text-blue-800 shadow-blue-200/60",
            iconStyle: "bg-blue-100 text-blue-600",
            };
        }
    };
    const alert = getAlertClass();
    return (
        <div
        className={`
            fixed
            top-16
            right-5
            z-50
            w-1/6
            min-w-70
            flex
            gap-3
            px-4
            py-2
            rounded-xl
            border
            backdrop-blur-md
            shadow-xl
            items-center
            ${alert.style}
            alert-slide
        `}
        >
        {/* Icon */}
        <div
            className={`
            flex
            items-center
            justify-center
            w-9
            h-9
            shrink-0
            rounded-full
            ${alert.iconStyle}
            `}
        >
            {alert.icon}
        </div>

        {/* Message */}
        <div className="flex-1 min-w-0">
            <p className="text-sm mt-0.5 wrap-break-word opacity-90">
            {message}
            </p>
        </div>

        {/* Close button */}
        {/* {onClose && (
            <button
            onClick={onClose}
            className="
                shrink-0
                p-1
                rounded-md
                opacity-60
                hover:opacity-100
                hover:bg-black/5
                transition
            "
            >
            <IoClose className="text-lg" />
            </button>
        )} */}
        </div>
    );
}

export default Alert;