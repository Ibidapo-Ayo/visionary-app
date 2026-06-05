import React, { useState } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import Animated, { FadeIn } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Card from '@components/Card';
import Button from '@components/Button';
import { colors, radius, spacing, typography } from '../../lib/theme';

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
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionWrap}>
          <Text style={styles.permissionTitle}>Camera access needed</Text>
          <Text style={styles.permissionBody}>Enable camera permission for fast, touchless check-in.</Text>
          <Button title="Allow Camera" onPress={requestPermission} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {!scanned ? (
        <>
          <CameraView
            style={styles.camera}
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          >
            <View style={styles.overlay}>
              <View style={styles.frame} />
              <Text style={styles.helper}>Align the QR code inside the frame</Text>
            </View>
          </CameraView>
          <View style={styles.toolbar}>
            <TouchableOpacity style={styles.toolButton}>
              <MaterialCommunityIcons name="flashlight" color={colors.textPrimary} size={20} />
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <Animated.View entering={FadeIn} style={styles.resultWrap}>
          {isProcessing ? (
            <View style={styles.processing}>
              <ActivityIndicator size="large" color={colors.accentTeal} />
              <Text style={styles.processingText}>Validating attendance...</Text>
            </View>
          ) : (
            <Card variant="elevated" blurVariant="strong" padding="lg" style={styles.resultCard}>
              <MaterialCommunityIcons name="check-decagram" color={colors.success} size={54} />
              <Text style={styles.successTitle}>Check-in complete</Text>
              <Text style={styles.resultLine}>Event: {scannedData.eventName}</Text>
              <Text style={styles.resultLine}>Time: {scannedData.timestamp}</Text>
              <Text style={styles.resultPoints}>+{scannedData.points} engagement points</Text>
              <Button title="Scan Another" onPress={reset} fullWidth />
            </Card>
          )}
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  permissionWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  permissionTitle: {
    color: colors.textPrimary,
    fontSize: typography.h2.fontSize,
    fontWeight: '700',
  },
  permissionBody: {
    color: colors.textSecondary,
    textAlign: 'center',
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(5,9,20,0.45)',
  },
  frame: {
    width: 260,
    height: 260,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.accentTeal,
    backgroundColor: 'rgba(82,210,198,0.1)',
  },
  helper: {
    marginTop: spacing.md,
    color: colors.textPrimary,
    fontSize: typography.bodySm.fontSize,
    fontWeight: '600',
  },
  toolbar: {
    position: 'absolute',
    right: spacing.lg,
    bottom: 102,
  },
  toolButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    backgroundColor: 'rgba(255,255,255,0.13)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  processing: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  processingText: {
    color: colors.textSecondary,
    fontSize: typography.body.fontSize,
  },
  resultCard: {
    width: '100%',
    alignItems: 'center',
    gap: spacing.xs,
  },
  successTitle: {
    color: colors.textPrimary,
    fontSize: typography.h2.fontSize,
    fontWeight: '700',
  },
  resultLine: {
    color: colors.textSecondary,
    fontSize: typography.body.fontSize,
  },
  resultPoints: {
    color: colors.accentGold,
    fontSize: typography.bodySm.fontSize,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
});

export default ScanScreen;
