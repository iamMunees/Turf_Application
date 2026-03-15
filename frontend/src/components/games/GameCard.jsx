import { Link } from 'react-router-dom';
import ProgressBar from './ProgressBar';
import { formatGameDate } from '../../utils/games';

const GameCard = ({ game }) => (
  <Link
    to={`/dashboard/games/${game.id}`}
    className="group overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,_rgba(8,15,30,0.96),_rgba(8,15,30,0.86))] transition duration-300 hover:-translate-y-1 hover:border-cyan-300/30 hover:shadow-[0_24px_50px_rgba(14,165,233,0.14)]"
  >
    <div className="relative h-56 overflow-hidden">
      <img
        src={game.imageUrl || 'https://placehold.co/1200x800/0f172a/e2e8f0?text=ArenaX'}
        alt={game.title}
        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(2,6,23,0.92))]" />
      <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full bg-slate-950/70 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-200">
        {game.sport}
      </div>
      <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
        <div>
          <h3 className="text-2xl font-semibold text-white">{game.title}</h3>
          <p className="mt-2 text-sm text-slate-300">{game.venue?.name}</p>
        </div>
        <div className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-sm text-white">
          {game.format}
        </div>
      </div>
    </div>

    <div className="space-y-5 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-amber-200/80">{formatGameDate(game.date)}</p>
          <p className="mt-2 text-xl font-semibold text-white">
            {game.startTime} - {game.endTime}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Per player</p>
          <p className="mt-2 text-2xl font-semibold text-cyan-200">₹{game.pricePerPlayer}</p>
        </div>
      </div>

      <ProgressBar currentPlayers={game.currentPlayers} maxPlayers={game.maxPlayers} />

      <div className="flex items-center justify-between text-sm text-slate-300">
        <span>{game.host?.name}</span>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">{game.visibility}</span>
      </div>
    </div>
  </Link>
);

export default GameCard;
