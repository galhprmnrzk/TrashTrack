import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../api/supabaseClient';
import { 
  Users, Cpu, Bell, Shield, Plus, Trash2, Edit3, 
  Save, CheckCircle2, AlertCircle, ChevronRight,
  HardDrive, Wifi, Database, Activity, Search,
  ShieldCheck, ShieldAlert
} from 'lucide-react';

const SystemPage = () => {
  const [activeTab, setActiveTab] = useState('accounts');
  const [loading, setLoading] = useState(false);
  const [notif, setNotif] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Data States
  const [accounts, setAccounts] = useState([]);
  const [devices, setDevices] = useState([]);
  const [stats, setStats] = useState({ notifs: 0, logs: 0 });
  const [wifiConfig, setWifiConfig] = useState({ wifi_ssid: '', wifi_pass: '' });

  useEffect(() => {
    fetchAllData();
  }, [activeTab]);

  const fetchAllData = async () => {
    setLoading(true);
    
    // Fetch Accounts
    const { data: accs } = await supabase
      .from('users')
      .select('*');

    setAccounts(accs || []);

    // Fetch Devices
    const { data: devs } = await supabase
      .from('devices')
      .select('*');
    
    setDevices(devs || []);

    // Fetch Stats
    const { count: notifCount } = await supabase
      .from('alerts')
      .select('*', { count: 'exact', head: true });
    
    const { count: logCount } = await supabase
      .from('sampah_logs')
      .select('*', { count: 'exact', head: true });
    
    setStats({ notifs: notifCount || 0, logs: logCount || 0 });

    // Fetch Config
    const { data: config } = await supabase
      .from('device_system_status')
      .select('*')
      .eq('device_id', '071a4e4d-311e-4273-b65b-57462ad9e5b4')
      .single();

    if (config) {
      setWifiConfig({
        wifi_ssid: config.wifi_ssid || '',
        wifi_pass: config.wifi_pass || '',
        device_id: config.device_id 
      });
    } // <--- Tadi kamu lupa tutup kurung ini
    
    setLoading(false);
  };

  const handleSaveWifi = async () => {
    const { error } = await supabase
      .from('device_system_status')
      .update({       
        wifi_ssid: wifiConfig.wifi_ssid, 
        wifi_pass: wifiConfig.wifi_pass,
        updated_at: new Date()
      })
      .eq('device_id', '071a4e4d-311e-4273-b65b-57462ad9e5b4');

    if (!error) {
      showNotif("Konfigurasi WiFi berhasil diperbarui!");
      setIsEditing(false); // Kembali ke mode tampilan info
    } else {
      showNotif("Gagal update: " + error.message);
    }
  };

  const showNotif = (msg) => {
    setNotif(msg);
    setTimeout(() => setNotif(null), 3000);
  };

  const TabButton = ({ id, label, icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center justify-between w-full px-6 py-3 rounded-4xl font-medium text-[14px] transition-all duration-300 ${
        activeTab === id 
        ? 'bg-blue-600 text-white' 
        : 'bg-white text-slate-400 hover:bg-slate-200'
      }`} 
    >   
      <div className="flex items-center gap-5">{icon}{label}</div>
      {activeTab === id && <ChevronRight size={14} />}
    </button>
  );

  return (
    <div className="w-[100%] mx-auto py-10 pl-20 pr-30">
        
        {/* Hero Section */}
        <div className="h-[100%] mt-10 mb-10">
          <h1 className="text-4xl font-black mb-2">Sistem Admin</h1>
          <p className="text-lg text-slate-500 max-w-3xl">Mengelola keseluruhan website</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar */}
          <nav className="lg:col-span-3 flex flex-col gap-1.5">
            <TabButton id="accounts" label="Kelola Akun" icon={<Users size={18} />} />
            <TabButton id="devices" label="Kelola Perangkat" icon={<Cpu size={18} />} />
            <TabButton id="notifications" label="Kelola Notifikasi" icon={<Bell size={18} />} />
            <TabButton id="system" label="Kelola Jaringan" icon={<Wifi size={18} />} />
          </nav>

          {/* MAIN PANEL */}
          <main className="lg:col-span-9 bg-white rounded-[48px] p-8 md:px-10 py-2 shadow-sm border border-slate-100 relative overflow-hidden">
            
            {/* Akun */}
            {activeTab === 'accounts' && (
              <section className="animate-in fade-in slide-in-from-bottom-4">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-3xl font-bold tracking-tight text-slate-900">Kelola Akun</h3>
                  <Link to="/adduser"  className="bg-slate-900 text-white px-5 py-1.5 rounded-4xl font-semibold text-[14px] flex items-center hover:bg-blue-500 gap-1 transition-transform">
                    <Plus size={14}  /> Tambah Akun
                  </Link>
                </div>
                <div className="flex-1 overflow-y-auto overflow-x-auto custom-scrollbar pr-2" style={{ maxHeight: '600px' }}>
                  <table className="w-full text-center table-auto min-w-[800px]">
                    <thead className="sticky top-0 bg-white z-10">
                      <tr className="text-[14px] text-slate-400 border-b border-slate-200">
                        <th className="pb-4 px-4 w-[30%] font-medium">Nama Pengguna</th>
                        <th className="pb-4 w-[25%] font-medium">Email</th>
                        <th className="pb-4 w-[15%] font-medium">No.Telepon </th>
                        <th className="pb-4 w-[15%] font-medium">Peran</th>
                        <th className="pb-4 w-[15%] font-medium">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {accounts.map(acc => (
                        <tr key={acc.id} className="group hover:bg-slate-1  00 transition-colors">
                          <td className="py-5 px-2 flex items-center gap-4 ">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-[14px] shrink-0">
                              {acc.nama?.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-semibold text-slate-700 truncate">{acc.nama}</span>
                          </td>
                          <td className="py-5">
                            <span className="py-1 rounded-full text-[14px] font-medium text-slate-500 truncate block">
                              {acc.email || 'Tidak ada Email'}
                            </span>
                          </td>
                          <td className="py-5">
                            <span className="py-1 rounded-full text-[14px] font-medium text-slate-500 truncate block">
                              {acc.phone || 'Tidak ada Email'}
                            </span>
                          </td>
                          <td className="py-5">
                            <span className={`py-1 px-10 rounded-2xl text-[10px] font-bold uppercase ${acc.role === 'admin' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                              {acc.role || 'user'}
                            </span>
                          </td>
                          <td className="py-5">
                            <div className="flex justify-center gap-2">
                              <Link to="/edituser" className="p-2 hover:text-blue-600 transition-colors"><Edit3 size={16}/></Link>
                              <button className="p-2 hover:text-red-600 transition-colors"><Trash2 size={16}/></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* TAB: DEVICES */}
            {activeTab === 'devices' && (
              <section className="animate-in fade-in slide-in-from-bottom-4">
                <div className="flex justify-between items-center mb-10">
                  <h3 className="text-3xl font-bold tracking-tight text-slate-900">Kelola Perangkat</h3>
                  <Link to="/adddevice"  className="bg-slate-900 text-white px-5 py-1.5 rounded-4xl font-semibold text-[14px] flex items-center hover:bg-blue-500 gap-1 transition-transform">
                    <Plus size={14}  /> Tambah Perangkat
                  </Link>
                </div>
                <div className="flex-1 overflow-y-auto overflow-x-auto custom-scrollbar pr-2" style={{ maxHeight: '600px' }}>
                  <table className="w-full text-center table-auto min-w-[800px]">
                    <thead className="sticky top-0 bg-white z-10">
                      <tr className="text-[14px] text-slate-400 border-b border-slate-200">
                        <th className="pb-4 px-4 w-[30%] font-medium">Kode Device</th>
                        <th className="pb-4 w-[25%] font-medium">Modul</th>
                        <th className="pb-4 w-[15%] font-medium">Lokasi</th>
                        <th className="pb-4 w-[15%] font-medium">Tinggi</th>
                        <th className="pb-4 w-[15%] font-medium">Status</th>
                        <th className="pb-4 w-[15%] font-medium">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {devices.map(dev => (
                        <tr key={dev.id} className="py-5 group hover:bg-slate-100 transition-colors">
                          <td className="py-5">
                            <span className="py-1 rounded-full text-[14px] font-medium truncate block">
                              {dev.device_code || 'N/A'}
                            </span>
                          </td>
                          <td className="py-5">
                            <span className="py-1 rounded-full text-[14px] font-medium text-slate-500 truncate block">
                              {dev.device_name || 'N/A'}
                            </span>
                          </td>
                          <td className="py-5">
                            <span className="py-1 rounded-full text-[14px] font-medium text-slate-500 truncate block">
                              {dev.lokasi || 'N/A'}
                            </span>
                          </td>
                          <td className="py-5">
                            <span className="py-1 px-10 rounded-2xl text-[14px] text-slate-500 font-medium truncate block">
                              {dev.tinggi_maks || 'N/A'}
                            </span>
                          </td>
                          <td className="py-5">
                            <span className={`py-1 px-10 rounded-2xl text-[14px] font-medium truncate block uppercase
                              ${dev.status === 'aktif' ? 'text-green-500' : 'text-red-500'}`}>
                              ● {dev.status || 'Tidak Aktif'}
                            </span>
                          </td>
                          <td className="py-5">
                            <div className="flex justify-center gap-2">
                              <Link to="/editdevice" className="p-2 hover:text-blue-600 transition-colors"><Edit3 size={16}/></Link>
                              <button className="p-2 hover:text-red-600 transition-colors"><Trash2 size={16}/></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* TAB: NOTIFICATIONS */}
            {activeTab === 'notifications' && (
              <section className="animate-in fade-in slide-in-from-bottom-4 text-center py-10">
                <div className="bg-amber-50 text-amber-600 p-8 rounded-[40px] inline-block mb-6"><Bell size={48}/></div>
                <h3 className="text-3xl font-black tracking-tighter mb-2">ALERT MANAGEMENT</h3>
                <p className="text-slate-400 font-bold mb-8 uppercase text-xs tracking-widest">Total Active Alerts: <span className="text-slate-800">{stats.notifs}</span></p>
                <div className="flex flex-col gap-3 max-w-xs mx-auto">
                  <button onClick={() => showNotif("Semua notifikasi dihapus!")} className="bg-slate-900 text-white py-4 rounded-2xl font-black text-xs hover:bg-red-600 transition-colors uppercase">Clear All Notifications</button>
                </div>
              </section>
            )}

            {/* TAB: LOGS */}
            {activeTab === 'logs' && (
              <section className="animate-in fade-in slide-in-from-bottom-4">
                <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden mb-8">
                  <Database className="absolute -right-4 -bottom-4 opacity-10" size={160} />
                  <h3 className="text-xl font-black mb-1 uppercase tracking-widest">Database Storage</h3>
                  <p className="text-slate-400 font-bold text-sm mb-6 uppercase">Tracking system activities</p>
                  <div className="flex items-end gap-2">
                    <span className="text-6xl font-black tracking-tighter">{stats.logs}</span>
                    <span className="text-sm font-black mb-2 opacity-40 uppercase">Total Entries</span>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button className="flex-1 bg-slate-100 text-slate-600 py-5 rounded-3xl font-black text-xs uppercase hover:bg-slate-200 transition-colors">Download CSV Report</button>
                  <button onClick={() => showNotif("Logs telah dibersihkan!")} className="flex-1 bg-red-50 text-red-600 py-5 rounded-3xl font-black text-xs uppercase hover:bg-red-600 hover:text-white transition-all">Flush System Logs</button>
                </div>
              </section>
            )}

            {/* TAB: SYSTEM CONFIG */}
            {activeTab === 'system' && (
              <section className="animate-in fade-in slide-in-from-bottom-4">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-black italic tracking-tight uppercase">Network Configuration</h3>
                  {!isEditing && (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="bg-slate-900 text-white px-5 py-2 rounded-2xl font-bold text-xs flex items-center gap-2 hover:bg-blue-600 transition-all"
                    >
                      <Edit3 size={14} /> UBAH KONEKSI
                    </button>
                  )}
                </div>

                <div className="space-y-6">
                  <div className={`p-8 rounded-[40px] border transition-all duration-500 ${isEditing ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-100'}`}>
                    <div className="flex items-center gap-4 mb-8">
                      <div className={`p-3 rounded-2xl shadow-sm ${isEditing ? 'bg-blue-600 text-white' : 'bg-white text-slate-400'}`}>
                        <Wifi size={24}/>
                      </div>
                      <div>
                        <p className="font-black text-slate-900 uppercase text-xs tracking-widest">
                          {isEditing ? 'Editing Access Point' : 'Current Network Status'}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Device ID: {wifiConfig.device_id?.split('-')[0]}...</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* SSID SECTION */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">SSID Name</label>
                        {isEditing ? (
                          <input 
                            type="text" 
                            value={wifiConfig.wifi_ssid} 
                            onChange={(e) => setWifiConfig({...wifiConfig, wifi_ssid: e.target.value})}
                            className="w-full px-6 py-4 bg-white border-2 border-blue-500 rounded-2xl outline-none font-bold text-slate-700 shadow-md animate-in zoom-in-95" 
                          />
                        ) : (
                          <div className="px-6 py-4 bg-white/50 rounded-2xl border border-slate-100 font-bold text-slate-600 flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            {wifiConfig.wifi_ssid || 'Not Set'}
                          </div>
                        )}
                      </div>

                      {/* PASSWORD SECTION */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Network Password</label>
                        {isEditing ? (
                          <input 
                            type="text" 
                            value={wifiConfig.wifi_pass} 
                            onChange={(e) => setWifiConfig({...wifiConfig, wifi_pass: e.target.value})}
                            className="w-full px-6 py-4 bg-white border-2 border-blue-500 rounded-2xl outline-none font-bold text-slate-700 shadow-md animate-in zoom-in-95" 
                          />
                        ) : (
                          <div className="px-6 py-4 bg-white/50 rounded-2xl border border-slate-100 font-bold text-slate-600">
                            ••••••••••••
                          </div>
                        )}
                      </div>
                    </div>

                    {/* ACTION BUTTONS (Hanya muncul saat editing) */}
                    {isEditing && (
                      <div className="flex gap-3 mt-10 animate-in slide-in-from-top-2">
                        <button 
                          onClick={handleSaveWifi}
                          className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black text-xs uppercase hover:bg-blue-700 shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
                        >
                          <Save size={16}/> Save & Broadcast Update
                        </button>
                        <button 
                          onClick={() => setIsEditing(false)}
                          className="px-8 bg-white text-slate-400 py-4 rounded-2xl font-black text-xs uppercase border border-slate-200 hover:bg-slate-100"
                        >
                          Batal
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            )}

          </main>
        </div>
    </div>
  );
};

<style>{`
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #cbd5e1;
  }
`}</style>

export default SystemPage;