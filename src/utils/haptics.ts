import * as Haptics from 'expo-haptics';

/**
 * 触覚フィードバックのヘルパー関数
 */
export const hapticFeedback = {
    // 軽い衝撃（ボタンタップなど）
    light: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
    // 中程度の衝撃
    medium: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
    // 重い衝撃（重要なアクションなど）
    heavy: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),
    // 成功時のフィードバック
    success: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
    // 警告時のフィードバック
    warning: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),
    // エラー時のフィードバック
    error: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),
};
