/**
 * WeaknessListScreen - 弱点リスト画面 (Phase4)
 * 登録された弱点の一覧表示と「克服済み」切り替え
 */

import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    StatusBar,
    Alert,
    ListRenderItem,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { RootStackParamList, WeaknessEntry } from '../types';
import { colors, spacing, borderRadius, fontSizes, fontWeights, shadows } from '../theme';
import { loadWeaknesses, resolveWeakness } from '../storage';
import { getCourseById } from '../data/courses';
import { useTheme } from '../context/ThemeContext';
import { ThemedBackground } from '../components';

type Props = NativeStackScreenProps<RootStackParamList, 'WeaknessList'>;

export default function WeaknessListScreen({ navigation }: Props) {
    const insets = useSafeAreaInsets();
    const { theme } = useTheme();
    const { colors: themeColors } = theme;
    const [weaknesses, setWeaknesses] = useState<WeaknessEntry[]>([]);
    const [showResolved, setShowResolved] = useState(false);

    useFocusEffect(
        useCallback(() => {
            const load = async () => {
                const data = await loadWeaknesses();
                setWeaknesses(data);
            };
            load();
        }, [])
    );

    const unresolvedCount = weaknesses.filter(w => !w.resolved).length;
    const resolvedCount = weaknesses.filter(w => w.resolved).length;

    const displayedWeaknesses = showResolved
        ? weaknesses.filter(w => w.resolved)
        : weaknesses.filter(w => !w.resolved);

    const handleResolve = (weakness: WeaknessEntry) => {
        if (weakness.resolved) return;
        Alert.alert(
            '🎉 克服！',
            `「${weakness.title}」を克服済みにしますか？`,
            [
                { text: 'キャンセル', style: 'cancel' },
                {
                    text: '克服した！',
                    onPress: async () => {
                        try {
                            const updated = await resolveWeakness(weakness.id);
                            setWeaknesses(updated);
                            Alert.alert('💪 素晴らしい！', '弱点をひとつ克服しました！');
                        } catch (error) {
                            console.error('Failed to resolve weakness:', error);
                        }
                    },
                },
            ]
        );
    };

    const renderItem: ListRenderItem<WeaknessEntry> = ({ item }) => {
        const course = item.courseId ? getCourseById(item.courseId) : null;
        const date = new Date(item.createdAt).toLocaleDateString('ja-JP', {
            month: 'short',
            day: 'numeric',
        });

        return (
            <View style={[
                styles.card,
                { backgroundColor: themeColors.backgroundCard, borderColor: item.resolved ? themeColors.success : themeColors.error },
                item.resolved && styles.cardResolved,
            ]}>
                {/* ヘッダー */}
                <View style={styles.cardHeader}>
                    <Text style={styles.cardIcon}>{item.resolved ? '✅' : '⚡'}</Text>
                    <Text style={[
                        styles.cardTitle,
                        { color: themeColors.textPrimary },
                        item.resolved && styles.cardTitleResolved,
                    ]}>{item.title}</Text>
                    <Text style={[styles.cardDate, { color: themeColors.textSecondary }]}>{date}</Text>
                </View>

                {/* 説明 */}
                {item.description ? (
                    <Text style={[styles.cardDesc, { color: themeColors.textSecondary }]} numberOfLines={3}>{item.description}</Text>
                ) : null}

                {/* メタ */}
                <View style={styles.cardMeta}>
                    {course && (
                        <View style={[styles.courseBadge, { backgroundColor: course.color + '15', borderColor: course.color }]}>
                            <Text style={[styles.courseBadgeText, { color: course.color }]}>
                                {course.icon} {course.shortName}
                            </Text>
                        </View>
                    )}
                    {item.tags.map(tag => (
                        <View key={tag} style={[styles.tagBadge, { backgroundColor: theme.type === 'day' ? '#E8EEF4' : '#1A2A48', borderColor: themeColors.border }]}>
                            <Text style={[styles.tagBadgeText, { color: themeColors.primary }]}>#{tag}</Text>
                        </View>
                    ))}
                </View>

                {/* 克服ボタン */}
                {!item.resolved && (
                    <TouchableOpacity
                        style={[styles.resolveButton, { borderTopColor: themeColors.border, backgroundColor: themeColors.success + '10' }]}
                        onPress={() => handleResolve(item)}
                        activeOpacity={0.7}
                    >
                        <Text style={[styles.resolveButtonText, { color: themeColors.success }]}>💪 克服した！</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    return (
        <ThemedBackground style={styles.container}>
            <StatusBar barStyle={theme.type === 'day' ? "dark-content" : "light-content"} backgroundColor="transparent" translucent />

            {/* ヘッダー */}
            <View style={[styles.header, { paddingTop: insets.top + spacing.sm, borderBottomColor: themeColors.border }]}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={[styles.backText, { color: themeColors.primary }]}>← 戻る</Text>
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: themeColors.textPrimary }]}>⚡ 弱点リスト</Text>
                <View style={styles.headerSpacer} />
            </View>

            {/* 統計バー */}
            <View style={[styles.statsBar, { backgroundColor: theme.type === 'day' ? '#F8F9FA' : '#16213E' }]}>
                <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: themeColors.error }]}>{unresolvedCount}</Text>
                    <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>未克服</Text>
                </View>
                <View style={[styles.statDivider, { backgroundColor: themeColors.border }]} />
                <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: themeColors.success }]}>{resolvedCount}</Text>
                    <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>克服済み</Text>
                </View>
            </View>

            {/* タブ切り替え */}
            <View style={[styles.tabRow, { borderBottomColor: themeColors.border }]}>
                <TouchableOpacity
                    style={[styles.tab, !showResolved && [styles.tabActive, { borderBottomColor: themeColors.primary }]]}
                    onPress={() => setShowResolved(false)}
                >
                    <Text style={[styles.tabText, { color: themeColors.textSecondary }, !showResolved && [styles.tabTextActive, { color: themeColors.primary }]]}>
                        ⚡ 未克服 ({unresolvedCount})
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, showResolved && [styles.tabActive, { borderBottomColor: themeColors.primary }]]}
                    onPress={() => setShowResolved(true)}
                >
                    <Text style={[styles.tabText, { color: themeColors.textSecondary }, showResolved && [styles.tabTextActive, { color: themeColors.primary }]]}>
                        ✅ 克服済み ({resolvedCount})
                    </Text>
                </TouchableOpacity>
            </View>

            {/* リスト */}
            <FlatList
                data={displayedWeaknesses}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={[styles.list, { paddingBottom: spacing.xxl + insets.bottom }]}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyIcon}>
                            {showResolved ? '🏆' : '🌟'}
                        </Text>
                        <Text style={[styles.emptyText, { color: themeColors.textSecondary }]}>
                            {showResolved
                                ? 'まだ克服した弱点はありません\n弱点を克服していきましょう！'
                                : weaknesses.length === 0
                                    ? '弱点はまだ登録されていません\n冒険ログから追加できます'
                                    : 'すべての弱点を克服しました！\nすばらしい！🎉'}
                        </Text>
                    </View>
                }
            />
        </ThemedBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    backButton: {
        paddingVertical: spacing.xs,
        paddingRight: spacing.md,
    },
    backText: {
        color: colors.primary,
        fontSize: fontSizes.md,
        fontWeight: fontWeights.medium,
    },
    headerTitle: {
        fontSize: fontSizes.xl,
        fontWeight: fontWeights.bold,
        color: colors.textPrimary,
    },
    headerSpacer: {
        width: 60,
    },
    statsBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.md,
        backgroundColor: colors.backgroundLight,
    },
    statItem: {
        alignItems: 'center',
        paddingHorizontal: spacing.xl,
    },
    statValue: {
        fontSize: fontSizes.title,
        fontWeight: fontWeights.bold,
        color: colors.error,
    },
    statLabel: {
        fontSize: fontSizes.xs,
        color: colors.textMuted,
        marginTop: 2,
    },
    statDivider: {
        width: 1,
        height: 30,
        backgroundColor: colors.border,
    },
    tabRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: spacing.sm,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    tabActive: {
        borderBottomColor: colors.primary,
    },
    tabText: {
        fontSize: fontSizes.sm,
        color: colors.textMuted,
        fontWeight: fontWeights.medium,
    },
    tabTextActive: {
        color: colors.primary,
        fontWeight: fontWeights.bold,
    },
    list: {
        padding: spacing.md,
        paddingBottom: spacing.xxl,
    },
    card: {
        backgroundColor: colors.backgroundCard,
        borderRadius: borderRadius.lg,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: colors.error,
        borderLeftWidth: 4,
        overflow: 'hidden',
        ...shadows.sm,
    },
    cardResolved: {
        borderColor: colors.success,
        opacity: 0.7,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        paddingBottom: spacing.xs,
    },
    cardIcon: {
        fontSize: 18,
        marginRight: spacing.sm,
    },
    cardTitle: {
        flex: 1,
        fontSize: fontSizes.md,
        fontWeight: fontWeights.bold,
        color: colors.textPrimary,
    },
    cardTitleResolved: {
        textDecorationLine: 'line-through',
        color: colors.textMuted,
    },
    cardDate: {
        fontSize: fontSizes.xs,
        color: colors.textMuted,
    },
    cardDesc: {
        fontSize: fontSizes.sm,
        color: colors.textSecondary,
        paddingHorizontal: spacing.md,
        paddingBottom: spacing.sm,
        lineHeight: 20,
    },
    cardMeta: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: spacing.md,
        paddingBottom: spacing.sm,
    },
    courseBadge: {
        paddingHorizontal: spacing.sm,
        paddingVertical: 2,
        borderRadius: borderRadius.round,
        borderWidth: 1,
        marginRight: spacing.xs,
        marginBottom: spacing.xs,
    },
    courseBadgeText: {
        fontSize: fontSizes.xs,
        fontWeight: fontWeights.medium,
    },
    tagBadge: {
        backgroundColor: 'rgba(108, 92, 231, 0.15)',
        paddingHorizontal: spacing.sm,
        paddingVertical: 2,
        borderRadius: borderRadius.round,
        marginRight: spacing.xs,
        marginBottom: spacing.xs,
    },
    tagBadgeText: {
        fontSize: fontSizes.xs,
        color: colors.primary,
    },
    resolveButton: {
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingVertical: spacing.sm,
        alignItems: 'center',
        backgroundColor: 'rgba(0, 184, 148, 0.05)',
    },
    resolveButtonText: {
        fontSize: fontSizes.sm,
        color: colors.success,
        fontWeight: fontWeights.bold,
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: spacing.xxl,
    },
    emptyIcon: {
        fontSize: 48,
        marginBottom: spacing.md,
    },
    emptyText: {
        fontSize: fontSizes.md,
        color: colors.textMuted,
        textAlign: 'center',
        lineHeight: 22,
    },
});
