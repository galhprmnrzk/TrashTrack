const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Pastikan path ini benar sesuai struktur folder
const apiRoutes = require('./routes/api');

const app = express();

// Konfigurasi CORS agar aman
app.use(cors());
app.use(express.json());

// DAFTARKAN ROUTE DI SINI
app.use('/api', apiRoutes);

// Route cadangan untuk tes apakah server hidup
app.get('/', (req, res) => {
  res.json({ message: "Server TrashTrack Aktif!" });
});

// PENTING UNTUK VERCEL: 
// Hanya jalankan app.listen jika di lingkungan lokal (development)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server jalan di http://localhost:${PORT}`);
  });
}

// WAJIB ADA: Ekspor app agar Vercel bisa mengenalinya sebagai fungsi backend
module.exports = app;
