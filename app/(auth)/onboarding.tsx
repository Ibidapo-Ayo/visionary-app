import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';
import { useAppStore } from '@store/appStore';
import Button from '@components/Button';

const { width, height } = Dimensions.get('window');

const OnboardingSlides = [
  {
    title: 'Welcome to Visionary',
    description: 'Transform how your ministry connects, serves, and grows together',
    color: '#1e40af',
  },
  {
    title: 'Track Attendance',
    description: 'QR code check-ins make it easy to monitor who\'s engaged',
    color: '#7c3aed',
  },
  {
    title: 'AI-Powered Chat',
    description: 'Get instant spiritual guidance and scripture references',
    color: '#059669',
  },
  {
    title: 'Member Follow-ups',
    description: 'Never miss an opportunity to care for your community',
    color: '#dc2626',
  },
  {
    title: 'Prayer & Giving',
    description: 'Foster deeper connection through unified prayer and generosity',
    color: '#f59e0b',
  },
  {
    title: 'Ready to Begin?',
    description: 'Let\'s build something great together',
    color: '#fbbf24',
  },
];

const OnboardingScreen = () => {
  const router = useRouter();
  const setOnboardingComplete = useAppStore((state) => state.setOnboardingComplete);
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < OnboardingSlides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      setOnboardingComplete(true);
      router.replace('/(auth)/login');
    }
  };

  const handleSkip = () => {
    setOnboardingComplete(true);
    router.replace('/(auth)/login');
  };

  const slide = OnboardingSlides[currentSlide];
  const progress = ((currentSlide + 1) / OnboardingSlides.length) * 100;

  return (
    <View style={styles.container}>
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <Animated.View
          style={[
            styles.progressBar,
            {
              width: `${progress}%`,
              backgroundColor: slide.color,
            },
          ]}
        />
      </View>

      {/* Slide Content */}
      <Animated.View
        style={[styles.content, { backgroundColor: slide.color }]}
        entering={FadeIn.duration(400)}
        key={`slide-${currentSlide}`}
      >
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.description}>{slide.description}</Text>
      </Animated.View>

      {/* Navigation Buttons */}
      <Animated.View style={styles.buttons} entering={SlideInUp.duration(400)}>
        {currentSlide > 0 && (
          <TouchableOpacity
            style={styles.dotButton}
            onPress={() => setCurrentSlide(currentSlide - 1)}
          >
            <Text style={styles.dotText}>←</Text>
          </TouchableOpacity>
        )}

        <View style={styles.dots}>
          {OnboardingSlides.map((_, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    index === currentSlide ? '#fbbf24' : '#64748b',
                },
              ]}
              onPress={() => setCurrentSlide(index)}
            />
          ))}
        </View>

        {currentSlide < OnboardingSlides.length - 1 ? (
          <>
            <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
            <Button
              onPress={handleNext}
              title="Next"
              variant="secondary"
              size="sm"
              style={styles.nextButton}
            />
          </>
        ) : (
          <Button
            onPress={handleNext}
            title="Get Started"
            variant="primary"
            fullWidth
          />
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111226',
    justifyContent: 'space-between',
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#2d3a5a',
    width: '100%',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
  },
  buttons: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    gap: 12,
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  skipText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  nextButton: {
    marginBottom: 8,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotButton: {
    paddingVertical: 12,
  },
  dotText: {
    fontSize: 20,
    color: '#fbbf24',
    textAlign: 'center',
  },
});

export default OnboardingScreen;
