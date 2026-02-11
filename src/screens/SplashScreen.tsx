/**
 * SplashScreen コンポーネント
 * アプリ起動時の1.2秒間表示されるスプラッシュ画面
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { colors, fontSizes, fontWeights, spacing } from '../theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface SplashScreenProps {
    onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const glowAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // フェードイン & スケールアニメーション
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }),
        ]).start();

        // グローのパルスアニメーション
        Animated.loop(
            Animated.sequence([
                Animated.timing(glowAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(glowAnim, {
                    toValue: 0.5,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // 1.2秒後にコールバック実行
        const timer = setTimeout(() => {
            // フェードアウト
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start(() => {
                onFinish();
            });
        }, 1200);

        return () => clearTimeout(timer);
    }, [fadeAnim, scaleAnim, glowAnim, onFinish]);

    return (
        <View style={styles.container}>
            {/* 背景グラデーション風のエフェクト */}
            <View style={styles.backgroundGradient} />

            {/* メインロゴエリア */}
            <Animated.View
                style={[
                    styles.logoContainer,
                    {
                        opacity: fadeAnim,
                        transform: [{ scale: scaleAnim }],
                    },
                ]}
            >
                {/* グローエフェクト */}
                <Animated.View
                    style={[
                        styles.glow,
                        { opacity: glowAnim },
                    ]}
                />

                {/* アイコン */}
                <View style={styles.iconContainer}>
                    <Text style={styles.icon}>🎓</Text>
                </View>

                {/* タイトル */}
                <Text style={styles.title}>IT学習クエスト</Text>
                <Text style={styles.subtitle}>~ レベルアップの旅へ ~</Text>

                {/* デコレーション */}
                <View style={styles.decorationLine}>
                    <View style={styles.lineLeft} />
                    <Text style={styles.diamond}>◆</Text>
                    <View style={styles.lineRight} />
                </View>
            </Animated.View>

            {/* ローディングインジケーター */}
            <Animated.View style={[styles.loadingContainer, { opacity: fadeAnim }]}>
                <View style={styles.loadingDots}>
                    <View style={[styles.dot, styles.dot1]} />
                    <View style={[styles.dot, styles.dot2]} />
                    <View style={[styles.dot, styles.dot3]} />
                </View>
                <Text style={styles.loadingText}>Now Loading...</Text>
            </Animated.View>

            {/* バージョン表記 */}
            <Animated.Text style={[styles.version, { opacity: fadeAnim }]}>
                Ver 1.0.0
            </Animated.Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backgroundGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: colors.background,
        // グラデーション風のアクセント
    },
    logoContainer: {
        alignItems: 'center',
        position: 'relative',
    },
    glow: {
        position: 'absolute',
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: colors.primary,
        opacity: 0.3,
        top: -50,
    },
    iconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: colors.backgroundCard,
        borderWidth: 3,
        borderColor: colors.accent,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.lg,
        shadowColor: colors.accent,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 15,
        elevation: 10,
    },
    icon: {
        fontSize: 48,
    },
    title: {
        fontSize: fontSizes.hero,
        fontWeight: fontWeights.extrabold,
        color: colors.textPrimary,
        marginBottom: spacing.xs,
        textShadowColor: colors.primary,
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    },
    subtitle: {
        fontSize: fontSizes.lg,
        color: colors.accent,
        fontWeight: fontWeights.medium,
        marginBottom: spacing.xl,
    },
    decorationLine: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: spacing.md,
    },
    lineLeft: {
        width: 60,
        height: 2,
        backgroundColor: colors.primary,
        opacity: 0.5,
    },
    lineRight: {
        width: 60,
        height: 2,
        backgroundColor: colors.primary,
        opacity: 0.5,
    },
    diamond: {
        color: colors.accent,
        fontSize: fontSizes.md,
        marginHorizontal: spacing.sm,
    },
    loadingContainer: {
        position: 'absolute',
        bottom: 120,
        alignItems: 'center',
    },
    loadingDots: {
        flexDirection: 'row',
        marginBottom: spacing.sm,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.primary,
        marginHorizontal: 4,
    },
    dot1: {
        opacity: 1,
    },
    dot2: {
        opacity: 0.6,
    },
    dot3: {
        opacity: 0.3,
    },
    loadingText: {
        fontSize: fontSizes.sm,
        color: colors.textMuted,
    },
    version: {
        position: 'absolute',
        bottom: 40,
        fontSize: fontSizes.xs,
        color: colors.textMuted,
    },
});
