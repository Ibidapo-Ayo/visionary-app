import React from 'react';
import { ImageBackground, StyleSheet, View, ViewStyle } from 'react-native';

interface WorldMapBackdropProps {
  style?: ViewStyle;
  opacity?: number;
}

const WorldMapBackdrop = ({ style, opacity = 0.85 }: WorldMapBackdropProps) => {
  return (
    <View pointerEvents="none" style={[styles.container, style, { opacity }]}>
      <ImageBackground
        source={require('../assets/world-map-real.png')}
        style={styles.map}
        imageStyle={styles.mapImage}
        resizeMode="cover"
      />
      <View style={styles.overlay} />
      <View style={styles.africaGlow} />
      <View style={styles.africaCore} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    overflow: 'hidden',
    borderRadius: 26,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  mapImage: {
    opacity: 0.9,
    transform: [{ scale: 1.08 }],
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(216,90,22,0.06)',
  },
  africaGlow: {
    position: 'absolute',
    width: 122,
    height: 122,
    borderRadius: 61,
    left: '48%',
    top: '44%',
    marginLeft: -61,
    marginTop: -61,
    backgroundColor: 'rgba(216,90,22,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(216,90,22,0.28)',
  },
  africaCore: {
    position: 'absolute',
    width: 46,
    height: 46,
    borderRadius: 23,
    left: '48%',
    top: '44%',
    marginLeft: -23,
    marginTop: -23,
    backgroundColor: 'rgba(216,90,22,0.22)',
  },
});

export default WorldMapBackdrop;
