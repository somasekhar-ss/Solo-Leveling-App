const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { addFriend, listFriends, removeFriend } = require('../controllers/friendController');

router.post('/', auth, addFriend); // body: { username }
router.get('/', auth, listFriends);
router.get('/search/:query', auth, async (req, res) => {
    try {
        const User = require('../models/User');
        const { query } = req.params;
        console.log('Searching for:', query);
        const users = await User.find({ 
            username: { $regex: query, $options: 'i' },
            _id: { $ne: req.user.id }
        }).select('username').limit(10);
        console.log('Found users:', users);
        res.json(users);
    } catch (err) {
        console.error('Search error:', err);
        res.status(500).json({ msg: 'Server error' });
    }
});
router.delete('/:friendId', auth, removeFriend);

module.exports = router;
