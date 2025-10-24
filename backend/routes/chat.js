const express = require('express');
const router = express.Router();
const { getChatHistory, getPublicChatHistory } = require('../controllers/chatController');
const authMiddleware = require('../middleware/authMiddleware');

// Route to get the initial chat history (authenticated)
router.get('/history', authMiddleware, getChatHistory);

// Public route for testing/dev: returns recent chat history without auth
router.get('/public-history', getPublicChatHistory);

module.exports = router;