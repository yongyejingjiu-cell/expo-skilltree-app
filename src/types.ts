export interface Topic {
    id: string;
    title: string;
    icon: string;
    description: string;
    content: string;
}

export interface AvatarParts {
    body: string;
    hair: string;
    clothing: string;
    accessory: string;
}

// ========================================
// Phase1: クエストシステム型定義
// ========================================

/**
 * 学習トラック（資格/目標別）- Phase1からの互換性維持
 */
export type TrackId = 'basic_it' | 'applied_it' | 'toeic' | 'free';

export interface Track {
    id: TrackId;
    name: string;
    icon: string;
    description: string;
    color: string;
}

// ========================================
// Phase2: コースシステム型定義
// ========================================

/**
 * コースカテゴリ（大分類）
 */
export type CourseCategoryId = 'it_cert' | 'english' | 'it_general';

export interface CourseCategory {
    id: CourseCategoryId;
    name: string;
    icon: string;
    description: string;
    color: string;
}

/**
 * コースID
 */
export type CourseId =
    | 'it_passport'      // ITパスポート
    | 'basic_it'         // 基本情報技術者
    | 'applied_it'       // 応用情報技術者
    | 'toeic'            // TOEIC
    | 'web_dev'          // Web開発入門
    | 'programming';     // プログラミング基礎

/**
 * コース定義
 */
export interface Course {
    id: CourseId;
    categoryId: CourseCategoryId;
    name: string;
    shortName: string;
    icon: string;
    description: string;
    color: string;
    difficulty: 1 | 2 | 3 | 4 | 5;  // 難易度（星の数）
    estimatedHours: number;         // 想定学習時間
    badge?: string;                 // バッジ（"NEW", "人気" など）
}

/**
 * クエストの種類
 */
export type QuestType = 'main' | 'sub';

/**
 * クエストの状態
 */
export type QuestStatus = 'available' | 'in_progress' | 'completed';

/**
 * クエスト定義
 */
export interface Quest {
    id: string;
    type: QuestType;
    title: string;
    description: string;
    icon: string;
    xpReward: number;
    targetMinutes?: number;      // 学習時間目標（分）
    targetCount?: number;        // 回数目標
    currentProgress?: number;    // 現在の進捗
}

/**
 * クエスト完了ログ
 */
export interface QuestLog {
    questId: string;
    completedAt: string;         // ISO日付文字列
    xpEarned: number;
}

/**
 * ユーザーの進行状況（AsyncStorageに保存）
 */
export interface UserProgress {
    selectedTrackId: TrackId;           // Phase1互換
    selectedCourseId: CourseId | null;  // Phase2: 選択中のコース
    totalXP: number;
    level: number;
    streakDays: number;                 // 連続学習日数
    lastActiveDate: string;             // 最終アクティブ日（YYYY-MM-DD）
    todayCompletedQuestIds: string[];   // 今日完了したクエストID
    questLogs: QuestLog[];              // 達成ログ履歴
    currentAvatar: AvatarParts;         // アバター装備
    unlockedAvatarItems: string[];      // 解放済みアイテムIDリスト
    title?: string;                     // Phase6: 獲得した称号
}

/**
 * 今日のクエストボード
 */
export interface DailyQuestBoard {
    date: string;                // YYYY-MM-DD
    mainQuest: Quest;
    subQuests: Quest[];
}

// ========================================
// Phase3: スキル図鑑型定義
// ========================================

/**
 * スキルID
 */
export type SkillId = string;

/**
 * スキルカテゴリ
 */
export type SkillCategory = 'language' | 'framework' | 'concept' | 'tool';

/**
 * クイズの選択肢
 */
export interface QuizChoice {
    label: string;
    isCorrect: boolean;
}

/**
 * ミニクイズ定義
 */
export interface SkillQuiz {
    question: string;
    choices: QuizChoice[];
    explanation: string;      // 正解/不正解時の解説
    xpReward: number;         // クイズ正解時のXP
}

/**
 * スキル定義
 */
export interface Skill {
    id: SkillId;
    name: string;
    icon: string;
    category: SkillCategory;
    description: string;           // スキル概要
    prerequisiteIds?: SkillId[];   // 習得条件（前提スキルのID）
    keyPoints: string[];           // これだけ覚えろ3点（配列）
    misconceptions: string[];     // よくある勘違い（配列）
    quiz: SkillQuiz;              // ミニクイズ1問
    detailContent: string;        // 詳細解説（長文テキスト）
    difficulty: 1 | 2 | 3;        // 難易度 ★
    color: string;                // テーマカラー
}

/**
 * スキル熟練度（ユーザーごとに保存）
 */
export interface SkillMastery {
    skillId: SkillId;
    masteryLevel: number;         // 0-100 の熟練度
    quizCorrectCount: number;     // クイズ正解回数
    lastStudiedAt: string;        // 最終学習日（ISO文字列）
}

/**
 * スキル熟練度マップ（AsyncStorageに保存）
 */
export type SkillMasteryMap = Record<SkillId, SkillMastery>;

// ========================================
// Phase4: 冒険ログ(学習日記)型定義
// ========================================

/**
 * できた度 (1-5段階)
 */
export type SatisfactionLevel = 1 | 2 | 3 | 4 | 5;

/**
 * 冒険ログ（学習日記エントリ）
 */
export interface AdventureLog {
    id: string;                         // ユニークID (Date.now())
    createdAt: string;                  // 作成日時（ISO文字列）
    date: string;                       // 表示用日付
    hitokoto: string;                   // 今日の一言
    courseId: CourseId | null;           // 紐づくコース（null=フリー）
    tags: string[];                     // タグ（任意、自由入力）
    satisfaction: SatisfactionLevel;    // できた度 (1-5)
    memo: string;                       // メモ（長文OK）
}

/**
 * 弱点エントリ
 */
export interface WeaknessEntry {
    id: string;
    title: string;                      // 弱点タイトル
    description: string;                // 弱点詳細
    courseId: CourseId | null;           // 関連コース
    tags: string[];                     // 関連タグ
    sourceLogId: string;                // 元になった冒険ログのID
    createdAt: string;                  // 登録日（ISO文字列）
    resolved: boolean;                  // 克服済みか
}

// ========================================
// Phase5: スキルツリー型定義
// ========================================

/**
 * スキルツリーのノード状態
 */
export type SkillNodeStatus = 'locked' | 'available' | 'learning' | 'mastered';

/**
 * スキルツリーのノード定義
 */
export interface SkillTreeNode {
    skillId: SkillId;                    // 紐づくスキルID
    x: number;                          // ツリー上のX位置 (0-100%)
    y: number;                          // ツリー上のY位置 (px)
    masteryThreshold: number;            // 習得済みになる熟練度しきい値(0-100)
}

/**
 * スキルツリーのエッジ（接続線）
 */
export interface SkillTreeEdge {
    from: SkillId;
    to: SkillId;
}

/**
 * コースごとのスキルツリー定義
 */
export interface SkillTreeDefinition {
    courseId: CourseId;
    title: string;
    description: string;
    nodes: SkillTreeNode[];
    edges: SkillTreeEdge[];
}

// ========================================
// Phase6: ソーシャル・リーダーボード型定義
// ========================================

/**
 * リーダーボード上のユーザー情報
 */
export interface SocialUser {
    id: string;
    name: string;
    avatar: string; // アバターアイコン（絵文字など）
    level: number;
    weeklyXP: number;
    rank: number;
    isCurrentUser?: boolean; // 自分かどうか
    changeFromLastWeek?: 'up' | 'down' | 'same'; // 先週比（演出用）
    favoriteCourse?: string; // Phase6: 推しコース
    recentTitle?: string;    // Phase6: 最近獲得した称号
}

// ========================================
// Navigation 型定義
// ========================================

// BottomTab Navigator用の型定義
export type MainTabParamList = {
    HomeTab: undefined;
    QuestsTab: undefined;
    LeaderboardTab: undefined; // Phase6: リーダーボード
    DiaryTab: undefined;
    ProfileTab: undefined;
};

// Stack Navigator用の型定義
export type RootStackParamList = {
    MainTabs: undefined;          // BottomTabを含むメイン画面
    Home: undefined;
    Detail: { topic: Topic };
    Diary: undefined;
    CourseSelect: undefined;      // Phase2: コース選択画面
    SkillDetail: { skillId: SkillId };  // Phase3: スキル詳細画面
    SkillList: undefined;         // Phase3: スキル図鑑一覧
    WeaknessList: undefined;      // Phase4: 弱点リスト
    SkillTree: { courseId: CourseId };  // Phase5: スキルツリー
    AvatarEdit: undefined;              // Phase6: アバター編集
};

