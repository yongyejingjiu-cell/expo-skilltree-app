/**
 * App.tsx
 * RPG/育成UI風アプリのエントリーポイント
 * SplashScreen表示後、メインナビゲーションへ遷移
 */

import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNavigator from './src/navigation/AppNavigator';
import { ThemeProvider } from './src/context/ThemeContext';
import SplashScreen from './src/screens/SplashScreen';
import { colors } from './src/theme';

export default function App() {
    const [isLoading, setIsLoading] = useState(true);

    const handleSplashFinish = () => {
        setIsLoading(false);
    };

    // スプラッシュ画面表示中
    if (isLoading) {
        return (
            <SafeAreaProvider>
                <StatusBar barStyle="light-content" backgroundColor={colors.background} translucent />
                <SplashScreen onFinish={handleSplashFinish} />
            </SafeAreaProvider>
        );
    }

    // メインアプリ
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <ThemeProvider>
                <SafeAreaProvider>
                    <NavigationContainer>
                        <StatusBar barStyle="light-content" backgroundColor={colors.background} translucent />
                        <AppNavigator />
                    </NavigationContainer>
                </SafeAreaProvider>
            </ThemeProvider>
        </GestureHandlerRootView>
    );
}
