import React, { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
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

  return (
    <View className="gap-1.5">
      <View
        className={`h-14 flex-row items-center rounded-[18px] border px-4 ${
          focused ? 'border-[#FF7A00] bg-[#1F1308]' : 'border-[rgba(255,255,255,0.08)] bg-[#1A1A1A]'
        }`}
      >
        <Lock size={20} color="#FFFFFF" strokeWidth={2} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#7A7A7A"
          secureTextEntry={secure}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="ml-3 flex-1 text-[15px] font-medium text-white"
        />
        <Pressable onPress={() => setSecure((prev) => !prev)} accessibilityRole="button" accessibilityLabel="Toggle password visibility">
          {secure ? <Eye size={20} color="#FFFFFF" strokeWidth={2} /> : <EyeOff size={20} color="#FFFFFF" strokeWidth={2} />}
        </Pressable>
      </View>
      {error ? <Text className="text-[13px] text-[#EF4444]">{error}</Text> : null}
    </View>
  );
};

export default PasswordField;
