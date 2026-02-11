# IT学習RPGアプリ - プロジェクト概要

このドキュメントは、現在の `android_app` プロジェクトの構成、実装済み機能、およびデータ構造を網羅的に説明したものです。これからの改善案や機能追加の議論に使用してください。

## 1. プロジェクト概要

**コンセプト**: 初学者がRPG感覚でITスキル（プログラミング、資格、英語）を楽しく継続的に学習できるアプリ。
**技術スタック**:
- **フレームワーク**: React Native (Expo)
- **言語**: TypeScript
- **スタイリング**: インラインスタイル (StyleSheet)
- **データ永続化**: AsyncStorage (ローカル保存のみ、バックエンドなし)
- **ナビゲーション**: React Navigation (Stack + Bottom Tabs)

---

## 2. ディレクトリ構成

```
src/
├── components/          # 再利用可能なUIコンポーネント
│   ├── QuestCard.tsx    # クエスト表示カード
│   ├── QuizCard.tsx     # 4択クイズカード
│   ├── SkillBadge.tsx   # スキルアイコンバッジ
│   ├── StatCard.tsx     # ステータス表示カード
│   ├── XPBar.tsx        # 経験値バー
│   └── index.ts        # 一括エクスポート
├── data/                # 静的データ定義
│   ├── courses.ts       # コース定義 (ITパスポート, Web開発など)
│   ├── quests.ts        # クエスト定義 (メイン/サブ)
│   ├── skills.ts        # スキル図鑑データ (JS, React, Gitなど)
│   ├── skillTrees.ts    # スキルツリー構造定義 (ノード配置, 接続)
│   └── topics.ts        # 学習トピック (Phase1遺産)
├── navigation/          # 画面遷移設定
│   └── AppNavigator.tsx # Stack & Tab Navigator定義
├── screens/             # 画面コンポーネント
│   ├── CourseSelectScreen.tsx # コース選択 (6コース)
│   ├── DetailScreen.tsx       # トピック詳細 (Phase1遺産)
│   ├── DiaryScreen.tsx        # 冒険ログ (日記) 入力・一覧
│   ├── HomeScreen.tsx         # ホーム (クエスト, 進捗, ステータス)
│   ├── SkillDetailScreen.tsx  # スキル詳細 (解説, クイズ, 熟練度)
│   ├── SkillListScreen.tsx    # スキル図鑑一覧
│   ├── SkillTreeScreen.tsx    # スキルツリー表示
│   ├── SplashScreen.tsx       # 起動画面
│   └── WeaknessListScreen.tsx # 弱点リスト (克服機能付き)
├── theme/               # デザイン定数
│   └── index.ts         # colors, spacing, fonts
├── storage.ts           # データ永続化ロジック (AsyncStorageラッパー)
└── types.ts             # 型定義 (UserProgress, Course, Skill, Logなど)
```

---

## 3. 実装済み機能 (Phase 1-5)

現在、以下の機能が実装されています。

### Phase 1: 基礎ゲームサイクル
- **ホーム画面**: 現在のレベル、XP、連続学習日数を表示。
- **クエストボード**:
  - **メインクエスト**: 1日1回更新される主要課題 (25分学習など)。
  - **サブクエスト**: 小さな課題 (用語暗記など)。
  - **完了処理**: チェックするとXPを獲得し、レベルアップする。

### Phase 2: コース学習システム
- **コース選択**: 6つのコースから選択可能。
  - 📋 **ITパスポート** (国家資格)
  - ⌨️ **基本情報技術者**
  - 応用情報技術者
  - 🎧 **TOEIC** (英語)
  - 🌐 **Web開発入門**
  - 👨‍💻 **プログラミング基礎**
- **コース切り替え**: いつでもコースを変更可能。進捗はコースごとに管理されるわけではなく、ユーザー全体のXPとして蓄積。

### Phase 3: スキル図鑑 & ミニクイズ
- **スキルデータ**: 6つのコアスキル (JS, TS, React, Node.js, API, Git)。
- **詳細画面**:
  - **これだけ覚えろ3点**: 要点を3つに絞って解説。
  - **よくある勘違い**: 初学者が陥りやすいミスを解説。
  - **ミニクイズ**: 4択クイズ。正解するとXP獲得 & スキル熟練度アップ。
- **熟練度**: 各スキルに `0-100%` の熟練度があり、クイズ正解や閲覧で上昇。

### Phase 4: 冒険ログ (学習日記)
- **日記入力**:
  - 今日の一言
  - コース選択 (タグ付け)
  - できた度 (5段階: 😢〜🔥)
  - 自由メモ
- **ログ一覧**: フィルタ機能付きで過去のログをカード表示。
- **弱点リスト**: ログから「弱点」を登録し、別画面で一覧管理。「克服」ボタンで完了状態にできる。

### Phase 5: スキルツリー
- **可視化**: コースごとにスキルの習得順序をツリー形式で表示。
- **ノード状態**:
  - 🔒 **Locked**: 前提スキル未習得。選択不可。
  - 🔓 **Available**: 前提習得済み。学習開始可能。
  - 📖 **Learning**: 学習中 (熟練度 > 0)。
  - ✅ **Mastered**: 習得済み (熟練度 >= 閾値)。
- **連動**: ノードをタップするとスキル詳細画面へ遷移。

---

## 4. データ構造 (Type Definitions)

主要なデータ型 (`src/types.ts`) の概要です。

### ユーザー進捗 (`UserProgress`)
```typescript
interface UserProgress {
    selectedCourseId: CourseId | null; // 現在選択中のコース
    totalXP: number;                   // 総獲得XP
    level: number;                     // プレイヤーレベル
    streakDays: number;                // 連続学習日数
    lastActiveDate: string;            // 最終ログイン日
    todayCompletedQuestIds: string[];  // 本日完了したクエスト
    questLogs: QuestLog[];             // 過去のクエスト履歴
}
```

### コース (`Course`)
```typescript
interface Course {
    id: CourseId;
    name: string;
    icon: string;
    description: string;
    color: string;           // テーマカラー
    difficulty: 1-5;         // 難易度
    estimatedHours: number;  // 想定学習時間
}
```

### スキル (`Skill`) & 熟練度 (`SkillMastery`)
```typescript
interface Skill {
    id: SkillId;
    category: 'language' | 'framework' | 'concept' | 'tool';
    keyPoints: string[];     // 要点3つ
    misconceptions: string[];// 勘違いリスト
    quiz: SkillQuiz;         // 4択クイズ
}

interface SkillMastery {
    skillId: SkillId;
    masteryLevel: number;    // 0-100%
    quizCorrectCount: number;// 正解回数
}
```

### 冒険ログ (`AdventureLog`)
```typescript
interface AdventureLog {
    id: string;
    date: string;
    hitokoto: string;        // 一言コメント
    courseId: CourseId;      // 関連コース
    tags: string[];          // タグ
    satisfaction: 1-5;       // できた度
    memo: string;            // 詳細メモ
}
```

---

## 5. UI/UX の特徴

- **ゲーミフィケーション**: XP、レベルアップ、プログレスバー、バッジ、「クエスト」「冒険」といった用語を使用。
- **カード型UI**: 情報はカード形式で整理され、影 (`shadows`) と角丸 (`borderRadius`) でモダンな印象。
- **インタラクション**:
  - タップ時の `activeOpacity`
  - クイズ正解時のフィードバック
  - スキルツリーの視覚的ステータス変化

---

## 7. 相談したいこと (例)

1. **ホーム画面の情報整理**: 機能が増えてホーム画面がごちゃごちゃしてきたかも？
2. **スキルツリーのデザイン**: ScrollViewでの簡易実装だが、もっとRPGっぽい見た目にできないか？
3. **データ永続化**: 現在 `AsyncStorage` だが、データ量が増えると重くなる？
4. **新機能**: 次に追加すべき「RPGらしさ」を強める機能は？ (例: 装備品、アバター、パーティ編成?)
