/**
 * skillTrees.ts
 * コースごとのスキルツリー定義データ (Phase5)
 *
 * 各コースに対して、どのスキルをどの順番で学ぶかを定義。
 * ノードの位置(x, y)はツリー表示用の相対座標。
 * x: 0-100 のパーセント（横位置）
 * y: 上からのピクセル位置（縦位置）
 */

import { SkillTreeDefinition, CourseId } from '../types';

// ========================================
// スキルツリー定義
// ========================================

/**
 * Web開発入門コースのスキルツリー
 * JavaScript → TypeScript, React, Node.js (並列) → API → Git
 */
const WEB_DEV_TREE: SkillTreeDefinition = {
    courseId: 'web_dev',
    title: 'Web開発スキルツリー',
    description: 'フロントエンドからバックエンドまでの全体像',
    nodes: [
        { skillId: 'javascript', x: 50, y: 0, masteryThreshold: 60 },
        { skillId: 'typescript', x: 20, y: 160, masteryThreshold: 60 },
        { skillId: 'react', x: 50, y: 160, masteryThreshold: 60 },
        { skillId: 'nodejs', x: 80, y: 160, masteryThreshold: 60 },
        { skillId: 'api', x: 65, y: 320, masteryThreshold: 50 },
        { skillId: 'git', x: 35, y: 320, masteryThreshold: 50 },
    ],
    edges: [
        { from: 'javascript', to: 'typescript' },
        { from: 'javascript', to: 'react' },
        { from: 'javascript', to: 'nodejs' },
        { from: 'nodejs', to: 'api' },
        { from: 'typescript', to: 'git' },
    ],
};

/**
 * プログラミング基礎コースのスキルツリー
 */
const PROGRAMMING_TREE: SkillTreeDefinition = {
    courseId: 'programming',
    title: 'プログラミング基礎ツリー',
    description: '論理的思考からコーディングの基本まで',
    nodes: [
        { skillId: 'javascript', x: 50, y: 0, masteryThreshold: 50 },
        { skillId: 'git', x: 25, y: 160, masteryThreshold: 40 },
        { skillId: 'typescript', x: 50, y: 160, masteryThreshold: 60 },
        { skillId: 'api', x: 75, y: 160, masteryThreshold: 40 },
        { skillId: 'react', x: 50, y: 320, masteryThreshold: 70 },
    ],
    edges: [
        { from: 'javascript', to: 'git' },
        { from: 'javascript', to: 'typescript' },
        { from: 'javascript', to: 'api' },
        { from: 'typescript', to: 'react' },
    ],
};

/**
 * ITパスポートコースのスキルツリー
 * ストラテジ → マネジメント → テクノロジ → セキュリティ
 */
const IT_PASSPORT_TREE: SkillTreeDefinition = {
    courseId: 'it_passport',
    title: 'ITパスポートスキルツリー',
    description: 'IT基礎知識の3分野を段階的に学ぶ',
    nodes: [
        { skillId: 'ip_strategy', x: 30, y: 0, masteryThreshold: 40 },
        { skillId: 'ip_management', x: 70, y: 0, masteryThreshold: 40 },
        { skillId: 'ip_technology', x: 50, y: 160, masteryThreshold: 50 },
        { skillId: 'ip_security_basic', x: 50, y: 320, masteryThreshold: 40 },
    ],
    edges: [
        { from: 'ip_strategy', to: 'ip_technology' },
        { from: 'ip_management', to: 'ip_technology' },
        { from: 'ip_technology', to: 'ip_security_basic' },
    ],
};

/**
 * 基本情報技術者コースのスキルツリー
 * アルゴリズム → ネットワーク, データベース → セキュリティ → マネジメント
 */
const BASIC_IT_TREE: SkillTreeDefinition = {
    courseId: 'basic_it',
    title: '基本情報スキルツリー',
    description: 'プログラミングとIT技術の基礎',
    nodes: [
        { skillId: 'fe_algorithm', x: 50, y: 0, masteryThreshold: 50 },
        { skillId: 'fe_network', x: 30, y: 160, masteryThreshold: 50 },
        { skillId: 'fe_database', x: 70, y: 160, masteryThreshold: 50 },
        { skillId: 'fe_security', x: 30, y: 320, masteryThreshold: 40 },
        { skillId: 'fe_management', x: 70, y: 320, masteryThreshold: 40 },
    ],
    edges: [
        { from: 'fe_algorithm', to: 'fe_network' },
        { from: 'fe_algorithm', to: 'fe_database' },
        { from: 'fe_network', to: 'fe_security' },
        { from: 'fe_database', to: 'fe_management' },
    ],
};

/**
 * 応用情報技術者コースのスキルツリー
 * システムアーキテクチャ, セキュリティ → DB応用, PM
 */
const APPLIED_IT_TREE: SkillTreeDefinition = {
    courseId: 'applied_it',
    title: '応用情報スキルツリー',
    description: '高度なIT知識と実践スキル',
    nodes: [
        { skillId: 'ap_system_arch', x: 35, y: 0, masteryThreshold: 60 },
        { skillId: 'ap_security_adv', x: 65, y: 0, masteryThreshold: 60 },
        { skillId: 'ap_db_advanced', x: 35, y: 160, masteryThreshold: 60 },
        { skillId: 'ap_pm', x: 65, y: 160, masteryThreshold: 50 },
    ],
    edges: [
        { from: 'ap_system_arch', to: 'ap_db_advanced' },
        { from: 'ap_system_arch', to: 'ap_pm' },
        { from: 'ap_security_adv', to: 'ap_db_advanced' },
    ],
};

/**
 * TOEICコースのスキルツリー
 * Part1-2 → Part3-4 → Part5文法 → Part6 → Part7
 *                        語彙/時間管理（独立）
 */
const TOEIC_TREE: SkillTreeDefinition = {
    courseId: 'toeic',
    title: 'TOEICスキルツリー',
    description: 'TOEIC L&Rの全パートを段階的に攻略',
    nodes: [
        { skillId: 'toeic_part12', x: 30, y: 0, masteryThreshold: 40 },
        { skillId: 'toeic_vocab_time', x: 70, y: 0, masteryThreshold: 30 },
        { skillId: 'toeic_part34', x: 30, y: 160, masteryThreshold: 50 },
        { skillId: 'toeic_part5_grammar', x: 70, y: 160, masteryThreshold: 40 },
        { skillId: 'toeic_part6', x: 50, y: 320, masteryThreshold: 50 },
        { skillId: 'toeic_part7', x: 50, y: 480, masteryThreshold: 60 },
    ],
    edges: [
        { from: 'toeic_part12', to: 'toeic_part34' },
        { from: 'toeic_part5_grammar', to: 'toeic_part6' },
        { from: 'toeic_part6', to: 'toeic_part7' },
    ],
};

// ========================================
// 全ツリーマップ & ヘルパー関数
// ========================================

export const SKILL_TREES: Record<string, SkillTreeDefinition> = {
    web_dev: WEB_DEV_TREE,
    programming: PROGRAMMING_TREE,
    it_passport: IT_PASSPORT_TREE,
    basic_it: BASIC_IT_TREE,
    applied_it: APPLIED_IT_TREE,
    toeic: TOEIC_TREE,
};

/**
 * コースIDからスキルツリーを取得
 */
export const getSkillTree = (courseId: CourseId): SkillTreeDefinition | undefined => {
    return SKILL_TREES[courseId];
};

/**
 * 全コースのスキルツリー一覧を取得
 */
export const getAllSkillTrees = (): SkillTreeDefinition[] => {
    return Object.values(SKILL_TREES);
};
