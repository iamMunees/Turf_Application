import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation, useParams } from 'react-router-dom';
import DashboardHome from './pages/DashboardHome';
import Events from './pages/Events';
import EventRegistrationsPage from './pages/events/EventRegistrationsPage';
import MyBookings from './pages/MyBookings';
import Players from './pages/Players';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import PlayerProfilePage from './pages/social/PlayerProfilePage';
import SlotBooking from './pages/SlotBooking';
import SocialFeed from './pages/SocialFeed';
import MessagingPage from './pages/MessagingPage';
import ProfilePage from './pages/ProfilePage';
import VenueDetails from './pages/VenueDetails';
import VenueList from './pages/VenueList';
import EventDetailPage from './components/events/EventDetailPage';
import GamesFeedPage from './pages/games/GamesFeedPage';
import GameDetailsPage from './pages/games/GameDetailsPage';
import LoginPage from './pages/LoginPage';
import LogoutPage from './pages/LogoutPage';
import RegisterPage from './pages/RegisterPage';
import { useAuth } from './context/AuthContext';

const LegacyDashboardRedirect = () => {
  const location = useLocation();
  const featureFromHash = location.hash.replace('#', '');

  if (featureFromHash === 'players') {
    return <Navigate to="/dashboard/players" replace />;
  }

  if (featureFromHash === 'events') {
    return <Navigate to="/dashboard/events" replace />;
  }

  if (featureFromHash === 'games') {
    return <Navigate to="/dashboard/games" replace />;
  }

  if (featureFromHash === 'slot-booking') {
    return <Navigate to="/dashboard/slot-booking" replace />;
  }

  if (featureFromHash === 'venues') {
    return <Navigate to="/dashboard/venues" replace />;
  }

  if (featureFromHash === 'social-feed') {
    return <Navigate to="/dashboard/social-feed" replace />;
  }

  if (featureFromHash === 'messages') {
    return <Navigate to="/dashboard/messages" replace />;
  }

  if (featureFromHash === 'profile') {
    return <Navigate to="/dashboard/profile" replace />;
  }

  return <Navigate to="/dashboard" replace />;
};

const LegacyPlayerProfileRedirect = () => {
  const { playerId } = useParams();
  return <Navigate to={`/dashboard/users/${playerId}`} replace />;
};

const RootRedirect = () => {
  const { isAuthenticated } = useAuth();
  return <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />;
};

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

const PublicOnlyRoute = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardHome />} />
          <Route path="/dashboard/venues" element={<VenueList />} />
          <Route path="/dashboard/venues/:venueId" element={<VenueDetails />} />
          <Route path="/dashboard/slot-booking" element={<SlotBooking />} />
          <Route path="/dashboard/my-bookings" element={<MyBookings />} />
          <Route path="/dashboard/profile" element={<ProfilePage />} />
          <Route path="/dashboard/users/:userId" element={<ProfilePage />} />
          <Route path="/dashboard/cart" element={<CartPage />} />
          <Route path="/dashboard/checkout" element={<CheckoutPage />} />
          <Route path="/dashboard/events" element={<Events />} />
          <Route path="/dashboard/events/registrations" element={<EventRegistrationsPage />} />
          <Route path="/dashboard/events/:eventId" element={<EventDetailPage />} />
          <Route path="/dashboard/games" element={<GamesFeedPage />} />
          <Route path="/dashboard/games/:gameId" element={<GameDetailsPage />} />
          <Route path="/dashboard/messages" element={<MessagingPage />} />
          <Route path="/dashboard/players" element={<Players />} />
          <Route path="/dashboard/players/:playerId" element={<LegacyPlayerProfileRedirect />} />
          <Route path="/dashboard/social-feed" element={<SocialFeed />} />
          <Route path="/dashboard/social-feed/players/:profileId" element={<PlayerProfilePage />} />
          <Route path="/logout" element={<LogoutPage />} />
          <Route path="/dashboard/:role" element={<LegacyDashboardRedirect />} />
        </Route>
        <Route path="*" element={<RootRedirect />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
