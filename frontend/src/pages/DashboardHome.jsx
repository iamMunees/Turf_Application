import DashboardShell from '../components/DashboardShell';
import FeatureCard from '../components/FeatureCard';

const features = [
  {
    title: 'Venue Discovery',
    description: 'Browse ArenaX venues by city, area, distance, sport type, and price per player.',
    to: '/dashboard/venues',
    accent: 'from-cyan-400 via-sky-400 to-blue-500',
    meta: 'ArenaX',
  },
  {
    title: 'Profile Hub',
    description: 'Manage your avatar, bio, sports interests, activity stats, and cross-module identity.',
    to: '/dashboard/profile',
    accent: 'from-amber-300 via-cyan-300 to-blue-500',
    meta: 'Identity',
  },
  {
    title: 'Slot Booking',
    description: 'Reserve a full slot or join existing players with dynamic per-player pricing.',
    to: '/dashboard/slot-booking',
    accent: 'from-emerald-400 via-teal-400 to-cyan-500',
    meta: 'Live slots',
  },
  {
    title: 'My Bookings',
    description: 'Track your confirmed ArenaX bookings with venue, slot, payment, and booking type details.',
    to: '/dashboard/my-bookings',
    accent: 'from-lime-300 via-emerald-400 to-teal-500',
    meta: 'History',
  },
  {
    title: 'Upcoming Events',
    description: 'Browse tournaments, match schedules, team lists, and event registration details.',
    to: '/dashboard/events',
    accent: 'from-amber-300 via-orange-400 to-rose-500',
    meta: 'Featured',
  },
  {
    title: 'Games System',
    description: 'Discover player-led games by sport, inspect lineup progress, and pay per player to join.',
    to: '/dashboard/games',
    accent: 'from-cyan-300 via-blue-500 to-amber-400',
    meta: 'Drop-ins',
  },
  {
    title: 'Players',
    description: 'Find players by sport, follow profiles, and send invites for upcoming matches.',
    to: '/dashboard/players',
    accent: 'from-sky-400 via-indigo-400 to-blue-600',
    meta: 'Community',
  },
  {
    title: 'Messaging Inbox',
    description: 'Chat with players, create clubs, and push game invites from a dedicated inbox.',
    to: '/dashboard/messages',
    accent: 'from-emerald-300 via-cyan-400 to-sky-500',
    meta: 'Realtime ready',
  },
  {
    title: 'Social Feed',
    description: 'Share photos, videos, and highlight clips in an Instagram-style sports feed.',
    to: '/dashboard/social-feed',
    accent: 'from-pink-400 via-rose-400 to-orange-400',
    meta: 'Trending',
  },
];

const DashboardHome = () => {
  return (
    <DashboardShell
      title="ArenaX booking control center"
      description="Find a venue, inspect live slot occupancy, reserve a full slot, or join a running game through the ArenaX booking flow."
    >
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {features.map((feature) => (
          <FeatureCard key={feature.to} {...feature} />
        ))}
      </section>
    </DashboardShell>
  );
};

export default DashboardHome;
