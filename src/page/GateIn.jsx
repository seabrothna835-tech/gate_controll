// import React, { useEffect, useState ,useMemo} from 'react'
// import { PiTruckFill } from "react-icons/pi";
// import { data, useOutletContext } from "react-router-dom";
// import ContextMenu from '../Components/ContextMenu';
// import { FaRegEye } from "react-icons/fa";
// import { IoMdLogIn } from "react-icons/io";
// import { IoMdLogOut } from "react-icons/io";
// import { BiSolidDetail } from "react-icons/bi";
// // import { useKeycloak } from "@react-keycloak/web";

// function GateIn() {
//     // const { keycloak } = useKeycloak();
//     const url_vite = import.meta.env.VITE_API_URL;
//     const { activeMode } = useOutletContext();
//     const isActiveLightMode = activeMode;
//     const mutedText = isActiveLightMode ? "text-lightModeSubTitle" : "text-darkModeSubTitle";
//     const fieldStyle = `min-w-0 rounded-lg border px-3 py-2 text-sm placeholder:opacity-70 focus:outline-none focus:ring-2 focus:ring-blue-600 ${isActiveLightMode
//         ? "border-lightBorder bg-lightModeBg text-lightModeTitle"
//         : "border-darkBorder bg-darkModeBg text-darkModeContent"
//         }`;
//     const [dataTruck, setDataTruck] = useState('');
//     const [isLoading, setIsLoading] = useState(true);
//     const [loadError, setLoadError] = useState("");
//     const [truckSearch, setTruckSearch] = useState('');
//     const [datasearch, setDataSearch] = useState('');
//     const truckColumns = [
//         { name: "Gate Call ID", accessor: "gatecallid" },
//         { name: "Truck Number", accessor: "licence_plate" },
//         { name: "Truck Company", accessor: "truck_company" },
//         { name: "Driver Name", accessor: "driver_name" },
//         { name: "Driver ID", accessor: "driver_id" },
//         { name: "Gate Status", accessor: "gatecall_status" },
//         { name: "Pickup / Dropoff", accessor: "dropoff_or_pickup" },
//         { name: "Terminal", accessor: "terminal" },
//         { name: "Gate In Time", accessor: "gatein_time" }
//     ];
//     // useEffect(() => {
//     //     const fetchData = async () => {
//     //         try {
           
//     //             if (!keycloak?.token) return;

//     //             const response = await fetch(`${url_vite}/api/gate`, {
//     //                 method: 'GET',
//     //                 headers: {
//     //                     'Authorization': `Bearer ${keycloak.token}`,
//     //                     'Content-Type': 'application/json'
//     //                 }
//     //             });

//     //             if (!response.ok) {
//     //                 throw new Error('Network response was not ok');
//     //                 }

//     //             const data = await response.json();
//     //             console.log(data);
//     //         } catch (error) {
//     //             console.error('Failed to fetch data:', error);
//     //         }
//     //     };

//     //     // 3. Invoke the async function
//     //     fetchData();
//     // }, [keycloak?.token]); // Re-run if th
//     const [contextMenu, setContextMenu] = useState({
//         visible: false,
//         x: 0,
//         y: 0,
//         row: null,
//     });
//     const handleContextMenu = (event, row) => {
//         event.preventDefault();
//         setContextMenu({
//             visible: true,
//             x: event.clientX,
//             y: event.clientY,
//             row: row,
//         });
//     };
    
//    const filteredData = useMemo(() => {
//     if (!Array.isArray(dataTruck)) return [];
//     return dataTruck.filter(item => {
//         const truckNum = item.licence_plate ? String(item.licence_plate).toLowerCase() : '';
//         const searchTruck = truckSearch.toLowerCase();
//         const searchData = datasearch.toLowerCase();

//         const matchTruck = truckSearch === '' || truckNum.includes(searchTruck);
        
//         const matchData = datasearch === '' || 
//             (item.gatecallid && String(item.gatecallid).toLowerCase().includes(searchData)) ||
//             (item.driver_name && item.driver_name.toLowerCase().includes(searchData)) ||
//             (item.BLNumber && item.BLNumber.toLowerCase().includes(searchData)) ||
//             (item.details?.some(d => {
//                 const containerMatch = d.ContainerId ? d.ContainerId.toLowerCase().includes(searchData) : false;
//                 const cargoMatch = d.CargoId ? d.CargoId.toLowerCase().includes(searchData) : false;
//                 return containerMatch || cargoMatch;
//             }) ?? false);
//         return matchTruck && matchData;
//     });
//     }, [dataTruck, truckSearch, datasearch]);

//     const handleClear = () => {
//         setTruckSearch('');
//         setDataSearch('');
   
//     };
//     const handleSearch = () => {
           
//     };
//     const contextMenuItems = [
//         {
//             key: "view",
//             label: "មើលព័ត៌មានលម្អិត",
//             icon: <FaRegEye />,
//             className: "text-green-400",
//             onClick: (row) => {
//                 console.log("View:", row);
//             },
//         },
//         {
//             key: "gate-in",
//             label: "អនុញ្ញាតចូល",
//             icon: <IoMdLogIn />,
//             className: "text-blue-400",
//             onClick: (row) => {
//                 console.log("Allow Entry:", row);
//             },
//         },
//         {
//             key: "gate-out",
//             label: "អនុញ្ញាតចេញ",
//             icon: <IoMdLogOut />,
//             className: "text-red-400",
//             onClick: (row) => {
//                 console.log("Gate Out:", row);
//             },
//         },
//     ];
//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const token = localStorage.getItem("token");
//                 const response = await fetch(`${url_vite}/api/gate`, {
//                     method: "GET",
//                   headers: {
//                  "Content-Type": "application/json",
//                 "Authorization": `Bearer ${token}`,
//                     }
//                 });
//                 if (!response.ok) {
//                     throw new Error(`Failed to fetch gate information (${response.status})`);
//                 }

//                 const data = await response.json();
//                 if (!Array.isArray(data?.gateInfoData)) {
//                     throw new Error("Invalid gate response: expected gateInfoData to be an array.");
//                 }

//                 setDataTruck(data.gateInfoData);
//                 setLoadError("");
//             } catch (error) {
//                 if (error.name !== "AbortError") {
//                     console.error("Error fetching gate call data:", error);
//                     setLoadError(error instanceof Error ? error.message : "Unable to load gate information.");
//                 }
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         fetchData();
//     }, [url_vite]);

//     return (
//         <main className={`min-h-full p-2 font-hanuman sm:p-2 lg:p-4 ${isActiveLightMode ? "text-lightModeTitle" : "text-darkModeContent"}`}>
//             <section className={`grid grid-cols-1 items-center gap-4 rounded-2xl border p-4 shadow-sm sm:p-6 lg:grid-cols-2 ${isActiveLightMode ? "border-gray-300 bg-gray-100" : "border-darkBorder bg-darkModeBg"
//                 }`}>
//                 <div className="flex items-center gap-2">
//                     <BiSolidDetail className="rounded-xl bg-blue-800 p-2 text-4xl text-white" />
//                     <div>
//                         <h1 className="text-lg font-bold">រថយន្ត​​ និងកុងតឺន័រ</h1>
//                         <p className={`text-sm ${mutedText}`}>ស្វែងរកព័ត៌មានរថយន្ត និងកុងតឺន័រ</p>
//                     </div>
//                 </div>
//                 <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
//                     <input
//                         type="text"
//                         placeholder="បញ្ចូលលេខរថយន្ត"
//                         className={fieldStyle}
//                          value={truckSearch}
//                         onChange={(e) => setTruckSearch(e.target.value)}
//                     />
//                     <input type="text"
//                         placeholder="បញ្ចូលលេខកុងតឺន័រ"
//                         className={fieldStyle}
//                         value={datasearch}
//                          onChange={(e) => setDataSearch(e.target.value)}
//                     />
//                     <div className="flex items-center gap-2">
//                         <button
//                          onClick={handleSearch}
//                          className="rounded-lg bg-blue-800 px-4 py-2 text-sm text-white shadow-sm transition-colors hover:bg-blue-700">
//                             ស្វែងរក
//                         </button>
//                         <button 
//                         onClick={handleClear}
//                         className={`rounded-lg border px-4 py-2 text-sm transition-colors ${isActiveLightMode
//                             ? "border-lightBorder text-lightModeTitle hover:bg-lightBorder"
//                             : "border-darkBorder text-darkModeContent hover:bg-darkBorder"
//                             }`}>
//                             សម្អាត
//                         </button>
//                     </div>
//                 </div>
//             </section>
//             <section className={`mt-4 rounded-2xl border p-4 shadow-sm sm:p-6 ${isActiveLightMode ? "border-gray-300 bg-gray-100" : "border-darkBorder bg-darkModeBg"
//                 }`}>
//                 <div className=" mb-2 flex items-center gap-2">
//                     <PiTruckFill className="rounded-xl bg-blue-800 p-2 text-4xl text-white" />
//                     <h2 className="text-lg font-bold">ព័ត៌មានរថយន្តចូលចេញ</h2>
//                 </div>
//                 <div className={`border py-2 rounded-2xl ${isActiveLightMode ? "border-gray-300 bg-gray-100" : "border-darkBorder bg-darkModeBg"}`}>
//                     <table className={`w-full border-collapse ${isActiveLightMode ? "border-lightBorder" : "border-darkBorder"}`}>
//                         <thead>
//                             <tr>
//                                 {truckColumns.map((col) => (
//                                     <th key={col.accessor} className= {`px-4 py-2 text-sm font-hanuman uppercase text-left ${isActiveLightMode ? "text-blue-800" : "text-blue-400"}`}>
//                                         {col.name}
//                                     </th>
//                                 ))}
//                             </tr>
//                         </thead>
//                         <tbody className={`divide-y ${isActiveLightMode ? "divide-gray-300" : "divide-darkBorder"} border-t ${isActiveLightMode ? "border-lightBorder" : "border-darkBorder"}`}>
//                             {isLoading || loadError || filteredData.length === 0 ? (
//                                 <tr>
//                                     <td colSpan={truckColumns.length} className="px-4 py-6 text-center text-sm font-medium">
//                                         {isLoading
//                                             ? "Loading gate information..."
//                                             : loadError || "No gate information found."}
//                                     </td>
//                                 </tr>
//                             ) : (
//                                 filteredData.map((truck, index) => (
//                                     <tr key={truck.id ?? truck.gatecallid ?? index} className={` ${isActiveLightMode ? "hover:bg-gray-200" : "hover:bg-darkBorder"}`}
//                                         onContextMenu={(event) => handleContextMenu(event, truck)}>
//                                         {truckColumns.map((col) => (
//                                             <td key={col.accessor} className='px-4 py-2 text-sm'>
//                                                 {truck[col.accessor] ?? "—"}
//                                             </td>
//                                         ))}
//                                     </tr>
//                                 ))
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
//             </section>
//             <ContextMenu
//                 visible={contextMenu.visible}
//                 x={contextMenu.x}
//                 y={contextMenu.y}
//                 row={contextMenu.row}
//                 items={contextMenuItems}
//                 isDark={!isActiveLightMode}
//                 onClose={() =>
//                     setContextMenu((prev) => ({
//                         ...prev,
//                         visible: false,
//                     }))
//                 }
//             />
//         </main>
//     )
// }
// export default GateIn;

import React, { useEffect, useState } from 'react'
import { PiTruckFill } from "react-icons/pi";
import { useOutletContext } from "react-router-dom";
import ContextMenu from '../Components/ContextMenu';
import { FaRegEye } from "react-icons/fa";
import { IoMdLogIn, IoMdLogOut } from "react-icons/io";
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
    const [isLoading, setIsLoading] = useState(false);
    const [loadError, setLoadError] = useState("");
    const [truckSearch, setTruckSearch] = useState('');
    const [datasearch, setDataSearch] = useState('');
    
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

    const gatecallColumns = [
        { name: "Cargo  Type",accessor:"cargo_type"},
        { name: "CONTAINER ID",accessor:"containerid"},
        { name: "MVVIN",accessor:"mvvin"},
        { name: "GC DESCRIPTION",accessor:"description"},
        { name: "GC TYPE",accessor:"gctype"},
        { name: "ORDERED QUANTITY",accessor:"ordered_quantity"},
        { name: "QUANTITY HANDLED",accessor:"quantity_handlid"},
        { name: "CARGO STATUS",accessor:"cargo_status"},
        { name: "Bl Moment",accessor:"blmoment"}
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

    const fetchGateData = async (truckQuery = '', containerQuery = '') => {
        setIsLoading(true);
        setLoadError("");
        try {
            const token = localStorage.getItem("token");
           
            const params = new URLSearchParams();
            if (truckQuery) params.append("truck", truckQuery);
            if (containerQuery) params.append("container", containerQuery);
            
            const queryString = params.toString() ? `?${params.toString()}` : '';
            
            const response = await fetch(`${url_vite}/api/gate${queryString}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` 
                }
            });
            
            if (!response.ok) {
                throw new Error(`Failed to fetch gate information (${response.status})`);
            }

            const data = await response.json();
            if (!Array.isArray(data?.gateInfoData)) {
                throw new Error("Invalid gate response: expected gateInfoData to be an array.");
            }

            setDataTruck(data.gateInfoData);
        } catch (error) {
            if (error.name !== "AbortError") {
                console.error("Error fetching gate call data:", error);
                setLoadError(error instanceof Error ? error.message : "Unable to load gate information.");
                setDataTruck([]);
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchGateData();
    }, [url_vite]);

    const handleSearch = () => {
        fetchGateData(truckSearch, datasearch);
    };

    const handleClear = () => {
        setTruckSearch('');
        setDataSearch('');
        fetchGateData('', '');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
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
                        placeholder="បញ្ចូលលេខរថយន្ត"
                        className={fieldStyle}
                        value={truckSearch}
                        onChange={(e) => setTruckSearch(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />

                    <input
                        type="text"
                        placeholder="បញ្ចូលលេខកុងតឺន័រ"
                        className={fieldStyle}
                        value={datasearch}
                        onChange={(e) => setDataSearch(e.target.value)}
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
                                ? "border-lightBorder text-lightModeTitle hover:bg-lightBorder"
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
                <div className={`border py-2 rounded-2xl ${isActiveLightMode ? "border-gray-300 bg-gray-100" : "border-darkBorder bg-darkModeBg"}`}>
                    <table className={`w-full border-collapse ${isActiveLightMode ? "border-lightBorder" : "border-darkBorder"}`}>
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
                            {isLoading || loadError || dataTruck.length === 0 ? (
                                <tr>
                                    <td colSpan={truckColumns.length} className="px-4 py-6 text-center text-sm font-medium">
                                        {isLoading
                                            ? "កំពុងទាញយកទិន្នន័យ..."
                                            : loadError || "រកមិនឃើញទិន្នន័យទេ។"}
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

                <div className={`border m-2 py-2 rounded-2xl ${isActiveLightMode ? "border-gray-300 bg-gray-100" : "border-darkBorder bg-darkModeBg"}`}>
                    <table className={`w-full border-collapse ${isActiveLightMode ? "border-lightBorder" : "border-darkBorder"}`}>
                        <thead>
                            <tr>
                                {gatecallColumns .map((col) => (
                                    <th key={col.accessor} className={`px-4 py-2 text-sm font-hanuman uppercase text-left ${isActiveLightMode ? "text-blue-800" : "text-blue-400"}`}>
                                        {col.name}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${isActiveLightMode ? "divide-gray-300" : "divide-darkBorder"} border-t ${isActiveLightMode ? "border-lightBorder" : "border-darkBorder"}`}>
                            {isLoading || loadError || dataTruck.length === 0 ? (
                                <tr>
                                    <td colSpan={gatecallColumns .length} className="px-4 py-6 text-center text-sm font-medium">
                                        {isLoading
                                            ? "កំពុងទាញយកទិន្នន័យ..."
                                            : loadError || "រកមិនឃើញទិន្នន័យទេ។"}
                                    </td>
                                </tr>
                            ) : (
                                dataTruck.map((truck, index) => (
                                    <tr key={truck.id ?? truck.gatecallid ?? index} className={` ${isActiveLightMode ? "hover:bg-gray-200" : "hover:bg-darkBorder"}`}
                                        onContextMenu={(event) => handleContextMenu(event, truck)}>
                                        {gatecallColumns .map((col) => (
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

export default GateIn;
