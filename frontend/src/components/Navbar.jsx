import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    navigate('/logout');
  };

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 rounded-full border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-xl">
      <div>
        <p className="text-sm uppercase tracking-[0.32em] text-cyan-300/75">ArenaX</p>
        <p className="text-base font-medium text-white">Sports Slot Booking Platform</p>
      </div>
      <nav className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
        <Link to="/dashboard" className="transition hover:text-white">
          Dashboard
        </Link>
        <Link to="/dashboard/venues" className="transition hover:text-white">
          Venues
        </Link>
        <Link to="/dashboard/slot-booking" className="transition hover:text-white">
          Slot Booking
        </Link>
        <Link to="/dashboard/my-bookings" className="transition hover:text-white">
          My Bookings
        </Link>
        <Link to="/dashboard/events" className="transition hover:text-white">
          Events
        </Link>
        <Link to="/dashboard/games" className="transition hover:text-white">
          Games
        </Link>
        <Link to="/dashboard/players" className="transition hover:text-white">
          Players
        </Link>
        <Link to="/dashboard/messages" className="transition hover:text-white">
          Inbox
        </Link>
        <Link to="/dashboard/social-feed" className="transition hover:text-white">
          Social Feed
        </Link>
      </nav>
      <div className="relative">
        <button
          type="button"
          onClick={() => setMenuOpen((current) => !current)}
          className="flex items-center gap-3 rounded-full border border-white/10 bg-slate-950/55 px-3 py-2 text-left"
        >
          <img
            src={user?.avatarUrl || 'https://placehold.co/64x64/0f172a/e2e8f0?text=A'}
            alt={user?.fullName || 'ArenaX user'}
            className="h-10 w-10 rounded-full object-cover"
          />
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-white">{user?.fullName || 'ArenaX User'}</p>
            <p className="text-xs text-slate-400">@{user?.username || 'player'}</p>
          </div>
        </button>

        {menuOpen ? (
          <div className="absolute right-0 top-[calc(100%+12px)] z-20 w-56 rounded-[1.5rem] border border-white/10 bg-slate-950/95 p-3 shadow-[0_24px_60px_rgba(2,6,23,0.45)]">
            <Link to="/dashboard/profile" className="block rounded-xl px-4 py-3 text-sm text-white hover:bg-white/5">
              Profile
            </Link>
            <Link to="/dashboard/my-bookings" className="block rounded-xl px-4 py-3 text-sm text-white hover:bg-white/5">
              My Bookings
            </Link>
            <Link to="/dashboard/games" className="block rounded-xl px-4 py-3 text-sm text-white hover:bg-white/5">
              Games Joined
            </Link>
            <Link to="/dashboard/profile" className="block rounded-xl px-4 py-3 text-sm text-white hover:bg-white/5">
              Settings
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="mt-2 block w-full rounded-xl px-4 py-3 text-left text-sm text-rose-200 hover:bg-rose-500/10"
            >
              Logout
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );
};

export default Navbar;
