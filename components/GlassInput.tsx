import React from 'react';
import { Text, TextInput, TextInputProps, View, ViewStyle } from 'react-native';
import { colors } from '../lib/theme';
import { moderateScale, scaleFont } from '../lib/responsive';

interface GlassInputProps extends TextInputProps {
  label: string;
  error?: string;
  containerStyle?: ViewStyle;
  rightNode?: React.ReactNode;
}

const GlassInput = ({ label, error, containerStyle, rightNode, ...props }: GlassInputProps) => {
  return (
    <View className="gap-2" style={containerStyle}>
      <Text className="font-semibold text-[#2D3A33]" style={{ fontSize: scaleFont(14) }}>{label}</Text>
      <View
        className={`flex-row items-center rounded-[18px] border bg-white ${error ? 'border-[rgba(217,78,0,0.45)]' : 'border-[#E5EEE8]'}`}
        style={{ paddingHorizontal: moderateScale(18, 0.35), minHeight: moderateScale(48, 0.2) }}
      >
        <TextInput
          {...props}
          className="flex-1 text-black"
          style={[{ fontSize: scaleFont(16), paddingVertical: moderateScale(14, 0.35) }, props.style]}
          placeholderTextColor={colors.textMuted}
        />
        {rightNode}
      </View>
      {!!error && <Text className="font-semibold text-[#D94E00]" style={{ fontSize: scaleFont(11) }}>{error}</Text>}
    </View>
  );
};

export default GlassInput;
