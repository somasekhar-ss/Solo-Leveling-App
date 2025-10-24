const express = require('express');
const { getStats, upgradeStat, checkRankUp } = require('../controllers/statsController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Get user stats and progression info
router.get('/', authMiddleware, getStats);

// Upgrade a stat
router.post('/upgrade', authMiddleware, upgradeStat);

// Check for rank up
router.post('/check-rankup', authMiddleware, checkRankUp);

module.exports = router;