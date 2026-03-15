export const defaultSocialFilters = {
  tab: 'All Posts',
  sortBy: 'Newest',
  sport: 'All Sports',
  city: 'All Cities',
  playerType: 'All',
  dateRange: 'Any Time',
  discoverTalentOnly: false,
};

export const formatCompactNumber = (value) =>
  new Intl.NumberFormat('en-IN', { notation: 'compact', maximumFractionDigits: 1 }).format(value);

export const formatRelativeTime = (value) => {
  const now = new Date('2026-03-12T23:59:00+05:30');
  const diffHours = Math.round((now - new Date(value)) / (1000 * 60 * 60));
  if (diffHours < 1) {
    return 'Just now';
  }
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }
  const diffDays = Math.round(diffHours / 24);
  return `${diffDays}d ago`;
};

export const hasCareerBoost = (post) => post.likes >= 100 || post.commentsCount >= 10;

export const getPlayerBadgeState = (profile, posts) => {
  const careerBoostPosts = posts.filter(
    (post) => post.profileId === profile.id && hasCareerBoost(post)
  ).length;

  return {
    verifiedPlayer: profile.registeredEvents >= 5,
    risingStar: careerBoostPosts >= 3,
  };
};

export const matchesDateRange = (value, range) => {
  const date = new Date(value);
  const now = new Date('2026-03-12T23:59:00+05:30');

  if (range === 'Today') {
    return date.toDateString() === now.toDateString();
  }

  if (range === 'This Week') {
    const start = new Date(now);
    const day = start.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;
    start.setDate(start.getDate() + diffToMonday);
    start.setHours(0, 0, 0, 0);
    return date >= start && date <= now;
  }

  if (range === 'This Month') {
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }

  return true;
};

export const createPostPermalink = (postId) => `${window.location.origin}/dashboard/social-feed?post=${postId}`;

export const getHashtagSuggestions = (input, popularTags) => {
  const query = input.trim().toLowerCase();
  if (!query) {
    return popularTags.slice(0, 6);
  }

  return popularTags.filter((tag) => tag.toLowerCase().includes(query)).slice(0, 6);
};
