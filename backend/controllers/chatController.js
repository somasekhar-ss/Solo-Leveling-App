const Message = require('../models/Message');

exports.getChatHistory = async (req, res) => {
    try {
        // Get the last 50 messages to avoid overloading the client
        const messages = await Message.find().populate('user.id', 'username equippedTitle equippedEffects').sort({ timestamp: -1 }).limit(50);
        res.json(messages.reverse()); // Reverse to show oldest first in chat
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error fetching chat history.');
    }
};

exports.getPublicChatHistory = async (req, res) => {
    try {
        const messages = await Message.find().sort({ timestamp: -1 }).limit(50);
        res.json(messages.reverse());
    } catch (err) {
        console.error('Public history fetch error:', err.message);
        res.status(500).send('Server Error fetching public chat history.');
    }
};
