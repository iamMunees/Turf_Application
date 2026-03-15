import { useState } from 'react';
import FilterBar from '../../components/players/FilterBar';
import PlayerGrid from '../../components/players/PlayerGrid';

const PlayersDiscoveryPage = () => {
  const [filtersOpen, setFiltersOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(251,191,36,0.14),_transparent_28%),linear-gradient(180deg,_#020617,_#091221_38%,_#020617)] px-4 py-5 text-white md:px-6 lg:px-8">
      <div className="mx-auto max-w-[1480px] space-y-6">
        <section className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.35em] text-cyan-200/80">Players</p>
              <h1 className="mt-3 text-3xl font-semibold text-white md:text-4xl">Follow athletes, send invites, and book training</h1>
            </div>
            <button type="button" onClick={() => setFiltersOpen((current) => !current)} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white lg:hidden">
              Filters
            </button>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <div className={`${filtersOpen ? 'block' : 'hidden'} lg:block`}>
            <FilterBar />
          </div>
          <PlayerGrid />
        </section>
      </div>
    </main>
  );
};

export default PlayersDiscoveryPage;
