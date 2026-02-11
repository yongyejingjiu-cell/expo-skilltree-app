/**
 * StatusScreen - ステータス/成長閲覧画面
 * レベル、XP、連続日数、スキル熟練度をまとめて表示
 */

import React, { useState, useCallback } from 'react';
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
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, MainTabParamList, UserProgress, SkillMasteryMap, Course } from '../types';
import { colors, spacing, borderRadius, fontSizes, fontWeights, shadows } from '../theme';
import { XPBar, MyAvatar, ThemedBackground } from '../components';
import { loadUserProgress, getLevelProgress, loadSkillMastery } from '../storage';
import { getCourseById } from '../data/courses';
import { SKILLS } from '../data/skills';
import { useTheme } from '../context/ThemeContext';

type Props = CompositeScreenProps<
    BottomTabScreenProps<MainTabParamList, 'ProfileTab'>,
    NativeStackScreenProps<RootStackParamList>
>;

export default function StatusScreen({ navigation }: Props) {
    const insets = useSafeAreaInsets();
    const { theme } = useTheme();
    const { colors: themeColors } = theme;
    const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
    const [skillMastery, setSkillMastery] = useState<SkillMasteryMap>({});
    const [refreshing, setRefreshing] = useState(false);

    // データ読み込み
    const loadData = useCallback(async () => {
        try {
            const progress = await loadUserProgress();
            const mastery = await loadSkillMastery();
            setUserProgress(progress);
            setSkillMastery(mastery);
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

    // 弱点リストへ遷移
    const handleGotoWeaknessList = () => {
        navigation.navigate('WeaknessList');
    };

    // ローディング中
    if (!userProgress) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    const levelProgress = getLevelProgress(userProgress.totalXP);
    const currentCourse: Course | undefined = userProgress.selectedCourseId
        ? getCourseById(userProgress.selectedCourseId)
        : undefined;

    // スキル熟練度の集計
    const masteredSkills = SKILLS.filter(
        s => (skillMastery[s.id]?.masteryLevel || 0) >= 80
    ).length;
    const learningSkills = SKILLS.filter(
        s => {
            const level = skillMastery[s.id]?.masteryLevel || 0;
            return level > 0 && level < 80;
        }
    ).length;
    const totalQuizCorrect = Object.values(skillMastery).reduce(
        (acc, m) => acc + (m.quizCorrectCount || 0), 0
    );

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
                {/* プロフィールヘッダー */}
                <View style={[styles.profileHeader, { paddingTop: insets.top + spacing.sm }]}>
                    <TouchableOpacity
                        style={[styles.avatarContainer, { borderColor: themeColors.accent, backgroundColor: themeColors.backgroundCard }]}
                        onPress={() => navigation.navigate('AvatarEdit')}
                    >
                        {userProgress.currentAvatar ? (
                            <MyAvatar parts={userProgress.currentAvatar} size={70} />
                        ) : (
                            <Text style={styles.avatar}>🧙</Text>
                        )}
                        <View style={[styles.editIconBadge, { backgroundColor: themeColors.backgroundCard, borderColor: themeColors.border }]}>
                            <Text style={styles.editIconText}>✏️</Text>
                        </View>
                    </TouchableOpacity>
                    <Text style={[styles.playerName, { color: themeColors.textPrimary }]}>冒険者</Text>
                    <View style={[styles.levelBadge, { backgroundColor: themeColors.primary }]}>
                        <Text style={[styles.levelText, { color: '#FFFFFF' }]}>Lv.{userProgress.level}</Text>
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

                {/* 基本ステータス */}
                <View style={styles.statsSection}>
                    <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>📊 基本ステータス</Text>
                    <View style={styles.statsGrid}>
                        <View style={[styles.statCard, { backgroundColor: themeColors.backgroundCard, borderColor: themeColors.border }]}>
                            <Text style={styles.statIcon}>🔥</Text>
                            <Text style={[styles.statValue, { color: themeColors.accent }]}>{userProgress.streakDays}</Text>
                            <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>連続日数</Text>
                        </View>
                        <View style={[styles.statCard, { backgroundColor: themeColors.backgroundCard, borderColor: themeColors.border }]}>
                            <Text style={styles.statIcon}>⭐</Text>
                            <Text style={[styles.statValue, { color: themeColors.accent }]}>{userProgress.totalXP}</Text>
                            <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>総XP</Text>
                        </View>
                        <View style={[styles.statCard, { backgroundColor: themeColors.backgroundCard, borderColor: themeColors.border }]}>
                            <Text style={styles.statIcon}>🏆</Text>
                            <Text style={[styles.statValue, { color: themeColors.accent }]}>{userProgress.level}</Text>
                            <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>レベル</Text>
                        </View>
                        <View style={[styles.statCard, { backgroundColor: themeColors.backgroundCard, borderColor: themeColors.border }]}>
                            <Text style={styles.statIcon}>📜</Text>
                            <Text style={[styles.statValue, { color: themeColors.accent }]}>{userProgress.questLogs.length}</Text>
                            <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>完了クエスト</Text>
                        </View>
                    </View>
                </View>

                {/* スキル習得状況 */}
                <View style={styles.skillSection}>
                    <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>⚔️ スキル習得状況</Text>
                    <View style={[styles.skillSummaryCard, { backgroundColor: themeColors.backgroundCard, borderColor: themeColors.border }]}>
                        <View style={styles.skillSummaryRow}>
                            <View style={styles.skillSummaryItem}>
                                <Text style={[styles.skillSummaryValue, { color: themeColors.success }]}>
                                    {masteredSkills}
                                </Text>
                                <Text style={[styles.skillSummaryLabel, { color: themeColors.textSecondary }]}>習得済み</Text>
                            </View>
                            <View style={[styles.skillSummaryDivider, { backgroundColor: themeColors.border }]} />
                            <View style={styles.skillSummaryItem}>
                                <Text style={[styles.skillSummaryValue, { color: themeColors.info }]}>
                                    {learningSkills}
                                </Text>
                                <Text style={[styles.skillSummaryLabel, { color: themeColors.textSecondary }]}>学習中</Text>
                            </View>
                            <View style={[styles.skillSummaryDivider, { backgroundColor: themeColors.border }]} />
                            <View style={styles.skillSummaryItem}>
                                <Text style={[styles.skillSummaryValue, { color: themeColors.xp }]}>
                                    {totalQuizCorrect}
                                </Text>
                                <Text style={[styles.skillSummaryLabel, { color: themeColors.textSecondary }]}>クイズ正解</Text>
                            </View>
                        </View>
                    </View>

                    {/* 各スキルの熟練度バー */}
                    {SKILLS.map(skill => {
                        const mastery = skillMastery[skill.id];
                        const level = mastery?.masteryLevel || 0;
                        return (
                            <View key={skill.id} style={styles.skillBar}>
                                <View style={styles.skillBarHeader}>
                                    <Text style={styles.skillBarIcon}>{skill.icon}</Text>
                                    <Text style={[styles.skillBarName, { color: themeColors.textSecondary }]}>{skill.name}</Text>
                                    <Text style={[styles.skillBarLevel, { color: themeColors.textPrimary }]}>{level}%</Text>
                                </View>
                                <View style={[styles.skillBarBg, { backgroundColor: theme.type === 'day' ? '#DFE6E9' : '#16213E' }]}>
                                    <View
                                        style={[
                                            styles.skillBarFill,
                                            {
                                                width: `${level}%`,
                                                backgroundColor: level >= 80
                                                    ? themeColors.success
                                                    : level > 0
                                                        ? themeColors.info
                                                        : themeColors.textSecondary,
                                            },
                                        ]}
                                    />
                                </View>
                            </View>
                        );
                    })}
                </View>

                {/* コース情報 */}
                {currentCourse && (
                    <View style={styles.courseSection}>
                        <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>📚 挑戦中のコース</Text>
                        <View style={[styles.courseCard, { backgroundColor: themeColors.backgroundCard, borderColor: currentCourse.color }]}>
                            <View style={[styles.courseIconContainer, { backgroundColor: currentCourse.color + '20' }]}>
                                <Text style={styles.courseIcon}>{currentCourse.icon}</Text>
                            </View>
                            <View style={styles.courseInfo}>
                                <Text style={[styles.courseName, { color: currentCourse.color }]}>
                                    {currentCourse.name}
                                </Text>
                                <Text style={[styles.courseDesc, { color: themeColors.textSecondary }]}>{currentCourse.description}</Text>
                            </View>
                        </View>
                    </View>
                )}

                {/* ショートカットボタン */}
                <View style={styles.shortcutSection}>
                    <TouchableOpacity
                        style={styles.shortcutButton}
                        onPress={handleGotoSkillList}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.shortcutIcon}>📚</Text>
                        <Text style={styles.shortcutText}>スキル図鑑を開く</Text>
                        <Text style={styles.shortcutArrow}>→</Text>
                    </TouchableOpacity>

                    {userProgress?.selectedCourseId && (
                        <TouchableOpacity
                            style={[styles.shortcutButton, styles.shortcutButtonTree]}
                            onPress={handleGotoSkillTree}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.shortcutIcon}>🌳</Text>
                            <Text style={[styles.shortcutText, { color: '#00B894' }]}>
                                スキルツリーを見る
                            </Text>
                            <Text style={[styles.shortcutArrow, { color: '#00B894' }]}>→</Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        style={[styles.shortcutButton, styles.shortcutButtonWeak]}
                        onPress={handleGotoWeaknessList}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.shortcutIcon}>💪</Text>
                        <Text style={[styles.shortcutText, { color: colors.hp }]}>
                            弱点リストを見る
                        </Text>
                        <Text style={[styles.shortcutArrow, { color: colors.hp }]}>→</Text>
                    </TouchableOpacity>
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
    // プロフィールヘッダー
    profileHeader: {
        alignItems: 'center',
        paddingBottom: spacing.md,
    },
    avatarContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.backgroundCard,
        borderWidth: 3,
        borderColor: colors.accent,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.sm,
        ...shadows.glow,
    },
    avatar: {
        fontSize: 42,
    },
    editIconBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: colors.backgroundCard,
        borderRadius: 12,
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
        ...shadows.sm,
    },
    editIconText: {
        fontSize: 14,
    },
    playerName: {
        fontSize: fontSizes.xl,
        fontWeight: fontWeights.bold,
        color: colors.textPrimary,
        marginBottom: spacing.xs,
    },
    levelBadge: {
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.round,
    },
    levelText: {
        fontSize: fontSizes.md,
        fontWeight: fontWeights.bold,
        color: colors.textPrimary,
    },
    // XP
    xpSection: {
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.lg,
    },
    totalXP: {
        fontSize: fontSizes.xs,
        color: colors.textMuted,
        textAlign: 'right',
        marginTop: spacing.xs,
    },
    // ステータスグリッド
    statsSection: {
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.lg,
    },
    sectionTitle: {
        fontSize: fontSizes.lg,
        fontWeight: fontWeights.bold,
        color: colors.textPrimary,
        marginBottom: spacing.md,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    statCard: {
        width: '48%',
        backgroundColor: colors.backgroundCard,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        alignItems: 'center',
        marginBottom: spacing.sm,
        borderWidth: 1,
        borderColor: colors.border,
        ...shadows.sm,
    },
    statIcon: {
        fontSize: 24,
        marginBottom: spacing.xs,
    },
    statValue: {
        fontSize: fontSizes.xxl,
        fontWeight: fontWeights.extrabold,
        color: colors.accent,
    },
    statLabel: {
        fontSize: fontSizes.xs,
        color: colors.textMuted,
        marginTop: spacing.xs,
    },
    // スキル習得
    skillSection: {
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.lg,
    },
    skillSummaryCard: {
        backgroundColor: colors.backgroundCard,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: spacing.md,
        ...shadows.sm,
    },
    skillSummaryRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    skillSummaryItem: {
        flex: 1,
        alignItems: 'center',
    },
    skillSummaryValue: {
        fontSize: fontSizes.title,
        fontWeight: fontWeights.bold,
    },
    skillSummaryLabel: {
        fontSize: fontSizes.xs,
        color: colors.textMuted,
        marginTop: spacing.xs,
    },
    skillSummaryDivider: {
        width: 1,
        height: 40,
        backgroundColor: colors.border,
    },
    // スキルバー
    skillBar: {
        marginBottom: spacing.sm,
    },
    skillBarHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    skillBarIcon: {
        fontSize: 16,
        marginRight: spacing.sm,
    },
    skillBarName: {
        flex: 1,
        fontSize: fontSizes.sm,
        fontWeight: fontWeights.medium,
        color: colors.textSecondary,
    },
    skillBarLevel: {
        fontSize: fontSizes.sm,
        fontWeight: fontWeights.bold,
        color: colors.textPrimary,
    },
    skillBarBg: {
        height: 6,
        backgroundColor: colors.backgroundLight,
        borderRadius: borderRadius.round,
        overflow: 'hidden',
    },
    skillBarFill: {
        height: '100%',
        borderRadius: borderRadius.round,
    },
    // コース
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
    courseName: {
        fontSize: fontSizes.lg,
        fontWeight: fontWeights.bold,
    },
    courseDesc: {
        fontSize: fontSizes.xs,
        color: colors.textMuted,
        marginTop: 2,
    },
    // ショートカット
    shortcutSection: {
        paddingHorizontal: spacing.lg,
    },
    shortcutButton: {
        backgroundColor: 'rgba(97, 218, 251, 0.15)',
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#61DAFB',
        marginBottom: spacing.sm,
        ...shadows.sm,
    },
    shortcutButtonTree: {
        backgroundColor: 'rgba(0, 184, 148, 0.12)',
        borderColor: '#00B894',
    },
    shortcutButtonWeak: {
        backgroundColor: 'rgba(231, 76, 60, 0.12)',
        borderColor: colors.hp,
    },
    shortcutIcon: {
        fontSize: 24,
        marginRight: spacing.md,
    },
    shortcutText: {
        flex: 1,
        fontSize: fontSizes.lg,
        fontWeight: fontWeights.bold,
        color: '#61DAFB',
    },
    shortcutArrow: {
        fontSize: fontSizes.xl,
        color: '#61DAFB',
    },
});
