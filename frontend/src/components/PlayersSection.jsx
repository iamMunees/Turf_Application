import { players, sports } from '../data/mockData';
import PlayerCard from './PlayerCard';
import SectionHeader from './SectionHeader';

const PlayersSection = () => {
  return (
    <section className="space-y-8">
      <SectionHeader
        eyebrow="Players Network"
        title="Search, follow, and invite players"
        description="Build a reliable roster by sport, location, skill rating, and current availability."
      />
      <div className="flex flex-wrap gap-3">
        {['All', ...sports].map((sport) => (
          <button
            key={sport}
            className={`rounded-full px-4 py-2 text-sm ${
              sport === 'All'
                ? 'bg-white font-semibold text-slate-950'
                : 'border border-white/10 bg-white/5 text-white'
            }`}
          >
            {sport}
          </button>
        ))}
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        {players.map((player) => (
          <PlayerCard key={player.id} player={player} />
        ))}
      </div>
    </section>
  );
};

export default PlayersSection;
