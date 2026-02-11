/**
 * XPBar コンポーネント
 * 経験値バーをRPG風に表示
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, Easing } from 'react-native-reanimated';
import { colors, spacing, borderRadius, fontSizes, fontWeights, shadows } from '../theme';

interface XPBarProps {
    currentXP: number;
    maxXP: number;
    level: number;
    showLabel?: boolean;
}

export default function XPBar({ currentXP, maxXP, level, showLabel = true }: XPBarProps) {
    // 進捗率（0-100）
    const targetProgress = Math.min((currentXP / maxXP) * 100, 100);

    // アニメーション用の共有値
    const progress = useSharedValue(0);
    const levelScale = useSharedValue(1);

    // プログレスバーのアニメーション
    useEffect(() => {
        // バーの伸びを少し遅延させて、画面遷移後の「伸びる感」を出す
        progress.value = withTiming(targetProgress, {
            duration: 1000,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        });
    }, [targetProgress]);

    // レベルアップ時の強調アニメーション（レベルが変わったとき）
    useEffect(() => {
        levelScale.value = withSpring(1.2, { damping: 10, stiffness: 100 }, () => {
            levelScale.value = withSpring(1);
        });
    }, [level]);

    const animatedBarStyle = useAnimatedStyle(() => {
        return {
            width: `${progress.value}%`,
        };
    });

    const animatedLevelStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: levelScale.value }],
        };
    });

    return (
        <View style={styles.container}>
            {showLabel && (
                <View style={styles.labelRow}>
                    <Animated.View style={[styles.levelBadge, animatedLevelStyle]}>
                        <Text style={styles.levelText}>Lv.{level}</Text>
                    </Animated.View>
                    <Text style={styles.xpText}>
                        {currentXP} / {maxXP} XP
                    </Text>
                </View>
            )}
            <View style={styles.barContainer}>
                <View style={styles.barBackground}>
                    <Animated.View style={[styles.barFill, animatedBarStyle]}>
                        <View style={styles.barShine} />
                    </Animated.View>
                </View>
                {/* 装飾用の端っこ */}
                <View style={styles.barCapLeft} />
                <View style={styles.barCapRight} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.xs,
    },
    levelBadge: {
        backgroundColor: colors.accent,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.sm,
        ...shadows.sm,
    },
    levelText: {
        color: colors.background,
        fontSize: fontSizes.sm,
        fontWeight: fontWeights.bold,
    },
    xpText: {
        color: colors.textSecondary,
        fontSize: fontSizes.sm,
    },
    barContainer: {
        position: 'relative',
        height: 20,
    },
    barBackground: {
        height: 16,
        backgroundColor: colors.backgroundLight,
        borderRadius: borderRadius.round,
        borderWidth: 2,
        borderColor: colors.border,
        overflow: 'hidden',
        marginTop: 2,
    },
    barFill: {
        height: '100%',
        backgroundColor: colors.xp,
        borderRadius: borderRadius.round,
        position: 'relative',
        overflow: 'hidden',
    },
    barShine: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '40%',
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderTopLeftRadius: borderRadius.round,
        borderTopRightRadius: borderRadius.round,
    },
    barCapLeft: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: 8,
        height: 20,
        backgroundColor: colors.accent,
        borderRadius: borderRadius.sm,
        ...shadows.sm,
    },
    barCapRight: {
        position: 'absolute',
        right: 0,
        top: 0,
        width: 8,
        height: 20,
        backgroundColor: colors.accent,
        borderRadius: borderRadius.sm,
        ...shadows.sm,
    },
});
