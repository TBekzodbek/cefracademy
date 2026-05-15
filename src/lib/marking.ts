export interface ScoreRange {
    level: string;
    minPoints: number;
    maxPoints: number;
    minCorrectAnswers: number;
    maxCorrectAnswers: number;
}

export const CEFR_MARKING_SYSTEM: ScoreRange[] = [
    { level: 'C1', minPoints: 65, maxPoints: 75, minCorrectAnswers: 28, maxCorrectAnswers: 35 },
    { level: 'B2', minPoints: 51, maxPoints: 64, minCorrectAnswers: 18, maxCorrectAnswers: 27 },
    { level: 'B1', minPoints: 38, maxPoints: 50, minCorrectAnswers: 10, maxCorrectAnswers: 17 },
    { level: 'Below B1', minPoints: 0, maxPoints: 37, minCorrectAnswers: 0, maxCorrectAnswers: 9 }
];

export const getLevelFromScore = (score: number): string => {
    const range = CEFR_MARKING_SYSTEM.find(r => score >= r.minPoints && score <= r.maxPoints);
    return range ? range.level : 'N/A';
};

export const getPointsFromCorrectAnswers = (correctAnswers: number): number => {
    // This is a simplified 75-point scale projection
    // Each question is roughly 2.14 points (75 / 35)
    return Math.round(correctAnswers * (75 / 35));
};
