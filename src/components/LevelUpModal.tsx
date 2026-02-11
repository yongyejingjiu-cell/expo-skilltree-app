import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';
import { colors, fontSizes, fontWeights, spacing, borderRadius } from '../theme';
import { ScaleButton } from './ScaleButton';
import { hapticFeedback } from '../utils/haptics';

interface Props {
    visible: boolean;
    level: number;
    onClose: () => void;
}

const { width } = Dimensions.get('window');

/**
 * レベルアップ時に表示するモーダルコンポーネント
 * Lottieアニメーションと豪華な演出を含む
 */
const LevelUpModal: React.FC<Props> = ({ visible, level, onClose }) => {
    const animationRef = useRef<LottieView>(null);

    useEffect(() => {
        if (visible) {
            // アニメーション再生
            setTimeout(() => {
                animationRef.current?.play();
            }, 100);

            // 成功時のHapticsフィードバック
            hapticFeedback.success();
        }
    }, [visible]);

    if (!visible) return null;

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
            statusBarTranslucent
        >
            <View style={styles.container}>
                <View style={styles.overlay} />
                <View style={styles.content}>
                    <View style={styles.lottieContainer}>
                        <LottieView
                            ref={animationRef}
                            source={require('../assets/animations/confetti.json')}
                            autoPlay={false}
                            loop={false}
                            style={styles.lottie}
                            resizeMode="cover"
                        />
                    </View>
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
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
    },
    content: {
        width: width * 0.85,
        backgroundColor: colors.backgroundCard,
        borderRadius: borderRadius.xl,
        padding: spacing.xl,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: colors.accent,
        elevation: 10,
        shadowColor: colors.accent,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        zIndex: 10,
    },
    lottieContainer: {
        position: 'absolute',
        top: -100,
        width: 300,
        height: 300,
        pointerEvents: 'none',
        zIndex: 11,
    },
    lottie: {
        width: '100%',
        height: '100%',
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
