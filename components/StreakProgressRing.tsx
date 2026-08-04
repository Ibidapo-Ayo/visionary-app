import React, { useEffect, useMemo } from 'react';
import { Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, { useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';

interface StreakProgressRingProps {
  progress: number;
  label: string;
  valueText: string;
  color: string;
  trackColor?: string;
  size?: number;
  strokeWidth?: number;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const StreakProgressRing = ({
  progress,
  label,
  valueText,
  color,
  trackColor = 'rgba(255,255,255,0.14)',
  size = 92,
  strokeWidth = 8,
}: StreakProgressRingProps) => {
  const clamped = Math.max(0, Math.min(1, progress));
  const radius = useMemo(() => (size - strokeWidth) / 2, [size, strokeWidth]);
  const circumference = useMemo(() => 2 * Math.PI * radius, [radius]);

  const progressValue = useSharedValue(0);

  useEffect(() => {
    progressValue.value = withTiming(clamped, { duration: 850 });
  }, [clamped, progressValue]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - progressValue.value),
  }));

  return (
    <View className="items-center">
      <View style={{ width: size, height: size }}>
        <Svg width={size} height={size}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={trackColor}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={circumference}
            animatedProps={animatedProps}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>

        <View className="absolute bottom-0 left-0 right-0 top-0 items-center justify-center">
          <Text className="text-[17px] font-extrabold text-[#F5F5F5]">{valueText}</Text>
        </View>
      </View>
      <Text className="mt-2 text-[11px] font-semibold tracking-[0.4px] text-[#A9A9A9]">{label}</Text>
    </View>
  );
};

export default StreakProgressRing;
