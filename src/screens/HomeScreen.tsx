/**
 * HomeScreen - ホームダッシュボード
 * 選択中のコースや今日の概要を表示
 */

import React, { useState, useCallback, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, useFocusEffect } from '@react-navigation/native';
import { RootStackParamList, MainTabParamList, UserProgress, Course, DailyQuestBoard, SocialUser } from '../types';
import { colors, spacing, borderRadius, fontSizes, fontWeights, shadows } from '../theme';
import { XPBar, MyAvatar, ScaleButton, LevelUpModal } from '../components';
import { loadUserProgress, getLevelProgress, markLevelAsCelebrated } from '../storage';
import { getCourseById, generateCourseQuestBoard, COURSES } from '../data/courses';
import { generateDailyQuestBoard } from '../data/quests';
import { generateMockLeaderboardData } from '../data/mockSocial';
import { useTheme } from '../context/ThemeContext';
import { ThemedBackground } from '../components';

type Props = CompositeScreenProps<
    BottomTabScreenProps<MainTabParamList, 'HomeTab'>,
    NativeStackScreenProps<RootStackParamList>
>;

export default function HomeScreen({ navigation }: Props) {
    const insets = useSafeAreaInsets();
    const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [showLevelUp, setShowLevelUp] = useState(false);
    const [currentLevel, setCurrentLevel] = useState(1);
    const [myRank, setMyRank] = useState<SocialUser | null>(null);
    const [nextRivalXP, setNextRivalXP] = useState<number>(0);

    // データ読み込み
    const loadData = useCallback(async () => {
        try {
            const progress = await loadUserProgress();

            // レベルアップ判定 (未お祝いのレベルアップがあるか)
            if (progress.level > (progress.lastCelebratedLevel || 1)) {
                setShowLevelUp(true);
                setCurrentLevel(progress.level);
            }

            setUserProgress(progress);

            // リーダーボード順位を算出
            const weeklyXP = progress.questLogs
                .filter(log => {
                    const logDate = new Date(log.completedAt);
                    const oneWeekAgo = new Date();
                    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                    return logDate >= oneWeekAgo;
                })
                .reduce((sum, log) => sum + log.xpEarned, 0);
            const ranking = generateMockLeaderboardData(weeklyXP);
            const me = ranking.find(u => u.isCurrentUser) || null;
            setMyRank(me);
            // 一つ上の順位のユーザーとの差分
            if (me && me.rank > 1) {
                const above = ranking.find(u => u.rank === me.rank - 1);
                setNextRivalXP(above ? above.weeklyXP - me.weeklyXP : 0);
            } else {
                setNextRivalXP(0);
            }
        } catch (error) {
            console.error('Failed to load data:', error);
        }
    }, []);

    // 初回読み込み & フォーカス時に再読み込み
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

    const handleLevelUpClose = async () => {
        setShowLevelUp(false);
        if (currentLevel > 1) {
            await markLevelAsCelebrated(currentLevel);
            // 内部状態も更新
            if (userProgress) {
                setUserProgress({ ...userProgress, lastCelebratedLevel: currentLevel });
            }
        }
    };

    // コース選択画面へ遷移
    const handleGotoCourseSelect = () => {
        navigation.navigate('CourseSelect');
    };

    // スキル図鑑へ遷移
    const handleGotoSkillList = () => {
        navigation.navigate('SkillList');
    };

    // スキルツリーへ遷移
    const handleGotoSkillTree = () => {
        if (userProgress?.selectedCourseId) {
            navigation.navigate('SkillTree', { courseId: userProgress.selectedCourseId });
        }
    };

    // 学習日記へ遷移
    const handleGotoDiary = () => {
        navigation.navigate('Diary');
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

    // クエストボードを生成（コースがあればコース別、なければデフォルト）
    const questBoard: DailyQuestBoard = currentCourse
        ? generateCourseQuestBoard(currentCourse.id)
        : generateDailyQuestBoard(userProgress.selectedTrackId);

    const levelProgress = getLevelProgress(userProgress.totalXP);

    const { theme } = useTheme();
    const { colors: themeColors } = theme;

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
                    <ScaleButton onPress={() => (navigation as any).navigate('ProfileTab')} style={[styles.avatarContainer, { borderColor: themeColors.accent, backgroundColor: themeColors.backgroundCard }]}>
                        {userProgress.currentAvatar ? (
                            <MyAvatar parts={userProgress.currentAvatar} size={50} />
                        ) : (
                            <Text style={styles.avatar}>🧙</Text>
                        )}
                    </ScaleButton>
                    <View style={styles.headerInfo}>
                        <View style={styles.nameRow}>
                            <Text style={[styles.greeting, { color: themeColors.textPrimary }]}>おかえり、冒険者！</Text>
                            {userProgress.title && (
                                <View style={[styles.titleBadge, { backgroundColor: themeColors.primary + '20' }]}>
                                    <Text style={[styles.titleText, { color: themeColors.primary }]}>{userProgress.title}</Text>
                                </View>
                            )}
                        </View>
                        <View style={[styles.streakBadge, { borderColor: themeColors.accent }]}>
                            <Text style={[styles.streakText, { color: themeColors.accent }]}>
                                🔥 {userProgress.streakDays}日連続
                            </Text>
                        </View>
                    </View>
                </View>

                {/* XPバー */}
                <View style={styles.xpSection}>
                    <XPBar
                        currentXP={levelProgress.currentLevelXP}
                        maxXP={levelProgress.xpForNextLevel}
                        level={userProgress.level}
                    />
                    <Text style={[styles.totalXP, { color: themeColors.textSecondary }]}>総XP: {userProgress.totalXP}</Text>
                </View>

                {/* コース選択カード */}
                <View style={styles.courseSection}>
                    <TouchableOpacity
                        style={[
                            styles.courseCard,
                            { backgroundColor: themeColors.backgroundCard, borderColor: currentCourse ? currentCourse.color : themeColors.border },
                            currentCourse && { borderColor: currentCourse.color },
                        ]}
                        onPress={handleGotoCourseSelect}
                        activeOpacity={0.8}
                    >
                        {currentCourse ? (
                            <>
                                <View style={[styles.courseIconContainer, { backgroundColor: currentCourse.color + '20' }]}>
                                    <Text style={styles.courseIcon}>{currentCourse.icon}</Text>
                                </View>
                                <View style={styles.courseInfo}>
                                    <Text style={[styles.courseLabel, { color: themeColors.textSecondary }]}>挑戦中のコース</Text>
                                    <Text style={[styles.courseName, { color: currentCourse.color }]}>
                                        {currentCourse.name}
                                    </Text>
                                </View>
                                <View style={styles.courseArrow}>
                                    <Text style={[styles.arrowText, { color: themeColors.primary }]}>変更 →</Text>
                                </View>
                            </>
                        ) : (
                            <>
                                <View style={[styles.noCourseIcon, { backgroundColor: themeColors.background }]}>
                                    <Text style={styles.noCourseIconText}>🗺️</Text>
                                </View>
                                <View style={styles.courseInfo}>
                                    <Text style={[styles.noCourseText, { color: themeColors.textSecondary }]}>コースを選んで冒険を始めよう！</Text>
                                </View>
                                <View style={[styles.selectButton, { backgroundColor: themeColors.primary }]}>
                                    <Text style={[styles.selectButtonText, { color: themeColors.textPrimary }]}>選択 →</Text>
                                </View>
                            </>
                        )}
                    </TouchableOpacity>
                </View>

                {/* 今日のクエスト概要 */}
                <View style={styles.questSection}>
                    <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>⚔️ 今日のクエスト</Text>
                    <ScaleButton
                        style={[styles.questSummaryCard, { backgroundColor: themeColors.backgroundCard, borderColor: themeColors.accent }]}
                        onPress={() => (navigation as any).navigate('QuestsTab')}
                    >
                        <View style={styles.questSummaryLeft}>
                            <Text style={styles.questSummaryIcon}>📋</Text>
                            <View>
                                <Text style={[styles.questSummaryTitle, { color: themeColors.textPrimary }]}>
                                    {questBoard.mainQuest?.title || 'クエストを確認しよう'}
                                </Text>
                                <Text style={[styles.questSummaryDesc, { color: themeColors.textSecondary }]}>
                                    完了: {userProgress.todayCompletedQuestIds.length} / {1 + (questBoard.subQuests?.length || 0)}
                                </Text>
                            </View>
                        </View>
                        <Text style={[styles.questSummaryArrow, { color: themeColors.accent }]}>→</Text>
                    </ScaleButton>
                </View>

                {/* スキル図鑑ボタン */}
                <View style={styles.skillBookSection}>
                    <TouchableOpacity
                        style={[styles.skillBookButton, { backgroundColor: themeColors.primary + '20', borderColor: themeColors.primary }]}
                        onPress={handleGotoSkillList}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.skillBookIcon}>📚</Text>
                        <Text style={[styles.skillBookText, { color: themeColors.primary }]}>スキル図鑑を開く</Text>
                        <Text style={[styles.skillBookArrow, { color: themeColors.primary }]}>→</Text>
                    </TouchableOpacity>
                </View>

                {/* スキルツリーボタン */}
                {userProgress?.selectedCourseId && (
                    <View style={styles.skillTreeSection}>
                        <TouchableOpacity
                            style={styles.skillTreeButton}
                            onPress={handleGotoSkillTree}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.skillTreeIcon}>🌳</Text>
                            <Text style={styles.skillTreeText}>スキルツリーを見る</Text>
                            <Text style={styles.skillTreeArrow}>→</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* リーダーボード ティーザー */}
                {myRank && (
                    <View style={styles.leaderboardTeaserSection}>
                        <TouchableOpacity
                            style={[
                                styles.leaderboardTeaserCard,
                                { backgroundColor: themeColors.backgroundCard, borderColor: '#FFD700' },
                            ]}
                            onPress={() => (navigation as any).navigate('LeaderboardTab')}
                            activeOpacity={0.8}
                        >
                            <View style={styles.leaderboardTeaserLeft}>
                                <Text style={styles.leaderboardTeaserIcon}>🏆</Text>
                                <View style={styles.leaderboardTeaserInfo}>
                                    <Text style={[styles.leaderboardTeaserRank, { color: themeColors.textPrimary }]}>
                                        現在の順位: {myRank.rank}位
                                    </Text>
                                    <Text style={[styles.leaderboardTeaserHint, { color: themeColors.textSecondary }]}>
                                        {myRank.rank === 1
                                            ? '🎉 トップ！その調子！'
                                            : `あと${nextRivalXP} XPでランクアップ！`}
                                    </Text>
                                </View>
                            </View>
                            <Text style={[styles.leaderboardTeaserArrow, { color: '#FFD700' }]}>→</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* 学習日記ボタン */}
                <View style={styles.diarySection}>
                    <TouchableOpacity
                        style={[styles.diaryButton, { backgroundColor: themeColors.primary }]}
                        onPress={handleGotoDiary}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.diaryButtonIcon}>📖</Text>
                        <Text style={[styles.diaryButtonText, { color: '#FFFFFF' }]}>冒険日記を書く</Text>
                        <Text style={[styles.diaryButtonArrow, { color: '#FFFFFF' }]}>→</Text>
                    </TouchableOpacity>
                </View>

                {/* 今日の進捗サマリー */}
                <View style={styles.summarySection}>
                    <View style={[styles.summaryCard, { backgroundColor: themeColors.backgroundCard, borderColor: themeColors.border }]}>
                        <Text style={[styles.summaryTitle, { color: themeColors.textPrimary }]}>📊 今日の進捗</Text>
                        <View style={styles.summaryRow}>
                            <View style={styles.summaryItem}>
                                <Text style={[styles.summaryValue, { color: themeColors.accent }]}>
                                    {userProgress.todayCompletedQuestIds.length}
                                </Text>
                                <Text style={[styles.summaryLabel, { color: themeColors.textSecondary }]}>完了クエスト</Text>
                            </View>
                            <View style={[styles.summaryDivider, { backgroundColor: themeColors.border }]} />
                            <View style={styles.summaryItem}>
                                <Text style={[styles.summaryValue, { color: themeColors.accent }]}>
                                    {userProgress.questLogs
                                        .filter(log => log.completedAt.startsWith(questBoard.date))
                                        .reduce((acc, log) => acc + log.xpEarned, 0)}
                                </Text>
                                <Text style={[styles.summaryLabel, { color: themeColors.textSecondary }]}>獲得XP</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>

            <LevelUpModal
                visible={showLevelUp}
                level={currentLevel}
                onClose={handleLevelUpClose}
            />
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.lg,
    },
    avatarContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: colors.backgroundCard,
        borderWidth: 2,
        borderColor: colors.accent,
        justifyContent: 'center',
        alignItems: 'center',
        ...shadows.glow,
    },
    avatar: {
        fontSize: 32,
    },
    headerInfo: {
        flex: 1,
        marginLeft: spacing.md,
    },
    greeting: {
        fontSize: fontSizes.xl,
        fontWeight: fontWeights.bold,
        color: colors.textPrimary,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: spacing.xs,
        flexWrap: 'wrap',
    },
    titleBadge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        marginLeft: 8,
    },
    titleText: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    streakBadge: {
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(253, 203, 110, 0.15)',
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.round,
        borderWidth: 1,
        borderColor: colors.accent,
    },
    streakText: {
        fontSize: fontSizes.sm,
        color: colors.accent,
        fontWeight: fontWeights.semibold,
    },
    xpSection: {
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.md,
    },
    totalXP: {
        fontSize: fontSizes.xs,
        color: colors.textMuted,
        textAlign: 'right',
        marginTop: spacing.xs,
    },
    courseSection: {
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.lg,
    },
    courseCard: {
        backgroundColor: colors.backgroundCard,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: colors.border,
        ...shadows.md,
    },
    courseIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    courseIcon: {
        fontSize: 24,
    },
    courseInfo: {
        flex: 1,
    },
    courseLabel: {
        fontSize: fontSizes.xs,
        color: colors.textMuted,
    },
    courseName: {
        fontSize: fontSizes.lg,
        fontWeight: fontWeights.bold,
    },
    courseArrow: {
        paddingHorizontal: spacing.sm,
    },
    arrowText: {
        fontSize: fontSizes.sm,
        color: colors.primary,
        fontWeight: fontWeights.medium,
    },
    noCourseIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: colors.backgroundLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    noCourseIconText: {
        fontSize: 24,
    },
    noCourseText: {
        fontSize: fontSizes.md,
        color: colors.textSecondary,
    },
    selectButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.md,
    },
    selectButtonText: {
        fontSize: fontSizes.sm,
        color: colors.textPrimary,
        fontWeight: fontWeights.bold,
    },
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
    questSummaryCard: {
        backgroundColor: colors.backgroundCard,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.accent,
        ...shadows.md,
    },
    questSummaryLeft: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    questSummaryIcon: {
        fontSize: 28,
        marginRight: spacing.md,
    },
    questSummaryTitle: {
        fontSize: fontSizes.md,
        fontWeight: fontWeights.bold,
        color: colors.textPrimary,
    },
    questSummaryDesc: {
        fontSize: fontSizes.xs,
        color: colors.textMuted,
        marginTop: 2,
    },
    questSummaryArrow: {
        fontSize: fontSizes.xl,
        color: colors.accent,
        fontWeight: fontWeights.bold,
    },
    skillBookSection: {
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.sm,
    },
    skillBookButton: {
        backgroundColor: 'rgba(97, 218, 251, 0.15)',
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#61DAFB',
        ...shadows.sm,
    },
    skillBookIcon: {
        fontSize: 24,
        marginRight: spacing.md,
    },
    skillBookText: {
        flex: 1,
        fontSize: fontSizes.lg,
        fontWeight: fontWeights.bold,
        color: '#61DAFB',
    },
    skillBookArrow: {
        fontSize: fontSizes.xl,
        color: '#61DAFB',
    },
    skillTreeSection: {
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.sm,
    },
    skillTreeButton: {
        backgroundColor: 'rgba(0, 184, 148, 0.12)',
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#00B894',
        ...shadows.sm,
    },
    skillTreeIcon: {
        fontSize: 24,
        marginRight: spacing.md,
    },
    skillTreeText: {
        flex: 1,
        fontSize: fontSizes.lg,
        fontWeight: fontWeights.bold,
        color: '#00B894',
    },
    skillTreeArrow: {
        fontSize: fontSizes.xl,
        color: '#00B894',
    },
    diarySection: {
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.lg,
    },
    diaryButton: {
        backgroundColor: colors.primary,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        ...shadows.md,
    },
    diaryButtonIcon: {
        fontSize: 24,
        marginRight: spacing.md,
    },
    diaryButtonText: {
        flex: 1,
        fontSize: fontSizes.lg,
        fontWeight: fontWeights.bold,
        color: colors.textPrimary,
    },
    diaryButtonArrow: {
        fontSize: fontSizes.xl,
        color: colors.textPrimary,
    },
    summarySection: {
        paddingHorizontal: spacing.lg,
    },
    summaryCard: {
        backgroundColor: colors.backgroundCard,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
        ...shadows.sm,
    },
    summaryTitle: {
        fontSize: fontSizes.md,
        fontWeight: fontWeights.bold,
        color: colors.textPrimary,
        marginBottom: spacing.md,
        textAlign: 'center',
    },
    summaryRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    summaryItem: {
        flex: 1,
        alignItems: 'center',
    },
    summaryValue: {
        fontSize: fontSizes.title,
        fontWeight: fontWeights.bold,
        color: colors.accent,
    },
    summaryLabel: {
        fontSize: fontSizes.xs,
        color: colors.textMuted,
        marginTop: spacing.xs,
    },
    summaryDivider: {
        width: 1,
        height: 40,
        backgroundColor: colors.border,
    },
    // リーダーボード ティーザー
    leaderboardTeaserSection: {
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.sm,
    },
    leaderboardTeaserCard: {
        backgroundColor: colors.backgroundCard,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#FFD700',
        ...shadows.sm,
    },
    leaderboardTeaserLeft: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    leaderboardTeaserIcon: {
        fontSize: 28,
        marginRight: spacing.md,
    },
    leaderboardTeaserInfo: {
        flex: 1,
    },
    leaderboardTeaserRank: {
        fontSize: fontSizes.md,
        fontWeight: fontWeights.bold,
        color: colors.textPrimary,
    },
    leaderboardTeaserHint: {
        fontSize: fontSizes.xs,
        color: colors.textMuted,
        marginTop: 2,
    },
    leaderboardTeaserArrow: {
        fontSize: fontSizes.xl,
        fontWeight: fontWeights.bold,
        color: '#FFD700',
    },
});
