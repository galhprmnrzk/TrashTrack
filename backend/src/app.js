const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Pastikan path ini benar sesuai struktur folder
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// DAFTARKAN ROUTE DI SINI
app.use('/api', apiRoutes);

// Route cadangan untuk tes apakah server hidup
app.get('/', (req, res) => {
  res.json({ message: "Server TrashTrack Aktif!" });
});

app.listen(PORT, () => {
  console.log(`Server jalan di http://localhost:${PORT}`);
  console.log(`Coba akses: http://localhost:${PORT}/api/dashboard`);
});