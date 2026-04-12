import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserPlus, ArrowRight, User, Mail, Lock, Phone } from 'lucide-react';
import { supabase } from '../lib/supabase';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nama: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nama || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Semua field wajib diisi.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password minimal 6 karakter.');
      return;
    }
    setIsLoading(true);
    try {
      const { error: dbError } = await supabase
        .from('users')
        .insert([{
          nama: formData.nama,
          phone: formData.phone,
          email: formData.email,
          password: formData.password,
          role: 'user',
        }]);
      if (dbError) throw dbError;
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Pendaftaran gagal. Coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-950 text-white font-sans min-h-screen flex items-center justify-center px-6 relative overflow-hidden py-12">

      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none">
        <div className="w-[600px] h-[400px] bg-blue-600/20 blur-[130px] rounded-full mt-[-80px]"></div>
      </div>
      <div className="absolute bottom-0 left-0 pointer-events-none">
        <div className="w-[300px] h-[300px] bg-green-600/10 blur-[100px] rounded-full"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">

        {/* Heading */}
        <div className="flex flex-col items-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-center">
            Buat <span className="text-blue-500">Akun</span> Baru
          </h1>
          <p className="text-slate-500 text-sm mt-2 text-center">
            Daftar untuk mulai memantau sistem TrashTrack.
          </p>
        </div>

        {/* Card */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-white/5 rounded-[40px] p-8 md:p-10 shadow-2xl shadow-blue-900/10">

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {/* Nama */}
            <div className="flex flex-col gap-2">
              <label htmlFor="nama" className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                Nama Lengkap
              </label>
              <div className="relative">
                <User size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                <input
                  id="nama"
                  name="nama"
                  type="text"
                  autoComplete="name"
                  placeholder="Masukkan nama lengkap"
                  value={formData.nama}
                  onChange={handleChange}
                  className="w-full bg-slate-800/60 border border-slate-700/60 rounded-2xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-600/60 focus:border-blue-600/40 transition-all"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-2">
              <label htmlFor="phone" className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                No. Telepon <span className="text-slate-600 normal-case tracking-normal">(opsional)</span>
              </label>
              <div className="relative">
                <Phone size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="08xxxxxxxxxx"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-slate-800/60 border border-slate-700/60 rounded-2xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-600/60 focus:border-blue-600/40 transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                Email
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="nama@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-slate-800/60 border border-slate-700/60 rounded-2xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-600/60 focus:border-blue-600/40 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                Password
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Minimal 6 karakter"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-slate-800/60 border border-slate-700/60 rounded-2xl pl-10 pr-12 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-600/60 focus:border-blue-600/40 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-2">
              <label htmlFor="confirmPassword" className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                Konfirmasi Password
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Ulangi password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full bg-slate-800/60 border border-slate-700/60 rounded-2xl pl-10 pr-12 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-600/60 focus:border-blue-600/40 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  tabIndex={-1}
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-60 text-white px-6 py-3 rounded-[24px] font-semibold text-sm uppercase tracking-widest transition-all duration-300 shadow-lg shadow-blue-900/30"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Memproses...
                </>
              ) : (
                <>
                  <UserPlus size={16} />
                  Daftar
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-slate-800"></div>
            <span className="text-slate-600 text-xs font-medium uppercase tracking-widest">atau</span>
            <div className="flex-1 h-px bg-slate-800"></div>
          </div>

          {/* Login CTA */}
          <p className="text-center text-sm text-slate-500">
            Sudah punya akun?{' '}
            <Link
              to="/login"
              className="text-white font-semibold hover:text-blue-400 transition-colors inline-flex items-center gap-1 group"
            >
              Masuk Sekarang
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform text-blue-500" />
            </Link>
          </p>
        </div>

        {/* Footer note */}
        <p className="text-center text-slate-700 text-xs mt-8">
          © 2026 TrashTrack.
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;