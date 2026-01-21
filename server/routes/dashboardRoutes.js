const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/student/stats', verifyToken, dashboardController.getStudentStats);
router.get('/supervisor/stats', verifyToken, dashboardController.getSupervisorStats);

module.exports = router;
