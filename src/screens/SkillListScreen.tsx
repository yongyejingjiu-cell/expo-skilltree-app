/**
 * SkillListScreen - スキル図鑑一覧
 * 全スキルをカテゴリ別にカード形式で表示
 */

import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { RootStackParamList, SkillMasteryMap, SkillCategory, CourseId, Skill } from '../types';
import { colors, spacing, borderRadius, fontSizes, fontWeights, shadows } from '../theme';
import { getSkillsByCourse, getSkillsByCategory } from '../data/skills';
import { loadSkillMastery, loadUserProgress } from '../storage';
import { ThemedBackground } from '../components';
import { useTheme } from '../context/ThemeContext';

type Props = NativeStackScreenProps<RootStackParamList, 'SkillList'>;

const CATEGORY_INFO: { id: SkillCategory; label: string; icon: string }[] = [
    { id: 'language', label: '言語', icon: '📝' },
    { id: 'framework', label: 'フレームワーク', icon: '🏗️' },
    { id: 'concept', label: '概念', icon: '💡' },
    { id: 'tool', label: 'ツール', icon: '🔧' },
];

export default function SkillListScreen({ navigation }: Props) {
    const insets = useSafeAreaInsets();
    const [masteryMap, setMasteryMap] = useState<SkillMasteryMap>({});
    const [selectedCategory, setSelectedCategory] = useState<SkillCategory | 'all'>('all');
    const [courseId, setCourseId] = useState<CourseId>('web_dev');
    const [courseSkills, setCourseSkills] = useState<Skill[]>([]);

    // フォーカス時に熟練度とコース情報を再読み込み
    useFocusEffect(
        useCallback(() => {
            const load = async () => {
                const map = await loadSkillMastery();
                setMasteryMap(map);
                const progress = await loadUserProgress();
                const cId = progress.selectedCourseId ?? 'web_dev';
                setCourseId(cId);
                setCourseSkills(getSkillsByCourse(cId));
            };
            load();
        }, [])
    );

    const { theme } = useTheme();
    const { colors: themeColors } = theme;

    // 表示するスキル
    const filteredSkills = selectedCategory === 'all'
        ? courseSkills
        : getSkillsByCategory(selectedCategory, courseId);

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
                <Text style={[styles.headerTitle, { color: themeColors.textPrimary }]}>📚 スキル図鑑</Text>
                <View style={styles.headerSpacer} />
            </View>

            {/* カテゴリフィルタ */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterScroll}
            >
                <TouchableOpacity
                    style={[
                        styles.filterChip,
                        { backgroundColor: themeColors.backgroundCard, borderColor: themeColors.border },
                        selectedCategory === 'all' && { backgroundColor: themeColors.primary, borderColor: themeColors.primary },
                    ]}
                    onPress={() => setSelectedCategory('all')}
                >
                    <Text style={[
                        styles.filterChipText,
                        { color: themeColors.textSecondary },
                        selectedCategory === 'all' && { color: '#FFFFFF' },
                    ]}>すべて</Text>
                </TouchableOpacity>
                {CATEGORY_INFO.map(cat => (
                    <TouchableOpacity
                        key={cat.id}
                        style={[
                            styles.filterChip,
                            { backgroundColor: themeColors.backgroundCard, borderColor: themeColors.border },
                            selectedCategory === cat.id && { backgroundColor: themeColors.primary, borderColor: themeColors.primary },
                        ]}
                        onPress={() => setSelectedCategory(cat.id)}
                    >
                        <Text style={[
                            styles.filterChipText,
                            { color: themeColors.textSecondary },
                            selectedCategory === cat.id && { color: '#FFFFFF' },
                        ]}>{cat.icon} {cat.label}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* スキル一覧 */}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={[styles.scrollContent, { paddingBottom: spacing.xxl + insets.bottom }]}
                showsVerticalScrollIndicator={false}
            >
                {filteredSkills.map(skill => {
                    const mastery = masteryMap[skill.id];
                    const masteryLevel = mastery?.masteryLevel ?? 0;
                    const diffStars = '★'.repeat(skill.difficulty) + '☆'.repeat(3 - skill.difficulty);

                    return (
                        <TouchableOpacity
                            key={skill.id}
                            style={[
                                styles.skillCard,
                                {
                                    backgroundColor: themeColors.backgroundCard,
                                    borderColor: themeColors.border,
                                    borderLeftColor: skill.color
                                }
                            ]}
                            onPress={() => navigation.navigate('SkillDetail', { skillId: skill.id })}
                            activeOpacity={0.8}
                        >
                            {/* アイコン */}
                            <View style={[styles.skillIcon, { backgroundColor: skill.color + '20' }]}>
                                <Text style={styles.skillIconText}>{skill.icon}</Text>
                            </View>

                            {/* スキル情報 */}
                            <View style={styles.skillInfo}>
                                <View style={styles.skillNameRow}>
                                    <Text style={[styles.skillName, { color: themeColors.textPrimary }]}>{skill.name}</Text>
                                    <Text style={[styles.difficulty, { color: themeColors.accent }]}>{diffStars}</Text>
                                </View>
                                <Text style={[styles.skillDesc, { color: themeColors.textSecondary }]} numberOfLines={1}>
                                    {skill.description}
                                </Text>

                                {/* 熟練度ミニバー */}
                                <View style={styles.miniMasteryRow}>
                                    <View style={[styles.miniMasteryBarBg, { backgroundColor: theme.type === 'day' ? '#E9ECEF' : '#1A2A48' }]}>
                                        <View style={[
                                            styles.miniMasteryBarFill,
                                            {
                                                width: `${masteryLevel}%`,
                                                backgroundColor: masteryLevel >= 80 ? themeColors.success
                                                    : masteryLevel >= 40 ? themeColors.xp
                                                        : themeColors.primary,
                                            },
                                        ]} />
                                    </View>
                                    <Text style={[styles.miniMasteryText, { color: themeColors.textSecondary }]}>{masteryLevel}%</Text>
                                </View>
                            </View>

                            {/* 矢印 */}
                            <Text style={[styles.arrow, { color: themeColors.textSecondary }]}>›</Text>
                        </TouchableOpacity>
                    );
                })}

                {/* スキル数の表示 */}
                <Text style={[styles.footerText, { color: themeColors.textSecondary }]}>
                    全 {courseSkills.length} スキル · 表示中 {filteredSkills.length} スキル
                </Text>
            </ScrollView>
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
    filterScroll: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
    },
    filterChip: {
        backgroundColor: colors.backgroundCard,
        borderRadius: borderRadius.round,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        marginRight: spacing.sm,
        borderWidth: 1,
        borderColor: colors.border,
    },
    filterChipActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    filterChipText: {
        fontSize: fontSizes.sm,
        color: colors.textSecondary,
        fontWeight: fontWeights.medium,
    },
    filterChipTextActive: {
        color: colors.textPrimary,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.xxl,
    },
    skillCard: {
        backgroundColor: colors.backgroundCard,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        marginBottom: spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
        borderLeftWidth: 4,
        ...shadows.sm,
    },
    skillIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    skillIconText: {
        fontSize: 22,
    },
    skillInfo: {
        flex: 1,
    },
    skillNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
    },
    skillName: {
        fontSize: fontSizes.md,
        fontWeight: fontWeights.bold,
        color: colors.textPrimary,
        flex: 1,
    },
    difficulty: {
        fontSize: fontSizes.xs,
        color: colors.accent,
    },
    skillDesc: {
        fontSize: fontSizes.xs,
        color: colors.textSecondary,
        marginBottom: spacing.xs,
    },
    miniMasteryRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    miniMasteryBarBg: {
        flex: 1,
        height: 6,
        backgroundColor: colors.backgroundLight,
        borderRadius: 3,
        overflow: 'hidden',
        marginRight: spacing.sm,
    },
    miniMasteryBarFill: {
        height: '100%',
        borderRadius: 3,
    },
    miniMasteryText: {
        fontSize: fontSizes.xs,
        color: colors.textSecondary,
        fontWeight: fontWeights.semibold,
        minWidth: 30,
        textAlign: 'right',
    },
    arrow: {
        fontSize: 24,
        color: colors.textSecondary,
        marginLeft: spacing.sm,
    },
    footerText: {
        fontSize: fontSizes.xs,
        color: colors.textSecondary,
        textAlign: 'center',
        marginTop: spacing.md,
    },
});
