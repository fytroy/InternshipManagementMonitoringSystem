const express = require('express');
const router = express.Router();
const { createEvaluation, getEvaluations } = require('../controllers/evaluationController');
const { verifyToken } = require('../middleware/authMiddleware');

// Base Route: /api/evaluations

router.get('/', verifyToken, getEvaluations);
router.post('/', verifyToken, createEvaluation);

module.exports = router;
