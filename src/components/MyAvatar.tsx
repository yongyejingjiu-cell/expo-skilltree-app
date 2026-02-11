
import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { View, ViewStyle, StyleProp } from 'react-native';
import { AvatarParts } from '../types';
import { AVATAR_ITEMS } from '../data/avatarItems';

interface Props {
    parts: AvatarParts;
    size?: number;
    style?: StyleProp<ViewStyle>;
}

/**
 * カスタマイズ可能なアバターを表示するコンポーネント
 * 複数のレイヤー（体、服、髪、アクセサリ）を重ねて表示します
 */
export const MyAvatar = ({ parts, size = 100, style }: Props) => {
    // 各パーツのデータを取得
    const body = AVATAR_ITEMS[parts.body];
    const hair = AVATAR_ITEMS[parts.hair];
    const clothing = AVATAR_ITEMS[parts.clothing];
    const accessory = AVATAR_ITEMS[parts.accessory];

    return (
        <View style={[{ width: size, height: size }, style]}>
            <Svg width="100%" height="100%" viewBox="0 0 100 100">
                {/* 1. 体レイヤー */}
                {body && (
                    <Path
                        d={body.svgPath}
                        fill={body.color}
                    />
                )}

                {/* 2. 服レイヤー */}
                {clothing && (
                    <Path
                        d={clothing.svgPath}
                        fill={clothing.color}
                    />
                )}

                {/* 3. 髪レイヤー */}
                {hair && (
                    <Path
                        d={hair.svgPath}
                        fill={hair.color}
                    />
                )}

                {/* 4. アクセサリレイヤー */}
                {accessory && (
                    <Path
                        d={accessory.svgPath}
                        fill={accessory.color}
                        stroke="#000"
                        strokeWidth="1"
                    />
                )}
            </Svg>
        </View>
    );
};
