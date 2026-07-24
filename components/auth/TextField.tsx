import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { LucideIcon } from 'lucide-react-native';

interface TextFieldProps {
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  icon: LucideIcon;
  keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'number-pad';
  error?: string;
}

const TextField = ({
  value,
  onChangeText,
  placeholder,
  icon: Icon,
  keyboardType = 'default',
  error,
}: TextFieldProps) => {
  const [focused, setFocused] = useState(false);
  const borderColor = focused ? '#D0D5DD' : '#E6E8EC';

  return (
    <View className="gap-1.5">
      <View
        className="h-[52px] flex-row items-center rounded-2xl px-3.5"
        style={{
          borderColor,
          borderWidth: StyleSheet.hairlineWidth,
        }}
      >
        <Icon size={16} color="#8E8E8E" strokeWidth={2} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#7A7A7A"
          keyboardType={keyboardType}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="ml-2.5 flex-1 text-[14px] font-medium text-[#111111]"
        />
      </View>
      {error ? <Text className="text-[13px] text-[#EF4444]">{error}</Text> : null}
    </View>
  );
};

export default TextField;
