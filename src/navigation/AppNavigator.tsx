/**
 * AppNavigator
 * Stack Navigator + BottomTab Navigator を統合
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import HomeScreen from '../screens/HomeScreen';
import DetailScreen from '../screens/DetailScreen';
import DiaryScreen from '../screens/DiaryScreen';
import QuestBoardScreen from '../screens/QuestBoardScreen';
import StatusScreen from '../screens/StatusScreen';
import CourseSelectScreen from '../screens/CourseSelectScreen';
import SkillDetailScreen from '../screens/SkillDetailScreen';
import SkillListScreen from '../screens/SkillListScreen';
import WeaknessListScreen from '../screens/WeaknessListScreen';
import SkillTreeScreen from '../screens/SkillTreeScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';
import AvatarEditScreen from '../screens/AvatarEditScreen';
import { RootStackParamList, MainTabParamList } from '../types';
import { colors, fontSizes, fontWeights, spacing, borderRadius } from '../theme';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// カスタムタブアイコン
interface TabIconProps {
    focused: boolean;
    icon: string;
}

const TabIcon = ({ focused, icon }: TabIconProps) => (
    <View style={[styles.tabIconContainer, focused && styles.tabIconFocused]}>
        <Text style={styles.tabIcon}>{icon}</Text>
    </View>
);

// BottomTab Navigator
function MainTabNavigator() {
    const insets = useSafeAreaInsets();

    return (
        <Tab.Navigator
            id="main-tabs"
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    ...styles.tabBar,
                    height: 70 + insets.bottom,
                    paddingBottom: spacing.sm + insets.bottom,
                },
                tabBarActiveTintColor: colors.accent,
                tabBarInactiveTintColor: colors.textMuted,
                tabBarLabelStyle: styles.tabLabel,
            }}
        >
            <Tab.Screen
                name="HomeTab"
                component={HomeScreen}
                options={{
                    title: 'ホーム',
                    tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="🏠" />,
                }}
            />
            <Tab.Screen
                name="QuestsTab"
                component={QuestBoardScreen}
                options={{
                    title: 'クエスト',
                    tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="⚔️" />,
                }}
            />
            <Tab.Screen
                name="LeaderboardTab"
                component={LeaderboardScreen}
                options={{
                    title: 'ランキング',
                    tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="🏆" />,
                }}
            />
            <Tab.Screen
                name="DiaryTab"
                component={DiaryScreen}
                options={{
                    title: '冒険ログ',
                    tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="📖" />,
                }}
            />
            <Tab.Screen
                name="ProfileTab"
                component={StatusScreen}
                options={{
                    title: 'ステータス',
                    tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="👤" />,
                }}
            />
        </Tab.Navigator>
    );
}

// メインのStack Navigator
export default function AppNavigator() {
    return (
        <Stack.Navigator
            id="root"
            initialRouteName="MainTabs"
            screenOptions={{
                headerStyle: styles.header,
                headerTintColor: colors.textPrimary,
                headerTitleStyle: styles.headerTitle,
                headerShadowVisible: false,
                contentStyle: { backgroundColor: colors.background },
            }}
        >
            <Stack.Screen
                name="MainTabs"
                component={MainTabNavigator}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{ title: 'IT学習クエスト 🎓' }}
            />
            <Stack.Screen
                name="Detail"
                component={DetailScreen}
                options={{ title: 'クエスト詳細' }}
            />
            <Stack.Screen
                name="Diary"
                component={DiaryScreen}
                options={{ title: '冒険日記 📝' }}
            />
            <Stack.Screen
                name="CourseSelect"
                component={CourseSelectScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="SkillDetail"
                component={SkillDetailScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="SkillList"
                component={SkillListScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="WeaknessList"
                component={WeaknessListScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="SkillTree"
                component={SkillTreeScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="AvatarEdit"
                component={AvatarEditScreen}
                options={{ title: 'アバター編集', headerShown: true }}
            />
        </Stack.Navigator>
    );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: colors.backgroundLight,
    },
    headerTitle: {
        fontWeight: fontWeights.bold,
        fontSize: fontSizes.lg,
        color: colors.textPrimary,
    },
    tabBar: {
        backgroundColor: colors.backgroundLight,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingTop: spacing.xs,
    },
    tabLabel: {
        fontSize: fontSizes.xs,
        fontWeight: fontWeights.medium,
        marginTop: spacing.xs,
    },
    tabIconContainer: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.md,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabIconFocused: {
        backgroundColor: 'rgba(108, 92, 231, 0.2)',
    },
    tabIcon: {
        fontSize: 22,
    },
});
