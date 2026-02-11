/**
 * quests.ts
 * トラックとクエストの定義データ
 */

import { Track, Quest, TrackId, DailyQuestBoard } from '../types';
import { colors } from '../theme';

// ========================================
// トラック定義
// ========================================

export const TRACKS: Track[] = [
    {
        id: 'basic_it',
        name: '基本情報技術者',
        icon: '💻',
        description: 'IT基礎からしっかり学ぶ',
        color: colors.info,
    },
    {
        id: 'applied_it',
        name: '応用情報技術者',
        icon: '🔧',
        description: '実践的なIT知識を深める',
        color: colors.warning,
    },
    {
        id: 'toeic',
        name: 'TOEIC',
        icon: '🌍',
        description: '英語力を鍛える',
        color: colors.success,
    },
    {
        id: 'free',
        name: 'フリースタイル',
        icon: '✨',
        description: '自分のペースで自由に学習',
        color: colors.primary,
    },
];

/**
 * TrackIdからTrackを取得
 */
export const getTrackById = (trackId: TrackId): Track => {
    return TRACKS.find(t => t.id === trackId) || TRACKS[0];
};

// ========================================
// クエストテンプレート
// ========================================

/**
 * メインクエストのテンプレート（トラック別）
 */
const MAIN_QUEST_TEMPLATES: Record<TrackId, Quest[]> = {
    basic_it: [
        {
            id: 'main_study_25',
            type: 'main',
            title: '25分集中学習',
            description: 'ポモドーロ1セット分の集中学習に挑戦！',
            icon: '⏱️',
            xpReward: 100,
            targetMinutes: 25,
        },
        {
            id: 'main_study_50',
            type: 'main',
            title: '50分マラソン学習',
            description: '長時間の集中で知識を定着させよう',
            icon: '🏃',
            xpReward: 200,
            targetMinutes: 50,
        },
    ],
    applied_it: [
        {
            id: 'main_study_25',
            type: 'main',
            title: '25分集中学習',
            description: '応用問題に挑戦！',
            icon: '⏱️',
            xpReward: 120,
            targetMinutes: 25,
        },
    ],
    toeic: [
        {
            id: 'main_listening_25',
            type: 'main',
            title: 'リスニング25分',
            description: '英語耳を鍛えよう',
            icon: '🎧',
            xpReward: 100,
            targetMinutes: 25,
        },
    ],
    free: [
        {
            id: 'main_study_25',
            type: 'main',
            title: '25分自由学習',
            description: '好きなことを学ぼう',
            icon: '📚',
            xpReward: 80,
            targetMinutes: 25,
        },
    ],
};

/**
 * サブクエストのテンプレート（トラック別）
 */
const SUB_QUEST_TEMPLATES: Record<TrackId, Quest[]> = {
    basic_it: [
        {
            id: 'sub_review_1',
            type: 'sub',
            title: '復習問題1問',
            description: '前回の学習を振り返ろう',
            icon: '📝',
            xpReward: 20,
            targetCount: 1,
        },
        {
            id: 'sub_term_5',
            type: 'sub',
            title: 'IT用語5つ暗記',
            description: '基礎用語を覚えよう',
            icon: '💡',
            xpReward: 30,
            targetCount: 5,
        },
        {
            id: 'sub_diary',
            type: 'sub',
            title: '学習日記を書く',
            description: '今日の学びを記録しよう',
            icon: '📖',
            xpReward: 25,
            targetCount: 1,
        },
    ],
    applied_it: [
        {
            id: 'sub_review_1',
            type: 'sub',
            title: '過去問1問',
            description: '実践的な問題に挑戦',
            icon: '📝',
            xpReward: 30,
            targetCount: 1,
        },
        {
            id: 'sub_diagram_1',
            type: 'sub',
            title: '図解1つ作成',
            description: '理解を深めるために図解しよう',
            icon: '🎨',
            xpReward: 40,
            targetCount: 1,
        },
        {
            id: 'sub_diary',
            type: 'sub',
            title: '学習日記を書く',
            description: '今日の学びを記録しよう',
            icon: '📖',
            xpReward: 25,
            targetCount: 1,
        },
    ],
    toeic: [
        {
            id: 'sub_words_5',
            type: 'sub',
            title: '単語5分',
            description: 'TOEIC頻出単語を覚えよう',
            icon: '📚',
            xpReward: 25,
            targetMinutes: 5,
        },
        {
            id: 'sub_grammar_1',
            type: 'sub',
            title: '文法問題1問',
            description: 'Part 5形式の問題に挑戦',
            icon: '✏️',
            xpReward: 20,
            targetCount: 1,
        },
        {
            id: 'sub_diary',
            type: 'sub',
            title: '学習日記を書く',
            description: '今日の学びを記録しよう',
            icon: '📖',
            xpReward: 25,
            targetCount: 1,
        },
    ],
    free: [
        {
            id: 'sub_read_5',
            type: 'sub',
            title: '記事を5分読む',
            description: '興味のある記事を読もう',
            icon: '📰',
            xpReward: 20,
            targetMinutes: 5,
        },
        {
            id: 'sub_output_1',
            type: 'sub',
            title: 'アウトプット1つ',
            description: '学んだことを誰かに説明しよう',
            icon: '💬',
            xpReward: 30,
            targetCount: 1,
        },
        {
            id: 'sub_diary',
            type: 'sub',
            title: '学習日記を書く',
            description: '今日の学びを記録しよう',
            icon: '📖',
            xpReward: 25,
            targetCount: 1,
        },
    ],
};

// ========================================
// クエストボード生成
// ========================================

/**
 * 今日のクエストボードを生成
 */
export const generateDailyQuestBoard = (trackId: TrackId): DailyQuestBoard => {
    const today = new Date().toISOString().split('T')[0];

    // メインクエスト：ランダムに1つ選択（またはデフォルト）
    const mainQuests = MAIN_QUEST_TEMPLATES[trackId];
    const mainQuest = mainQuests[0]; // 今はシンプルに最初のものを使用

    // サブクエスト：全て表示
    const subQuests = SUB_QUEST_TEMPLATES[trackId];

    return {
        date: today,
        mainQuest,
        subQuests,
    };
};

/**
 * クエストが完了済みかどうかをチェック
 */
export const isQuestCompleted = (questId: string, completedQuestIds: string[]): boolean => {
    return completedQuestIds.includes(questId);
};
