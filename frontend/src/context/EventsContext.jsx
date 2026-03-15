/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  cityOptions,
  eventsDiscoveryData,
  sortOptions,
} from '../data/eventsDiscoveryData';
import {
  buildSearchSuggestions,
  defaultFilters,
  formatDistance,
  getPriceCap,
  getRadiusValue,
  getRecommendedEvents,
  haversineDistance,
  isWithinDateRange,
  resolveNearestCity,
} from '../utils/events';

const EventsContext = createContext(null);

const storageKeys = {
  city: 'lineup-events-city',
  favorites: 'lineup-events-favorites',
  registrations: 'lineup-events-registrations',
  searches: 'lineup-events-searches',
};

const getStoredValue = (key, fallback) => {
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

export const EventsProvider = ({ children }) => {
  const initialCityId = getStoredValue(storageKeys.city, 'chennai');
  const [selectedCityId, setSelectedCityId] = useState(initialCityId);
  const [userCoordinates, setUserCoordinates] = useState(() => {
    const city = cityOptions.find((option) => option.id === initialCityId) ?? cityOptions[0];
    return { lat: city.lat, lng: city.lng };
  });
  const [filters, setFilters] = useState(defaultFilters);
  const [searchQuery, setSearchQueryState] = useState('');
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const [favorites, setFavorites] = useState(() => getStoredValue(storageKeys.favorites, []));
  const [registrations, setRegistrations] = useState(() =>
    getStoredValue(storageKeys.registrations, [])
  );
  const [recentSearches, setRecentSearches] = useState(() =>
    getStoredValue(storageKeys.searches, ['football', 'chennai', 'cricket'])
  );
  const [viewMode, setViewMode] = useState('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [page, setPageState] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingRevision, setLoadingRevision] = useState(1);
  const [locationPermission, setLocationPermission] = useState('idle');

  const beginLoading = () => {
    setIsLoading(true);
    setLoadingRevision((current) => current + 1);
  };

  const currentCity = useMemo(
    () => cityOptions.find((city) => city.id === selectedCityId) ?? cityOptions[0],
    [selectedCityId]
  );

  const eventsWithDistance = useMemo(
    () =>
      eventsDiscoveryData.map((event) => {
        const distance = haversineDistance(userCoordinates, { lat: event.lat, lng: event.lng });
        return {
          ...event,
          distance,
          distanceLabel: formatDistance(distance),
        };
      }),
    [userCoordinates]
  );

  const filteredEvents = useMemo(() => {
    const priceCap = getPriceCap(filters.priceIndex);
    const radiusCap = getRadiusValue(filters.radiusIndex);
    const query = deferredSearchQuery.trim().toLowerCase();

    const next = eventsWithDistance.filter((event) => {
      const matchesQuery =
        query.length === 0 ||
        [event.name, event.sport, event.city, event.venue].some((value) =>
          value.toLowerCase().includes(query)
        );
      const matchesSport =
        filters.sports.length === 0 || filters.sports.includes(event.sport);
      const matchesLevel = filters.level === 'Any' || event.level === filters.level;
      const matchesDate = isWithinDateRange(event.dateTime, filters.dateRange);
      const matchesPrice =
        filters.priceIndex === 3 ? event.fee >= 1000 : event.fee <= priceCap;
      const matchesRadius = event.distance <= radiusCap;
      const matchesStatus =
        filters.statuses.length === 0 || filters.statuses.includes(event.status);
      const matchesCityBoost =
        currentCity.name === event.city || event.distance <= radiusCap || radiusCap === 250;

      return (
        matchesQuery &&
        matchesSport &&
        matchesLevel &&
        matchesDate &&
        matchesPrice &&
        matchesRadius &&
        matchesStatus &&
        matchesCityBoost
      );
    });

    if (filters.sortBy === sortOptions[0]) {
      next.sort((left, right) => left.distance - right.distance);
    } else if (filters.sortBy === sortOptions[1]) {
      next.sort((left, right) => right.popularity - left.popularity);
    } else if (filters.sortBy === sortOptions[2]) {
      next.sort((left, right) => new Date(right.dateTime) - new Date(left.dateTime));
    } else if (filters.sortBy === sortOptions[3]) {
      next.sort((left, right) => new Date(left.endDateTime) - new Date(right.endDateTime));
    }

    return next;
  }, [currentCity.name, deferredSearchQuery, eventsWithDistance, filters]);

  const suggestionList = useMemo(() => buildSearchSuggestions(eventsDiscoveryData), []);

  const visibleEvents = useMemo(() => filteredEvents.slice(0, page * 6), [filteredEvents, page]);

  const recommendedEvents = useMemo(
    () =>
      getRecommendedEvents({
        events: eventsWithDistance,
        favorites,
        registrations,
        city: currentCity.name,
      }).slice(0, 4),
    [currentCity.name, eventsWithDistance, favorites, registrations]
  );

  const popularEvents = useMemo(
    () => [...eventsWithDistance].sort((a, b) => b.popularity - a.popularity).slice(0, 5),
    [eventsWithDistance]
  );

  useEffect(() => {
    window.localStorage.setItem(storageKeys.city, JSON.stringify(selectedCityId));
  }, [selectedCityId]);

  useEffect(() => {
    window.localStorage.setItem(storageKeys.favorites, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    window.localStorage.setItem(storageKeys.registrations, JSON.stringify(registrations));
  }, [registrations]);

  useEffect(() => {
    window.localStorage.setItem(storageKeys.searches, JSON.stringify(recentSearches));
  }, [recentSearches]);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 450);
    return () => window.clearTimeout(timer);
  }, [loadingRevision]);

  useEffect(() => {
    const hasStoredCity = window.localStorage.getItem(storageKeys.city);
    if (hasStoredCity || !navigator.geolocation) {
      return undefined;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextCoordinates = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        const nearestCity = resolveNearestCity(nextCoordinates);
        beginLoading();
        setPageState(1);
        setUserCoordinates(nextCoordinates);
        setSelectedCityId(nearestCity.id);
        setLocationPermission('granted');
      },
      () => {
        setLocationPermission('denied');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );

    return undefined;
  }, []);

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setLocationPermission('unsupported');
      return;
    }

    setLocationPermission('loading');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextCoordinates = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        const nearestCity = resolveNearestCity(nextCoordinates);
        beginLoading();
        setPageState(1);
        setUserCoordinates(nextCoordinates);
        setSelectedCityId(nearestCity.id);
        setLocationPermission('granted');
      },
      () => {
        setLocationPermission('denied');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const selectCity = (cityId) => {
    const nextCity = cityOptions.find((city) => city.id === cityId);
    if (!nextCity) {
      return;
    }
    beginLoading();
    setPageState(1);
    setSelectedCityId(cityId);
    setUserCoordinates({ lat: nextCity.lat, lng: nextCity.lng });
  };

  const updateFilters = (patch) => {
    beginLoading();
    setPageState(1);
    setFilters((current) => ({ ...current, ...patch }));
  };

  const clearFilters = () => {
    beginLoading();
    setPageState(1);
    setFilters(defaultFilters);
  };

  const toggleFavorite = (eventId) => {
    setFavorites((current) =>
      current.includes(eventId)
        ? current.filter((favoriteId) => favoriteId !== eventId)
        : [...current, eventId]
    );
  };

  const saveSearch = (value) => {
    const normalized = value.trim();
    if (!normalized) {
      return;
    }
    setRecentSearches((current) => [normalized, ...current.filter((item) => item !== normalized)].slice(0, 5));
  };

  const setSearchQuery = (value) => {
    beginLoading();
    setPageState(1);
    setSearchQueryState(value);
  };

  const setPage = (value) => {
    beginLoading();
    setPageState(value);
  };

  const registerForEvent = (event, formValues) => {
    setRegistrations((current) => {
      const existing = current.find((registration) => registration.eventId === event.id);
      if (existing) {
        return current;
      }
      return [
        {
          eventId: event.id,
          eventName: event.name,
          eventSport: event.sport,
          eventCity: event.city,
          eventDateTime: event.dateTime,
          fee: event.fee,
          attendee: formValues,
        },
        ...current,
      ];
    });
  };

  const cancelRegistration = (eventId) => {
    setRegistrations((current) => current.filter((registration) => registration.eventId !== eventId));
  };

  const getEventById = (eventId) => eventsWithDistance.find((event) => event.id === eventId);

  return (
    <EventsContext.Provider
      value={{
        cityOptions,
        currentCity,
        events: eventsWithDistance,
        filteredEvents,
        visibleEvents,
        suggestionList,
        searchQuery,
        setSearchQuery,
        saveSearch,
        recentSearches,
        filters,
        updateFilters,
        clearFilters,
        favorites,
        toggleFavorite,
        registrations,
        registerForEvent,
        cancelRegistration,
        getEventById,
        recommendedEvents,
        popularEvents,
        isLoading,
        viewMode,
        setViewMode,
        page,
        setPage,
        isFilterOpen,
        setIsFilterOpen,
        selectCity,
        useMyLocation,
        locationPermission,
      }}
    >
      {children}
    </EventsContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error('useEvents must be used within EventsProvider');
  }
  return context;
};
