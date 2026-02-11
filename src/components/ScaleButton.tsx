import React from 'react';
import { TouchableOpacity, TouchableOpacityProps, StyleProp, ViewStyle } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { hapticFeedback } from '../utils/haptics';

interface Props extends TouchableOpacityProps {
    onPress: () => void;
    scaleTo?: number;
    style?: StyleProp<ViewStyle>;
    children: React.ReactNode;
    enableHaptics?: boolean;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

/**
 * 押下時に縮小アニメーションするボタンコンポーネント
 */
export const ScaleButton: React.FC<Props> = ({
    onPress,
    scaleTo = 0.95,
    style,
    children,
    enableHaptics = true,
    ...props
}) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });

    const handlePressIn = () => {
        scale.value = withSpring(scaleTo, { damping: 10, stiffness: 300 });
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, { damping: 10, stiffness: 300 });
    };

    const handlePress = () => {
        if (enableHaptics) {
            hapticFeedback.light();
        }
        onPress();
    };

    return (
        <AnimatedTouchableOpacity
            activeOpacity={1}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handlePress}
            style={[style, animatedStyle]}
            {...props}
        >
            {children}
        </AnimatedTouchableOpacity>
    );
};
