/**
 * SkillDetailScreen - スキル図鑑詳細画面
 * 「これだけ覚えろ3点」「よくある勘違い」「ミニクイズ」を表示
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, SkillMastery } from '../types';
import { colors, spacing, borderRadius, fontSizes, fontWeights, shadows } from '../theme';
import QuizCard from '../components/QuizCard';
import { getSkillById } from '../data/skills';
import { getSkillMastery, recordQuizCorrect, recordSkillStudy, getTodayDateString, markLevelAsCelebrated, loadUserProgress } from '../storage';
import { useTheme } from '../context/ThemeContext';
import { ThemedBackground, LevelUpModal } from '../components';

type Props = NativeStackScreenProps<RootStackParamList, 'SkillDetail'>;

export default function SkillDetailScreen({ route, navigation }: Props) {
    const insets = useSafeAreaInsets();
    const { theme } = useTheme();
    const { colors: themeColors } = theme;
    const { skillId } = route.params;
    const skill = getSkillById(skillId);

    const [mastery, setMastery] = useState<SkillMastery | null>(null);
    const [quizAnsweredToday, setQuizAnsweredToday] = useState(false);
    const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
    const [showLevelUp, setShowLevelUp] = useState(false);
    const [currentLevel, setCurrentLevel] = useState(1);

    // 全問クリアしたかどうかの判定 (熟練度100% または クイズ正解数がクイズ総数に達したか)
    const allQuizzesCleared = mastery ? (mastery.masteryLevel >= 100 || (skill?.quizzes && mastery.quizCorrectCount >= skill.quizzes.length)) : false;

    // 熟練度読み込み
    useEffect(() => {
        const load = async () => {
            const m = await getSkillMastery(skillId);
            setMastery(m);

            // ユーザー情報を取得して現在のレベルを保持
            const progress = await loadUserProgress();
            setCurrentLevel(progress.level);

            // 未お祝いのレベルアップがあれば表示
            if (progress.level > (progress.lastCelebratedLevel || 1)) {
                setShowLevelUp(true);
            }

            // 今日すでにクイズを回答したかチェック (全問解き終わっているか)
            const today = getTodayDateString();
            const totalQuizzes = skill?.quizzes?.length || 1;
            if (m.lastStudiedAt && m.lastStudiedAt.startsWith(today) && m.quizCorrectCount >= totalQuizzes) {
                setQuizAnsweredToday(true);
            }

            // 進捗に合わせて現在のクイズインデックスを設定 (既に解いた問題の次からスタート)
            if (m.quizCorrectCount < totalQuizzes) {
                setCurrentQuizIndex(m.quizCorrectCount);
            } else {
                setCurrentQuizIndex(0); // 全問達成済みなら最初から見れるようにしておく
            }

            // 閲覧記録
            await recordSkillStudy(skillId);
        };
        load();
    }, [skillId, skill]);

    // クイズ正解時のコールバック
    const handleQuizCorrect = useCallback(async () => {
        if (!skill) return;
        try {
            // 現在のクイズのXP報酬を使用
            const xpReward = skill.quizzes[currentQuizIndex]?.xpReward ?? 20;
            const result = await recordQuizCorrect(skillId, xpReward);

            // レベルアップ判定
            if (result.progress.level > (result.progress.lastCelebratedLevel || 1)) {
                setShowLevelUp(true);
                setCurrentLevel(result.progress.level);
            }

            setMastery(result.mastery);

            // クイズ全問クリアしたかチェック
            if (result.mastery.masteryLevel >= 100 || result.mastery.quizCorrectCount >= skill.quizzes.length) {
                setQuizAnsweredToday(true);
            }
        } catch (error) {
            console.error('Failed to record quiz:', error);
        }
    }, [skillId, skill, currentQuizIndex]);

    const handleNextQuiz = useCallback(() => {
        if (skill && currentQuizIndex < skill.quizzes.length - 1) {
            setCurrentQuizIndex(prev => prev + 1);
        }
    }, [skill, currentQuizIndex]);

    // スキルが見つからない場合
    if (!skill) {
        return (
            <View style={[styles.errorContainer, { backgroundColor: themeColors.background }]}>
                <Text style={[styles.errorText, { color: themeColors.textSecondary }]}>スキルが見つかりません</Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={[styles.errorBack, { color: themeColors.primary }]}>← 戻る</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // 難易度表示
    const difficultyStars = '★'.repeat(skill.difficulty) + '☆'.repeat(3 - skill.difficulty);

    // 熟練度バーの幅
    const masteryPercent = mastery?.masteryLevel ?? 0;

    return (
        <ThemedBackground style={styles.container}>
            <StatusBar barStyle={theme.type === 'day' ? "dark-content" : "light-content"} backgroundColor="transparent" translucent />
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={[styles.scrollContent, { paddingBottom: spacing.xxl + insets.bottom }]}
                showsVerticalScrollIndicator={false}
            >
                {/* ヘッダー */}
                <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={[styles.backText, { color: themeColors.primary }]}>← 戻る</Text>
                    </TouchableOpacity>
                </View>

                {/* スキルアイコン & 名前 */}
                <View style={styles.skillHeader}>
                    <View style={[styles.skillIconContainer, { backgroundColor: skill.color + '30', shadowColor: skill.color }]}>
                        <Text style={styles.skillIcon}>{skill.icon}</Text>
                    </View>
                    <Text style={[styles.skillName, { color: themeColors.textPrimary }]}>{skill.name}</Text>

                    {/* カテゴリ & 難易度 */}
                    <View style={styles.metaRow}>
                        <View style={[styles.categoryBadge, { backgroundColor: skill.color + '20', borderColor: skill.color }]}>
                            <Text style={[styles.categoryText, { color: skill.color }]}>
                                {skill.category === 'language' ? '言語' :
                                    skill.category === 'framework' ? 'フレームワーク' :
                                        skill.category === 'concept' ? '概念' : 'ツール'}
                            </Text>
                        </View>
                        <Text style={[styles.difficultyText, { color: themeColors.accent }]}>{difficultyStars}</Text>
                    </View>

                    {/* 説明 */}
                    <Text style={[styles.description, { color: themeColors.textSecondary }]}>{skill.description}</Text>
                </View>

                {/* 熟練度バー */}
                <View style={styles.masterySection}>
                    <View style={styles.masteryHeader}>
                        <Text style={[styles.masteryLabel, { color: themeColors.textPrimary }]}>🔥 熟練度</Text>
                        <Text style={[styles.masteryValue, { color: themeColors.accent }]}>{masteryPercent}%</Text>
                    </View>
                    <View style={[styles.masteryBarBg, { backgroundColor: theme.type === 'day' ? '#DFE6E9' : '#16213E' }]}>
                        <View style={[
                            styles.masteryBarFill,
                            {
                                width: `${masteryPercent}%`,
                                backgroundColor: masteryPercent >= 80 ? themeColors.success
                                    : masteryPercent >= 40 ? themeColors.xp
                                        : themeColors.primary,
                            },
                        ]} />
                    </View>
                    {mastery && mastery.quizCorrectCount > 0 && (
                        <Text style={[styles.masteryQuizCount, { color: themeColors.textSecondary }]}>
                            クイズ正解: {mastery.quizCorrectCount}回
                        </Text>
                    )}
                </View>

                {/* 装飾線 */}
                <View style={styles.divider}>
                    <View style={[styles.dividerLine, { backgroundColor: themeColors.border }]} />
                    <Text style={[styles.dividerIcon, { color: themeColors.accent }]}>◆</Text>
                    <View style={[styles.dividerLine, { backgroundColor: themeColors.border }]} />
                </View>

                {/* 前提スキル */}
                {skill.prerequisiteIds && skill.prerequisiteIds.length > 0 && (
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>🔗 前提スキル</Text>
                        <View style={styles.prereqRow}>
                            {skill.prerequisiteIds.map(id => {
                                const prereq = getSkillById(id);
                                if (!prereq) return null;
                                return (
                                    <TouchableOpacity
                                        key={id}
                                        style={[styles.prereqBadge, { backgroundColor: themeColors.backgroundCard, borderColor: themeColors.border }]}
                                        onPress={() => navigation.push('SkillDetail', { skillId: id })}
                                    >
                                        <Text style={styles.prereqIcon}>{prereq.icon}</Text>
                                        <Text style={[styles.prereqName, { color: themeColors.primary }]}>{prereq.name}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                )}

                {/* これだけ覚えろ3点 */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>💎 これだけ覚えろ！</Text>
                    <View style={[styles.keyPointsCard, { backgroundColor: themeColors.backgroundCard, borderColor: themeColors.border }]}>
                        {skill.keyPoints.map((point, index) => (
                            <View key={index} style={styles.keyPointItem}>
                                <View style={[styles.keyPointNumber, { backgroundColor: skill.color }]}>
                                    <Text style={[styles.keyPointNumberText, { color: '#FFFFFF' }]}>{index + 1}</Text>
                                </View>
                                <Text style={[styles.keyPointText, { color: themeColors.textPrimary }]}>{point}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* よくある勘違い */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>⚠️ よくある勘違い</Text>
                    <View style={[styles.misconceptionsCard, { backgroundColor: themeColors.backgroundCard, borderColor: themeColors.error + '40' }]}>
                        {skill.misconceptions.map((item, index) => (
                            <View key={index} style={[styles.misconceptionItem, { borderBottomColor: themeColors.border }]}>
                                <Text style={[styles.misconceptionText, { color: themeColors.textSecondary }]}>{item}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* ミニクイズ */}
                <View style={styles.section}>
                    <QuizCard
                        quiz={skill.quizzes[currentQuizIndex] || skill.quizzes[0]}
                        alreadyAnswered={quizAnsweredToday}
                        onCorrectAnswer={handleQuizCorrect}
                        currentQuizIndex={currentQuizIndex}
                        totalQuizzes={skill.quizzes.length}
                        onNextQuiz={handleNextQuiz}
                        allQuizzesCleared={allQuizzesCleared}
                    />
                </View>

                {/* 詳細コンテンツ */}
                <View style={styles.section}>
                    <View style={[styles.detailCard, { backgroundColor: themeColors.backgroundCard, borderColor: themeColors.border }]}>
                        <View style={[styles.detailHeader, { backgroundColor: themeColors.primary }]}>
                            <Text style={[styles.detailHeaderText, { color: '#FFFFFF' }]}>📖 詳細解説</Text>
                        </View>
                        <Text style={[styles.detailContent, { color: themeColors.textSecondary }]}>{skill.detailContent}</Text>
                    </View>
                </View>
            </ScrollView>

            <LevelUpModal
                visible={showLevelUp}
                level={currentLevel}
                onClose={async () => {
                    setShowLevelUp(false);
                    await markLevelAsCelebrated(currentLevel);
                }}
            />
        </ThemedBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    errorContainer: {
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: colors.textMuted,
        fontSize: fontSizes.lg,
        marginBottom: spacing.md,
    },
    errorBack: {
        color: colors.primary,
        fontSize: fontSizes.md,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: spacing.xxl,
    },
    header: {
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.sm,
    },
    backButton: {
        alignSelf: 'flex-start',
        paddingVertical: spacing.xs,
    },
    backText: {
        color: colors.primary,
        fontSize: fontSizes.md,
        fontWeight: fontWeights.medium,
    },
    skillHeader: {
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.lg,
    },
    skillIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.md,
        ...shadows.glow,
    },
    skillIcon: {
        fontSize: 40,
    },
    skillName: {
        fontSize: fontSizes.title,
        fontWeight: fontWeights.bold,
        color: colors.textPrimary,
        marginBottom: spacing.sm,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    categoryBadge: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.round,
        borderWidth: 1,
        marginRight: spacing.md,
    },
    categoryText: {
        fontSize: fontSizes.sm,
        fontWeight: fontWeights.semibold,
    },
    difficultyText: {
        fontSize: fontSizes.md,
        color: colors.accent,
    },
    description: {
        fontSize: fontSizes.md,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
    },
    masterySection: {
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.lg,
    },
    masteryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    masteryLabel: {
        fontSize: fontSizes.md,
        fontWeight: fontWeights.semibold,
        color: colors.textPrimary,
    },
    masteryValue: {
        fontSize: fontSizes.lg,
        fontWeight: fontWeights.bold,
        color: colors.accent,
    },
    masteryBarBg: {
        height: 12,
        backgroundColor: colors.backgroundLight,
        borderRadius: 6,
        overflow: 'hidden',
    },
    masteryBarFill: {
        height: '100%',
        borderRadius: 6,
    },
    masteryQuizCount: {
        fontSize: fontSizes.xs,
        color: colors.textMuted,
        textAlign: 'right',
        marginTop: spacing.xs,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: spacing.lg,
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
    section: {
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.lg,
    },
    sectionTitle: {
        fontSize: fontSizes.lg,
        fontWeight: fontWeights.bold,
        color: colors.textPrimary,
        marginBottom: spacing.md,
    },
    prereqRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    prereqBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.backgroundCard,
        borderRadius: borderRadius.round,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        marginRight: spacing.sm,
        borderWidth: 1,
        borderColor: colors.border,
    },
    prereqIcon: {
        fontSize: 16,
        marginRight: spacing.xs,
    },
    prereqName: {
        fontSize: fontSizes.sm,
        color: colors.primary,
        fontWeight: fontWeights.medium,
    },
    keyPointsCard: {
        backgroundColor: colors.backgroundCard,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
        ...shadows.sm,
    },
    keyPointItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: spacing.md,
    },
    keyPointNumber: {
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
        marginTop: 2,
    },
    keyPointNumberText: {
        fontSize: fontSizes.sm,
        fontWeight: fontWeights.bold,
        color: '#FFFFFF',
    },
    keyPointText: {
        flex: 1,
        fontSize: fontSizes.md,
        color: colors.textPrimary,
        lineHeight: 22,
    },
    misconceptionsCard: {
        backgroundColor: colors.backgroundCard,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: 'rgba(214, 48, 49, 0.3)',
        ...shadows.sm,
    },
    misconceptionItem: {
        paddingVertical: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    misconceptionText: {
        fontSize: fontSizes.md,
        color: colors.textSecondary,
        lineHeight: 22,
    },
    detailCard: {
        backgroundColor: colors.backgroundCard,
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.border,
        ...shadows.md,
    },
    detailHeader: {
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
    },
    detailHeaderText: {
        fontSize: fontSizes.md,
        fontWeight: fontWeights.bold,
        color: colors.textPrimary,
    },
    detailContent: {
        fontSize: fontSizes.md,
        color: colors.textSecondary,
        lineHeight: 24,
        padding: spacing.md,
    },
});
