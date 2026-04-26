import React, { useState, useEffect, useRef } from 'react';
import { User, Mail, Phone, Edit3, Save, X, Camera, Lock, Upload, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({ nama: '', email: '', phone: '' });
  const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });

  const [avatarUrl, setAvatarUrl] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
      setFormData({ nama: parsed.nama || '', email: parsed.email || '', phone: parsed.phone || '' });
      setAvatarUrl(parsed.avatar_url || null);
    }
  }, []);

  const getAvatarSrc = () => {
    if (avatarPreview) return avatarPreview;
    if (avatarUrl) return avatarUrl;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.nama || 'User')}&background=0D8ABC&color=fff&size=128`;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'File harus berupa gambar (JPG, PNG, GIF, dll).' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Ukuran gambar maksimal 5MB.' });
      return;
    }

    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setAvatarPreview(ev.target.result);
      setShowAvatarModal(true);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleUploadAvatar = async () => {
    if (!avatarFile || !user) return;
    setIsUploadingAvatar(true);
    setMessage({ type: '', text: '' });

    try {
      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `avatar_${user.id}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, avatarFile, { upsert: true });
      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);
      const newAvatarUrl = publicUrlData.publicUrl;

      const { error: updateError } = await supabase
        .from('users')
        .update({ avatar_url: newAvatarUrl })
        .eq('id', user.id);
      if (updateError) throw updateError;

      const updatedUser = { ...user, avatar_url: newAvatarUrl };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setAvatarUrl(newAvatarUrl);
      setAvatarPreview(null);
      setAvatarFile(null);
      setShowAvatarModal(false);
      setMessage({ type: 'success', text: 'Foto profil berhasil diperbarui.' });
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Gagal mengunggah foto. Coba lagi.' });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleRemoveAvatar = async () => {
    if (!user) return;
    setIsUploadingAvatar(true);
    setMessage({ type: '', text: '' });

    try {
      const fileExt = avatarUrl.split('.').pop().split('?')[0];
      const filePath = `avatars/avatar_${user.id}.${fileExt}`;

      const { error: removeError } = await supabase.storage
        .from('profiles')
        .remove([filePath]);
      if (removeError) console.warn('Storage remove warning:', removeError.message);

      const { error } = await supabase
        .from('users')
        .update({ avatar_url: null })
        .eq('id', user.id);
      if (error) throw error;

      const updatedUser = { ...user, avatar_url: null };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setAvatarUrl(null);
      setAvatarPreview(null);
      setAvatarFile(null);
      setMessage({ type: 'success', text: 'Foto profil berhasil dihapus.' });
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Gagal menghapus foto profil. Coba lagi.' });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleCancelAvatar = () => {
    setAvatarPreview(null);
    setAvatarFile(null);
    setShowAvatarModal(false);
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setMessage({ type: '', text: '' });
    try {
      const { error } = await supabase
        .from('users')
        .update({ nama: formData.nama, phone: formData.phone })
        .eq('id', user.id);
      if (error) throw error;

      const updatedUser = { ...user, nama: formData.nama, phone: formData.phone };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsEditing(false);
      setMessage({ type: 'success', text: 'Profil berhasil diperbarui.' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Gagal memperbarui profil. Coba lagi.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePassword = async () => {
    if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Semua field password wajib diisi.' });
      return;
    }
    if (passwordData.oldPassword !== user.password) {
      setMessage({ type: 'error', text: 'Password lama tidak sesuai.' });
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Password baru tidak cocok.' });
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password minimal 6 karakter.' });
      return;
    }
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({ password: passwordData.newPassword })
        .eq('id', user.id);
      if (error) throw error;

      const updatedUser = { ...user, password: passwordData.newPassword };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsChangingPassword(false);
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setMessage({ type: 'success', text: 'Password berhasil diperbarui.' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Gagal memperbarui password. Coba lagi.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsChangingPassword(false);
    setMessage({ type: '', text: '' });
    setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    if (user) setFormData({ nama: user.nama || '', email: user.email || '', phone: user.phone || '' });
  };

  if (!user) return null;

  return (
    <div className="w-full mx-auto py-10 px-8 lg:px-20">

      {/* Modal Upload Avatar */}
      {showAvatarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-[36px] shadow-2xl p-8 w-full max-w-sm mx-4 flex flex-col items-center gap-5">
            <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest">Pratinjau Foto</h3>
            <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-slate-100 shadow-lg">
              <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
            </div>
            <p className="text-xs text-slate-400 text-center font-semibold">
              Foto terlihat bagus? Klik <span className="text-blue-500">Simpan</span> untuk menerapkannya.
            </p>
            <div className="flex gap-3 w-full">
              <button
                onClick={handleUploadAvatar}
                disabled={isUploadingAvatar}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white px-5 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all"
              >
                {isUploadingAvatar
                  ? <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  : <Upload size={13} />}
                Simpan
              </button>
              <button
                onClick={handleCancelAvatar}
                disabled={isUploadingAvatar}
                className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 px-5 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all"
              >
                <X size={13} /> Batal
              </button>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingAvatar}
              className="text-xs text-blue-500 hover:text-blue-600 font-bold underline underline-offset-2 transition-colors"
            >
              Pilih foto lain
            </button>
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Header */}
      <div className="mt-10 mb-10">
        <h1 className="text-4xl font-black mb-2">Profil <span className="text-blue-500">Saya</span></h1>
        <p className="text-lg text-slate-500">Kelola informasi akun TrashTrack Anda.</p>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`mb-6 px-5 py-4 rounded-2xl text-sm font-semibold border ${
          message.type === 'success'
            ? 'bg-green-500/10 border-green-500/20 text-green-400'
            : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Avatar Card */}
        <div className="lg:col-span-1 bg-white rounded-[36px] shadow-sm border border-slate-100 p-8 flex flex-col items-center gap-5">
          <div className="relative group">
            <img
              src={getAvatarSrc()}
              alt="Avatar"
              className="w-28 h-28 rounded-full border-4 border-slate-100 shadow-lg object-cover"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center"
            >
              <Camera size={22} className="text-white" />
            </div>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:bg-blue-700 transition-colors"
            >
              <Camera size={14} className="text-white" />
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-xl font-black text-slate-800">{user.nama}</h2>
            <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mt-1">{user.email}</p>
          </div>

          {/* Tombol aksi foto */}
          <div className="w-full flex flex-col gap-2">
            {!avatarUrl && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all border border-blue-100"
              >
                <Upload size={13} /> Unggah Foto
              </button>
            )}
            {avatarUrl && (
              <button
                onClick={handleRemoveAvatar}
                disabled={isUploadingAvatar}
                className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-500 px-4 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all border border-red-100 disabled:opacity-50"
              >
                {isUploadingAvatar
                  ? <span className="w-3 h-3 border-2 border-red-300/30 border-t-red-400 rounded-full animate-spin"></span>
                  : <Trash2 size={13} />}
                Hapus Foto
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="w-full mt-2 grid grid-cols-2 gap-3">
            <div className="bg-slate-50 rounded-2xl p-4 text-center border border-slate-100">
              <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Role</p>
              <p className="text-sm font-black text-slate-700 mt-1 capitalize">{user.role}</p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4 text-center border border-slate-100">
              <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Status</p>
              <p className="text-sm font-black text-green-500 mt-1">Aktif</p>
            </div>
          </div>
        </div>

        {/* Info & Edit Card */}
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* Informasi Akun */}
          <div className="bg-white rounded-[36px] shadow-sm border border-slate-100 p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest">Informasi Akun</h3>
              {!isEditing && !isChangingPassword && (
                <button
                  onClick={() => { setIsEditing(true); setMessage({ type: '', text: '' }); }}
                  className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
                >
                  <Edit3 size={13} /> Edit
                </button>
              )}
            </div>

            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <User size={12} /> Nama Lengkap
                </label>
                {isEditing ? (
                  <input name="nama" value={formData.nama} onChange={handleChange}
                    className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all" />
                ) : (
                  <p className="text-slate-800 font-bold text-sm px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100">{user.nama || '-'}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <Mail size={12} /> Email
                </label>
                <p className="text-slate-400 font-bold text-sm px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100">{user.email || '-'}</p>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <Phone size={12} /> No. Telepon
                </label>
                {isEditing ? (
                  <input name="phone" value={formData.phone} onChange={handleChange}
                    className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all" />
                ) : (
                  <p className="text-slate-800 font-bold text-sm px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100">{user.phone || '-'}</p>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="flex gap-3 mt-6">
                <button onClick={handleSaveProfile} disabled={isSaving}
                  className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all">
                  {isSaving ? <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : <Save size={13} />}
                  Simpan
                </button>
                <button onClick={handleCancel}
                  className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all">
                  <X size={13} /> Batal
                </button>
              </div>
            )}
          </div>

          {/* Keamanan */}
          <div className="bg-white rounded-[36px] shadow-sm border border-slate-100 p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest">Keamanan</h3>
              {!isChangingPassword && !isEditing && (
                <button onClick={() => { setIsChangingPassword(true); setMessage({ type: '', text: '' }); }}
                  className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all">
                  <Lock size={13} /> Ganti Password
                </button>
              )}
            </div>

            {isChangingPassword ? (
              <div className="flex flex-col gap-4">
                {['oldPassword', 'newPassword', 'confirmPassword'].map((field, i) => (
                  <div key={field} className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400">
                      {['Password Lama', 'Password Baru', 'Konfirmasi Password Baru'][i]}
                    </label>
                    <input name={field} type="password" value={passwordData[field]} onChange={handlePasswordChange}
                      placeholder={['Masukkan password lama', 'Minimal 6 karakter', 'Ulangi password baru'][i]}
                      className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all" />
                  </div>
                ))}
                <div className="flex gap-3 mt-2">
                  <button onClick={handleSavePassword} disabled={isSaving}
                    className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all">
                    {isSaving ? <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : <Save size={13} />}
                    Simpan
                  </button>
                  <button onClick={handleCancel}
                    className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all">
                    <X size={13} /> Batal
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-400 font-semibold px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100">
                Password tersimpan dengan aman. Klik tombol di atas untuk mengubah password.
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;