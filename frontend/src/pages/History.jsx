import React, { useEffect, useState } from 'react';
import { supabase } from '../api/supabaseClient';
import HistoryChart from '../components/HistoryChart';
import { TrendingUp, RotateCcw, Zap } from 'lucide-react';

const History = () => {
  const [chartData, setChartData] = useState([]);
  const [viewMode, setViewMode] = useState('daily'); 
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ avg: 0, resetCount: 0, peak: 0 });

  useEffect(() => {
    fetchMainData();
  }, [viewMode]);

  const fetchMainData = async () => {
    setLoading(true);
    try {
      let query = supabase.from('sampah_logs').select('created_at, persen');

      if (viewMode === 'daily') {
        const { data, error } = await query
          .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
          .order('created_at', { ascending: true });

        if (error) throw error;
        if (data) {
          const formatted = data.map(i => ({
            waktu: new Date(i.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
            kapasitas: Number(i.persen)
          }));
          setChartData(formatted);
          calculateStats(data);
        }
      } else {
        const { data, error } = await query
          .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
          .order('created_at', { ascending: true });  

        if (error) throw error;
        if (data) {
          const weeklyMap = {};
          data.forEach(item => {
            const dayName = new Date(item.created_at).toLocaleDateString('id-ID', { weekday: 'short' });
            if (!weeklyMap[dayName] || Number(item.persen) > weeklyMap[dayName]) {
              weeklyMap[dayName] = Number(item.persen);
            }
          });

          const formattedWeekly = Object.keys(weeklyMap).map(day => ({
            hari: day,
            kapasitas: weeklyMap[day]
          }));

          setChartData(formattedWeekly);
          calculateStats(data);
        }
      }
    } catch (err) {
      console.error("Fetch Error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    if (!data || data.length === 0) return;
    
    const values = data.map(d => Number(d.persen));
    const avg = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
    const peak = Math.max(...values);
    
    let resets = 0;
    for (let i = 0; i < data.length - 1; i++) {
      if (Number(data[i].persen) > 70 && Number(data[i+1].persen) < 20) {
        resets++;
      }
    }
    
    setStats({ avg, resetCount: resets, peak });
  };

  return (
    <div className="w-[100%] mx-auto py-10 pl-20 pr-30">
      
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 mt-10 pb-8">
        <div>
          <h1 className="text-4xl font-black mb-2">Riwayat Data</h1>
          <p className="text-lg text-slate-500 max-w-3xl">
            Analisis Historis kapasitas sampah dan aktivitas perangkat berdasarkan periode waktu.
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 mb-5 md:p-10 shadow-sm border border-slate-200/60 overflow-hidden group">
        <HistoryChart 
          data={chartData} 
          viewMode={viewMode}
          setViewMode={setViewMode}
          onRefresh={fetchMainData}
          loading={loading} 
          xKey={viewMode === 'daily' ? 'waktu' : 'hari'} 
        />
      </div>

      {/* Card */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
  
      {/* Rata-Rata */}
      <div className="bg-slate-800 p-10 rounded-4xl border border-slate-200/50 shadow-sm relative overflow-hidden group hover:scale-[1.02] transition-all">
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-[60px] h-[60px] mr-3 shrink-0 bg-slate-9000 rounded-2xl flex items-center justify-center text-blue-600 group-hover:text-white transition-all duration-500">
            <TrendingUp size={36} />
          </div>
          <div className="flex flex-col">
            <p className="text-xs font-bold text-slate-400 tracking-wider uppercase leading-none">Rata-rata Kapasitas</p>
            <h3 className="text-3xl font-bold mt-2 mb-1 text-slate-200 tracking-tighter leading-none">
              {stats.avg}<span className="text-2xl text-blue-600 ml-1">%</span>
            </h3>
            <p className="text-xs font-medium text-slate-400 leading-none">Stabilitas Pengisian</p>
          </div>
        </div>
        <TrendingUp className="absolute -right-4 -bottom-4 text-slate-400 opacity-[0.05] group-hover:opacity-[0.15] transition-opacity" size={100} />
      </div>

      {/* Jumlah Pengosongan */}
      <div className="bg-slate-800 p-10 rounded-4xl border border-slate-200/50 shadow-sm relative overflow-hidden group hover:scale-[1.02] transition-all">
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-[60px] h-[60px] mr-3 shrink-0 bg-slate-900d-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:text-white transition-all duration-500">
            <RotateCcw size={36} />
          </div>
          <div className="flex flex-col">
            <p className="text-xs font-bold text-slate-400 tracking-wider uppercase leading-none">Jumlah Pengosongan</p>
            <h3 className="text-3xl font-bold mt-2 mb-1 text-slate-200 tracking-tighter leading-none">
              {stats.resetCount}<span className="text-2xl text-emerald-600 ml-1">x</span>
            </h3>
            <p className="text-xs font-medium text-slate-400 leading-none">Dikosongkan Petugas</p>
          </div>
        </div>
        <RotateCcw className="absolute -right-4 -bottom-4 text-slate-400 opacity-[0.05] group-hover:opacity-[0.15] transition-opacity" size={100} />
      </div>

      {/* Kapasitas Tertinggi */}
      <div className="bg-slate-800 p-10 rounded-4xl border border-slate-200/50 shadow-sm relative overflow-hidden group hover:scale-[1.02] transition-all">
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-[60px] h-[60px] mr-3 shrink-0 bg-slate-800 rounded-2xl flex items-center justify-center text-red-600 group-hover:text-white transition-all duration-500">
            <Zap size={36} />
          </div>
          <div className="flex flex-col">
            <p className="text-xs font-bold text-slate-400 tracking-wider uppercase leading-none">Kapasitas Tertinggi</p>
            <h3 className="text-3xl font-bold mt-2 mb-1 text-slate-200 tracking-tighter leading-none">
              {stats.peak}<span className="text-2xl text-red-600 ml-1">%</span>
            </h3>
            <p className="text-xs font-medium text-slate-400 leading-none">Batas Maksimum</p>
          </div>
        </div>
        <Zap className="absolute -right-4 -bottom-4 text-slate-400 opacity-[0.05] group-hover:opacity-[0.15] transition-opacity" size={100} />
      </div>

    </div>

    </div>
  );
};

export default History;