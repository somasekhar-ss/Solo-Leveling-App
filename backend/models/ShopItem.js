
const mongoose = require('mongoose');

const ShopItemSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    type: { type: String, required: true, enum: ['title', 'effect', 'potion'] },
    tier: { type: String, required: true, enum: ['e', 'd', 'c', 'b', 'a', 's'] },
    description: { type: String, default: '' },
    cost: { type: Number, required: true },
    // Style property for 'effect' items to help with frontend rendering
    style: { type: String, required: function() { return this.type === 'effect'; } } 
});

module.exports = mongoose.model('ShopItem', ShopItemSchema);
