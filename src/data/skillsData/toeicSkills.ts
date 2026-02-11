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
        quiz: {
            question: 'TOEIC Part1で最も重要なスキルはどれ？',
            choices: [
                { label: '速読力', isCorrect: false },
                { label: '写真の状況を正確に聞き取る力', isCorrect: true },
                { label: '文法知識', isCorrect: false },
                { label: '語彙力', isCorrect: false },
            ],
            explanation: 'Part1は写真描写問題です。写真に写っている人物の動作や物の状態を正確に聞き取る力が最も重要です。',
            xpReward: 25,
        },
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
        quiz: {
            question: 'Part3-4で最も効果的なテクニックはどれ？',
            choices: [
                { label: '音声を2回聞く', isCorrect: false },
                { label: '設問の先読み', isCorrect: true },
                { label: '選択肢を全て暗記する', isCorrect: false },
                { label: 'メモを取る', isCorrect: false },
            ],
            explanation: '設問を先に読んでおくことで、音声のどこに注目すべきかがわかり、正答率が大幅に上がります。',
            xpReward: 30,
        },
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
        quiz: {
            question: 'TOEIC Part5の品詞問題で、空所の直前にtheがある場合、空所に入るのは？',
            choices: [
                { label: '動詞', isCorrect: false },
                { label: '副詞', isCorrect: false },
                { label: '名詞', isCorrect: true },
                { label: '接続詞', isCorrect: false },
            ],
            explanation: 'theは冠詞なので、直後には名詞（または名詞を修飾する形容詞+名詞）が来ます。品詞問題では空所の前後の品詞を確認するのが基本テクニックです。',
            xpReward: 25,
        },
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
        quiz: {
            question: 'Part6の文挿入問題を解くコツとして正しいのはどれ？',
            choices: [
                { label: '文法だけで判断する', isCorrect: false },
                { label: '最も長い選択肢を選ぶ', isCorrect: false },
                { label: '前後の文との論理的つながりを確認する', isCorrect: true },
                { label: '最初の選択肢を選ぶ', isCorrect: false },
            ],
            explanation: '文挿入問題では、空所の前後の文との論理的なつながり（順接、逆接、因果関係など）を確認することが重要です。',
            xpReward: 30,
        },
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
        quiz: {
            question: 'Part7で効率よく解くために最も重要なことは？',
            choices: [
                { label: '全文を最初から最後まで読む', isCorrect: false },
                { label: '設問を先に読んでから本文の該当箇所を探す', isCorrect: true },
                { label: '知らない単語を全て調べる', isCorrect: false },
                { label: '選択肢を先に暗記する', isCorrect: false },
            ],
            explanation: '設問を先に読むことで、本文のどこに注目すべきかがわかります。全文精読は時間の無駄になりがちです。',
            xpReward: 35,
        },
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
        quiz: {
            question: 'TOEICリーディングセクション(75分)の理想的な時間配分は？',
            choices: [
                { label: 'Part5: 25分, Part6: 25分, Part7: 25分', isCorrect: false },
                { label: 'Part5: 10分, Part6: 10分, Part7: 55分', isCorrect: true },
                { label: 'Part5: 30分, Part6: 15分, Part7: 30分', isCorrect: false },
                { label: '時間配分は不要', isCorrect: false },
            ],
            explanation: 'Part7が最も問題数が多く配点も高いため、55分程度確保するのが理想です。Part5-6を合計20分以内に抑えましょう。',
            xpReward: 25,
        },
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
