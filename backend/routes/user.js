const express = require('express');
const router = express.Router();
const { upgradeStat, updateUsername, deleteAccount } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.put('/upgrade-stat', authMiddleware, upgradeStat);
router.put('/username', authMiddleware, updateUsername);
router.delete('/account', authMiddleware, deleteAccount);

module.exports = router;