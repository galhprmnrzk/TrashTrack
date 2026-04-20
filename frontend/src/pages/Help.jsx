import React from 'react';
import { Search, PlayCircle, ArrowRight, ArrowLeft, Play, HelpCircle, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';

const HelpPage = () => {
  const navigate = useNavigate();

  const goToHome = () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    navigate('/');
  };

  return (
    <div className="bg-slate-950 text-white font-sans overflow-x-hidden min-h-screen">

      {/* --- NAVIGATION --- */}
      <nav className="flex items-center justify-between px-8 md:px-20 py-8 bg-transparent absolute top-0 w-full z-50">
        <div className="flex-1 items-center gap-2">
          <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}>
            <Logo className="w-40" />
          </Link>
        </div>
        <div className="hidden md:flex flex-none items-center gap-10 font-semibold text-sm text-slate-400 uppercase tracking-widest">
          <a href="#panduan" className="hover:text-blue-500 transition-colors">Panduan</a>
          <a href="#faq" className="hover:text-blue-500 transition-colors">FAQ</a>
          <a href="#bantuan" className="hover:text-blue-500 transition-colors">Kontak</a>
        </div>
        <div className="flex-1 flex items-center justify-end gap-4 font-semibold text-sm text-slate-400 uppercase tracking-widest">
          <Link
            to="/login"
            className="bg-white text-slate-900 px-5 py-2.5 rounded-2xl hover:bg-blue-500 hover:text-white transition-all font-bold"
          >Masuk</Link>
          <Link
            to="/register"
            className="bg-white text-slate-900 px-5 py-2.5 rounded-2xl hover:bg-blue-500 hover:text-white transition-all font-bold"
          >Daftar</Link>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative px-8 md:px-20 pt-32 pb-20 lg:pt-48 lg:pb-32 flex flex-col items-center text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
          <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-600/20 blur-[120px] rounded-full"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 via-slate-950/80 to-slate-950"></div>
        </div>

        <div className="relative z-10 mt-10">
          <button
            onClick={goToHome}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-semibold uppercase tracking-widest mb-10 mx-auto group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform text-blue-500" />
            Kembali ke Beranda
          </button>

          <h1 className="text-6xl md:text-8xl font-bold leading-[1.1] tracking-tight mb-6 max-w-4xl">
            Pusat <span className="text-green-600">Bantuan</span> <br/>
            & <span className="text-blue-500">Panduan.</span>
          </h1>
          <p className="text-slate-400 text-center mx-auto text-lg md:text-xl leading-[1.6] max-w-2xl mb-8">
            Temukan panduan lengkap untuk memaksimalkan penggunaan platform monitoring sampah IoT TrashTrack.
          </p>

          {/* Search Bar */}
          <div className="relative group max-w-2xl mx-auto mb-12">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
            <input
              type="text"
              placeholder="Cari panduan, fitur, atau pertanyaan..."
              className="w-full bg-slate-900/80 border border-slate-800 text-white placeholder-slate-500 py-5 pl-14 pr-6 rounded-[24px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg"
            />
          </div>
        </div>
      </section>

      {/* --- PANDUAN SECTION --- */}
      <section id="panduan" className="px-8 md:px-20 py-20 scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Panduan Memulai</h2>
              <p className="text-slate-500 mt-2 font-medium">Langkah mudah untuk mulai memantau tempat sampah Anda.</p>
            </div>
            <button className="hidden sm:flex items-center gap-2 text-blue-500 font-bold hover:text-blue-400 transition-colors text-sm uppercase tracking-widest">
              Lihat Semua <ChevronRight size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Daftarkan Perangkat",
                desc: "Hubungkan sensor ESP8266 ke jaringan MQTT dan daftarkan perangkat ke dashboard TrashTrack."
              },
              {
                step: "02",
                title: "Pantau Real-time",
                desc: "Lihat kapasitas, baterai, tegangan, dan kualitas sinyal tempat sampah secara langsung di dashboard."
              },
              {
                step: "03",
                title: "Atur Notifikasi",
                desc: "Konfigurasikan notifikasi Telegram otomatis saat kapasitas sampah mencapai batas yang ditentukan."
              }
            ].map((item, index) => (
              <div key={index} className="bg-slate-900/50 p-10 rounded-[40px] border border-slate-800 hover:border-blue-500/50 transition-all group hover:-translate-y-2 duration-300">
                <span className="inline-block px-3 py-1 bg-blue-500/10 text-blue-400 rounded-lg font-black text-sm mb-6 border border-blue-500/20">{item.step}</span>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm mb-6">{item.desc}</p>
                <a href="#" className="text-blue-400 font-bold flex items-center gap-1 text-sm group/link">
                  Pelajari Selengkapnya <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- VIDEO DEMO SECTION --- */}
      <section className="px-8 md:px-20 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="bg-slate-900/50 rounded-[60px] p-12 md:p-20 border border-slate-800 relative overflow-hidden shadow-2xl shadow-blue-900/20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none"></div>
            <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
              <div className="relative aspect-video rounded-[32px] overflow-hidden shadow-2xl group cursor-pointer border border-slate-700">
                <img
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=1000"
                  alt="TrashTrack Demo Video"
                  className="w-full h-full object-cover opacity-50 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-blue-600 p-6 rounded-full text-white shadow-xl shadow-blue-500/50 group-hover:scale-110 transition-transform">
                    <Play fill="white" size={32} />
                  </div>
                </div>
                <div className="absolute bottom-6 left-6 text-white font-bold bg-black/50 backdrop-blur-md px-4 py-2 rounded-xl text-sm border border-white/10">
                  Demo Platform TrashTrack (3:45)
                </div>
              </div>
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight tracking-tight">
                  Lihat TrashTrack <br/>
                  <span className="text-blue-500">Beraksi.</span>
                </h2>
                <p className="text-slate-400 leading-relaxed mb-8">
                  Saksikan bagaimana TrashTrack memantau kapasitas sampah secara real-time, mengirim notifikasi otomatis, dan membantu efisiensi pengangkutan sampah kota.
                </p>
                <button onClick={goToHome} className="flex items-center gap-2 text-white font-medium text-sm uppercase hover:text-slate-400 tracking-widest group/btn w-fit">
                  Kembali ke Beranda
                  <ArrowRight size={18} className="group-hover/btn:translate-x-2 transition-transform text-blue-500" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section id="faq" className="px-8 md:px-20 py-20 scroll-mt-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Pertanyaan Umum</h2>
            <p className="text-slate-500 mt-2">Pertanyaan yang sering ditanyakan seputar TrashTrack.</p>
          </div>
          <div className="space-y-4">
            {[
              {
                q: "Apa itu TrashTrack?",
                a: "TrashTrack adalah platform monitoring sampah berbasis IoT yang memungkinkan pemantauan kapasitas tempat sampah secara real-time menggunakan sensor ultrasonik dan mikrokontroler ESP8266."
              },
              {
                q: "Bagaimana cara kerja sensor pada tempat sampah?",
                a: "Sensor ultrasonik pada ESP8266 mengukur jarak dari tutup tempat sampah ke permukaan sampah, lalu mengirimkan data melalui protokol MQTT ke server untuk ditampilkan di dashboard."
              },
              {
                q: "Notifikasi dikirim ke mana saat tempat sampah penuh?",
                a: "Notifikasi otomatis dikirimkan melalui bot Telegram ke petugas kebersihan atau admin yang telah dikonfigurasi, berisi informasi lokasi dan kapasitas tempat sampah."
              },
              {
                q: "Apakah data dapat diakses dari perangkat mobile?",
                a: "Ya, dashboard TrashTrack bersifat responsif dan dapat diakses melalui browser di smartphone, tablet, maupun desktop tanpa perlu instalasi aplikasi tambahan."
              },
            ].map((item, i) => (
              <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-[24px] p-6 hover:border-blue-500/30 transition-all">
                <div className="flex items-start gap-4">
                  <span className="text-blue-500 mt-1 shrink-0"><HelpCircle size={20} /></span>
                  <div>
                    <h3 className="font-bold text-white mb-2">{item.q}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{item.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CALL TO ACTION --- */}
      <section id="bantuan" className="px-8 md:px-20 py-20 scroll-mt-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Masih Butuh Bantuan?</h2>
          <p className="text-slate-400 mb-12 text-lg">Hubungi tim pengembang atau kembali ke halaman utama TrashTrack.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="mailto:support@trashtrack.id"
              className="flex items-center justify-center gap-3 bg-blue-600 text-white px-8 py-3 rounded-[24px] font-semibold text-base hover:bg-blue-700 duration-300 transition-all shadow-2xl shadow-blue-900/40 whitespace-nowrap"
            >
              Hubungi Kami <ArrowRight size={18} />
            </a>
            <button
              onClick={goToHome}
              className="flex items-center justify-center gap-3 px-8 py-3 rounded-[24px] font-semibold text-base border border-slate-800 bg-slate-900/50 hover:bg-slate-800 duration-300 transition-all text-slate-300 whitespace-nowrap"
            >
              <PlayCircle size={18} />
              Ke Beranda
            </button>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
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

export default HelpPage;