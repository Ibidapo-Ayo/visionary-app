import { cssInterop } from 'nativewind';
import { LinearGradient } from 'expo-linear-gradient';

// expo-linear-gradient is a third-party native component, so NativeWind's automatic
// className -> style interop is unreliable on iOS (it silently drops padding/margin/etc).
// Registering it explicitly makes className behave the same on iOS, Android, and web.
cssInterop(LinearGradient, {
  className: 'style',
});
