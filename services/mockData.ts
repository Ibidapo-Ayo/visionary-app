export interface MockMember {
  id: string;
  name: string;
  email: string;
  status: 'new' | 'at-risk' | 'active' | 'inactive';
}

export interface MockEvent {
  id: string;
  title: string;
  description: string;
  startAt: string;
  endAt: string;
  location: string;
}

export interface MockBibleJourneyReading {
  id: string;
  period: 'morning' | 'evening';
  title: string;
  reference: string;
  estimatedMinutes: number;
  focus: string;
}

export interface MockBibleJourneyProgress {
  year: number;
  cyclesCompleted: number;
  cyclesTarget: number;
  completedReadings: number;
  totalReadings: number;
}

export interface MockBibleJourneySessionPlan {
  morning: string[];
  evening: string[];
}

export interface MockBibleVerse {
  number: number;
  text: string;
}

export interface MockBibleReadingChapter {
  id: string;
  title: string;
  reference: string;
  estimatedMinutes: number;
  verses: MockBibleVerse[];
}

export type MockSpiritualMetricIconKey =
  | 'bibleJourney'
  | 'bibleReadingStreak'
  | 'prayerStreak'
  | 'attendanceStreak'
  | 'digestStreak'
  | 'overallJourney';

export interface MockSpiritualMetric {
  id: string;
  title: string;
  iconKey: MockSpiritualMetricIconKey;
  progress: number;
  currentValue: string;
  currentStreak: string;
  encouragement: string;
  color: string;
}

export interface MockAchievement {
  id: string;
  badge: string;
  title: string;
  unlockedOn: string;
  spiritualXp: number;
}

export type MockSpiritualActivityType = 'bibleReading' | 'reflection' | 'attendance' | 'digest' | 'prayer';

export interface MockSpiritualActivity {
  id: string;
  type: MockSpiritualActivityType;
  title: string;
  date: string;
  time: string;
}

export const mockMembers: MockMember[] = [
  { id: '1', name: 'Sarah Johnson', email: 'sarah@example.com', status: 'new' },
  { id: '2', name: 'Michael Davis', email: 'michael@example.com', status: 'active' },
  { id: '3', name: 'Ava Robinson', email: 'ava@example.com', status: 'at-risk' },
  { id: '4', name: 'Noah Walker', email: 'noah@example.com', status: 'inactive' },
  { id: '5', name: 'Grace Lewis', email: 'grace@example.com', status: 'active' },
];

export const mockEvents: MockEvent[] = [
  {
    id: 'evt_1',
    title: 'Sunday Worship Encounter',
    description: 'A powerful worship service with prayer, teaching, and fellowship.',
    startAt: '2026-07-05T10:00:00',
    endAt: '2026-07-05T12:15:00',
    location: 'Main Sanctuary',
  },
  {
    id: 'evt_2',
    title: 'Midweek Bible Deep Dive',
    description: 'Scripture study, practical reflection, and guided group discussion.',
    startAt: '2026-07-08T19:00:00',
    endAt: '2026-07-08T20:30:00',
    location: 'Room 204',
  },
  {
    id: 'evt_3',
    title: 'Youth Ignite Night',
    description: 'A high-energy youth gathering with worship, testimony, and prayer.',
    startAt: '2026-07-11T18:00:00',
    endAt: '2026-07-11T20:00:00',
    location: 'Community Hall',
  },
];

export const mockDailyDigest = {
  devotional: {
    title: 'Faith In Action',
    scripture: 'James 2:17',
    reflection:
      'Faith is made visible by how we serve and love others each day. Take one step of obedience today.',
  },
  prayerFocus: 'Pray for first-time visitors and for families facing difficult decisions this week.',
};

export const mockBibleJourneyReadings: MockBibleJourneyReading[] = [
  {
    id: 'bj_morning_1',
    period: 'morning',
    title: "Today's Morning Reading",
    reference: 'Genesis 15-17',
    estimatedMinutes: 22,
    focus: 'Walk by covenant faith and obedience.',
  },
  {
    id: 'bj_evening_1',
    period: 'evening',
    title: "Today's Evening Reading",
    reference: 'Matthew 11-13',
    estimatedMinutes: 19,
    focus: 'Receive rest, mercy, and kingdom truth.',
  },
];

export const mockBibleJourneyProgress: MockBibleJourneyProgress = {
  year: 2026,
  cyclesCompleted: 1.18,
  cyclesTarget: 2,
  completedReadings: 432,
  totalReadings: 730,
};

export const mockBibleJourneySessionPlan: MockBibleJourneySessionPlan = {
  morning: ['Genesis 15', 'Genesis 16', 'Genesis 17'],
  evening: ['Matthew 11', 'Matthew 12', 'Matthew 13'],
};

export const mockBibleReadingChapters: MockBibleReadingChapter[] = [
  {
    id: 'genesis-15',
    title: 'Gods Covenant With Abram',
    reference: 'Genesis 15',
    estimatedMinutes: 7,
    verses: [
      {
        number: 1,
        text: 'After these things the word of the Lord came to Abram in a vision: Fear not, Abram, I am your shield; your reward shall be very great.',
      },
      {
        number: 5,
        text: 'And he brought him outside and said, Look toward heaven, and number the stars, if you are able to number them. Then he said to him, So shall your offspring be.',
      },
      {
        number: 6,
        text: 'And he believed the Lord, and he counted it to him as righteousness.',
      },
      {
        number: 9,
        text: 'He said to him, Bring me a heifer three years old, a female goat three years old, a ram three years old, a turtledove, and a young pigeon.',
      },
      {
        number: 13,
        text: 'Then the Lord said to Abram, Know for certain that your offspring will be sojourners in a land that is not theirs and will be servants there.',
      },
      {
        number: 18,
        text: 'On that day the Lord made a covenant with Abram, saying, To your offspring I give this land.',
      },
    ],
  },
  {
    id: 'genesis-16',
    title: 'Hagar and Ishmael',
    reference: 'Genesis 16',
    estimatedMinutes: 6,
    verses: [
      {
        number: 1,
        text: 'Now Sarai, Abrams wife, had borne him no children. She had a female Egyptian servant whose name was Hagar.',
      },
      {
        number: 3,
        text: 'So, after Abram had lived ten years in the land of Canaan, Sarai took Hagar the Egyptian, her servant, and gave her to Abram her husband as a wife.',
      },
      {
        number: 7,
        text: 'The angel of the Lord found her by a spring of water in the wilderness, the spring on the way to Shur.',
      },
      {
        number: 10,
        text: 'The angel of the Lord also said to her, I will surely multiply your offspring so that they cannot be numbered for multitude.',
      },
      {
        number: 13,
        text: 'So she called the name of the Lord who spoke to her, You are a God of seeing.',
      },
      {
        number: 16,
        text: 'And Hagar bore Abram a son, and Abram called the name of his son, whom Hagar bore, Ishmael.',
      },
    ],
  },
  {
    id: 'genesis-17',
    title: 'Abraham and the Sign of the Covenant',
    reference: 'Genesis 17',
    estimatedMinutes: 9,
    verses: [
      {
        number: 1,
        text: 'When Abram was ninety-nine years old the Lord appeared to Abram and said to him, I am God Almighty; walk before me, and be blameless.',
      },
      {
        number: 4,
        text: 'Behold, my covenant is with you, and you shall be the father of a multitude of nations.',
      },
      {
        number: 5,
        text: 'No longer shall your name be called Abram, but your name shall be Abraham.',
      },
      {
        number: 7,
        text: 'And I will establish my covenant between me and you and your offspring after you throughout their generations for an everlasting covenant.',
      },
      {
        number: 15,
        text: 'And God said to Abraham, As for Sarai your wife, you shall not call her name Sarai, but Sarah shall be her name.',
      },
      {
        number: 19,
        text: 'God said, No, but Sarah your wife shall bear you a son, and you shall call his name Isaac.',
      },
    ],
  },
  {
    id: 'matthew-11',
    title: 'Come to Me and Find Rest',
    reference: 'Matthew 11',
    estimatedMinutes: 6,
    verses: [
      {
        number: 4,
        text: 'Jesus answered them, Go and tell John what you hear and see.',
      },
      {
        number: 6,
        text: 'And blessed is the one who is not offended by me.',
      },
      {
        number: 28,
        text: 'Come to me, all who labor and are heavy laden, and I will give you rest.',
      },
      {
        number: 29,
        text: 'Take my yoke upon you, and learn from me, for I am gentle and lowly in heart, and you will find rest for your souls.',
      },
    ],
  },
  {
    id: 'matthew-12',
    title: 'Mercy Over Sacrifice',
    reference: 'Matthew 12',
    estimatedMinutes: 7,
    verses: [
      {
        number: 7,
        text: 'And if you had known what this means, I desire mercy, and not sacrifice, you would not have condemned the guiltless.',
      },
      {
        number: 18,
        text: 'Behold, my servant whom I have chosen, my beloved with whom my soul is well pleased.',
      },
      {
        number: 21,
        text: 'And in his name the Gentiles will hope.',
      },
      {
        number: 36,
        text: 'I tell you, on the day of judgment people will give account for every careless word they speak.',
      },
    ],
  },
  {
    id: 'matthew-13',
    title: 'Parables of the Kingdom',
    reference: 'Matthew 13',
    estimatedMinutes: 8,
    verses: [
      {
        number: 8,
        text: 'Other seeds fell on good soil and produced grain, some a hundredfold, some sixty, some thirty.',
      },
      {
        number: 23,
        text: 'As for what was sown on good soil, this is the one who hears the word and understands it.',
      },
      {
        number: 44,
        text: 'The kingdom of heaven is like treasure hidden in a field, which a man found and covered up.',
      },
      {
        number: 46,
        text: 'On finding one pearl of great value, he went and sold all that he had and bought it.',
      },
    ],
  },
];

export const mockProfileMeta = {
  churchUnit: 'Young Adults Fellowship',
  memberId: 'VN-20487',
};

export const mockSpiritualMetrics: MockSpiritualMetric[] = [
  {
    id: 'metric_bible_journey',
    title: 'Bible Journey Progress',
    iconKey: 'bibleJourney',
    progress: 0.59,
    currentValue: '432 / 730 readings',
    currentStreak: '18-day journey rhythm',
    encouragement: 'Keep turning pages. Consistency builds revelation.',
    color: '#FF9D47',
  },
  {
    id: 'metric_bible_reading',
    title: 'Bible Reading Streak',
    iconKey: 'bibleReadingStreak',
    progress: 0.74,
    currentValue: '22 days strong',
    currentStreak: 'Longest streak: 35 days',
    encouragement: 'Your mornings are becoming sacred and steady.',
    color: '#F4B367',
  },
  {
    id: 'metric_prayer',
    title: 'Prayer Streak',
    iconKey: 'prayerStreak',
    progress: 0.68,
    currentValue: '17 days',
    currentStreak: '5 prayers submitted this week',
    encouragement: 'Prayer is forming strength in hidden places.',
    color: '#16A34A',
  },
  {
    id: 'metric_attendance',
    title: 'Attendance Streak',
    iconKey: 'attendanceStreak',
    progress: 0.9,
    currentValue: '9 services in a row',
    currentStreak: 'This month: 100% attendance',
    encouragement: 'Showing up faithfully is shaping your growth.',
    color: '#3FBA6A',
  },
  {
    id: 'metric_digest',
    title: 'Daily Digest Streak',
    iconKey: 'digestStreak',
    progress: 0.62,
    currentValue: '13 days',
    currentStreak: 'Daily reflection completion: 62%',
    encouragement: 'Stay locked in. Daily truth keeps your heart centered.',
    color: '#E38C42',
  },
  {
    id: 'metric_overall',
    title: 'Overall Spiritual Journey',
    iconKey: 'overallJourney',
    progress: 0.71,
    currentValue: '71% yearly goal',
    currentStreak: 'Spiritual XP: 1,240',
    encouragement: 'You are growing in depth, discipline, and devotion.',
    color: '#FF7A00',
  },
];

export const mockProfileAchievements: MockAchievement[] = [
  {
    id: 'achv_bible_7',
    badge: '🔥',
    title: '7-Day Bible Journey',
    unlockedOn: 'Unlocked Jun 19, 2026',
    spiritualXp: 120,
  },
  {
    id: 'achv_bible_complete',
    badge: '📖',
    title: 'Bible Completed Once',
    unlockedOn: 'Unlocked Apr 04, 2026',
    spiritualXp: 360,
  },
  {
    id: 'achv_prayer_30',
    badge: '🙏',
    title: '30-Day Prayer Streak',
    unlockedOn: 'Unlocked May 28, 2026',
    spiritualXp: 280,
  },
  {
    id: 'achv_attendance',
    badge: '⛪',
    title: 'Perfect Monthly Attendance',
    unlockedOn: 'Unlocked Jun 30, 2026',
    spiritualXp: 190,
  },
  {
    id: 'achv_reflection',
    badge: '🌱',
    title: 'First Reflection Completed',
    unlockedOn: 'Unlocked Feb 17, 2026',
    spiritualXp: 75,
  },
  {
    id: 'achv_xp_100',
    badge: '🎉',
    title: '100 Spiritual XP',
    unlockedOn: 'Unlocked Jan 26, 2026',
    spiritualXp: 100,
  },
];

export const mockRecentSpiritualActivities: MockSpiritualActivity[] = [
  {
    id: 'activity_1',
    type: 'bibleReading',
    title: 'Completed Morning Bible Reading',
    date: 'Jul 1, 2026',
    time: '6:45 AM',
  },
  {
    id: 'activity_2',
    type: 'reflection',
    title: 'Finished Bible Reflection',
    date: 'Jul 1, 2026',
    time: '7:08 AM',
  },
  {
    id: 'activity_3',
    type: 'attendance',
    title: 'Checked into Sunday Service',
    date: 'Jun 29, 2026',
    time: '10:11 AM',
  },
  {
    id: 'activity_4',
    type: 'digest',
    title: 'Completed Daily Visionary Digest',
    date: 'Jun 28, 2026',
    time: '8:04 PM',
  },
  {
    id: 'activity_5',
    type: 'prayer',
    title: 'Submitted Prayer Request',
    date: 'Jun 28, 2026',
    time: '8:20 PM',
  },
  {
    id: 'activity_6',
    type: 'bibleReading',
    title: 'Completed Evening Reading',
    date: 'Jun 27, 2026',
    time: '9:01 PM',
  },
];
