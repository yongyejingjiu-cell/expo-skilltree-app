/**
 * QuestBoardScreen - クエストボード専用画面
 * メインクエスト＆サブクエストの一覧・完了処理
 */

import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Alert,
    RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, MainTabParamList, UserProgress, Quest, Course, DailyQuestBoard } from '../types';
import { colors, spacing, borderRadius, fontSizes, fontWeights, shadows } from '../theme';
import { loadUserProgress, completeQuest } from '../storage';
import { getCourseById, generateCourseQuestBoard } from '../data/courses';
import { generateDailyQuestBoard } from '../data/quests';
import { hapticFeedback } from '../utils/haptics';
import { useTheme } from '../context/ThemeContext';
import { ThemedBackground } from '../components';

type Props = CompositeScreenProps<
    BottomTabScreenProps<MainTabParamList, 'QuestsTab'>,
    NativeStackScreenProps<RootStackParamList>
>;

// クエスト完了判定
const isQuestCompleted = (questId: string, completedIds: string[]): boolean => {
    return completedIds.includes(questId);
};

export default function QuestBoardScreen({ navigation }: Props) {
    const insets = useSafeAreaInsets();
    const { theme } = useTheme();
    const { colors: themeColors } = theme;
    const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    // データ読み込み
    const loadData = useCallback(async () => {
        try {
            const progress = await loadUserProgress();
            setUserProgress(progress);
        } catch (error) {
            console.error('Failed to load data:', error);
        }
    }, []);

    // フォーカス時に再読み込み
    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [loadData])
    );

    // 下に引っ張って更新
    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    }, [loadData]);

    // クエスト完了処理
    const handleCompleteQuest = async (quest: Quest) => {
        if (!userProgress) return;

        if (isQuestCompleted(quest.id, userProgress.todayCompletedQuestIds)) {
            Alert.alert('完了済み', 'このクエストは今日すでに完了しています！');
            return;
        }

        Alert.alert(
            '🎉 クエスト完了！',
            `${quest.title}を達成しますか？\n+${quest.xpReward} XP獲得！`,
            [
                { text: 'キャンセル', style: 'cancel' },
                {
                    text: '完了！',
                    onPress: async () => {
                        try {
                            const updatedProgress = await completeQuest(quest.id, quest.xpReward);
                            setUserProgress(updatedProgress);

                            // 触覚フィードバック
                            hapticFeedback.success();

                            Alert.alert(
                                '🌟 XP獲得！',
                                `+${quest.xpReward} XP\n総XP: ${updatedProgress.totalXP}`,
                            );
                        } catch (error) {
                            console.error('Failed to complete quest:', error);
                        }
                    },
                },
            ]
        );
    };

    // コース選択画面へ遷移
    const handleGotoCourseSelect = () => {
        navigation.navigate('CourseSelect');
    };

    // ローディング中
    if (!userProgress) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    // 選択中のコース情報を取得
    const currentCourse: Course | undefined = userProgress.selectedCourseId
        ? getCourseById(userProgress.selectedCourseId)
        : undefined;

    // クエストボードを生成
    const questBoard: DailyQuestBoard = currentCourse
        ? generateCourseQuestBoard(currentCourse.id)
        : generateDailyQuestBoard(userProgress.selectedTrackId);

    // 今日の完了数
    const completedCount = userProgress.todayCompletedQuestIds.length;
    const totalQuests = 1 + (questBoard.subQuests?.length || 0);

    return (
        <ThemedBackground style={styles.container}>
            <StatusBar barStyle={theme.type === 'day' ? "dark-content" : "light-content"} backgroundColor="transparent" translucent />
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={themeColors.primary}
                        colors={[themeColors.primary]}
                    />
                }
            >
                {/* ヘッダー */}
                <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
                    <Text style={styles.headerIcon}>⚔️</Text>
                    <View style={styles.headerInfo}>
                        <Text style={[styles.headerTitle, { color: themeColors.textPrimary }]}>クエストボード</Text>
                        <Text style={[styles.headerSub, { color: themeColors.textSecondary }]}>
                            {currentCourse ? currentCourse.name : 'コース未選択'}
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={[styles.courseChangeButton, { backgroundColor: themeColors.primary }]}
                        onPress={handleGotoCourseSelect}
                        activeOpacity={0.7}
                    >
                        <Text style={[styles.courseChangeText, { color: '#FFFFFF' }]}>
                            {currentCourse ? '変更' : '選択'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* 今日の進捗バー */}
                <View style={styles.progressSection}>
                    <View style={[styles.progressCard, { backgroundColor: themeColors.backgroundCard, borderColor: themeColors.border }]}>
                        <View style={styles.progressHeader}>
                            <Text style={[styles.progressTitle, { color: themeColors.textPrimary }]}>📊 今日の達成状況</Text>
                            <Text style={[styles.progressCount, { color: themeColors.accent }]}>
                                {completedCount}/{totalQuests}
                            </Text>
                        </View>
                        <View style={[styles.progressBarBg, { backgroundColor: theme.type === 'day' ? '#DFE6E9' : '#16213E' }]}>
                            <View
                                style={[
                                    styles.progressBarFill,
                                    {
                                        width: `${Math.min((completedCount / totalQuests) * 100, 100)}%`,
                                        backgroundColor: themeColors.accent
                                    },
                                ]}
                            />
                        </View>
                    </View>
                </View>

                {/* メインクエスト */}
                {questBoard.mainQuest && (
                    <View style={styles.questSection}>
                        <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>⚔️ 今日のメインクエスト</Text>
                        <TouchableOpacity
                            style={[
                                styles.mainQuestCard,
                                { backgroundColor: themeColors.backgroundCard, borderColor: themeColors.accent },
                                isQuestCompleted(questBoard.mainQuest.id, userProgress.todayCompletedQuestIds) &&
                                [styles.questCompleted, { borderColor: themeColors.success }],
                            ]}
                            onPress={() => handleCompleteQuest(questBoard.mainQuest)}
                            activeOpacity={0.8}
                        >
                            <View style={[styles.questIconContainer, { backgroundColor: theme.type === 'day' ? '#F0F4F8' : '#16213E' }]}>
                                <Text style={styles.questIcon}>{questBoard.mainQuest.icon}</Text>
                            </View>
                            <View style={styles.questContent}>
                                <View style={styles.questHeader}>
                                    <Text style={[styles.mainQuestTitle, { color: themeColors.textPrimary }]}>
                                        {questBoard.mainQuest.title}
                                    </Text>
                                    {isQuestCompleted(questBoard.mainQuest.id, userProgress.todayCompletedQuestIds) && (
                                        <View style={[styles.completedBadge, { backgroundColor: themeColors.success }]}>
                                            <Text style={[styles.completedText, { color: '#FFFFFF' }]}>✓ 完了</Text>
                                        </View>
                                    )}
                                </View>
                                <Text style={[styles.questDescription, { color: themeColors.textSecondary }]}>
                                    {questBoard.mainQuest.description}
                                </Text>
                                <View style={[styles.questReward, { backgroundColor: themeColors.xp + '20' }]}>
                                    <Text style={[styles.rewardText, { color: themeColors.xp }]}>
                                        ⭐ +{questBoard.mainQuest.xpReward} XP
                                    </Text>
                                </View>
                            </View>
                            <View style={[styles.mainQuestAccent, { backgroundColor: themeColors.accent }]} />
                        </TouchableOpacity>
                    </View>
                )}

                {/* サブクエスト */}
                {questBoard.subQuests && questBoard.subQuests.length > 0 && (
                    <View style={styles.questSection}>
                        <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>📋 サブクエスト</Text>
                        {questBoard.subQuests.map((quest) => {
                            const isCompleted = isQuestCompleted(quest.id, userProgress.todayCompletedQuestIds);
                            return (
                                <TouchableOpacity
                                    key={quest.id}
                                    style={[
                                        styles.subQuestCard,
                                        { backgroundColor: themeColors.backgroundCard, borderColor: themeColors.border },
                                        isCompleted && [styles.questCompleted, { borderColor: themeColors.success }]
                                    ]}
                                    onPress={() => handleCompleteQuest(quest)}
                                    activeOpacity={0.8}
                                >
                                    <View style={[styles.subQuestIconContainer, { backgroundColor: theme.type === 'day' ? '#F0F4F8' : '#16213E' }]}>
                                        <Text style={styles.subQuestIcon}>{quest.icon}</Text>
                                    </View>
                                    <View style={styles.subQuestContent}>
                                        <Text style={[styles.subQuestTitle, { color: themeColors.textPrimary }]}>{quest.title}</Text>
                                        <Text style={[styles.subQuestDesc, { color: themeColors.textSecondary }]}>{quest.description}</Text>
                                    </View>
                                    <View style={styles.subQuestReward}>
                                        {isCompleted ? (
                                            <Text style={[styles.subQuestCheck, { color: themeColors.success }]}>✓</Text>
                                        ) : (
                                            <Text style={[styles.subQuestXP, { color: themeColors.xp }]}>+{quest.xpReward}</Text>
                                        )}
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                )}

                {/* 今日の獲得XP */}
                <View style={styles.summarySection}>
                    <View style={[styles.summaryCard, { backgroundColor: themeColors.backgroundCard, borderColor: themeColors.border }]}>
                        <Text style={[styles.summaryTitle, { color: themeColors.textPrimary }]}>⭐ 今日の獲得XP</Text>
                        <Text style={[styles.summaryXP, { color: themeColors.xp }]}>
                            {userProgress.questLogs
                                .filter(log => log.completedAt.startsWith(questBoard.date))
                                .reduce((acc, log) => acc + log.xpEarned, 0)} XP
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </ThemedBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: colors.textMuted,
        fontSize: fontSizes.lg,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: spacing.xxl,
    },
    // ヘッダー
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.lg,
    },
    headerIcon: {
        fontSize: 32,
        marginRight: spacing.md,
    },
    headerInfo: {
        flex: 1,
    },
    headerTitle: {
        fontSize: fontSizes.xl,
        fontWeight: fontWeights.bold,
        color: colors.textPrimary,
    },
    headerSub: {
        fontSize: fontSizes.sm,
        color: colors.textMuted,
        marginTop: 2,
    },
    courseChangeButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.md,
    },
    courseChangeText: {
        fontSize: fontSizes.sm,
        color: colors.textPrimary,
        fontWeight: fontWeights.bold,
    },
    // 進捗バー
    progressSection: {
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.lg,
    },
    progressCard: {
        backgroundColor: colors.backgroundCard,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
        ...shadows.sm,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    progressTitle: {
        fontSize: fontSizes.md,
        fontWeight: fontWeights.semibold,
        color: colors.textPrimary,
    },
    progressCount: {
        fontSize: fontSizes.md,
        fontWeight: fontWeights.bold,
        color: colors.accent,
    },
    progressBarBg: {
        height: 8,
        backgroundColor: colors.backgroundLight,
        borderRadius: borderRadius.round,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: colors.accent,
        borderRadius: borderRadius.round,
    },
    // クエストセクション
    questSection: {
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.lg,
    },
    sectionTitle: {
        fontSize: fontSizes.lg,
        fontWeight: fontWeights.bold,
        color: colors.textPrimary,
        marginBottom: spacing.md,
    },
    mainQuestCard: {
        backgroundColor: colors.backgroundCard,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.accent,
        overflow: 'hidden',
        ...shadows.md,
    },
    questCompleted: {
        opacity: 0.6,
        borderColor: colors.success,
    },
    questIconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: colors.backgroundLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    questIcon: {
        fontSize: 28,
    },
    questContent: {
        flex: 1,
    },
    questHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.xs,
    },
    mainQuestTitle: {
        fontSize: fontSizes.lg,
        fontWeight: fontWeights.bold,
        color: colors.textPrimary,
        flex: 1,
    },
    completedBadge: {
        backgroundColor: colors.success,
        paddingHorizontal: spacing.sm,
        paddingVertical: 2,
        borderRadius: borderRadius.sm,
    },
    completedText: {
        fontSize: fontSizes.xs,
        color: colors.background,
        fontWeight: fontWeights.bold,
    },
    questDescription: {
        fontSize: fontSizes.sm,
        color: colors.textSecondary,
        marginBottom: spacing.sm,
    },
    questReward: {
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(241, 196, 15, 0.15)',
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.round,
    },
    rewardText: {
        fontSize: fontSizes.sm,
        fontWeight: fontWeights.bold,
        color: colors.xp,
    },
    mainQuestAccent: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 4,
        backgroundColor: colors.accent,
    },
    // サブクエスト
    subQuestCard: {
        backgroundColor: colors.backgroundCard,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.sm,
        borderWidth: 1,
        borderColor: colors.border,
        ...shadows.sm,
    },
    subQuestIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.backgroundLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    subQuestIcon: {
        fontSize: 18,
    },
    subQuestContent: {
        flex: 1,
    },
    subQuestTitle: {
        fontSize: fontSizes.md,
        fontWeight: fontWeights.semibold,
        color: colors.textPrimary,
    },
    subQuestDesc: {
        fontSize: fontSizes.xs,
        color: colors.textMuted,
    },
    subQuestReward: {
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 40,
    },
    subQuestCheck: {
        fontSize: fontSizes.xl,
        color: colors.success,
        fontWeight: fontWeights.bold,
    },
    subQuestXP: {
        fontSize: fontSizes.sm,
        fontWeight: fontWeights.bold,
        color: colors.xp,
    },
    // サマリー
    summarySection: {
        paddingHorizontal: spacing.lg,
    },
    summaryCard: {
        backgroundColor: colors.backgroundCard,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: 'center',
        ...shadows.sm,
    },
    summaryTitle: {
        fontSize: fontSizes.md,
        fontWeight: fontWeights.bold,
        color: colors.textPrimary,
        marginBottom: spacing.sm,
    },
    summaryXP: {
        fontSize: fontSizes.title,
        fontWeight: fontWeights.extrabold,
        color: colors.xp,
    },
});
