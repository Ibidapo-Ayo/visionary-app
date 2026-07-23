import React from 'react';
import { ImageBackground, View, ViewStyle } from 'react-native';

interface WorldMapBackdropProps {
  style?: ViewStyle;
  opacity?: number;
}

const WorldMapBackdrop = ({ style, opacity = 0.85 }: WorldMapBackdropProps) => {
  return (
    <View pointerEvents="none" className="absolute overflow-hidden rounded-[26px]" style={[style, { opacity }]}>
      <ImageBackground
        source={require('../assets/world-map-real.png')}
        className="h-full w-full"
        imageStyle={{ opacity: 0.9, transform: [{ scale: 1.08 }] }}
        resizeMode="cover"
      />
      <View className="absolute inset-0 bg-[rgba(216,90,22,0.06)]" />
      <View
        className="absolute h-[122px] w-[122px] rounded-full border border-[rgba(216,90,22,0.28)] bg-[rgba(216,90,22,0.14)]"
        style={{ left: '48%', top: '44%', marginLeft: -61, marginTop: -61 }}
      />
      <View
        className="absolute h-[46px] w-[46px] rounded-full bg-[rgba(216,90,22,0.22)]"
        style={{ left: '48%', top: '44%', marginLeft: -23, marginTop: -23 }}
      />
    </View>
  );
};

export default WorldMapBackdrop;
