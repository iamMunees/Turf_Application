const EventCard = ({ event }) => {
  return (
    <article className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-[linear-gradient(160deg,_rgba(15,23,42,0.95),_rgba(17,24,39,0.7))] p-5">
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-200">
          {event.sport}
        </span>
        <span className="text-xs text-slate-400">{event.status}</span>
      </div>
      <h3 className="mt-5 text-xl font-semibold text-white">{event.title}</h3>
      <p className="mt-2 text-sm text-slate-300">
        {event.date} • {event.location}
      </p>
      <div className="mt-5 space-y-2">
        {event.schedule.slice(0, 2).map((item) => (
          <p key={item} className="text-sm text-slate-400">
            {item}
          </p>
        ))}
      </div>
      <div className="mt-6 flex gap-3">
        <button className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950">
          Register
        </button>
        <button className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white">
          View Details
        </button>
      </div>
    </article>
  );
};

export default EventCard;
