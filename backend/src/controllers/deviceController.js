const supabase = require('../config/supabase');

// 1. Dashboard - Mengambil status sampah terbaru dari semua alat
exports.getDashboardStatus = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('sampah_status')
      .select(`
        device_id, tinggi, persen, status, updated_at,
        devices (device_code, lokasi)
      `);
    
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. System - Mengambil informasi baterai dan koneksi
exports.getSystemStatus = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('device_system_status')
      .select(`
        device_id, is_online, last_seen, wifi_ssid, bat_pers, voltage,
        devices (device_code)
      `);
    
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. History - Data untuk Chart.js (Logs)
exports.getTrashLogs = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('sampah_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100); // Batasi 100 data terakhir
    
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

