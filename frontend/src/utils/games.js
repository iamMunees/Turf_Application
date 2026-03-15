export const formatGameDate = (value) => {
  const target = new Date(value);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const sameDay = (left, right) =>
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate();

  if (sameDay(target, today)) {
    return 'Today';
  }

  if (sameDay(target, tomorrow)) {
    return 'Tomorrow';
  }

  return new Intl.DateTimeFormat('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(target);
};

export const formatGameDateLong = (value) =>
  new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value));

export const formatDistance = (distanceKm = 0) =>
  `${distanceKm.toFixed(distanceKm >= 10 ? 0 : 1)} km away`;

export const getProgress = (currentPlayers, maxPlayers) => {
  if (!maxPlayers) {
    return 0;
  }

  return Math.min(100, Math.round((currentPlayers / maxPlayers) * 100));
};

export const flattenGameGroups = (groups = []) => groups.flatMap((group) => group.items || []);
