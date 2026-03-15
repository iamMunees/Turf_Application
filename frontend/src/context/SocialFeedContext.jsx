/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useEvents } from './EventsContext';
import {
  feedSortOptions,
  feedTabs,
  initialPosts,
  playerProfiles,
  popularHashtags,
  socialCities,
  socialSportOptions,
} from '../data/socialFeedData';
import {
  createPostPermalink,
  defaultSocialFilters,
  formatRelativeTime,
  getPlayerBadgeState,
  hasCareerBoost,
  matchesDateRange,
} from '../utils/socialFeed';

const SocialFeedContext = createContext(null);

const storageKeys = {
  posts: 'lineup-social-posts',
  favorites: 'lineup-social-favorites',
};

const readStorage = (key, fallback) => {
  if (typeof window === 'undefined') {
    return fallback;
  }

  const raw = window.localStorage.getItem(key);
  if (!raw) {
    return fallback;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
};

export const SocialFeedProvider = ({ children }) => {
  const { currentCity, registrations } = useEvents();
  const [posts, setPosts] = useState(() => readStorage(storageKeys.posts, initialPosts));
  const [filters, setFilters] = useState(defaultSocialFilters);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingRevision, setLoadingRevision] = useState(1);
  const [composerLoading, setComposerLoading] = useState(false);
  const [favoritePosts, setFavoritePosts] = useState(() =>
    readStorage(storageKeys.favorites, initialPosts.filter((post) => post.saved).map((post) => post.id))
  );

  const profilesById = useMemo(
    () => Object.fromEntries(playerProfiles.map((profile) => [profile.id, profile])),
    []
  );

  const enrichedPosts = useMemo(
    () =>
      posts.map((post) => {
        const profile = profilesById[post.profileId];
        const badgeState = getPlayerBadgeState(profile, posts);

        return {
          ...post,
          profile,
          badgeState,
          relativeTime: formatRelativeTime(post.createdAt),
          careerBoost: hasCareerBoost(post),
          saved: favoritePosts.includes(post.id),
        };
      }),
    [favoritePosts, posts, profilesById]
  );

  const filteredPosts = useMemo(() => {
    let next = [...enrichedPosts];

    if (filters.tab === feedTabs[1]) {
      next = next.filter((post) => post.city === currentCity.name || post.distanceKm <= 25);
    } else if (filters.tab === feedTabs[2]) {
      next = next.filter((post) => post.careerBoost || post.scoutViewed || post.profile.level !== 'Local');
    } else if (filters.tab === feedTabs[3]) {
      next = next.filter((post) => post.playerType === 'Fun Player');
    } else if (filters.tab === feedTabs[4]) {
      next = next.filter((post) => post.playerType === 'Skill Player');
    }

    if (filters.sport !== socialSportOptions[0]) {
      next = next.filter((post) => post.sport === filters.sport);
    }

    if (filters.city !== socialCities[0]) {
      next = next.filter((post) => post.city === filters.city);
    }

    if (filters.playerType !== 'All') {
      next = next.filter((post) => post.playerType === filters.playerType);
    }

    if (filters.discoverTalentOnly) {
      next = next.filter((post) => post.careerBoost);
    }

    next = next.filter((post) => matchesDateRange(post.createdAt, filters.dateRange));

    if (filters.sortBy === feedSortOptions[0]) {
      next.sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt));
    } else if (filters.sortBy === feedSortOptions[1]) {
      next.sort((left, right) => right.likes - left.likes);
    } else if (filters.sortBy === feedSortOptions[2]) {
      next.sort((left, right) => right.views - left.views);
    } else if (filters.sortBy === feedSortOptions[3]) {
      next.sort((left, right) => left.distanceKm - right.distanceKm);
    }

    return next;
  }, [currentCity.name, enrichedPosts, filters]);

  const currentUserRegisteredCount = registrations.length;

  useEffect(() => {
    window.localStorage.setItem(storageKeys.posts, JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    window.localStorage.setItem(storageKeys.favorites, JSON.stringify(favoritePosts));
  }, [favoritePosts]);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 300);
    return () => window.clearTimeout(timer);
  }, [loadingRevision]);

  const updateFilters = (patch) => {
    setIsLoading(true);
    setLoadingRevision((current) => current + 1);
    setFilters((current) => ({ ...current, ...patch }));
  };

  const likePost = (postId) => {
    setPosts((current) =>
      current.map((post) =>
        post.id === postId
          ? {
              ...post,
              liked: !post.liked,
              likes: post.liked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  const savePost = (postId) => {
    setFavoritePosts((current) =>
      current.includes(postId) ? current.filter((id) => id !== postId) : [...current, postId]
    );
  };

  const addComment = (postId, message, emoji) => {
    if (!message.trim()) {
      return;
    }

    setPosts((current) =>
      current.map((post) =>
        post.id === postId
          ? {
              ...post,
              commentsCount: post.commentsCount + 1,
              comments: [
                ...post.comments,
                {
                  id: `${postId}-${post.comments.length + 1}`,
                  author: 'You',
                  text: message.trim(),
                  emoji,
                },
              ],
            }
          : post
      )
    );
  };

  const incrementShare = (postId) => {
    setPosts((current) =>
      current.map((post) => (post.id === postId ? { ...post, shares: post.shares + 1 } : post))
    );
  };

  const reportPost = (postId) => {
    setPosts((current) =>
      current.map((post) => (post.id === postId ? { ...post, reported: true } : post))
    );
  };

  const createPost = async ({ caption, sport, playerType, hashtags, city, mediaType, mediaName }) => {
    setComposerLoading(true);

    await new Promise((resolve) => window.setTimeout(resolve, 900));

    const nextPost = {
      id: `post-${Date.now()}`,
      profileId: 'asha-menon',
      sport,
      city,
      level: currentUserRegisteredCount >= 5 ? 'State' : 'Local',
      playerType,
      mediaType,
      aspectRatio: mediaType === 'video' ? '16:9' : '1:1',
      mediaLabel: mediaName || 'New highlight post',
      mediaTone: 'from-cyan-500/35 to-slate-950',
      caption,
      hashtags,
      likes: 0,
      commentsCount: 0,
      shares: 0,
      views: 0,
      distanceKm: 0.8,
      scoutViewed: false,
      createdAt: new Date().toISOString(),
      saved: false,
      liked: false,
      comments: [],
    };

    setPosts((current) => [nextPost, ...current]);
    setComposerLoading(false);
  };

  const sharePost = async (post, destination = 'copy') => {
    const link = createPostPermalink(post.id);
    const text = `${post.profile.name} - ${post.caption}`;

    incrementShare(post.id);

    if (destination === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${link}`)}`, '_blank', 'noopener,noreferrer');
      return;
    }

    if (destination === 'facebook') {
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`,
        '_blank',
        'noopener,noreferrer'
      );
      return;
    }

    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(link);
    }
  };

  const getProfileById = (profileId) => {
    const profile = profilesById[profileId];
    if (!profile) {
      return null;
    }

    const profilePosts = enrichedPosts.filter((post) => post.profileId === profileId);
    const totalLikes = profilePosts.reduce((sum, post) => sum + post.likes, 0);
    const scoutViews = profilePosts.filter((post) => post.scoutViewed).length;
    const badgeState = getPlayerBadgeState(profile, enrichedPosts);

    return {
      ...profile,
      badgeState,
      posts: profilePosts,
      totalPosts: profilePosts.length,
      averageLikes: profilePosts.length ? Math.round(totalLikes / profilePosts.length) : 0,
      scoutViewPosts: scoutViews,
    };
  };

  return (
    <SocialFeedContext.Provider
      value={{
        filters,
        updateFilters,
        posts: filteredPosts,
        allPosts: enrichedPosts,
        isLoading,
        likePost,
        savePost,
        addComment,
        sharePost,
        reportPost,
        createPost,
        composerLoading,
        popularHashtags,
        currentCity,
        currentUserRegisteredCount,
        getProfileById,
      }}
    >
      {children}
    </SocialFeedContext.Provider>
  );
};

export const useSocialFeed = () => {
  const context = useContext(SocialFeedContext);
  if (!context) {
    throw new Error('useSocialFeed must be used within SocialFeedProvider');
  }
  return context;
};
