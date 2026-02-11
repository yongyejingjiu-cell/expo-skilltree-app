import { colors as baseColors } from './index';

export interface ThemeColors {
    background: string;
    backgroundCard: string;
    textPrimary: string;
    textSecondary: string;
    primary: string;
    accent: string;
    border: string;
    success: string;
    warning: string;
    error: string;
    info: string;
    xp: string;
    textMuted: string;
}

export interface Theme {
    id: string;
    name: string;
    type: 'day' | 'night' | 'magic';
    colors: ThemeColors;
    backgroundGradient: readonly [string, string, ...string[]];
}

// 基本のナイトテーマ（既存のデザインに近い）
export const NightTheme: Theme = {
    id: 'night',
    name: 'Night',
    type: 'night',
    colors: {
        background: '#1A1A2E',
        backgroundCard: '#0F3460',
        textPrimary: '#EAEAEA',
        textSecondary: '#A0A0B0',
        primary: '#6C5CE7',
        accent: '#FDCB6E',
        border: '#2D2D4A',
        success: '#00B894',
        warning: '#FDCB6E',
        error: '#E74C3C',
        info: '#74B9FF',
        xp: '#F1C40F',
        textMuted: '#6C6C7E',
    },
    backgroundGradient: ['#1A1A2E', '#16213E', '#0F3460'],
};

// 朝〜夕方のデイテーマ（明るく爽やか、でも魔法感は残す）
export const DayTheme: Theme = {
    id: 'day',
    name: 'Day',
    type: 'day',
    colors: {
        background: '#F0F4F8',
        backgroundCard: '#FFFFFF',
        textPrimary: '#2D3436',
        textSecondary: '#636E72',
        primary: '#0984E3',
        accent: '#EDB526', // 少し濃いめの黄色
        border: '#DFE6E9',
        success: '#00B894',
        warning: '#FDCB6E',
        error: '#E74C3C',
        info: '#74B9FF',
        xp: '#F1C40F',
        textMuted: '#636E72',
    },
    backgroundGradient: ['#81ECEC', '#74B9FF', '#A29BFE'],
};

// 特定コース用（例: 魔法・ファンタジー色が強いコース）
export const MagicTheme: Theme = {
    id: 'magic',
    name: 'Magic',
    type: 'magic',
    colors: {
        background: '#2D1B4E',
        backgroundCard: '#4B3F72',
        textPrimary: '#F1F2F6',
        textSecondary: '#B8B2D1',
        primary: '#9C88FF',
        accent: '#F5CD79',
        border: '#4834D4',
        success: '#00B894',
        warning: '#FDCB6E',
        error: '#E74C3C',
        info: '#74B9FF',
        xp: '#F1C40F',
        textMuted: '#6C6C7E',
    },
    backgroundGradient: ['#30336B', '#686DE0', '#4834D4'],
};

// 炎属性・熱血コース用
export const FireTheme: Theme = {
    id: 'fire',
    name: 'Fire',
    type: 'day', // 明るめ扱い
    colors: {
        background: '#FFF0E6',
        backgroundCard: '#FFDDC1',
        textPrimary: '#5D2E12',
        textSecondary: '#A65F3E',
        primary: '#E17055',
        accent: '#D63031',
        border: '#FAB1A0',
        success: '#00B894',
        warning: '#FDCB6E',
        error: '#E74C3C',
        info: '#74B9FF',
        xp: '#F1C40F',
        textMuted: '#8E7366',
    },
    backgroundGradient: ['#FAB1A0', '#FF7675', '#D63031'],
};

// サイバーパンク・ITパスポートなど用
export const CyberTheme: Theme = {
    id: 'cyber',
    name: 'Cyber',
    type: 'night',
    colors: {
        background: '#000000',
        backgroundCard: '#111111',
        textPrimary: '#00CEC9',
        textSecondary: '#74B9FF',
        primary: '#0984E3',
        accent: '#00B894',
        border: '#0984E3',
        success: '#00B894',
        warning: '#FDCB6E',
        error: '#E74C3C',
        info: '#74B9FF',
        xp: '#F1C40F',
        textMuted: '#0097A7',
    },
    backgroundGradient: ['#2D3436', '#000000', '#2D3436'],
};
