/**
 * courses.ts
 * コースカテゴリとコースの定義データ
 */

import { CourseCategory, Course, CourseCategoryId, CourseId, Quest } from '../types';
import { colors } from '../theme';

// ========================================
// コースカテゴリ定義
// ========================================

export const COURSE_CATEGORIES: CourseCategory[] = [
    {
        id: 'it_cert',
        name: 'IT資格',
        icon: '🏆',
        description: '国家資格・公的資格を取得しよう',
        color: '#6C5CE7',  // 紫
    },
    {
        id: 'english',
        name: '英語',
        icon: '🌍',
        description: 'グローバルスキルを身につける',
        color: '#00B894',  // 緑
    },
    {
        id: 'it_general',
        name: 'IT全般',
        icon: '💻',
        description: '実践的なITスキルを学ぶ',
        color: '#0984E3',  // 青
    },
];

/**
 * カテゴリIDからカテゴリを取得
 */
export const getCategoryById = (categoryId: CourseCategoryId): CourseCategory => {
    return COURSE_CATEGORIES.find(c => c.id === categoryId) || COURSE_CATEGORIES[0];
};

// ========================================
// コース定義
// ========================================

export const COURSES: Course[] = [
    // IT資格カテゴリ
    {
        id: 'it_passport',
        categoryId: 'it_cert',
        name: 'ITパスポート',
        shortName: 'iパス',
        icon: '📋',
        description: 'IT初心者の第一歩。社会人の基礎知識を習得',
        color: '#74B9FF',
        difficulty: 1,
        estimatedHours: 50,
        badge: '入門',
    },
    {
        id: 'basic_it',
        categoryId: 'it_cert',
        name: '基本情報技術者',
        shortName: 'FE',
        icon: '🔰',
        description: 'ITエンジニアの登竜門。プログラミングと技術の基礎',
        color: '#55EFC4',
        difficulty: 2,
        estimatedHours: 150,
        badge: '人気',
    },
    {
        id: 'applied_it',
        categoryId: 'it_cert',
        name: '応用情報技術者',
        shortName: 'AP',
        icon: '⚙️',
        description: '高度IT人材への一歩。マネジメントと応用技術',
        color: '#FDCB6E',
        difficulty: 3,
        estimatedHours: 200,
    },

    // 英語カテゴリ
    {
        id: 'toeic',
        categoryId: 'english',
        name: 'TOEIC L&R',
        shortName: 'TOEIC',
        icon: '🎧',
        description: 'ビジネス英語力を測る世界標準テスト',
        color: '#E17055',
        difficulty: 2,
        estimatedHours: 100,
        badge: '人気',
    },

    // IT全般カテゴリ
    {
        id: 'web_dev',
        categoryId: 'it_general',
        name: 'Web開発入門',
        shortName: 'Web',
        icon: '🌐',
        description: 'HTML/CSS/JavaScriptでWebサイトを作ろう',
        color: '#00CEC9',
        difficulty: 1,
        estimatedHours: 40,
        badge: 'NEW',
    },
    {
        id: 'programming',
        categoryId: 'it_general',
        name: 'プログラミング基礎',
        shortName: 'Prog',
        icon: '👨‍💻',
        description: 'プログラミング的思考とコーディングの基本',
        color: '#A29BFE',
        difficulty: 1,
        estimatedHours: 30,
    },
];

/**
 * コースIDからコースを取得
 */
export const getCourseById = (courseId: CourseId): Course | undefined => {
    return COURSES.find(c => c.id === courseId);
};

/**
 * カテゴリに属するコースを取得
 */
export const getCoursesByCategory = (categoryId: CourseCategoryId): Course[] => {
    return COURSES.filter(c => c.categoryId === categoryId);
};

// ========================================
// コース別クエストテンプレート
// ========================================

/**
 * コース別メインクエスト
 */
export const COURSE_MAIN_QUESTS: Record<CourseId, Quest[]> = {
    it_passport: [
        {
            id: 'main_ipass_25',
            type: 'main',
            title: '25分集中学習',
            description: 'ストラテジ・マネジメント・テクノロジ分野を学ぼう',
            icon: '📖',
            xpReward: 100,
            targetMinutes: 25,
        },
    ],
    basic_it: [
        {
            id: 'main_fe_25',
            type: 'main',
            title: '25分集中学習',
            description: 'アルゴリズムとプログラミングを強化',
            icon: '⏱️',
            xpReward: 120,
            targetMinutes: 25,
        },
    ],
    applied_it: [
        {
            id: 'main_ap_25',
            type: 'main',
            title: '25分応用学習',
            description: '午後問題の記述対策に挑戦',
            icon: '📝',
            xpReward: 150,
            targetMinutes: 25,
        },
    ],
    toeic: [
        {
            id: 'main_toeic_listen',
            type: 'main',
            title: 'リスニング25分',
            description: 'Part1-4の問題形式に慣れよう',
            icon: '🎧',
            xpReward: 100,
            targetMinutes: 25,
        },
    ],
    web_dev: [
        {
            id: 'main_web_25',
            type: 'main',
            title: 'コーディング25分',
            description: 'HTML/CSS/JSでページを作ろう',
            icon: '💻',
            xpReward: 100,
            targetMinutes: 25,
        },
    ],
    programming: [
        {
            id: 'main_prog_25',
            type: 'main',
            title: 'プログラミング25分',
            description: '基礎文法と論理的思考を鍛えよう',
            icon: '🧩',
            xpReward: 100,
            targetMinutes: 25,
        },
    ],
};

/**
 * コース別サブクエスト
 */
export const COURSE_SUB_QUESTS: Record<CourseId, Quest[]> = {
    it_passport: [
        {
            id: 'sub_ipass_term',
            type: 'sub',
            title: 'IT用語5つ',
            description: '重要用語を覚えよう',
            icon: '💡',
            xpReward: 25,
            targetCount: 5,
        },
        {
            id: 'sub_ipass_quiz',
            type: 'sub',
            title: '過去問1問',
            description: '実際の試験問題に挑戦',
            icon: '✏️',
            xpReward: 20,
            targetCount: 1,
        },
        {
            id: 'sub_diary',
            type: 'sub',
            title: '学習日記',
            description: '今日の学びを記録',
            icon: '📖',
            xpReward: 15,
            targetCount: 1,
        },
    ],
    basic_it: [
        {
            id: 'sub_fe_algo',
            type: 'sub',
            title: 'アルゴリズム問題',
            description: 'トレース問題を1問解く',
            icon: '🔢',
            xpReward: 30,
            targetCount: 1,
        },
        {
            id: 'sub_fe_term',
            type: 'sub',
            title: '技術用語5つ',
            description: '基本用語を暗記',
            icon: '💡',
            xpReward: 25,
            targetCount: 5,
        },
        {
            id: 'sub_diary',
            type: 'sub',
            title: '学習日記',
            description: '今日の学びを記録',
            icon: '📖',
            xpReward: 15,
            targetCount: 1,
        },
    ],
    applied_it: [
        {
            id: 'sub_ap_review',
            type: 'sub',
            title: '午前問題5問',
            description: '過去問で知識確認',
            icon: '📝',
            xpReward: 35,
            targetCount: 5,
        },
        {
            id: 'sub_ap_essay',
            type: 'sub',
            title: '記述練習',
            description: '午後問題の要点まとめ',
            icon: '✍️',
            xpReward: 40,
            targetCount: 1,
        },
        {
            id: 'sub_diary',
            type: 'sub',
            title: '学習日記',
            description: '今日の学びを記録',
            icon: '📖',
            xpReward: 15,
            targetCount: 1,
        },
    ],
    toeic: [
        {
            id: 'sub_toeic_words',
            type: 'sub',
            title: '単語10個',
            description: 'TOEIC頻出単語を暗記',
            icon: '📚',
            xpReward: 25,
            targetCount: 10,
        },
        {
            id: 'sub_toeic_reading',
            type: 'sub',
            title: 'Part7 1問',
            description: '長文読解に挑戦',
            icon: '📰',
            xpReward: 30,
            targetCount: 1,
        },
        {
            id: 'sub_diary',
            type: 'sub',
            title: '学習日記',
            description: '今日の学びを記録',
            icon: '📖',
            xpReward: 15,
            targetCount: 1,
        },
    ],
    web_dev: [
        {
            id: 'sub_web_html',
            type: 'sub',
            title: 'HTMLタグ練習',
            description: '新しいタグを3つ使う',
            icon: '🏷️',
            xpReward: 20,
            targetCount: 3,
        },
        {
            id: 'sub_web_css',
            type: 'sub',
            title: 'CSSスタイリング',
            description: 'デザインを調整',
            icon: '🎨',
            xpReward: 25,
            targetCount: 1,
        },
        {
            id: 'sub_diary',
            type: 'sub',
            title: '学習日記',
            description: '今日の学びを記録',
            icon: '📖',
            xpReward: 15,
            targetCount: 1,
        },
    ],
    programming: [
        {
            id: 'sub_prog_practice',
            type: 'sub',
            title: 'コード写経',
            description: 'サンプルコードを書いてみる',
            icon: '⌨️',
            xpReward: 20,
            targetCount: 1,
        },
        {
            id: 'sub_prog_debug',
            type: 'sub',
            title: 'バグ修正',
            description: 'エラーを1つ直す',
            icon: '🐛',
            xpReward: 30,
            targetCount: 1,
        },
        {
            id: 'sub_diary',
            type: 'sub',
            title: '学習日記',
            description: '今日の学びを記録',
            icon: '📖',
            xpReward: 15,
            targetCount: 1,
        },
    ],
};

/**
 * コース用のクエストボードを生成
 */
export const generateCourseQuestBoard = (courseId: CourseId) => {
    const today = new Date().toISOString().split('T')[0];
    const mainQuests = COURSE_MAIN_QUESTS[courseId] || [];
    const subQuests = COURSE_SUB_QUESTS[courseId] || [];

    return {
        date: today,
        mainQuest: mainQuests[0],
        subQuests: subQuests,
    };
};
