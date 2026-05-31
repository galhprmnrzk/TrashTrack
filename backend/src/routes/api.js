const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController');
const authController = require('../controllers/authController')

// User Management (Settings Page)
router.get('/users', authController.getAllUsers);
router.post('/users', authController.createUser);
router.put('/users/:id', authController.updateUser);
router.delete('/users/:id', authController.deleteUser);

// Device Management (Settings Page)
router.post('/devices', authController.createDevice);

// Route untuk Dashboard
router.get('/dashboard', deviceController.getDashboardStatus);

// Route untuk System Info
router.get('/system', deviceController.getSystemStatus);

// Route untuk History (Chart)
router.get('/history', deviceController.getTrashLogs);

//notif telegram
router.post('/request-emptying', async (req, res) => {
  try {
    const { binName, location, capacity } = req.body;

    const message = `
🚮 PERMINTAAN PENGOSONGAN

🗑️ Bin : ${binName}
📍 Lokasi : ${location}
📊 Kapasitas : ${capacity}%

Mohon segera dilakukan pengosongan.
`;

    await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text: message
        })
      }
    );

    res.json({
      success: true,
      message: 'Pesan Telegram berhasil dikirim'
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Gagal mengirim pesan'
    });
  }
});

module.exports = router;