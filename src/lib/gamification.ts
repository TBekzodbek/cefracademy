import { supabase } from './supabase';

export interface UserStats {
    xp: number;
    level: number;
    streak: number;
    last_activity: string | null;
}

export const GamificationService = {
    // Calculate level based on XP: Level 1 = 0-500, Level 2 = 500-1000, etc.
    calculateLevel: (xp: number) => Math.floor(xp / 500) + 1,

    // Calculate progress % toward next level
    calculateProgress: (xp: number) => (xp % 500) / 500 * 100,

    updateActivity: async (userId: string, xpGain: number) => {
        try {
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('xp, streak, last_activity')
                .eq('id', userId)
                .single();

            if (error) throw error;

            const now = new Date();
            const lastDate = profile.last_activity ? new Date(profile.last_activity) : null;

            let newStreak = profile.streak || 0;
            const updatedXP = (profile.xp || 0) + xpGain;

            if (!lastDate) {
                newStreak = 1;
            } else {
                const diffDays = Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));

                if (diffDays === 1) {
                    newStreak += 1;
                } else if (diffDays > 1) {
                    newStreak = 1;
                }
                // if diffDays === 0 (same day), streak stays same
            }

            const { error: updateError } = await supabase
                .from('profiles')
                .update({
                    xp: updatedXP,
                    streak: newStreak,
                    last_activity: now.toISOString()
                })
                .eq('id', userId);

            if (updateError) throw updateError;
            return { xp: updatedXP, streak: newStreak, level: Math.floor(updatedXP / 500) + 1 };
        } catch (e) {
            console.error("Gamification error:", e);
            return null;
        }
    }
};
