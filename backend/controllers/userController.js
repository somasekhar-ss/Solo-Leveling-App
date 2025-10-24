const User = require('../models/User');
const Mission = require('../models/Mission');
const Message = require('../models/Message');

exports.upgradeStat = async (req, res) => {
    const { stat } = req.body;
    const validStats = ['strength', 'intelligence', 'discipline', 'spirit'];

    if (!validStats.includes(stat)) {
        return res.status(400).json({ msg: 'Invalid stat.' });
    }

    try {
        const user = await User.findById(req.user.id);

        if (user.statPoints < 1) {
            return res.status(400).json({ msg: 'Not enough stat points.' });
        }

        user.statPoints -= 1;
        user.stats[stat] += 1;

        await user.save();
        res.json(user);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error upgrading stat.');
    }
};

exports.updateUsername = async (req, res) => {
    const { username } = req.body;
    console.log('Update username request:', { username, userId: req.user.id });
    
    if (!username || username.trim().length < 3) {
        return res.status(400).json({ msg: 'Username must be at least 3 characters long.' });
    }
    
    try {
        const existingUser = await User.findOne({ username: username.trim() });
        if (existingUser && existingUser._id.toString() !== req.user.id) {
            return res.status(400).json({ msg: 'Username already taken.' });
        }
        
        const user = await User.findByIdAndUpdate(
            req.user.id, 
            { username: username.trim() }, 
            { new: true }
        ).select('-password');
        
        console.log('Username updated successfully:', user.username);
        res.json({ user });
    } catch (err) {
        console.error('Username update error:', err.message);
        res.status(500).json({ msg: 'Server error updating username.' });
    }
};

exports.deleteAccount = async (req, res) => {
    try {
        await Mission.deleteMany({ user: req.user.id });
        await Message.deleteMany({ 'user.id': req.user.id });
        await User.findByIdAndDelete(req.user.id);
        
        res.json({ msg: 'Account deleted successfully.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error deleting account.');
    }
};