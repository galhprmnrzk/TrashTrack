import React, { useEffect, useState } from 'react';
import { supabase } from '../api/supabaseClient';
import { 
  MapPin, Wifi, Trash2, 
  RefreshCw, Send, Power, PowerOff, Info, Clock, BatteryMedium,
} from 'lucide-react';

const formatRelativeTime = (dateString) => {
      const now = new Date();
      const past = new Date(dateString);
      const diffInSeconds = Math.floor((now - past) / 1000);

      const units = [
        { label: 'tahun', seconds: 31536000 },
        { label: 'bulan', seconds: 2592000 },
        { label: 'hari', seconds: 86400 },
        { label: 'jam', seconds: 3600 },
        { label: 'menit', seconds: 60 },
        { label: 'detik', seconds: 1 }
      ];

  for (const unit of units) {
    const interval = Math.floor(diffInSeconds / unit.seconds);
    if (interval >= 1) {
      return `${interval} ${unit.label} yang lalu`;
    }
  }
  return 'Baru saja';
};

const getSignalDetails = (rssi) => {
  if (!rssi && rssi !== 0) return { label: 'Tidak ada Sinyal', ms: '--', color: 'text-slate-400'};
  if (rssi >= -50) return { label: 'Sangat baik', ms: '12-25', color: 'text-emerald-500'};
  if (rssi >= -70) return { label: 'Baik', ms: '26-50', color: 'text-blue-500'};
  if (rssi >= -80) return { label: 'Cukup', ms: '51-120', color: 'text-orange-500'};
  return { label: 'Buruk', ms: '>200', color: 'text-red-500'};
};

const Dashboard = () => {
  const [device, setDevice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();

    const interval = setInterval(() => {
    fetchData();
    console.log("Auto Refresh: Data updated");
  }, 10000); 

  const subscription = supabase
    .channel('live_monitoring')
    .on('postgres_changes', { 
      event: '*', 
      schema: 'public', 
      table: 'sampah_status' 
    }, () => {
      fetchData();
    })
    .subscribe();

  return () => {
    clearInterval(interval);
    supabase.removeChannel(subscription);
  };
}, []);

  const fetchData = async () => {
  try {
    const [statusRes, systemRes] = await Promise.all([
      // Ambil data isi sampah
      supabase
        .from('sampah_status')
        .select('*, devices(*)')
        .limit(1)
        .single(),
      
      // Ambil data kesehatan sistem (baterai, sinyal, dll)
      supabase
        .from('device_system_status')
        .select('*')
        .limit(1)
        .single()
    ]);

    if (!statusRes.error && !systemRes.error) {
      // Kita gabungkan datanya ke satu state agar tidak banyak mengubah kode JSX
      setDevice({
        ...statusRes.data,
        system: systemRes.data // Data sistem masuk ke properti .system
      });
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    setLoading(false);
  }
};

  const checkOnline = (updatedAt) => {
    const lastUpdate = new Date(updatedAt).getTime();
    const now = new Date().getTime();
    return (now - lastUpdate) < 300000; 
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-[#F8FAFC]">
      <div className="flex flex-col items-center gap-4">
        <RefreshCw className="animate-spin text-blue-600" size={40} />
        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Sinkronisasi Data...</p>
      </div>
    </div>
  );

  if (!device) return <div className="p-20 text-center font-semibold text-slate-400">Device Tidak ditemukan</div>;

  const systemData = device.system || {}; 
  const isOnline = checkOnline(systemData.updated_at); // Cek online dari status sistem
  const signal = getSignalDetails(systemData.rssi);
  const isFull = device.persen >= 80;
  const isWarning = device.persen >= 50 && device.persen < 80;

  return (      
      <div className="w-[100%] mx-auto py-10 pl-20 pr-30">
      {/* Hero Section */}
      <div className="h-[100%] mt-10 mb-10">
        <h1 className="text-4xl font-black mb-2">Dashboard Perangkat</h1>
        <p className="text-lg text-slate-500 max-w-3xl">
          Menampilkan Kondisi & Status Perangkat Utama <span className="text-blue-600 font-bold">TrashTrack!</span>
        </p>
      </div>

      {/* Main Hero */}
      <div className="bg-white rounded-[48px] shadow-sm border border-slate-200 overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          
          {/* Presentase */}
          <div className="lg:w-1/2 p-8 flex flex-col items-center justify-center bg-slate-50/30">
             <div className="relative flex items-center justify-center w-[340px] h-[340px]">
                {/* SVG Progress Circle */}
                <svg className="w-full h-full transform -rotate-90 origin-center">
                  <circle cx="170" cy="170" r="160" stroke="#f1f5f9" strokeWidth="10" fill="transparent" />
                  <circle 
                    cx="170" cy="170" r="160" 
                    stroke={isFull ? '#E53935' : isWarning ? '#EA580C' : '#059669'} 
                    strokeWidth="10" fill="transparent" 
                    strokeDasharray={1005}
                    strokeDashoffset={1005 - (1005 * device.persen) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-between">
                    <span className={`text-7xl font-bold tracking-tighter ${
                      isFull ? 'text-red-600' : isWarning ? 'text-orange-600' : 'text-emerald-600'
                    }`}>{device.persen}%</span>

                    <span className={`text-[10px] font-bold px-4 py-1.5 rounded-full mt-3 uppercase tracking-widest ${
                        isFull ? 'bg-red-100 text-red-600' 
                        : isWarning ? 'bg-orange-100 text-orange-600' 
                        : 'bg-emerald-100 text-emerald-600'
                      }`}>
                      {isFull ? 'Penuh' : isWarning ? 'Hampir Penuh' : 'Kosong'}
                    </span>
                  
                </div>
             </div>
          </div>

          {/* Detail Perangkat */}
          <div className="lg:w-1/2 p-8 flex flex-col justify-between">
            <div className="space-y-8">
              <div>
                <h2 className="mt-4 text-4xl font-bold text-slate-900 uppercase">{device.devices?.device_code}</h2>
                <div className="flex items-center gap-2 text-slate-400 font-medium mt-2 ">
                  <MapPin size={18} className="text-blue-600" />
                  <span>{device.devices?.lokasi}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Tinggi */}
                <div className="bg-slate-50 p-2 rounded-[32px]">
                  <p className="text-xs font-semibold text-slate-400 mb-2">Tinggi Sampah</p>
                  <p className="text-3xl font-bold text-slate-900">{device.tinggi}<span className="text-sm font-medium text-slate-400"> cm</span></p>
                  <div className="flex items-center gap-1">
                    <Trash2 size={10} className="text-blue-600" />
                    <p className="text-[10px] text-slate-400 font-medium">/ {device.devices?.tinggi_maks} cm</p>
                  </div>
                </div>

                {/* WiFi */}
                <div className="bg-slate-50 p-2 rounded-[32px]">
                  <p className="text-xs font-semibold text-slate-400 mb-2">Koneksi WiFi</p>
                  <p className="text-3xl font-bold text-slate-900 truncate">{systemData.rssi || 'No SSID'}<span className="text-sm font-medium text-slate-400"> dBm</span></p>
                  <div className="flex items-center gap-1">
                    <Wifi size={10} className="text-blue-600" />
                    <p className="text-[10px] text-slate-400 font-medium">{systemData.wifi_ssid}</p>
                  </div>
                </div> 

                {/* Baterai */}
                <div className="bg-slate-50 p-2 rounded-[32px]">
                  <p className="text-xs font-semibold text-slate-400 mb-2">Daya Perangkat</p>
                  <p className={`text-3xl font-bold ${Number(systemData.bat_pers) < 20 ? 'text-red-600' : 'text-slate-900'}`}>
                    {systemData.bat_pers}<span className="text-sm font-medium text-slate-400"> %</span>
                  </p>
                  <div className="flex items-center gap-1">
                    <BatteryMedium size={10} className="text-blue-600" />
                    <p className="text-[10px] text-slate-400 font-medium">{systemData.voltage} Volt</p>
                  </div>
                </div>

                {/* Update */}
                <div className="bg-slate-50 p-2 rounded-[32px]">
                   <p className="text-xs font-semibold text-slate-400 mb-2">Terakhir Update</p>
                   <p className="text-3xl font-bold text-slate-900">
                    {new Date(device.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })} 
                    <span className="text-sm font-medium text-slate-400"> WIB</span>
                   </p>
                    <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-400 pb-1">
                      <Clock size={10} className="text-blue-500"/>
                       {formatRelativeTime(device.updated_at)}
                    </div>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <button 
                disabled={device.persen < 50}
                className={`w-full py-4 rounded-[24px] font-semibold tracking-wider text-xs flex items-center justify-center gap-3 transition-all shadow-xl ${
                  device.persen >= 50 
                  ? 'bg-slate-900 text-white hover:bg-blue-600 shadow-blue-200' 
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                }`}
              >
                <Send size={18} /> MINTA PENGOSONGAN
              </button>
              <p className="text-center text-xs text-slate-400 tracking-widest">
                *Permintaan aktif otomatis jika kapasitas diatas 50%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* --- INFO CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6  ">

        {/* Sinyal */}
        <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm flex items-start gap-6">
          <div className={`p-4 rounded-2xl ${signal.color}`}><Wifi size={32} /></div>
          <div>
            <p className="text-xs font-semibold text-slate-400 tracking-wide">Kekuatan Sinyal</p>
            <h4 className={`text-xl font-bold mt-1 ${signal.color}`}>{signal.label}</h4>
            <div className="flex flex-col gap-0.5">
              <p className="text-[12px] font-medium text-slate-400 tracking-wider">
                Latensi: {signal.ms}ms
              </p>
            </div>
          </div>
        </div>

        {/* Estimasi */}
        <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm flex items-start gap-6">
          <div className={`p-4 rounded-2xl text-amber-600`}><Info size={32} /></div>
            <div>
              <p className="text-xs font-semibold text-slate-400 tracking-wide">Estimasi Penuh</p>
              <h4 className="text-xl font-bold text-slate-900 mt-1">
                {device.persen >= 80 ? 'Hari Ini' : device.persen >= 50 ? 'Besok' : '2-3 Hari Lagi'}
              </h4>
              <p className="text-[12px] font-medium text-slate-400 tracking-wider">Berdasarkan Tren</p>
            </div>
        </div>
        
        {/* Status */}
        <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm flex items-start gap-6">
          <div className={`p-4 rounded-2xl transition-all ${isOnline ? 'text-emerald-600' : 'text-red-600'}`}>
            {isOnline ? <Power size={24} /> : <PowerOff size={24} />}
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 tracking-wide">Status Perangkat</p>
            <h4 className={`text-xl font-bold mt-1 ${isOnline ? 'text-slate-900' : 'text-red-600'}`}>
              {isOnline ? 'Online' : 'Offline'}
            </h4>
            <div className="flex items-center gap-2">
              {isOnline && <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>}
              <p className="text-[12px] font-medium text-slate-400 tracking-wider">{device.devices?.device_code || 'Device tidak ditemukan'}</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;