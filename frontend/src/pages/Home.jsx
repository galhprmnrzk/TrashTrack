import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../api/supabaseClient'; 
import {BarChart3, ArrowRight, Bell, Loader2 } from 'lucide-react';
import HistoryChart from '../components/HistoryChart'; 

// Format waktu
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

const Home = () => {
  const [miniChartData, setMiniChartData] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loadingChart, setLoadingChart] = useState(true);
  const [loadingAlerts, setLoadingAlerts] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    setLoadingChart(true);
    setLoadingAlerts(true);
    
    try {
      // Fetch Data Chart
      const { data: chartData, error: chartError } = await supabase
        .from('sampah_logs')
        .select('created_at, persen')
        .order('created_at', { ascending: false })
        .limit(15);

      if (chartError) throw chartError;
      setMiniChartData(chartData.map(i => ({
        waktu: new Date(i.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        kapasitas: Number(i.persen)
      })).reverse());

      // Fetch Data Alerts
      const { data: alertData, error: alertError } = await supabase
        .from('alerts')
        .select('*, devices(device_code)')
        .order('created_at', { ascending: false })
        .limit(3);

      if (alertError) throw alertError;
      setAlerts(alertData || []);

    } catch (err) {
      console.error("Home Data Fetch Error:", err.message);
    } finally {
      setLoadingChart(false);
      setLoadingAlerts(false);
    }
  };

  return (
    <div className="w-[100%] mx-auto py-10 pl-20 pr-30">
      {/* Hero Section */}
      <div className="h-[100%] mt-10 mb-10">
        <h1 className="text-4xl font-black mb-2">Halo, Admin</h1>
        <p className="text-lg text-slate-500 max-w-3xl">
          Selamat Datang di <span className="text-blue-600 font-bold">TrashTrack!</span>
        </p>
      </div>

      {/* Banner Realtime */}
      <div className="bg-slate-800 py-14 px-8 rounded-2xl mb-10 flex flex-col md:flex-row items-center justify-between shadow-2xl shadow-blue-200/50 relative overflow-hidden group">
        <div className="relative z-10">
          <h2 className="text-4xl font-bold  text-white leading-tight">
            Pantau ketinggian <span className="text-green-500">sampah</span><br />
             secara<span className="text-blue-500"> realtime!</span>
          </h2>
          <p className="text-blue-100 text-[14px] font-light tracking-wider mt-1 opacity-80">Hubungkan ke TrashTrack IoT Device!</p>
        </div>
        <Link 
          to="/dashboard" 
          className="relative z-10 mr-6 mt-8 md:mt-0 flex items-center bg-white text-blue-600 px-8 py-3 rounded-[24px] font-extrabold uppercase text-xs tracking-[0.1em] hover:bg-slate-900 hover:text-white transition-all shadow-xl active:scale-95"
        >
          Lihat Dashboard <ArrowRight className="ml-2" size={18} />
        </Link>
        <BarChart3 className="absolute -right-16 -bottom-16 text-blue-500 opacity-20 rotate-12 transition-transform group-hover:rotate-0 duration-1000" size={300} />
      </div>

      {/* Grid Utama */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Preview Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[36px] shadow-sm border border-slate-100 relative">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-s font-semibold text-slate-500 flex items-center gap-2">Grafik Kapasitas Sampah</h3>
          </div>
          <div className="h-[200px] w-full bg-slate-50/50 rounded-3xl p-4 relative">
            <HistoryChart data={miniChartData} miniMode={true} loading={loadingChart} xKey="waktu" /> 
          </div>
          <div className="mt-10 mb-0 flex justify-end">
            <Link 
              to="/history" 
              className="inline-flex items-center bg-blue-500 text-white px-5 py-2.5 rounded-4xl font-semibold text-s tracking-wide hover:bg-blue-700 transition-all shadow-lg active:scale-95 border border-slate-100"
            >
              Analisis lebih lanjut
            </Link>
          </div>
        </div>

        {/* Notifikasi */}
        <div className="bg-white p-8 rounded-[36px] shadow-sm border border-slate-100 flex flex-col min-h-full">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-s font-semibold text-slate-500 flex items-center gap-2">
              <Bell size={18} className="text-red-500" /> Peringatan
            </h3>
          </div>
          
          {/* Konten Alert */}
          <div className="flex-1">
            {loadingAlerts ? (
              <div className="flex items-center justify-center h-20 text-slate-300 animate-pulse">
                <Loader2 className="animate-spin" />
              </div>
            ) : alerts.length > 0 ? (
              alerts.map((alert) => (
                <div key={alert.id} className="flex items-start gap-4 p-2.5 rounded-2xl transition-all">
                  <div className={`mt-1 w-2.5 h-2.5 rounded-full ${
                    alert.level === 'critical' 
                        ? 'bg-red-600' 
                        : alert.level === 'warning'
                          ? 'bg-orange-500' 
                          : 'bg-blue-500'
                  }`}></div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 "> 
                        {alert.devices?.device_code || 'UNKNOWN_DEV'}
                      </p>
                      {!alert.is_read && (
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                      )}
                    </div>
                    <p className="text-sm font-bold text-slate-800 leading-tight mt-1 line-clamp-2">
                      {alert.pesan}
                    </p>
                    <div className="text-[10px] text-slate-400 font-medium mt-1">
                       {formatRelativeTime(alert.created_at)}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sistem Aman</p>
                <p className="text-[8px] text-slate-300 font-bold mt-1 uppercase italic">Tidak ada pesan peringatan</p>
              </div>
            )}
          </div>

          {/* Tombol Lihat Semua di Kanan Bawah */}
          <div className="mt-4 mb-0 flex justify-end">
            <Link 
              to="/alerts" 
              className="inline-flex items-center bg-blue-500 text-white px-5 py-2.5 rounded-4xl font-semibold text-s tracking-wide hover:bg-blue-700 transition-all shadow-lg active:scale-95 border border-slate-100"
            >
              Lihat Semua
            </Link>
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default Home;