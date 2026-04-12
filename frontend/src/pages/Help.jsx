import React from 'react';
import { Search, PlayCircle, BookOpen, Zap, CheckCircle2, ArrowRight, Play, HelpCircle, ChevronRight } from 'lucide-react';

const HelpPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-100 selection:text-blue-700">
      
      {/* --- NAVIGATION (TOP BAR ONLY) --- */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 font-black text-2xl text-blue-600">
            <Zap className="fill-blue-600" /> <span>HELP<span className="text-slate-900">CENTER</span></span>
          </div>
          <div className="hidden md:flex gap-8 font-medium text-slate-600">
            <a href="#" className="hover:text-blue-600 transition-colors">Panduan</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Fitur</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Kontak Kami</a>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION (FULL WIDTH) --- */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
            Pusat Bantuan & <span className="text-blue-600 font-serif italic">Resource</span>
          </h1>
          <p className="text-slate-500 text-lg mb-10 max-w-2xl mx-auto">
            Temukan jawaban untuk setiap pertanyaan Anda tentang platform kami melalui tutorial mendalam dan fitur unggulan.
          </p>
          <div className="relative group max-w-2xl mx-auto shadow-2xl shadow-blue-500/10">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Apa yang ingin Anda pelajari hari ini?" 
              className="w-full bg-slate-50 border-2 border-slate-100 py-5 pl-14 pr-6 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-lg"
            />
          </div>
        </div>
      </section>

      {/* --- TUTORIAL SECTION (STEP BY STEP) --- */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-black text-slate-900">Tutorial Cepat</h2>
            <p className="text-slate-500 mt-1 font-medium">Langkah mudah untuk mulai menggunakan platform.</p>
          </div>
          <button className="hidden sm:flex items-center gap-2 text-blue-600 font-bold hover:underline">
            Lihat Semua Panduan <ChevronRight size={18} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: "01", title: "Setup Dashboard", desc: "Konfigurasi workspace pertama Anda hanya dengan beberapa klik." },
            { step: "02", title: "Manajemen Tim", desc: "Undang anggota tim dan atur hak akses secara kolaboratif." },
            { step: "03", title: "Automasi Workflow", desc: "Cara membuat alur kerja otomatis untuk menghemat waktu Anda." }
          ].map((item, index) => (
            <div key={index} className="bg-white p-8 rounded-[32px] border border-slate-200 hover:border-blue-400 hover:-translate-y-2 transition-all duration-300 shadow-sm">
              <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-lg font-black text-sm mb-4">{item.step}</span>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
              <p className="text-slate-500 leading-relaxed text-sm mb-6">{item.desc}</p>
              <a href="#" className="text-blue-600 font-bold flex items-center gap-1 text-sm group">
                Pelajari Selengkapnya <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* --- FEATURE HIGHLIGHTS (BANNER) --- */}
      <section className="bg-slate-900 py-20 px-6 mb-20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl group cursor-pointer border-4 border-slate-800">
            <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000" alt="Video Placeholder" className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-blue-600 p-6 rounded-full text-white shadow-xl shadow-blue-500/50 group-hover:scale-110 transition-transform">
                <Play fill="white" size={32} />
              </div>
            </div>
            <div className="absolute bottom-6 left-6 text-white font-bold bg-black/50 backdrop-blur-md px-4 py-2 rounded-xl text-sm border border-white/10">
              Lihat Fitur Dalam Video (4:20)
            </div>
          </div>
          
          <div className="text-white">
            <h2 className="text-4xl font-black mb-8 tracking-tight">Eksplorasi Fitur Tercanggih.</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { icon: <Zap size={20} />, text: "Performa Kilat" },
                { icon: <CheckCircle2 size={20} />, text: "Aman & Terenkripsi" },
                { icon: <BookOpen size={20} />, text: "Laporan Detail" },
                { icon: <HelpCircle size={20} />, text: "Dukungan 24/7" }
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-2xl border border-slate-700">
                  <span className="text-blue-400">{f.icon}</span>
                  <span className="font-semibold">{f.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- FINAL CALL TO ACTION (INTERACTIVE BUTTONS) --- */}
      <section className="max-w-3xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-black text-slate-900 mb-4">Masih Butuh Bantuan?</h2>
        <p className="text-slate-500 mb-12 text-lg">Hubungi tim kami atau mulai eksplorasi demo secara mandiri.</p>
        
        {/* BUTTONS WITH FLEX-GROW EFFECT */}
        <div className="flex flex-col sm:flex-row gap-5 justify-center w-full max-w-xl mx-auto">
          <button className="flex-1 group flex items-center justify-center gap-3 bg-blue-600 text-white px-10 py-5 rounded-[28px] font-bold text-lg hover:bg-blue-700 hover:flex-[2] transition-all duration-500 shadow-xl shadow-blue-500/30">
            <span className="whitespace-nowrap">Hubungi Support</span>
            <ArrowRight className="group-hover:translate-x-2 transition-transform" />
          </button>

          <button className="flex-1 flex items-center justify-center gap-3 px-10 py-5 rounded-[28px] font-bold text-lg border-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-100 hover:border-blue-600 hover:text-blue-600 hover:flex-[2] transition-all duration-500">
            <PlayCircle size={24} />
            <span className="whitespace-nowrap">Video Demo</span>
          </button>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-white border-t border-slate-200 py-12 px-6 text-center">
        <div className="flex justify-center gap-6 mb-6 font-semibold text-slate-400 text-sm tracking-widest uppercase">
          <a href="#" className="hover:text-blue-600">Privacy</a>
          <a href="#" className="hover:text-blue-600">Terms</a>
          <a href="#" className="hover:text-blue-600">Cookies</a>
        </div>
        <p className="text-slate-400 text-sm italic">© 2026 Gemini AI. Dirancang untuk efisiensi maksimal.</p>
      </footer>
    </div>
  );
};

export default HelpPage;