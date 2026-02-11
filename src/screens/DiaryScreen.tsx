/**
 * DiaryScreen - 冒険ログ画面 (Phase4)
 * 今日の一言 / コース / タグ / できた度 / メモ を入力し、
 * フィルタ付きの一覧をカード表示。弱点登録機能付き。
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    Alert,
    Modal,
    ScrollView,
    ListRenderItem,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CompositeScreenProps, useFocusEffect } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
    RootStackParamList,
    MainTabParamList,
    AdventureLog,
    SatisfactionLevel,
    CourseId,
    WeaknessEntry,
} from '../types';
import { colors, spacing, borderRadius, fontSizes, fontWeights, shadows } from '../theme';
import {
    loadAdventureLogs,
    addAdventureLog,
    addWeakness,
    loadUserProgress,
    getTodayDateString,
} from '../storage';
import { COURSES, getCourseById } from '../data/courses';
import { useTheme } from '../context/ThemeContext';
import { ThemedBackground } from '../components';

type Props = CompositeScreenProps<
    BottomTabScreenProps<MainTabParamList, 'DiaryTab'>,
    NativeStackScreenProps<RootStackParamList>
>;

// できた度の表示定義
const SATISFACTION_CONFIG: { level: SatisfactionLevel; emoji: string; label: string; color: string }[] = [
    { level: 1, emoji: '😢', label: 'ダメだった', color: '#D63031' },
    { level: 2, emoji: '😐', label: 'いまいち', color: '#E17055' },
    { level: 3, emoji: '🙂', label: 'ふつう', color: '#FDCB6E' },
    { level: 4, emoji: '😊', label: 'よくできた', color: '#00B894' },
    { level: 5, emoji: '🔥', label: '完璧！', color: '#6C5CE7' },
];

// プリセットタグ
const PRESET_TAGS = ['理解', '暗記', '演習', '復習', '新規学習', 'つまずき', '発見'];

export default function DiaryScreen({ navigation }: Props) {
    const insets = useSafeAreaInsets();
    const { theme } = useTheme();
    const { colors: themeColors } = theme;
    // フォーム状態
    const [hitokoto, setHitokoto] = useState('');
    const [selectedCourseId, setSelectedCourseId] = useState<CourseId | null>(null);
    const [tags, setTags] = useState<string[]>([]);
    const [customTag, setCustomTag] = useState('');
    const [satisfaction, setSatisfaction] = useState<SatisfactionLevel>(3);
    const [memo, setMemo] = useState('');

    // ログ一覧
    const [logs, setLogs] = useState<AdventureLog[]>([]);
    const [showForm, setShowForm] = useState(false);

    // フィルタ
    const [filterCourseId, setFilterCourseId] = useState<CourseId | 'all'>('all');
    const [filterTag, setFilterTag] = useState<string | 'all'>('all');
    const [showFilters, setShowFilters] = useState(false);

    // 弱点登録モーダル
    const [weaknessModal, setWeaknessModal] = useState(false);
    const [weaknessLog, setWeaknessLog] = useState<AdventureLog | null>(null);
    const [weaknessTitle, setWeaknessTitle] = useState('');
    const [weaknessDesc, setWeaknessDesc] = useState('');

    // ユーザーのコース
    const [userCourseId, setUserCourseId] = useState<CourseId | null>(null);

    // データ読み込み
    const loadData = useCallback(async () => {
        const [logData, progress] = await Promise.all([
            loadAdventureLogs(),
            loadUserProgress(),
        ]);
        setLogs(logData);
        setUserCourseId(progress.selectedCourseId);
        if (!selectedCourseId && progress.selectedCourseId) {
            setSelectedCourseId(progress.selectedCourseId);
        }
    }, [selectedCourseId]);

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [loadData])
    );

    // 全タグ一覧（ログから集計）
    const allTags = useMemo(() => {
        const tagSet = new Set<string>();
        logs.forEach(log => log.tags.forEach(tag => tagSet.add(tag)));
        return Array.from(tagSet).sort();
    }, [logs]);

    // フィルタ適用後のログ
    const filteredLogs = useMemo(() => {
        return logs.filter(log => {
            if (filterCourseId !== 'all' && log.courseId !== filterCourseId) return false;
            if (filterTag !== 'all' && !log.tags.includes(filterTag)) return false;
            return true;
        });
    }, [logs, filterCourseId, filterTag]);

    // タグ追加/削除
    const toggleTag = (tag: string) => {
        setTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

    const addCustomTag = () => {
        const trimmed = customTag.trim();
        if (trimmed && !tags.includes(trimmed)) {
            setTags(prev => [...prev, trimmed]);
            setCustomTag('');
        }
    };

    // ログ保存
    const saveLog = async () => {
        if (!hitokoto.trim()) {
            Alert.alert('⚠️', '今日の一言を入力してください');
            return;
        }

        const newLog: AdventureLog = {
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            date: new Date().toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            }),
            hitokoto: hitokoto.trim(),
            courseId: selectedCourseId,
            tags,
            satisfaction,
            memo: memo.trim(),
        };

        try {
            const updated = await addAdventureLog(newLog);
            setLogs(updated);

            // フォームリセット
            setHitokoto('');
            setTags([]);
            setCustomTag('');
            setSatisfaction(3);
            setMemo('');
            setShowForm(false);

            Alert.alert(
                '📜 冒険ログ記録完了！',
                `${SATISFACTION_CONFIG[satisfaction - 1].emoji} できた度: ${SATISFACTION_CONFIG[satisfaction - 1].label}`,
            );
        } catch (error) {
            Alert.alert('⚠️ エラー', '保存に失敗しました。');
        }
    };

    // 弱点登録
    const openWeaknessModal = (log: AdventureLog) => {
        setWeaknessLog(log);
        setWeaknessTitle('');
        setWeaknessDesc(log.memo || log.hitokoto);
        setWeaknessModal(true);
    };

    const saveWeakness = async () => {
        if (!weaknessTitle.trim() || !weaknessLog) return;

        const entry: WeaknessEntry = {
            id: Date.now().toString(),
            title: weaknessTitle.trim(),
            description: weaknessDesc.trim(),
            courseId: weaknessLog.courseId,
            tags: weaknessLog.tags,
            sourceLogId: weaknessLog.id,
            createdAt: new Date().toISOString(),
            resolved: false,
        };

        try {
            await addWeakness(entry);
            setWeaknessModal(false);
            Alert.alert('⚡ 弱点登録完了！', '弱点リストに追加しました。克服を目指しましょう！');
        } catch (error) {
            Alert.alert('⚠️ エラー', '弱点の登録に失敗しました。');
        }
    };

    // ログカードの描画
    const renderLogCard: ListRenderItem<AdventureLog> = ({ item, index }) => {
        const sat = SATISFACTION_CONFIG[item.satisfaction - 1];
        const course = item.courseId ? getCourseById(item.courseId) : null;

        return (
            <View style={[styles.logCard, { backgroundColor: themeColors.backgroundCard, borderLeftColor: sat.color, borderColor: themeColors.border }]}>
                {/* ヘッダー */}
                <View style={styles.logCardHeader}>
                    <View style={[styles.logCardDay, { backgroundColor: theme.type === 'day' ? '#F0F4F8' : '#16213E' }]}>
                        <Text style={[styles.logDayText, { color: themeColors.textPrimary }]}>Day {logs.length - index}</Text>
                    </View>
                    <Text style={[styles.logDate, { color: themeColors.textSecondary }]}>{item.date}</Text>
                    <View style={[styles.satBadge, { backgroundColor: sat.color + '20' }]}>
                        <Text style={styles.satEmoji}>{sat.emoji}</Text>
                    </View>
                </View>

                {/* 一言 */}
                <Text style={[styles.logHitokoto, { color: themeColors.textPrimary }]}>{item.hitokoto}</Text>

                {/* コース & タグ */}
                <View style={styles.logMetaRow}>
                    {course && (
                        <View style={[styles.logCourseBadge, { backgroundColor: course.color + '15', borderColor: course.color }]}>
                            <Text style={styles.logCourseIcon}>{course.icon}</Text>
                            <Text style={[styles.logCourseText, { color: course.color }]}>{course.shortName}</Text>
                        </View>
                    )}
                    {item.tags.map(tag => (
                        <View key={tag} style={[styles.logTagBadge, { backgroundColor: theme.type === 'day' ? '#E8EEF4' : '#1A2A48', borderColor: themeColors.border }]}>
                            <Text style={[styles.logTagText, { color: themeColors.textSecondary }]}>#{tag}</Text>
                        </View>
                    ))}
                </View>

                {/* メモ */}
                {item.memo ? (
                    <Text style={[styles.logMemo, { color: themeColors.textSecondary }]} numberOfLines={3}>{item.memo}</Text>
                ) : null}

                {/* 弱点登録ボタン */}
                <TouchableOpacity
                    style={[styles.weaknessButton, { borderColor: themeColors.error + '40', backgroundColor: themeColors.error + '10' }]}
                    onPress={() => openWeaknessModal(item)}
                    activeOpacity={0.7}
                >
                    <Text style={[styles.weaknessButtonText, { color: themeColors.error }]}>⚡ 弱点に登録</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ThemedBackground style={styles.container}>
                <StatusBar barStyle={theme.type === 'day' ? "dark-content" : "light-content"} backgroundColor="transparent" translucent />
                {/* ヘッダー */}
                <View style={[styles.header, { paddingTop: insets.top + spacing.sm, borderBottomColor: themeColors.border }]}>
                    <View style={[styles.headerIcon, { backgroundColor: themeColors.backgroundCard, borderColor: themeColors.accent }]}>
                        <Text style={styles.icon}>📖</Text>
                    </View>
                    <View style={styles.headerText}>
                        <Text style={[styles.title, { color: themeColors.textPrimary }]}>冒険ログ</Text>
                        <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>
                            {logs.length}件の記録{filteredLogs.length !== logs.length ? ` (${filteredLogs.length}件表示中)` : ''}
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={[styles.weaknessListBtn, { backgroundColor: themeColors.error + '20', borderColor: themeColors.error }]}
                        onPress={() => navigation.navigate('WeaknessList')}
                    >
                        <Text style={[styles.weaknessListBtnText, { color: themeColors.error }]}>⚡弱点</Text>
                    </TouchableOpacity>
                </View>

                {/* 新規ログボタン or フォーム */}
                {!showForm ? (
                    <View style={styles.newLogSection}>
                        <TouchableOpacity
                            style={styles.newLogButton}
                            onPress={() => setShowForm(true)}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.newLogIcon}>✍️</Text>
                            <Text style={styles.newLogText}>今日の冒険を記録する</Text>
                            <Text style={styles.newLogArrow}>+</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <ScrollView style={styles.formScroll} nestedScrollEnabled>
                        <View style={styles.formContainer}>
                            {/* フォームヘッダー */}
                            <View style={styles.formHeader}>
                                <Text style={styles.formTitle}>✍️ 新しい冒険ログ</Text>
                                <TouchableOpacity onPress={() => setShowForm(false)}>
                                    <Text style={styles.formClose}>✕</Text>
                                </TouchableOpacity>
                            </View>

                            {/* 今日の一言 */}
                            <View style={styles.formGroup}>
                                <Text style={styles.formLabel}>💬 今日の一言</Text>
                                <TextInput
                                    style={styles.formInput}
                                    placeholder="今日は何をした？（必須）"
                                    placeholderTextColor={colors.textMuted}
                                    value={hitokoto}
                                    onChangeText={setHitokoto}
                                />
                            </View>

                            {/* コース選択 */}
                            <View style={styles.formGroup}>
                                <Text style={styles.formLabel}>🗺️ コース</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                    <TouchableOpacity
                                        style={[
                                            styles.courseChip,
                                            !selectedCourseId && styles.courseChipActive,
                                        ]}
                                        onPress={() => setSelectedCourseId(null)}
                                    >
                                        <Text style={[
                                            styles.courseChipText,
                                            !selectedCourseId && styles.courseChipTextActive,
                                        ]}>フリー</Text>
                                    </TouchableOpacity>
                                    {COURSES.map(course => (
                                        <TouchableOpacity
                                            key={course.id}
                                            style={[
                                                styles.courseChip,
                                                selectedCourseId === course.id && styles.courseChipActive,
                                            ]}
                                            onPress={() => setSelectedCourseId(course.id)}
                                        >
                                            <Text style={[
                                                styles.courseChipText,
                                                selectedCourseId === course.id && styles.courseChipTextActive,
                                            ]}>{course.icon} {course.shortName}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>

                            {/* タグ */}
                            <View style={styles.formGroup}>
                                <Text style={styles.formLabel}>🏷️ タグ</Text>
                                <View style={styles.tagRow}>
                                    {PRESET_TAGS.map(tag => (
                                        <TouchableOpacity
                                            key={tag}
                                            style={[
                                                styles.tagChip,
                                                tags.includes(tag) && styles.tagChipActive,
                                            ]}
                                            onPress={() => toggleTag(tag)}
                                        >
                                            <Text style={[
                                                styles.tagChipText,
                                                tags.includes(tag) && styles.tagChipTextActive,
                                            ]}>#{tag}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                                <View style={styles.customTagRow}>
                                    <TextInput
                                        style={styles.customTagInput}
                                        placeholder="カスタムタグ..."
                                        placeholderTextColor={colors.textMuted}
                                        value={customTag}
                                        onChangeText={setCustomTag}
                                        onSubmitEditing={addCustomTag}
                                    />
                                    <TouchableOpacity
                                        style={styles.customTagBtn}
                                        onPress={addCustomTag}
                                    >
                                        <Text style={styles.customTagBtnText}>追加</Text>
                                    </TouchableOpacity>
                                </View>
                                {tags.length > 0 && (
                                    <View style={styles.selectedTags}>
                                        <Text style={styles.selectedTagsLabel}>選択中: </Text>
                                        {tags.map(tag => (
                                            <TouchableOpacity
                                                key={tag}
                                                style={styles.selectedTagItem}
                                                onPress={() => toggleTag(tag)}
                                            >
                                                <Text style={styles.selectedTagText}>#{tag} ✕</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                )}
                            </View>

                            {/* できた度 */}
                            <View style={styles.formGroup}>
                                <Text style={styles.formLabel}>📊 できた度</Text>
                                <View style={styles.satRow}>
                                    {SATISFACTION_CONFIG.map(config => (
                                        <TouchableOpacity
                                            key={config.level}
                                            style={[
                                                styles.satItem,
                                                satisfaction === config.level && {
                                                    borderColor: config.color,
                                                    backgroundColor: config.color + '15',
                                                },
                                            ]}
                                            onPress={() => setSatisfaction(config.level)}
                                        >
                                            <Text style={styles.satItemEmoji}>{config.emoji}</Text>
                                            <Text style={[
                                                styles.satItemLabel,
                                                satisfaction === config.level && { color: config.color },
                                            ]}>{config.label}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            {/* メモ */}
                            <View style={styles.formGroup}>
                                <Text style={styles.formLabel}>📝 メモ</Text>
                                <TextInput
                                    style={[styles.formInput, styles.formInputMultiline]}
                                    placeholder="詳細メモ（任意）"
                                    placeholderTextColor={colors.textMuted}
                                    value={memo}
                                    onChangeText={setMemo}
                                    multiline
                                    numberOfLines={4}
                                />
                            </View>

                            {/* 保存ボタン */}
                            <TouchableOpacity
                                style={[styles.saveButton, !hitokoto.trim() && styles.saveButtonDisabled]}
                                onPress={saveLog}
                                disabled={!hitokoto.trim()}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.saveButtonText}>📜 記録する</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                )}

                {/* フィルタバー */}
                <View style={styles.filterBar}>
                    <TouchableOpacity
                        style={styles.filterToggle}
                        onPress={() => setShowFilters(!showFilters)}
                    >
                        <Text style={styles.filterToggleText}>
                            🔍 フィルタ {(filterCourseId !== 'all' || filterTag !== 'all') ? '(適用中)' : ''}
                        </Text>
                    </TouchableOpacity>
                    {(filterCourseId !== 'all' || filterTag !== 'all') && (
                        <TouchableOpacity
                            style={styles.filterClearBtn}
                            onPress={() => { setFilterCourseId('all'); setFilterTag('all'); }}
                        >
                            <Text style={styles.filterClearText}>クリア</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {showFilters && (
                    <View style={styles.filterPanel}>
                        {/* コースフィルタ */}
                        <Text style={styles.filterLabel}>コース:</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
                            <TouchableOpacity
                                style={[styles.filterChip, filterCourseId === 'all' && styles.filterChipActive]}
                                onPress={() => setFilterCourseId('all')}
                            >
                                <Text style={[styles.filterChipText, filterCourseId === 'all' && styles.filterChipTextActive]}>すべて</Text>
                            </TouchableOpacity>
                            {COURSES.map(course => (
                                <TouchableOpacity
                                    key={course.id}
                                    style={[styles.filterChip, filterCourseId === course.id && styles.filterChipActive]}
                                    onPress={() => setFilterCourseId(course.id)}
                                >
                                    <Text style={[styles.filterChipText, filterCourseId === course.id && styles.filterChipTextActive]}>
                                        {course.icon} {course.shortName}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        {/* タグフィルタ */}
                        {allTags.length > 0 && (
                            <>
                                <Text style={[styles.filterLabel, { marginTop: spacing.sm }]}>タグ:</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
                                    <TouchableOpacity
                                        style={[styles.filterChip, filterTag === 'all' && styles.filterChipActive]}
                                        onPress={() => setFilterTag('all')}
                                    >
                                        <Text style={[styles.filterChipText, filterTag === 'all' && styles.filterChipTextActive]}>すべて</Text>
                                    </TouchableOpacity>
                                    {allTags.map(tag => (
                                        <TouchableOpacity
                                            key={tag}
                                            style={[styles.filterChip, filterTag === tag && styles.filterChipActive]}
                                            onPress={() => setFilterTag(tag)}
                                        >
                                            <Text style={[styles.filterChipText, filterTag === tag && styles.filterChipTextActive]}>#{tag}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </>
                        )}
                    </View>
                )}

                {/* ログ一覧 */}
                <FlatList
                    data={filteredLogs}
                    renderItem={renderLogCard}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyIcon}>🌟</Text>
                            <Text style={styles.emptyText}>
                                {logs.length === 0
                                    ? 'まだ記録がありません\n冒険の始まりを記録しましょう！'
                                    : 'フィルタ条件に一致するログがありません'}
                            </Text>
                        </View>
                    }
                />

                {/* 弱点登録モーダル */}
                <Modal
                    visible={weaknessModal}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setWeaknessModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>⚡ 弱点を登録</Text>
                            <Text style={styles.modalSubtitle}>
                                苦手なポイントを記録して、あとで重点的に復習しよう！
                            </Text>

                            <TextInput
                                style={styles.modalInput}
                                placeholder="弱点のタイトル（例: ネットワーク層の理解）"
                                placeholderTextColor={colors.textMuted}
                                value={weaknessTitle}
                                onChangeText={setWeaknessTitle}
                            />
                            <TextInput
                                style={[styles.modalInput, styles.modalInputMulti]}
                                placeholder="詳細メモ"
                                placeholderTextColor={colors.textMuted}
                                value={weaknessDesc}
                                onChangeText={setWeaknessDesc}
                                multiline
                                numberOfLines={3}
                            />

                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={styles.modalCancel}
                                    onPress={() => setWeaknessModal(false)}
                                >
                                    <Text style={styles.modalCancelText}>キャンセル</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalSave, !weaknessTitle.trim() && styles.saveButtonDisabled]}
                                    onPress={saveWeakness}
                                    disabled={!weaknessTitle.trim()}
                                >
                                    <Text style={styles.modalSaveText}>登録する</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </ThemedBackground>
        </KeyboardAvoidingView>
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
        padding: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    headerIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.backgroundCard,
        borderWidth: 2,
        borderColor: colors.accent,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    icon: {
        fontSize: 20,
    },
    headerText: {
        flex: 1,
    },
    title: {
        fontSize: fontSizes.xl,
        fontWeight: fontWeights.bold,
        color: colors.textPrimary,
    },
    subtitle: {
        fontSize: fontSizes.xs,
        color: colors.textMuted,
        marginTop: 2,
    },
    weaknessListBtn: {
        backgroundColor: 'rgba(214, 48, 49, 0.15)',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.round,
        borderWidth: 1,
        borderColor: colors.error,
    },
    weaknessListBtnText: {
        fontSize: fontSizes.xs,
        fontWeight: fontWeights.bold,
        color: colors.error,
    },
    // 新規ログボタン
    newLogSection: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
    },
    newLogButton: {
        backgroundColor: colors.success,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        ...shadows.md,
    },
    newLogIcon: {
        fontSize: 20,
        marginRight: spacing.md,
    },
    newLogText: {
        flex: 1,
        fontSize: fontSizes.md,
        fontWeight: fontWeights.bold,
        color: colors.textPrimary,
    },
    newLogArrow: {
        fontSize: fontSizes.xl,
        color: colors.textPrimary,
        fontWeight: fontWeights.bold,
    },
    // フォーム
    formScroll: {
        maxHeight: 420,
    },
    formContainer: {
        backgroundColor: colors.backgroundCard,
        margin: spacing.md,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
        ...shadows.md,
    },
    formHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    formTitle: {
        fontSize: fontSizes.lg,
        fontWeight: fontWeights.bold,
        color: colors.textPrimary,
    },
    formClose: {
        fontSize: fontSizes.xl,
        color: colors.textMuted,
        paddingHorizontal: spacing.sm,
    },
    formGroup: {
        marginBottom: spacing.md,
    },
    formLabel: {
        fontSize: fontSizes.sm,
        fontWeight: fontWeights.semibold,
        color: colors.accent,
        marginBottom: spacing.xs,
    },
    formInput: {
        backgroundColor: colors.backgroundLight,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        fontSize: fontSizes.md,
        color: colors.textPrimary,
        borderWidth: 1,
        borderColor: colors.border,
    },
    formInputMultiline: {
        minHeight: 80,
        textAlignVertical: 'top',
    },
    // コース選択チップ
    courseChip: {
        backgroundColor: colors.backgroundLight,
        borderRadius: borderRadius.round,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        marginRight: spacing.sm,
        borderWidth: 1,
        borderColor: colors.border,
    },
    courseChipActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    courseChipText: {
        fontSize: fontSizes.xs,
        color: colors.textMuted,
    },
    courseChipTextActive: {
        color: colors.textPrimary,
        fontWeight: fontWeights.semibold,
    },
    // タグ
    tagRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: spacing.xs,
    },
    tagChip: {
        backgroundColor: colors.backgroundLight,
        borderRadius: borderRadius.round,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        marginRight: spacing.xs,
        marginBottom: spacing.xs,
        borderWidth: 1,
        borderColor: colors.border,
    },
    tagChipActive: {
        backgroundColor: 'rgba(108, 92, 231, 0.2)',
        borderColor: colors.primary,
    },
    tagChipText: {
        fontSize: fontSizes.xs,
        color: colors.textMuted,
    },
    tagChipTextActive: {
        color: colors.primary,
        fontWeight: fontWeights.semibold,
    },
    customTagRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    customTagInput: {
        flex: 1,
        backgroundColor: colors.backgroundLight,
        borderRadius: borderRadius.md,
        padding: spacing.sm,
        fontSize: fontSizes.sm,
        color: colors.textPrimary,
        borderWidth: 1,
        borderColor: colors.border,
        marginRight: spacing.sm,
    },
    customTagBtn: {
        backgroundColor: colors.primary,
        borderRadius: borderRadius.md,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
    },
    customTagBtnText: {
        fontSize: fontSizes.sm,
        color: colors.textPrimary,
        fontWeight: fontWeights.semibold,
    },
    selectedTags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        marginTop: spacing.xs,
    },
    selectedTagsLabel: {
        fontSize: fontSizes.xs,
        color: colors.textMuted,
    },
    selectedTagItem: {
        backgroundColor: colors.primary,
        borderRadius: borderRadius.round,
        paddingHorizontal: spacing.sm,
        paddingVertical: 2,
        marginRight: spacing.xs,
        marginBottom: 2,
    },
    selectedTagText: {
        fontSize: fontSizes.xs,
        color: colors.textPrimary,
    },
    // できた度
    satRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    satItem: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: spacing.sm,
        marginHorizontal: 2,
        borderRadius: borderRadius.md,
        borderWidth: 2,
        borderColor: colors.border,
        backgroundColor: colors.backgroundLight,
    },
    satItemEmoji: {
        fontSize: 20,
    },
    satItemLabel: {
        fontSize: 9,
        color: colors.textMuted,
        marginTop: 2,
    },
    // 保存ボタン
    saveButton: {
        backgroundColor: colors.success,
        borderRadius: borderRadius.lg,
        paddingVertical: spacing.md,
        alignItems: 'center',
        ...shadows.md,
    },
    saveButtonDisabled: {
        opacity: 0.5,
    },
    saveButtonText: {
        fontSize: fontSizes.md,
        fontWeight: fontWeights.bold,
        color: colors.textPrimary,
    },
    // フィルタバー
    filterBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    filterToggle: {
        flex: 1,
    },
    filterToggleText: {
        fontSize: fontSizes.sm,
        color: colors.primary,
        fontWeight: fontWeights.medium,
    },
    filterClearBtn: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
    },
    filterClearText: {
        fontSize: fontSizes.xs,
        color: colors.error,
    },
    filterPanel: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        backgroundColor: colors.backgroundLight,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    filterLabel: {
        fontSize: fontSizes.xs,
        color: colors.textMuted,
        fontWeight: fontWeights.semibold,
        marginBottom: spacing.xs,
    },
    filterScroll: {
        marginBottom: spacing.xs,
    },
    filterChip: {
        backgroundColor: colors.backgroundCard,
        borderRadius: borderRadius.round,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        marginRight: spacing.sm,
        borderWidth: 1,
        borderColor: colors.border,
    },
    filterChipActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    filterChipText: {
        fontSize: fontSizes.xs,
        color: colors.textMuted,
    },
    filterChipTextActive: {
        color: colors.textPrimary,
        fontWeight: fontWeights.semibold,
    },
    // ログリスト
    list: {
        padding: spacing.md,
        paddingBottom: spacing.xxl,
    },
    logCard: {
        backgroundColor: colors.backgroundCard,
        borderRadius: borderRadius.lg,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
        borderLeftWidth: 4,
        overflow: 'hidden',
        ...shadows.sm,
    },
    logCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.sm,
        paddingHorizontal: spacing.md,
        backgroundColor: colors.backgroundLight,
    },
    logCardDay: {
        marginRight: spacing.sm,
    },
    logDayText: {
        fontSize: fontSizes.sm,
        fontWeight: fontWeights.bold,
        color: colors.accent,
    },
    logDate: {
        flex: 1,
        fontSize: fontSizes.xs,
        color: colors.textMuted,
    },
    satBadge: {
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    satEmoji: {
        fontSize: 14,
    },
    logHitokoto: {
        fontSize: fontSizes.md,
        fontWeight: fontWeights.semibold,
        color: colors.textPrimary,
        paddingHorizontal: spacing.md,
        paddingTop: spacing.sm,
        paddingBottom: spacing.xs,
    },
    logMetaRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: spacing.md,
        marginBottom: spacing.xs,
    },
    logCourseBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.sm,
        paddingVertical: 2,
        borderRadius: borderRadius.round,
        borderWidth: 1,
        marginRight: spacing.xs,
        marginBottom: spacing.xs,
    },
    logCourseIcon: {
        fontSize: 12,
        marginRight: 2,
    },
    logCourseText: {
        fontSize: fontSizes.xs,
        fontWeight: fontWeights.medium,
    },
    logTagBadge: {
        backgroundColor: 'rgba(108, 92, 231, 0.15)',
        paddingHorizontal: spacing.sm,
        paddingVertical: 2,
        borderRadius: borderRadius.round,
        marginRight: spacing.xs,
        marginBottom: spacing.xs,
    },
    logTagText: {
        fontSize: fontSizes.xs,
        color: colors.primary,
    },
    logMemo: {
        fontSize: fontSizes.sm,
        color: colors.textSecondary,
        paddingHorizontal: spacing.md,
        paddingBottom: spacing.sm,
        lineHeight: 20,
    },
    weaknessButton: {
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingVertical: spacing.sm,
        alignItems: 'center',
    },
    weaknessButtonText: {
        fontSize: fontSizes.xs,
        color: colors.error,
        fontWeight: fontWeights.medium,
    },
    // 空表示
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
    // 弱点登録モーダル
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
    },
    modalContent: {
        backgroundColor: colors.backgroundCard,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        width: '100%',
        borderWidth: 1,
        borderColor: colors.border,
        ...shadows.lg,
    },
    modalTitle: {
        fontSize: fontSizes.xl,
        fontWeight: fontWeights.bold,
        color: colors.textPrimary,
        marginBottom: spacing.xs,
    },
    modalSubtitle: {
        fontSize: fontSizes.sm,
        color: colors.textMuted,
        marginBottom: spacing.lg,
    },
    modalInput: {
        backgroundColor: colors.backgroundLight,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        fontSize: fontSizes.md,
        color: colors.textPrimary,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: spacing.md,
    },
    modalInputMulti: {
        minHeight: 80,
        textAlignVertical: 'top',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    modalCancel: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        marginRight: spacing.sm,
    },
    modalCancelText: {
        fontSize: fontSizes.md,
        color: colors.textMuted,
    },
    modalSave: {
        backgroundColor: colors.error,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.md,
    },
    modalSaveText: {
        fontSize: fontSizes.md,
        fontWeight: fontWeights.bold,
        color: colors.textPrimary,
    },
});
