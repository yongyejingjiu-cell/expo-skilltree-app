import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity, Modal, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { colors, fontSizes, fontWeights, spacing, borderRadius } from '../theme';
import { useTheme } from '../context/ThemeContext';
import { ThemedBackground, MyAvatar } from '../components';
import { SocialUser, QuestLog, AvatarParts } from '../types';
import { generateMockLeaderboardData } from '../data/mockSocial';
import { loadUserProgress } from '../storage';

// ランクごとの色
const getRankColor = (rank: number) => {
    switch (rank) {
        case 1: return '#FFD700'; // Gold
        case 2: return '#C0C0C0'; // Silver
        case 3: return '#CD7F32'; // Bronze
        default: return undefined;
    }
};

const getRankIcon = (rank: number) => {
    switch (rank) {
        case 1: return '👑';
        case 2: return '🥈';
        case 3: return '🥉';
        default: return `#${rank}`;
    }
};

export default function LeaderboardScreen() {
    const insets = useSafeAreaInsets();
    const { theme } = useTheme();
    const { colors: themeColors } = theme;

    const [rankingData, setRankingData] = useState<SocialUser[]>([]);
    const [myUser, setMyUser] = useState<SocialUser | null>(null);
    const [currentAvatar, setCurrentAvatar] = useState<AvatarParts | null>(null);
    const [selectedUser, setSelectedUser] = useState<SocialUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    /**
     * 過去7日間のXPを集計
     */
    const calculateWeeklyXP = (logs: QuestLog[]): number => {
        const now = new Date();
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(now.getDate() - 7);

        return logs
            .filter(log => new Date(log.completedAt) >= oneWeekAgo)
            .reduce((sum, log) => sum + log.xpEarned, 0);
    };

    const loadData = async () => {
        try {
            const progress = await loadUserProgress();
            setCurrentAvatar(progress.currentAvatar);
            const weeklyXP = calculateWeeklyXP(progress.questLogs);

            // モックデータ生成
            const data = generateMockLeaderboardData(weeklyXP);

            // 自分を探す
            const me = data.find(u => u.isCurrentUser) || null;
            if (me) {
                me.name = 'あなた';
            }

            setRankingData(data);
            setMyUser(me);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    const onRefresh = async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    };
    const renderItem = ({ item }: { item: SocialUser }) => {
        const isMe = item.isCurrentUser;
        const rankColor = getRankColor(item.rank);

        return (
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setSelectedUser(item)}
                style={[
                    styles.rankItem,
                    { backgroundColor: themeColors.backgroundCard, borderColor: themeColors.border },
                    isMe && { backgroundColor: themeColors.backgroundCard, borderColor: themeColors.primary, borderWidth: 2 },
                    item.rank === 1 && { shadowColor: '#FFD700', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 8, elevation: 8 }
                ]}
            >
                <View style={styles.rankNumberContainer}>
                    <Text style={[
                        styles.rankNumber,
                        { color: themeColors.textSecondary },
                        item.rank <= 3 && { color: rankColor || themeColors.textSecondary, fontSize: 24 }
                    ]}>
                        {getRankIcon(item.rank)}
                    </Text>
                </View>

                <View style={styles.avatarContainer}>
                    {isMe && currentAvatar ? (
                        <MyAvatar parts={currentAvatar} size={30} />
                    ) : (
                        <Text style={styles.avatarText}>{item.avatar}</Text>
                    )}
                </View>

                <View style={styles.userInfo}>
                    <View style={styles.nameRow}>
                        <Text style={[styles.userName, { color: themeColors.textPrimary }, isMe && { color: themeColors.primary }]}>
                            {item.name}
                        </Text>
                        {item.rank <= 3 && <Text style={styles.topBadge}>ACE</Text>}
                    </View>
                    <Text style={[styles.userLevel, { color: themeColors.textSecondary }]}>
                        Lv.{item.level} {item.recentTitle ? `・ ${item.recentTitle}` : ''}
                    </Text>
                </View>

                <View style={styles.xpContainer}>
                    <Text style={[styles.xpText, { color: themeColors.accent }]}>{item.weeklyXP.toLocaleString()} XP</Text>
                    {item.changeFromLastWeek === 'up' && <Text style={styles.trendUp}>▲</Text>}
                    {item.changeFromLastWeek === 'down' && <Text style={styles.trendDown}>▼</Text>}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <ThemedBackground style={styles.container}>
            <View style={[styles.header, { backgroundColor: themeColors.primary, paddingTop: insets.top + spacing.md }]}>
                <Text style={styles.headerTitle}>週間ランキング 🏆</Text>
                <Text style={styles.headerSubtitle}>ライバルと競い合おう！</Text>
            </View>

            {myUser && (
                <View style={[styles.mySummary, { backgroundColor: themeColors.backgroundCard }]}>
                    <View style={styles.mySummaryContent}>
                        <View>
                            <Text style={[styles.mySummaryLabel, { color: themeColors.textSecondary }]}>現在の順位</Text>
                            <Text style={[styles.mySummaryRank, { color: themeColors.primary }]}>{myUser.rank}位</Text>
                        </View>
                        <View style={[styles.separator, { backgroundColor: themeColors.border }]} />
                        <View>
                            <Text style={[styles.mySummaryLabel, { color: themeColors.textSecondary }]}>今週の獲得XP</Text>
                            <Text style={[styles.mySummaryXP, { color: themeColors.textPrimary }]}>{myUser.weeklyXP.toLocaleString()} XP</Text>
                        </View>
                    </View>
                </View>
            )}

            <FlatList
                data={rankingData}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={[
                    styles.listContent,
                    { paddingBottom: insets.bottom + spacing.xl }
                ]}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={themeColors.primary}
                        colors={[themeColors.primary]}
                    />
                }
                getItemLayout={(data, index) => (
                    { length: 80, offset: 80 * index, index }
                )}
                initialScrollIndex={myUser && myUser.rank > 5 ? myUser.rank - 3 : 0}
                onScrollToIndexFailed={info => {
                    console.log('Scroll to index failed', info);
                }}
            />

            {/* ライバル詳細モーダル */}
            <Modal
                visible={!!selectedUser}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setSelectedUser(null)}
            >
                <Pressable
                    style={styles.modalOverlay}
                    onPress={() => setSelectedUser(null)}
                >
                    <Pressable style={[styles.modalContent, { backgroundColor: themeColors.backgroundCard }]}>
                        {selectedUser && (
                            <>
                                <View style={styles.modalHeader}>
                                    <View style={styles.modalAvatarContainer}>
                                        <Text style={styles.modalAvatarText}>{selectedUser.avatar}</Text>
                                    </View>
                                    <Text style={[styles.modalName, { color: themeColors.textPrimary }]}>
                                        {selectedUser.name}
                                    </Text>
                                    {selectedUser.recentTitle && (
                                        <Text style={[styles.modalTitle, { color: themeColors.accent }]}>
                                            称号: {selectedUser.recentTitle}
                                        </Text>
                                    )}
                                </View>

                                <View style={[styles.modalStats, { borderTopColor: themeColors.border, borderBottomColor: themeColors.border }]}>
                                    <View style={styles.modalStatItem}>
                                        <Text style={[styles.modalStatLabel, { color: themeColors.textSecondary }]}>順位</Text>
                                        <Text style={[styles.modalStatValue, { color: themeColors.primary }]}>{selectedUser.rank}位</Text>
                                    </View>
                                    <View style={styles.modalStatDivider} />
                                    <View style={styles.modalStatItem}>
                                        <Text style={[styles.modalStatLabel, { color: themeColors.textSecondary }]}>週間XP</Text>
                                        <Text style={[styles.modalStatValue, { color: themeColors.accent }]}>{selectedUser.weeklyXP}</Text>
                                    </View>
                                    <View style={styles.modalStatDivider} />
                                    <View style={styles.modalStatItem}>
                                        <Text style={[styles.modalStatLabel, { color: themeColors.textSecondary }]}>レベル</Text>
                                        <Text style={[styles.modalStatValue, { color: themeColors.textPrimary }]}>{selectedUser.level}</Text>
                                    </View>
                                </View>

                                <View style={styles.modalDetails}>
                                    <Text style={[styles.modalDetailLabel, { color: themeColors.textSecondary }]}>
                                        推しコース:
                                    </Text>
                                    <Text style={[styles.modalDetailValue, { color: themeColors.textPrimary }]}>
                                        {selectedUser.favoriteCourse || 'なし'}
                                    </Text>
                                </View>

                                <TouchableOpacity
                                    style={[styles.closeButton, { backgroundColor: themeColors.primary }]}
                                    onPress={() => setSelectedUser(null)}
                                >
                                    <Text style={styles.closeButtonText}>閉じる</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </Pressable>
                </Pressable>
            </Modal>
        </ThemedBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: spacing.md,
        paddingBottom: spacing.lg,
        borderBottomLeftRadius: borderRadius.lg,
        borderBottomRightRadius: borderRadius.lg,
        marginBottom: spacing.md,
        zIndex: 10,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    headerTitle: {
        fontSize: fontSizes.xl,
        fontWeight: fontWeights.bold,
        color: '#fff',
        textAlign: 'center',
        marginBottom: spacing.xs,
    },
    headerSubtitle: {
        fontSize: fontSizes.sm,
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
    },
    mySummary: {
        marginHorizontal: spacing.md,
        marginTop: -spacing.lg,
        marginBottom: spacing.md,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        zIndex: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    mySummaryContent: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    mySummaryLabel: {
        fontSize: fontSizes.xs,
        textAlign: 'center',
        marginBottom: 4,
    },
    mySummaryRank: {
        fontSize: fontSizes.xl,
        fontWeight: fontWeights.bold,
        textAlign: 'center',
    },
    mySummaryXP: {
        fontSize: fontSizes.lg,
        fontWeight: fontWeights.bold,
        textAlign: 'center',
    },
    separator: {
        width: 1,
        height: '80%',
    },
    listContent: {
        paddingHorizontal: spacing.md,
        paddingTop: spacing.xs,
    },
    rankItem: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: borderRadius.md,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.md,
        marginBottom: spacing.sm,
        borderWidth: 1,
    },
    rankNumberContainer: {
        width: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.sm,
    },
    rankNumber: {
        fontSize: fontSizes.md,
        fontWeight: fontWeights.bold,
    },
    avatarContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.backgroundLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    avatarText: {
        fontSize: 24,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: fontSizes.md,
        fontWeight: fontWeights.bold,
        marginBottom: 2,
    },
    userLevel: {
        fontSize: fontSizes.xs,
    },
    xpContainer: {
        alignItems: 'flex-end',
    },
    xpText: {
        fontSize: fontSizes.md,
        fontWeight: fontWeights.bold,
    },
    trendUp: {
        color: colors.success,
        fontSize: 10,
    },
    trendDown: {
        color: colors.error,
        fontSize: 10,
    },
    // 追加スタイル
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    topBadge: {
        backgroundColor: '#FFD700',
        color: '#000',
        fontSize: 10,
        fontWeight: 'bold',
        paddingHorizontal: 4,
        paddingVertical: 1,
        borderRadius: 4,
        marginLeft: 6,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
    },
    modalContent: {
        width: '100%',
        borderRadius: borderRadius.lg,
        padding: spacing.xl,
        alignItems: 'center',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    modalHeader: {
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    modalAvatarContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.backgroundLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.md,
    },
    modalAvatarText: {
        fontSize: 48,
    },
    modalName: {
        fontSize: fontSizes.xl,
        fontWeight: fontWeights.bold,
        marginBottom: 4,
    },
    modalTitle: {
        fontSize: fontSizes.sm,
        fontWeight: fontWeights.medium,
    },
    modalStats: {
        flexDirection: 'row',
        width: '100%',
        paddingVertical: spacing.md,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        marginBottom: spacing.lg,
    },
    modalStatItem: {
        flex: 1,
        alignItems: 'center',
    },
    modalStatLabel: {
        fontSize: fontSizes.xs,
        marginBottom: 4,
    },
    modalStatValue: {
        fontSize: fontSizes.md,
        fontWeight: fontWeights.bold,
    },
    modalStatDivider: {
        width: 1,
        backgroundColor: colors.border,
    },
    modalDetails: {
        width: '100%',
        marginBottom: spacing.xl,
    },
    modalDetailLabel: {
        fontSize: fontSizes.sm,
        marginBottom: 4,
    },
    modalDetailValue: {
        fontSize: fontSizes.md,
        fontWeight: fontWeights.semibold,
    },
    closeButton: {
        width: '100%',
        paddingVertical: spacing.md,
        borderRadius: borderRadius.md,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#fff',
        fontSize: fontSizes.md,
        fontWeight: fontWeights.bold,
    },
});
