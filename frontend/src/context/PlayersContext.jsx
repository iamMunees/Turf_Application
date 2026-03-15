/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useEvents } from './EventsContext';
import {
  organizerEvents,
  playerCityOptions,
  playerLevelOptions,
  playerProfilesData,
  playerSortOptions,
  playerSportOptions,
  playerTypeOptions,
} from '../data/playerDiscoveryData';

const PlayersContext = createContext(null);

const defaultFilters = {
  search: '',
  sport: playerSportOptions[0],
  city: playerCityOptions[0],
  level: playerLevelOptions[0],
  playerType: playerTypeOptions[0],
  verifiedOnly: false,
  risingStarOnly: false,
  sortBy: playerSortOptions[0],
};

const storageKeys = {
  following: 'lineup-player-following',
  invites: 'lineup-player-invites',
  bookings: 'lineup-player-training-bookings',
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

export const PlayersProvider = ({ children }) => {
  const { currentCity } = useEvents();
  const [filters, setFilters] = useState(defaultFilters);
  const [followingIds, setFollowingIds] = useState(() => readStorage(storageKeys.following, ['asha-menon']));
  const [invites, setInvites] = useState(() => readStorage(storageKeys.invites, []));
  const [bookings, setBookings] = useState(() => readStorage(storageKeys.bookings, []));
  const [isLoading, setIsLoading] = useState(true);
  const [loadingRevision, setLoadingRevision] = useState(1);
  const [currentUser] = useState({
    id: 'user-organizer',
    name: 'Aarav Kumar',
    role: 'organizer',
    city: currentCity.name,
  });

  const enrichedPlayers = useMemo(
    () =>
      playerProfilesData.map((player) => ({
        ...player,
        isVerified: player.eventsRegistered >= 5,
        isRisingStar: player.careerBoostPosts >= 3,
        isFollowing: followingIds.includes(player.id),
      })),
    [followingIds]
  );

  const filteredPlayers = useMemo(() => {
    const query = filters.search.trim().toLowerCase();
    const next = enrichedPlayers.filter((player) => {
      const matchesSearch =
        query.length === 0 ||
        [player.name, player.sport, player.city].some((value) => value.toLowerCase().includes(query));
      const matchesSport = filters.sport === playerSportOptions[0] || player.sport === filters.sport;
      const matchesCity = filters.city === playerCityOptions[0] || player.city === filters.city;
      const matchesLevel = filters.level === playerLevelOptions[0] || player.level === filters.level;
      const matchesType =
        filters.playerType === playerTypeOptions[0] || player.playerType === filters.playerType;
      const matchesVerified = !filters.verifiedOnly || player.isVerified;
      const matchesRising = !filters.risingStarOnly || player.isRisingStar;

      return (
        matchesSearch &&
        matchesSport &&
        matchesCity &&
        matchesLevel &&
        matchesType &&
        matchesVerified &&
        matchesRising
      );
    });

    if (filters.sortBy === playerSortOptions[0]) {
      next.sort((left, right) => right.eventsRegistered - left.eventsRegistered);
    } else if (filters.sortBy === playerSortOptions[1]) {
      next.sort((left, right) => right.followers - left.followers);
    } else if (filters.sortBy === playerSortOptions[2]) {
      next.sort((left, right) => right.rating - left.rating);
    } else if (filters.sortBy === playerSortOptions[3]) {
      next.sort((left, right) => left.distanceKm - right.distanceKm);
    }

    return next;
  }, [enrichedPlayers, filters]);

  useEffect(() => {
    window.localStorage.setItem(storageKeys.following, JSON.stringify(followingIds));
  }, [followingIds]);

  useEffect(() => {
    window.localStorage.setItem(storageKeys.invites, JSON.stringify(invites));
  }, [invites]);

  useEffect(() => {
    window.localStorage.setItem(storageKeys.bookings, JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 250);
    return () => window.clearTimeout(timer);
  }, [loadingRevision]);

  const queueLoading = () => {
    setIsLoading(true);
    setLoadingRevision((current) => current + 1);
  };

  const updateFilters = (patch) => {
    queueLoading();
    setFilters((current) => ({ ...current, ...patch }));
  };

  const toggleFollow = (playerId) => {
    setFollowingIds((current) => {
      const isFollowing = current.includes(playerId);
      return isFollowing ? current.filter((id) => id !== playerId) : [...current, playerId];
    });
  };

  const sendInvite = ({ playerId, eventId, message }) => {
    setInvites((current) => [
      {
        id: `invite-${Date.now()}`,
        playerId,
        eventId,
        message,
        status: 'Pending',
        createdAt: new Date().toISOString(),
      },
      ...current,
    ]);
  };

  const updateInviteStatus = (inviteId, status) => {
    setInvites((current) =>
      current.map((invite) => (invite.id === inviteId ? { ...invite, status } : invite))
    );
  };

  const createBooking = ({ playerId, date, time, notes }) => {
    setBookings((current) => [
      {
        id: `booking-${Date.now()}`,
        playerId,
        date,
        time,
        notes,
        status: 'Confirmed',
        createdAt: new Date().toISOString(),
      },
      ...current,
    ]);
  };

  const cancelBooking = (bookingId) => {
    setBookings((current) =>
      current.map((booking) => (booking.id === bookingId ? { ...booking, status: 'Cancelled' } : booking))
    );
  };

  const getPlayerById = (playerId) => {
    const player = enrichedPlayers.find((item) => item.id === playerId);
    if (!player) {
      return null;
    }

    return {
      ...player,
      invites: invites.filter((invite) => invite.playerId === playerId),
      bookings: bookings.filter((booking) => booking.playerId === playerId),
    };
  };

  return (
    <PlayersContext.Provider
      value={{
        filters,
        updateFilters,
        players: filteredPlayers,
        allPlayers: enrichedPlayers,
        isLoading,
        toggleFollow,
        currentUser,
        organizerEvents,
        sendInvite,
        invites,
        updateInviteStatus,
        createBooking,
        bookings,
        cancelBooking,
        getPlayerById,
      }}
    >
      {children}
    </PlayersContext.Provider>
  );
};

export const usePlayers = () => {
  const context = useContext(PlayersContext);
  if (!context) {
    throw new Error('usePlayers must be used within PlayersProvider');
  }
  return context;
};
