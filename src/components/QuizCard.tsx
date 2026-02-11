/**
 * QuizCard - ミニクイズコンポーネント
 * 4択クイズの出題・回答・結果表示を一つのカードで行う
 */

import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
} from 'react-native';
import { SkillQuiz } from '../types';
import { colors, spacing, borderRadius, fontSizes, fontWeights, shadows } from '../theme';

interface QuizCardProps {
    quiz: SkillQuiz;
    alreadyAnswered: boolean;
    onCorrectAnswer: () => void;
    currentQuizIndex: number;
    totalQuizzes: number;
    onNextQuiz?: () => void;
    allQuizzesCleared: boolean;
}

export default function QuizCard({
    quiz,
    alreadyAnswered,
    onCorrectAnswer,
    currentQuizIndex,
    totalQuizzes,
    onNextQuiz,
    allQuizzesCleared,
}: QuizCardProps) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);
    const isCorrect = selectedIndex !== null && quiz.choices[selectedIndex].isCorrect;

    const handleSelect = (index: number) => {
        if (showResult || alreadyAnswered) return;
        setSelectedIndex(index);
    };

    const handleSubmit = () => {
        if (selectedIndex === null || showResult || alreadyAnswered) return;
        setShowResult(true);
        if (quiz.choices[selectedIndex].isCorrect) {
            onCorrectAnswer();
        }
    };

    // 全問題クリア済みの場合
    if (allQuizzesCleared) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerIcon}>✨</Text>
                    <Text style={styles.headerTitle}>コンプリート！</Text>
                </View>
                <View style={[styles.answeredCard, { borderColor: colors.accent }]}>
                    <Text style={styles.answeredIcon}>🏆</Text>
                    <Text style={[styles.answeredText, { color: colors.accent }]}>このスキルの全クイズをクリア！</Text>
                    <Text style={styles.answeredXP}>マスターへの道が一歩進みました</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* ヘッダー */}
            <View style={styles.header}>
                <Text style={styles.headerIcon}>📝</Text>
                <Text style={styles.headerTitle}>ミニクイズ ({currentQuizIndex + 1}/{totalQuizzes})</Text>
                <View style={styles.xpBadge}>
                    <Text style={styles.xpText}>⭐ +{quiz.xpReward} XP</Text>
                </View>
            </View>

            {/* 問題文 */}
            <View style={styles.questionCard}>
                <Text style={styles.questionText}>{quiz.question}</Text>
            </View>

            {/* 選択肢 */}
            <View style={styles.choicesContainer}>
                {quiz.choices.map((choice, index) => {
                    const isSelected = selectedIndex === index;
                    const isCorrectChoice = choice.isCorrect;

                    let choiceStyle = styles.choice;
                    let choiceTextStyle = styles.choiceText;
                    let choiceLabel = styles.choiceLabelText;

                    if (showResult) {
                        if (isCorrectChoice) {
                            choiceStyle = { ...styles.choice, ...styles.choiceCorrect };
                            choiceTextStyle = { ...styles.choiceText, ...styles.choiceTextCorrect };
                        } else if (isSelected && !isCorrectChoice) {
                            choiceStyle = { ...styles.choice, ...styles.choiceWrong };
                            choiceTextStyle = { ...styles.choiceText, ...styles.choiceTextWrong };
                        }
                    } else if (isSelected) {
                        choiceStyle = { ...styles.choice, ...styles.choiceSelected };
                    }

                    const labels = ['A', 'B', 'C', 'D'];

                    return (
                        <TouchableOpacity
                            key={index}
                            style={choiceStyle}
                            onPress={() => handleSelect(index)}
                            activeOpacity={alreadyAnswered || showResult ? 1 : 0.7}
                            disabled={alreadyAnswered || showResult}
                        >
                            <View style={[
                                styles.choiceLabel,
                                isSelected && !showResult && styles.choiceLabelSelected,
                                showResult && isCorrectChoice && styles.choiceLabelCorrect,
                                showResult && isSelected && !isCorrectChoice && styles.choiceLabelWrong,
                            ]}>
                                <Text style={[
                                    choiceLabel,
                                    showResult && isCorrectChoice && styles.choiceLabelTextCorrect,
                                    showResult && isSelected && !isCorrectChoice && styles.choiceLabelTextWrong,
                                ]}>{labels[index]}</Text>
                            </View>
                            <Text style={choiceTextStyle}>{choice.label}</Text>
                            {showResult && isCorrectChoice && (
                                <Text style={styles.resultIcon}>✓</Text>
                            )}
                            {showResult && isSelected && !isCorrectChoice && (
                                <Text style={styles.resultIcon}>✗</Text>
                            )}
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* 回答ボタン or 結果表示 */}
            {!showResult ? (
                <TouchableOpacity
                    style={[
                        styles.submitButton,
                        selectedIndex === null && styles.submitButtonDisabled,
                    ]}
                    onPress={handleSubmit}
                    activeOpacity={0.8}
                    disabled={selectedIndex === null}
                >
                    <Text style={styles.submitButtonText}>回答する！</Text>
                </TouchableOpacity>
            ) : (
                <View style={[
                    styles.resultCard,
                    isCorrect ? styles.resultCorrect : styles.resultWrong,
                ]}>
                    <View style={styles.resultHeader}>
                        <Text style={styles.resultEmoji}>
                            {isCorrect ? '🎉' : '😅'}
                        </Text>
                        <Text style={[
                            styles.resultTitle,
                            { color: isCorrect ? colors.success : colors.error },
                        ]}>
                            {isCorrect ? '正解！' : '不正解...'}
                        </Text>
                        {isCorrect && (
                            <View style={styles.resultXP}>
                                <Text style={styles.resultXPText}>+{quiz.xpReward} XP</Text>
                            </View>
                        )}
                    </View>
                    <Text style={styles.explanationText}>{quiz.explanation}</Text>

                    {isCorrect && onNextQuiz && currentQuizIndex < totalQuizzes - 1 && (
                        <TouchableOpacity
                            style={styles.nextButton}
                            onPress={() => {
                                setShowResult(false);
                                setSelectedIndex(null);
                                onNextQuiz();
                            }}
                        >
                            <Text style={styles.nextButtonText}>次の問題へ進む！</Text>
                        </TouchableOpacity>
                    )}

                    {!isCorrect && (
                        <TouchableOpacity
                            style={styles.retryButton}
                            onPress={() => {
                                setShowResult(false);
                                setSelectedIndex(null);
                            }}
                        >
                            <Text style={styles.retryButtonText}>もう一度挑戦</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.lg,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    headerIcon: {
        fontSize: 20,
        marginRight: spacing.sm,
    },
    headerTitle: {
        fontSize: fontSizes.lg,
        fontWeight: fontWeights.bold,
        color: colors.textPrimary,
        flex: 1,
    },
    xpBadge: {
        backgroundColor: 'rgba(241, 196, 15, 0.15)',
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.round,
    },
    xpText: {
        fontSize: fontSizes.xs,
        fontWeight: fontWeights.bold,
        color: colors.xp,
    },
    questionCard: {
        backgroundColor: colors.backgroundLight,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: colors.primary,
        ...shadows.sm,
    },
    questionText: {
        fontSize: fontSizes.md,
        fontWeight: fontWeights.semibold,
        color: colors.textPrimary,
        lineHeight: 24,
    },
    choicesContainer: {
        marginBottom: spacing.md,
    },
    choice: {
        backgroundColor: colors.backgroundCard,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        marginBottom: spacing.sm,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: colors.border,
    },
    choiceSelected: {
        borderColor: colors.primary,
        backgroundColor: 'rgba(108, 92, 231, 0.1)',
    },
    choiceCorrect: {
        borderColor: colors.success,
        backgroundColor: 'rgba(0, 184, 148, 0.1)',
    },
    choiceWrong: {
        borderColor: colors.error,
        backgroundColor: 'rgba(214, 48, 49, 0.1)',
    },
    choiceLabel: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: colors.backgroundLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    choiceLabelSelected: {
        backgroundColor: colors.primary,
    },
    choiceLabelCorrect: {
        backgroundColor: colors.success,
    },
    choiceLabelWrong: {
        backgroundColor: colors.error,
    },
    choiceLabelText: {
        fontSize: fontSizes.sm,
        fontWeight: fontWeights.bold,
        color: colors.textMuted,
    },
    choiceLabelTextCorrect: {
        color: '#FFFFFF',
    },
    choiceLabelTextWrong: {
        color: '#FFFFFF',
    },
    choiceText: {
        flex: 1,
        fontSize: fontSizes.md,
        color: colors.textPrimary,
    },
    choiceTextCorrect: {
        color: colors.success,
        fontWeight: fontWeights.semibold,
    },
    choiceTextWrong: {
        color: colors.error,
    },
    resultIcon: {
        fontSize: fontSizes.lg,
        fontWeight: fontWeights.bold,
        marginLeft: spacing.sm,
    },
    submitButton: {
        backgroundColor: colors.primary,
        borderRadius: borderRadius.lg,
        paddingVertical: spacing.md,
        alignItems: 'center',
        ...shadows.md,
    },
    submitButtonDisabled: {
        opacity: 0.5,
    },
    submitButtonText: {
        fontSize: fontSizes.lg,
        fontWeight: fontWeights.bold,
        color: colors.textPrimary,
    },
    resultCard: {
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        borderWidth: 2,
        ...shadows.sm,
    },
    resultCorrect: {
        backgroundColor: 'rgba(0, 184, 148, 0.08)',
        borderColor: colors.success,
    },
    resultWrong: {
        backgroundColor: 'rgba(214, 48, 49, 0.08)',
        borderColor: colors.error,
    },
    resultHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    resultEmoji: {
        fontSize: 24,
        marginRight: spacing.sm,
    },
    resultTitle: {
        fontSize: fontSizes.lg,
        fontWeight: fontWeights.bold,
        flex: 1,
    },
    resultXP: {
        backgroundColor: colors.xp,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.round,
    },
    resultXPText: {
        fontSize: fontSizes.sm,
        fontWeight: fontWeights.bold,
        color: colors.background,
    },
    explanationText: {
        fontSize: fontSizes.md,
        color: colors.textSecondary,
        lineHeight: 22,
        marginBottom: spacing.md,
    },
    nextButton: {
        backgroundColor: colors.success,
        borderRadius: borderRadius.md,
        paddingVertical: spacing.sm,
        alignItems: 'center',
        marginTop: spacing.sm,
    },
    nextButtonText: {
        fontSize: fontSizes.md,
        fontWeight: fontWeights.bold,
        color: '#FFFFFF',
    },
    retryButton: {
        backgroundColor: colors.primary,
        borderRadius: borderRadius.md,
        paddingVertical: spacing.sm,
        alignItems: 'center',
        marginTop: spacing.md,
    },
    retryButtonText: {
        fontSize: fontSizes.md,
        fontWeight: fontWeights.bold,
        color: '#FFFFFF',
    },
    answeredCard: {
        backgroundColor: colors.backgroundCard,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.success,
        ...shadows.sm,
    },
    answeredIcon: {
        fontSize: 32,
        marginBottom: spacing.sm,
    },
    answeredText: {
        fontSize: fontSizes.md,
        fontWeight: fontWeights.semibold,
        color: colors.success,
    },
    answeredXP: {
        fontSize: fontSizes.sm,
        color: colors.textMuted,
        marginTop: spacing.xs,
    },
});
