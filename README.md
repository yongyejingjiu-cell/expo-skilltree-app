# 🎮 IT学習RPG - android_app

このプロジェクトは、ITスキルの学習をRPG感覚で楽しめる、Expoを使用したReact Native（TypeScript）アプリです。
初心者でもITパスポート、基本情報技術者、Web開発などのスキルを「冒険」として楽しく継続できるように設計されています。

---

## ✨ 主な機能

### 🛡️ 冒険の基本 (Phase 1-2)
*   **ホーム画面**: 自身のレベル、XP（経験値）、連続学習日数を一目で確認。
*   **クエストボード**: 毎日更新される「メインクエスト」と手軽な「サブクエスト」をクリアしてXPを獲得。
*   **コース選択**: ITパスポート、基本情報、Web開発など全6コースから選択可能。

### 📚 スキル図鑑 & クイズ (Phase 3)
*   **スキルカード**: 各技術（JS, TS, Reactなど）の要点や「よくある勘違い」をコンパクトに解説。
*   **ミニクイズ**: 4択クイズに挑戦してスキルの「熟練度」をアップ。

### 📝 冒険ログ & 弱点克服 (Phase 4)
*   **冒険ログ（日記）**: その日の学習内容や「できた度」を記録。
*   **弱点管理**: ログから登録した「弱点」を一覧化し、克服ボタンでマスター。

### 🗺️ インタラクティブ・スキルツリー (Phase 5+)
*   **ツリー視覚化**: 学習の道のりをツリー形式で表示。進捗に合わせてノードが解放されます。
*   **ズーム＆パン**: `react-native-reanimated` と `react-native-gesture-handler` による滑らかな操作。

### 🎨 カスタマイズ & ソーシャル (最新)
*   **アバターシステム**: 自分好みにカスタマイズ可能なアバター（`MyAvatar`）。
*   **動的テーマ**: 時間帯や気分に合わせて切り替わるテーマ（Day, Night, Magic）。
*   **リーダーボード**: ライバルたちと進捗を競い、特別な称号を獲得。

---

## 🛠️ 技術スタック

*   **Framework**: Expo (SDK 52), React Native
*   **Language**: TypeScript
*   **Navigation**: React Navigation (Stack + Bottom Tabs)
*   **Animation**: Reanimated, Lottie
*   **Icons/Graphics**: React Native SVG, Expo Asset
*   **Storage**: AsyncStorage (Local)
*   **Feedback**: Expo Haptics

---

## 📂 ディレクトリ構成

```text
src/
├── components/    # 共通UI（カード、バー、バッジ、アバター等）
├── context/       # 状態管理（ThemeContext, UserProgress等）
├── data/          # 静的データ（クエスト、スキル、ツリー定義）
├── navigation/    # 画面遷移（AppNavigator）
├── screens/       # 各画面コンポーネント（Home, SkillTree, Avatar等）
├── theme/         # デザイントークン（colors, spacing, shadows）
├── storage.ts     # AsyncStorageラッパー
└── types.ts       # TypeScript型定義
```

---

## 🚀 セットアップ方法 (Getting Started)

### 1. 依存関係のインストール

ターミナルで以下のコマンドを実行します：

```bash
npm install
```

### 2. 開発サーバーの起動

```bash
npm start
```

### 3. 実機で確認

1.  スマートフォンに **Expo Go** アプリをインストールします。
    *   **重要**: このプロジェクトは **Expo SDK 52** を使用しています。Expo GoのSDK versionは52である必要があります。
    

2.  表示されたQRコードを読み取ります。
    -   **Android**: Expo Go内の「Scan QR Code」
    -   **iPhone**: 標準カメラアプリ
3.  ※PCとスマホが同じWi-Fiに接続されている必要があります。接続できない場合は `npx expo start --tunnel` を試してください。

---

## 💡 開発のヒント

*   **TypeScript**: すべてのコードはTypeScriptで型安全に記述されています。
*   **デザインシステム**: `src/theme/index.ts` で定義された `colors` や `shadows` を使用することで、一貫したRPG風のUIを保てます。
*   **ホットリロード**: コードを変更して保存すると、実機の画面が瞬時に更新されます。

**ハッピー・コーディング & ハッピー・ラーニング！** ⚔️💻
