/**
 * appliedItSkills.ts - 応用情報技術者コース用スキルデータ
 */
import { Skill } from '../../types';

export const APPLIED_IT_SKILLS: Skill[] = [
    {
        id: 'ap_system_arch',
        name: 'システムアーキテクチャ',
        icon: '🏛️',
        category: 'concept',
        description: 'システムの全体設計。高可用性、スケーラビリティ、性能設計。',
        difficulty: 3,
        color: '#6C5CE7',
        keyPoints: [
            'クライアントサーバ、3層アーキテクチャ、マイクロサービスを比較できる',
            '可用性の計算（稼働率、MTBF、MTTR）ができる',
            'キャパシティプランニングの考え方を理解している',
        ],
        misconceptions: [
            '❌「最新アーキテクチャが常にベスト」→ 要件に合った設計を選ぶことが重要。',
            '❌「冗長化すれば可用性は100%」→ 99.999%（ファイブナイン）でも年5分のダウンタイムがある。',
            '❌「スケールアップとスケールアウトは同じ」→ 前者はスペック向上、後者は台数増加。',
        ],
        quiz: {
            question: 'MTBF=950時間、MTTR=50時間のシステムの稼働率は？',
            choices: [
                { label: '90%', isCorrect: false },
                { label: '95%', isCorrect: true },
                { label: '99%', isCorrect: false },
                { label: '50%', isCorrect: false },
            ],
            explanation: '稼働率 = MTBF / (MTBF + MTTR) = 950 / (950 + 50) = 0.95 = 95%',
            xpReward: 35,
        },
        detailContent: `システムアーキテクチャは応用情報の午後問題でも頻出です。

【稼働率の計算】
稼働率 = MTBF / (MTBF + MTTR)
・MTBF: 平均故障間隔（正常稼働の平均時間）
・MTTR: 平均修復時間

【冗長構成】
・直列: 全体の稼動率 = A × B
・並列: 全体の稼動率 = 1 - (1-A)(1-B)`,
    },
    {
        id: 'ap_security_adv',
        name: '情報セキュリティ（応用）',
        icon: '🛡️',
        category: 'concept',
        description: 'セキュリティポリシー、リスク分析、インシデント対応の高度な知識。',
        difficulty: 3,
        color: '#D63031',
        keyPoints: [
            'リスクアセスメント（特定→分析→評価）の手順を説明できる',
            'SQLインジェクション、XSS等の攻撃手法と対策を理解している',
            'ISMS(ISO27001)の基本的な枠組みを知っている',
        ],
        misconceptions: [
            '❌「セキュリティは技術だけの問題」→ 人的・物理的・管理的対策も含めた総合的なアプローチが必要。',
            '❌「リスクはゼロにできる」→ リスクの受容、回避、転嫁、低減から適切に選択する。',
            '❌「脆弱性=すぐに攻撃される」→ 脅威×脆弱性=リスク。脅威がなければリスクは低い。',
        ],
        quiz: {
            question: 'SQLインジェクションの対策として最も効果的なのは？',
            choices: [
                { label: 'ファイアウォールの導入', isCorrect: false },
                { label: 'プレースホルダ（バインド変数）の使用', isCorrect: true },
                { label: 'パスワードの強化', isCorrect: false },
                { label: 'SSL/TLSの導入', isCorrect: false },
            ],
            explanation: 'プレースホルダを使うことで、ユーザー入力がSQL文として解釈されることを防ぎます。',
            xpReward: 35,
        },
        detailContent: `応用情報のセキュリティ分野は午後問題の選択肢としても重要です。

【主な攻撃手法】
・SQLインジェクション: DB操作を不正に挿入
・XSS: 悪意のあるスクリプトを仕込む
・CSRF: 偽のリクエストを送信させる
・DoS/DDoS: サービスを過負荷で停止させる

【リスクマネジメント】
リスク = 脅威 × 脆弱性 × 資産価値`,
    },
    {
        id: 'ap_db_advanced',
        name: 'データベース（応用）',
        icon: '🗃️',
        category: 'concept',
        description: 'ER図設計、高度なSQL、性能チューニング。',
        prerequisiteIds: ['ap_system_arch'],
        difficulty: 3,
        color: '#00B894',
        keyPoints: [
            'ER図から正規化されたテーブル設計ができる',
            '副問合せ、相関副問合せ、ビューの使い方を理解している',
            'インデックスの仕組みとB+木の概念を説明できる',
        ],
        misconceptions: [
            '❌「インデックスは多いほど良い」→ 更新時のオーバーヘッドが増える。適切に設計する。',
            '❌「正規化すれば常にパフォーマンスが良い」→ JOINが増えるのでケースバイケース。',
            '❌「ビューは実データを持つ」→ ビューは仮想テーブルで実データは持たない（マテビュー除く）。',
        ],
        quiz: {
            question: 'B+木インデックスの特徴として正しいのはどれ？',
            choices: [
                { label: '全ノードにデータが格納される', isCorrect: false },
                { label: 'リーフノードのみにデータが格納される', isCorrect: true },
                { label: '線形探索と同じ計算量', isCorrect: false },
                { label: 'ソートされていない', isCorrect: false },
            ],
            explanation: 'B+木ではリーフノードにのみデータへのポインタが格納され、リーフ同士がリンクで繋がっているため範囲検索も効率的です。',
            xpReward: 35,
        },
        detailContent: `応用情報のデータベース分野では、設計力が問われます。

【ER図の読み方】
・エンティティ: 四角形（テーブルの元）
・リレーション: 線（関連）
・カーディナリティ: 1対多、多対多などの対応関係

【SQL応用】
・GROUP BY + HAVING: 集計結果の絞り込み
・副問合せ: SELECT内にSELECTをネスト
・EXISTS: 相関副問合せ`,
    },
    {
        id: 'ap_pm',
        name: 'プロジェクトマネジメント',
        icon: '📋',
        category: 'tool',
        description: 'WBS、EVM、クリティカルパスなど高度なPM技法。',
        prerequisiteIds: ['ap_system_arch'],
        difficulty: 2,
        color: '#FDCB6E',
        keyPoints: [
            'WBSで作業を分解し、見積もりとスケジュールを作成できる',
            'EVMの指標（PV, EV, AC, SPI, CPI）を計算できる',
            'クリティカルパス法でスケジュールの最短期間を求められる',
        ],
        misconceptions: [
            '❌「PM技法は暗記で乗り切れる」→ EVMの計算問題は理解が必要。',
            '❌「クリティカルパスは1つだけ」→ 複数存在する場合もある。',
            '❌「余裕日数がある作業は遅れてもOK」→ 余裕を使い切ると新たなクリティカルパスになる。',
        ],
        quiz: {
            question: 'EVM指標でSPI(スケジュール効率指数)が0.8の場合、何を意味する？',
            choices: [
                { label: '計画より20%進んでいる', isCorrect: false },
                { label: '計画より20%遅れている', isCorrect: true },
                { label: 'コストが20%超過', isCorrect: false },
                { label: '品質が80%達成', isCorrect: false },
            ],
            explanation: 'SPI = EV/PV です。0.8ということは計画(PV)に対して実績(EV)が80%しか進んでいない＝20%遅れています。',
            xpReward: 30,
        },
        detailContent: `プロジェクトマネジメントは午後の選択問題で出題されます。

【EVM（アーンドバリューマネジメント）】
・PV (計画値): 予定していた作業量の価値
・EV (出来高): 実際に完了した作業量の価値
・AC (実コスト): 実際にかかったコスト
・SPI = EV / PV（1未満で遅延）
・CPI = EV / AC（1未満でコスト超過）`,
    },
];
