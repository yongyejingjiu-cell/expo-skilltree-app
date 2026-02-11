/**
 * basicItSkills.ts - 基本情報技術者コース用スキルデータ
 */
import { Skill } from '../../types';

export const BASIC_IT_SKILLS: Skill[] = [
    {
        id: 'fe_algorithm',
        name: 'アルゴリズム',
        icon: '🔢',
        category: 'concept',
        description: '問題を解く手順を論理的に組み立てる能力。午後試験の必須分野。',
        difficulty: 2,
        color: '#6C5CE7',
        keyPoints: [
            'フローチャートやトレース表で処理の流れを追える',
            'ソート（整列）と探索（検索）が基本中の基本',
            '擬似言語の読み方に慣れることが午後試験突破の鍵',
        ],
        misconceptions: [
            '❌「アルゴリズムは暗記科目」→ 仕組みを理解し、手でトレースできることが大事。',
            '❌「プログラミング経験がないと無理」→ 擬似言語は特定言語に依存しない。論理的思考が重要。',
            '❌「配列のインデックスは1から」→ 問題によって0始まりと1始まりがある。必ず確認。',
        ],
        quiz: {
            question: '要素数nの配列を線形探索した場合の最悪計算量は？',
            choices: [
                { label: 'O(1)', isCorrect: false },
                { label: 'O(log n)', isCorrect: false },
                { label: 'O(n)', isCorrect: true },
                { label: 'O(n²)', isCorrect: false },
            ],
            explanation: '線形探索は先頭から順に比較するので、最悪の場合n回の比較が必要です。計算量はO(n)となります。',
            xpReward: 30,
        },
        detailContent: `アルゴリズムは「問題を解くための手順」です。基本情報技術者試験の午後問題で必須です。

【基本のアルゴリズム】
・線形探索: 先頭から順に探す O(n)
・二分探索: 半分に絞って探す O(log n) ※ソート済みが条件
・バブルソート: 隣接要素を交換 O(n²)
・選択ソート: 最小値を先頭に移動 O(n²)

【トレースのコツ】
変数の値を表にして、1ステップずつ追いかけよう。`,
    },
    {
        id: 'fe_network',
        name: 'ネットワーク基礎',
        icon: '🌐',
        category: 'concept',
        description: 'TCP/IP、IPアドレス、プロトコルなどネットワークの基礎知識。',
        prerequisiteIds: ['fe_algorithm'],
        difficulty: 2,
        color: '#0984E3',
        keyPoints: [
            'OSI参照モデル7層とTCP/IP4層モデルの対応を覚える',
            'IPアドレスのクラス分けとサブネットマスクの計算ができる',
            'HTTP, SMTP, FTP, DNSなど主要プロトコルの役割を理解する',
        ],
        misconceptions: [
            '❌「IPアドレスとMACアドレスは同じ」→ IPはネットワーク層、MACはデータリンク層で別の役割。',
            '❌「HTTPSはHTTPとは別のプロトコル」→ HTTPにTLS/SSL暗号化を追加したもの。',
            '❌「サブネットマスクは暗記するだけ」→ ビット演算で理解すると応用が利く。',
        ],
        quiz: {
            question: 'IPアドレス192.168.1.0/24のホスト部のビット数は？',
            choices: [
                { label: '8ビット', isCorrect: true },
                { label: '16ビット', isCorrect: false },
                { label: '24ビット', isCorrect: false },
                { label: '32ビット', isCorrect: false },
            ],
            explanation: '/24はネットワーク部が24ビットという意味。IPアドレスは32ビットなので、ホスト部は32-24=8ビットです。',
            xpReward: 30,
        },
        detailContent: `ネットワーク基礎は基本情報技術者試験の頻出分野です。

【TCP/IP 4層モデル】
4. アプリケーション層 (HTTP, SMTP, DNS)
3. トランスポート層 (TCP, UDP)
2. インターネット層 (IP, ICMP)
1. ネットワークインターフェース層 (Ethernet)

【IPアドレスの基本】
・IPv4: 32ビット（例: 192.168.1.1）
・サブネットマスク: ネットワーク部とホスト部を区別`,
    },
    {
        id: 'fe_database',
        name: 'データベース',
        icon: '🗄️',
        category: 'concept',
        description: 'SQLとリレーショナルデータベースの基礎。正規化やトランザクション。',
        prerequisiteIds: ['fe_algorithm'],
        difficulty: 2,
        color: '#00B894',
        keyPoints: [
            'SELECT, INSERT, UPDATE, DELETEの基本SQL文が書ける',
            '第1〜第3正規化の手順を理解している',
            'トランザクションのACID特性を説明できる',
        ],
        misconceptions: [
            '❌「正規化は第3まででOK」→ 試験では第3正規化まで求められることが多いが、概念は理解しよう。',
            '❌「JOINは1種類」→ INNER JOIN, LEFT JOIN, RIGHT JOINなど複数ある。',
            '❌「NULLは0と同じ」→ NULLは「値なし」であり、0とは全く異なる。',
        ],
        quiz: {
            question: 'SQLで条件に合う行を抽出する句はどれ？',
            choices: [
                { label: 'ORDER BY', isCorrect: false },
                { label: 'GROUP BY', isCorrect: false },
                { label: 'WHERE', isCorrect: true },
                { label: 'HAVING', isCorrect: false },
            ],
            explanation: 'WHEREは行の抽出条件を指定します。HAVINGはGROUP BY後の絞り込み、ORDER BYは並び替えです。',
            xpReward: 25,
        },
        detailContent: `データベースはIT試験の定番分野です。

【基本SQL】
SELECT name FROM users WHERE age >= 20;
INSERT INTO users (name, age) VALUES ('太郎', 25);
UPDATE users SET age = 26 WHERE name = '太郎';
DELETE FROM users WHERE name = '太郎';

【正規化】
・第1正規化: 繰り返し項目を排除
・第2正規化: 部分関数従属を排除
・第3正規化: 推移的関数従属を排除`,
    },
    {
        id: 'fe_security',
        name: '情報セキュリティ',
        icon: '🔒',
        category: 'concept',
        description: '暗号化、認証、マルウェア対策など情報セキュリティの基礎。',
        difficulty: 1,
        color: '#D63031',
        keyPoints: [
            '共通鍵暗号と公開鍵暗号の違いを説明できる',
            'ファイアウォール、IDS/IPSの役割を理解している',
            'マルウェアの種類（ウイルス、ワーム、トロイの木馬等）を区別できる',
        ],
        misconceptions: [
            '❌「暗号化すれば完璧に安全」→ 鍵管理が不適切だと意味がない。',
            '❌「ファイアウォールだけで十分」→ 多層防御（Defense in Depth）が基本。',
            '❌「パスワードは長ければ安全」→ 長さ＋複雑さ＋使い回さないが3原則。',
        ],
        quiz: {
            question: '公開鍵暗号方式で、送信者が暗号化に使う鍵はどれ？',
            choices: [
                { label: '送信者の秘密鍵', isCorrect: false },
                { label: '受信者の公開鍵', isCorrect: true },
                { label: '送信者の公開鍵', isCorrect: false },
                { label: '共通鍵', isCorrect: false },
            ],
            explanation: '公開鍵暗号では、受信者の公開鍵で暗号化し、受信者の秘密鍵で復号します。',
            xpReward: 25,
        },
        detailContent: `情報セキュリティは基本情報の午前・午後両方で頻出です。

【暗号方式】
・共通鍵暗号: 暗号化と復号に同じ鍵を使う（AES等）
・公開鍵暗号: 公開鍵で暗号化、秘密鍵で復号（RSA等）
・ハイブリッド暗号: 両方を組み合わせ（SSL/TLS）

【認証技術】
・パスワード認証、多要素認証(MFA)
・デジタル署名、電子証明書`,
    },
    {
        id: 'fe_management',
        name: 'マネジメント/ストラテジ',
        icon: '📊',
        category: 'tool',
        description: 'プロジェクト管理手法と経営戦略。午前試験の得点源。',
        difficulty: 1,
        color: '#FDCB6E',
        keyPoints: [
            'ウォーターフォールとアジャイルの違いを説明できる',
            'PMBOK知識エリア（スコープ、時間、コスト等）の基本を押さえる',
            'SWOT分析やポーターの5フォースなど経営戦略の基本ツールを覚える',
        ],
        misconceptions: [
            '❌「マネジメントは技術者には不要」→ FE試験では午前の約25%を占める重要分野。',
            '❌「アジャイル=管理なし」→ スプリント計画やレトロスペクティブなど管理手法がある。',
            '❌「暗記科目だから直前でOK」→ 用語が多いので早めに取り組むべし。',
        ],
        quiz: {
            question: 'アジャイル開発で1〜4週間の開発サイクルを何と呼ぶ？',
            choices: [
                { label: 'ウォーターフォール', isCorrect: false },
                { label: 'スプリント', isCorrect: true },
                { label: 'マイルストーン', isCorrect: false },
                { label: 'フェーズ', isCorrect: false },
            ],
            explanation: 'スプリントはアジャイル（特にスクラム）における短い開発サイクルです。1〜4週間で計画→実装→レビューを繰り返します。',
            xpReward: 20,
        },
        detailContent: `マネジメントとストラテジは午前試験の得点源です。

【開発手法】
・ウォーターフォール: 要件定義→設計→実装→テスト→運用
・アジャイル: 短いサイクルで反復開発
・DevOps: 開発と運用の連携

【経営戦略ツール】
・SWOT分析: 強み/弱み/機会/脅威
・PPM: 花形/金のなる木/問題児/負け犬`,
    },
];
