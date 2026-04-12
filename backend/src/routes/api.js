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

module.exports = router;