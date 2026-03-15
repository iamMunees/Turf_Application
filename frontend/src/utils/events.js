import { cityOptions, radiusOptions } from '../data/eventsDiscoveryData';

export const defaultFilters = {
  sports: [],
  level: 'Any',
  dateRange: 'upcoming',
  priceIndex: 3,
  radiusIndex: 4,
  statuses: ['Registering', 'Ongoing'],
  sortBy: 'Nearest',
};

export const defaultFormValues = {
  name: '',
  email: '',
  phone: '',
  ageGroup: '18+',
};

export const haversineDistance = (from, to) => {
  const earthRadiusKm = 6371;
  const dLat = ((to.lat - from.lat) * Math.PI) / 180;
  const dLng = ((to.lng - from.lng) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((from.lat * Math.PI) / 180) *
      Math.cos((to.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  return earthRadiusKm * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

export const formatDistance = (distance) => `${distance.toFixed(1)} km away`;

export const formatDateTime = (value) =>
  new Intl.DateTimeFormat('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));

export const formatDateOnly = (value) =>
  new Intl.DateTimeFormat('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));

export const formatPrice = (amount) => (amount === 0 ? 'FREE' : `₹${amount.toLocaleString('en-IN')}`);

export const getPriceCap = (index) => [0, 500, 1000, 5000][index] ?? 5000;

export const getRadiusValue = (index) => radiusOptions[index]?.value ?? 250;

export const resolveNearestCity = ({ lat, lng }) => {
  const closest = cityOptions.reduce(
    (best, city) => {
      const distance = haversineDistance({ lat, lng }, city);
      return distance < best.distance ? { city, distance } : best;
    },
    { city: cityOptions[0], distance: Number.POSITIVE_INFINITY }
  );

  return closest.city;
};

export const isWithinDateRange = (value, rangeId) => {
  const now = new Date('2026-03-12T00:00:00+05:30');
  const date = new Date(value);
  if (rangeId === 'week') {
    const weekStart = new Date(now);
    const day = weekStart.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;
    weekStart.setDate(weekStart.getDate() + diffToMonday);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);
    return date >= weekStart && date <= weekEnd;
  }
  if (rangeId === 'month') {
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }
  return date >= now;
};

export const getSportIcon = (sport) =>
  ({
    Cricket: '🏏',
    Badminton: '🏸',
    Tennis: '🎾',
    Football: '⚽',
    Basketball: '🏀',
    Volleyball: '🏐',
  })[sport] ?? '🎟️';

export const getLevelTone = (level) =>
  ({
    Local: 'bg-emerald-400/15 text-emerald-100 border-emerald-300/30',
    State: 'bg-sky-400/15 text-sky-100 border-sky-300/30',
    National: 'bg-amber-400/15 text-amber-100 border-amber-300/30',
    International: 'bg-rose-400/15 text-rose-100 border-rose-300/30',
  })[level] ?? 'bg-white/10 text-white border-white/20';

export const getStatusTone = (status) =>
  ({
    Registering: 'bg-emerald-400/15 text-emerald-100',
    Ongoing: 'bg-amber-400/15 text-amber-100',
    Completed: 'bg-slate-500/20 text-slate-200',
  })[status] ?? 'bg-white/10 text-white';

export const getRelatedEvents = (events, targetEvent) =>
  events.filter(
    (event) =>
      event.id !== targetEvent.id &&
      (event.sport === targetEvent.sport || event.city === targetEvent.city)
  );

export const buildSearchSuggestions = (events) => {
  const values = new Set();
  events.forEach((event) => {
    values.add(event.name);
    values.add(event.sport);
    values.add(event.city);
    values.add(event.venue);
  });
  return [...values];
};

export const getRecommendedEvents = ({ events, favorites, registrations, city }) => {
  const favoriteSports = new Set(
    events.filter((event) => favorites.includes(event.id)).map((event) => event.sport)
  );
  const registeredSports = new Set(
    registrations.map((registration) => registration.eventSport)
  );
  const matchedSports = new Set([...favoriteSports, ...registeredSports]);

  return events.filter(
    (event) =>
      !favorites.includes(event.id) &&
      (matchedSports.size > 0 ? matchedSports.has(event.sport) : event.city === city)
  );
};
