import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, Cpu, ShieldCheck, Layers, Database, Server, Wifi, Wind } from 'lucide-react';
import Navbar from '../components/Navbar';
import Logo from '../components/Logo';

const DeveloperAvatar = ({ photoUrl, name }) => {
  const [imageError, setImageError] = useState(false);
  const avatarClass = "shrink-0 w-28 h-auto rounded-full overflow-hidden relative z-20";

  if (photoUrl && !imageError) {
    return (
      <div className={avatarClass}>
        <img 
          src={photoUrl} 
          alt={name} 
          className="w-full h-full object-cover transition-transform duration-500"
          onError={() => setImageError(true)} 
        />
        <div className="absolute -bottom-4 inset-x-0 h-12 bg-gradient-to-t from-slate-600 via-slate-500 to-transparent blur-sm transition-all duration-500"></div>
      </div>
    );
  }

  return (
    <div className={`${avatarClass} bg-slate-800 flex items-center justify-center`}>
      <span className="text-4xl font-black text-white">{name.charAt(0)}</span>
    </div>
  );
};

const LandingPage = () => {
  const technologies = [
    { name: "React", icon: <Layers />, color: "group-hover:text-cyan-400", desc: "Library modern untuk membangun antarmuka dashboard yang responsif." },
    { name: "Supabase", icon: <Database />, color: "group-hover:text-emerald-500", desc: "Backend dan database real-time untuk pengelolaan data sistem." },
    { name: "Node.js", icon: <Server />, color: "group-hover:text-green-500", desc: "Runtime server untuk memproses logika dan integrasi sistem." },
    { name: "MQTT", icon: <Wifi />, color: "group-hover:text-purple-500", desc: "Protokol komunikasi ringan untuk pertukaran data perangkat IoT." },
    { name: "ESP8266", icon: <Cpu />, color: "group-hover:text-orange-500", desc: "Mikrokontroler IoT untuk mengirim data sensor secara real-time." },
    { name: "Tailwind", icon: <Wind />, color: "group-hover:text-sky-400", desc: "Framework CSS modern untuk desain antarmuka yang bersih." },
  ];

  const developers = [
    { 
      name: "Galih Permana Rizki", 
      role: "Frontend", 
      desc: "Mengembangkan dashboard berbasis React serta integrasi data dengan Supabase.", 
      photoUrl: "/assets/Galih.png" 
    },
    { 
      name: "Rasya Irham Fadhilah", 
      role: "IoT & Hardware", 
      desc: "Mengembangkan sistem perangkat IoT menggunakan ESP8266 dan MQTT.",
      photoUrl: "/assets/Rasya.png" 
    },
    { 
      name: "Zakky Fadhlur Rohman", 
      role: "Backend", 
      desc: "Mengelola integrasi data MQTT serta mengelola integrasi notifikasi Telegram.",
      photoUrl: "/assets/Zakky.png"
    }
  ];

  return (
    <div className="bg-slate-950 text-white font-sans overflow-x-hidden min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative px-8 md:px-20 pt-32 pb-20 lg:pt-48 lg:pb-32 flex flex-col items-center text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
          <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-600/20 blur-[120px] rounded-full"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 via-slate-950/80 to-slate-950"></div>
        </div>

        <div className="relative z-10 mt-10">
          <h1 className="text-6xl md:text-8xl font-bold leading-[1.1] tracking-tight mb-10 mt-10 max-w-8xl">
            Pantau <span className="text-green-600">Sampah</span> <br/>
            Kelola lebih <span className="text-blue-500">Pintar.</span>
          </h1>
          <p className="text-slate-400 text-center mx-auto text-lg md:text-xl leading-[1.6] max-w-2xl mb-8">
            Pantau kapasitas sampah, kondisi perangkat, dan lokasi tempat sampah secara real-time dengan platform monitoring IoT yang cerdas.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-2xl mx-auto mb-12">
            <Link to="/login" className="flex-1 flex items-center justify-center gap-3 bg-blue-600 text-white px-10 py-3 rounded-[24px] font-semibold text-lg hover:bg-blue-700 hover:flex-2 duration-300 transition-all shadow-2xl shadow-blue-900/40">
              Coba Sekarang <ArrowRight size={20} />
            </Link>
            <Link to="/help" className="flex-1 flex items-center justify-center px-10 py-3 rounded-[24px] font-semibold text-lg border border-slate-800 bg-slate-900/50 hover:bg-slate-800 hover:flex-2 duration-300 transition-all text-slate-300">
              Pelajari Cara Kerja
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="px-8 md:px-20 py-20 relative overflow-hidden scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            
          <div className="flex-1 relative group">
            <div className="absolute -inset-4 bg-blue-600/10 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            <div className="relative bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[48px] p-12 lg:p-20 overflow-hidden flex items-center justify-center min-h-[400px]">
              
              <div className="absolute top-8 left-10 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-slate-800"></div>
                <div className="w-2 h-2 rounded-full bg-slate-800"></div>
                <div className="w-2 h-2 rounded-full bg-slate-800"></div>
              </div>

              <div className="relative z-10 transition-all duration-700 grayscale group-hover:grayscale-0 opacity-30 group-hover:opacity-100 group-hover:scale-110">
                <Logo className="w-auto h-50 md:w-auto md:80" />
              </div>
            </div>
          </div>

            {/* Kanan: Content */}
            <div className="flex-1 space-y-8">
              <div>
                <h3 className="text-4xl md:text-4xl font-bold leading-tight tracking-tight">Teknologi Cerdas untuk <br/> 
                  <span className="text-green-600">Lingkungan </span>
                  yang lebih   
                  <span className='text-blue-500'> Bersih.</span>
                </h3>
              </div>
              
              <p className="text-slate-400 text-s leading-relaxed font-regular">
                TrashTrack adalah platform monitoring sampah 
                <span className="text-white "> berbasis IoT 
                </span> yang membantu mengoptimalkan pengangkutan sampah secara efisien melalui pemantauan real-time. 
              </p>

              <div className="pt-4">
                <Link to="/help" className="flex items-center gap-2 text-white font-medium text-sm uppercase hover:text-slate-400 tracking-widest group">
                  Lihat Cara Kerja
                  <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform text-blue-500" />
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-14">
            <div className="bg-slate-900/50 p-10 rounded-[40px] border border-slate-800 hover:border-blue-500/50 transition-all group">
              <div className="bg-blue-500/10 text-blue-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <BarChart3 size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Analisis Real-time</h3>
              <p className="text-slate-500 leading-relaxed text-sm">Pantau perubahan kapasitas sampah secara real-time dengan data akurat dari sensor ultrasonik.</p>
            </div>
            <div className="bg-slate-900/50 p-10 rounded-[40px] border border-slate-800 hover:border-emerald-500/50 transition-all group">
              <div className="bg-emerald-500/10 text-emerald-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Cpu size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Kesehatan Perangkat</h3>
              <p className="text-slate-500 leading-relaxed text-sm">Pantau kesehatan perangkat secara real-time, termasuk baterai, tegangan, dan kualitas jaringan.</p>
            </div>
            <div className="bg-slate-900/50 p-10 rounded-[40px] border border-slate-800 hover:border-amber-500/50 transition-all group">
              <div className="bg-amber-500/10 text-amber-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Notifikasi Pintar</h3>
              <p className="text-slate-500 leading-relaxed text-sm">Notifikasi otomatis saat kapasitas sampah mencapai batas kritis untuk efisiensi pengangkutan.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Teknologi Section */}
      <section id="tech" className="py-24 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-8">
          <p className="text-center text-sm font-semibold text-slate-600 uppercase tracking-[0.4em] mb-16">
            Dibangun dengan Teknologi Modern
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {technologies.map((tech, index) => (
              <div key={index} className="group p-10 rounded-[40px] border border-slate-900 bg-slate-900/30 flex flex-col items-center justify-center gap-6 transition-all duration-300 hover:bg-slate-900 hover:border-slate-700 hover:-translate-y-2">
                <div className={`text-slate-600 transition-colors duration-300 ${tech.color}`}>
                  {React.cloneElement(tech.icon, { size: 56, strokeWidth: 1.2 })}
                </div>
                <div className="text-center">
                  <h3 className="font-bold text-lg text-white uppercase tracking-widest">{tech.name}</h3>
                  <div className="max-h-20 opacity-0 overflow-hidden transition-all duration-500 group-hover:max-h-20 group-hover:opacity-100">
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                      {tech.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Developer Section */}
      <section id="developer" className="px-8 py-20 scroll-mt-20">
        <div className="bg-slate-900/50 rounded-[60px] p-12 md:p-20 text-white relative overflow-hidden shadow-2xl shadow-blue-900/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>
          
          {/* Head */}
          <div className="relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight tracking-tighter">Tim Pengembang</h2>
              <p className="text-blue-100/50 font-regular text-lg">Tim pengembang di balik sistem monitoring TrashTrack.</p>
            </div>

            {/* Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {developers.map((dev, index) => (
                <div key={index} className="group relative bg-slate-950/40 p-10 rounded-[48px] border border-white/5 h-[280px] flex items-center transition-all duration-1200 overflow-hidden">
                  
                  <div className="flex items-center gap-8 transition-all duration-500 ">
                    
                    {/* Photo */}
                    <DeveloperAvatar photoUrl={dev.photoUrl} name={dev.name} />
                    
                    {/* Name */}
                    <div className="flex flex-col flex-1">
                      <h3 className="text-xl lg:text-2xl font-bold leading-none transition-all group-hover:text-blue-400">
                        {dev.name}
                      </h3>
                      <p className="text-blue-400 font-semibold text-[12px] uppercase tracking-[0.3em] mt-1 transition-all group-hover:text-white">
                        {dev.role}
                      </p>

                      {/* Desc */}
                      <div className="max-h-0 opacity-0 overflow-hidden transition-all duration-600 group-hover:max-h-32 group-hover:opacity-100 group-hover:mt-1 ">
                        <p className="text-slate-400 text-s leading-relaxed font-regular ">
                          {dev.desc}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Efek cahaya saat hover */}
                  <div className="absolute inset-0 bg-gradient-to-br to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[48px]" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-8 md:px-20 py-12 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-8">
        <p className="text-slate-600 font-medium text-sm">© 2026 TrashTrack.</p>
        <div className="flex gap-8 text-[10px] font-medium text-slate-600 uppercase tracking-widest">
          <a className="hover:text-slate-500 transition-colors">Kebijakan Privasi</a>
          <a className="hover:text-slate-500 transition-colors">Syarat & Ketentuan</a>
          <a className="hover:text-slate-500 transition-colors">Kontak</a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;