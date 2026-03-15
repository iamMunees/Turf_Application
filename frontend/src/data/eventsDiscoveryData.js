export const cityOptions = [
  { id: 'chennai', name: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707 },
  { id: 'madurai', name: 'Madurai', state: 'Tamil Nadu', lat: 9.9252, lng: 78.1198 },
  { id: 'tiruppur', name: 'Tiruppur', state: 'Tamil Nadu', lat: 11.1085, lng: 77.3411 },
  { id: 'bengaluru', name: 'Bengaluru', state: 'Karnataka', lat: 12.9716, lng: 77.5946 },
  { id: 'coimbatore', name: 'Coimbatore', state: 'Tamil Nadu', lat: 11.0168, lng: 76.9558 },
  { id: 'salem', name: 'Salem', state: 'Tamil Nadu', lat: 11.6643, lng: 78.146 },
];

export const sportOptions = [
  'Cricket',
  'Badminton',
  'Tennis',
  'Football',
  'Basketball',
  'Volleyball',
];

export const levelOptions = ['Local', 'State', 'National', 'International'];
export const statusOptions = ['Registering', 'Ongoing', 'Completed'];
export const sortOptions = ['Nearest', 'Most Popular', 'Newest', 'Ending Soon'];

export const radiusOptions = [
  { label: '5 km', value: 5 },
  { label: '10 km', value: 10 },
  { label: '25 km', value: 25 },
  { label: '50 km', value: 50 },
  { label: 'Any', value: 250 },
];

export const priceOptions = [
  { label: 'Free', value: 0 },
  { label: 'Up to ₹500', value: 500 },
  { label: 'Up to ₹1000', value: 1000 },
  { label: '₹1000+', value: 5000 },
];

export const dateRangeOptions = [
  { id: 'upcoming', label: 'Upcoming events' },
  { id: 'week', label: 'This week' },
  { id: 'month', label: 'This month' },
];

export const eventsDiscoveryData = [
  {
    id: 'chepauk-premier-cup',
    name: 'Chepauk Premier Cricket Cup',
    sport: 'Cricket',
    level: 'State',
    status: 'Registering',
    city: 'Chennai',
    venue: 'M. A. Chidambaram Stadium',
    address: 'Wallajah Road, Chepauk, Chennai, Tamil Nadu 600002',
    lat: 13.0621,
    lng: 80.2796,
    dateTime: '2026-03-15T18:00:00+05:30',
    endDateTime: '2026-03-15T22:00:00+05:30',
    registrationDeadline: '2026-03-14T20:00:00+05:30',
    fee: 800,
    rating: 4.7,
    participantsCount: 245,
    popularity: 94,
    image:
      'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80',
    description:
      'A one-day floodlit tournament featuring city clubs, knockout cricket, live scoring, and academy scouting.',
    rules: [
      'Tennis-ball format with 8-over matches.',
      'Squads may register up to 12 players.',
      'Photo ID is mandatory at check-in.',
    ],
    organizer: { name: 'Chennai Cricket Circle', contact: '+91 98401 22334', rating: 4.8 },
    participants: [
      { id: 'p1', name: 'Arjun Prakash' },
      { id: 'p2', name: 'Nivetha Sri' },
      { id: 'p3', name: 'Vikram Das' },
      { id: 'p4', name: 'Harini Balan' },
    ],
    comments: [
      { id: 'c1', author: 'Rohit', rating: 5, text: 'Well-run bracket and sharp scheduling last season.' },
      { id: 'c2', author: 'Maya', rating: 4, text: 'Great crowd energy and solid umpiring crew.' },
    ],
  },
  {
    id: 'marina-smash-open',
    name: 'Marina Smash Open',
    sport: 'Badminton',
    level: 'Local',
    status: 'Registering',
    city: 'Chennai',
    venue: 'T Nagar Indoor Arena',
    address: 'Bazullah Road, T. Nagar, Chennai, Tamil Nadu 600017',
    lat: 13.0418,
    lng: 80.2337,
    dateTime: '2026-03-18T09:00:00+05:30',
    endDateTime: '2026-03-18T18:00:00+05:30',
    registrationDeadline: '2026-03-17T18:00:00+05:30',
    fee: 300,
    rating: 4.5,
    participantsCount: 112,
    popularity: 71,
    image:
      'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1200&q=80',
    description:
      'Singles and doubles brackets for amateur and intermediate players with same-day finals.',
    rules: [
      'Yonex feather shuttles will be used.',
      'All matches follow BWF scoring.',
      'Players should report 30 minutes before match time.',
    ],
    organizer: { name: 'Marina Racquet Club', contact: '+91 90030 11223', rating: 4.6 },
    participants: [
      { id: 'p5', name: 'Asha Menon' },
      { id: 'p6', name: 'Faiz Ali' },
      { id: 'p7', name: 'Keerthi Anand' },
    ],
    comments: [
      { id: 'c3', author: 'Ananya', rating: 4, text: 'Friendly draw and accurate match updates.' },
    ],
  },
  {
    id: 'kovai-hoops-classic',
    name: 'Kovai Hoops Classic',
    sport: 'Basketball',
    level: 'State',
    status: 'Ongoing',
    city: 'Coimbatore',
    venue: 'VOC Park Sports Complex',
    address: 'VOC Park, Coimbatore, Tamil Nadu 641018',
    lat: 11.0059,
    lng: 76.9629,
    dateTime: '2026-03-13T16:00:00+05:30',
    endDateTime: '2026-03-16T20:00:00+05:30',
    registrationDeadline: '2026-03-10T21:00:00+05:30',
    fee: 1200,
    rating: 4.8,
    participantsCount: 180,
    popularity: 88,
    image:
      'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80',
    description:
      'A four-day club invitational with youth and senior divisions across full-court indoor facilities.',
    rules: [
      'FIBA rules apply for all senior games.',
      'Only registered uniforms are allowed on court.',
      'Team managers must attend the pre-match briefing.',
    ],
    organizer: { name: 'Kovai Sports Union', contact: '+91 98422 55441', rating: 4.7 },
    participants: [
      { id: 'p8', name: 'Sanjay K' },
      { id: 'p9', name: 'Rithika J' },
      { id: 'p10', name: 'Joel Moses' },
    ],
    comments: [
      { id: 'c4', author: 'Imran', rating: 5, text: 'Strong officiating and great venue lighting.' },
    ],
  },
  {
    id: 'meenakshi-football-fest',
    name: 'Meenakshi Football Fest',
    sport: 'Football',
    level: 'National',
    status: 'Registering',
    city: 'Madurai',
    venue: 'Race Course Ground',
    address: 'Race Course Road, Madurai, Tamil Nadu 625002',
    lat: 9.9185,
    lng: 78.1302,
    dateTime: '2026-03-20T17:30:00+05:30',
    endDateTime: '2026-03-22T21:00:00+05:30',
    registrationDeadline: '2026-03-18T18:00:00+05:30',
    fee: 1500,
    rating: 4.6,
    participantsCount: 320,
    popularity: 90,
    image:
      'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=1200&q=80',
    description:
      'Three-day football carnival with 7-a-side and 11-a-side divisions, live commentary, and talent scouting.',
    rules: [
      'All teams need matching jerseys with visible numbers.',
      'Two yellow cards across the tournament lead to suspension.',
      'Medical staff will be available on-site.',
    ],
    organizer: { name: 'South Goal Collective', contact: '+91 94431 66554', rating: 4.5 },
    participants: [
      { id: 'p11', name: 'Akil Raj' },
      { id: 'p12', name: 'Nandhini S' },
      { id: 'p13', name: 'Sathya V' },
      { id: 'p14', name: 'Ramesh P' },
    ],
    comments: [
      { id: 'c5', author: 'Deepa', rating: 5, text: 'Crowd turnout and turf quality were excellent.' },
    ],
  },
  {
    id: 'tiruppur-ace-serve',
    name: 'Tiruppur Ace Serve',
    sport: 'Tennis',
    level: 'Local',
    status: 'Registering',
    city: 'Tiruppur',
    venue: 'Nethaji Tennis Centre',
    address: 'Kangeyam Road, Tiruppur, Tamil Nadu 641604',
    lat: 11.1021,
    lng: 77.347,
    dateTime: '2026-03-16T07:00:00+05:30',
    endDateTime: '2026-03-17T19:00:00+05:30',
    registrationDeadline: '2026-03-15T12:00:00+05:30',
    fee: 500,
    rating: 4.3,
    participantsCount: 68,
    popularity: 59,
    image:
      'https://images.unsplash.com/photo-1622279457486-28f7e8780d50?auto=format&fit=crop&w=1200&q=80',
    description:
      'Open singles tournament for junior and open categories with hard-court matches and evening finals.',
    rules: [
      'ITF warm-up rules apply.',
      'Players must bring their own rackets and backup strings.',
      'Matches use deciding-point deuce.',
    ],
    organizer: { name: 'Tiruppur Tennis Hub', contact: '+91 99620 55348', rating: 4.4 },
    participants: [
      { id: 'p15', name: 'Mithun Raj' },
      { id: 'p16', name: 'Pavithra D' },
    ],
    comments: [
      { id: 'c6', author: 'Sanjana', rating: 4, text: 'Smooth registration flow and punctual draws.' },
    ],
  },
  {
    id: 'garden-city-volley-jam',
    name: 'Garden City Volley Jam',
    sport: 'Volleyball',
    level: 'State',
    status: 'Registering',
    city: 'Bengaluru',
    venue: 'Kanteerava Indoor Stadium',
    address: 'Kasturba Road, Sampangi Rama Nagar, Bengaluru, Karnataka 560001',
    lat: 12.9719,
    lng: 77.5937,
    dateTime: '2026-03-22T10:00:00+05:30',
    endDateTime: '2026-03-22T20:30:00+05:30',
    registrationDeadline: '2026-03-19T20:00:00+05:30',
    fee: 1000,
    rating: 4.9,
    participantsCount: 202,
    popularity: 97,
    image:
      'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=1200&q=80',
    description:
      'High-energy day tournament with mixed-gender team slots, music programming, and pro clinic sessions.',
    rules: [
      'Each roster must include at least two women on court.',
      'Net-touch faults follow federation guidelines.',
      'Organizers provide official match balls.',
    ],
    organizer: { name: 'Volley Bengaluru', contact: '+91 99011 77332', rating: 4.9 },
    participants: [
      { id: 'p17', name: 'Prerna N' },
      { id: 'p18', name: 'Aravind R' },
      { id: 'p19', name: 'Karan A' },
    ],
    comments: [
      { id: 'c7', author: 'Gautham', rating: 5, text: 'Best-organized city volleyball event I have attended.' },
    ],
  },
  {
    id: 'salem-streetball-series',
    name: 'Salem Streetball Series',
    sport: 'Basketball',
    level: 'Local',
    status: 'Completed',
    city: 'Salem',
    venue: 'Corporation Sports Ground',
    address: 'Fairlands, Salem, Tamil Nadu 636016',
    lat: 11.6739,
    lng: 78.1369,
    dateTime: '2026-03-08T15:30:00+05:30',
    endDateTime: '2026-03-08T21:00:00+05:30',
    registrationDeadline: '2026-03-05T19:00:00+05:30',
    fee: 0,
    rating: 4.2,
    participantsCount: 90,
    popularity: 54,
    image:
      'https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=1200&q=80',
    description:
      'Open-air 3x3 evening tournament spotlighting Salem youth teams and freestyle showcase games.',
    rules: [
      'Half-court 3x3 official FIBA rules.',
      'Free public entry and open seating.',
    ],
    organizer: { name: 'Salem Hoops Network', contact: '+91 93612 89344', rating: 4.3 },
    participants: [
      { id: 'p20', name: 'Ravi D' },
      { id: 'p21', name: 'Shyla K' },
    ],
    comments: [
      { id: 'c8', author: 'Kishore', rating: 4, text: 'Free event with a lively local crowd.' },
    ],
  },
  {
    id: 'bay-breakers-footy-night',
    name: 'Bay Breakers Footy Night',
    sport: 'Football',
    level: 'International',
    status: 'Registering',
    city: 'Chennai',
    venue: 'Jawaharlal Nehru Stadium',
    address: 'Periamet, Chennai, Tamil Nadu 600003',
    lat: 13.0825,
    lng: 80.2755,
    dateTime: '2026-03-28T19:00:00+05:30',
    endDateTime: '2026-03-28T23:00:00+05:30',
    registrationDeadline: '2026-03-24T23:00:00+05:30',
    fee: 1000,
    rating: 4.9,
    participantsCount: 410,
    popularity: 99,
    image:
      'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1200&q=80',
    description:
      'International invitational exhibition with academy clinics, live music, and premium spectator zones.',
    rules: [
      'Registration confirms spectator and clinic access package.',
      'No outside food allowed inside premium enclosure.',
    ],
    organizer: { name: 'Bay Sports Live', contact: '+91 98844 22011', rating: 4.9 },
    participants: [
      { id: 'p22', name: 'Leo Costa' },
      { id: 'p23', name: 'Rhea Thomas' },
      { id: 'p24', name: 'Nathan Roy' },
    ],
    comments: [
      { id: 'c9', author: 'Varsha', rating: 5, text: 'Premium production quality and easy transport access.' },
    ],
  },
];
