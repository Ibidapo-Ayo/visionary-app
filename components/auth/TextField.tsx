import React, { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
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

  return (
    <View className="gap-1.5">
      <View
        className={`h-[52px] flex-row items-center rounded-[12px] border px-3.5 ${
          focused ? 'border-[#FF7A00] bg-[#17100A]' : 'border-[rgba(255,255,255,0.10)] bg-[#101010]'
        }`}
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
          className="ml-2.5 flex-1 text-[14px] font-medium text-white"
        />
      </View>
      {error ? <Text className="text-[13px] text-[#EF4444]">{error}</Text> : null}
    </View>
  );
};

export default TextField;
