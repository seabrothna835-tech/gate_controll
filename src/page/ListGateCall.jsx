
import React, { useEffect, useMemo, useState } from 'react'
import { PiTruckFill } from "react-icons/pi";
import { useNavigate, useOutletContext } from "react-router-dom";
import ContextMenu from '../Components/ContextMenu';
import { FaRegEye } from "react-icons/fa";
import { IoMdLogIn, IoMdLogOut } from "react-icons/io";
import { BiSolidDetail } from "react-icons/bi";
import { keycloak } from "../keyCloak";
import { GiCargoCrate } from "react-icons/gi";
import Pagination from '../Components/Pagination';
import { useDispatch } from 'react-redux';
import { setGateIn, setGateOut, setGateOutCallId } from '../Store/Filter/Activate';


function ListGateCall() {

    const url_vite = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    const { activeMode } = useOutletContext();
    const isActiveLightMode = activeMode;
    const mutedText = isActiveLightMode ? "text-lightModeSubTitle" : "text-darkModeSubTitle";
    const fieldStyle = `min-w-0 rounded-lg border px-3 py-2 text-sm
        placeholder:opacity-100
        focus:outline-none focus:ring-2 focus:ring-blue-600
        ${isActiveLightMode
            ? "border-gray-300 bg-lightModeBg text-gray-500 placeholder:text-gray-400"
            : "border-darkBorder bg-darkModeBg text-darkModeContent placeholder:text-gray-500"
        }`;

    const surface = isActiveLightMode ? "border-slate-200 bg-white" : "border-darkBorder bg-[#0B1220]";
    const [dataCargo, setDataCargo] = useState([]);
    const [dataTruck, setDataTruck] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [loadError, setLoadError] = useState("");
    const [isCargoLoading, setIsCargoLoading] = useState(false);
    const [cargoError, setCargoError] = useState("");
    const [truckSearch, setTruckSearch] = useState('');
    const [cargoSearch, setcargoSearch] = useState('');
    const [gateCallId, setGateCallId] = useState()

    // =============Use redux toolkit================
    const dispatch = useDispatch();

    const handleGateOut = (callId) => {
        dispatch(setGateIn(false));
        dispatch(setGateOut(true));
        dispatch(setGateOutCallId(callId));
        // navigate("/dashboard");
    }

    const handleGateIn = () => {
        dispatch(setGateOut(false));
        dispatch(setGateIn(true));
        // navigate("/dashboard");
    }
    // ==============================================

    // ===============Pagination========================
    const [currentPage, setCurrentPage] = useState(1);
    const dataPerPage = 6;
    // Filter data
    const filtered = useMemo(() => {
        return dataTruck;
    }, [dataTruck]);

    // Pagination
    const totalPages = Math.ceil(filtered.length / dataPerPage);

    const PageData = filtered.slice(
        (currentPage - 1) * dataPerPage,
        currentPage * dataPerPage
    );

    // Reset page when data changes
    useEffect(() => {
        setCurrentPage(1);
    }, [dataTruck]);

    // Prevent current page from exceeding total pages
    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);
    // ============================================================

    const truckColumns = [
        // { name: "Gate Call ID", accessor: "gatecallid" },
        { name: "Truck Number", accessor: "licence_plate" },
        { name: "Truck Company", accessor: "truck_company" },
        { name: "Driver Name", accessor: "driver_name" },
        { name: "Driver ID", accessor: "driver_id" },
        { name: "Gate Status", accessor: "gatecall_status" },
        { name: "Pickup / Dropoff", accessor: "dropoff_or_pickup" },
        { name: "Terminal", accessor: "terminal" },
        { name: "Gate In Time", accessor: "gatein_time" },
        { name: "Gate Out Time", accessor: "gateout_time" }
    ];

    const gatecallColumns = [
        { name: "CONTAINER ID", accessor: "container_id" },
        { name: "BL NUMBER", accessor: "blnumber" },
        { name: "LENGTH", accessor: "container_lenght" },
        { name: "FULL / EMPTY", accessor: "fullorempty" },
        { name: "GROSS WEIGHT", accessor: "cont_grossweight" },
        { name: "TARE WEIGHT", accessor: "cont_tareweight" },
        { name: "VGM", accessor: "vgm" },
        { name: "SHIPPING LINE", accessor: "shppingline_name" },
        { name: "CARGO STATUS", accessor: "cargo_status" },
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
            x: event.pageX,
            y: event.pageY,
            row,
        });
    };

    // get search data by truck number and container id
    const handleSearch = async () => {
        setIsLoading(true);
        setLoadError("");
        try {
            await keycloak.updateToken(30);
            const token = keycloak.token;
            if (cargoSearch?.trim() || truckSearch?.trim()) {
                const res = await fetch(`${url_vite}/api/gate/searchinfo`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        gatecallCargo: {
                            container_id: cargoSearch || ""
                        },
                        gatecall: {
                            licence_plate: truckSearch || ""
                        }
                    })
                });
                if (!res.ok) {
                    throw new Error(`Failed to fetch gate information (${res.status})`);
                }
                const data = await res.json();
                const gateInfo = data?.gateInfoData ?? [];
                if (!Array.isArray(gateInfo)) {
                    throw new Error("Invalid response: expected gateInfoData to be an array.");
                }
                setDataTruck(gateInfo);
            } else {
                handleClear();
            }
        } catch (error) {
            console.error("Error fetching gate call data:", error);
            setLoadError(
                "មានបញ្ហាក្នុងការស្វែងរក..."
            );
            setDataTruck([]);
        } finally {
            setIsLoading(false);
        }
    };

    const contextMenuItems = [
        {
            key: "view",
            label: "មើលព័ត៌មានលម្អិត",
            icon: <FaRegEye />,
            className: "text-green-400",
            onClick: (row) => {
                const gateCallId = row.gatecallid;
                console.log("gatecallid : ", gateCallId)
                navigate(`/gate-call/${encodeURIComponent(gateCallId)}`, {
                    state: { gateCall: row },
                });
            },
        },
        {
            key: "gate-in",
            label: "អនុញ្ញាតចូល",
            icon: <IoMdLogIn />,
            className: "text-blue-400",
            onClick: () => {
                handleGateIn();
            },
        },
        {
            key: "gate-out",
            label: "អនុញ្ញាតចេញ",
            icon: <IoMdLogOut className="rotate-180" />,
            className: "text-red-400",
            onClick: (row) => {
                if (!row?.gatecallid) {
                    console.error("Cannot start gate-out: selected row has no gate-call ID.");
                    return;
                }
                handleGateOut(row.gatecallid)
            },
        },
    ];

    // get data turck list
    // useEffect(() => {
    const fetchData = async () => {
        setIsLoading(true);
        setLoadError("");
        try {
            await keycloak.updateToken(30);
            const response = await fetch(`${url_vite}/api/gate`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${keycloak.token}`,
                },
            });
            localStorage.setItem("token", keycloak.token);
            console.log(keycloak.token)
            if (!response.ok) {
                throw new Error(`Failed to fetch gate information (${response.status})`);
            }

            const data = await response.json();
            if (!Array.isArray(data?.gateInfoData)) {
                throw new Error("Invalid gate response: expected gateInfoData to be an array.");
            }
            if (data.gateInfoData?.length > 0) {
                setGateCallId(data.gateInfoData[0].gatecallid);
            }
            setDataTruck(data.gateInfoData);
            setLoadError("");
        } catch (error) {
            if (error.name !== "AbortError") {
                console.error("Error fetching gate call data:", error);
                setLoadError("ពុំអាចទាញយកទិន្ន័យបាន។")
                setDataTruck([]);
            }
        } finally {
            setIsLoading(false);
        }
    };
    // fetchData();
    // }, [url_vite]);
    useEffect(() => {
        fetchData();
    }, []);

    // Get data cargo when gateCallId changes
    useEffect(() => {
        const fetchData = async () => {
            setIsCargoLoading(true);
            setCargoError("");
            try {
                await keycloak.updateToken(30);
                const response = await fetch(
                    `${url_vite}/api/gate/callId/${gateCallId}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${keycloak.token}`,
                        },
                    }
                );
                if (!response.ok) {
                    throw new Error(
                        `Failed to fetch gate information (${response.status})`
                    );
                }
                const data = await response.json();
                // Get only cargos
                const cargos = data?.gateInfoData?.[0]?.cargos ?? [];
                if (!Array.isArray(cargos)) {
                    throw new Error("Invalid gate response: expected cargos to be an array.");
                }
                setDataCargo(cargos);
                console.log("Data cargo:", cargos);
            } catch (error) {
                console.error("Error fetching gate call data:", error);
                setCargoError(
                    error instanceof Error
                        ? error.message
                        : "Unable to load cargo information."
                );
            } finally {
                setIsCargoLoading(false);
            }
        };
        if (gateCallId) {
            fetchData();
        }
    }, [url_vite, gateCallId]);

    const handleClear = () => {
        setTruckSearch('');
        setcargoSearch('');
        fetchData(); // Fetch all data when clearing search
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    // if (gateAction) {
    //     return (
    //         <GateActivate
    //             valueGateIn={gateAction.type === "gate-in"}
    //             valueGateOut={gateAction.type === "gate-out"}
    //             callid={gateAction.callid}
    //             onBack={() => setGateAction(null)}
    //         />
    //     );
    // }

    return (
        <main className={`min-h-full p-2 font-hanuman sm:p-2 lg:p-4 ${isActiveLightMode ? "text-lightModeTitle" : "text-darkModeContent"}`}>
            <section className={`grid grid-cols-1 items-center gap-4 rounded-2xl border p-4 shadow-sm sm:p-6 lg:grid-cols-2 ${isActiveLightMode ? "border-gray-300 bg-gray-100" : "border-darkBorder bg-darkModeBg"}`}>
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
                        placeholder="ស្វែងរកលេខរថយន្ត..."
                        className={fieldStyle}
                        value={truckSearch}
                        onChange={(e) => setTruckSearch(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />

                    <input
                        type="text"
                        placeholder="ស្វែងរកលេខកុងតឺន័រ..."
                        className={fieldStyle}
                        value={cargoSearch}
                        onChange={(e) => setcargoSearch(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleSearch}
                            disabled={isLoading}
                            className="rounded-lg bg-blue-800 px-4 py-2 text-sm text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-50">
                            {isLoading ? "កំពុងស្វែងរក..." : "ស្វែងរក"}
                        </button>
                        <button
                            onClick={handleClear}
                            disabled={isLoading}
                            className={`rounded-lg border px-4 py-2 text-sm transition-colors ${isActiveLightMode
                                ? "border-gray-300 text-lightModeTitle hover:bg-gray-300 bg-gray-200"
                                : "border-darkBorder text-darkModeContent hover:bg-darkBorder"
                                }`}>
                            សម្អាត
                        </button>
                    </div>
                </div>
            </section>

            <section className={`mt-4 rounded-2xl border p-4 shadow-sm sm:p-6 ${isActiveLightMode ? "border-gray-300 bg-gray-100" : "border-darkBorder bg-darkModeBg"}`}>
                <div className="mb-2 flex items-center gap-2">
                    <PiTruckFill className="rounded-xl bg-blue-800 p-2 text-4xl text-white" />
                    <h2 className="text-lg font-bold">ព័ត៌មានរថយន្តចូលចេញ</h2>
                </div>
                <div className={`overflow-x-auto w-full rounded-2xl border shadow-sm ${surface}`}>
                    <table className={`min-w-full w-full ${isActiveLightMode ? "border-lightBorder" : "border-darkBorder"}`}>
                        <thead>
                            <tr>
                                {truckColumns.map((col) => (
                                    <th key={col.accessor} className={`px-4 py-2 text-sm font-hanuman uppercase text-left ${isActiveLightMode ? "text-blue-800" : "text-blue-400"}`}>
                                        {col.name}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${isActiveLightMode ? "divide-gray-300" : "divide-darkBorder"} border-t ${isActiveLightMode ? "border-lightBorder" : "border-darkBorder"}`}>
                            {isLoading || loadError ? (
                                <tr>
                                    <td colSpan={truckColumns.length} className="px-4 py-6 text-center text-sm font-hanuman">
                                        {isLoading
                                            ? "កំពុងទាញយកព័ត៌មានរថយន្ត..."
                                            : loadError}
                                    </td>
                                </tr>
                            ) :
                                PageData.length == 0?
                                (
                                    <tr>
                                    <td colSpan={truckColumns.length} className="px-4 py-6 text-center text-sm font-hanuman">
                                        មិនមានព័ត៌មានរថយន្តសម្រាប់បង្ហាញ។
                                    </td>
                                </tr>
                                )
                            : (
                                PageData.map((truck, index) => (
                                    <tr key={truck.id ?? truck.gatecallid ?? index} className={` ${isActiveLightMode ? "hover:bg-gray-50" : "hover:bg-gray-900"} cursor-pointer`}
                                        onContextMenu={(event) => handleContextMenu(event, truck)}>
                                        {truckColumns.map((col) => (
                                            <td key={col.accessor} className='px-4 py-2 text-sm' onClick={() => {
                                                setGateCallId(truck.gatecallid);
                                            }}>
                                                {truck[col.accessor] ?? "—"}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-between items-center p-2">
                    <div>
                        ទំព័រទី {currentPage} នៃ {totalPages}
                    </div>
                    {totalPages > 1 && (
                    <div>
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                )}
                </div>
                {/* Cargo Information Section */}
                <div className="mb-2 mt-4 flex items-center gap-2">
                    <GiCargoCrate className="rounded-xl bg-blue-800 p-2 text-4xl text-white" />
                    <h2 className="text-lg font-bold">ព័ត៌មានកុងតឺន័រ</h2>
                </div>
                <div className={`overflow-x-auto w-full rounded-2xl border shadow-sm ${surface}`}>
                    <table className={`w-full min-w-full`}>
                        <thead>
                            <tr>
                                {gatecallColumns.map((col) => (
                                    <th key={col.accessor} className={`px-4 py-2 text-sm font-hanuman uppercase text-left ${isActiveLightMode ? "text-blue-800" : "text-blue-400"}`}>
                                        {col.name}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${isActiveLightMode ? "divide-gray-300" : "divide-darkBorder"} border-t ${isActiveLightMode ? "border-lightBorder" : "border-darkBorder"}`}>
                            {isCargoLoading || cargoError || dataCargo.length === 0 ? (
                                <tr>
                                    <td colSpan={gatecallColumns.length} className="px-4 py-6 text-center text-sm font-medium">
                                        {isCargoLoading
                                            ? "កំពុងទាញយកទិន្នន័យ..."
                                            : cargoError || "ពុំមានទិន្នន័យសម្រាប់បង្ហាញ។"}
                                    </td>
                                </tr>
                            ) : (
                                dataCargo.map((cargo, index) => (
                                    <tr key={cargo.id ?? cargo.gatecallid ?? index} className={`transition-colors ${isActiveLightMode ? "hover:bg-gray-50" : "hover:bg-gray-900"}`}
                                        onContextMenu={(event) => handleContextMenu(event, cargo)}>
                                        {gatecallColumns.map((col) => (
                                            <td key={col.accessor} className='px-4 py-2 text-sm'>
                                                {cargo[col.accessor] ?? "—"}
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

export default ListGateCall
