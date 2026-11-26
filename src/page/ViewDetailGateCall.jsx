import { useEffect, useMemo, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import {
    FiArrowLeft,
    FiCamera,
    FiCheckCircle,
    FiChevronLeft,
    FiChevronRight,
    FiPackage,
    FiUser,
    FiX,
} from "react-icons/fi";
import { IoMdQrScanner } from "react-icons/io";
import { createPortal } from "react-dom";
import { HiOutlineChevronDoubleRight } from "react-icons/hi";
import { HiOutlineChevronDoubleLeft } from "react-icons/hi";
import { PiTruckBold } from "react-icons/pi";
import { BiSolidDetail } from "react-icons/bi";

const valueOrDash = (value) => {
    if (value === null || value === undefined || value === "") return "—";
    return String(value);
};

const formatDate = (value) => {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return new Intl.DateTimeFormat("en-GB", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(date);
};

function DetailField({ label, value, isActiveLightMode }) {
    return (
        <div className={`grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-3 border-b px-4 py-3 last:border-b-0 sm:gap-5 ${isActiveLightMode ? "border-slate-100" : "border-darkBorder"}`}>
            <dt className={`text-sm ${isActiveLightMode ? "text-slate-500" : "text-darkModeSubTitle"}`}>{label}</dt>
            <dd className={`min-w-0 break-words text-sm font-semibold ${isActiveLightMode ? "text-slate-800" : "text-darkModeContent"}`}>{valueOrDash(value)}</dd>
        </div>
    );
}

function PhotoPanel({ title, image, section, isActiveLightMode, onImageClick }) {
    return (
        <div className={`overflow-hidden rounded-xl border ${isActiveLightMode ? "border-slate-200 bg-white" : "border-darkBorder bg-[#0b1220]"}`}>
            <div className={`flex items-center justify-between border-b px-4 py-1 ${isActiveLightMode ? "border-slate-100" : "border-darkBorder"}`}>
                <span className={`text-sm font-semibold ${isActiveLightMode ? "text-slate-700" : "text-darkModeContent"}`}>{title}</span>
                <button onClick={() => onImageClick(image, title, section)} type="button" disabled={!image} aria-label={`View ${title} image full screen`}
                    className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-50 
                ${isActiveLightMode ? "text-slate-700 hover:bg-gray-300" : "text-darkModeContent hover:bg-cyan-950"}`}>
                    <IoMdQrScanner className="text-xl text-cyan-600" aria-hidden="true" />
                </button>
            </div>
            {image ? (
                <button type="button" onClick={() => onImageClick(image, title, section)} aria-label={`View ${title} image full screen`} className="block w-full cursor-zoom-in">
                    <img src={image} alt={`${title} truck capture`} className="aspect-[16/9] w-full bg-slate-100 object-cover" />
                </button>
            ) : (
                <div className={`relative flex aspect-[16/9] flex-col items-center justify-center gap-2 overflow-hidden ${isActiveLightMode ? "bg-gradient-to-br from-sky-50 via-slate-100 to-emerald-50" : "bg-gradient-to-br from-slate-800 via-slate-900 to-cyan-950"}`}>
                    <div className="absolute inset-x-0 bottom-0 h-1/4 bg-black/10" />
                    <IoMdQrScanner className={`relative h-7 w-7 ${isActiveLightMode ? "text-slate-400" : "text-slate-500"}`} aria-hidden="true" />
                    <span className={`relative text-xs ${isActiveLightMode ? "text-slate-500" : "text-slate-400"}`}>No image captured</span>
                </div>
            )}
        </div>
    );
}

function ViewDetailGateCall() {
    const url = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem("token");
    const [gateCall, setGateCall] = useState({});
    const [selectedImage, setSelectedImage] = useState(null);
    const navigate = useNavigate();
    const { gateCallId } = useParams();
    const { activeMode: isActiveLightMode = false } = useOutletContext() || {};

    const cargos = Array.isArray(gateCall?.cargos)
        ? gateCall.cargos
        : gateCall?.cargo
            ? [gateCall.cargo]
            : [];

// ==========================Image handler==========================
    const images = useMemo(() => Array.isArray(gateCall?.images)
        ? gateCall.images
        : [{ in_image: gateCall?.in_image, out_image: gateCall?.out_image }], [gateCall]);

    const previewImages = useMemo(() => ({
        in: images.flatMap((image, index) => {
            const title = `រូបទី${images.length > 1 ? ` ${index + 1}` : ""}`;
            return image?.in_image
                ? [{ src: image.in_image, title: `រូបចូល ${title}`, section: "in" }]
                : [];
        }),
        out: images.flatMap((image, index) => {
            const title = `រូបទី${images.length > 1 ? ` ${index + 1}` : ""}`;
            return image?.out_image
                ? [{ src: image.out_image, title: `រូបចេញ ${title}`, section: "out" }]
                : [];
        }),
    }), [images]);

    const openImage = (src, title, section) => {
        if (!src) return;
        const sectionImages = previewImages[section];
        const image = sectionImages.find((previewImage) => previewImage.src === src);
        setSelectedImage(image ?? { src, title, section });
    };

    const moveImage = (direction) => {
        setSelectedImage((current) => {
            if (!current) return current;
            const sectionImages = previewImages[current.section];
            if (sectionImages.length < 2) return current;
            const currentIndex = sectionImages.findIndex((image) => image.src === current.src);
            const nextIndex = (currentIndex + direction + sectionImages.length) % sectionImages.length;
            return sectionImages[nextIndex];
        });
    };
    
    const imageGateIN = images.flatMap((image, index) => [
        ...(image?.in_image ? [<PhotoPanel key={`in-${index}`} title={`រូបទី${images.length > 1 ? ` ${index + 1}` : ""}`} image={image.in_image} section="in" isActiveLightMode={isActiveLightMode} onImageClick={openImage} />] : [])
    ]);
    const imageGateOUT = images.flatMap((image, index) => [
        ...(image?.out_image ? [<PhotoPanel key={`out-${index}`} title={`រូបទី${images.length > 1 ? ` ${index + 1}` : ""}`} image={image.out_image} section="out" isActiveLightMode={isActiveLightMode} onImageClick={openImage} />] : []),
    ]);

    useEffect(() => {
        if (!selectedImage) return undefined;
        const handleKeyDown = (event) => {
            if (event.key === "Escape") setSelectedImage(null);
            if (event.key === "ArrowLeft") moveImage(-1);
            if (event.key === "ArrowRight") moveImage(1);
        };
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [selectedImage]);

    console.log("Select imae : ",selectedImage)
// ======================================================

    const truckFields = useMemo(() => [
        { label: "Truck No.", value: gateCall?.licence_plate ?? gateCall?.truck_no ?? gateCall?.truck_number },
        { label: "Driver Name", value: gateCall?.driver_name },
        { label: "Driver ID", value: gateCall?.driver_id },
        { label: "Company", value: gateCall?.truck_company ?? gateCall?.company },
        { label: "Cargo / Operation", value: gateCall?.dropoff_or_pickup },
        { label: "Gate Call ID", value: gateCall?.gatecallid ?? gateCallId },
        { label: "Terminal", value: gateCall?.terminal },
        { label: "Date & Time (In)", value: formatDate(gateCall?.gatein_time) },
        { label: "Date & Time (Out)", value: formatDate(gateCall?.gateout_time) },
    ], [gateCall, gateCallId]);

    const status = String(gateCall?.gatecall_status ?? "").toUpperCase();
    const isComplete = ["EXE"].includes(status);
    const surface = isActiveLightMode ? "border-slate-200 bg-white" : "border-darkBorder bg-[#111c2e]";
    const textColor = isActiveLightMode ? "text-lightModeTitle" : "text-darkModeTitle";
    const mutedColor = isActiveLightMode ? "text-lightModeSubTitle" : "text-darkModeSubTitle";

    // get cargo data by click row at gatecall
    useEffect(() => {
        const controller = new AbortController();
        const getGateCallData = async () => {
            try {
                const response = await fetch(`${url}/api/gate/callId/${gateCallId}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    signal: controller.signal,
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                const records = data?.gateInfoData;
                let record;
                if (Array.isArray(records)) {
                    record = records.find((item) => String(item.gatecallid) === String(gateCallId))
                        ?? (records.length === 1 ? records[0] : null);
                } else {
                    record = data?.gateCall ?? data;
                }
                if (!record || typeof record !== "object") {
                    throw new Error(`Gate call ${gateCallId} was not found in the response.`);
                }
                setGateCall(record);
            } catch (error) {
                if (error.name !== "AbortError") {
                    console.error("Error fetching gate call data:", error);
                }
            }
        };

        getGateCallData();
        return () => controller.abort();
    }, [url, token, gateCallId]);
    return (
        <main className={`mx-auto min-h-full w-full max-w-[1500px] p-3 font-hanuman sm:p-5 lg:p-7 ${textColor}`}>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <button type="button" onClick={() => navigate(-1)} className={`mb-3 inline-flex items-center gap-2 text-sm font-medium transition hover:text-cyan-600 ${mutedColor}`}>
                        <FiArrowLeft className="h-4 w-4" aria-hidden="true" />
                        ត្រឡប់ក្រោយ
                    </button>
                    <div className="flex flex-wrap items-center gap-3">
                        <span className={`flex h-11 w-11 items-center justify-center rounded-xl text-cyan-600 ${isActiveLightMode ? "bg-blue-100 " : "bg-blue-950 "}`}>
                            <BiSolidDetail className="text-3xl" aria-hidden="true" />
                        </span>
                        <div>
                            <h1 className="text-xl font-bold sm:text-2xl">ព័ត៌មានលម្អិត</h1>
                            <p className={`mt-0.5 text-sm ${mutedColor}`}>លេខរៀងរថយន្ត #{valueOrDash(gateCall.gatecallid ?? gateCallId)}</p>
                        </div>
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${isComplete ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"}`}>
                            <FiCheckCircle className="h-3.5 w-3.5" aria-hidden="true" />
                            {isComplete ? "EXE" : valueOrDash(gateCall.gatecall_status)}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 items-start gap-2 lg:grid-cols-[1fr_3fr]">
                <section className={`overflow-hidden rounded-2xl border shadow-sm ${surface}`}>
                    <div className={`flex items-center gap-2 border-b px-4 py-4 sm:px-5 ${isActiveLightMode ? "border-slate-100" : "border-darkBorder"}`}>
                        <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${isActiveLightMode ? "bg-blue-100 " : "bg-blue-950 "}`}>
                            <PiTruckBold className="h-5 w-5 text-cyan-600" aria-hidden="true" />
                        </div>
                        <h2 className="font-bold">ព័ត៌មានរបស់រថយន្ត</h2>
                    </div>
                    <dl>
                        {truckFields.map((field) => (
                            <DetailField key={field.label} {...field} isActiveLightMode={isActiveLightMode} />
                        ))}
                        <div className={`grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-3 px-4 py-3 sm:gap-5`}>
                            <dt className={`flex items-center gap-2 text-sm ${mutedColor}`}><FiUser className="h-4 w-4" aria-hidden="true" /> Description</dt>
                            <dd className={`min-w-0 break-words text-sm ${isActiveLightMode ? "text-slate-700" : "text-darkModeContent"}`}>{valueOrDash(gateCall.descriptions ?? gateCall.description)}</dd>
                        </div>
                    </dl>
                </section>

                <div className="space-y-2">
                    <section className={`rounded-2xl border p-4 shadow-sm sm:p-5 ${surface}`}>
                        <div className="mb-4 flex items-center gap-2">
                            <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${isActiveLightMode ? "bg-blue-100 " : "bg-blue-950 "}`}>
                                <FiCamera className="h-5 w-5 text-cyan-600" aria-hidden="true" />
                            </div>
                            <h2 className="font-bold">រូបភាពច្រកចេញចូល</h2>
                        </div>
                        <div>
                            {imageGateIN.length > 0 ?
                                <div>
                                    <span className="text-md p-2 flex items-center gap-2"><HiOutlineChevronDoubleRight /> រូបភាពរថយន្តចូល</span>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                        {imageGateIN}
                                    </div>
                                    {imageGateOUT.length > 0 ?
                                        <div className="pt-4">
                                            <span className="text-md p-2 flex items-center gap-2"><HiOutlineChevronDoubleLeft /> រូបភាពរថយន្តចេញ</span>
                                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                                {imageGateOUT}
                                            </div>
                                        </div>
                                        : null
                                    }
                                </div>
                                : (
                                    <div className="text-center">
                                        <h1 className="font-hanuman text-center">មិនមានរូបភាពសម្រាប់បង្ហាញ</h1>
                                    </div>
                                )}
                        </div>
                    </section>

                    <section className={`overflow-hidden rounded-2xl border shadow-sm ${surface}`}>
                        {/* Header */}
                        <div className={`flex items-center gap-2 border-b px-4 py-4 sm:px-5 ${isActiveLightMode ? "border-slate-100" : "border-darkBorder"
                            }`}>
                            <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${isActiveLightMode ? "bg-blue-100 " : "bg-blue-950 "}`}>
                                <FiPackage className="h-5 w-5 text-cyan-600" />
                            </div>
                            <h2 className="font-bold">ព័ត៌មានរបស់កុងតឺន័រ</h2>
                            <span className={`ml-auto text-xs ${mutedColor}`}>
                                {cargos.length} containers
                            </span>
                        </div>

                        {cargos.length === 0 ? (
                            <p className={`px-4 py-4 text-sm ${mutedColor}`}>
                                No cargo information available.
                            </p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full whitespace-nowrap text-left text-sm">
                                    {/* Table Header */}
                                    <thead className={`${isActiveLightMode
                                            ? "bg-slate-50 text-slate-600"
                                            : "bg-darkModeBg text-darkModeContent"
                                        }`}>
                                        <tr>
                                            <th className="px-4 py-3">No.</th>
                                            <th className="px-4 py-3">Container ID</th>
                                            <th className="px-4 py-3">BL Number</th>
                                            <th className="px-4 py-3">Length</th>
                                            <th className="px-4 py-3">Status</th>
                                            <th className="px-4 py-3">Gross Weight</th>
                                            <th className="px-4 py-3">Tare Weight</th>
                                            <th className="px-4 py-3">VGM</th>
                                            <th className="px-4 py-3">Shipping Line</th>
                                            <th className="px-4 py-3">Terminal</th>
                                        </tr>
                                    </thead>

                                    {/* Table Body */}
                                    <tbody>
                                        {cargos.map((cargo, index) => (
                                            <tr
                                                key={cargo.id ?? cargo.cargo_id ?? index}
                                                className={`border-t transition-colors ${isActiveLightMode
                                                        ? "border-slate-100 hover:bg-slate-50"
                                                        : "border-darkBorder hover:bg-white/5"
                                                    }`}
                                            >
                                                <td className="px-4 py-3">{index + 1}</td>
                                                <td className="px-4 py-3 font-semibold text-cyan-600">
                                                    {cargo.container_id || "-"}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {cargo.blnumber || "-"}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {cargo.container_lenght || "-"}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${cargo.fullorempty === "EMPTY"
                                                            ? "bg-slate-100 text-slate-600"
                                                            : "bg-emerald-100 text-emerald-700"
                                                        }`}>
                                                        {cargo.fullorempty || "-"}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    {cargo.cont_grossweight ?? "-"}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {cargo.cont_tareweight ?? "-"}
                                                </td>
                                                <td className="px-4 py-3 font-medium">
                                                    {cargo.vgm ?? "-"}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {cargo.shppingline_name || "-"}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {cargo.terminal || "-"}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>
                </div>
            </div>
            {selectedImage && createPortal(
                <div
                    className="fixed inset-0 z-50 flex h-full w-full-screen items-center justify-center bg-black/95 p-4"
                    role="dialog"
                    aria-modal="true"
                    aria-label={`${selectedImage.title} image preview`}
                    onClick={() => setSelectedImage(null)}
                >
                    <button
                        type="button"
                        onClick={() => setSelectedImage(null)}
                        aria-label="Close image preview"
                        className="absolute right-5 top-5 rounded-full p-2 text-white transition hover:bg-white/10 hover:text-red-400"
                    >
                        <FiX size={30} />
                    </button>
                    {previewImages[selectedImage.section]?.length > 1 && (
                        <>
                            <button
                                type="button"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    moveImage(-1);
                                }}
                                aria-label="View previous image"
                                className="absolute left-5 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20"
                            >
                                <FiChevronLeft size={32} />
                            </button>
                            <button
                                type="button"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    moveImage(1);
                                }}
                                aria-label="View next image"
                                className="absolute right-5 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20"
                            >
                                <FiChevronRight size={32} />
                            </button>
                        </>
                    )}
                    <img
                        src={selectedImage.src}
                        alt={`${selectedImage.title} full-screen preview`}
                        onClick={(event) => event.stopPropagation()}
                        className="max-h-full max-w-full object-contain"
                    />
                </div>,
                document.body,
            )}
        </main>
    );
}

export default ViewDetailGateCall;
