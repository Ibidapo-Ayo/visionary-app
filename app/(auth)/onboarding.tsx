import React, { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  LinearGradient as SvgGradient,
  Path,
  Rect,
  Stop,
} from 'react-native-svg';
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
  useAnimatedStyle,
  useSharedValue,
  runOnJS,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useAppStore } from '../../store/appStore';

const ORANGE = '#FF7A00';
const GREEN = '#16A34A';
const BLACK = '#090909';
const WHITE = '#FFFFFF';

type SlideId = 'purpose' | 'spiritual' | 'community';

const slides: Array<{
  id: SlideId;
  eyebrow: string;
  firstLine: string;
  secondLine: string;
  highlight: string;
  description: string;
  accent: string;
  buttonLabel: string;
}> = [
  {
    id: 'purpose',
    eyebrow: 'Discover Your Purpose',
    firstLine: 'Discover',
    secondLine: 'Your Purpose',
    highlight: 'Purpose',
    description: "Discover God's purpose for your life and begin your journey of spiritual growth.",
    accent: ORANGE,
    buttonLabel: 'Get Started',
  },
  {
    id: 'spiritual',
    eyebrow: 'Grow Spiritually with AI',
    firstLine: 'Grow',
    secondLine: 'Spiritually',
    highlight: 'Spiritually',
    description:
      "Receive biblical guidance, daily devotionals, prayer support, and wisdom from your AI Counselor trained on the teachings of Rev'd David.",
    accent: GREEN,
    buttonLabel: 'Continue',
  },
  {
    id: 'community',
    eyebrow: 'Connect and Impact',
    firstLine: 'Connect',
    secondLine: 'With Impact',
    highlight: 'Impact',
    description: 'Build meaningful relationships, stay close to your church family, and move with purpose every day.',
    accent: ORANGE,
    buttonLabel: 'Continue',
  },
];

const RisingParticle = ({ left, delay, accent }: { left: `${number}%`; delay: number; accent: string }) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2800 + delay, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 0 })
      ),
      -1,
      false
    );
  }, [delay, progress]);

  const style = useAnimatedStyle(() => ({
    opacity: 0.12 + progress.value * 0.62,
    transform: [{ translateY: -progress.value * 84 }, { scale: 0.7 + progress.value * 0.7 }],
  }));

  return (
    <Animated.View
      className="absolute bottom-[84px] h-1 w-1 rounded-full"
      style={[{ left, backgroundColor: accent, shadowColor: accent, shadowOpacity: 0.9, shadowRadius: 9, shadowOffset: { width: 0, height: 0 } }, style]}
    />
  );
};

const PurposeIllustration = () => (
  <Svg width="100%" height="100%" viewBox="0 0 393 558" preserveAspectRatio="xMidYMid slice">
    <Defs>
      <SvgGradient id="sunriseSky" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#10131C" />
        <Stop offset="0.42" stopColor="#4D2A18" />
        <Stop offset="0.72" stopColor="#D97823" />
        <Stop offset="1" stopColor="#130D09" />
      </SvgGradient>
      <SvgGradient id="mountainOrange" x1="0" y1="0" x2="1" y2="1">
        <Stop offset="0" stopColor="#FFB35C" />
        <Stop offset="1" stopColor="#1B120D" />
      </SvgGradient>
      <SvgGradient id="peakShadow" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#26322C" />
        <Stop offset="1" stopColor="#070707" />
      </SvgGradient>
    </Defs>
    <Rect width="393" height="558" fill="url(#sunriseSky)" />
    <Circle cx="238" cy="292" r="58" fill="#FFD27C" opacity="0.92" />
    <Circle cx="238" cy="292" r="118" fill={ORANGE} opacity="0.16" />
    <Path d="M-28 332 C64 286 94 316 170 276 C230 245 280 279 421 226 L421 558 L-28 558 Z" fill="#211612" opacity="0.45" />
    <Path d="M-34 390 L76 286 L130 340 L178 276 L260 381 L312 318 L432 416 L432 558 L-34 558 Z" fill="url(#mountainOrange)" opacity="0.88" />
    <Path d="M-32 438 L84 342 L148 392 L228 306 L307 428 L371 366 L425 421 L425 558 L-32 558 Z" fill="#0B0D0B" opacity="0.86" />
    <Path d="M-18 482 C58 438 107 445 178 414 C248 382 301 426 420 385 L420 558 L-18 558 Z" fill="url(#peakShadow)" />
    <Path d="M30 388 C92 364 140 362 202 346 C269 328 314 324 380 292" stroke="#FFBE6B" strokeWidth="2" opacity="0.3" />
    <G transform="translate(168 334)">
      <Ellipse cx="33" cy="172" rx="62" ry="12" fill="#000000" opacity="0.55" />
      <Path d="M36 70 C46 96 50 126 48 163" stroke="#18100B" strokeWidth="11" strokeLinecap="round" />
      <Path d="M24 74 C13 103 12 130 8 164" stroke="#120D0B" strokeWidth="10" strokeLinecap="round" />
      <Path d="M24 26 C18 49 17 69 21 89 L51 89 C55 64 53 45 45 26 Z" fill="#1D1712" />
      <Path d="M20 42 C7 55 0 70 -8 92" stroke="#1B120D" strokeWidth="8" strokeLinecap="round" />
      <Path d="M49 42 C62 59 68 74 76 94" stroke="#1B120D" strokeWidth="8" strokeLinecap="round" />
      <Circle cx="34" cy="14" r="13" fill="#22140E" />
      <Path d="M19 10 C22 -2 37 -8 49 2 C46 14 35 17 19 10 Z" fill="#090909" />
      <Rect x="45" y="47" width="22" height="36" rx="8" fill="#2A1B12" />
      <Path d="M55 50 L77 78" stroke="#3B2718" strokeWidth="5" strokeLinecap="round" />
    </G>
    <Path d="M36 253 C99 231 146 240 216 219 C281 200 322 205 384 178" stroke="#FFE5B8" strokeWidth="1.1" opacity="0.22" />
    <Path d="M-18 282 C52 257 117 268 185 246 C253 225 322 230 420 193" stroke="#FFE5B8" strokeWidth="0.8" opacity="0.18" />
  </Svg>
);

const SpiritualIllustration = () => (
  <Svg width="100%" height="100%" viewBox="0 0 393 558" preserveAspectRatio="xMidYMid slice">
    <Defs>
      <SvgGradient id="roomGlow" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#06130B" />
        <Stop offset="0.52" stopColor="#251A10" />
        <Stop offset="1" stopColor="#080808" />
      </SvgGradient>
      <SvgGradient id="candle" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#FFE7A8" />
        <Stop offset="1" stopColor={ORANGE} />
      </SvgGradient>
      <SvgGradient id="greenOrb" x1="0" y1="0" x2="1" y2="1">
        <Stop offset="0" stopColor="#CFFFE1" />
        <Stop offset="0.56" stopColor={GREEN} />
        <Stop offset="1" stopColor="#0A5B2A" />
      </SvgGradient>
    </Defs>
    <Rect width="393" height="558" fill="url(#roomGlow)" />
    <Circle cx="286" cy="208" r="120" fill={GREEN} opacity="0.13" />
    <Circle cx="82" cy="360" r="126" fill={ORANGE} opacity="0.12" />
    <Path d="M197 76 L207 76 L207 124 L255 124 L255 135 L207 135 L207 184 L197 184 L197 135 L149 135 L149 124 L197 124 Z" fill="#D9FBE4" opacity="0.14" />
    <Path d="M-10 383 C72 354 122 379 194 342 C266 304 318 334 414 286 L414 558 L-10 558 Z" fill="#090909" opacity="0.45" />
    <G transform="translate(105 178)">
      <Ellipse cx="92" cy="285" rx="116" ry="18" fill="#000000" opacity="0.46" />
      <Path d="M74 90 C46 118 40 171 56 217 C72 263 126 263 147 222 C169 179 147 111 116 90 Z" fill="#142319" />
      <Path d="M58 131 C36 160 24 198 15 237" stroke="#2A1C13" strokeWidth="15" strokeLinecap="round" />
      <Path d="M136 133 C163 160 176 193 186 235" stroke="#2A1C13" strokeWidth="15" strokeLinecap="round" />
      <Circle cx="95" cy="57" r="32" fill="#3A2418" />
      <Path d="M60 50 C62 20 91 6 117 19 C140 30 134 62 117 72 C101 55 82 51 60 50 Z" fill="#0D0907" />
      <Path d="M45 241 C82 214 123 214 160 241 L144 278 L62 278 Z" fill="#0B0B0B" />
      <Path d="M44 216 C75 196 111 196 142 216 L125 254 C95 241 72 242 44 216 Z" fill="#EADDC8" />
      <Path d="M96 199 L96 247" stroke="#CBBCA7" strokeWidth="1.5" opacity="0.75" />
    </G>
    <G transform="translate(267 226)">
      <Circle cx="0" cy="0" r="52" fill={GREEN} opacity="0.16" />
      <Circle cx="0" cy="0" r="33" fill="url(#greenOrb)" opacity="0.88" />
      <Path d="M-3 -19 L4 -19 L4 -4 L19 -4 L19 4 L4 4 L4 20 L-3 20 L-3 4 L-19 4 L-19 -4 L-3 -4 Z" fill="#EFFFF4" />
      <Circle cx="0" cy="0" r="43" stroke="#86F2AA" strokeWidth="1.3" opacity="0.58" fill="none" />
    </G>
    <G transform="translate(282 398)">
      <Rect x="-13" y="20" width="28" height="54" rx="7" fill="#F4DDAD" opacity="0.9" />
      <Path d="M1 0 C15 19 9 29 0 35 C-9 28 -12 18 1 0 Z" fill="url(#candle)" />
      <Circle cx="0" cy="29" r="48" fill={ORANGE} opacity="0.12" />
    </G>
  </Svg>
);

const CommunityIllustration = () => (
  <Svg width="100%" height="100%" viewBox="0 0 393 558" preserveAspectRatio="xMidYMid slice">
    <Defs>
      <SvgGradient id="cityGlow" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#111214" />
        <Stop offset="0.54" stopColor="#633016" />
        <Stop offset="1" stopColor="#090909" />
      </SvgGradient>
    </Defs>
    <Rect width="393" height="558" fill="url(#cityGlow)" />
    <Circle cx="318" cy="190" r="82" fill="#FFB45E" opacity="0.5" />
    <Path d="M42 354 L42 244 L78 244 L78 354 M98 354 L98 202 L142 202 L142 354 M166 354 L166 266 L212 266 L212 354 M246 354 L246 226 L302 226 L302 354 M324 354 L324 278 L370 278 L370 354" stroke="#25150E" strokeWidth="28" />
    <Path d="M-8 399 C75 354 144 373 204 348 C276 318 332 344 404 292 L404 558 L-8 558 Z" fill="#070707" opacity="0.68" />
    <G transform="translate(68 384)">
      <Circle cx="0" cy="0" r="24" fill="#2B1B13" />
      <Path d="M-38 112 C-30 55 -16 34 0 34 C17 34 31 56 38 112 Z" fill="#2B1D14" />
    </G>
    <G transform="translate(129 399)">
      <Circle cx="0" cy="0" r="24" fill="#3A2317" />
      <Path d="M-38 112 C-30 55 -16 34 0 34 C17 34 31 56 38 112 Z" fill="#2B1D14" />
    </G>
    <G transform="translate(195 384)">
      <Circle cx="0" cy="0" r="24" fill="#2B1B13" />
      <Path d="M-38 112 C-30 55 -16 34 0 34 C17 34 31 56 38 112 Z" fill="#182A1D" />
    </G>
    <G transform="translate(262 399)">
      <Circle cx="0" cy="0" r="24" fill="#2B1B13" />
      <Path d="M-38 112 C-30 55 -16 34 0 34 C17 34 31 56 38 112 Z" fill="#2B1D14" />
    </G>
    <G transform="translate(326 384)">
      <Circle cx="0" cy="0" r="24" fill="#2B1B13" />
      <Path d="M-38 112 C-30 55 -16 34 0 34 C17 34 31 56 38 112 Z" fill="#2B1D14" />
    </G>
    <Path d="M305 93 L313 93 L313 130 L350 130 L350 139 L313 139 L313 176 L305 176 L305 139 L268 139 L268 130 L305 130 Z" fill={ORANGE} opacity="0.72" />
  </Svg>
);

const Illustration = ({ id }: { id: SlideId }) => {
  if (id === 'spiritual') return <SpiritualIllustration />;
  if (id === 'community') return <CommunityIllustration />;
  return <PurposeIllustration />;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const OnboardingScreen = () => {
  const router = useRouter();
  const setOnboardingComplete = useAppStore((state) => state.setOnboardingComplete);
  const [index, setIndex] = useState(0);
  const press = useSharedValue(1);
  const current = slides[index];

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 6200);

    return () => clearInterval(timer);
  }, []);

  const finish = () => {
    setOnboardingComplete(true);
    router.replace('/(auth)/login');
  };

  const goPrev = () => {
    setIndex((prev) => (prev === 0 ? 0 : prev - 1));
  };

  const goNext = () => {
    if (index === slides.length - 1) {
      finish();
      return;
    }
    setIndex((prev) => prev + 1);
  };

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: press.value }],
  }));

  const swipeGesture = Gesture.Pan()
    .activeOffsetX([-14, 14])
    .failOffsetY([-20, 20])
    .onEnd(({ translationX, velocityX }) => {
      const shouldGoNext = translationX < -56 || velocityX < -620;
      const shouldGoPrev = translationX > 56 || velocityX > 620;

      if (shouldGoNext) {
        runOnJS(goNext)();
        return;
      }

      if (shouldGoPrev) {
        runOnJS(goPrev)();
      }
    });

  return (
    <GestureDetector gesture={swipeGesture}>
      <View className="flex-1 overflow-hidden bg-[#090909]">
        <LinearGradient colors={[BLACK, '#101010', BLACK]} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />

        <Animated.View
          key={current.id}
          entering={SlideInRight.duration(440).easing(Easing.out(Easing.cubic))}
          exiting={SlideOutLeft.duration(260)}
          className="flex-1"
        >
          <View className="mb-0 m-[14px] h-[65%] overflow-hidden rounded-[30px] border border-[rgba(255,255,255,0.12)] bg-[#111111]">
            <Illustration id={current.id} />
            <LinearGradient colors={['rgba(0,0,0,0.08)', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0.78)']} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
            <View className="absolute inset-0 rounded-[30px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.018)]" />
            <View className="absolute left-[22px] right-[22px] top-11 flex-row items-center justify-between">
              <Text className="text-[12px] font-extrabold leading-4 tracking-[0.4px]" style={{ color: current.accent }}>{index + 1}/3</Text>
              <Pressable onPress={finish} hitSlop={12}>
                <Text className="text-[13px] font-semibold leading-[18px] text-[rgba(255,255,255,0.78)]">Skip</Text>
              </Pressable>
            </View>
            {[12, 35, 71, 86].map((left, particleIndex) => (
              <RisingParticle key={`${current.id}-${left}`} left={`${left}%` as `${number}%`} delay={particleIndex * 220} accent={current.accent} />
            ))}
          </View>

          <Animated.View entering={FadeIn.duration(420)} exiting={FadeOut.duration(180)} className="mt-[-102px] flex-1 justify-end px-7 pb-6">
            <Text className="mb-2 text-[11px] font-extrabold uppercase tracking-[1.1px] text-[rgba(255,255,255,0.55)]">{current.eyebrow}</Text>
            <Text className="text-[35px] font-extrabold leading-[39px] text-white">{current.firstLine}</Text>
            <Text className="text-[35px] font-extrabold leading-[39px] text-white">
              {current.secondLine.replace(current.highlight, '')}
              <Text className="font-extrabold" style={{ color: current.accent }}>{current.highlight}</Text>
            </Text>
            <Text className="mt-[14px] max-w-[330px] text-[14px] font-medium leading-[21px] text-[rgba(255,255,255,0.78)]">{current.description}</Text>

            <View className="mb-5 mt-[26px] flex-row items-center justify-center gap-2">
              {slides.map((slide, slideIndex) => (
                <Pressable
                  key={slide.id}
                  onPress={() => setIndex(slideIndex)}
                  className={`h-2 rounded-full ${slideIndex === index ? 'w-[18px]' : 'w-2'} bg-[rgba(255,255,255,0.3)]`}
                  style={slideIndex === index ? { backgroundColor: current.accent } : undefined}
                  hitSlop={8}
                />
              ))}
            </View>

            <AnimatedPressable
              onPress={goNext}
              onPressIn={() => {
                press.value = withSpring(0.97);
              }}
              onPressOut={() => {
                press.value = withSpring(1);
              }}
              className="h-[58px] flex-row items-center justify-center rounded-full"
              style={[{ backgroundColor: current.accent, shadowColor: current.accent, shadowOpacity: 0.34, shadowRadius: 22, shadowOffset: { width: 0, height: 12 }, elevation: 8 }, buttonStyle]}
            >
              <Text className="text-[15px] font-extrabold leading-5 text-white">{current.buttonLabel}</Text>
              <View className="absolute right-[10px] h-[38px] w-[38px] items-center justify-center rounded-full bg-white">
                <Feather name="chevron-right" size={18} color={current.accent} />
              </View>
            </AnimatedPressable>

            <Pressable onPress={finish} className="mt-[18px] min-h-7 flex-row items-center justify-center">
              <Text className="text-[13px] font-medium leading-[18px] text-[rgba(255,255,255,0.66)]">Already have an account? </Text>
              <Text className="text-[13px] font-extrabold leading-[18px]" style={{ color: current.id === 'spiritual' ? GREEN : ORANGE }}>Sign In</Text>
            </Pressable>
          </Animated.View>
        </Animated.View>
      </View>
    </GestureDetector>
  );
};

export default OnboardingScreen;
