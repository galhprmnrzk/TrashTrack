const supabase = require('../config/supabase');

// --- USER MANAGEMENT ---

// Ambil semua daftar user
exports.getAllUsers = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Tambah User Baru
exports.createUser = async (req, res) => {
  try {
    const { nama, phone, email, role } = req.body;
    const { data, error } = await supabase
      .from('users')
      .insert([{ nama, phone, email, role }])
      .select();

    if (error) throw error;
    res.status(201).json({ message: "User berhasil ditambahkan", data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update User
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) throw error;
    res.json({ message: "User berhasil diperbarui", data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Hapus User
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('users').delete().eq('id', id);

    if (error) throw error;
    res.json({ message: "User berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- DEVICE MANAGEMENT ---

// Tambah Device Baru
exports.createDevice = async (req, res) => {
  try {
    const { device_code, lokasi, tinggi_maks, deskripsi, role } = req.body;
    const { data, error } = await supabase
      .from('devices')
      .insert([{ device_code, lokasi, tinggi_maks, deskripsi, role, status: 'offline' }])
      .select();

    if (error) throw error;
    res.status(201).json({ message: "Device berhasil didaftarkan", data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};