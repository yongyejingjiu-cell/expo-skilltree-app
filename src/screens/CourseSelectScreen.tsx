/**
 * CourseSelectScreen - ワールドマップ風コース選択画面
 * カテゴリ → コースの2階層で学習コースを選択
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Dimensions,
    Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, CourseCategory, Course, CourseCategoryId, CourseId } from '../types';
import { colors, spacing, borderRadius, fontSizes, fontWeights, shadows } from '../theme';
import { loadUserProgress, changeCourse } from '../storage';
import { COURSE_CATEGORIES, COURSES, getCategoryById, getCoursesByCategory } from '../data/courses';
import { useTheme } from '../context/ThemeContext';
import { ThemedBackground } from '../components';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type Props = NativeStackScreenProps<RootStackParamList, 'CourseSelect'>;

export default function CourseSelectScreen({ navigation }: Props) {
    const insets = useSafeAreaInsets();
    const { theme } = useTheme();
    const { colors: themeColors } = theme;
    const [selectedCategoryId, setSelectedCategoryId] = useState<CourseCategoryId>('it_cert');
    const [currentCourseId, setCurrentCourseId] = useState<CourseId | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // 初期データ読み込み
    useEffect(() => {
        const loadData = async () => {
            const progress = await loadUserProgress();
            if (progress.selectedCourseId) {
                setCurrentCourseId(progress.selectedCourseId);
                // 選択中のコースのカテゴリを自動選択
                const course = COURSES.find(c => c.id === progress.selectedCourseId);
                if (course) {
                    setSelectedCategoryId(course.categoryId);
                }
            }
            setIsLoading(false);
        };
        loadData();
    }, []);

    // カテゴリ選択
    const handleCategorySelect = (categoryId: CourseCategoryId) => {
        setSelectedCategoryId(categoryId);
    };

    // コース選択
    const handleCourseSelect = async (courseId: CourseId) => {
        try {
            await changeCourse(courseId);
            setCurrentCourseId(courseId);
            // ホームに戻る
            navigation.goBack();
        } catch (error) {
            console.error('Failed to change course:', error);
        }
    };

    const selectedCategory = getCategoryById(selectedCategoryId);
    const coursesInCategory = getCoursesByCategory(selectedCategoryId);

    // 難易度表示（星）
    const renderDifficulty = (difficulty: number) => {
        const stars = [];
        for (let i = 0; i < 5; i++) {
            stars.push(
                <Text key={i} style={[styles.star, i < difficulty ? styles.starFilled : [styles.starEmpty, { color: themeColors.border }]]}>
                    ★
                </Text>
            );
        }
        return <View style={styles.difficultyContainer}>{stars}</View>;
    };

    if (isLoading) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: themeColors.background }]}>
                <Text style={[styles.loadingText, { color: themeColors.textSecondary }]}>Loading...</Text>
            </View>
        );
    }

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
                <Text style={[styles.headerTitle, { color: themeColors.textPrimary }]}>🗺️ ワールドマップ</Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={[styles.scrollContent, { paddingBottom: spacing.xxl + insets.bottom }]}
                showsVerticalScrollIndicator={false}
            >
                {/* ワールドマップ紹介 */}
                <View style={styles.introSection}>
                    <Text style={[styles.introTitle, { color: themeColors.accent }]}>冒険の舞台を選べ！</Text>
                    <Text style={[styles.introText, { color: themeColors.textSecondary }]}>
                        各エリアには様々なクエストが待っている。{'\n'}
                        自分の目標に合った道を選ぼう。
                    </Text>
                </View>

                {/* カテゴリタブ（エリア選択） */}
                <View style={styles.categorySection}>
                    <Text style={[styles.sectionLabel, { color: themeColors.textPrimary }]}>📍 エリア選択</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.categoryScroll}
                    >
                        {COURSE_CATEGORIES.map((category) => (
                            <TouchableOpacity
                                key={category.id}
                                style={[
                                    styles.categoryCard,
                                    { backgroundColor: themeColors.backgroundCard, borderColor: themeColors.border },
                                    selectedCategoryId === category.id && [styles.categoryCardActive, { backgroundColor: theme.type === 'day' ? '#F0F4F8' : '#16213E' }],
                                    { borderColor: category.color },
                                ]}
                                onPress={() => handleCategorySelect(category.id)}
                                activeOpacity={0.7}
                            >
                                <View style={[
                                    styles.categoryIconContainer,
                                    { backgroundColor: category.color + '30' },
                                ]}>
                                    <Text style={styles.categoryIcon}>{category.icon}</Text>
                                </View>
                                <Text style={[styles.categoryName, { color: themeColors.textPrimary }]}>{category.name}</Text>
                                {selectedCategoryId === category.id && (
                                    <View style={[styles.categoryIndicator, { backgroundColor: category.color }]} />
                                )}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* 選択中のエリア情報 */}
                <View style={[styles.areaInfoCard, { backgroundColor: themeColors.backgroundCard, borderColor: selectedCategory.color }]}>
                    <View style={styles.areaInfoHeader}>
                        <Text style={styles.areaInfoIcon}>{selectedCategory.icon}</Text>
                        <View style={styles.areaInfoText}>
                            <Text style={[styles.areaInfoName, { color: selectedCategory.color }]}>
                                {selectedCategory.name}エリア
                            </Text>
                            <Text style={[styles.areaInfoDesc, { color: themeColors.textSecondary }]}>{selectedCategory.description}</Text>
                        </View>
                    </View>
                </View>

                {/* コース一覧（マップノード風） */}
                <View style={styles.coursesSection}>
                    <Text style={[styles.sectionLabel, { color: themeColors.textPrimary }]}>🏰 コース一覧</Text>

                    <View style={styles.mapContainer}>
                        {/* 接続線（装飾） */}
                        <View style={[styles.connectionLine, { backgroundColor: themeColors.border }]} />

                        {coursesInCategory.map((course, index) => (
                            <View key={course.id} style={styles.courseNodeWrapper}>
                                {/* ノード（コースカード） */}
                                <TouchableOpacity
                                    style={[
                                        styles.courseCard,
                                        { backgroundColor: themeColors.backgroundCard, borderColor: themeColors.border },
                                        currentCourseId === course.id && [styles.courseCardActive, { backgroundColor: theme.type === 'day' ? '#F0F4F8' : '#16213E' }],
                                        { borderColor: course.color },
                                    ]}
                                    onPress={() => handleCourseSelect(course.id)}
                                    activeOpacity={0.8}
                                >
                                    {/* バッジ */}
                                    {course.badge && (
                                        <View style={[styles.badge, { backgroundColor: course.color }]}>
                                            <Text style={[styles.badgeText, { color: '#FFFFFF' }]}>{course.badge}</Text>
                                        </View>
                                    )}

                                    {/* アイコン */}
                                    <View style={[styles.courseIconContainer, { backgroundColor: course.color + '20' }]}>
                                        <Text style={styles.courseIcon}>{course.icon}</Text>
                                    </View>

                                    {/* コース情報 */}
                                    <View style={styles.courseInfo}>
                                        <Text style={[styles.courseName, { color: themeColors.textPrimary }]}>{course.name}</Text>
                                        <Text style={[styles.courseShortName, { color: themeColors.textSecondary }]}>({course.shortName})</Text>
                                        <Text style={[styles.courseDesc, { color: themeColors.textSecondary }]} numberOfLines={2}>
                                            {course.description}
                                        </Text>

                                        {/* 難易度と時間 */}
                                        <View style={styles.courseMeta}>
                                            {renderDifficulty(course.difficulty)}
                                            <Text style={[styles.courseHours, { color: themeColors.textSecondary }]}>
                                                ⏱️ 約{course.estimatedHours}時間
                                            </Text>
                                        </View>
                                    </View>

                                    {/* 選択中マーク */}
                                    {currentCourseId === course.id && (
                                        <View style={[styles.selectedMark, { backgroundColor: themeColors.success }]}>
                                            <Text style={[styles.selectedMarkText, { color: '#FFFFFF' }]}>✓ 挑戦中</Text>
                                        </View>
                                    )}

                                    {/* アクセントライン */}
                                    <View style={[styles.courseAccent, { backgroundColor: course.color }]} />
                                </TouchableOpacity>

                                {/* ノード番号 */}
                                <View style={[styles.nodeNumber, { backgroundColor: course.color }]}>
                                    <Text style={[styles.nodeNumberText, { color: '#FFFFFF' }]}>{index + 1}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                {/* 現在選択中のコース */}
                {currentCourseId && (
                    <View style={styles.currentCourseSection}>
                        <Text style={[styles.sectionLabel, { color: themeColors.textPrimary }]}>🎯 現在挑戦中</Text>
                        <View style={[styles.currentCourseCard, { backgroundColor: themeColors.backgroundCard, borderColor: themeColors.success }]}>
                            {(() => {
                                const course = COURSES.find(c => c.id === currentCourseId);
                                if (!course) return null;
                                return (
                                    <>
                                        <Text style={styles.currentCourseIcon}>{course.icon}</Text>
                                        <View style={styles.currentCourseInfo}>
                                            <Text style={[styles.currentCourseName, { color: themeColors.textPrimary }]}>{course.name}</Text>
                                            <Text style={[styles.currentCourseDesc, { color: themeColors.textSecondary }]}>{course.description}</Text>
                                        </View>
                                    </>
                                );
                            })()}
                        </View>
                    </View>
                )}
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
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: spacing.xxl,
    },
    introSection: {
        padding: spacing.lg,
        alignItems: 'center',
    },
    introTitle: {
        fontSize: fontSizes.title,
        fontWeight: fontWeights.bold,
        color: colors.accent,
        marginBottom: spacing.sm,
    },
    introText: {
        fontSize: fontSizes.md,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
    },
    sectionLabel: {
        fontSize: fontSizes.lg,
        fontWeight: fontWeights.bold,
        color: colors.textPrimary,
        marginBottom: spacing.md,
        paddingHorizontal: spacing.lg,
    },
    categorySection: {
        marginBottom: spacing.lg,
    },
    categoryScroll: {
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.sm,
    },
    categoryCard: {
        width: 100,
        backgroundColor: colors.backgroundCard,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        marginRight: spacing.md,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: colors.border,
        ...shadows.sm,
    },
    categoryCardActive: {
        backgroundColor: colors.backgroundLight,
    },
    categoryIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    categoryIcon: {
        fontSize: 24,
    },
    categoryName: {
        fontSize: fontSizes.sm,
        fontWeight: fontWeights.semibold,
        color: colors.textPrimary,
        textAlign: 'center',
    },
    categoryIndicator: {
        position: 'absolute',
        bottom: 0,
        left: spacing.md,
        right: spacing.md,
        height: 3,
        borderRadius: 2,
    },
    areaInfoCard: {
        backgroundColor: colors.backgroundCard,
        marginHorizontal: spacing.lg,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        marginBottom: spacing.lg,
        borderWidth: 1,
        ...shadows.sm,
    },
    areaInfoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    areaInfoIcon: {
        fontSize: 36,
        marginRight: spacing.md,
    },
    areaInfoText: {
        flex: 1,
    },
    areaInfoName: {
        fontSize: fontSizes.lg,
        fontWeight: fontWeights.bold,
    },
    areaInfoDesc: {
        fontSize: fontSizes.sm,
        color: colors.textSecondary,
        marginTop: spacing.xs,
    },
    coursesSection: {
        marginBottom: spacing.lg,
    },
    mapContainer: {
        position: 'relative',
        paddingHorizontal: spacing.lg,
    },
    connectionLine: {
        position: 'absolute',
        left: spacing.lg + 20,
        top: 40,
        bottom: 40,
        width: 3,
        backgroundColor: colors.border,
        borderRadius: 2,
    },
    courseNodeWrapper: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: spacing.md,
    },
    nodeNumber: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
        marginTop: spacing.md,
        zIndex: 1,
        ...shadows.sm,
    },
    nodeNumberText: {
        color: colors.background,
        fontSize: fontSizes.lg,
        fontWeight: fontWeights.bold,
    },
    courseCard: {
        flex: 1,
        backgroundColor: colors.backgroundCard,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        flexDirection: 'row',
        borderWidth: 2,
        borderColor: colors.border,
        overflow: 'hidden',
        ...shadows.md,
    },
    courseCardActive: {
        backgroundColor: colors.backgroundLight,
    },
    badge: {
        position: 'absolute',
        top: 0,
        right: 0,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderBottomLeftRadius: borderRadius.md,
    },
    badgeText: {
        fontSize: fontSizes.xs,
        fontWeight: fontWeights.bold,
        color: colors.background,
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
        color: colors.textPrimary,
    },
    courseShortName: {
        fontSize: fontSizes.xs,
        color: colors.textMuted,
        marginBottom: spacing.xs,
    },
    courseDesc: {
        fontSize: fontSizes.sm,
        color: colors.textSecondary,
        marginBottom: spacing.sm,
    },
    courseMeta: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    difficultyContainer: {
        flexDirection: 'row',
        marginRight: spacing.md,
    },
    star: {
        fontSize: fontSizes.sm,
    },
    starFilled: {
        color: colors.accent,
    },
    starEmpty: {
        color: colors.border,
    },
    courseHours: {
        fontSize: fontSizes.xs,
        color: colors.textMuted,
    },
    selectedMark: {
        position: 'absolute',
        bottom: spacing.sm,
        right: spacing.sm,
        backgroundColor: colors.success,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.sm,
    },
    selectedMarkText: {
        fontSize: fontSizes.xs,
        fontWeight: fontWeights.bold,
        color: colors.background,
    },
    courseAccent: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 4,
    },
    currentCourseSection: {
        paddingHorizontal: spacing.lg,
    },
    currentCourseCard: {
        backgroundColor: colors.backgroundCard,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: colors.success,
        ...shadows.md,
    },
    currentCourseIcon: {
        fontSize: 32,
        marginRight: spacing.md,
    },
    currentCourseInfo: {
        flex: 1,
    },
    currentCourseName: {
        fontSize: fontSizes.lg,
        fontWeight: fontWeights.bold,
        color: colors.textPrimary,
    },
    currentCourseDesc: {
        fontSize: fontSizes.sm,
        color: colors.textSecondary,
    },
});
