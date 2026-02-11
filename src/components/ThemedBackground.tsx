import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';

interface ThemedBackgroundProps {
    children?: React.ReactNode;
    style?: ViewStyle;
}

export const ThemedBackground: React.FC<ThemedBackgroundProps> = ({ children, style }) => {
    const { theme } = useTheme();

    return (
        <LinearGradient
            colors={theme.backgroundGradient as any} // readonly配列の型不一致回避
            style={[styles.container, style]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            {children}
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
