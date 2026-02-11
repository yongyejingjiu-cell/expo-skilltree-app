import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Theme, DayTheme, NightTheme, MagicTheme, CyberTheme, FireTheme } from '../theme/themes';
import { loadUserProgress } from '../storage'; // We might need to load initial state here, or rely on update

type ThemeContextType = {
    theme: Theme;
    setCourseId: (courseId: string | undefined) => void;
    refreshTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>(NightTheme); // Default to Night for safety/initial load
    const [currentCourseId, setCurrentCourseId] = useState<string | undefined>(undefined);

    // テーマ決定ロジック
    const determineTheme = (courseId?: string): Theme => {
        const now = new Date();
        const hour = now.getHours();
        const isDayTime = hour >= 6 && hour < 18;

        // コースによる特別テーマ判定
        if (courseId) {
            if (courseId === 'magic_mastery') return MagicTheme;
            if (courseId === 'it_passport') return CyberTheme;
            if (courseId === 'muscle_training') return FireTheme;
            // 他のコースは時間帯依存へ
        }

        // 時間帯によるデフォルトテーマ
        return isDayTime ? DayTheme : NightTheme;
    };

    const updateTheme = () => {
        const newTheme = determineTheme(currentCourseId);
        // テーマが変わった場合のみ更新（ID比較）
        setTheme(prev => (prev.id === newTheme.id ? prev : newTheme));
    };

    // 初回マウント時とコース変更時にテーマ更新
    useEffect(() => {
        updateTheme();

        // 1分ごとに時間チェックしてテーマ更新（朝/夜の切り替え用）
        const intervalId = setInterval(updateTheme, 60000);
        return () => clearInterval(intervalId);
    }, [currentCourseId]);

    // アプリ起動時にストレージからコースIDを読み込む（任意）
    useEffect(() => {
        const init = async () => {
            try {
                const progress = await loadUserProgress();
                if (progress?.selectedCourseId) {
                    setCurrentCourseId(progress.selectedCourseId);
                }
            } catch (e) {
                console.log('Failed to load user progress for theme context', e);
            }
        };
        init();
    }, []);

    const value = {
        theme,
        setCourseId: setCurrentCourseId,
        refreshTheme: updateTheme,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};
