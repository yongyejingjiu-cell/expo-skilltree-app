/**
 * QuestCard コンポーネント
 * クエスト（学習トピック）をRPG風カードで表示
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, borderRadius, fontSizes, fontWeights, shadows } from '../theme';

type QuestDifficulty = 'easy' | 'normal' | 'hard' | 'legendary';
type QuestStatus = 'available' | 'in_progress' | 'completed';

interface QuestCardProps {
    title: string;
    description: string;
    difficulty?: QuestDifficulty;
    status?: QuestStatus;
    xpReward?: number;
    onPress?: () => void;
}

const getDifficultyColor = (difficulty: QuestDifficulty): string => {
    switch (difficulty) {
        case 'easy':
            return colors.success;
        case 'normal':
            return colors.info;
        case 'hard':
            return colors.warning;
        case 'legendary':
            return colors.accent;
        default:
            return colors.textMuted;
    }
};

const getDifficultyLabel = (difficulty: QuestDifficulty): string => {
    switch (difficulty) {
        case 'easy':
            return '★ 初級';
        case 'normal':
            return '★★ 中級';
        case 'hard':
            return '★★★ 上級';
        case 'legendary':
            return '★★★★ 伝説';
        default:
            return '';
    }
};

const getStatusBadge = (status: QuestStatus): { label: string; color: string; bg: string } => {
    switch (status) {
        case 'completed':
            return { label: '✓ 完了', color: colors.success, bg: 'rgba(0, 184, 148, 0.2)' };
        case 'in_progress':
            return { label: '▶ 進行中', color: colors.warning, bg: 'rgba(253, 203, 110, 0.2)' };
        default:
            return { label: '🔓 挑戦可能', color: colors.textMuted, bg: 'rgba(160, 160, 176, 0.1)' };
    }
};

export default function QuestCard({
    title,
    description,
    difficulty = 'normal',
    status = 'available',
    xpReward = 100,
    onPress,
}: QuestCardProps) {
    const difficultyColor = getDifficultyColor(difficulty);
    const statusInfo = getStatusBadge(status);

    return (
        <TouchableOpacity
            style={[
                styles.container,
                status === 'completed' && styles.completedContainer,
            ]}
            onPress={onPress}
            activeOpacity={0.8}
        >
            {/* ステータスバッジ */}
            <View style={[styles.statusBadge, { backgroundColor: statusInfo.bg }]}>
                <Text style={[styles.statusText, { color: statusInfo.color }]}>
                    {statusInfo.label}
                </Text>
            </View>

            {/* メインコンテンツ */}
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>{title}</Text>
                    <View style={[styles.difficultyBadge, { borderColor: difficultyColor }]}>
                        <Text style={[styles.difficultyText, { color: difficultyColor }]}>
                            {getDifficultyLabel(difficulty)}
                        </Text>
                    </View>
                </View>
                <Text style={styles.description} numberOfLines={2}>
                    {description}
                </Text>
            </View>

            {/* XP報酬 */}
            <View style={styles.footer}>
                <View style={styles.rewardContainer}>
                    <Text style={styles.rewardIcon}>⭐</Text>
                    <Text style={styles.rewardText}>+{xpReward} XP</Text>
                </View>
                <View style={styles.arrowContainer}>
                    <Text style={styles.arrow}>→</Text>
                </View>
            </View>

            {/* 装飾用のアクセントライン */}
            <View style={[styles.accentLine, { backgroundColor: difficultyColor }]} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.backgroundCard,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        overflow: 'hidden',
        marginBottom: spacing.md,
        ...shadows.md,
    },
    completedContainer: {
        opacity: 0.7,
    },
    statusBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderBottomRightRadius: borderRadius.md,
    },
    statusText: {
        fontSize: fontSizes.xs,
        fontWeight: fontWeights.semibold,
    },
    content: {
        padding: spacing.md,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: spacing.sm,
    },
    title: {
        flex: 1,
        fontSize: fontSizes.lg,
        fontWeight: fontWeights.bold,
        color: colors.textPrimary,
        marginRight: spacing.sm,
    },
    difficultyBadge: {
        borderWidth: 1,
        borderRadius: borderRadius.sm,
        paddingHorizontal: spacing.xs,
        paddingVertical: 2,
    },
    difficultyText: {
        fontSize: fontSizes.xs,
        fontWeight: fontWeights.medium,
    },
    description: {
        fontSize: fontSizes.md,
        color: colors.textSecondary,
        lineHeight: 20,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingBottom: spacing.md,
    },
    rewardContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(241, 196, 15, 0.1)',
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.round,
    },
    rewardIcon: {
        fontSize: fontSizes.md,
        marginRight: spacing.xs,
    },
    rewardText: {
        fontSize: fontSizes.sm,
        fontWeight: fontWeights.bold,
        color: colors.xp,
    },
    arrowContainer: {
        width: 32,
        height: 32,
        borderRadius: borderRadius.round,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        ...shadows.sm,
    },
    arrow: {
        color: colors.textPrimary,
        fontSize: fontSizes.lg,
        fontWeight: fontWeights.bold,
    },
    accentLine: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 4,
    },
});
