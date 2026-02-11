/**
 * toeicSkills.ts - TOEICコース用スキルデータ
 */
import { Skill } from '../../types';

export const TOEIC_SKILLS: Skill[] = [
    {
        id: 'toeic_part12',
        name: 'Part1-2 写真/応答',
        icon: '🖼️',
        category: 'concept',
        description: 'Part1の写真描写問題とPart2の応答問題。リスニングの基礎。',
        difficulty: 1,
        color: '#E17055',
        keyPoints: [
            'Part1は写真を見て正しい描写を選ぶ（6問）',
            'Part2は質問に対する適切な応答を選ぶ（25問）',
            '消去法が有効。明らかに違う選択肢を先に消す',
        ],
        misconceptions: [
            '❌「写真に写っているものの単語が聞こえたら正解」→ ひっかけが多い。動作や状態を正確に聞き取ろう。',
            '❌「Part2は簡単」→ 間接的な応答が正解になることも多く、意外と難しい。',
            '❌「全部聞き取れないとダメ」→ キーワードを拾えれば正解できる問題も多い。',
        ],
        quizzes: [
            {
                question: 'TOEIC Part1で最も重要なスキルはどれ？',
                choices: [
                    { label: '速読力', isCorrect: false },
                    { label: '写真の状況を正確に聞き取る力', isCorrect: true },
                    { label: '文法知識', isCorrect: false },
                    { label: '語彙力', isCorrect: false },
                ],
                explanation: 'Part1は写真描写問題です。人物の動作や物の状態を正確に捉える必要があります。',
                xpReward: 25,
            },
            {
                question: 'Part2で、質問の単語と似た音（似た単語）が含まれる選択肢に出会った際、どうすべき？',
                choices: [
                    { label: 'その選択肢を正解と疑う', isCorrect: false },
                    { label: 'その選択肢をひっかけとして疑う', isCorrect: true },
                    { label: '迷わず選ぶ', isCorrect: false },
                    { label: '問題自体を飛ばす', isCorrect: false },
                ],
                explanation: 'Part2では「似た音の単語」を使って受験者を誘導するひっかけ問題が多いため、注意が必要です。',
                xpReward: 30,
            },
            {
                question: 'Part2の応答として「I don’t know.」のような「わからない」系の回答は？',
                choices: [
                    { label: '絶対に不正解である', isCorrect: false },
                    { label: '正解になる確率が比較的高い', isCorrect: true },
                    { label: 'ひっかけなので選んではいけない', isCorrect: false },
                    { label: 'Part1にしか出ない', isCorrect: false },
                ],
                explanation: '「わからない」「まだ決まっていない」等の「逃げ」の回答は、TOEIC Part2では正解になりやすい傾向があります。',
                xpReward: 30,
            },
        ],
        detailContent: `Part1（写真描写）とPart2（応答問題）はリスニングセクションの最初のパートです。

【Part1 - 写真描写問題（6問）】
1枚の写真を見て、4つの英文から正しい描写を選びます。
・人物の動作（sitting, standing, walkingなど）
・物の位置関係（on the table, next toなど）
・場面の状態（is being repaired, has been placedなど）

【Part2 - 応答問題（25問）】
質問や発言を聞き、3つの応答から適切なものを選びます。
・WH疑問文（Who, What, Where, When, Why, How）
・Yes/No疑問文
・提案・依頼文`,
    },
    {
        id: 'toeic_part34',
        name: 'Part3-4 会話/説明文',
        icon: '🎧',
        category: 'concept',
        description: 'Part3の会話問題とPart4の説明文問題。長めのリスニング。',
        prerequisiteIds: ['toeic_part12'],
        difficulty: 2,
        color: '#0984E3',
        keyPoints: [
            'Part3は2-3人の会話を聞いて3問に答える（39問）',
            'Part4は1人のトーク（留守電、アナウンス等）を聞いて3問に答える（30問）',
            '先に設問を読んでおく「先読み」テクニックが必須',
        ],
        misconceptions: [
            '❌「会話を一語一句聞き取る必要がある」→ 設問に関連する情報だけ拾えばOK。',
            '❌「Part4は難しいから捨てる」→ パターンが決まっているので慣れれば得点源になる。',
            '❌「先読みは時間の無駄」→ 先読みするかしないかでスコアが大きく変わる。',
        ],
        quizzes: [
            {
                question: 'Part3-4で最も効果的なテクニックはどれ？',
                choices: [
                    { label: '音声を2回聞く', isCorrect: false },
                    { label: '設問の「先読み」', isCorrect: true },
                    { label: '選択肢を全て暗記する', isCorrect: false },
                    { label: '詳細なメモを取る', isCorrect: false },
                ],
                explanation: '設問を先に読んでおくことで、音声のどこに注目すべきかがわかり、正答率が大幅に上がります。',
                xpReward: 30,
            },
            {
                question: '会話の最初の方で聞き取ることが最も求められる情報はどれ？',
                choices: [
                    { label: '話し手の将来の夢', isCorrect: false },
                    { label: '会話のトピックや目的', isCorrect: true },
                    { label: '天候の変化', isCorrect: false },
                    { label: '固有名詞の綴り', isCorrect: false },
                ],
                explanation: '冒頭の数文で「どこで」「誰が」「何の目的で」話しているか（概要）を捉えることが重要です。',
                xpReward: 30,
            },
            {
                question: 'Part3/4で図表（Graphic）が含まれる問題の注意点は？',
                choices: [
                    { label: '図表は無視してよい', isCorrect: false },
                    { label: '音声の内容を図表と照らし合わせて判断する', isCorrect: true },
                    { label: '図表は日本語で書かれている', isCorrect: false },
                    { label: '最も小さい数字を選ぶ', isCorrect: false },
                ],
                explanation: '図表問題は、音声から得た情報と図表内の別の情報を結びつけて正解を導くひねりがあります。',
                xpReward: 35,
            },
        ],
        detailContent: `Part3（会話問題）とPart4（説明文問題）は長めのリスニングです。

【先読みテクニック】
1. 音声が流れる前に設問と選択肢をサッと読む
2. 何を聞かれるか把握してから音声を聞く
3. 答えがわかったらすぐマークして次の設問を先読み

【Part3でよく出る場面】
・オフィスでの会話、店での買い物、電話での問い合わせ

【Part4でよく出る形式】
・留守番電話、案内放送、広告、スピーチ`,
    },
    {
        id: 'toeic_part5_grammar',
        name: 'Part5 短文穴埋め',
        icon: '✏️',
        category: 'concept',
        description: 'Part5の文法・語彙問題。短文の空所に適切な語句を選ぶ。',
        difficulty: 1,
        color: '#00B894',
        keyPoints: [
            '30問を約10分で解く速度が必要（1問20秒目安）',
            '品詞問題（名詞/動詞/形容詞/副詞の選択）が頻出',
            '時制・態（能動態/受動態）の問題も定番',
        ],
        misconceptions: [
            '❌「文全体を読まないと解けない」→ 品詞問題は空所の前後だけで解けることが多い。',
            '❌「文法は暗記するしかない」→ パターンを理解すれば応用が利く。',
            '❌「Part5に時間をかけすぎる」→ ここで時間を節約してPart7に回すのが高得点の鍵。',
        ],
        quizzes: [
            {
                question: 'Part5の空所の直前にtheがある場合、空所に入る可能性が最も高い品詞は？',
                choices: [
                    { label: '名詞', isCorrect: true },
                    { label: '副詞', isCorrect: false },
                    { label: '接続詞', isCorrect: false },
                    { label: '前置詞', isCorrect: false },
                ],
                explanation: '冠詞 the の直後には名詞（または形容詞+名詞）が来ます。これは秒殺すべき基礎問題です。',
                xpReward: 25,
            },
            {
                question: '「-ly」で終わる単語の多くは何の品詞？',
                choices: [
                    { label: '名詞', isCorrect: false },
                    { label: '形容詞', isCorrect: false },
                    { label: '副詞', isCorrect: true },
                    { label: '動詞', isCorrect: false },
                ],
                explanation: 'quickly, carefully など、-ly で終わる形容詞由来の単語は「副詞」であることが多いです。',
                xpReward: 25,
            },
            {
                question: 'Part5で時制の問題を解く際、最も注目すべき箇所はどこ？',
                choices: [
                    { label: '文全体の文字数', isCorrect: false },
                    { label: '時を表す副詞句（yesterday, soon等）', isCorrect: true },
                    { label: '感嘆符の有無', isCorrect: false },
                    { label: 'カンマの数', isCorrect: false },
                ],
                explanation: 'last year（過去）、next week（未来）など、時を表すキーワードがヒントになります。',
                xpReward: 30,
            },
        ],
        detailContent: `Part5は短文穴埋め問題（30問）です。リーディングセクションの最初のパート。

【問題タイプ】
1. 品詞問題: 同じ語根の異なる品詞から選ぶ
2. 語彙問題: 文意に合う単語を選ぶ
3. 文法問題: 時制、態、関係詞などの文法知識

【時間配分の目安】
・Part5: 10分（1問20秒）
・Part6: 10分
・Part7: 55分
Part5で時間を節約することがスコアアップの鍵！`,
    },
    {
        id: 'toeic_part6',
        name: 'Part6 長文穴埋め',
        icon: '📄',
        category: 'concept',
        description: 'Part6の長文穴埋め問題。文脈を理解して適切な語句・文を選ぶ。',
        prerequisiteIds: ['toeic_part5_grammar'],
        difficulty: 2,
        color: '#6C5CE7',
        keyPoints: [
            '4つの文書×各4問=16問。文書全体の流れを把握する必要がある',
            '文挿入問題（1文丸ごと選ぶ）が各文書に1問出る',
            'メール、手紙、記事、お知らせなどの文書形式に慣れておく',
        ],
        misconceptions: [
            '❌「Part5と同じ解き方でOK」→ Part6は文脈理解が必要。空所の前後だけでは解けないことも。',
            '❌「文挿入問題は難しいから後回し」→ 前後の文の繋がりを見れば解ける。練習あるのみ。',
            '❌「長文だから時間がかかる」→ 文書自体は短め。10分以内で解く練習をしよう。',
        ],
        quizzes: [
            {
                question: 'Part6の文挿入問題を解くコツとして正しいのはどれ？',
                choices: [
                    { label: '文法だけで判断する', isCorrect: false },
                    { label: '最も長い選択肢を選ぶ', isCorrect: false },
                    { label: '前後の文との論理的つながりを確認する', isCorrect: true },
                    { label: '適当に選ぶ', isCorrect: false },
                ],
                explanation: '代名詞（this, they等）や接続副詞（However, Furthermore等）が、前後の文との繋がりを示すヒントになります。',
                xpReward: 30,
            },
            {
                question: 'Part6で空所の前後の文脈を確認する必要がある問題はどれ？',
                choices: [
                    { label: '文挿入問題', isCorrect: true },
                    { label: '単なるスペルミス探し', isCorrect: false },
                    { label: '著者の住所', isCorrect: false },
                    { label: 'フォントサイズの指定', isCorrect: false },
                ],
                explanation: 'Part6はPart5と異なり、全体の流れを把握しないと解けない問題が含まれます。',
                xpReward: 30,
            },
            {
                question: '「Moreover」や「Consequently」などの接続副詞の知識が特に役立つパートは？',
                choices: [
                    { label: 'Part1', isCorrect: false },
                    { label: 'Part2', isCorrect: false },
                    { label: 'Part6', isCorrect: true },
                    { label: 'Part3', isCorrect: false },
                ],
                explanation: '文と文の関係性を表す接続副詞は、Part6の穴埋めや文挿入で非常に重要なヒントになります。',
                xpReward: 25,
            },
        ],
        detailContent: `Part6は長文穴埋め問題（16問）です。

【Part5との違い】
Part5は1文だけですが、Part6は文書全体の文脈を理解する必要があります。

【文挿入問題の解き方】
1. 空所の前の文を読む
2. 空所の後の文を読む
3. 論理的につながる文を選ぶ
・However → 逆接
・Therefore → 結果
・In addition → 追加情報`,
    },
    {
        id: 'toeic_part7',
        name: 'Part7 読解問題',
        icon: '📰',
        category: 'concept',
        description: 'Part7の長文読解。シングル/ダブル/トリプルパッセージの読解問題。',
        prerequisiteIds: ['toeic_part6'],
        difficulty: 3,
        color: '#D63031',
        keyPoints: [
            'シングル（29問）、ダブル（10問）、トリプル（15問）の3形式',
            'スキミング（全体把握）とスキャニング（情報検索）を使い分ける',
            'NOT問題や推測問題は消去法で解く',
        ],
        misconceptions: [
            '❌「全文を精読しないといけない」→ 設問に関連する箇所だけ読めばOK。',
            '❌「Part7は最後だから時間が足りない」→ Part5-6を早く終わらせて55分確保するのが鍵。',
            '❌「難しい問題は飛ばさない」→ 時間がなければ簡単な問題を優先。全問解く必要はない。',
        ],
        quizzes: [
            {
                question: 'Part7で効率よく解くために最も重要なことは？',
                choices: [
                    { label: '全文を最初から最後まで精読する', isCorrect: false },
                    { label: '設問を先に読んでから本文の該当箇所を探す', isCorrect: true },
                    { label: '知らない単語を全て辞書で引く', isCorrect: false },
                    { label: '感で解く', isCorrect: false },
                ],
                explanation: '設問を先に読むことで、本文のどこに注目すべきかがわかります。',
                xpReward: 35,
            },
            {
                question: '複数の文書を照らし合わせる必要がある問題（連動型問題）が出るのはどの形式？',
                choices: [
                    { label: 'シングルパッセージ', isCorrect: false },
                    { label: 'ダブル/トリプルパッセージ', isCorrect: true },
                    { label: 'Part5', isCorrect: false },
                    { label: 'Part2', isCorrect: false },
                ],
                explanation: '2つ、あるいは3つの文書の情報を組み合わせて正解を導き出す必要があります。',
                xpReward: 40,
            },
            {
                question: '「NOT問題（当てはまらないものを選ぶ）」の最も確実な解き方は？',
                choices: [
                    { label: '消去法で、本文に記述があるものを3つ消す', isCorrect: true },
                    { label: '一番短い文を選ぶ', isCorrect: false },
                    { label: '一番長い文を選ぶ', isCorrect: false },
                    { label: '本文に一度も出てこない単語を探す', isCorrect: false },
                ],
                explanation: '書いてあることを3つ見つけ、残った一つを正解とする消去法が確実です。',
                xpReward: 30,
            },
        ],
        detailContent: `Part7は読解問題（54問）で、リーディングの大部分を占めます。

【文書タイプ】
・メール、手紙、チャット、広告、記事、フォーム、スケジュール等

【3つの形式】
1. シングルパッセージ: 1つの文書で2-4問
2. ダブルパッセージ: 2つの関連文書で5問
3. トリプルパッセージ: 3つの関連文書で5問

【時間配分】
55分で54問 → 1問約1分が目安`,
    },
    {
        id: 'toeic_vocab_time',
        name: '語彙力/時間管理',
        icon: '⏰',
        category: 'tool',
        description: 'TOEIC頻出語彙の習得と、試験全体の時間管理戦略。',
        difficulty: 1,
        color: '#FDCB6E',
        keyPoints: [
            'TOEIC頻出単語（金フレ等）を毎日少しずつ覚える',
            'リスニング45分+リーディング75分の配分を体に覚えさせる',
            'マークシート塗り残しゼロを目指す（時間切れでもとりあえずマーク）',
        ],
        misconceptions: [
            '❌「難しい単語を覚えれば高得点」→ ビジネス頻出の基本語彙が最重要。',
            '❌「全問解けなければダメ」→ 600点台なら7-8割正解で十分。完璧は不要。',
            '❌「時間配分は当日考える」→ 事前に練習で体得しておくべし。',
        ],
        quizzes: [
            {
                question: 'TOEICリーディングセクションの理想的な時間配分は？',
                choices: [
                    { label: 'Part5-6を20分以内、Part7に55分', isCorrect: true },
                    { label: 'Part5-7を各25分ずつ', isCorrect: false },
                    { label: 'Part5に時間をかけ、Part7は捨てる', isCorrect: false },
                    { label: '時間配分は考えない', isCorrect: false },
                ],
                explanation: '最も問題数が多く配点も高いPart7に55分程度確保するのが理想的な戦略です。',
                xpReward: 25,
            },
            {
                question: '単語学習において最も効率的な方法はどれ？',
                choices: [
                    { label: '一夜漬けで大量に暗記する', isCorrect: false },
                    { label: '毎日短時間、同じ語彙を何度も目に触れさせる', isCorrect: true },
                    { label: '辞書をAから順に書き写す', isCorrect: false },
                    { label: '日本語訳だけ覚える', isCorrect: false },
                ],
                explanation: '繰り返し復習することで短期記憶が長期記憶へと定着します。毎日継続することが重要です。',
                xpReward: 20,
            },
            {
                question: '試験終了直前、まだ未回答の問題がある場合の最善策は？',
                choices: [
                    { label: 'とにかく全てのマークを埋める', isCorrect: true },
                    { label: '空欄のまま出す', isCorrect: false },
                    { label: '途中でマークを止める', isCorrect: false },
                    { label: '問題用紙を見直すのみにする', isCorrect: false },
                ],
                explanation: 'TOEICは減点方式ではないため、記述がなくてもマークをすることで正解になる可能性があります。',
                xpReward: 20,
            },
        ],
        detailContent: `語彙力と時間管理はTOEICスコアアップの両輪です。

【語彙学習法】
・TOEIC特化の単語帳（金のフレーズ等）を活用
・1日30語を目安に、繰り返し復習
・例文と一緒に覚えると定着率UP

【時間管理戦略】
・リスニング: 音声に従うので自分で管理不要
・リーディング: Part5(10分) → Part6(10分) → Part7(55分)
・残り5分で見直し＆マーク漏れチェック`,
    },
];
