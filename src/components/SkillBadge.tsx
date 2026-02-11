/**
 * SkillBadge コンポーネント
 * 習得スキルをバッジ形式で表示
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, borderRadius, fontSizes, fontWeights, shadows } from '../theme';

type SkillRarity = 'common' | 'rare' | 'epic' | 'legendary';

interface SkillBadgeProps {
    name: string;
    icon?: string;
    rarity?: SkillRarity;
    level?: number;
    isLocked?: boolean;
    onPress?: () => void;
}

const getRarityStyles = (rarity: SkillRarity): { color: string; bgColor: string; borderColor: string } => {
    switch (rarity) {
        case 'legendary':
            return {
                color: colors.accent,
                bgColor: 'rgba(253, 203, 110, 0.15)',
                borderColor: colors.accent,
            };
        case 'epic':
            return {
                color: '#A855F7',
                bgColor: 'rgba(168, 85, 247, 0.15)',
                borderColor: '#A855F7',
            };
        case 'rare':
            return {
                color: colors.info,
                bgColor: 'rgba(116, 185, 255, 0.15)',
                borderColor: colors.info,
            };
        default:
            return {
                color: colors.textSecondary,
                bgColor: 'rgba(160, 160, 176, 0.1)',
                borderColor: colors.border,
            };
    }
};

const getRarityIcon = (rarity: SkillRarity): string => {
    switch (rarity) {
        case 'legendary':
            return '✨';
        case 'epic':
            return '💜';
        case 'rare':
            return '💙';
        default:
            return '⚪';
    }
};

export default function SkillBadge({
    name,
    icon,
    rarity = 'common',
    level = 1,
    isLocked = false,
    onPress,
}: SkillBadgeProps) {
    const rarityStyles = getRarityStyles(rarity);
    const displayIcon = icon || getRarityIcon(rarity);

    if (isLocked) {
        return (
            <View style={styles.lockedContainer}>
                <Text style={styles.lockedIcon}>🔒</Text>
                <Text style={styles.lockedText}>???</Text>
            </View>
        );
    }

    return (
        <TouchableOpacity
            style={[
                styles.container,
                {
                    backgroundColor: rarityStyles.bgColor,
                    borderColor: rarityStyles.borderColor,
                },
            ]}
            onPress={onPress}
            activeOpacity={0.7}
            disabled={!onPress}
        >
            <View style={styles.iconContainer}>
                <Text style={styles.icon}>{displayIcon}</Text>
            </View>
            <View style={styles.content}>
                <Text style={[styles.name, { color: rarityStyles.color }]} numberOfLines={1}>
                    {name}
                </Text>
                {level > 1 && (
                    <View style={[styles.levelBadge, { backgroundColor: rarityStyles.color }]}>
                        <Text style={styles.levelText}>Lv.{level}</Text>
                    </View>
                )}
            </View>
            {rarity !== 'common' && (
                <View style={styles.shimmer} />
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.round,
        borderWidth: 1,
        marginRight: spacing.sm,
        marginBottom: spacing.sm,
        overflow: 'hidden',
        ...shadows.sm,
    },
    lockedContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.round,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.backgroundLight,
        marginRight: spacing.sm,
        marginBottom: spacing.sm,
        opacity: 0.5,
    },
    lockedIcon: {
        fontSize: fontSizes.md,
        marginRight: spacing.xs,
    },
    lockedText: {
        fontSize: fontSizes.sm,
        color: colors.textMuted,
    },
    iconContainer: {
        marginRight: spacing.xs,
    },
    icon: {
        fontSize: fontSizes.lg,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    name: {
        fontSize: fontSizes.sm,
        fontWeight: fontWeights.semibold,
    },
    levelBadge: {
        marginLeft: spacing.xs,
        paddingHorizontal: spacing.xs,
        paddingVertical: 1,
        borderRadius: borderRadius.sm,
    },
    levelText: {
        fontSize: fontSizes.xs,
        fontWeight: fontWeights.bold,
        color: colors.background,
    },
    shimmer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
});
