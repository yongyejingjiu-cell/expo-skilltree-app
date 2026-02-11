/**
 * mockSocial.ts
 * ソーシャル機能（リーダーボード）用のモックデータ生成
 */

import { SocialUser } from '../types';

const MOCK_NAMES = [
    'Alice', 'Bob', 'Charlie', 'Dave', 'Eve', 'Frank', 'Grace', 'Heidi',
    'Ivan', 'Judy', 'Karl', 'Leo', 'Mallory', 'Nina', 'Oscar', 'Peggy',
    'Quentin', 'Rupert', 'Sybil', 'Ted', 'Ursula', 'Victor', 'Walter', 'Xavier', 'Yvonne', 'Zelda',
    'Yuta', 'Kenta', 'Sora', 'Rina', 'Mana', 'Daiki', 'Haruto',
    'CyberNinja', 'CodeMaster', 'PixelArtist', 'DataWizard', 'NetRunner'
];

const MOCK_TITLES = [
    '不屈の努力家', '爆速学習者', 'ITパスポートの覇者', 'ネットワークの魔術師',
    'コードの哲学者', '深夜のデバッグ王', '資格ハンター', 'バグバスター',
    'タイピングの神様', 'アルゴリズムの化神', '未経験からの挑戦者'
];

const MOCK_COURSES_NAMES = [
    'ITパスポート', '基本情報', '応用情報', 'TOEIC 800', 'Python基礎', 'Web開発'
];

const MOCK_AVATARS = [
    '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯',
    '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🦆',
    '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋',
    '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🐬', '🐳', '🦈',
    '👾', '🤖', '👽', '👻', '💀', '☠️', '🎃', '😺', '😸', '😹'
];

/**
 * 疑似乱数生成 (決定論的にするためシードを使用可能にするのが理想だが今回は簡易実装)
 */
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

/**
 * リーダーボード用のモックデータを生成する
 * ユーザーの週間XPを受け取り、ユーザーを含めたランキングリストを返す
 */
export const generateMockLeaderboardData = (userWeeklyXP: number): SocialUser[] => {
    const data: SocialUser[] = [];
    const NUM_RIVALS = 50;

    // 1. ライバルデータを生成
    for (let i = 0; i < NUM_RIVALS; i++) {
        // ユーザーのXP周辺に分布させる (0.5倍 〜 1.5倍) + トップランカー(2.0倍〜)
        // 基本的にユーザーが中位〜上位に来るように調整

        let xp: number;
        const roll = Math.random();

        if (roll < 0.1) {
            // 超強い人 (ユーザーの2倍〜3倍)
            xp = Math.floor(userWeeklyXP * (2 + Math.random()));
        } else if (roll < 0.3) {
            // 強い人 (ユーザーの1.2倍〜1.5倍)
            xp = Math.floor(userWeeklyXP * (1.2 + Math.random() * 0.3));
        } else if (roll < 0.7) {
            // いい勝負 (ユーザーの0.8倍〜1.2倍)
            xp = Math.floor(userWeeklyXP * (0.8 + Math.random() * 0.4));
        } else {
            // 下位 (ユーザーの0.1倍〜0.8倍)
            xp = Math.floor(userWeeklyXP * (0.1 + Math.random() * 0.7));
        }

        // 最低でも10XP
        xp = Math.max(10, xp);

        // レベルはXPに比例させる（簡易計算）
        const level = Math.floor(Math.sqrt(xp)) + randomInt(1, 5);

        data.push({
            id: `rival_${i}`,
            name: randomItem(MOCK_NAMES),
            avatar: randomItem(MOCK_AVATARS),
            level: level,
            weeklyXP: xp,
            rank: 0, // 後で計算
            isCurrentUser: false,
            changeFromLastWeek: Math.random() > 0.6 ? (Math.random() > 0.5 ? 'up' : 'down') : 'same',
            favoriteCourse: randomItem(MOCK_COURSES_NAMES),
            recentTitle: Math.random() > 0.3 ? randomItem(MOCK_TITLES) : undefined
        });
    }

    // 2. 自分を追加
    const myLevel = Math.floor(Math.sqrt(userWeeklyXP)) + 5; // 少し高めに見せる
    data.push({
        id: 'me',
        name: 'あなた', // 表示時に実際のユーザー名がもしあれば置換できるようにするが、現状は固定
        avatar: '👤', // またはユーザーのアバター
        level: myLevel,
        weeklyXP: userWeeklyXP,
        rank: 0,
        isCurrentUser: true,
        changeFromLastWeek: 'same',
        favoriteCourse: '基本情報', // デフォルト
        recentTitle: '新米冒険者'
    });

    // 3. ソートしてランク付け
    data.sort((a, b) => b.weeklyXP - a.weeklyXP);

    data.forEach((user, index) => {
        user.rank = index + 1;
    });

    return data;
};
