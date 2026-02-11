/**
 * SkillTreeScreen - スキルツリー画面 (Phase5)
 * コースごとのスキルツリーをビジュアル表示。
 * ノードタップで詳細画面へ遷移。熟練度に応じて状態が変化。
 */

import React, { useState, useCallback, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { RootStackParamList, SkillMasteryMap, SkillNodeStatus, SkillTreeNode, SkillTreeEdge, Skill } from '../types';
import { colors, spacing, borderRadius, fontSizes, fontWeights, shadows } from '../theme';
import { loadSkillMastery } from '../storage';
import { getSkillTree } from '../data/skillTrees';
import { getSkillById, getSkillsByCourse } from '../data/skills';
import { getCourseById } from '../data/courses';
import { SkillTreeRenderer } from '../components/SkillTreeRenderer';
import { useTheme } from '../context/ThemeContext';
import { ThemedBackground } from '../components';

type Props = NativeStackScreenProps<RootStackParamList, 'SkillTree'>;

const SCREEN_WIDTH = Dimensions.get('window').width;
const TREE_PADDING = 24;
const TREE_WIDTH = SCREEN_WIDTH - TREE_PADDING * 2;
const NODE_SIZE = 72;
const NODE_RADIUS = NODE_SIZE / 2;

/**
 * ノードの状態を計算
 */
function getNodeStatus(
    node: SkillTreeNode,
    masteryMap: SkillMasteryMap,
    edges: SkillTreeEdge[],
    allNodes: SkillTreeNode[],
): SkillNodeStatus {
    const mastery = masteryMap[node.skillId];
    const masteryLevel = mastery?.masteryLevel ?? 0;

    // しきい値以上なら習得済み
    if (masteryLevel >= node.masteryThreshold) {
        return 'mastered';
    }

    // 前提ノードがあるかチェック
    const prerequisites = edges
        .filter(e => e.to === node.skillId)
        .map(e => e.from);

    if (prerequisites.length === 0) {
        // 前提なし → 学習中 or available
        return masteryLevel > 0 ? 'learning' : 'available';
    }

    // 前提ノードがすべて習得済みか？
    const allPrereqsMastered = prerequisites.every(preId => {
        const preNode = allNodes.find(n => n.skillId === preId);
        if (!preNode) return true;
        const preMastery = masteryMap[preId]?.masteryLevel ?? 0;
        return preMastery >= preNode.masteryThreshold;
    });

    if (!allPrereqsMastered) {
        return masteryLevel > 0 ? 'learning' : 'locked';
    }

    return masteryLevel > 0 ? 'learning' : 'available';
}

/**
 * ステータスに応じたスタイル取得
 */
const getStatusConfig = (status: SkillNodeStatus, themeColors: any) => {
    switch (status) {
        case 'mastered':
            return {
                borderColor: themeColors.success,
                label: '✅ 習得済み',
                labelColor: themeColors.success,
            };
        case 'learning':
            return {
                borderColor: '#FDCB6E',
                label: '📖 学習中',
                labelColor: '#FDCB6E',
            };
        case 'available':
            return {
                borderColor: themeColors.primary,
                label: '🔓 解放済み',
                labelColor: themeColors.primary,
            };
        case 'locked':
            return {
                borderColor: themeColors.textSecondary,
                label: '🔒 未解放',
                labelColor: themeColors.textSecondary,
            };
    }
};

export default function SkillTreeScreen({ route, navigation }: Props) {
    const insets = useSafeAreaInsets();
    const { theme } = useTheme();
    const { colors: themeColors } = theme;
    const { courseId } = route.params;
    const tree = getSkillTree(courseId);
    const course = getCourseById(courseId);

    const [masteryMap, setMasteryMap] = useState<SkillMasteryMap>({});

    useFocusEffect(
        useCallback(() => {
            const load = async () => {
                const map = await loadSkillMastery();
                setMasteryMap(map);
            };
            load();
        }, [])
    );

    // ノードの状態を計算
    const nodeStatuses = useMemo(() => {
        if (!tree) return {};
        const statuses: Record<string, SkillNodeStatus> = {};
        tree.nodes.forEach(node => {
            statuses[node.skillId] = getNodeStatus(node, masteryMap, tree.edges, tree.nodes);
        });
        return statuses;
    }, [tree, masteryMap]);

    // 習得済みの数
    const masteredCount = Object.values(nodeStatuses).filter(s => s === 'mastered').length;
    const totalNodes = tree?.nodes.length ?? 0;

    // スキルデータのMapを作成
    const skillsMap = useMemo(() => {
        const skills = getSkillsByCourse(courseId);
        const map: Record<string, Skill> = {};
        skills.forEach(s => map[s.id] = s);
        return map;
    }, [courseId]);

    // ツリーが見つからない場合
    if (!tree || !course) {
        return (
            <View style={[styles.errorContainer, { backgroundColor: themeColors.background }]}>
                <Text style={[styles.errorText, { color: themeColors.textSecondary }]}>スキルツリーが見つかりません</Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={[styles.errorBack, { color: themeColors.primary }]}>← 戻る</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const handleNodePress = (skillId: string) => {
        const status = nodeStatuses[skillId];
        if (status !== 'locked') {
            navigation.navigate('SkillDetail', { skillId: skillId });
        }
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
                <View style={styles.headerCenter}>
                    <Text style={[styles.headerTitle, { color: themeColors.textPrimary }]}>🌳 {tree.title}</Text>
                    <Text style={[styles.headerSub, { color: themeColors.textSecondary }]}>{tree.description}</Text>
                </View>
                <View style={styles.headerSpacer} />
            </View>

            {/* 進捗サマリー */}
            <View style={[styles.progressBar, { backgroundColor: theme.type === 'day' ? '#F8F9FA' : '#16213E' }]}>
                <View style={styles.progressInfo}>
                    <Text style={[styles.progressLabel, { color: themeColors.textPrimary }]}>
                        {course.icon} {course.shortName}
                    </Text>
                    <Text style={[styles.progressValue, { color: themeColors.accent }]}>
                        {masteredCount}/{totalNodes} 習得
                    </Text>
                </View>
                <View style={[styles.progressTrack, { backgroundColor: themeColors.border }]}>
                    <View style={[
                        styles.progressFill,
                        {
                            width: totalNodes > 0 ? `${(masteredCount / totalNodes) * 100}%` : '0%',
                            backgroundColor: course.color,
                        },
                    ]} />
                </View>
            </View>

            {/* 凡例 */}
            <View style={[styles.legend, { borderBottomColor: themeColors.border }]}>
                {(['mastered', 'learning', 'available', 'locked'] as SkillNodeStatus[]).map(status => {
                    const config = getStatusConfig(status, themeColors);
                    if (!config) return null;
                    return (
                        <View key={status} style={styles.legendItem}>
                            <View style={[styles.legendDot, { backgroundColor: config.borderColor }]} />
                            <Text style={[styles.legendText, { color: config.labelColor }]}>{config.label}</Text>
                        </View>
                    );
                })}
            </View>

            {/* ツリー表示 */}
            <View style={[styles.treeContainer, { backgroundColor: 'transparent' }]}>
                <SkillTreeRenderer
                    nodes={tree.nodes}
                    edges={tree.edges}
                    nodeStatuses={nodeStatuses}
                    onNodePress={handleNodePress}
                    skills={skillsMap}
                />
            </View>

            <View style={styles.footerHint}>
                <Text style={styles.footerHintText}>ピンチでズーム / ドラッグで移動</Text>
            </View>
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
    header: {
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.md,
        borderBottomWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
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
    headerCenter: {
        flex: 1,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: fontSizes.lg,
        fontWeight: fontWeights.bold,
        color: colors.textPrimary,
    },
    headerSub: {
        fontSize: fontSizes.xs,
        color: colors.textMuted,
        marginTop: 2,
    },
    headerSpacer: {
        width: 50,
    },
    progressBar: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        backgroundColor: colors.backgroundLight,
    },
    progressInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.xs,
    },
    progressLabel: {
        fontSize: fontSizes.sm,
        color: colors.textPrimary,
        fontWeight: fontWeights.medium,
    },
    progressValue: {
        fontSize: fontSizes.sm,
        color: colors.accent,
        fontWeight: fontWeights.bold,
    },
    progressTrack: {
        height: 8,
        backgroundColor: colors.backgroundCard,
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 4,
    },
    legend: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: spacing.sm,
    },
    legendDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 4,
        backgroundColor: colors.textSecondary,
    },
    legendText: {
        fontSize: 10,
    },
    treeContainer: {
        flex: 1,
        backgroundColor: '#1E1E1E',
    },
    footerHint: {
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        pointerEvents: 'none',
    },
    footerHintText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 10,
    },
});
