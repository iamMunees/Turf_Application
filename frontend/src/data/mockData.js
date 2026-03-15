export const profiles = [
  {
    id: 'player',
    name: 'Player',
    tagline: 'Book slots, build squads, share highlights.',
    accent: 'from-emerald-400 via-teal-400 to-cyan-500',
  },
  {
    id: 'organizer',
    name: 'Organizer',
    tagline: 'Run tournaments, manage venues, fill brackets.',
    accent: 'from-amber-300 via-orange-400 to-rose-500',
  },
  {
    id: 'fan',
    name: 'Fan',
    tagline: 'Track fixtures, support teams, follow creators.',
    accent: 'from-sky-400 via-indigo-400 to-blue-600',
  },
];

export const sports = ['Football', 'Cricket', 'Badminton'];

export const bookingOptions = {
  locations: ['Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad'],
  dates: ['Mar 12', 'Mar 13', 'Mar 14', 'Mar 15'],
  slots: [
    { id: 1, time: '06:00 AM', venue: 'Arena Turf', price: '$28', available: true },
    { id: 2, time: '07:30 AM', venue: 'Victory Dome', price: '$35', available: true },
    { id: 3, time: '09:00 AM', venue: 'Champion Court', price: '$32', available: false },
    { id: 4, time: '06:30 PM', venue: 'Prime Field', price: '$40', available: true },
  ],
};

export const events = [
  {
    id: 'night-league',
    title: 'Night League Championship',
    sport: 'Football',
    date: 'March 18, 2026',
    location: 'Mumbai Sports Arena',
    status: 'Registration Open',
    teams: ['Falcons FC', 'Urban Kicks', 'Blue Strikers', 'Goal Rush'],
    schedule: ['Qualifiers - 6:00 PM', 'Semi Finals - 8:30 PM', 'Final - 10:00 PM'],
  },
  {
    id: 'power-smash',
    title: 'Power Smash Open',
    sport: 'Badminton',
    date: 'March 21, 2026',
    location: 'Ace Indoor Club',
    status: 'Few Slots Left',
    teams: ['Solo bracket', 'Doubles bracket'],
    schedule: ['Round 1 - 9:00 AM', 'Quarter Finals - 1:00 PM', 'Final - 6:00 PM'],
  },
  {
    id: 'weekend-premier-cup',
    title: 'Weekend Premier Cup',
    sport: 'Cricket',
    date: 'March 23, 2026',
    location: 'Bengaluru Turf Park',
    status: 'Featured',
    teams: ['Pitch Predators', 'Boundary Bosses', 'Spin Syndicate', 'Powerplay XI'],
    schedule: ['League Stage - 7:00 AM', 'Knockout - 3:00 PM', 'Final - 7:00 PM'],
  },
];

export const feedPosts = [
  {
    id: 'p1',
    author: 'Aarav Menon',
    role: 'Player',
    sport: 'Football',
    timeAgo: '12m ago',
    caption: 'Golden hour training session before the knockout round.',
    mediaLabel: 'Match reel',
    likes: 248,
    comments: 18,
  },
  {
    id: 'p2',
    author: 'Riya Kapoor',
    role: 'Organizer',
    sport: 'Badminton',
    timeAgo: '48m ago',
    caption: 'Court setup complete. Registration desk opens at 8:00 AM.',
    mediaLabel: 'Venue photo',
    likes: 131,
    comments: 9,
  },
];

export const players = [
  {
    id: 'u1',
    name: 'Kabir Shah',
    sport: 'Football',
    location: 'Mumbai',
    rating: 4.9,
    availability: 'Available tonight',
  },
  {
    id: 'u2',
    name: 'Ishita Rao',
    sport: 'Cricket',
    location: 'Delhi',
    rating: 4.8,
    availability: 'Open for weekend matches',
  },
  {
    id: 'u3',
    name: 'Neel Joshi',
    sport: 'Badminton',
    location: 'Bengaluru',
    rating: 4.7,
    availability: 'Ready for doubles',
  },
];
