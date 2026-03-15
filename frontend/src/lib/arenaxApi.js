const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const SESSION_STORAGE_KEY = 'arenax-demo-session';
let sessionPromise = null;

const request = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok || payload.success === false) {
    throw new Error(payload.message || 'Request failed.');
  }

  return payload;
};

const authHeaders = (token, headers = {}) => ({
  ...headers,
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

export const getStoredSession = () => {
  const storedValue = window.localStorage.getItem(SESSION_STORAGE_KEY);

  if (!storedValue) {
    return null;
  }

  try {
    return JSON.parse(storedValue);
  } catch {
    window.localStorage.removeItem(SESSION_STORAGE_KEY);
    return null;
  }
};

export const setStoredSession = (session) => {
  window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
};

export const clearStoredSession = () => {
  window.localStorage.removeItem(SESSION_STORAGE_KEY);
};

export const ensureArenaXSession = async () => {
  const existingSession = getStoredSession();

  if (existingSession?.token) {
    return existingSession;
  }

  if (!sessionPromise) {
    sessionPromise = request('/venues/bootstrap')
      .then((payload) => {
        const session = {
          token: payload.token,
          user: payload.user,
          demoCredentials: payload.demoCredentials,
        };

        setStoredSession(session);
        return session;
      })
      .finally(() => {
        sessionPromise = null;
      });
  }

  return sessionPromise;
};

export const getVenueFilters = async () => request('/venues/filters');

export const getVenues = async (filters) => {
  const query = new URLSearchParams();

  if (filters.city) {
    query.set('city', filters.city);
  }

  if (filters.area) {
    query.set('area', filters.area);
  }

  if (filters.sport) {
    query.set('sport', filters.sport);
  }

  const queryString = query.toString();
  return request(`/venues${queryString ? `?${queryString}` : ''}`);
};

export const getVenueDetails = async (venueId) => request(`/venues/${venueId}`);

export const getVenueSlots = async (venueId, date) =>
  request(`/venues/${venueId}/slots?date=${encodeURIComponent(date)}`);

export const createBooking = async (payload, token) =>
  request('/bookings', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

export const getBookingAddOns = async (bookingId, token) =>
  request(`/bookings/${bookingId}/addons`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getProducts = async ({ sport, time, city }, token) => {
  const query = new URLSearchParams();
  if (sport) {
    query.set('sport', sport);
  }
  if (time) {
    query.set('time', time);
  }
  if (city) {
    query.set('city', city);
  }

  return request(`/products?${query.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const addCartItem = async (productId, token) =>
  request('/cart', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ productId }),
  });

export const getCart = async (token) =>
  request('/cart', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const removeCartItem = async (productId, token) =>
  request(`/cart/${productId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const updateCartItem = async (productId, quantity, token) =>
  request(`/cart/${productId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ quantity }),
  });

export const getMyBookings = async (token) =>
  request('/bookings/mine', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const createVenueReview = async (venueId, payload, token) =>
  request(`/venues/${venueId}/reviews`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });

export const getGames = async (sport) => {
  const query = new URLSearchParams();
  if (sport) {
    query.set('sport', sport);
  }
  const queryString = query.toString();
  return request(`/games${queryString ? `?${queryString}` : ''}`);
};

export const getGameDetails = async (gameId, token) =>
  request(`/games/${gameId}`, {
    headers: authHeaders(token),
  });

export const getGamePlayers = async (gameId, token) =>
  request(`/games/${gameId}/players`, {
    headers: authHeaders(token),
  });

export const getGameClubs = async () => request('/games/clubs');

export const createGame = async (payload, token) =>
  request('/games/create', {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });

export const joinGame = async (payload, token) =>
  request('/games/join', {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });

export const addGameComment = async (payload, token) =>
  request('/games/comment', {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });

export const togglePlayerFollow = async (playerId, token) =>
  request(`/players/${playerId}/follow`, {
    method: 'POST',
    headers: authHeaders(token),
  });

export const getMessages = async (token) =>
  request('/messages', {
    headers: authHeaders(token),
  });

export const sendMessage = async (payload, token) =>
  request('/messages/send', {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });

export const createClub = async (payload, token) =>
  request('/messages/clubs', {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });

export const getCurrentUserProfile = async (token) =>
  request('/users/me', {
    headers: authHeaders(token),
  });

export const getUserProfile = async (userId, token) =>
  request(`/users/${userId}`, {
    headers: authHeaders(token),
  });

export const updateUserProfile = async (payload, token) =>
  request('/users/update', {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });

export const toggleUserFollow = async (userId, token) =>
  request(`/users/follow/${userId}`, {
    method: 'POST',
    headers: authHeaders(token),
  });

export const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: Number.isInteger(value) ? 0 : 2,
  }).format(value);

export const formatDateLabel = (value) =>
  new Intl.DateTimeFormat('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${value}T00:00:00`));
