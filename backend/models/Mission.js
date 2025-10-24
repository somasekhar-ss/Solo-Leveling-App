const mongoose = require('mongoose');
const MissionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    description: { type: String, required: true },
    source: { type: String, enum: ['System', 'User'], default: 'User' },
    rarity: { type: String, enum: ['Common', 'Uncommon', 'Rare', 'Epic', 'Instant', 'Stat'] },
    statType: { type: String, enum: ['strength', 'intelligence', 'discipline', 'vitality'] },
    timeLimit: { type: Number },
    startTime: { type: Date },
    status: { type: String, enum: ['Pending', 'InProgress', 'Completed', 'Failed'], default: 'Pending' },
    expReward: { type: Number, default: 0 },
    pointReward: { type: Number, default: 0 },
    date: { type: Date, default: () => new Date().setHours(0, 0, 0, 0) }
}, { timestamps: true });
module.exports = mongoose.model('Mission', MissionSchema);