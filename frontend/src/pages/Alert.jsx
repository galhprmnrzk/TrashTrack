import React, { useEffect, useState } from 'react';
import { supabase } from '../api/supabaseClient';
import { AlertTriangle, CheckCircle2, Clock, MapPin, RefreshCw, Eye } from 'lucide-react';

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

const AlertPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fungsi Fetch Data alerts
  const fetchAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from('alerts')
        .select('*, devices(*)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAlerts(data || []);
    } catch (error) {
      console.error('Error fetching alerts:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Realtime Subscription
  useEffect(() => {
    fetchAlerts();

    const channel = supabase
      .channel('realtime_alerts')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'alerts' }, 
        () => {
          fetchAlerts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Fungsi tandai dibaca
  const markAsRead = async (id) => {
    const { error } = await supabase
      .from('alerts')
      .update({ is_read: true })
      .eq('id', id);

    if (!error) {
      setAlerts(prev => prev.map(a => a.id === id ? { ...a, is_read: true } : a));
    }
  };

  const markAllAsRead = async () => {
  try {
    const { error } = await supabase
      .from('alerts')
      .update({ is_read: true })
      .eq('is_read', false);

    if (error) throw error;

    setAlerts(prev => prev.map(alert => ({ ...alert, is_read: true })));
  } catch (error) {
    console.error('Error marking all as read:', error.message);
  }
};

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <RefreshCw className="animate-spin text-blue-600" size={40} />
        <p className="font-normal text-slate-400 animate-pulse">Memuat Log Sistem...</p>
      </div>
    </div>
  );

  return (
    <div className="w-[100%] mx-auto py-10 pl-20 pr-30 h-screen flex flex-col overflow-hidden">
      
      {/* Hero Section */}
      <div className="w-full mt-10">
        <h1 className="text-4xl font-black mb-2">Notifikasi</h1>
      </div>

      {/* Header List */}
      <div className="w-full mx-auto md:pr-12 bg-[#f8fafc]"> 
        <p className="text-lg text-slate-500">
          Aktivitas dan peringatan terbaru
        </p>
        
        <div className="flex items-center justify-between mt-5">
            <div className="bg-white py-2 px-4 rounded-xl text-slate-400 bordershadow-sm">
              Total {alerts.length} Notifikasi
            </div>

          <div className="flex items-center gap-3 max-w-auto">
            <button 
              onClick={fetchAlerts}
              className="flex items-center gap-2 py-2 px-4 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 hover:border-blue-100 hover:shadow-md transition-all active:scale-90"
            ><RefreshCw size={18} />Segarkan
            </button>
            <button 
              onClick={markAllAsRead}
              className="flex items-center gap-2 py-2 px-4 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-emerald-600 hover:border-emerald-100 hover:shadow-md transition-all active:scale-90"
            >
              <CheckCircle2 size={18} />Tandai semua sebagai dibaca
            </button>
          </div>  
        </div> 
      </div>

      {/* List Notifikasi */}
      <main className="flex-1 overflow-y-auto px-8 md:px-12 pb-12 custom-scrollbar relative">
        <div className="sticky top-0 z-10 h-10 w-full bg-[#F8FAFC] backdrop-blur-md pointer-events-none -mb-10 mask-gradient"></div>
        <div className="max-w-full pt-4">
          {alerts.length === 0 ? (
            <div className="bg-white py-24 rounded-[40px] text-center border-2 border-dashed border-slate-200">
              <CheckCircle2 size={60} className="mx-auto mb-4 text-emerald-500 opacity-20" />
              <p className="text-2xl font-black text-slate-300">Belum ada notifikasi</p>
              <p className="text-slate-400">Semua peringatan akan ditampilkan di sini.</p>
            </div>
          ) : (
            alerts.map((alert) => (
              <div 
                key={alert.id} 
                className={`group bg-white p-6 md:p-8 rounded-[35px] border transition-all flex flex-col md:flex-row items-center gap-6 ${
                  alert.is_read 
                  ? 'opacity-60 border-slate-100 shadow-none' 
                  : 'border-white ring-1 ring-slate-100 shadow-lg shadow-slate-200/50'
                }`}
              >
                {/* Status Icon */}
                <div className={`p-4 rounded-[24px] flex-shrink-0 ${
                  alert.level === 'critical' 
                    ? 'bg-red-50 text-red-600' 
                    : alert.level === 'warning'
                      ? 'bg-orange-50 text-orange-600' 
                      : 'bg-blue-50 text-blue-600'   
                }`}>
                  <AlertTriangle size={36} />
                </div>

                {/* Content */}
                <div className="flex-1 text-center justify-between md:text-left">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                    <h3 className="text-xl font-bold text-slate-800 truncate">
                      {alert.devices?.device_code || 'UNKNOWN_DEV'}
                    </h3>
                    <span className={`text-xs font-medium px-3 py-1 rounded-full uppercase tracking-wider ${
                      alert.level === 'critical' 
                        ? 'bg-red-600 text-white' 
                        : alert.level === 'warning'
                          ? 'bg-orange-500 text-white' 
                          : 'bg-blue-500 text-white' 
                    }`}>
                      {alert.level === 'critical' ? 'Bahaya' : alert.level === 'warning' ? 'Peringatan' : 'Informasi'}
                    </span>
                  </div>
                  <p className="text-slate-500 font-semibold mb-3 text-l leading-tight tracking-tight">
                    {alert.pesan}
                  </p>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-slate-600 text-sm font-semibold">
                    <div className="flex items-center gap-1.5"><MapPin size={16} className="text-blue-500"/> {alert.devices?.lokasi || 'No Location'}</div>
                    <div className="flex items-center gap-1.5"><Clock size={16} className="text-blue-500"/> {formatRelativeTime(alert.created_at)}</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col items-center gap-2 flex-shrink-0">
                  {!alert.is_read ? (
                    <button 
                      onClick={() => markAsRead(alert.id)}
                      className="group/btn flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-2xl text-[14px] font-semibold hover:bg-blue-600 transition-all active:scale-95 shadow-lg shadow-slate-200"
                    >
                      <Eye size={16} className="group-hover/btn:scale-110 transition-transform" /> Tandai Dibaca
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 text-green-600 bg-emerald-50 px-7.5 py-2.5 rounded-2xl border border-green-400">
                      <CheckCircle2 size={14} />
                      <span className="text-[14px] font-semibold">Telah Dibaca</span>
                    </div>
                  )}
                  <p className="text-[10px] font-semibold text-slate-400 tracking-widest">
                    {new Date(alert.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </main>


      {/* CSS untuk Scrollbar Cantik */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
          margin: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 20px;
          border: 2px solid #f8fafc;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
        .mask-gradient {
          mask-image: linear-gradient(to bottom, black 50%, transparent 100%);
          -webkit-mask-image: linear-gradient(to bottom, black 50%, transparent 100%);
        }
      `}</style>
    </div>
  );
};

export default AlertPage;