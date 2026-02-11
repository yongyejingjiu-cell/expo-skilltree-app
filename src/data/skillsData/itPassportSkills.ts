/**
 * itPassportSkills.ts - ITパスポートコース用スキルデータ
 */
import { Skill } from '../../types';

export const IT_PASSPORT_SKILLS: Skill[] = [
    {
        id: 'ip_strategy',
        name: 'ストラテジ系',
        icon: '💼',
        category: 'concept',
        description: '経営戦略、マーケティング、法務など企業活動の基礎知識。',
        difficulty: 1,
        color: '#E17055',
        keyPoints: [
            '企業経営の基礎（経営理念、CSR、コンプライアンス）',
            'マーケティングの4P（Product/Price/Place/Promotion）',
            '知的財産権（著作権、特許権、商標権）の違いを覚える',
        ],
        misconceptions: [
            '❌「IT試験なのに経営は出ない」→ ストラテジ系は全体の約35%を占める大分野。',
            '❌「著作権は登録が必要」→ 著作権は創作時に自動的に発生する。特許は出願が必要。',
            '❌「会計知識は不要」→ 損益分岐点や財務諸表の基本も出題される。',
        ],
        quiz: {
            question: '損益分岐点とは何を意味する？',
            choices: [
                { label: '利益が最大になる点', isCorrect: false },
                { label: '売上と総費用が等しくなる点', isCorrect: true },
                { label: '投資を回収できる点', isCorrect: false },
                { label: '売上が最大になる点', isCorrect: false },
            ],
            explanation: '損益分岐点は売上高と総費用（固定費+変動費）が等しくなる点です。これを超えると利益が出始めます。',
            xpReward: 20,
        },
        detailContent: `ストラテジ系はITパスポートの約35%を占める重要分野です。

【主な出題範囲】
・企業活動: 経営理念、CSR、BCP
・経営戦略: SWOT分析、PPM、バリューチェーン
・マーケティング: 4P、セグメンテーション
・法務: 知的財産権、個人情報保護法、労働法
・会計: 損益分岐点、ROE、財務三表`,
    },
    {
        id: 'ip_management',
        name: 'マネジメント系',
        icon: '📐',
        category: 'concept',
        description: 'プロジェクト管理、品質管理、ITサービスマネジメント。',
        difficulty: 1,
        color: '#00B894',
        keyPoints: [
            'PDCAサイクル（計画→実行→評価→改善）の概念',
            'プロジェクトの工程（要件定義→設計→実装→テスト→運用）',
            'ITILのサービスマネジメントの基本概念',
        ],
        misconceptions: [
            '❌「PDCAは古い」→ 基本として今も重視される。OODAループとの違いも知っておこう。',
            '❌「テストは最後にやればいい」→ V字モデルでは各工程に対応するテストがある。',
            '❌「ITILは暗記が大変」→ サービスデスク、インシデント管理など基本用語だけ押さえればOK。',
        ],
        quiz: {
            question: 'PDCAサイクルのCは何を意味する？',
            choices: [
                { label: 'Create（作成）', isCorrect: false },
                { label: 'Check（評価）', isCorrect: true },
                { label: 'Change（変更）', isCorrect: false },
                { label: 'Control（管理）', isCorrect: false },
            ],
            explanation: 'PDCAはPlan(計画)→Do(実行)→Check(評価)→Act(改善)のサイクルです。',
            xpReward: 20,
        },
        detailContent: `マネジメント系はITパスポートの約20%を占めます。

【PDCA サイクル】
Plan: 目標と計画を立てる
Do: 計画を実行する
Check: 結果を評価する
Act: 改善策を実行する

【サービスマネジメント(ITIL)】
・インシデント管理: 障害の迅速な復旧
・問題管理: 根本原因の分析と対策
・変更管理: システム変更のリスク管理`,
    },
    {
        id: 'ip_technology',
        name: 'テクノロジ系',
        icon: '⚙️',
        category: 'concept',
        description: 'ハードウェア、ソフトウェア、ネットワーク、セキュリティの基礎。',
        prerequisiteIds: ['ip_strategy', 'ip_management'],
        difficulty: 1,
        color: '#0984E3',
        keyPoints: [
            'コンピュータの5大装置（演算、制御、記憶、入力、出力）',
            'ビット・バイトの単位変換とデータ量の計算',
            'LANとWANの違い、無線LANのセキュリティ規格',
        ],
        misconceptions: [
            '❌「テクノロジ系が一番難しい」→ 基本的な用語が中心。IT系出身なら得点源。',
            '❌「2進数は実務で使わない」→ IPアドレスのサブネット計算等で必要。',
            '❌「クラウドは1種類」→ IaaS/PaaS/SaaSの違いを理解しよう。',
        ],
        quiz: {
            question: '1バイトは何ビット？',
            choices: [
                { label: '4ビット', isCorrect: false },
                { label: '8ビット', isCorrect: true },
                { label: '16ビット', isCorrect: false },
                { label: '32ビット', isCorrect: false },
            ],
            explanation: '1バイト = 8ビットです。1文字のアルファベットは1バイト、日本語は通常2〜3バイトで表現されます。',
            xpReward: 15,
        },
        detailContent: `テクノロジ系はITパスポートの約45%で最大の出題分野です。

【コンピュータの5大装置】
1. 制御装置: CPUの一部、命令を解読
2. 演算装置: CPUの一部、計算を実行
3. 主記憶装置: RAM（揮発性メモリ）
4. 入力装置: キーボード、マウス
5. 出力装置: ディスプレイ、プリンタ

【単位】
1KB = 1,024B, 1MB = 1,024KB, 1GB = 1,024MB`,
    },
    {
        id: 'ip_security_basic',
        name: 'セキュリティ基礎',
        icon: '🔐',
        category: 'tool',
        description: 'パスワード管理、ウイルス対策、安全なインターネット利用。',
        difficulty: 1,
        color: '#D63031',
        keyPoints: [
            'マルウェアの種類（ウイルス、ワーム、ランサムウェア等）を区別できる',
            'フィッシング詐欺やソーシャルエンジニアリングの手口を知っている',
            '適切なパスワード管理と多要素認証の重要性',
        ],
        misconceptions: [
            '❌「ウイルスとマルウェアは同じ」→ マルウェアが総称、ウイルスはその一種。',
            '❌「Mac/スマホはウイルスに感染しない」→ どんな端末でも感染リスクはある。',
            '❌「怪しいサイトに行かなければ安全」→ 正規サイトが改ざんされるケースもある。',
        ],
        quiz: {
            question: '多要素認証の「要素」に含まれないのはどれ？',
            choices: [
                { label: '知識（パスワード等）', isCorrect: false },
                { label: '所持（スマホ等）', isCorrect: false },
                { label: '生体（指紋等）', isCorrect: false },
                { label: '年齢', isCorrect: true },
            ],
            explanation: '多要素認証の3要素は「知識（パスワード等）」「所持（トークン、スマホ等）」「生体（指紋、顔等）」です。年齢は認証要素ではありません。',
            xpReward: 20,
        },
        detailContent: `セキュリティ基礎はITパスポートでも重視されている分野です。

【マルウェアの種類】
・ウイルス: 他のプログラムに寄生して感染
・ワーム: 自己増殖してネットワーク経由で感染
・トロイの木馬: 有用なプログラムに偽装
・ランサムウェア: データを暗号化して身代金要求

【安全対策】
・OS/ソフトの更新を怠らない
・不審なメール/リンクを開かない
・定期的なバックアップ`,
    },
];
