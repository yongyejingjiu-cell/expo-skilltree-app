import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withDelay,
    withRepeat,
    withSequence,
    Easing,
    interpolate,
    Extrapolate
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// パーティクル数を大幅に増加
const PARTICLE_COUNT = 100;
const COLORS = [
    '#FFD700', '#FFD700', // Gold (多め)
    '#FF69B4', '#FF1493', // Pink/DeepPink
    '#00CED1', '#40E0D0', // Blue/Turquoise
    '#ADFF2F', '#7FFF00', // Green/Chartreuse
    '#FF4500', '#FF8C00', // Orange/DarkOrange
    '#DA70D6', '#BA55D3', // Purple/Orchid
    '#FFFFFF'             // White
];

interface ParticleProps {
    id: number;
}

const Particle: React.FC<ParticleProps> = ({ id }) => {
    const startX = Math.random() * SCREEN_WIDTH;
    // 横方向の振幅（ひらひらさせる幅）
    const flutterWidth = 30 + Math.random() * 60;
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    // サイズを少し大きく
    const size = 10 + Math.random() * 12;
    const isCircle = Math.random() > 0.6;
    const delay = Math.random() * 2000; // 出現タイミングをさらにバラけさせる
    const duration = 4000 + Math.random() * 2500; // 落下時間を長く (4s - 6.5s)

    const translateY = useSharedValue(-50);
    const rotation = useSharedValue(0);
    const flutter = useSharedValue(0);
    const opacity = useSharedValue(1);

    useEffect(() => {
        // 下方向への落下
        translateY.value = withDelay(delay, withTiming(SCREEN_HEIGHT + 100, {
            duration,
            easing: Easing.bezier(0.3, 0.0, 0.5, 1)
        }));

        // 横方向のひらひら (サイン波のような動きをシミュレート)
        flutter.value = withDelay(delay, withRepeat(
            withSequence(
                withTiming(1, { duration: 1000 + Math.random() * 500, easing: Easing.inOut(Easing.sin) }),
                withTiming(-1, { duration: 1000 + Math.random() * 500, easing: Easing.inOut(Easing.sin) })
            ),
            -1, // 無限に繰り返すが、落下が終われば消える
            true
        ));

        // 回転のバリエーションを増やす
        rotation.value = withDelay(delay, withTiming(Math.random() * 3600, {
            duration,
            easing: Easing.linear
        }));

        // 徐々に透明にする
        opacity.value = withDelay(delay + duration * 0.7, withTiming(0, {
            duration: duration * 0.3
        }));
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateY: translateY.value },
            { translateX: startX + (flutter.value * flutterWidth) },
            { rotate: `${rotation.value}deg` },
            { rotateY: `${rotation.value * 1.5}deg` } // 3D的な回転を追加
        ] as const,
        opacity: opacity.value
    }));

    return (
        <Animated.View
            style={[
                styles.particle,
                animatedStyle,
                {
                    backgroundColor: color,
                    width: size,
                    height: size,
                    borderRadius: isCircle ? size / 2 : 2,
                    zIndex: Math.random() > 0.8 ? 20 : 5 // 一部を手前に、大部分を背後に
                }
            ]}
        />
    );
};

export const Confetti: React.FC = () => {
    // パフォーマンスを考慮し、useMemoで保持
    const particles = useMemo(() => {
        return Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
            <Particle key={i} id={i} />
        ));
    }, []);

    return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
            {particles}
        </View>
    );
};

const styles = StyleSheet.create({
    particle: {
        position: 'absolute',
        top: 0,
        left: 0,
        // 光沢感を出すためのシャドウ (Androidでの重層描画を考慮して最小限に)
        elevation: 2,
    },
});
