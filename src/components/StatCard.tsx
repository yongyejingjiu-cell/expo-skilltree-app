/**
 * StatCard コンポーネント
 * ステータス（HP, MP, スタミナなど）をカード形式で表示
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, fontSizes, fontWeights, shadows } from '../theme';

type StatType = 'hp' | 'mp' | 'xp' | 'stamina' | 'custom';

interface StatCardProps {
    type: StatType;
    label: string;
    value: number;
    maxValue?: number;
    icon?: string;
    customColor?: string;
}

const getStatColor = (type: StatType, customColor?: string): string => {
    if (customColor) return customColor;
    switch (type) {
        case 'hp':
            return colors.hp;
        case 'mp':
            return colors.mp;
        case 'xp':
            return colors.xp;
        case 'stamina':
            return colors.stamina;
        default:
            return colors.primary;
    }
};

const getStatIcon = (type: StatType): string => {
    switch (type) {
        case 'hp':
            return '❤️';
        case 'mp':
            return '💎';
        case 'xp':
            return '⭐';
        case 'stamina':
            return '⚡';
        default:
            return '📊';
    }
};

export default function StatCard({ type, label, value, maxValue, icon, customColor }: StatCardProps) {
    const statColor = getStatColor(type, customColor);
    const displayIcon = icon || getStatIcon(type);
    const progress = maxValue ? (value / maxValue) * 100 : 100;

    return (
        <View style={styles.container}>
            <View style={[styles.iconContainer, { backgroundColor: statColor }]}>
                <Text style={styles.icon}>{displayIcon}</Text>
            </View>
            <View style={styles.content}>
                <Text style={styles.label}>{label}</Text>
                <View style={styles.valueRow}>
                    <Text style={[styles.value, { color: statColor }]}>{value}</Text>
                    {maxValue && (
                        <Text style={styles.maxValue}>/ {maxValue}</Text>
                    )}
                </View>
                {maxValue && (
                    <View style={styles.progressBar}>
                        <View
                            style={[
                                styles.progressFill,
                                { width: `${progress}%`, backgroundColor: statColor },
                            ]}
                        />
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.backgroundCard,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
        ...shadows.md,
        marginBottom: spacing.sm,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: borderRadius.md,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
        ...shadows.sm,
    },
    icon: {
        fontSize: 20,
    },
    content: {
        flex: 1,
    },
    label: {
        fontSize: fontSizes.sm,
        color: colors.textMuted,
        marginBottom: spacing.xs,
    },
    valueRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    value: {
        fontSize: fontSizes.xxl,
        fontWeight: fontWeights.bold,
    },
    maxValue: {
        fontSize: fontSizes.md,
        color: colors.textMuted,
        marginLeft: spacing.xs,
    },
    progressBar: {
        height: 6,
        backgroundColor: colors.backgroundLight,
        borderRadius: borderRadius.round,
        marginTop: spacing.xs,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: borderRadius.round,
    },
});
