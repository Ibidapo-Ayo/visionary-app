import React, { useState } from 'react';
import { ActivityIndicator, SafeAreaView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import Card from '@components/Card';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../lib/theme';

const ScanScreen = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [scannerLive, setScannerLive] = useState(false);
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
    setScannerLive(false);
    setScannedData(null);
  };

  if (!permission || !permission.granted) {
    return (
      <LinearGradient colors={['#050505', '#0C0C0C']} className="flex-1">
        <SafeAreaView className="flex-1">
          <View className="flex-1 items-center justify-center gap-4 px-8">
            <Text className="text-center text-[24px] font-extrabold text-white">Camera access required</Text>
            <Text className="text-center text-[15px] leading-6 text-[#A3A3A3]">Allow camera permission to enable one-tap attendance check-in.</Text>
            <TouchableOpacity className="rounded-full bg-[#FF7A00] px-5 py-3" onPress={requestPermission}>
              <Text className="text-[14px] font-bold text-[#181818]">Allow Camera</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#040404', '#090909', '#101010']} className="flex-1">
      <StatusBar barStyle="light-content" />
      <SafeAreaView className="flex-1 px-5 pt-8">
        <View className="mb-5">
          <Text className="text-[12px] font-semibold uppercase tracking-[1.8px] text-[#EDEDED]">Attendance Tracking</Text>
          <Text className="mt-1 text-[12px] text-[#8F8F8F]">Easy. Fast. Accurate.</Text>
        </View>

        <View className="mb-5 flex-row justify-between rounded-[18px] border border-[#282828] bg-[#121212] px-3 py-3">
          {[
            { label: 'Scan QR', icon: 'camera', active: true, subtitle: 'At the event entrance' },
            { label: 'Check in', icon: 'check-circle', active: false, subtitle: 'Attendance validated' },
            { label: "You're in!", icon: 'shield', active: false, subtitle: 'Welcome to service' },
          ].map((step, index) => (
            <View key={step.label} className="flex-1 items-center">
              <View className={`h-8 w-8 items-center justify-center rounded-full ${step.active ? 'bg-[#FF7A00]' : 'bg-[#1F1F1F]'}`}>
                <Feather name={step.icon as React.ComponentProps<typeof Feather>['name']} size={14} color={step.active ? '#1A1208' : '#A9A9A9'} />
              </View>
              <Text className="mt-1 text-[10px] font-semibold text-white">{step.label}</Text>
              <Text className="mt-0.5 text-center text-[9px] text-[#7E7E7E]">{step.subtitle}</Text>
              {index < 2 ? <View className="absolute right-[-8px] top-4 h-[1px] w-4 bg-[#2E2E2E]" /> : null}
            </View>
          ))}
        </View>

        {!scanned ? (
          <View className="flex-1">
            <Card
              animated={false}
              padding="md"
              blurVariant="none"
              style={{
                borderColor: '#282828',
                backgroundColor: '#111111',
              }}
            >
              <Text className="text-center text-[13px] font-semibold text-white">Scan QR Code</Text>

              <View className="mt-4 overflow-hidden rounded-[18px] border border-[#2D2D2D]">
                {scannerLive ? (
                  <CameraView
                    style={{ height: 240 }}
                    onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                    barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
                  >
                    <View className="flex-1 items-center justify-center bg-[rgba(0,0,0,0.28)]">
                      <View className="h-[164px] w-[164px] rounded-[20px] border-2 border-[#16A34A]" />
                    </View>
                  </CameraView>
                ) : (
                  <View className="h-[240px] items-center justify-center bg-[#0B0B0B]">
                    <View className="h-[164px] w-[164px] items-center justify-center rounded-[20px] border-2 border-[#16A34A] bg-[#101710]">
                      <Feather name="grid" size={54} color="#3FA55D" />
                    </View>
                  </View>
                )}
              </View>

              <Text className="mt-3 text-center text-[11px] text-[#848484]">Align QR code within the frame</Text>
              <TouchableOpacity
                className="mt-4 self-center rounded-full bg-[#FF7A00] px-4 py-2"
                onPress={() => setScannerLive((prev) => !prev)}
              >
                <Text className="text-[12px] font-bold text-[#161616]">{scannerLive ? 'Pause Scanner' : 'Start Scanner'}</Text>
              </TouchableOpacity>
            </Card>

            <Card
              animated={false}
              padding="md"
              blurVariant="none"
              style={{
                marginTop: 12,
                borderColor: '#282828',
                backgroundColor: '#111111',
              }}
            >
              <View className="flex-row items-start gap-3">
                <View className="h-9 w-9 items-center justify-center rounded-full bg-[#1C1C1C]">
                  <Feather name="help-circle" size={16} color="#F8A33D" />
                </View>
                <View className="flex-1">
                  <Text className="text-[13px] font-semibold text-white">Need Help?</Text>
                  <Text className="mt-1 text-[11px] text-[#8F8F8F]">Ask a steward to assist your check-in.</Text>
                </View>
              </View>
            </Card>
          </View>
        ) : (
          <Animated.View entering={FadeIn} className="flex-1 items-center justify-center px-2">
            {isProcessing ? (
              <View className="items-center gap-3">
                <ActivityIndicator size="large" color={colors.accentGreen} />
                <Text className="text-[14px] text-[#A0A0A0]">Validating attendance...</Text>
              </View>
            ) : (
              <Card
                variant="elevated"
                blurVariant="none"
                padding="lg"
                style={{
                  width: '100%',
                  alignItems: 'center',
                  gap: 8,
                  borderColor: '#2D2D2D',
                  backgroundColor: '#121212',
                }}
              >
                <Feather name="check-circle" color={colors.success} size={54} />
                <Text className="text-[24px] font-extrabold text-white">Check-in complete</Text>
                <Text className="text-[14px] text-[#A3A3A3]">Event: {scannedData.eventName}</Text>
                <Text className="text-[14px] text-[#A3A3A3]">Time: {scannedData.timestamp}</Text>
                <Text className="mb-2 text-[13px] font-bold text-[#FF7A00]">+{scannedData.points} points</Text>
                <TouchableOpacity className="rounded-full bg-[#FF7A00] px-4 py-2" onPress={reset}>
                  <Text className="text-[13px] font-bold text-[#181818]">Scan Another</Text>
                </TouchableOpacity>
              </Card>
            )}
          </Animated.View>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
};

export default ScanScreen;
