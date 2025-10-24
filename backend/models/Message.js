const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    user: {
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
        username: { type: String, required: true }
    },
    text: { type: String, required: true },
    recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', MessageSchema);