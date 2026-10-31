import React, { useState, useMemo } from "react";
// import { Search } from 'lucide-react';
import Sidebar from "../sidebar/Sidebar";
import Hls from "hls.js";

const INITIAL_DATA = [
  {
    id: 1,
    TruckNumber: 'TRU-2026',
    BLNumber: 'REC/STU99',
    Droporpick: 'REC',
    driverName: 'FFF',
    DriverId: '222',
    callstatus: 'ACT',
    ATA: '09/01/2026 09:18:06',
    ATD: '',
    details: [
      {
        CargoType: 'CN',
        ContainerId: 'DBDD8923983',
        MVVIN: '',
        GCDescription: '',
        GCType: '',
        GCSpec: '',
        OrderedQuantity: '1.000',
        QuantityHandled: '1.000',
        CargoStatus: 'EXE',
        BLMovementType: 'REC'
      },
      {
        CargoType: 'GC',
        ContainerId: '',
        MVVIN: '',
        GCDescription: '',
        GCType: 'Dry Bulk',
        GCSpec: 'CORN',
        OrderedQuantity: '100.000',
        QuantityHandled: '100.000',
        CargoStatus: 'EXE',
        BLMovementType: 'REC'
      }
    ]
  },
  {
    id: 2,
    TruckNumber: 'TRU-2027',
    BLNumber: 'REC/STU100',
    Droporpick: 'PICK',
    driverName: 'SAM',
    DriverId: '333',
    callstatus: 'EXE',
    ATA: '10/01/2026 10:15:00',
    ATD: '10/01/2026 11:30:00',
    details: [
      {
        CargoType: 'BX',
        ContainerId: 'DBDD8923984',
        MVVIN: 'MV-01',
        GCDescription: 'General Box',
        GCType: 'Box',
        GCSpec: 'STD',
        OrderedQuantity: '50.000',
        QuantityHandled: '50.000',
        CargoStatus: 'EXE',
        BLMovementType: 'PICK'
      }
    ]
  }
];

export default function Content() {
  const [truckSearch, setTruckSearch] = useState('');
  const [dbddSearch, setDbddSearch] = useState('');
  const [includeEXE, setIncludeEXE] = useState(false);
  const [activeTab, setActiveTab] = useState("bases-study");

  const filteredData = useMemo(() => {
    return INITIAL_DATA.filter(item => {
      const matchTruck = truckSearch === '' || item.TruckNumber.toLowerCase().includes(truckSearch.toLowerCase());
      const matchDbdd = dbddSearch === '' || 
        item.BLNumber.toLowerCase().includes(dbddSearch.toLowerCase()) ||
        item.details.some(d => d.ContainerId.toLowerCase().includes(dbddSearch.toLowerCase()));
      const matchEXE = !includeEXE || item.details.some(d => d.CargoStatus === 'EXE');

      return matchTruck && matchDbdd && matchEXE;
    });
  }, [truckSearch, dbddSearch, includeEXE]);

  const handleClear = () => {
    setTruckSearch('');
    setDbddSearch('');
    setIncludeEXE(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-hanuman antialiased flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4 sm:p-6 space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <h2 className="text-lg font-hanuman text-slate-900">Gate Call</h2>

              <div className="flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-2 text-sm text-blue-950 cursor-pointer border-blue-700">
                  <input 
                    type="checkbox" 
                    checked={includeEXE} 
                    onChange={(e) => setIncludeEXE(e.target.checked)}
                    className="w-4 h-4 rounded border-blue-900 text-indigo-600 focus:ring-indigo-500"
                  />
                  IncludeEXE
                </label>

                <input
                  type="text"
                  placeholder="Truck Number"
                  className="text-sm px-3 py-2 border border-blue-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-44 bg-white"
                  value={truckSearch}
                  onChange={(e) => setTruckSearch(e.target.value)}
                />

                <input
                  type="text"
                  placeholder="Container / BL No"
                  className="text-sm px-3 py-2 border border-blue-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-48 bg-white"
                  value={dbddSearch}
                  onChange={(e) => setDbddSearch(e.target.value)}
                />

                <button className="bg-indigo-900 hover:bg-indigo-950 text-white px-5 py-2 rounded-lg text-sm font-hanuman flex items-center gap-1.5 transition-colors shadow-xs">
                  <Search size={15} /> Search
                </button>

                <button 
                  onClick={handleClear}
                  className="bg-indigo-900 hover:bg-indigo-950 text-white px-5 py-2 rounded-lg text-sm font-hanuman transition-colors shadow-xs"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-indigo-900 text-xs font-hanuman uppercase tracking-wider border-b border-blue-900">
                    <th className="py-3 px-3">Truck Number</th>
                    <th className="py-3 px-3">BL Number</th>
                    <th className="py-3 px-3">DropOff Or PickUp</th>
                    <th className="py-3 px-3">Driver Name</th>
                    <th className="py-3 px-3">Driver Id</th>
                    <th className="py-3 px-3">Call Status</th>
                    <th className="py-3 px-3">ATA</th>
                    <th className="py-3 px-3">ATD</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredData.length > 0 ? (
                    filteredData.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-3 text-blue-900 font-serif">{item.TruckNumber}</td>
                        <td className="py-3 px-3 text-blue-900">{item.BLNumber}</td>
                        <td className="py-3 px-3 text-blue-900">{item.Droporpick}</td>
                        <td className="py-3 px-3 text-blue-900">{item.driverName}</td>
                        <td className="py-3 px-3 text-blue-900">{item.DriverId}</td>
                        <td className="py-3 px-3 text-blue-900">{item.callstatus}</td>
                        <td className="py-3 px-3 text-blue-900">{item.ATA}</td>
                        <td className="py-3 px-3 text-blue-900">{item.ATD || "-"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center py-6 text-blue-900 text-xs">
                        រកមិនឃើញទិន្នន័យ
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4 sm:p-6 space-y-4">
            <h2 className="text-lg font-hanuman text-blue-900 border-b border-slate-100 pb-4">Gate Call Details</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className=" text-xs font-hanuman uppercase tracking-wider border-b border-slate-200">
                    <th className="py-3 px-3 font-hanuman text-blue-900">Cargo Type</th>
                    <th className="py-3 px-3 font-hanuman text-blue-900">Container Id</th>
                    <th className="py-3 px-3 font-hanuman text-blue-900">MVVIN</th>
                    <th className="py-3 px-3 font-hanuman text-blue-900">GC Description</th>
                    <th className="py-3 px-3 font-hanuman text-blue-900">GC Type</th>
                    <th className="py-3 px-3 font-hanuman text-blue-900">GC Spec</th>
                    <th className="py-3 px-3 font-hanuman text-blue-900">Ordered Quantity</th>
                    <th className="py-3 px-3 font-hanuman text-blue-900">Quantity Handled</th>
                    <th className="py-3 px-3 font-hanuman text-blue-900">Cargo Status</th>
                    <th className="py-3 px-3 font-hanuman text-blue-900">BL Movement Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm font-hanuman">
                  {filteredData.length > 0 ? (
                    filteredData.flatMap((item) => item.details).map((detail, index) => (
                      <tr key={index} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-3 text-blue-900">{detail.CargoType}</td>
                        <td className="py-3 px-3 text-blue-900">{detail.ContainerId}</td>
                        <td className="py-3 px-3 text-blue-900">{detail.MVVIN}</td>
                        <td className="py-3 px-3 text-blue-900">{detail.GCDescription}</td>
                        <td className="py-3 px-3 text-blue-900">{detail.GCType}</td>
                        <td className="py-3 px-3 text-blue-900">{detail.GCSpec}</td>
                        <td className="py-3 px-3 text-blue-900">{detail.OrderedQuantity}</td>
                        <td className="py-3 px-3 text-blue-900">{detail.QuantityHandled}</td>
                        <td className="py-3 px-3 text-blue-900">{detail.CargoStatus}</td>
                        <td className="py-3 px-3 text-blue-900">{detail.BLMovementType}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="10" className="text-center py-6 text-slate-400 text-xs">
                        រកមិនឃើញទិន្នន័យលម្អិត
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}