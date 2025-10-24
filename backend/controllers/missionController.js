const Mission = require('../models/Mission');
const User = require('../models/User');
const { getStatQuest } = require('../gameData/quests');

exports.createMission = async (req, res) => {
    const { description, timeLimit } = req.body;
    try {
        if (!description || !timeLimit || timeLimit <= 0) {
            return res.status(400).json({ msg: 'Please provide a valid description and time limit.' });
        }
        const newMission = new Mission({ user: req.user.id, description, timeLimit: timeLimit * 60, source: 'User', date: new Date().setHours(0, 0, 0, 0) });
        const mission = await newMission.save();
        res.status(201).json(mission);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error creating mission.');
    }
};

exports.deleteMission = async (req, res) => {
    try {
        const mission = await Mission.findById(req.params.id);
        if (!mission || mission.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized.' });
        if (mission.source !== 'User' || mission.status === 'InProgress') {
            return res.status(400).json({ msg: 'This mission cannot be deleted.' });
        }
        await mission.deleteOne();
        res.json({ msg: 'Mission removed.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error deleting mission.');
    }
};

exports.startMission = async (req, res) => {
    try {
        const mission = await Mission.findById(req.params.id);
        if (!mission || mission.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized.' });
        if (mission.status !== 'Pending' || mission.source !== 'User') return res.status(400).json({ msg: 'This mission cannot be started.' });
        mission.status = 'InProgress';
        mission.startTime = new Date();
        await mission.save();
        res.json(mission);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error starting mission.');
    }
};
exports.getDailyMissions = async (req, res) => {
    try {
        const today = new Date().setHours(0, 0, 0, 0);
        const user = await User.findById(req.user.id);
        const lastLoginDate = new Date(user.lastLogin).setHours(0, 0, 0, 0);
        if (lastLoginDate < today) {
            user.dailyScore = 0;
            const yesterday = new Date(today).setDate(new Date(today).getDate() - 1);
            if (lastLoginDate < yesterday) {
                user.streak = 0;
            }
        }
        user.lastLogin = new Date();
        await user.save();
        // Only create stat missions if they don't exist for today
        const existingStatMissions = await Mission.countDocuments({ user: req.user.id, date: today, source: 'System', rarity: 'Stat' });
        if (existingStatMissions === 0) {
            const statQuests = ['strength', 'intelligence', 'discipline', 'vitality'].map(statName => {
                const statLevel = user.stats[statName];
                const quest = getStatQuest(statName, statLevel);
                return { ...quest, user: req.user.id, date: today, source: 'System' };
            });
            await Mission.insertMany(statQuests);
        }
        

        const allMissions = await Mission.find({ user: req.user.id, date: today });

        res.json(allMissions);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error retrieving missions.');
    }
};
// Refresh stat-based quests when stats are upgraded
exports.refreshStatQuests = async (req, res) => {
    try {
        const today = new Date().setHours(0, 0, 0, 0);
        const user = await User.findById(req.user.id);
        
        // Delete existing stat quests for today
        await Mission.deleteMany({ 
            user: req.user.id, 
            date: today, 
            source: 'System', 
            rarity: 'Stat' 
        });
        
        // Create new stat quests based on current stat levels
        const statQuests = ['strength', 'intelligence', 'discipline', 'vitality'].map(statName => {
            const statLevel = user.stats[statName];
            const quest = getStatQuest(statName, statLevel);
            return { ...quest, user: req.user.id, date: today, source: 'System' };
        });
        
        await Mission.insertMany(statQuests);
        
        // Return all missions for today
        const allMissions = await Mission.find({ user: req.user.id, date: today });
        res.json(allMissions);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error refreshing stat quests.');
    }
};

exports.completeMission = async (req, res) => {
    try {
        const mission = await Mission.findById(req.params.id);
        if (!mission) {
            return res.status(404).json({ msg: 'Mission not found.' });
        }
        if (mission.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized.' });
        }
        if (mission.status === 'Completed' || mission.status === 'Failed') {
            return res.status(400).json({ msg: 'Mission already completed or failed.' });
        }
        const user = await User.findById(req.user.id);
        let finalMsg = '';
        if (mission.source === 'User') {
            if (mission.status !== 'InProgress') {
                return res.status(400).json({ msg: 'Mission not in progress.' });
            }
            const timeTaken = (new Date() - new Date(mission.startTime)) / 1000;
            if (timeTaken <= mission.timeLimit) {
                const performance = 1 - (timeTaken / mission.timeLimit);
                const basePoints = Math.ceil(mission.timeLimit / 120);
                const baseExp = Math.ceil(mission.timeLimit / 60);
                const bonusPoints = Math.ceil(basePoints * performance);
                const bonusExp = Math.ceil(baseExp * performance);
                mission.pointReward = basePoints + bonusPoints;
                mission.expReward = baseExp + bonusExp;
                mission.status = 'Completed';
                finalMsg = `Success! Bonus earned for performance. +${mission.pointReward}P, +${mission.expReward}EXP.`;
            } else {
                const penaltyPoints = Math.ceil(mission.timeLimit / 240);
                mission.pointReward = -penaltyPoints;
                mission.expReward = 0;
                mission.status = 'Failed';
                finalMsg = `Failed! Time limit exceeded. -${penaltyPoints}P penalty.`;
            }
        } else {
            mission.status = 'Completed';
            finalMsg = `Gate Cleared! +${mission.pointReward}P, +${mission.expReward}EXP.`;
        }
        if (mission.pointReward > 0) user.dailyScore += mission.pointReward;
        user.points = Math.max(0, user.points + mission.pointReward);
        user.exp += mission.expReward;
        const today = new Date().setHours(0, 0, 0, 0);
        const hasCompletedToday = await Mission.countDocuments({ user: req.user.id, date: today, status: 'Completed' });
        if (hasCompletedToday === 0) {
            user.streak += 1;
        }
        await mission.save();
        let leveledUp = false;
        let oldLevel = user.level;
        while (user.exp >= user.expToNextLevel) {
            leveledUp = true;
            user.exp -= user.expToNextLevel;
            user.level += 1;
            user.expToNextLevel = Math.floor(user.expToNextLevel * 1.2);
            user.statPoints += 1;
        }
        await user.save();

        // Check for rank transition
        const getRank = (level) => {
            if (level >= 101) return 'N';
            if (level >= 86) return 'S';
            if (level >= 61) return 'A';
            if (level >= 46) return 'B';
            if (level >= 31) return 'C';
            if (level >= 16) return 'D';
            return 'E';
        };

        const oldRank = getRank(oldLevel);
        const newRank = getRank(user.level);
        let isTransition = false;
        let transitionData = null;

        if (leveledUp && oldRank !== newRank) {
            isTransition = true;
            const dialogues = {
                'E->D': ["Lets See How Far I Can Go", "The Real Hunt Begins"],
                'D->C': ["You're no longer just surviving. You can feel the first real shift in your power.", "So, this is the feeling of growth.", "I'm not the one at the bottom anymore."],
                'C->B': ["A major breakthrough. You've shattered a plateau and your abilities are on a new level.", "It seems I've been underestimating myself.", "The path forward just became clearer."],
                'B->A': ["You are now truly elite. The power feels less like a tool and more like a part of you.", "This level of control... it feels natural.", "The air up here feels different."],
                'A->S': ["You have transcended. You are no longer on the same stage as the others.", "So, this is the peak.", "I've left them all behind."],
                'S->N': ["You are an absolute. Your will is now the law. The game is over.", "The rules... no longer apply to me.", "There's nothing left to climb."]
            };
            const key = `${oldRank}->${newRank}`;
            const options = dialogues[key] || [];
            const dialogue = options[Math.floor(Math.random() * options.length)] || '';
            transitionData = { fromRank: oldRank, toRank: newRank, dialogue };
        }

        res.json({ msg: finalMsg, user: await User.findById(req.user.id).select('-password'), leveledUp, newLevel: user.level, updatedMission: mission, isTransition, transitionData });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error completing mission.');
    }
};
