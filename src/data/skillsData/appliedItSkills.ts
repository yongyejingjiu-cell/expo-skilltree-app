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
        quizzes: [
            {
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
            {
                question: 'システムの台数を増やすことで処理能力を向上させることを何という？',
                choices: [
                    { label: 'スケールアップ', isCorrect: false },
                    { label: 'スケールアウト', isCorrect: true },
                    { label: 'スケールイン', isCorrect: false },
                    { label: 'スケールダウン', isCorrect: false },
                ],
                explanation: 'スケールアウトは、同等の性能のハードウェアを複数台連結して性能を向上させる手法です。',
                xpReward: 35,
            },
            {
                question: '3層クライアントサーバシステムの構成要素として適切な組み合わせは？',
                choices: [
                    { label: 'プレゼンテーション層、ファンクション層、データ層', isCorrect: true },
                    { label: 'UI層、ネットワーク層、ハードウェア層', isCorrect: false },
                    { label: 'OS層、ミドルウェア層、アプリ層', isCorrect: false },
                    { label: '入力層、隠れ層、出力層', isCorrect: false },
                ],
                explanation: '利用者の操作を受ける「プレゼンテーション層」、業務処理を行う「ファンクション（アプリケーション）層」、データを管理する「データ層」の3つに分割します。',
                xpReward: 40,
            },
        ],
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
        quizzes: [
            {
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
            {
                question: 'リスク対応のうち、リスクを他者に引き受けてもらう（保険への加入など）ことを何という？',
                choices: [
                    { label: 'リスク回避', isCorrect: false },
                    { label: 'リスク受容', isCorrect: false },
                    { label: 'リスク転嫁（共有）', isCorrect: true },
                    { label: 'リスク低減', isCorrect: false },
                ],
                explanation: 'リスク転嫁は、保険加入やアウトソーシングによって、リスクの影響を第三者に移転することです。',
                xpReward: 35,
            },
            {
                question: '情報セキュリティの3要素（CIA）に含まれないものはどれ？',
                choices: [
                    { label: '機密性 (Confidentiality)', isCorrect: false },
                    { label: '完全性 (Integrity)', isCorrect: false },
                    { label: '可用性 (Availability)', isCorrect: false },
                    { label: '即時性 (Immediacy)', isCorrect: true },
                ],
                explanation: 'セキュリティの3要素は、認可された人だけが使える「機密性」、正確さを保つ「完全性」、必要な時に使える「可用性」です。',
                xpReward: 30,
            },
        ],
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
        quizzes: [
            {
                question: 'B+木インデックスの特徴として正しいのはどれ？',
                choices: [
                    { label: '全ノードにデータが格納される', isCorrect: false },
                    { label: 'リーフノードのみに実データへのポインタ（またはデータ）が格納される', isCorrect: true },
                    { label: '線形探索と同じ計算速度である', isCorrect: false },
                    { label: '常に全件スキャンを行う', isCorrect: false },
                ],
                explanation: 'B+木ではリーフノードにのみデータ（またはポインタ）が格納され、リーフ同士が繋がっているため範囲検索も高速です。',
                xpReward: 35,
            },
            {
                question: '関係データベースにおいて、部分関数従属を排除し、主キーに完全関数従属するようにする操作を何という？',
                choices: [
                    { label: '第1正規化', isCorrect: false },
                    { label: '第2正規化', isCorrect: true },
                    { label: '第3正規化', isCorrect: false },
                    { label: '非正規化', isCorrect: false },
                ],
                explanation: '第2正規化は、主キーの一部に従属する列を別のテーブルに分離し、完全関数従属な状態にする操作です。',
                xpReward: 40,
            },
            {
                question: 'データベースの性能を向上させるために、結合(JOIN)を減らす目的で正規化を崩すことを何という？',
                choices: [
                    { label: '再正規化', isCorrect: false },
                    { label: '非正規化（逆正規化）', isCorrect: true },
                    { label: 'インデックス最適化', isCorrect: false },
                    { label: 'デッドロック回避', isCorrect: false },
                ],
                explanation: '参照パフォーマンス向上のために、あえて重複を許容して正規化を戻すことを非正規化と呼びます。',
                xpReward: 35,
            },
        ],
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
        quizzes: [
            {
                question: 'EVM指標でSPI(スケジュール効率指数)が0.8の場合、何を意味する？',
                choices: [
                    { label: '計画より20%進んでいる', isCorrect: false },
                    { label: '計画より20%遅れている', isCorrect: true },
                    { label: 'コストが20%超過している', isCorrect: false },
                    { label: '品質が80%である', isCorrect: false },
                ],
                explanation: 'SPI = EV/PV です。0.8は計画(PV)に対して実績(EV)が80%しか進んでいない（20%遅延）ことを表します。',
                xpReward: 30,
            },
            {
                question: 'アローダイアグラムにおいて、作業の開始から終了までの経路のうち、所要日数が最も長い経路を何という？',
                choices: [
                    { label: '最短経路', isCorrect: false },
                    { label: 'クリティカルパス', isCorrect: true },
                    { label: 'ゴールデンルート', isCorrect: false },
                    { label: 'ボトルネック', isCorrect: false },
                ],
                explanation: 'クリティカルパスは、プロジェクト全体の期間を決定する最も重要な経路です。',
                xpReward: 35,
            },
            {
                question: 'コスト効率指数 (CPI) = 1.2 の状態を正しく説明しているのはどれ？',
                choices: [
                    { label: '予算が足りなくなっている', isCorrect: false },
                    { label: '予算の範囲内で順調にコストを抑えられている', isCorrect: true },
                    { label: 'スケジュールが遅れている', isCorrect: false },
                    { label: '品質に問題がある', isCorrect: false },
                ],
                explanation: 'CPI = EV/AC です。1より大きい場合は、使った費用(AC)以上の成果(EV)が出ている「予算を下回る（順調な）」状態です。',
                xpReward: 35,
            },
        ],
        detailContent: `プロジェクトマネジメントは午後の選択問題で出題されます。

【EVM（アーンドバリューマネジメント）】
・PV (計画値): 予定していた作業量の価値
・EV (出来高): 実際に完了した作業量の価値
・AC (実コスト): 実際にかかったコスト
・SPI = EV / PV（1未満で遅延）
・CPI = EV / AC（1未満でコスト超過）`,
    },
];
