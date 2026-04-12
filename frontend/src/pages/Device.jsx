import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../api/supabaseClient';
import { 
  Wifi, Zap, Cpu, MapPin, 
  BatteryMedium, Info, ArrowUpToLine, RefreshCw, ArrowRight
} from 'lucide-react';

const DevicePage = () => {
  const [sys, setSystemData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSystemStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('device_system_status')
        .select('*, devices(*)')
        .limit(1)
        .single();
      
      if (error) throw error;
      setSystemData(data);
    } catch (err) {
      console.error("Gagal mengambil data:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSystemStatus();
    const systemChannel = supabase.channel('system_sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'device_system_status' }, fetchSystemStatus)
      .subscribe();
    return () => supabase.removeChannel(systemChannel);
  }, []);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <RefreshCw className="animate-spin text-blue-600" size={30} />
    </div>
  );

  if (!sys) return <div className="p-20 text-center font-semibold text-slate-400">Perangkat tidak ditemukan</div>;

  const isOnline = (new Date().getTime() - new Date(sys.updated_at).getTime()) < 60000;
  const isActive = sys.devices?.status === 'aktif';

  return (
    <div className="w-[100%] mx-auto py-10 pl-20 pr-30">
      
      {/* Hero Section */}
      <div className="h-[100%] mt-10 mb-10">
        <h1 className="text-4xl font-black mb-2">Informasi Perangkat</h1>
        <p className="text-lg text-slate-500 max-w-3xl">
          Informasi Perangkat <span className="text-blue-600 font-bold">TrashTrack!</span>
        </p>
      </div>

      {/* Main Container */}
      <div className="w-full bg-white rounded-[40px] shadow-2xl border border-slate-200 overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side: Identitas Perangkat */}
        <div className="w-full md:w-[40%] bg-slate-900 p-10 text-white flex flex-col justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1 mt-2"> Deskripsi Perangkat</p>
            <h1 className="text-5xl font-bold mb-2.5 uppercase">
              {sys.devices?.device_code || 'N/A'}
            </h1>
            
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6 ${
              isActive ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
            }`}>
              {isActive ? '● Aktif' : '○ Tidak Aktif'}
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Cpu size={18} className="text-blue-500 shrink-0" />
                <p className="text-m font-semibold tracking-tight text-slate-400">
                  {sys.devices?.device_name || 'Nama Perangkat tidak ditemukan'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={18} className="text-blue-500 shrink-0" />
                <p className="text-m font-semibold tracking-tight text-slate-200">
                  {sys.devices?.lokasi || 'Lokasi tidak ditemukan'}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Info size={18} className="text-blue-500 mt-1 shrink-0" />
                <p className="text-sm leading-relaxed text-slate-400">
                  {sys.devices?.deskripsi || 'Tidak ada deskripsi perangkat.'}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10">
            <p className="text-[10px] font-semibold text-slate-500 mb-1">Dibuat pada</p>
            <p className="text-xs text-slate-300">
              {sys.devices?.created_at ? new Date(sys.devices.created_at).toLocaleString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false
                }).replace('.', ':')
                : 'N/A'
              }
            </p>
          </div>
        </div>

        {/* Right Side: Status System */}
        <div className="w-full md:w-[60%] p-10 bg-white">
          <div className="flex justify-between mb-10 mt-2">
            <h2 className="text-xs font-medium text-slate-500 uppercase tracking-wider pl-6 ">Kondisi Perangkat</h2>
            <div className={`inline-flex items-center px-6 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
              isOnline ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
            }`}>
              {isOnline ? 'Online' : 'Offline'}
            </div>
          </div>
          
          
          <div className="grid grid-cols-2 gap-4">  

            {/* Baterai */}
            <div className="p-8 border border-slate-200 rounded-3xl">
              <div className="flex items-center justify-between mb-3 text-slate-400">
                <BatteryMedium size={20} className={sys.bat_pers < 20 ? 'text-red-500' : 'text-emerald-500'} />
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Baterai</span>
              </div>
              <div className="text-3xl font-bold text-slate-800">{sys.bat_pers}%</div>
              <div className="flex items-center gap-1 text-xs text-slate-500">
                Tegangan Baterai : {sys.voltage}  V
              </div>
            </div>

            {/* Jaringan */}
            <div className="p-8 border border-slate-200 rounded-3xl">
              <div className="flex items-center justify-between mb-3 text-slate-400">
                <Wifi size={20} className="text-blue-500" />
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Jaringan</span>
              </div>
              <div className="text-2xl font-bold text-slate-800">
                {sys.wifi_ssid || 'Tidak ada Sinyal'}
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-500">
                RSSI: <span className="text-blue-600">{sys.rssi} dBm</span>
              </div>
            </div>

            {/* Ketinggian */}
            <div className="col-span-2 p-6 rounded-[30px] flex items-center justify-between mb-3 text-slate-400 border border-slate-200 rounded-3xl ">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl shadow-sm text-blue-600">
                  <ArrowUpToLine size={32} />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Ketinggian Tempat Sampah</p>
                  <p className="text-2xl font-bold text-slate-800">{sys.devices?.tinggi_maks || 'N/A'} 
                    <span className="text-sm font-medium text-slate-400"> cm</span>
                  </p>
                </div>
              </div>
              <Link to="/dashboard" className="flex items-center gap-2 text-slate-500 text-sm group">
                  Lihat Ketinggian sampah
                  <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform text-blue-500" />
              </Link>
            </div>

            {/* Informasi tambahan */}
            <div className="col-span-2 flex items-center justify-between px-4 py-2 border-t border-slate-50 mt-4">
              <div className="flex items-center gap-2">
                <Cpu size={14} className="text-slate-300" />
                <span className="text-[9px] text-slate-400">Modul Utama: {sys.devices?.device_name || 'Perangkat tidak diketahui'}</span>
              </div>
              <span className="text-[9px] text-slate-300 uppercase">ID: {sys.device_id.slice(0, 12)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevicePage;