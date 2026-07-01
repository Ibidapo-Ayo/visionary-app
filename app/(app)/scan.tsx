import React, { useState } from 'react';
import { ActivityIndicator, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import Card from '@components/Card';
import Button from '@components/Button';
import { colors } from '../../lib/theme';

const ScanScreen = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleBarCodeScanned = async () => {
    if (scanned || isProcessing) return;

    setScanned(true);
    setIsProcessing(true);

    await new Promise((resolve) => setTimeout(resolve, 1200));
    setScannedData({ eventName: 'Sunday Service', timestamp: new Date().toLocaleTimeString(), points: 10 });
    setIsProcessing(false);
  };

  const reset = () => {
    setScanned(false);
    setScannedData(null);
  };

  if (!permission || !permission.granted) {
    return (
      <SafeAreaView className="flex-1 bg-[#EEF4F0]">
        <View className="flex-1 items-center justify-center gap-[18px] px-9">
          <Text className="text-center text-[26px] font-extrabold text-black">Camera access needed</Text>
          <Text className="text-center text-[16px] leading-6 text-[#718078]">Enable camera permission for fast, touchless check-in.</Text>
          <Button title="Allow Camera" onPress={requestPermission} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#EEF4F0]">
      {!scanned ? (
        <>
          <CameraView
            style={{ flex: 1 }}
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          >
            <View className="flex-1 items-center justify-center bg-[rgba(0,0,0,0.35)]">
              <View className="h-[260px] w-[260px] rounded-3xl border-2 border-[#FF6B09] bg-[rgba(255,107,9,0.08)]" />
              <Text className="mt-[18px] text-[14px] font-semibold text-white">Align QR in frame</Text>
            </View>
          </CameraView>
          <View className="absolute bottom-[102px] right-7">
            <TouchableOpacity className="h-[46px] w-[46px] items-center justify-center rounded-full border border-[rgba(255,255,255,0.35)] bg-[rgba(255,255,255,0.18)]">
              <Feather name="aperture" color={colors.textPrimary} size={20} />
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <Animated.View entering={FadeIn} className="flex-1 items-center justify-center px-7">
          {isProcessing ? (
            <View className="items-center gap-[14px]">
              <ActivityIndicator size="large" color={colors.accentGreen} />
              <Text className="text-[16px] text-[#718078]">Validating attendance...</Text>
            </View>
          ) : (
            <Card variant="elevated" blurVariant="strong" padding="lg" style={{ width: '100%', alignItems: 'center', gap: 8 }}>
              <Feather name="check-circle" color={colors.success} size={54} />
              <Text className="text-[26px] font-extrabold text-black">Check-in complete</Text>
              <Text className="text-[16px] text-[#718078]">Event: {scannedData.eventName}</Text>
              <Text className="text-[16px] text-[#718078]">Time: {scannedData.timestamp}</Text>
              <Text className="mb-[14px] text-[14px] font-bold text-[#FF6B09]">+{scannedData.points} engagement points</Text>
              <Button title="Scan Another" onPress={reset} fullWidth />
            </Card>
          )}
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

export default ScanScreen;
