# Solo Leveling Progression System

## Overview
This document outlines the interconnected progression system implemented in the Solo Leveling app. The core loop revolves around completing Daily Gates (Quests) to earn EXP and Points (P), which drive character progression through Main Levels, Main Ranks, and Stat upgrades.

## Core Currencies

### EXP (Experience Points)
- **Source**: Completing "Daily Gates" and "Personal Missions"
- **Purpose**: Only used to increase Main Level (e.g., LV. 15 → LV. 16)
- **Does NOT**: Buy stats or shop items

### P (Points)
- **Source**: Completing "Daily Gates" and "Personal Missions"  
- **Purpose**: Primary spendable currency with strategic choice:
  - **Stats**: Spend P in "Status" window for permanent power increases
  - **Shop**: Spend P for one-time items (Titles, cosmetics, utility items)

## Main Rank System (Passive Progression)

Main Rank is automatically determined by your Main Level:

| Rank | Level Range |
|------|-------------|
| E-Rank | LVL 1 - 15 |
| D-Rank | LVL 16 - 30 |
| C-Rank | LVL 31 - 45 |
| B-Rank | LVL 46 - 60 |
| A-Rank | LVL 61 - 75 |
| S-Rank | LVL 76+ |

## Stat System (Active Choice & "Limit Break")

### Four Stats
- **Strength**: Physical power and endurance
- **Intelligence**: Mental capacity and learning
- **Discipline**: Focus and self-control  
- **Vitality**: Health and recovery

### Stat Caps by Rank
Your Main Rank determines the maximum level for all stats:

| Rank | Stat Cap |
|------|----------|
| E-Rank | LV. 2 |
| D-Rank | LV. 4 |
| C-Rank | LV. 6 |
| B-Rank | LV. 8 |
| A-Rank | LV. 9 |
| S-Rank | LV. 10 |

### Stat Upgrade Costs
| Level Upgrade | Cost (P) |
|---------------|----------|
| LV. 1 → LV. 2 | 100 P |
| LV. 2 → LV. 3 | 250 P |
| LV. 3 → LV. 4 | 500 P |
| LV. 4 → LV. 5 | 800 P |
| LV. 5 → LV. 6 | 1200 P |
| LV. 6 → LV. 7 | 1700 P |
| LV. 7 → LV. 8 | 2500 P |
| LV. 8 → LV. 9 | 3500 P |
| LV. 9 → LV. 10 | 5000 P |

## Daily Gates (Quest Progression)

### Stat-Based Quests
Each day, you receive 4 stat-based quests that scale with your current stat levels:

#### Strength (Pushups)
- LV. 1: Do 10 Pushups
- LV. 2: Do 20 Pushups
- ...
- LV. 10: Do 100 Pushups

#### Intelligence (Study)
- LV. 1: Study for 45 Minutes
- LV. 2: Study for 60 Minutes (1 hr)
- ...
- LV. 10: Study for 240 Minutes (4 hr)

#### Discipline (Meditation)
- LV. 1: Meditate for 5 Minutes
- LV. 2: Meditate for 8 Minutes
- ...
- LV. 10: Meditate for 60 Minutes (1 hr)

#### Vitality (Nutrition)
- LV. 1: Drink 2 Liters of Water
- LV. 2: Drink 2 Liters of Water AND Eat 1 Fruit/Vegetable
- ...
- LV. 10: Eat 3 Healthy Meals, No Junk Food, & No Sugary Drinks

### Quest Rewards
Higher stat levels = Higher difficulty = Better rewards (more EXP and P)

## Rank-Up Notifications

When your Main Level increases enough to trigger a rank change, you'll see special notifications:

### E → D Rank
```
[ RANK-UP DETECTED ]
MAIN RANK: E → D
Strength Max Cap increased: LV. 2 → LV. 4
Intelligence Max Cap increased: LV. 2 → LV. 4
Discipline Max Cap increased: LV. 2 → LV. 4
Vitality Max Cap increased: LV. 2 → LV. 4
"So, the real test begins."
```

### D → C Rank
```
[ RANK-UP DETECTED ]
MAIN RANK: D → C
Strength Max Cap increased: LV. 4 → LV. 6
Intelligence Max Cap increased: LV. 4 → LV. 6
Discipline Max Cap increased: LV. 4 → LV. 6
Vitality Max Cap increased: LV. 4 → LV. 6
"I can finally feel myself changing."
```

### C → B Rank
```
[ RANK-UP DETECTED ]
MAIN RANK: C → B
Strength Max Cap increased: LV. 6 → LV. 8
Intelligence Max Cap increased: LV. 6 → LV. 8
Discipline Max Cap increased: LV. 6 → LV. 8
Vitality Max Cap increased: LV. 6 → LV. 8
"So, I was holding back."
```

### B → A Rank
```
[ RANK-UP DETECTED ]
MAIN RANK: B → A
Strength Max Cap increased: LV. 8 → LV. 9
Intelligence Max Cap increased: LV. 8 → LV. 9
Discipline Max Cap increased: LV. 8 → LV. 9
Vitality Max Cap increased: LV. 8 → LV. 9
"This power... it feels natural."
```

### A → S Rank
```
[ RANK-UP DETECTED ]
MAIN RANK: A → S
Strength Max Cap increased: LV. 9 → LV. 10
Intelligence Max Cap increased: LV. 9 → LV. 10
Discipline Max Cap increased: LV. 9 → LV. 10
Vitality Max Cap increased: LV. 9 → LV. 10
"So this is the view from the top."
```

## API Endpoints

### Stats Management
- `GET /api/stats` - Get user stats and progression info
- `POST /api/stats/upgrade` - Upgrade a stat (requires statName in body)
- `POST /api/stats/check-rankup` - Check for rank-up (requires previousLevel in body)

## Usage Instructions

1. **Complete Daily Gates**: Focus on stat-based quests to earn EXP and P
2. **Level Up**: EXP increases your Main Level, which determines your Main Rank
3. **Upgrade Stats**: Spend P strategically in the Status window to increase stat levels
4. **Unlock Higher Caps**: Reach higher Main Ranks to unlock higher stat level caps
5. **Repeat**: Higher stat levels unlock more challenging and rewarding Daily Gates

## Strategic Considerations

- **Point Allocation**: Choose between immediate shop purchases vs. long-term stat investments
- **Stat Balance**: Consider which stats to prioritize based on your goals
- **Rank Progression**: Focus on completing quests to gain EXP for rank advancement
- **Quest Difficulty**: Higher stat levels mean harder quests but better rewards

The system creates a compelling progression loop where every action contributes to character growth while maintaining strategic depth through resource allocation choices.