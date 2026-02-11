import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Svg, { Path, Circle, G, Text as SvgText, Defs, RadialGradient, Stop } from 'react-native-svg';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { SkillTreeNode, SkillTreeEdge, SkillNodeStatus, Skill } from '../types';
import { useTheme } from '../context/ThemeContext';

const SCREEN_WIDTH = Dimensions.get('window').width;

const NODE_SIZE = 72;
const NODE_RADIUS = NODE_SIZE / 2;
const CANVAS_PADDING = 100; // Extra padding around the tree

interface SkillTreeRendererProps {
    nodes: SkillTreeNode[];
    edges: SkillTreeEdge[];
    nodeStatuses: Record<string, SkillNodeStatus>;
    onNodePress: (skillId: string) => void;
    skills: Record<string, Skill>;
}

export const SkillTreeRenderer: React.FC<SkillTreeRendererProps> = ({
    nodes,
    edges,
    nodeStatuses,
    onNodePress,
    skills,
}) => {
    const { theme } = useTheme();
    const { colors: themeColors } = theme;

    if (!nodes || nodes.length === 0) return null;

    // Helper to get status colors
    const getStatusColor = (status?: SkillNodeStatus) => {
        switch (status) {
            case 'mastered': return themeColors.success;
            case 'learning': return '#FDCB6E'; // 固定色 or themeColors.warning
            case 'available': return themeColors.primary;
            case 'locked':
            case undefined:
                return themeColors.textMuted;
            default: return themeColors.textMuted;
        }
    };

    // Calculate bounding box of the tree to determine canvas size
    const maxY = Math.max(...nodes.map(n => n.y), 0);

    // Map percentage x (0-100) to pixel width (e.g., 0-800)
    const VIRTUAL_WIDTH = SCREEN_WIDTH * 1.5;

    // Helper to map node coordinates to canvas coordinates
    const getX = (percentX: number) => (percentX / 100) * VIRTUAL_WIDTH + CANVAS_PADDING;
    const getY = (pixelY: number) => pixelY + CANVAS_PADDING;

    const canvasWidth = VIRTUAL_WIDTH + CANVAS_PADDING * 2;
    const canvasHeight = maxY + CANVAS_PADDING * 2 + 200;

    // Animated values for zoom and pan
    const scale = useSharedValue(1);
    const savedScale = useSharedValue(1);
    const translateX = useSharedValue(-canvasWidth / 2 + SCREEN_WIDTH / 2);
    const translateY = useSharedValue(-50);
    const savedTranslateX = useSharedValue(-canvasWidth / 2 + SCREEN_WIDTH / 2);
    const savedTranslateY = useSharedValue(-50);

    const panGesture = Gesture.Pan()
        .onUpdate((e) => {
            translateX.value = savedTranslateX.value + e.translationX;
            translateY.value = savedTranslateY.value + e.translationY;
        })
        .onEnd(() => {
            savedTranslateX.value = translateX.value;
            savedTranslateY.value = translateY.value;
        });

    const pinchGesture = Gesture.Pinch()
        .onUpdate((e) => {
            scale.value = savedScale.value * e.scale;
        })
        .onEnd(() => {
            savedScale.value = scale.value;
        });

    const combinedGesture = Gesture.Simultaneous(panGesture, pinchGesture);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
            { scale: scale.value },
        ] as any,
    }));

    // Render edges
    const renderEdges = () => {
        return edges.map((edge, index) => {
            const fromNode = nodes.find(n => n.skillId === edge.from);
            const toNode = nodes.find(n => n.skillId === edge.to);

            if (!fromNode || !toNode) return null;

            const x1 = getX(fromNode.x);
            const y1 = getY(fromNode.y) + NODE_RADIUS;
            const x2 = getX(toNode.x);
            const y2 = getY(toNode.y) - NODE_RADIUS;

            const cp1x = x1;
            const cp1y = y1 + (y2 - y1) / 2;
            const cp2x = x2;
            const cp2y = y2 - (y2 - y1) / 2;

            const pathData = `M${x1},${y1} C${cp1x},${cp1y} ${cp2x},${cp2y} ${x2},${y2}`;

            const fromStatus = nodeStatuses[fromNode.skillId];
            const isMasteredConnection = fromStatus === 'mastered';
            const strokeColor = isMasteredConnection ? themeColors.success : themeColors.textMuted;
            const strokeWidth = isMasteredConnection ? 4 : 2;
            const strokeOpacity = isMasteredConnection ? 0.8 : 0.3;

            return (
                <G key={`edge-${index}`}>
                    {isMasteredConnection && (
                        <Path
                            d={pathData}
                            stroke={strokeColor}
                            strokeWidth={8}
                            strokeOpacity={0.2}
                            fill="none"
                        />
                    )}
                    <Path
                        d={pathData}
                        stroke={strokeColor}
                        strokeWidth={strokeWidth}
                        strokeOpacity={strokeOpacity}
                        fill="none"
                    />
                </G>
            );
        });
    };

    const renderNodes = () => {
        return nodes.map((node) => {
            const skill = skills[node.skillId];
            if (!skill) return null;

            const cx = getX(node.x);
            const cy = getY(node.y);
            const status = nodeStatuses[node.skillId];
            const color = getStatusColor(status);
            const icon = skill.icon || '?';

            return (
                <G
                    key={node.skillId}
                    onPress={() => onNodePress(node.skillId)}
                >
                    {status && status !== 'locked' && (
                        <Circle
                            cx={cx}
                            cy={cy}
                            r={NODE_RADIUS + 5}
                            fill={color}
                            opacity={0.2}
                        />
                    )}

                    <Circle
                        cx={cx}
                        cy={cy}
                        r={NODE_RADIUS}
                        fill={themeColors.backgroundCard}
                        stroke={color}
                        strokeWidth={3}
                        fillOpacity={0.9}
                    />

                    <SvgText
                        x={cx}
                        y={cy + 8}
                        fontSize="32"
                        textAnchor="middle"
                        fill={(status === 'locked' || !status) ? themeColors.textSecondary : themeColors.textPrimary}
                        opacity={(status === 'locked' || !status) ? 0.5 : 1}
                    >
                        {icon}
                    </SvgText>

                    <SvgText
                        x={cx}
                        y={cy + NODE_RADIUS + 20}
                        fontSize="12"
                        fontWeight="bold"
                        textAnchor="middle"
                        fill={color}
                    >
                        {skill.name}
                    </SvgText>
                </G>
            );
        });
    };

    return (
        <View style={styles.container}>
            <GestureDetector gesture={combinedGesture}>
                <Animated.View style={[styles.canvasContainer, animatedStyle]}>
                    <Svg
                        width={canvasWidth}
                        height={canvasHeight}
                        viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
                    >
                        <Defs>
                            <RadialGradient id="glow" cx="50%" cy="50%" r="50%">
                                <Stop offset="0%" stopColor={themeColors.primary} stopOpacity="0.4" />
                                <Stop offset="100%" stopColor={themeColors.primary} stopOpacity="0" />
                            </RadialGradient>
                        </Defs>

                        {renderEdges()}
                        {renderNodes()}
                    </Svg>
                </Animated.View>
            </GestureDetector>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        overflow: 'hidden',
    },
    canvasContainer: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
