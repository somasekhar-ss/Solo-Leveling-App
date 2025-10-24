const User = require('../models/User');

exports.getDailyLeaderboard = async (req, res) => {
    try {
        const leaderboard = await User.find()
            .sort({ dailyScore: -1 })
            .limit(10)
            .select('username level dailyScore');

        res.json(leaderboard);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error fetching leaderboard.');
    }
};