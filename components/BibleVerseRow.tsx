import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface BibleVerseRowProps {
  verseNumber: number;
  verseText: string;
  isSelected: boolean;
  isBookmarked: boolean;
  isHighlighted: boolean;
  onPress: () => void;
}

const BibleVerseRow = ({
  verseNumber,
  verseText,
  isSelected,
  isBookmarked,
  isHighlighted,
  onPress,
}: BibleVerseRowProps) => {
  const selectedStyle = isSelected
    ? 'border-[#2E3B32] bg-[#121A14]'
    : 'border-transparent bg-transparent';

  const highlightedStyle = isHighlighted ? 'text-[#FFE3BF]' : 'text-[#EDEDEB]';

  return (
    <TouchableOpacity
      className={`mb-2 rounded-2xl border px-3 py-3 ${selectedStyle}`}
      activeOpacity={0.86}
      onPress={onPress}
    >
      <View className="flex-row items-start gap-3">
        <View className="mt-0.5 h-6 w-6 items-center justify-center rounded-full bg-[#1A1A1A]">
          <Text className="text-[10px] font-semibold text-[#A9A9A9]">{verseNumber}</Text>
        </View>

        <View className="flex-1">
          <Text className={`text-[17px] leading-8 ${highlightedStyle}`}>{verseText}</Text>

          {(isBookmarked || isHighlighted) && (
            <View className="mt-2 flex-row items-center gap-2">
              {isBookmarked ? (
                <View className="rounded-full border border-[#3A2D1C] bg-[#231B12] px-2 py-1">
                  <View className="flex-row items-center gap-1">
                    <Feather name="bookmark" size={10} color="#FF9B3D" />
                    <Text className="text-[9px] font-semibold text-[#FFC98F]">Bookmarked</Text>
                  </View>
                </View>
              ) : null}

              {isHighlighted ? (
                <View className="rounded-full border border-[#32402F] bg-[#172019] px-2 py-1">
                  <View className="flex-row items-center gap-1">
                    <Feather name="edit-3" size={10} color="#8BDF9F" />
                    <Text className="text-[9px] font-semibold text-[#BDEBC7]">Highlighted</Text>
                  </View>
                </View>
              ) : null}
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default BibleVerseRow;
