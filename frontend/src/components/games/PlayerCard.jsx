import { Link } from 'react-router-dom';

const PlayerCard = ({ player, onToggleFollow, isBusy = false, compact = false }) => (
  <article
    className={`rounded-[1.5rem] border border-white/10 bg-white/[0.04] transition hover:border-cyan-300/25 hover:bg-white/[0.07] ${
      compact ? 'p-4' : 'p-5'
    }`}
  >
    <div className="flex items-center gap-4">
      <Link to={`/dashboard/users/${player.id}`}>
        <img
          src={player.avatarUrl || 'https://placehold.co/96x96/0f172a/e2e8f0?text=A'}
          alt={player.name}
          className="h-14 w-14 rounded-2xl object-cover"
        />
      </Link>
      <div className="min-w-0 flex-1">
        <Link to={`/dashboard/users/${player.id}`} className="truncate text-lg font-semibold text-white">
          {player.name}
        </Link>
        <p className="mt-1 text-sm text-slate-400">
          {player.skillLevel} • {player.playingPosition}
        </p>
        {player.city ? <p className="mt-1 text-xs uppercase tracking-[0.24em] text-cyan-200/80">{player.city}</p> : null}
      </div>
      {onToggleFollow && player.role === 'player' ? (
        <button
          type="button"
          disabled={isBusy}
          onClick={() => onToggleFollow(player.id)}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            player.following
              ? 'border border-white/10 bg-white/5 text-white'
              : 'bg-cyan-300 text-slate-950 hover:bg-cyan-200'
          } ${isBusy ? 'cursor-not-allowed opacity-60' : ''}`}
        >
          {player.following ? 'Following' : 'Follow'}
        </button>
      ) : null}
    </div>
  </article>
);

export default PlayerCard;
