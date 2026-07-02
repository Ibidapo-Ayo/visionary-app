import React from 'react';
import { useRouter } from 'expo-router';
import ComingSoonScreen from '@components/coming-soon/ComingSoonScreen';
import type { ComingSoonCapability } from '@components/coming-soon/FeaturePreviewCard';

const capabilities: ComingSoonCapability[] = [
  { id: '1', label: 'Personalized biblical guidance', icon: 'book-open' },
  { id: '2', label: 'Prayer support', icon: 'heart' },
  { id: '3', label: 'Faith-based conversations', icon: 'message-circle' },
  { id: '4', label: 'Daily encouragement', icon: 'sunrise' },
  { id: '5', label: 'Scripture-based answers', icon: 'compass' },
  { id: '6', label: 'Spiritual growth companion', icon: 'trending-up' },
];

const AICounselorComingSoonScreen = () => {
  const router = useRouter();

  return (
    <ComingSoonScreen
      title="AI Counselor is Coming Soon"
      description="Our AI Counselor is currently being trained to provide thoughtful, biblical, and personalized guidance based on the teachings and values of The Visionary Nation. We're carefully crafting this experience to ensure it becomes a trusted spiritual companion for every member."
      capabilityTitle="What You Will Get"
      capabilities={capabilities}
      primaryButtonLabel="Notify Me When It's Ready"
      secondaryButtonLabel="Back to Home"
      successMessage="You're on the list! We'll notify you when the AI Counselor is available."
      onPrimaryAction={() => undefined}
      onSecondaryAction={() => router.replace('/(app)/home')}
    />
  );
};

export default AICounselorComingSoonScreen;
