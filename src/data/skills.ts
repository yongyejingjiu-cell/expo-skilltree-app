/**
 * skills.ts
 * スキル図鑑データ（コース別静的定義）
 * Record<CourseId, Skill[]> 構造でコースごとにスキルを管理
 */

import { Skill, SkillId, CourseId } from '../types';
import { TOEIC_SKILLS, BASIC_IT_SKILLS, APPLIED_IT_SKILLS, IT_PASSPORT_SKILLS } from './skillsData';

// ========================================
// 既存Web開発系スキル（web_dev / programming 共用）
// ========================================

const WEB_DEV_SKILLS: Skill[] = [
    // ===== Language =====
    {
        id: 'javascript',
        name: 'JavaScript',
        icon: '🟨',
        category: 'language',
        description: 'Webの世界を動かすプログラミング言語。ブラウザで動く唯一の言語であり、フロントエンド開発の基礎。',
        difficulty: 1,
        color: '#F7DF1E',
        keyPoints: [
            '変数の宣言は let と const を使う（var は古い書き方）',
            '関数はアロー関数 (=>) で短く書ける',
            '非同期処理は async/await で「待つ」ことができる',
        ],
        misconceptions: [
            '❌「JavaとJavaScriptは同じ言語」→ 全く別物。コーヒーとコーヒーゼリーくらい違う。',
            '❌「==と===は同じ」→ === は型も比較する厳密な等価演算子。常に === を使おう。',
            '❌「let と const はどちらでもいい」→ 変更しないなら const、変更するなら let。',
        ],
        quiz: {
            question: '次のうち、JavaScriptの厳密等価演算子はどれ？',
            choices: [
                { label: '==', isCorrect: false },
                { label: '===', isCorrect: true },
                { label: '!=', isCorrect: false },
                { label: '=>', isCorrect: false },
            ],
            explanation: '=== は「厳密等価演算子」で、値だけでなく型も比較します。常に === を使う習慣をつけましょう！',
            xpReward: 30,
        },
        detailContent: `JavaScriptは1995年に作られた言語です。今やフロントエンド、バックエンド、モバイルアプリまで作れる万能言語です。

【基本構文】
・変数: const name = "太郎";
・関数: const greet = (name) => \`こんにちは、\${name}\`;
・条件分岐: if / else / switch
・繰り返し: for / while / forEach / map`,
    },
    {
        id: 'typescript',
        name: 'TypeScript',
        icon: '🔷',
        category: 'language',
        description: 'JavaScriptに「型」を追加した言語。大規模開発でのバグを事前に防ぐ。',
        prerequisiteIds: ['javascript'],
        difficulty: 2,
        color: '#3178C6',
        keyPoints: [
            '変数に型を付けると、間違った使い方をコンパイル時に検出できる',
            'interface で「データの形」を定義して、チーム開発をスムーズに',
            '.ts/.tsx ファイルは、コンパイルすると普通のJavaScriptになる',
        ],
        misconceptions: [
            '❌「TypeScriptは新しい言語」→ JavaScriptの上位互換。JSのコードはそのままTSで動く。',
            '❌「型を付けるのは面倒なだけ」→ バグの早期発見、エディタの補完強化で開発効率UP。',
            '❌「anyを使えば楽」→ any は型チェックを無効にする「諦め」。なるべく具体的な型を使おう。',
        ],
        quiz: {
            question: 'TypeScriptのファイル拡張子として正しいのはどれ？',
            choices: [
                { label: '.java', isCorrect: false },
                { label: '.ts', isCorrect: true },
                { label: '.py', isCorrect: false },
                { label: '.rb', isCorrect: false },
            ],
            explanation: 'TypeScriptのファイル拡張子は .ts（通常）と .tsx（JSXを含むReactコンポーネント）です。',
            xpReward: 30,
        },
        detailContent: `TypeScriptはMicrosoftが2012年に開発した言語です。

【型の例】
・基本型: string, number, boolean
・配列型: string[], number[]
・オブジェクト型: interface Person { name: string; age: number; }`,
    },
    // ===== Framework =====
    {
        id: 'react',
        name: 'React',
        icon: '⚛️',
        category: 'framework',
        description: 'Facebookが開発したUI構築ライブラリ。コンポーネント指向で再利用しやすい。',
        prerequisiteIds: ['javascript'],
        difficulty: 2,
        color: '#61DAFB',
        keyPoints: [
            'UIを「コンポーネント」という再利用可能な部品に分割する',
            'state（状態）が変わると、画面が自動的に再描画される',
            'JSX で HTMLのようにUI を記述でき、直感的に書ける',
        ],
        misconceptions: [
            '❌「Reactはフレームワーク」→ 正確にはUI「ライブラリ」。',
            '❌「クラスコンポーネントで書くべき」→ 現在は関数コンポーネント + Hooks が主流。',
            '❌「stateを直接書き換えてOK」→ 必ず setState 等で更新。',
        ],
        quiz: {
            question: 'Reactでstateを更新するとき、正しいのはどれ？',
            choices: [
                { label: 'state.count = 1 と直接代入する', isCorrect: false },
                { label: 'setState や setCount で更新する', isCorrect: true },
                { label: 'document.getElementById で変更する', isCorrect: false },
                { label: 'グローバル変数に保存する', isCorrect: false },
            ],
            explanation: 'Reactでは state の更新は必ずセッター関数を使います。',
            xpReward: 35,
        },
        detailContent: `React（リアクト）はFacebook（現Meta）が2013年にオープンソース化したUIライブラリです。このアプリもReactベースです！`,
    },
    {
        id: 'nodejs',
        name: 'Node.js',
        icon: '🟢',
        category: 'framework',
        description: 'サーバーサイドで動くJavaScript環境。Web APIやツール開発に広く使われる。',
        prerequisiteIds: ['javascript'],
        difficulty: 2,
        color: '#339933',
        keyPoints: [
            'JavaScriptをブラウザの外（サーバー側）で動かせる実行環境',
            'npm（パッケージマネージャ）で世界中のライブラリを簡単に使える',
            'ノンブロッキングI/Oで大量の同時アクセスを効率よく捌ける',
        ],
        misconceptions: [
            '❌「Node.jsはプログラミング言語」→ 言語ではなく「実行環境」。言語は JavaScript。',
            '❌「フロントエンド開発には不要」→ 開発ツールの基盤として必須。',
            '❌「Node.jsは遅い」→ I/O処理は非常に速い。',
        ],
        quiz: {
            question: 'Node.jsの説明として正しいのはどれ？',
            choices: [
                { label: 'Javaの実行環境', isCorrect: false },
                { label: 'ブラウザ上のみで動くツール', isCorrect: false },
                { label: 'サーバーサイドのJavaScript実行環境', isCorrect: true },
                { label: 'CSSフレームワーク', isCorrect: false },
            ],
            explanation: 'Node.jsはV8エンジンでサーバーサイドでJavaScriptを実行できる環境です。',
            xpReward: 30,
        },
        detailContent: `Node.js（ノード・ジェイエス）は2009年に開発されたJavaScript実行環境です。このアプリの開発環境もNode.jsで動いています！`,
    },
    // ===== Concept =====
    {
        id: 'api',
        name: 'API',
        icon: '🔌',
        category: 'concept',
        description: 'アプリケーション同士をつなぐ「窓口」。データの受け渡しの標準的な方法。',
        difficulty: 1,
        color: '#E17055',
        keyPoints: [
            'APIは「ソフトウェア同士の会話ルール」',
            'REST APIはHTTPメソッド（GET/POST/PUT/DELETE）でデータを操作する',
            'JSON形式でデータをやり取りするのが現代の主流',
        ],
        misconceptions: [
            '❌「APIはWebだけのもの」→ OS API、ライブラリAPIなど、接点はすべてAPI。',
            '❌「APIを使う＝プログラミング上級者」→ 初心者でも使えるものが多い。',
            '❌「APIは全て無料」→ 商用APIは利用回数に応じて課金されることが多い。',
        ],
        quiz: {
            question: 'REST APIでデータを取得するHTTPメソッドはどれ？',
            choices: [
                { label: 'POST', isCorrect: false },
                { label: 'DELETE', isCorrect: false },
                { label: 'PUT', isCorrect: false },
                { label: 'GET', isCorrect: true },
            ],
            explanation: 'GETはデータを「取得」するためのHTTPメソッドです。',
            xpReward: 25,
        },
        detailContent: `API（Application Programming Interface）は、ソフトウェア同士が機能やデータを共有するための仕組みです。

【REST APIの基本】
GET /users → ユーザー一覧を取得
POST /users → 新しいユーザーを作成
PUT /users/1 → ID=1のユーザーを更新
DELETE /users/1 → ID=1のユーザーを削除`,
    },
    {
        id: 'git',
        name: 'Git',
        icon: '🌿',
        category: 'tool',
        description: 'ソースコードのバージョン管理ツール。変更履歴を記録し、チーム開発を可能にする。',
        difficulty: 1,
        color: '#F05032',
        keyPoints: [
            'git commit でコードの「スナップショット」を記録',
            'git branch で「平行世界」を作り、安全に新機能を開発できる',
            'GitHubはGitのリモートリポジトリサービス',
        ],
        misconceptions: [
            '❌「GitとGitHubは同じもの」→ Gitはツール、GitHubはWebサービス。',
            '❌「commitするとみんなに見える」→ pushして初めてリモートに反映される。',
            '❌「間違えたら取り返しがつかない」→ git resetなどで元に戻せる。',
        ],
        quiz: {
            question: 'Gitでローカルの変更をリモートリポジトリに反映するコマンドは？',
            choices: [
                { label: 'git commit', isCorrect: false },
                { label: 'git pull', isCorrect: false },
                { label: 'git push', isCorrect: true },
                { label: 'git merge', isCorrect: false },
            ],
            explanation: 'git pushはローカルのcommit履歴をリモートリポジトリに送信するコマンドです。',
            xpReward: 25,
        },
        detailContent: `Git（ギット）はリーナス・トーバルズが2005年に開発したバージョン管理システムです。

【基本コマンド】
git init → リポジトリを初期化
git add . → 変更をステージング
git commit -m "メッセージ" → 変更を記録
git push → リモートに送信
git pull → リモートから取得`,
    },
];

// ========================================
// コース別スキルマップ
// ========================================

export const SKILLS_BY_COURSE: Record<CourseId, Skill[]> = {
    web_dev: WEB_DEV_SKILLS,
    programming: WEB_DEV_SKILLS, // programming も同じWeb系スキルを共有
    it_passport: IT_PASSPORT_SKILLS,
    basic_it: BASIC_IT_SKILLS,
    applied_it: APPLIED_IT_SKILLS,
    toeic: TOEIC_SKILLS,
};

/**
 * 後方互換: 全スキルのフラット配列（レガシー用）
 */
export const SKILLS: Skill[] = WEB_DEV_SKILLS;

// ========================================
// ヘルパー関数
// ========================================

/**
 * コースIDに対応するスキル一覧を取得
 */
export const getSkillsByCourse = (courseId: CourseId): Skill[] => {
    return SKILLS_BY_COURSE[courseId] ?? WEB_DEV_SKILLS;
};

/**
 * スキルIDからスキルを取得（全コースから検索）
 */
export const getSkillById = (skillId: SkillId): Skill | undefined => {
    for (const skills of Object.values(SKILLS_BY_COURSE)) {
        const found = skills.find(s => s.id === skillId);
        if (found) return found;
    }
    return undefined;
};

/**
 * コース内でカテゴリでスキルを絞り込み
 */
export const getSkillsByCategory = (category: Skill['category'], courseId?: CourseId): Skill[] => {
    const skills = courseId ? getSkillsByCourse(courseId) : WEB_DEV_SKILLS;
    return skills.filter(s => s.category === category);
};

/**
 * コース内の全スキルのID一覧
 */
export const getAllSkillIds = (courseId?: CourseId): SkillId[] => {
    const skills = courseId ? getSkillsByCourse(courseId) : WEB_DEV_SKILLS;
    return skills.map(s => s.id);
};
