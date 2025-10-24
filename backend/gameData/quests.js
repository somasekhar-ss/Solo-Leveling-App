// Stat-based quest definitions
const STAT_QUESTS = {
    strength: [
        { description: 'Do 10 Pushups', expReward: 15, pointReward: 10 },
        { description: 'Do 20 Pushups', expReward: 20, pointReward: 15 },
        { description: 'Do 30 Pushups', expReward: 25, pointReward: 20 },
        { description: 'Do 40 Pushups', expReward: 30, pointReward: 25 },
        { description: 'Do 50 Pushups', expReward: 35, pointReward: 30 },
        { description: 'Do 60 Pushups', expReward: 40, pointReward: 35 },
        { description: 'Do 70 Pushups', expReward: 45, pointReward: 40 },
        { description: 'Do 80 Pushups', expReward: 50, pointReward: 45 },
        { description: 'Do 90 Pushups', expReward: 55, pointReward: 50 },
        { description: 'Do 100 Pushups', expReward: 60, pointReward: 55 }
    ],
    intelligence: [
        { description: 'Study for 45 Minutes', expReward: 15, pointReward: 10 },
        { description: 'Study for 60 Minutes (1 hr)', expReward: 20, pointReward: 15 },
        { description: 'Study for 75 Minutes (1.25 hr)', expReward: 25, pointReward: 20 },
        { description: 'Study for 90 Minutes (1.5 hr)', expReward: 30, pointReward: 25 },
        { description: 'Study for 120 Minutes (2 hr)', expReward: 35, pointReward: 30 },
        { description: 'Study for 150 Minutes (2.5 hr)', expReward: 40, pointReward: 35 },
        { description: 'Study for 180 Minutes (3 hr)', expReward: 45, pointReward: 40 },
        { description: 'Study for 210 Minutes (3.5 hr)', expReward: 50, pointReward: 45 },
        { description: 'Study for 225 Minutes (3.75 hr)', expReward: 55, pointReward: 50 },
        { description: 'Study for 240 Minutes (4 hr)', expReward: 60, pointReward: 55 }
    ],
    discipline: [
        { description: 'Meditate for 5 Minutes', expReward: 15, pointReward: 10 },
        { description: 'Meditate for 8 Minutes', expReward: 20, pointReward: 15 },
        { description: 'Meditate for 10 Minutes', expReward: 25, pointReward: 20 },
        { description: 'Meditate for 15 Minutes', expReward: 30, pointReward: 25 },
        { description: 'Meditate for 20 Minutes', expReward: 35, pointReward: 30 },
        { description: 'Meditate for 25 Minutes', expReward: 40, pointReward: 35 },
        { description: 'Meditate for 30 Minutes', expReward: 45, pointReward: 40 },
        { description: 'Meditate for 40 Minutes', expReward: 50, pointReward: 45 },
        { description: 'Meditate for 50 Minutes', expReward: 55, pointReward: 50 },
        { description: 'Meditate for 60 Minutes (1 hr)', expReward: 60, pointReward: 55 }
    ],
    vitality: [
        { description: 'Drink 2 Liters of Water', expReward: 15, pointReward: 10 },
        { description: 'Drink 2 Liters of Water AND Eat 1 Fruit/Vegetable', expReward: 20, pointReward: 15 },
        { description: 'Drink 2 Liters of Water AND Eat 1 Healthy Meal', expReward: 25, pointReward: 20 },
        { description: 'Drink 3 Liters of Water AND Eat 1 Healthy Meal', expReward: 30, pointReward: 25 },
        { description: 'Drink 3 Liters of Water AND Avoid Sugary Drinks', expReward: 35, pointReward: 30 },
        { description: 'Drink 3 Liters of Water AND Eat 2 Healthy Meals', expReward: 40, pointReward: 35 },
        { description: 'Eat 2 Healthy Meals AND Avoid Sugary Drinks', expReward: 45, pointReward: 40 },
        { description: 'Eat 3 Healthy Meals', expReward: 50, pointReward: 45 },
        { description: 'Eat 3 Healthy Meals AND Avoid All Junk Food', expReward: 55, pointReward: 50 },
        { description: 'Eat 3 Healthy Meals, No Junk Food, & No Sugary Drinks', expReward: 60, pointReward: 55 }
    ]
}



// Common Dailies Pool (5 simple tasks)
const COMMON_DAILIES_POOL = [
    { description: 'Hydration Check: Drink 8 glasses of water', rarity: 'CommonDaily', expReward: 5, pointReward: 5 },
    { description: 'Posture Reset: Do 5 minutes of stretching', rarity: 'CommonDaily', expReward: 5, pointReward: 5 },
    { description: 'Quick Scan: Review yesterday\'s study notes for 10 minutes', rarity: 'CommonDaily', expReward: 5, pointReward: 5 },
    { description: 'Tidy Up: Organize your desk/workspace for 5 minutes', rarity: 'CommonDaily', expReward: 5, pointReward: 5 },
    { description: 'Goal Check-in: Read your main goals for the week', rarity: 'CommonDaily', expReward: 5, pointReward: 5 }
];



// Random Gate Task Pool (11 mature tasks)
const RANDOM_GATE_POOL = [
    { description: 'Inventory Clear: Organize and clean your entire room', expReward: 50, pointReward: 30 },
    { description: 'Knowledge Raid: Complete a full practice test or assignment', expReward: 80, pointReward: 50 },
    { description: 'Endurance Trial: Exercise for 45 minutes straight', expReward: 70, pointReward: 40 },
    { description: 'Focus Dungeon: Study for 3 hours without any breaks', expReward: 120, pointReward: 80 },
    { description: 'Social Quest: Have a meaningful conversation with family/friends', expReward: 40, pointReward: 25 },
    { description: 'Skill Forge: Practice a hobby or skill for 2 hours', expReward: 90, pointReward: 60 },
    { description: 'Health Checkpoint: Complete a full health routine (exercise + nutrition)', expReward: 100, pointReward: 70 },
    { description: 'Mental Fortress: Meditate for 30 minutes in complete silence', expReward: 60, pointReward: 35 },
    { description: 'Achievement Hunt: Complete 3 challenging tasks you\'ve been avoiding', expReward: 150, pointReward: 100 },
    { description: 'Boss Battle: Tackle your most difficult project for 4+ hours', expReward: 200, pointReward: 150 },
    { description: 'Red Gate: Push yourself beyond your comfort zone today', expReward: 300, pointReward: 200 }
];

// Function to get random gate rank based on weighted probabilities
function getRandomGateRank() {
    const roll = Math.random();
    if (roll <= 0.01) return 'S'; // 1%
    if (roll <= 0.05) return 'A'; // 4%
    if (roll <= 0.15) return 'B'; // 10%
    if (roll <= 0.30) return 'C'; // 15%
    if (roll <= 0.60) return 'D'; // 30%
    return 'E'; // 40%
}

// Function to get gate color based on rank
function getGateColor(rank) {
    const colors = {
        'E': '#808080', // Grey
        'D': '#28a745', // Green
        'C': '#007BFF', // Blue
        'B': '#9400D3', // Purple
        'A': '#FFD700', // Gold
        'S': '#DC3545'  // Red
    };
    return colors[rank] || '#808080';
}

// Function to get stat quest based on stat level
function getStatQuest(statName, statLevel) {
    const quests = STAT_QUESTS[statName];
    if (!quests || statLevel < 1 || statLevel > 10) return null;
    
    const quest = quests[statLevel - 1];
    return {
        ...quest,
        rarity: 'Stat',
        statType: statName
    };
}

module.exports = { 
    COMMON_DAILIES_POOL, 
    RANDOM_GATE_POOL, 
    STAT_QUESTS, 
    getStatQuest, 
    getRandomGateRank, 
    getGateColor 
};