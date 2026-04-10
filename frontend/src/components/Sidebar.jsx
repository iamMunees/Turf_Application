import { NavLink } from 'react-router-dom';

const items = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Profile', to: '/dashboard/profile' },
  { label: 'Venues', to: '/dashboard/venues' },
  { label: 'Slot Booking', to: '/dashboard/slot-booking' },
  { label: 'My Bookings', to: '/dashboard/my-bookings' },
  { label: 'Events', to: '/dashboard/events' },
  { label: 'Games', to: '/dashboard/games' },
  { label: 'Players', to: '/dashboard/players' },
  { label: 'Inbox', to: '/dashboard/messages' },
  { label: 'Social Feed', to: '/dashboard/social-feed' },
];

const Sidebar = () => {
  return (
    <aside className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300/75">Navigate</p>
      <div className="mt-4 flex flex-col gap-2">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/dashboard'}
            className={({ isActive }) =>
              `rounded-2xl px-4 py-3 text-sm  font-medium transition ${
                isActive
                  ? 'border border-cyan-200/30 bg-cyan-100 text-black shadow-[0_10px_30px_rgba(125,211,252,0.18)]'
                  : 'border border-white/10 bg-slate-950/30 text-slate-300 hover:text-white'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
