const express = require('express');
const router = express.Router();
const { getDailyLeaderboard } = require('../controllers/leaderboardController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/daily', authMiddleware, getDailyLeaderboard);

module.exports = router;