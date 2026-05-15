export interface LevelInfo {
    level: number;
    currentXP: number;
    xpToNextLevel: number;
    progress: number;
    title: string;
}

export const calculateLevel = (points: number): LevelInfo => {
    // Basic progression: level 1 is 0-100xp, level 2 is 100-300xp, level 3 is 300-600xp, etc.
    // Formula: XP = 100 * level * (level - 1) / 2
    // Let's use a simpler one: XP = 200 * (level - 1)^1.2

    let level = 1;
    const getXPForLevel = (l: number) => Math.floor(250 * Math.pow(l - 1, 1.5));

    while (points >= getXPForLevel(level + 1)) {
        level++;
    }

    const currentLevelXP = getXPForLevel(level);
    const nextLevelXP = getXPForLevel(level + 1);
    const xpInLevel = points - currentLevelXP;
    const xpRequiredForLevel = nextLevelXP - currentLevelXP;
    const progress = (xpInLevel / xpRequiredForLevel) * 100;

    const titles = [
        "Beginner Walker", "Steady Learner", "Active Explorer",
        "Dedicated Student", "Knowledge Seeker", "Skill Master",
        "Expert Scholar", "Grand Researcher", "Academic Elite", "CEFR Legend"
    ];

    return {
        level,
        currentXP: xpInLevel,
        xpToNextLevel: xpRequiredForLevel,
        progress: Math.min(progress, 100),
        title: titles[Math.min(level - 1, titles.length - 1)]
    };
};
