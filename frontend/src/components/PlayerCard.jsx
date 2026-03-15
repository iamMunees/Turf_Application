const PlayerCard = ({ player }) => {
  return (
    <article className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-white">{player.name}</h3>
          <p className="mt-1 text-sm text-slate-400">
            {player.sport} • {player.location}
          </p>
        </div>
        <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200">
          {player.rating} rating
        </span>
      </div>
      <p className="mt-4 text-sm text-slate-300">{player.availability}</p>
      <div className="mt-5 flex gap-3">
        <button className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950">Follow</button>
        <button className="rounded-full border border-white/10 px-4 py-2 text-sm text-white">Invite to Match</button>
      </div>
    </article>
  );
};

export default PlayerCard;
