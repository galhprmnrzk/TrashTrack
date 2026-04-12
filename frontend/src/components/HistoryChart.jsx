import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Clock, BarChart3, RefreshCw, Loader2 } from 'lucide-react'; 

const HistoryChart = ({ data, viewMode, setViewMode, onRefresh, loading, xKey, miniMode = false }) => {
  
  if (loading) {
    return (
      <div className="absolute inset-0 z-20 bg-slate-50/50 backdrop-blur-[1px] flex items-center justify-center rounded-xl">
        <Loader2 size={miniMode ? 20 : 24} className="animate-spin text-blue-600" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-normal tracking-widest bg-slate-100 rounded-xl">
        Belum ada data
      </div>
    );
  }

  return (
    <div className={`w-full ${miniMode ? 'h-full' : 'space-y-6'}`}>
      
      {/* Minimode (Home.jsx) */}
      {!miniMode && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-s font-semibold text-slate-600">Tren Kapasitas Sampah</h4>
            <p className="text-xs font-medium text-slate-400">{viewMode === 'daily' ? 'Data Real-time 24 Jam' : 'Rangkuman 7 Hari Terakhir'}</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onRefresh} className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-white transition-all active:scale-95"><RefreshCw size={16} /></button>
            <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200">
              <button onClick={() => setViewMode('daily')} className={`px-4 py-1.5 rounded-lg text-[10px] font-medium uppercase transition-all flex items-center gap-2 ${viewMode === 'daily' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}><Clock size={12} /> Hari ini</button>
              <button onClick={() => setViewMode('weekly')} className={`px-4 py-1.5 rounded-lg text-[10px] font-medium uppercase transition-all flex items-center gap-2 ${viewMode === 'weekly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}><BarChart3 size={12} /> 1 Minggu Terakhir</button>
            </div>
          </div>
        </div>
      )}

      {/* Chart */}
      <div className={`${miniMode ? 'h-full' : 'h-[350px]'} w-full relative`}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={miniMode ? { top: 0, right: 0, left: 0, bottom: 0 } : { top: 10, right: 10, left: -15, bottom: 20 }}>
            <defs>
              <linearGradient id="colorCap" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={miniMode ? 0.1 : 0.2}/>
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
              </linearGradient>
            </defs>
            
            {/* Sembunyikan jika minimode */}
            {!miniMode && <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="#f1f5f9" />}
            {!miniMode && (
              <XAxis dataKey={xKey} axisLine={false} tickLine={false} tick={{fill: '#45556ce=-', fontSize: 10, fontWeight: '500'}} dy={15} interval="preserveStartEnd" minTickGap={50} />
            )}
            {!miniMode && (
              <YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} axisLine={false} tickLine={false} tick={{fill: '#45556c', fontSize: 10, fontWeight: '500'}} width={45} tickFormatter={(value) => `${value}%`} />
            )}
            {!miniMode && (
              <Tooltip cursor={{ stroke: '#2563eb', strokeWidth: 2, strokeDasharray: '5 5' }} contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px 16px' }} itemStyle={{ fontWeight: '900', fontSize: '14px', color: '#1e293b' }} labelStyle={{ color: '#94a3b8', fontSize: '10px', fontWeight: 'bold', marginBottom: '4px', textTransform: 'uppercase' }} formatter={(value) => [`${value}%`, "Kapasitas"]} />
            )}

            <Area 
              type="monotone" 
              dataKey="kapasitas" 
              stroke="#2563eb" 
              strokeWidth={miniMode ? 2 : 4}
              strokeLinecap="round"
              fillOpacity={1} 
              fill="url(#colorCap)" 
              dot={false}
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default HistoryChart;