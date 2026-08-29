import { useEffect, useMemo, useState } from 'react';

const READING_COMPLETION_MESSAGES = [
  'Hurray! You are done reading for today. Up next is tomorrow morning, and it is going to be exciting.',
  'Beautiful consistency today. Tomorrow morning carries a fresh word just for you.',
  'You completed today\'s chapters. Rest well, tomorrow morning\'s reading is waiting for you.',
  'Strong finish today. Tomorrow morning\'s chapter is locked in and ready for a new start.',
  'Discipline looks good on you. Tomorrow morning brings another powerful chapter.',
  'Today is complete. Get ready, tomorrow morning\'s reading is your next spiritual highlight.',
] as const;

const MESSAGE_ROTATION_INTERVAL_MS = 7000;

const getRandomMessageIndex = () => Math.floor(Math.random() * READING_COMPLETION_MESSAGES.length);

export const useRotatingCompletionMessage = (enabled: boolean) => {
  const [messageIndex, setMessageIndex] = useState<number>(getRandomMessageIndex);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    setMessageIndex(getRandomMessageIndex());
  }, [enabled]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const interval = setInterval(() => {
      setMessageIndex((currentIndex) => (currentIndex + 1) % READING_COMPLETION_MESSAGES.length);
    }, MESSAGE_ROTATION_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [enabled]);

  return useMemo(() => READING_COMPLETION_MESSAGES[messageIndex], [messageIndex]);
};