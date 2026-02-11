
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { MyAvatar, ScaleButton, ThemedBackground } from '../components';
import { AVATAR_ITEMS } from '../data/avatarItems';
import { UserProgress, AvatarParts } from '../types';
import { loadUserProgress, saveUserProgress } from '../storage';
import { colors, spacing, borderRadius, fontSizes, fontWeights, shadows } from '../theme';
import { useTheme } from '../context/ThemeContext';

interface AvatarEditScreenProps {
    navigation: any;
}

const CATEGORIES: { id: keyof AvatarParts; label: string }[] = [
    { id: 'body', label: '肌' },
    { id: 'hair', label: '髪' },
    { id: 'clothing', label: '服' },
    { id: 'accessory', label: '装備' },
];

export default function AvatarEditScreen({ navigation }: AvatarEditScreenProps) {
    const { theme } = useTheme();
    const { colors: themeColors } = theme;
    const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
    const [currentParts, setCurrentParts] = useState<AvatarParts | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<keyof AvatarParts>('hair');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const progress = await loadUserProgress();
        setUserProgress(progress);
        setCurrentParts(progress.currentAvatar || {
            body: 'type1',
            hair: 'hair1',
            clothing: 'robe1',
            accessory: 'staff1'
        });
    };

    const handleEquip = (itemId: string) => {
        if (!currentParts) return;

        setCurrentParts({
            ...currentParts,
            [selectedCategory]: itemId
        });
    };

    const handleSave = async () => {
        if (!userProgress || !currentParts) return;
        setIsSaving(true);
        try {
            const newProgress = {
                ...userProgress,
                currentAvatar: currentParts
            };
            await saveUserProgress(newProgress);
            setUserProgress(newProgress);
            navigation.goBack();
        } catch (e) {
            console.error(e);
        } finally {
            setIsSaving(false);
        }
    };

    if (!userProgress || !currentParts) return <View style={[styles.container, { backgroundColor: themeColors.background }]} />;

    // Filter items by category and unlocked status
    const availableItems = Object.values(AVATAR_ITEMS).filter(item =>
        item.type === selectedCategory && (
            (userProgress.unlockedAvatarItems || []).includes(item.id) ||
            ['type1', 'hair1', 'robe1', 'staff1'].includes(item.id) // Defaults always available
        )
    );

    return (
        <ThemedBackground style={styles.container}>
            {/* Avatar Preview */}
            <View style={[styles.previewContainer, { backgroundColor: theme.type === 'day' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)' }]}>
                <MyAvatar parts={currentParts} size={200} />
            </View>

            {/* Category Tabs */}
            <View style={[styles.tabsContainer, { backgroundColor: 'transparent', borderBottomColor: themeColors.border }]}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {CATEGORIES.map(cat => (
                        <TouchableOpacity
                            key={cat.id}
                            style={[
                                styles.tab,
                                { backgroundColor: theme.type === 'day' ? '#DFE6E9' : '#16213E' },
                                selectedCategory === cat.id && { backgroundColor: themeColors.primary }
                            ]}
                            onPress={() => setSelectedCategory(cat.id)}
                        >
                            <Text style={[
                                styles.tabText,
                                { color: themeColors.textSecondary },
                                selectedCategory === cat.id && { color: '#FFFFFF' }
                            ]}>
                                {cat.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Item List */}
            <ScrollView style={styles.itemsContainer} contentContainerStyle={styles.itemsContent}>
                <View style={styles.itemsGrid}>
                    {availableItems.map(item => (
                        <ScaleButton
                            key={item.id}
                            style={[
                                styles.itemCard,
                                { backgroundColor: themeColors.backgroundCard, borderColor: 'transparent' },
                                currentParts[selectedCategory] === item.id && { borderColor: themeColors.accent, backgroundColor: theme.type === 'day' ? '#F0F4F8' : '#16213E' }
                            ]}
                            onPress={() => handleEquip(item.id)}
                        >
                            <View style={[styles.colorDot, { backgroundColor: item.color, borderColor: themeColors.border }]} />
                            <Text style={[styles.itemName, { color: themeColors.textPrimary }]}>{item.name}</Text>
                        </ScaleButton>
                    ))}
                </View>
            </ScrollView>

            {/* Footer Actions */}
            <View style={[styles.footer, { backgroundColor: 'transparent', borderTopColor: themeColors.border }]}>
                <ScaleButton style={styles.cancelButton} onPress={() => navigation.goBack()}>
                    <Text style={[styles.cancelButtonText, { color: themeColors.textSecondary }]}>キャンセル</Text>
                </ScaleButton>
                <ScaleButton
                    style={[styles.saveButton, { backgroundColor: themeColors.primary }]}
                    onPress={handleSave}
                    disabled={isSaving}
                >
                    <Text style={[styles.saveButtonText, { color: '#FFFFFF' }]}>
                        {isSaving ? '保存中...' : '保存する'}
                    </Text>
                </ScaleButton>
            </View>
        </ThemedBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    previewContainer: {
        height: 250,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.backgroundLight,
        marginTop: spacing.md,
    },
    tabsContainer: {
        flexDirection: 'row',
        paddingVertical: spacing.md,
        backgroundColor: colors.background,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    tab: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        marginHorizontal: spacing.sm,
        borderRadius: borderRadius.md,
        backgroundColor: colors.backgroundLight,
    },
    activeTab: {
        backgroundColor: colors.primary,
    },
    tabText: {
        color: colors.textMuted,
        fontWeight: fontWeights.bold,
    },
    activeTabText: {
        color: colors.textPrimary,
    },
    itemsContainer: {
        flex: 1,
    },
    itemsContent: {
        padding: spacing.md,
    },
    itemsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    itemCard: {
        width: '48%',
        backgroundColor: colors.backgroundCard,
        padding: spacing.md,
        marginBottom: spacing.md,
        borderRadius: borderRadius.md,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedItemCard: {
        borderColor: colors.accent,
        backgroundColor: colors.backgroundLight,
    },
    colorDot: {
        width: 24,
        height: 24,
        borderRadius: 12,
        marginBottom: spacing.sm,
        borderWidth: 1,
        borderColor: colors.border,
    },
    itemName: {
        color: colors.textPrimary,
        fontSize: fontSizes.sm,
        fontWeight: fontWeights.medium,
    },
    footer: {
        flexDirection: 'row',
        padding: spacing.md,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        backgroundColor: colors.background,
    },
    cancelButton: {
        flex: 1,
        padding: spacing.md,
        alignItems: 'center',
        marginRight: spacing.sm,
    },
    cancelButtonText: {
        color: colors.textMuted,
        fontWeight: fontWeights.bold,
    },
    saveButton: {
        flex: 1,
        backgroundColor: colors.primary,
        padding: spacing.md,
        borderRadius: borderRadius.md,
        alignItems: 'center',
        marginLeft: spacing.sm,
    },
    saveButtonText: {
        color: colors.textPrimary,
        fontWeight: fontWeights.bold,
    },
});
