const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: './.env' });

// Load models
const User = require('./models/User');
const Mission = require('./models/Mission');
const { getStatQuest } = require('./gameData/quests');

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const fixStatTraining = async () => {
    try {
        console.log('Connecting to database...');
        
        // Find all users
        const users = await User.find({});
        console.log(`Found ${users.length} users`);
        
        const today = new Date().setHours(0, 0, 0, 0);
        
        for (const user of users) {
            console.log(`\nProcessing user: ${user.username}`);
            console.log(`User stats:`, user.stats);
            
            // Check if user already has stat missions for today
            const existingStatMissions = await Mission.find({
                user: user._id,
                date: today,
                source: 'System',
                rarity: 'Stat'
            });
            
            console.log(`Existing stat missions: ${existingStatMissions.length}`);
            
            if (existingStatMissions.length === 0) {
                console.log('Creating stat missions...');
                
                // Create stat-based quests (4 quests based on current stat levels)
                const statQuests = ['strength', 'intelligence', 'discipline', 'vitality'].map(statName => {
                    const statLevel = user.stats[statName];
                    const quest = getStatQuest(statName, statLevel);
                    console.log(`${statName} (level ${statLevel}): ${quest.description}`);
                    return { ...quest, user: user._id, date: today, source: 'System' };
                });
                
                await Mission.insertMany(statQuests);
                console.log('✅ Stat missions created successfully!');
            } else {
                console.log('✅ Stat missions already exist for today');
            }
        }
        
        console.log('\n🎉 All users processed successfully!');
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

fixStatTraining();