import React from 'react';
import { Text, View } from 'react-native';
import { Circle, CircleCheckBig } from 'lucide-react-native';

type PasswordRequirementCardProps = {
  password: string;
};

type PasswordRequirement = {
  id: 'length' | 'uppercase' | 'number';
  label: string;
  met: boolean;
};

export const getPasswordRequirements = (password: string): PasswordRequirement[] => {
  return [
    {
      id: 'length',
      label: 'At least 8 characters',
      met: password.length >= 8,
    },
    {
      id: 'uppercase',
      label: 'One uppercase letter',
      met: /[A-Z]/.test(password),
    },
    {
      id: 'number',
      label: 'One number',
      met: /[0-9]/.test(password),
    },
  ];
};

const PasswordRequirementCard = ({ password }: PasswordRequirementCardProps) => {
  const requirements = getPasswordRequirements(password);

  return (
    <View className="rounded-[20px] border border-[rgba(255,255,255,0.1)] bg-[#121212] p-4">
      <Text className="mb-2 text-[12px] font-semibold uppercase tracking-[1.1px] text-[#A3A3A3]">
        Password requirements
      </Text>

      <View className="gap-2">
        {requirements.map((requirement) => (
          <View key={requirement.id} className="flex-row items-center gap-2">
            {requirement.met ? (
              <CircleCheckBig size={16} color="#16A34A" strokeWidth={2} />
            ) : (
              <Circle size={16} color="#8A8A8A" strokeWidth={2} />
            )}

            <Text className={`text-[13px] ${requirement.met ? 'text-[#16A34A]' : 'text-[#D4D4D8]'}`}>
              {requirement.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default PasswordRequirementCard;
