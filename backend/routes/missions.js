const express = require('express');
const router = express.Router();
const { getDailyMissions, createMission, startMission, completeMission, deleteMission, refreshStatQuests } = require('../controllers/missionController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/daily', authMiddleware, getDailyMissions);
router.post('/', authMiddleware, createMission);
router.put('/start/:id', authMiddleware, startMission);
router.put('/complete/:id', authMiddleware, completeMission);
router.delete('/:id', authMiddleware, deleteMission);
router.post('/refresh-stat-quests', authMiddleware, refreshStatQuests);

module.exports = router;