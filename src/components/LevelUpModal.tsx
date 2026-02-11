import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, Dimensions, StatusBar } from 'react-native';
import { colors, fontSizes, fontWeights, spacing, borderRadius } from '../theme';
import { ScaleButton } from './ScaleButton';
import { hapticFeedback } from '../utils/haptics';
import { Confetti } from './Confetti';

interface Props {
    visible: boolean;
    level: number;
    onClose: () => void;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('screen');

/**
 * レベルアップ時に表示するモーダルコンポーネント
 */
const LevelUpModal: React.FC<Props> = ({ visible, level, onClose }) => {
    useEffect(() => {
        if (visible) {
            hapticFeedback.success();
            console.log('LevelUpModal is now visible, custom confetti system started');
        }
    }, [visible]);

    if (!visible) return null;

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
            statusBarTranslucent={true}
        >
            <View style={styles.modalContainer}>
                {/* 1. 背景レイヤーとしての暗転 */}
                <View style={styles.overlay} />

                {/* 2. カスタム演出レイヤー (Lottieの代わり) */}
                {visible && <Confetti />}

                {/* 3. 中央のコンテンツボックス */}
                <View style={styles.content}>
                    <Text style={styles.congratsTitle}>CONGRATULATIONS!</Text>
                    <Text style={styles.title}>LEVEL UP!</Text>

                    <View style={styles.levelBadge}>
                        <Text style={styles.levelText}>{level}</Text>
                    </View>

                    <Text style={styles.description}>
                        おめでとう！{'\n'}新しいレベルに到達しました。
                    </Text>

                    <ScaleButton onPress={onClose} style={styles.button}>
                        <Text style={styles.buttonText}>冒険を続ける</Text>
                    </ScaleButton>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        zIndex: 1,
    },
    content: {
        width: SCREEN_WIDTH * 0.85,
        backgroundColor: colors.backgroundCard,
        borderRadius: borderRadius.xl,
        padding: spacing.xl,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: colors.accent,
        elevation: 10, // Androidでの重なり順を保証
        zIndex: 10,
    },
    congratsTitle: {
        fontSize: fontSizes.lg,
        fontWeight: fontWeights.bold,
        color: colors.accent,
        letterSpacing: 2,
        marginBottom: spacing.xs,
        textAlign: 'center',
    },
    title: {
        fontSize: fontSizes.hero,
        fontWeight: fontWeights.extrabold,
        color: colors.textPrimary,
        marginBottom: spacing.lg,
        textShadowColor: colors.primary,
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
        textAlign: 'center',
    },
    levelBadge: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: colors.accent,
        marginBottom: spacing.lg,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 8,
    },
    levelText: {
        fontSize: 56,
        fontWeight: fontWeights.extrabold,
        color: '#FFFFFF',
    },
    description: {
        fontSize: fontSizes.md,
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: spacing.xl,
        lineHeight: 24,
    },
    button: {
        backgroundColor: colors.accent,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.xl,
        borderRadius: borderRadius.round,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: colors.background,
        fontSize: fontSizes.lg,
        fontWeight: fontWeights.bold,
    },
});

export default LevelUpModal;
