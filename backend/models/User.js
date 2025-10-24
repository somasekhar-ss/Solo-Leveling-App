const mongoose = require('mongoose');

// Schema for items in the inventory
const ItemSchema = new mongoose.Schema({
    itemId: { type: String, required: true }, // Added to match shop items
    name: { type: String, required: true },
    type: { type: String, required: true, enum: ['title', 'effect', 'potion', 'chateffect'] }, // 'title', 'effect', 'potion', or 'chateffect'
    tier: { type: String, required: true, enum: ['e', 'd', 'c', 'b', 'a', 's', 'n'] },
    description: { type: String, default: '' },
    style: { type: String } // For effects, to be used on the frontend
}); // Subdocuments get an _id by default, which we'll use

// Schema for equipped effects
const EquippedEffectSchema = new mongoose.Schema({
    name: { type: String, required: true }, // e.g., 'Fire Aura'
    style: { type: String, required: true } // e.g., 'fire' for CSS class or effect logic
}, { _id: false });

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    level: { type: Number, default: 1 },
    exp: { type: Number, default: 0 },
    expToNextLevel: { type: Number, default: 100 },
    points: { type: Number, default: 0 },
    dailyScore: { type: Number, default: 0 },
    inventory: [ItemSchema],
    equippedTitle: { type: String, default: '' },
    equippedEffects: [EquippedEffectSchema],
    equippedChatEffect: { type: String, default: null },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    streak: { type: Number, default: 0 },
    stats: {
        strength: { type: Number, default: 1, min: 1, max: 10 },
        intelligence: { type: Number, default: 1, min: 1, max: 10 },
        discipline: { type: Number, default: 1, min: 1, max: 10 },
        vitality: { type: Number, default: 1, min: 1, max: 10 }
    },
    lastLogin: { type: Date, default: Date.now }
});

// Virtual for calculating main rank based on level
UserSchema.virtual('mainRank').get(function() {
    if (this.level >= 76) return 'S';
    if (this.level >= 61) return 'A';
    if (this.level >= 46) return 'B';
    if (this.level >= 31) return 'C';
    if (this.level >= 16) return 'D';
    return 'E';
});

// Virtual for calculating stat caps based on main rank
UserSchema.virtual('statCaps').get(function() {
    const rank = this.mainRank;
    const caps = {
        'E': 2, 'D': 4, 'C': 6, 'B': 8, 'A': 9, 'S': 10
    };
    return caps[rank];
});

// Method to get stat upgrade cost
UserSchema.methods.getStatUpgradeCost = function(currentLevel) {
    const costs = [0, 100, 250, 500, 800, 1200, 1700, 2500, 3500, 5000];
    return costs[currentLevel] || 0;
};

// Method to check if stat can be upgraded
UserSchema.methods.canUpgradeStat = function(statName) {
    const currentLevel = this.stats[statName];
    const cost = this.getStatUpgradeCost(currentLevel);
    const cap = this.statCaps;
    return currentLevel < cap && currentLevel < 10 && this.points >= cost;
};

module.exports = mongoose.model('User', UserSchema);
