const User = require('../models/User');

// Get user stats and progression info
const getStats = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const statsInfo = {
            stats: user.stats,
            points: user.points,
            level: user.level,
            mainRank: user.mainRank,
            statCaps: user.statCaps,
            upgradeCosts: {
                strength: user.getStatUpgradeCost(user.stats.strength),
                intelligence: user.getStatUpgradeCost(user.stats.intelligence),
                discipline: user.getStatUpgradeCost(user.stats.discipline),
                vitality: user.getStatUpgradeCost(user.stats.vitality)
            },
            canUpgrade: {
                strength: user.canUpgradeStat('strength'),
                intelligence: user.canUpgradeStat('intelligence'),
                discipline: user.canUpgradeStat('discipline'),
                vitality: user.canUpgradeStat('vitality')
            }
        };

        res.json(statsInfo);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Upgrade a stat
const upgradeStat = async (req, res) => {
    try {
        const { statName } = req.body;
        const validStats = ['strength', 'intelligence', 'discipline', 'vitality'];
        
        if (!validStats.includes(statName)) {
            return res.status(400).json({ message: 'Invalid stat name' });
        }

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (!user.canUpgradeStat(statName)) {
            return res.status(400).json({ message: 'Cannot upgrade this stat' });
        }

        const currentLevel = user.stats[statName];
        const cost = user.getStatUpgradeCost(currentLevel);

        // Deduct points and upgrade stat
        user.points -= cost;
        user.stats[statName] = currentLevel + 1;

        await user.save();

        // Return updated stats info
        const statsInfo = {
            stats: user.stats,
            points: user.points,
            level: user.level,
            mainRank: user.mainRank,
            statCaps: user.statCaps,
            upgradeCosts: {
                strength: user.getStatUpgradeCost(user.stats.strength),
                intelligence: user.getStatUpgradeCost(user.stats.intelligence),
                discipline: user.getStatUpgradeCost(user.stats.discipline),
                vitality: user.getStatUpgradeCost(user.stats.vitality)
            },
            canUpgrade: {
                strength: user.canUpgradeStat('strength'),
                intelligence: user.canUpgradeStat('intelligence'),
                discipline: user.canUpgradeStat('discipline'),
                vitality: user.canUpgradeStat('vitality')
            }
        };

        res.json({ message: `${statName} upgraded successfully!`, stats: statsInfo });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Check for rank up and return notification if needed
const checkRankUp = async (req, res) => {
    try {
        const { previousLevel } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const previousRank = getRankFromLevel(previousLevel);
        const currentRank = user.mainRank;

        if (previousRank !== currentRank) {
            const rankUpMessage = getRankUpMessage(previousRank, currentRank);
            return res.json({ rankUp: true, message: rankUpMessage, newRank: currentRank });
        }

        res.json({ rankUp: false });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Helper function to get rank from level
function getRankFromLevel(level) {
    if (level >= 76) return 'S';
    if (level >= 61) return 'A';
    if (level >= 46) return 'B';
    if (level >= 31) return 'C';
    if (level >= 16) return 'D';
    return 'E';
}

// Helper function to get rank up message
function getRankUpMessage(previousRank, newRank) {
    const messages = {
        'E->D': `[ RANK-UP DETECTED ]

MAIN RANK: E -> D

Strength Max Cap increased: LV. 2 -> LV. 4
Intelligence Max Cap increased: LV. 2 -> LV. 4
Discipline Max Cap increased: LV. 2 -> LV. 4
Vitality Max Cap increased: LV. 2 -> LV. 4

"So, the real test begins."`,
        'D->C': `[ RANK-UP DETECTED ]

MAIN RANK: D -> C

Strength Max Cap increased: LV. 4 -> LV. 6
Intelligence Max Cap increased: LV. 4 -> LV. 6
Discipline Max Cap increased: LV. 4 -> LV. 6
Vitality Max Cap increased: LV. 4 -> LV. 6

"I can finally feel myself changing."`,
        'C->B': `[ RANK-UP DETECTED ]

MAIN RANK: C -> B

Strength Max Cap increased: LV. 6 -> LV. 8
Intelligence Max Cap increased: LV. 6 -> LV. 8
Discipline Max Cap increased: LV. 6 -> LV. 8
Vitality Max Cap increased: LV. 6 -> LV. 8

"So, I was holding back."`,
        'B->A': `[ RANK-UP DETECTED ]

MAIN RANK: B -> A

Strength Max Cap increased: LV. 8 -> LV. 9
Intelligence Max Cap increased: LV. 8 -> LV. 9
Discipline Max Cap increased: LV. 8 -> LV. 9
Vitality Max Cap increased: LV. 8 -> LV. 9

"This power... it feels natural."`,
        'A->S': `[ RANK-UP DETECTED ]

MAIN RANK: A -> S

Strength Max Cap increased: LV. 9 -> LV. 10
Intelligence Max Cap increased: LV. 9 -> LV. 10
Discipline Max Cap increased: LV. 9 -> LV. 10
Vitality Max Cap increased: LV. 9 -> LV. 10

"So this is the view from the top."`
    };

    return messages[`${previousRank}->${newRank}`] || 'Rank increased!';
}

module.exports = { getStats, upgradeStat, checkRankUp };