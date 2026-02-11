# TypeScript 移行ガイド (初心者向け)

このプロジェクトは、JavaScript (JS) から TypeScript (TS) へ移行しました。
このドキュメントでは、今回の変更内容と、これから開発する際のポイントを解説します。

## 1. 何が変わったの？

### 拡張子の変更
- コンポーネントファイル: `.js` → `.tsx` (例: `App.tsx`, `HomeScreen.tsx`)
- ロジック・データファイル: `.js` → `.ts` (例: `topics.ts`, `types.ts`)

### 型定義 (Types) の導入
JavaScript では変数がどんなデータを持っているか曖昧でしたが、TypeScript では「型」を付けることで、コードが明確になります。

**例:**
```typescript
// JavaScript
const name = "太郎";

// TypeScript
const name: string = "太郎"; // "string" という型が付いた！
```

## 2. 変更したファイル一覧

1. **`package.json`**
   - `typescript` や `@types/react` などの開発ツールを追加しました。

2. **`tsconfig.json`**
   - TypeScript の設定ファイルです。Expo が推奨する設定を使っています。

3. **`src/types.ts`** (新規作成)
   - アプリ全体で使う「型」をまとめています。
   - `Topic` (学習トピックの型) や `RootStackParamList` (画面遷移のパラメータ) を定義しています。

4. **`src/data/topics.ts`**
   - `topics.js` を `topics.ts` に変更し、`Topic` 型を適用しました。
   - 新しいトピック「TS移行について」を追加しました。

5. **`src/screens/*`**
   - 各画面コンポーネントを `.tsx` に変更し、props (画面遷移などで受け取るデータ) に型を付けました。

## 3. これからの開発方法

### 新しい画面を作る時
1. ファイルの拡張子は `.tsx` にします。
2. `src/types.ts` に画面遷移の名前とパラメータを追加します。
3. コンポーネントの `props` に型を付けます (例: `NativeStackScreenProps<RootStackParamList, 'NewScreen'>`)。

### エラーが出たら？
TypeScript はコードを書いている最中にエラーを教えてくれます (赤い波線など)。
エラーメッセージを読み、型が合っているか確認しましょう。

### 型がわからない時
どうしても型がわからない場合は、一時的に `any` という型を使うことができますが、なるべく具体的な型を探してみましょう。

## 4. 実際の移行作業で行ったこと

### ステップ1: 依存関係の追加
```bash
npm install --save-dev typescript @types/react @types/react-native
```
これにより、TypeScript 本体と、React および React Native の型定義ファイルがインストールされます。

### ステップ2: tsconfig.json の作成
Expo 向けの TypeScript 設定ファイルを作成しました：
```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": false
  },
  "include": [
    "**/*.ts",
    "**/*.tsx"
  ]
}
```
- `strict: false` で最初は緩い型チェックにしています（後で厳格化できます）

### ステップ3: 共通の型定義ファイルを作成
`src/types.ts` に、アプリ全体で使う型をまとめました：
```typescript
export interface Topic {
  id: string;
  title: string;
  icon: string;
  description: string;
  content: string;
}

export type RootStackParamList = {
  Home: undefined;
  Detail: { topic: Topic };
  Diary: undefined;
};
```

### ステップ4: ファイルを一つずつ移行
1. **topics.js → topics.ts**
   - `Topic` 型をインポートし、配列に型を適用
   ```typescript
   export const TOPICS: Topic[] = [...]
   ```

2. **各画面コンポーネント (.js → .tsx)**
   - Props に型を追加
   ```typescript
   type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;
   export default function HomeScreen({ navigation }: Props) {...}
   ```

3. **App.js → App.tsx**
   - Navigator に型パラメータを追加
   ```typescript
   const Stack = createNativeStackNavigator<RootStackParamList>();
   ```

### ステップ5: 古い JavaScript ファイルの削除
`.ts` / `.tsx` ファイルを作成後、元の `.js` ファイルを削除しました。
これを忘れると、モジュールの重複エラーが発生します！

## 5. 実際に発生したエラーと対処法

### エラー1: `Property 'id' is missing in type`
**エラー内容:**
```
Property 'id' is missing in type '{ children: Element[]; initialRouteName: "Home"; ... }' 
but required in type '{ id: string; }'.
```

**原因:**
React Navigation v7 では、`Stack.Navigator` に `id` プロパティが必須になりました。

**解決方法:**
```tsx
<Stack.Navigator
  id="root"  // ← これを追加！
  initialRouteName="Home"
  ...
>
```

### エラー2: モジュールが見つからない
**エラー内容:**
```
Cannot find module './src/screens/HomeScreen'
```

**原因:**
古い `.js` ファイルと新しい `.tsx` ファイルが両方存在していた。

**解決方法:**
古い JavaScript ファイルを削除しました。

### エラー3: 型定義がインストールされていない
**原因:**
`@types/react` などがインストールされていなかった。

**解決方法:**
```bash
npm install
```
を実行して依存関係を再インストールしました。

## 6. 移行後の確認事項

✅ すべての `.js` / `.jsx` ファイルが `.ts` / `.tsx` に変わっている  
✅ `npm install` が完了している  
✅ 型エラーが解消されている（赤い波線がない）  
✅ `npx expo start` でアプリが起動する  

## 7. TypeScript を使う上でのポイント

### 良い例
```typescript
// 明確な型定義
interface User {
  id: number;
  name: string;
  email: string;
}

const user: User = {
  id: 1,
  name: "太郎",
  email: "taro@example.com"
};
```

### 避けるべき例
```typescript
// any を多用すると TypeScript の恩恵がない
const data: any = fetchData();
const result: any = processData(data);
```

---

TypeScript への移行お疲れ様でした！
より安全で快適なアプリ開発をお楽しみください。
