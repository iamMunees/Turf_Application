import { getProgress } from '../../utils/games';

const ProgressBar = ({ currentPlayers, maxPlayers, accent = 'from-cyan-400 to-emerald-400' }) => {
  const progress = getProgress(currentPlayers, maxPlayers);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm text-slate-300">
        <span>
          {currentPlayers} / {maxPlayers} players
        </span>
        <span>{progress}%</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${accent} transition-all duration-500`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
