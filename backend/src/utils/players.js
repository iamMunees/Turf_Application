const sanitizeText = (value = '') =>
  String(value)
    .replace(/[<>]/g, '')
    .trim();

const formatPlayerResponse = ({ player, stats, following = false }) => ({
  id: player._id,
  name: player.fullName,
  sport: player.sportType,
  level: player.level,
  city: player.city,
  bio: player.bio,
  player_type: player.playerType,
  is_verified: player.isVerified,
  is_rising_star: player.isRisingStar,
  followers_count: player.followersCount,
  following_count: player.followingCount,
  rating: player.rating,
  training_offered: player.trainingOffered,
  training_price: player.trainingPrice,
  training_slots: player.trainingSlots,
  following,
  stats,
});

const isWithin24Hours = ({ date, time }) => {
  const sessionDate = new Date(`${date}T${time}:00+05:30`);
  const diffMs = sessionDate.getTime() - Date.now();
  return diffMs < 24 * 60 * 60 * 1000;
};

const startOfToday = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
};

module.exports = {
  sanitizeText,
  formatPlayerResponse,
  isWithin24Hours,
  startOfToday,
};
