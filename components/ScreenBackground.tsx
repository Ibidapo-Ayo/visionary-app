import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients } from '../lib/theme';

interface ScreenBackgroundProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const ScreenBackground = ({ children, style }: ScreenBackgroundProps) => {
  return (
    <View style={[styles.container, style]}>
      <LinearGradient colors={gradients.screen} style={StyleSheet.absoluteFillObject} />
      <LinearGradient colors={gradients.hero} style={styles.orbOne} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
      <LinearGradient colors={gradients.warm} style={styles.orbTwo} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
      <View style={styles.overlay}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(6, 11, 27, 0.45)',
  },
  orbOne: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 180,
    top: -40,
    right: -70,
    opacity: 0.55,
  },
  orbTwo: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 160,
    bottom: -80,
    left: -70,
    opacity: 0.25,
  },
});

export default ScreenBackground;
