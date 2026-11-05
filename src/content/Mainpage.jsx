import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import { Search, Loader2 } from 'lucide-react';

export default function Mainpage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Input states
  const [truckInput, setTruckInput] = useState('');
  const [dbddInput, setDbddInput] = useState('');


  // Active filter states
  const [searchParams, setSearchParams] = useState({
    truck: '',
    dbdd: '',
    
  });

  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://192.168.168.15:8080/api/gate');
        const listData = response.data?.gateInfoData || [];
        console.log("Data ",listData)
        
        setData(listData);
        setError(null);

        if (listData.length > 0) {
          setSelectedItem(listData[0]);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("មិនអាចទាញយកទិន្នន័យពីម៉ាស៊ីនមេ (Server) បានទេ");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredData = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data.filter(item => {
      const gatecall = item.gatecall || {};
      const cargo = item.gatecallCargo || {};

      const matchTruck = searchParams.truck === '' || 
        gatecall.licence_plate?.toLowerCase().includes(searchParams.truck.toLowerCase());

      const matchDbdd = searchParams.dbdd === '' || 
        cargo.blnumber?.toLowerCase().includes(searchParams.dbdd.toLowerCase()) ||
        cargo.container_id?.toLowerCase().includes(searchParams.dbdd.toLowerCase());

      return matchTruck && matchDbdd;
    });
  }, [data, searchParams]);
  console.log("Filter",filteredData)

  const handleSearch = () => {
    setSearchParams({
      truck: truckInput,
      dbdd: dbddInput,
    });
  };

  const handleClear = () => {
    setTruckInput('');
    setDbddInput('');
    setSearchParams({ truck: '', dbdd: '', exe: false });
    if (data.length > 0) setSelectedItem(data[0]);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-blue-900 font-hanuman antialiased flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          <div className="bg-white rounded-xl shadow-xs border border-blue-900 p-4 sm:p-6 space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-blue-900 pb-4">
              <h2 className="text-lg font-semibold text-blue-900">Gate Call</h2>
              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="text"
                  placeholder="Truck Number"
                  className="text-sm px-3 py-2 border border-blue-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-44 bg-slate-200"
                  value={truckInput}
                  onChange={(e) => setTruckInput(e.target.value)}
                />

                <input
                  type="text"
                  placeholder="Container / BL No"
                  className="text-sm px-3 py-2 border border-blue-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-48 bg-slate-200"
                  value={dbddInput}
                  onChange={(e) => setDbddInput(e.target.value)}
                />

                <button 
                  onClick={handleSearch}
                  className="bg-indigo-900 hover:bg-blue-900 text-white px-5 py-2 rounded-lg text-sm font-hanuman flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                >
                  <Search size={15} /> Search
                </button>

                <button 
                  onClick={handleClear}
                  className="bg-indigo-900 hover:bg-blue-900 text-white px-5 py-2 rounded-lg text-sm font-hanuman transition-colors shadow-xs cursor-pointer"
                >
                  Clear
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12 text-blue-900 gap-2">
                <Loader2 className="animate-spin" size={24} />
                <span className="text-sm">កំពុងទាញយកទិន្នន័យ...</span>
              </div>
            ) : error ? (
              <div className="text-center py-6 text-red-600 text-sm font-medium">
                {error}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-blue-900 text-xs font-semibold uppercase tracking-wider border-b border-blue-900">
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
                      filteredData.map((item, idx) => {
                        const gatecall = item.idx;
                        
                        return (
                          <tr 
                            key={gatecall.gatecallid || idx} 
                            onClick={() => setSelectedItem(item)}
                            className={`cursor-pointer transition-colors ${
                              selectedItem?.gatecall?.gatecallid === gatecall.gatecallid ? "bg-slate-100 font-hanuman" : "hover:bg-slate-300"
                            }`}
                          >
                            <td className="py-3 px-3 text-blue-900 font-serif">{gatecall.licence_plate}</td>
                            <td className="py-3 px-3 text-blue-900">{gatecall.blnumber}</td>
                            <td className="py-3 px-3 text-blue-900">{gatecall.dropoff_or_pickup}</td>
                            <td className="py-3 px-3 text-blue-900">{gatecall.driver_name}</td>
                            <td className="py-3 px-3 text-blue-900">{gatecall.driver_id}</td>
                            <td className="py-3 px-3 text-blue-900">{gatecall.gatecall_status}</td>
                            <td className="py-3 px-3 text-blue-900">{gatecall.gatein_time}</td>
                            <td className="py-3 px-3 text-blue-900">{gatecall.gateout_time || "-"}</td>
                          </tr>
                        );
                      })
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
            )}
          </div>

          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4 sm:p-6 space-y-4">
            <h2 className="text-lg font-semibold text-blue-900 border-b border-slate-100 pb-4">Gate Call Details</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-xs uppercase tracking-wider border-b border-slate-200 text-blue-900">
                    <th className="py-3 px-3">Cargo Type</th>
                    <th className="py-3 px-3">Container Id</th>
                    <th className="py-3 px-3">Terminal</th>
                    <th className="py-3 px-3">GC Description</th>
                    <th className="py-3 px-3">Shipping Line</th>
                    <th className="py-3 px-3">Spec / Length</th>
                    <th className="py-3 px-3">VGM</th>
                    <th className="py-3 px-3">Gross Weight</th>
                    <th className="py-3 px-3">Cargo Status</th>
                    <th className="py-3 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {loading ? (
                    <tr>
                      <td colSpan="10" className="text-center py-6 text-blue-900 text-xs">
                        កំពុងដំណើរការ...
                      </td>
                    </tr>
                  ) : selectedItem && selectedItem.gatecallCargo ? (
                    (() => {
                      const cargo = selectedItem.gatecallCargo;
                      const gatecall = selectedItem.gatecall || {};
                      return (
                        <tr className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-3 text-blue-900">{cargo.fullorempty || "-"}</td>
                          <td className="py-3 px-3 text-blue-900">{cargo.container_id || "-"}</td>
                          <td className="py-3 px-3 text-blue-900">{cargo.terminal || "-"}</td>
                          <td className="py-3 px-3 text-blue-900">{gatecall.descriptions || "-"}</td>
                          <td className="py-3 px-3 text-blue-900">{cargo.shppingline_name || "-"}</td>
                          <td className="py-3 px-3 text-blue-900">{cargo.container_lenght || "-"}</td>
                          <td className="py-3 px-3 text-blue-900">{cargo.vgm || "-"}</td>
                          <td className="py-3 px-3 text-blue-900">{cargo.cont_grossweight || "-"}</td>
                          <td className="py-3 px-3 text-blue-900">{cargo.cargo_status || "-"}</td>
                          <td className="py-3 px-3 text-blue-900">{gatecall.gatecall_status || "-"}</td>
                        </tr>
                      );
                    })()
                  ) : (
                    <tr>
                      <td colSpan="10" className="text-center py-6 text-blue-900 text-xs">
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