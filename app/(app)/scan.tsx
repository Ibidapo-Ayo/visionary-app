import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import Animated, {
  FadeIn,
  FadeOut,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import Card from '@components/Card';
import Button from '@components/Button';

const ScanScreen = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const scanProgressValue = useSharedValue(0);

  const handleBarCodeScanned = async (data: any) => {
    if (scanned || isProcessing) return;

    setIsProcessing(true);
    setScanned(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setScannedData({
        eventName: 'Sunday Service',
        checkedIn: true,
        timestamp: new Date().toLocaleTimeString(),
        points: 10,
      });

      scanProgressValue.value = withTiming(1, { duration: 600 });
    } catch (error) {
      console.error('[v0] Scan error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setScanned(false);
    setScannedData(null);
    scanProgressValue.value = 0;
  };

  if (!permission) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.title}>Camera Permission Required</Text>
          <Text style={styles.subtitle}>
            We need access to your camera to scan QR codes
          </Text>
          <Button
            onPress={requestPermission}
            title="Grant Permission"
            variant="primary"
          />
        </View>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.title}>Camera Access Denied</Text>
          <Text style={styles.subtitle}>
            Please enable camera permissions in your settings
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {!scanned ? (
        <>
          {/* Camera View */}
          <CameraView
            style={styles.camera}
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ['qr'],
            }}
          >
            {/* Scanner Frame */}
            <View style={styles.scannerContainer}>
              <View style={styles.scannerFrame} />
              <Animated.View style={styles.scannerOverlay} />
            </View>

            {/* Info Text */}
            <View style={styles.infoContainer}>
              <Text style={styles.infoText}>
                Point your camera at a QR code to check in
              </Text>
            </View>
          </CameraView>

          {/* Torch Toggle */}
          <View style={styles.torchContainer}>
            <TouchableOpacity style={styles.torchButton}>
              <Text style={styles.torchIcon}>LIGHT</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <Animated.View style={styles.resultContainer} entering={FadeIn}>
          {isProcessing ? (
            <View style={styles.processingContainer}>
              <ActivityIndicator size="large" color="#fbbf24" />
              <Text style={styles.processingText}>Processing check-in...</Text>
            </View>
          ) : scannedData ? (
            <Card variant="elevated">
              <Animated.View
                style={styles.successContent}
                entering={FadeIn}
              >
                <Text style={styles.successEmoji}>OK</Text>
                <Text style={styles.successTitle}>Check-In Successful!</Text>

                <View style={styles.detailsContainer}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Event:</Text>
                    <Text style={styles.detailValue}>
                      {scannedData.eventName}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Time:</Text>
                    <Text style={styles.detailValue}>
                      {scannedData.timestamp}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Points Earned:</Text>
                    <Text style={[styles.detailValue, { color: '#fbbf24' }]}>
                      +{scannedData.points}
                    </Text>
                  </View>
                </View>

                <Button
                  onPress={handleReset}
                  title="Scan Another"
                  variant="primary"
                  fullWidth
                  style={styles.resetButton}
                />
              </Animated.View>
            </Card>
          ) : (
            <Card variant="outlined">
              <Text style={styles.errorTitle}>Scan Failed</Text>
              <Text style={styles.errorText}>
                Could not process this QR code. Please try again.
              </Text>
              <Button
                onPress={handleReset}
                title="Try Again"
                variant="secondary"
                fullWidth
              />
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
    backgroundColor: '#111226',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#cbd5e1',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 20,
  },
  camera: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerFrame: {
    width: 280,
    height: 280,
    borderRadius: 20,
    borderColor: '#fbbf24',
    borderWidth: 3,
    backgroundColor: 'rgba(251, 191, 36, 0.05)',
  },
  scannerOverlay: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 20,
    borderColor: '#fbbf24',
    borderWidth: 2,
  },
  infoContainer: {
    position: 'absolute',
    bottom: 60,
    paddingHorizontal: 24,
  },
  infoText: {
    fontSize: 14,
    color: '#e2e8f0',
    textAlign: 'center',
    fontWeight: '500',
  },
  torchContainer: {
    position: 'absolute',
    bottom: 20,
    right: 24,
  },
  torchButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(251, 191, 36, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  torchIcon: {
    fontSize: 24,
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  processingContainer: {
    alignItems: 'center',
    gap: 16,
  },
  processingText: {
    fontSize: 16,
    color: '#e2e8f0',
    fontWeight: '500',
  },
  successContent: {
    alignItems: 'center',
  },
  successEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  detailsContainer: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 13,
    color: '#94a3b8',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 13,
    color: '#e2e8f0',
    fontWeight: '600',
  },
  resetButton: {
    width: '100%',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fca5a5',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 13,
    color: '#cbd5e1',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
});

export default ScanScreen;
