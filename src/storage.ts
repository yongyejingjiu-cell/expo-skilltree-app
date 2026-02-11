/**
 * storage.ts
 * AsyncStorageを使用したデータ永続化を集約
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProgress, TrackId, CourseId, QuestLog, SkillMasteryMap, SkillMastery, SkillId, AdventureLog, WeaknessEntry } from './types';

// ストレージキー
const STORAGE_KEYS = {
    USER_PROGRESS: '@quest_user_progress',
    DIARY: '@learning_diary_key',
    SKILL_MASTERY: '@skill_mastery',  // Phase3: スキル熟練度
    ADVENTURE_LOGS: '@adventure_logs', // Phase4: 冒険ログ
    WEAKNESSES: '@weaknesses',         // Phase4: 弱点リスト
} as const;

// ========================================
// デフォルト値
// ========================================

const DEFAULT_USER_PROGRESS: UserProgress = {
    selectedTrackId: 'basic_it',
    selectedCourseId: null,
    totalXP: 0,
    level: 1,
    streakDays: 0,
    lastActiveDate: '',
    todayCompletedQuestIds: [],
    questLogs: [],
    currentAvatar: {
        body: 'type1',
        hair: 'hair1',
        clothing: 'robe1',
        accessory: 'staff1',
    },
    unlockedAvatarItems: ['type1', 'hair1', 'robe1', 'staff1'],
    title: '新米冒険者',
};

// ========================================
// ユーティリティ関数
// ========================================

/**
 * 今日の日付をYYYY-MM-DD形式で取得
 */
export const getTodayDateString = (): string => {
    const now = new Date();
    return now.toISOString().split('T')[0];
};

/**
 * XPからレベルを計算（100XPで1レベルアップ、段々必要XPが増える）
 */
export const calculateLevel = (totalXP: number): number => {
    // レベル1: 0-99, レベル2: 100-249, レベル3: 250-449, ...
    // 必要XP = (レベル) * 100 + (レベル-1) * 50
    let level = 1;
    let xpForNextLevel = 100;
    let accumulatedXP = 0;

    while (accumulatedXP + xpForNextLevel <= totalXP) {
        accumulatedXP += xpForNextLevel;
        level++;
        xpForNextLevel = 100 + (level - 1) * 50;
    }

    return level;
};

/**
 * 現在レベルでの進捗（現在XP, 次レベルまでのXP）
 */
export const getLevelProgress = (totalXP: number): { currentLevelXP: number; xpForNextLevel: number } => {
    let level = 1;
    let xpForNextLevel = 100;
    let accumulatedXP = 0;

    while (accumulatedXP + xpForNextLevel <= totalXP) {
        accumulatedXP += xpForNextLevel;
        level++;
        xpForNextLevel = 100 + (level - 1) * 50;
    }

    return {
        currentLevelXP: totalXP - accumulatedXP,
        xpForNextLevel,
    };
};

/**
 * 連続日数を計算（昨日からの連続かチェック）
 */
const calculateStreakDays = (lastActiveDate: string, currentStreak: number): number => {
    const today = getTodayDateString();

    if (lastActiveDate === today) {
        // 今日すでにアクティブ
        return currentStreak;
    }

    if (!lastActiveDate) {
        // 初めてのアクセス
        return 1;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toISOString().split('T')[0];

    if (lastActiveDate === yesterdayString) {
        // 昨日アクティブだった → 連続継続
        return currentStreak + 1;
    }

    // 連続が途切れた
    return 1;
};

// ========================================
// ストレージ操作関数
// ========================================

/**
 * ユーザー進行状況を読み込む
 */
export const loadUserProgress = async (): Promise<UserProgress> => {
    try {
        const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROGRESS);
        if (data) {
            const progress = JSON.parse(data) as UserProgress;

            // 日付が変わっていたら今日の完了クエストをリセット
            const today = getTodayDateString();
            if (progress.lastActiveDate !== today) {
                progress.todayCompletedQuestIds = [];
            }

            return progress;
        }
        return { ...DEFAULT_USER_PROGRESS };
    } catch (error) {
        console.error('Failed to load user progress:', error);
        return { ...DEFAULT_USER_PROGRESS };
    }
};

/**
 * ユーザー進行状況を保存する
 */
export const saveUserProgress = async (progress: UserProgress): Promise<void> => {
    try {
        await AsyncStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(progress));
    } catch (error) {
        console.error('Failed to save user progress:', error);
        throw error;
    }
};

/**
 * 選択中のトラックを変更
 */
export const changeTrack = async (trackId: TrackId): Promise<UserProgress> => {
    const progress = await loadUserProgress();
    progress.selectedTrackId = trackId;
    await saveUserProgress(progress);
    return progress;
};

/**
 * 選択中のコースを変更
 */
export const changeCourse = async (courseId: CourseId): Promise<UserProgress> => {
    const progress = await loadUserProgress();
    progress.selectedCourseId = courseId;
    await saveUserProgress(progress);
    return progress;
};

/**
 * クエストを完了してXPを加算
 */
export const completeQuest = async (questId: string, xpReward: number): Promise<UserProgress> => {
    const progress = await loadUserProgress();
    const today = getTodayDateString();

    // すでに今日完了済みならスキップ
    if (progress.todayCompletedQuestIds.includes(questId)) {
        return progress;
    }

    // XP加算
    progress.totalXP += xpReward;
    progress.level = calculateLevel(progress.totalXP);

    // 完了クエストID追加
    progress.todayCompletedQuestIds.push(questId);

    // 連続日数更新
    progress.streakDays = calculateStreakDays(progress.lastActiveDate, progress.streakDays);
    progress.lastActiveDate = today;

    // ログ追加
    const log: QuestLog = {
        questId,
        completedAt: new Date().toISOString(),
        xpEarned: xpReward,
    };
    progress.questLogs.push(log);

    // 保存
    await saveUserProgress(progress);
    return progress;
};

/**
 * 今日のアクティビティを記録（日記保存時などに呼ぶ）
 */
export const recordTodayActivity = async (): Promise<UserProgress> => {
    const progress = await loadUserProgress();
    const today = getTodayDateString();

    if (progress.lastActiveDate !== today) {
        progress.streakDays = calculateStreakDays(progress.lastActiveDate, progress.streakDays);
        progress.lastActiveDate = today;
        await saveUserProgress(progress);
    }

    return progress;
};

/**
 * 進行状況をリセット（デバッグ用）
 */
export const resetUserProgress = async (): Promise<void> => {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_PROGRESS);
};

// ========================================
// Phase3: スキル熟練度 ストレージ
// ========================================

/**
 * スキル熟練度マップを読み込む
 */
export const loadSkillMastery = async (): Promise<SkillMasteryMap> => {
    try {
        const data = await AsyncStorage.getItem(STORAGE_KEYS.SKILL_MASTERY);
        if (data) {
            return JSON.parse(data) as SkillMasteryMap;
        }
        return {};
    } catch (error) {
        console.error('Failed to load skill mastery:', error);
        return {};
    }
};

/**
 * スキル熟練度マップを保存する
 */
export const saveSkillMastery = async (mastery: SkillMasteryMap): Promise<void> => {
    try {
        await AsyncStorage.setItem(STORAGE_KEYS.SKILL_MASTERY, JSON.stringify(mastery));
    } catch (error) {
        console.error('Failed to save skill mastery:', error);
        throw error;
    }
};

/**
 * 特定スキルの熟練度を取得
 */
export const getSkillMastery = async (skillId: SkillId): Promise<SkillMastery> => {
    const masteryMap = await loadSkillMastery();
    return masteryMap[skillId] || {
        skillId,
        masteryLevel: 0,
        quizCorrectCount: 0,
        lastStudiedAt: '',
    };
};

/**
 * クイズ正解時: 熟練度UP + XP加算
 */
export const recordQuizCorrect = async (
    skillId: SkillId,
    xpReward: number,
): Promise<{ mastery: SkillMastery; progress: UserProgress }> => {
    // 熟練度更新
    const masteryMap = await loadSkillMastery();
    const current = masteryMap[skillId] || {
        skillId,
        masteryLevel: 0,
        quizCorrectCount: 0,
        lastStudiedAt: '',
    };

    current.quizCorrectCount += 1;
    current.masteryLevel = Math.min(100, current.masteryLevel + 10); // +10% ずつ
    current.lastStudiedAt = new Date().toISOString();
    masteryMap[skillId] = current;
    await saveSkillMastery(masteryMap);

    // XP加算
    const progress = await loadUserProgress();
    progress.totalXP += xpReward;
    progress.level = calculateLevel(progress.totalXP);

    // 連続日数
    const today = getTodayDateString();
    progress.streakDays = calculateStreakDays(progress.lastActiveDate, progress.streakDays);
    progress.lastActiveDate = today;

    await saveUserProgress(progress);

    return { mastery: current, progress };
};

/**
 * スキル学習記録（クイズなしで閲覧だけした場合）
 */
export const recordSkillStudy = async (skillId: SkillId): Promise<SkillMastery> => {
    const masteryMap = await loadSkillMastery();
    const current = masteryMap[skillId] || {
        skillId,
        masteryLevel: 0,
        quizCorrectCount: 0,
        lastStudiedAt: '',
    };

    current.masteryLevel = Math.min(100, current.masteryLevel + 2); // 閲覧だけでも+2%
    current.lastStudiedAt = new Date().toISOString();
    masteryMap[skillId] = current;
    await saveSkillMastery(masteryMap);

    return current;
};

// ========================================
// Phase4: 冒険ログ ストレージ
// ========================================

/**
 * 冒険ログ一覧を読み込む
 */
export const loadAdventureLogs = async (): Promise<AdventureLog[]> => {
    try {
        const data = await AsyncStorage.getItem(STORAGE_KEYS.ADVENTURE_LOGS);
        if (data) {
            return JSON.parse(data) as AdventureLog[];
        }
        return [];
    } catch (error) {
        console.error('Failed to load adventure logs:', error);
        return [];
    }
};

/**
 * 冒険ログを保存する
 */
export const saveAdventureLogs = async (logs: AdventureLog[]): Promise<void> => {
    try {
        await AsyncStorage.setItem(STORAGE_KEYS.ADVENTURE_LOGS, JSON.stringify(logs));
    } catch (error) {
        console.error('Failed to save adventure logs:', error);
        throw error;
    }
};

/**
 * 冒険ログを追加する
 */
export const addAdventureLog = async (log: AdventureLog): Promise<AdventureLog[]> => {
    const logs = await loadAdventureLogs();
    const updated = [log, ...logs]; // 新しいものが先頭
    await saveAdventureLogs(updated);
    return updated;
};

/**
 * 冒険ログで使われている全タグを取得
 */
export const getAllTags = async (): Promise<string[]> => {
    const logs = await loadAdventureLogs();
    const tagSet = new Set<string>();
    logs.forEach(log => log.tags.forEach(tag => tagSet.add(tag)));
    return Array.from(tagSet).sort();
};

// ========================================
// Phase4: 弱点リスト ストレージ
// ========================================

/**
 * 弱点リストを読み込む
 */
export const loadWeaknesses = async (): Promise<WeaknessEntry[]> => {
    try {
        const data = await AsyncStorage.getItem(STORAGE_KEYS.WEAKNESSES);
        if (data) {
            return JSON.parse(data) as WeaknessEntry[];
        }
        return [];
    } catch (error) {
        console.error('Failed to load weaknesses:', error);
        return [];
    }
};

/**
 * 弱点リストを保存する
 */
export const saveWeaknesses = async (weaknesses: WeaknessEntry[]): Promise<void> => {
    try {
        await AsyncStorage.setItem(STORAGE_KEYS.WEAKNESSES, JSON.stringify(weaknesses));
    } catch (error) {
        console.error('Failed to save weaknesses:', error);
        throw error;
    }
};

/**
 * 弱点を追加する
 */
export const addWeakness = async (weakness: WeaknessEntry): Promise<WeaknessEntry[]> => {
    const list = await loadWeaknesses();
    const updated = [weakness, ...list];
    await saveWeaknesses(updated);
    return updated;
};

/**
 * 弱点を克服済みにする
 */
export const resolveWeakness = async (weaknessId: string): Promise<WeaknessEntry[]> => {
    const list = await loadWeaknesses();
    const updated = list.map(w =>
        w.id === weaknessId ? { ...w, resolved: true } : w
    );
    await saveWeaknesses(updated);
    return updated;
};

// ========================================
// エクスポート
// ========================================

export { STORAGE_KEYS };
