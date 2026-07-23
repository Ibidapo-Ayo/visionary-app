import React from 'react';
import { Text, TextInput, TextInputProps, View, ViewStyle } from 'react-native';
import { colors } from '../lib/theme';

interface GlassInputProps extends TextInputProps {
  label: string;
  error?: string;
  containerStyle?: ViewStyle;
  rightNode?: React.ReactNode;
}

const GlassInput = ({ label, error, containerStyle, rightNode, ...props }: GlassInputProps) => {
  return (
    <View className="gap-2" style={containerStyle}>
      <Text className="text-sm font-semibold text-[#2D3A33]">{label}</Text>
      <View className={`flex-row items-center rounded-[18px] border bg-white px-[18px] ${error ? 'border-[rgba(217,78,0,0.45)]' : 'border-[#E5EEE8]'}`}>
        <TextInput
          {...props}
          className="flex-1 py-3.5 text-base text-black"
          style={props.style}
          placeholderTextColor={colors.textMuted}
        />
        {rightNode}
      </View>
      {!!error && <Text className="text-[11px] font-semibold text-[#D94E00]">{error}</Text>}
    </View>
  );
};

export default GlassInput;
