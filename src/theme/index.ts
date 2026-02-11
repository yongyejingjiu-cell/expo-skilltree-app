/**
 * RPG/育成UI風 共通テーマ定義
 * Phase0: アプリ全体のデザイントークンを一元管理
 */

// カラーパレット - ダークファンタジー系
export const colors = {
    // プライマリカラー（紫〜青のグラデーション基調）
    primary: '#6C5CE7',
    primaryDark: '#5B4ACE',
    primaryLight: '#A29BFE',

    // アクセントカラー（ゴールド系 - RPG感）
    accent: '#FDCB6E',
    accentDark: '#F0B429',
    accentLight: '#FFE6A0',

    // 背景色（ダークモード基調）
    background: '#1A1A2E',
    backgroundLight: '#16213E',
    backgroundCard: '#0F3460',

    // テキストカラー
    textPrimary: '#EAEAEA',
    textSecondary: '#A0A0B0',
    textMuted: '#6C6C7E',

    // ステータスカラー
    hp: '#E74C3C',      // HP - 赤
    mp: '#3498DB',      // MP - 青
    xp: '#F1C40F',      // XP - 黄
    stamina: '#2ECC71', // スタミナ - 緑

    // UI要素
    border: '#2D2D4A',
    shadow: '#000000',
    overlay: 'rgba(0, 0, 0, 0.6)',

    // グラデーション用
    gradientStart: '#6C5CE7',
    gradientEnd: '#3498DB',

    // 成功・警告・エラー
    success: '#00B894',
    warning: '#FDCB6E',
    error: '#E74C3C',
    info: '#74B9FF',
};

// 余白（8pxベースのスケール）
export const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
};

// 角丸（RPG風UIは少し角丸を効かせる）
export const borderRadius = {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    round: 9999,
};

// 影（カードやボタンに深みを出す）
export const shadows = {
    sm: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
    },
    md: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    lg: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 6,
    },
    glow: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 10,
        elevation: 8,
    },
};

// フォントサイズ
export const fontSizes = {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 24,
    title: 28,
    hero: 36,
};

// フォントウェイト
export const fontWeights = {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
};

// 共通スタイル
export const commonStyles = {
    // カード基本スタイル
    card: {
        backgroundColor: colors.backgroundCard,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
        ...shadows.md,
    },

    // ボタン基本スタイル
    button: {
        backgroundColor: colors.primary,
        borderRadius: borderRadius.md,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        ...shadows.sm,
    },

    // テキストスタイル
    title: {
        fontSize: fontSizes.title,
        fontWeight: fontWeights.bold,
        color: colors.textPrimary,
    },
    subtitle: {
        fontSize: fontSizes.xl,
        fontWeight: fontWeights.semibold,
        color: colors.textPrimary,
    },
    body: {
        fontSize: fontSizes.md,
        fontWeight: fontWeights.normal,
        color: colors.textSecondary,
    },
    caption: {
        fontSize: fontSizes.sm,
        fontWeight: fontWeights.normal,
        color: colors.textMuted,
    },
};

// テーマオブジェクト（一括export用）
const theme = {
    colors,
    spacing,
    borderRadius,
    shadows,
    fontSizes,
    fontWeights,
    commonStyles,
};

export default theme;
