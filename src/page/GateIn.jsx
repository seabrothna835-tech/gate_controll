import React, { useEffect, useState } from 'react'
import { PiTruckFill } from "react-icons/pi";
import { useOutletContext } from "react-router-dom";
import ContextMenu from '../Components/ContextMenu';
import { FaRegEye } from "react-icons/fa";
import { IoMdLogIn } from "react-icons/io";
import { IoMdLogOut } from "react-icons/io";
import { BiSolidDetail } from "react-icons/bi";

function GateIn() {
    const url_vite = import.meta.env.VITE_API_URL;
    const { activeMode } = useOutletContext();
    const isActiveLightMode = activeMode;
    const mutedText = isActiveLightMode ? "text-lightModeSubTitle" : "text-darkModeSubTitle";
    const fieldStyle = `min-w-0 rounded-lg border px-3 py-2 text-sm placeholder:opacity-70 focus:outline-none focus:ring-2 focus:ring-blue-600 ${isActiveLightMode
        ? "border-lightBorder bg-lightModeBg text-lightModeTitle"
        : "border-darkBorder bg-darkModeBg text-darkModeContent"
        }`;
    const [dataTruck, setDataTruck] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState("");
    const truckColumns = [
        { name: "Gate Call ID", accessor: "gatecallid" },
        { name: "Truck Number", accessor: "licence_plate" },
        { name: "Truck Company", accessor: "truck_company" },
        { name: "Driver Name", accessor: "driver_name" },
        { name: "Driver ID", accessor: "driver_id" },
        { name: "Gate Status", accessor: "gatecall_status" },
        { name: "Pickup / Dropoff", accessor: "dropoff_or_pickup" },
        { name: "Terminal", accessor: "terminal" },
        { name: "Gate In Time", accessor: "gatein_time" }
    ];
    const [contextMenu, setContextMenu] = useState({
        visible: false,
        x: 0,
        y: 0,
        row: null,
    });
    const handleContextMenu = (event, row) => {
        event.preventDefault();

        setContextMenu({
            visible: true,
            x: event.clientX,
            y: event.clientY,
            row: row,
        });
    };
    const contextMenuItems = [
        {
            key: "view",
            label: "មើលព័ត៌មានលម្អិត",
            icon: <FaRegEye />,
            className: "text-green-400",
            onClick: (row) => {
                console.log("View:", row);
            },
        },
        {
            key: "gate-in",
            label: "អនុញ្ញាតចូល",
            icon: <IoMdLogIn />,
            className: "text-blue-400",
            onClick: (row) => {
                console.log("Allow Entry:", row);
            },
        },
        {
            key: "gate-out",
            label: "អនុញ្ញាតចេញ",
            icon: <IoMdLogOut />,
            className: "text-red-400",
            onClick: (row) => {
                console.log("Gate Out:", row);
            },
        },
    ];
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${url_vite}/api/gate`, {
                    Method: "GET",
                    contentType: "application/json",
                });
                if (!response.ok) {
                    throw new Error(`Failed to fetch gate information (${response.status})`);
                }

                const data = await response.json();
                if (!Array.isArray(data?.gateInfoData)) {
                    throw new Error("Invalid gate response: expected gateInfoData to be an array.");
                }

                setDataTruck(data.gateInfoData);
                setLoadError("");
            } catch (error) {
                if (error.name !== "AbortError") {
                    console.error("Error fetching gate call data:", error);
                    setLoadError(error instanceof Error ? error.message : "Unable to load gate information.");
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [url_vite]);

    return (
        <main className={`min-h-full p-2 font-hanuman sm:p-2 lg:p-4 ${isActiveLightMode ? "text-lightModeTitle" : "text-darkModeContent"}`}>
            <section className={`grid grid-cols-1 items-center gap-4 rounded-2xl border p-4 shadow-sm sm:p-6 lg:grid-cols-2 ${isActiveLightMode ? "border-gray-300 bg-gray-100" : "border-darkBorder bg-darkModeBg"
                }`}>
                <div className="flex items-center gap-2">
                    <BiSolidDetail className="rounded-xl bg-blue-800 p-2 text-4xl text-white" />
                    <div>
                        <h1 className="text-lg font-bold">រថយន្ត​​ និងកុងតឺន័រ</h1>
                        <p className={`text-sm ${mutedText}`}>ស្វែងរកព័ត៌មានរថយន្ត និងកុងតឺន័រ</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    <input
                        type="text"
                        placeholder="បញ្ចូលលេខរថយន្ត"
                        className={fieldStyle}
                    />
                    <input type="text"
                        placeholder="បញ្ចូលលេខកុងតឺន័រ"
                        className={fieldStyle}
                    />
                    <div className="flex items-center gap-2">
                        <button className="rounded-lg bg-blue-800 px-4 py-2 text-sm text-white shadow-sm transition-colors hover:bg-blue-700">
                            ស្វែងរក
                        </button>
                        <button className={`rounded-lg border px-4 py-2 text-sm transition-colors ${isActiveLightMode
                            ? "border-lightBorder text-lightModeTitle hover:bg-lightBorder"
                            : "border-darkBorder text-darkModeContent hover:bg-darkBorder"
                            }`}>
                            សម្អាត
                        </button>
                    </div>
                </div>
            </section>
            <section className={`mt-4 rounded-2xl border p-4 shadow-sm sm:p-6 ${isActiveLightMode ? "border-gray-300 bg-gray-100" : "border-darkBorder bg-darkModeBg"
                }`}>
                <div className=" mb-2 flex items-center gap-2">
                    <PiTruckFill className="rounded-xl bg-blue-800 p-2 text-4xl text-white" />
                    <h2 className="text-lg font-bold">ព័ត៌មានរថយន្តចូលចេញ</h2>
                </div>
                <div className={`border py-2 rounded-2xl ${isActiveLightMode ? "border-gray-300 bg-gray-100" : "border-darkBorder bg-darkModeBg"}`}>
                    <table className={`w-full border-collapse ${isActiveLightMode ? "border-lightBorder" : "border-darkBorder"}`}>
                        <thead>
                            <tr>
                                {truckColumns.map((col) => (
                                    <th key={col.accessor} className= {`px-4 py-2 text-sm font-hanuman uppercase text-left ${isActiveLightMode ? "text-blue-800" : "text-blue-400"}`}>
                                        {col.name}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${isActiveLightMode ? "divide-gray-300" : "divide-darkBorder"} border-t ${isActiveLightMode ? "border-lightBorder" : "border-darkBorder"}`}>
                            {isLoading || loadError || dataTruck.length === 0 ? (
                                <tr>
                                    <td colSpan={truckColumns.length} className="px-4 py-6 text-center text-sm font-medium">
                                        {isLoading
                                            ? "Loading gate information..."
                                            : loadError || "No gate information found."}
                                    </td>
                                </tr>
                            ) : (
                                dataTruck.map((truck, index) => (
                                    <tr key={truck.id ?? truck.gatecallid ?? index} className={` ${isActiveLightMode ? "hover:bg-gray-200" : "hover:bg-darkBorder"}`}
                                        onContextMenu={(event) => handleContextMenu(event, truck)}>
                                        {truckColumns.map((col) => (
                                            <td key={col.accessor} className='px-4 py-2 text-sm'>
                                                {truck[col.accessor] ?? "—"}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
            <ContextMenu
                visible={contextMenu.visible}
                x={contextMenu.x}
                y={contextMenu.y}
                row={contextMenu.row}
                items={contextMenuItems}
                isDark={!isActiveLightMode}
                onClose={() =>
                    setContextMenu((prev) => ({
                        ...prev,
                        visible: false,
                    }))
                }
            />
        </main>
    )
}

export default GateIn
