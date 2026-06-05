export interface MockMember {
  id: string;
  name: string;
  email: string;
  status: 'new' | 'at-risk' | 'active' | 'inactive';
}

export interface MockEvent {
  id: string;
  title: string;
  time: string;
  location: string;
}

export const mockMembers: MockMember[] = [
  { id: '1', name: 'Sarah Johnson', email: 'sarah@example.com', status: 'new' },
  { id: '2', name: 'Michael Davis', email: 'michael@example.com', status: 'active' },
  { id: '3', name: 'Ava Robinson', email: 'ava@example.com', status: 'at-risk' },
  { id: '4', name: 'Noah Walker', email: 'noah@example.com', status: 'inactive' },
  { id: '5', name: 'Grace Lewis', email: 'grace@example.com', status: 'active' },
];

export const mockEvents: MockEvent[] = [
  { id: 'evt_1', title: 'Sunday Service', time: '10:00 AM', location: 'Main Sanctuary' },
  { id: 'evt_2', title: 'Bible Study', time: '7:00 PM', location: 'Room 204' },
  { id: 'evt_3', title: 'Youth Gathering', time: '6:00 PM', location: 'Community Hall' },
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
