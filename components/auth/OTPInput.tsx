import React, { useRef } from 'react';
import { TextInput, View } from 'react-native';

interface OTPInputProps {
  value: string[];
  onChange: (next: string[]) => void;
}

const OTPInput = ({ value, onChange }: OTPInputProps) => {
  const refs = useRef<Array<TextInput | null>>([]);

  const handleChange = (text: string, idx: number) => {
    const sanitized = text.replace(/[^0-9]/g, '').slice(-1);
    const next = [...value];
    next[idx] = sanitized;
    onChange(next);

    if (sanitized && idx < 5) {
      refs.current[idx + 1]?.focus();
    }
  };

  return (
    <View className="flex-row items-center justify-center gap-2">
      {value.map((digit, idx) => (
        <TextInput
          key={`otp-${idx}`}
          ref={(ref) => {
            refs.current[idx] = ref;
          }}
          value={digit}
          onChangeText={(text) => handleChange(text, idx)}
          keyboardType="number-pad"
          maxLength={1}
          className="h-14 w-12 rounded-[16px] border border-[rgba(255,255,255,0.08)] bg-[#1A1A1A] text-center text-[24px] font-semibold text-white"
        />
      ))}
    </View>
  );
};

export default OTPInput;
