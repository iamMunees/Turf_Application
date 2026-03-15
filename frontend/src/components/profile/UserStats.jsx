const statItems = [
  ['Games Joined', 'gamesJoined'],
  ['Games Hosted', 'gamesHosted'],
  ['Bookings', 'slotBookings'],
  ['Events', 'eventsParticipated'],
  ['Posts', 'socialPosts'],
  ['Messages', 'messagesSent'],
];

const UserStats = ({ stats }) => (
  <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
    {statItems.map(([label, key]) => (
      <article key={key} className="rounded-[1.6rem] border border-white/10 bg-white/[0.04] p-5">
        <p className="text-sm text-slate-400">{label}</p>
        <p className="mt-3 text-3xl font-semibold text-white">{stats?.[key] ?? 0}</p>
      </article>
    ))}
  </section>
);

export default UserStats;
