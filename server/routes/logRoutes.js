const express = require('express');
const router = express.Router();
const { createLog, getLogs, updateLogStatus } = require('../controllers/logController');
const { verifyToken } = require('../middleware/authMiddleware');
const privacyGuard = require('../middleware/privacyGuard');

// Base Route: /api/logs

// Get all logs (filtered by role)
router.get('/', verifyToken, getLogs);

// Submit a new log
// CRITICAL: Privacy Guard checks if they still have active consent before processing this data
router.post('/', verifyToken, privacyGuard, createLog);

// Supervisor approves/rejects
router.patch('/:id/status', verifyToken, updateLogStatus);

module.exports = router;
