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
        quizzes: [
            {
                question: '要素数nの配列を先頭から順に調べる「線形探索」の最悪計算量は？',
                choices: [
                    { label: 'O(1)', isCorrect: false },
                    { label: 'O(log n)', isCorrect: false },
                    { label: 'O(n)', isCorrect: true },
                    { label: 'O(n²)', isCorrect: false },
                ],
                explanation: '線形探索はn個の要素を最大n回チェックするため、計算量はO(n)になります。',
                xpReward: 30,
            },
            {
                question: 'ソート済みの配列に対し、範囲を半分に絞り込んでいく探索手法は？',
                choices: [
                    { label: 'バブル探索', isCorrect: false },
                    { label: '二分探索', isCorrect: true },
                    { label: '選択探索', isCorrect: false },
                    { label: 'ハッシュ探索', isCorrect: false },
                ],
                explanation: '二分探索（バイナリサーチ）は計算量O(log n)で非常に高速ですが、データがソートされている必要があります。',
                xpReward: 35,
            },
            {
                question: '隣り合う要素の大小を比較して入れ替える、計算量O(n²)のソートアルゴリズムは？',
                choices: [
                    { label: 'バブルソート', isCorrect: true },
                    { label: 'クイックソート', isCorrect: false },
                    { label: 'マージソート', isCorrect: false },
                    { label: 'ヒープソート', isCorrect: false },
                ],
                explanation: 'バブルソートは、値が泡のように移動していく様子から名付けられた単純なソート手法です。',
                xpReward: 30,
            },
        ],
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
        quizzes: [
            {
                question: 'IPアドレス192.168.1.0/24のホスト部のビット数は？',
                choices: [
                    { label: '8ビット', isCorrect: true },
                    { label: '16ビット', isCorrect: false },
                    { label: '24ビット', isCorrect: false },
                    { label: '32ビット', isCorrect: false },
                ],
                explanation: '/24はネットワーク部が24ビットという意味。IPアドレスは計32ビットなので32-24=8ビットです。',
                xpReward: 30,
            },
            {
                question: 'OSI参照モデルにおいて、ルート（経路）選択やIPアドレスを扱う層はどれ？',
                choices: [
                    { label: '物理層', isCorrect: false },
                    { label: 'データリンク層', isCorrect: false },
                    { label: 'ネットワーク層', isCorrect: true },
                    { label: 'セッション層', isCorrect: false },
                ],
                explanation: 'ネットワーク層（第3層）はエンドツーエンドの通信を担当し、ルーター等の機器がこの層で動きます。',
                xpReward: 30,
            },
            {
                question: '名前解決（ドメイン名からIPアドレスを取得）を行うプロトコルはどれ？',
                choices: [
                    { label: 'HTTP', isCorrect: false },
                    { label: 'DNS', isCorrect: true },
                    { label: 'FTP', isCorrect: false },
                    { label: 'SNMP', isCorrect: false },
                ],
                explanation: 'DNS(Domain Name System)により、人間が覚えやすいドメイン名をコンピュータが扱うIPアドレスに変換します。',
                xpReward: 25,
            },
        ],
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
        quizzes: [
            {
                question: 'SQLで抽出条件を指定するキーワードはどれ？',
                choices: [
                    { label: 'ORDER BY', isCorrect: false },
                    { label: 'GROUP BY', isCorrect: false },
                    { label: 'WHERE', isCorrect: true },
                    { label: 'HAVING', isCorrect: false },
                ],
                explanation: 'WHEREは行の抽出条件を指定します。',
                xpReward: 25,
            },
            {
                question: 'トランザクション処理が不可分であることを表すACID特性の一つはどれ？',
                choices: [
                    { label: '原始性 (Atomicity)', isCorrect: true },
                    { label: '加速性 (Acceleration)', isCorrect: false },
                    { label: '互換性 (Compatibility)', isCorrect: false },
                    { label: '柔軟性 (Flexibility)', isCorrect: false },
                ],
                explanation: 'Atomicity(原始性)は、処理が「全て完了するか、全く行われないか」のどちらかであることを保証します。',
                xpReward: 35,
            },
            {
                question: '外部キー等を用いてデータの矛盾を防ぎ、整合性を保つ性質を何と呼ぶ？',
                choices: [
                    { label: '正規化', isCorrect: false },
                    { label: '参照整合性', isCorrect: true },
                    { label: '排他制御', isCorrect: false },
                    { label: 'インデックス', isCorrect: false },
                ],
                explanation: '参照整合性は、関連するテーブル間でデータの不整合が起きないように制限をかける仕組みです。',
                xpReward: 30,
            },
        ],
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
            'ファイアウォール、IDS/IPS의 役割を理解している',
            'マルウェアの種類（ウイルス、ワーム、トロイの木馬等）を区別できる',
        ],
        misconceptions: [
            '❌「暗号化すれば完璧に安全」→ 鍵管理が不適切だと意味がない。',
            '❌「ファイアウォールだけで十分」→ 多層防御（Defense in Depth）が基本。',
            '❌「パスワードは長ければ安全」→ 長さ＋複雑さ＋使い回さないが3原則。',
        ],
        quizzes: [
            {
                question: '公開鍵暗号方式で、送信者が「暗号化」に使う鍵はどれ？',
                choices: [
                    { label: '受信者の公開鍵', isCorrect: true },
                    { label: '送信者の秘密鍵', isCorrect: false },
                    { label: '受信者の秘密鍵', isCorrect: false },
                    { label: '共通鍵', isCorrect: false },
                ],
                explanation: '誰でも見られる受信者の公開鍵で暗号化することで、受信者本人（秘密鍵を持つ人）だけが復号できます。',
                xpReward: 25,
            },
            {
                question: '送信者が本人であることを証明し、改ざんを検知するために使われる技術は？',
                choices: [
                    { label: 'VPN', isCorrect: false },
                    { label: 'デジタル署名', isCorrect: true },
                    { label: 'パケットフィルタリング', isCorrect: false },
                    { label: 'HTTPS', isCorrect: false },
                ],
                explanation: 'デジタル署名はハッシュ関数と公開鍵暗号を組み合わせ、なりすましや改ざんを防ぎます。',
                xpReward: 35,
            },
            {
                question: 'IDSとIPSの違いにおいて、IPSの特徴はどれ？',
                choices: [
                    { label: '侵入を検知するのみ', isCorrect: false },
                    { label: '侵入を検知し、自動的に遮断・遮断する', isCorrect: true },
                    { label: 'ログを記録するだけ', isCorrect: false },
                    { label: 'ウイルスを作成する', isCorrect: false },
                ],
                explanation: 'IPS(Intrusion Prevention System)は「防止」が目的であり、検知した攻撃をリアルタイムで遮断します。',
                xpReward: 30,
            },
        ],
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
        quizzes: [
            {
                question: 'アジャイル開発で1〜4週間の開発サイクルを何と呼ぶ？',
                choices: [
                    { label: 'スプリント', isCorrect: true },
                    { label: 'マイルストーン', isCorrect: false },
                    { label: 'ウォーターフォール', isCorrect: false },
                    { label: 'フェーズ', isCorrect: false },
                ],
                explanation: 'アジャイル（特にスクラム）ではスプリントを繰り返して機能を少しずつ完成させます。',
                xpReward: 20,
            },
            {
                question: '企業の強み、弱み、機会、脅威を分析する環境分析手法は？',
                choices: [
                    { label: '3C分析', isCorrect: false },
                    { label: 'SWOT分析', isCorrect: true },
                    { label: 'PPM分析', isCorrect: false },
                    { label: 'ABC分析', isCorrect: false },
                ],
                explanation: 'SWOT分析は経営戦略を立てる際の非常に基本的なツールです。',
                xpReward: 25,
            },
            {
                question: 'プロジェクト管理における「QCD」のQは何を指す？',
                choices: [
                    { label: 'Quantity (量)', isCorrect: false },
                    { label: 'Quality (品質)', isCorrect: true },
                    { label: 'Quickness (速さ)', isCorrect: false },
                    { label: 'Quest (追求)', isCorrect: false },
                ],
                explanation: 'QCDはQuality(品質), Cost(費用), Delivery(納期)の頭文字で、ものづくりの重要な評価指標です。',
                xpReward: 20,
            },
        ],
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
