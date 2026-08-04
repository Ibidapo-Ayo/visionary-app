import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Eye, EyeOff, Lock } from 'lucide-react-native';

interface PasswordFieldProps {
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  error?: string;
}

const PasswordField = ({ value, onChangeText, placeholder, error }: PasswordFieldProps) => {
  const [focused, setFocused] = useState(false);
  const [secure, setSecure] = useState(true);
  const borderColor = focused ? '#D0D5DD' : '#E6E8EC';

  return (
    <View className="gap-1.5">
      <View
        className="h-14 flex-row items-center rounded-2xl px-4"
        style={{
          borderColor,
          borderWidth: StyleSheet.hairlineWidth,
        }}
      >
        <Lock size={20} color="#8E8E8E" strokeWidth={2} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#7A7A7A"
          secureTextEntry={secure}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="ml-3 flex-1 text-[15px] font-medium text-[#111111]"
        />
        <Pressable onPress={() => setSecure((prev) => !prev)} accessibilityRole="button" accessibilityLabel="Toggle password visibility">
          {secure ? <Eye size={20} color="#8E8E8E" strokeWidth={2} /> : <EyeOff size={20} color="#8E8E8E" strokeWidth={2} />}
        </Pressable>
      </View>
      {error ? <Text className="text-[13px] text-[#EF4444]">{error}</Text> : null}
    </View>
  );
};

export default PasswordField;
