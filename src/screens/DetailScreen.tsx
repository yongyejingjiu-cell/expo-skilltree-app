import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { colors, spacing, borderRadius, fontSizes, fontWeights, shadows } from '../theme';
import { useTheme } from '../context/ThemeContext';
import { ThemedBackground } from '../components';

type Props = NativeStackScreenProps<RootStackParamList, 'Detail'>;

export default function DetailScreen({ route, navigation }: Props) {
    const insets = useSafeAreaInsets();
    const { theme } = useTheme();
    const { colors: themeColors } = theme;
    const { topic } = route.params;

    return (
        <ThemedBackground style={styles.container}>
            <StatusBar barStyle={theme.type === 'day' ? "dark-content" : "light-content"} backgroundColor="transparent" translucent />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={[styles.scrollContent, { paddingBottom: spacing.xxl + insets.bottom }]}
                showsVerticalScrollIndicator={false}
            >
                {/* クエストヘッダー */}
                <View style={styles.header}>
                    <View style={[styles.iconContainer, { backgroundColor: themeColors.backgroundCard, borderColor: themeColors.accent }]}>
                        <Text style={styles.icon}>📜</Text>
                    </View>
                    <Text style={[styles.title, { color: themeColors.textPrimary }]}>{topic.title}</Text>
                    <View style={[styles.rewardBadge, { borderColor: themeColors.xp, backgroundColor: themeColors.xp + '15' }]}>
                        <Text style={[styles.rewardText, { color: themeColors.xp }]}>⭐ +100 XP</Text>
                    </View>
                </View>

                {/* 装飾線 */}
                <View style={styles.divider}>
                    <View style={[styles.dividerLine, { backgroundColor: themeColors.border }]} />
                    <Text style={[styles.dividerIcon, { color: themeColors.accent }]}>◆</Text>
                    <View style={[styles.dividerLine, { backgroundColor: themeColors.border }]} />
                </View>

                {/* クエスト説明 */}
                <View style={[styles.descriptionCard, { backgroundColor: themeColors.backgroundCard, borderColor: themeColors.border }]}>
                    <Text style={[styles.descriptionLabel, { color: themeColors.accent }]}>📋 クエスト概要</Text>
                    <Text style={[styles.description, { color: themeColors.textSecondary }]}>{topic.description}</Text>
                </View>

                {/* 詳細内容 */}
                <View style={[styles.contentCard, { backgroundColor: themeColors.backgroundCard, borderColor: themeColors.border }]}>
                    <View style={[styles.contentHeader, { backgroundColor: themeColors.primary }]}>
                        <Text style={[styles.contentLabel, { color: theme.type === 'day' ? '#FFFFFF' : themeColors.textPrimary }]}>📖 知識のスクロール</Text>
                    </View>
                    <Text style={[styles.content, { color: themeColors.textSecondary }]}>{topic.content}</Text>
                </View>

                {/* 完了ボタン */}
                <TouchableOpacity style={[styles.completeButton, { backgroundColor: themeColors.success }]} activeOpacity={0.8}>
                    <Text style={[styles.completeButtonText, { color: '#FFFFFF' }]}>✓ クエスト完了！</Text>
                </TouchableOpacity>

                {/* 戻るボタン */}
                <TouchableOpacity
                    style={[styles.backButton, { backgroundColor: themeColors.backgroundCard, borderColor: themeColors.border }]}
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.7}
                >
                    <Text style={[styles.backButtonText, { color: themeColors.textSecondary }]}>← ホームに戻る</Text>
                </TouchableOpacity>
            </ScrollView>
        </ThemedBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: spacing.lg,
        paddingBottom: spacing.xxl,
    },
    header: {
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.backgroundCard,
        borderWidth: 3,
        borderColor: colors.accent,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.md,
        ...shadows.glow,
    },
    icon: {
        fontSize: 40,
    },
    title: {
        fontSize: fontSizes.title,
        fontWeight: fontWeights.bold,
        color: colors.textPrimary,
        textAlign: 'center',
        marginBottom: spacing.sm,
    },
    rewardBadge: {
        backgroundColor: 'rgba(241, 196, 15, 0.15)',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.round,
        borderWidth: 1,
        borderColor: colors.xp,
    },
    rewardText: {
        fontSize: fontSizes.sm,
        fontWeight: fontWeights.bold,
        color: colors.xp,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: colors.border,
    },
    dividerIcon: {
        fontSize: fontSizes.md,
        color: colors.accent,
        marginHorizontal: spacing.md,
    },
    descriptionCard: {
        backgroundColor: colors.backgroundCard,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
        ...shadows.sm,
    },
    descriptionLabel: {
        fontSize: fontSizes.sm,
        fontWeight: fontWeights.semibold,
        color: colors.accent,
        marginBottom: spacing.sm,
    },
    description: {
        fontSize: fontSizes.md,
        color: colors.textSecondary,
        lineHeight: 22,
    },
    contentCard: {
        backgroundColor: colors.backgroundCard,
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
        marginBottom: spacing.lg,
        borderWidth: 1,
        borderColor: colors.border,
        ...shadows.md,
    },
    contentHeader: {
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
    },
    contentLabel: {
        fontSize: fontSizes.md,
        fontWeight: fontWeights.bold,
        color: colors.textPrimary,
    },
    content: {
        fontSize: fontSizes.md,
        color: colors.textSecondary,
        lineHeight: 24,
        padding: spacing.md,
    },
    completeButton: {
        backgroundColor: colors.success,
        borderRadius: borderRadius.lg,
        paddingVertical: spacing.md,
        alignItems: 'center',
        marginBottom: spacing.md,
        ...shadows.md,
    },
    completeButtonText: {
        fontSize: fontSizes.lg,
        fontWeight: fontWeights.bold,
        color: colors.textPrimary,
    },
    backButton: {
        backgroundColor: colors.backgroundCard,
        borderRadius: borderRadius.md,
        paddingVertical: spacing.sm,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },
    backButtonText: {
        fontSize: fontSizes.md,
        color: colors.textSecondary,
    },
});
