import { useEffect, useMemo, useState } from 'react';
import DashboardShell from '../../components/DashboardShell';
import GameCard from '../../components/games/GameCard';
import { ensureArenaXSession, getGameClubs, getGames } from '../../lib/arenaxApi';

const GamesFeedPage = () => {
  const [groups, setGroups] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        setError('');
        await ensureArenaXSession();
        const [gamesResponse, clubsResponse] = await Promise.all([getGames(), getGameClubs()]);
        setGroups(gamesResponse.data.groups || []);
        setClubs(clubsResponse.data.clubs || []);
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  const totalGames = useMemo(
    () => groups.reduce((count, group) => count + group.items.length, 0),
    [groups],
  );

  return (
    <DashboardShell
      title="Games feed built for drop-ins, squads, and fast joins"
      description="Discover football, badminton, and cricket games grouped by sport, inspect seat progress in real time, and jump into a match with a cleaner ArenaX game flow."
    >
      <div className="space-y-6">
        <section className="rounded-[2rem] border border-white/10 bg-[linear-gradient(125deg,_rgba(8,47,73,0.85),_rgba(30,41,59,0.96)_45%,_rgba(120,53,15,0.82))] p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/80">ArenaX Games</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">Find your next match without booking an entire turf</h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-200">
                Pay per player, see who has already joined, and pick public, friends-only, or club sessions.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-[1.4rem] border border-white/10 bg-slate-950/35 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Live games</p>
                <p className="mt-2 text-2xl font-semibold text-white">{totalGames}</p>
              </div>
              <div className="rounded-[1.4rem] border border-white/10 bg-slate-950/35 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Sports</p>
                <p className="mt-2 text-2xl font-semibold text-white">{groups.length}</p>
              </div>
              <div className="rounded-[1.4rem] border border-white/10 bg-slate-950/35 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Clubs</p>
                <p className="mt-2 text-2xl font-semibold text-white">{clubs.length}</p>
              </div>
            </div>
          </div>
        </section>

        {clubs.length ? (
          <section className="rounded-[2rem] border border-white/10 bg-slate-950/55 p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Clubs</p>
                <h2 className="mt-2 text-xl font-semibold text-white">Club-backed invites</h2>
              </div>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {clubs.map((club) => (
                <article key={club.id} className="rounded-[1.6rem] border border-white/10 bg-white/[0.04] p-4">
                  <div className="flex items-center gap-3">
                    <img src={club.avatarUrl} alt={club.name} className="h-12 w-12 rounded-2xl object-cover" />
                    <div>
                      <p className="font-semibold text-white">{club.name}</p>
                      <p className="text-sm text-slate-400">
                        {club.sport} • {club.memberCount} members
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{club.description}</p>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {isLoading ? (
          <div className="rounded-[2rem] border border-white/10 bg-slate-950/55 px-6 py-16 text-center text-slate-300">
            Loading games feed...
          </div>
        ) : error ? (
          <div className="rounded-[2rem] border border-rose-400/20 bg-rose-500/10 px-6 py-12 text-center text-rose-100">
            {error}
          </div>
        ) : (
          groups.map((group) => (
            <section key={group.sport} className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/75">Sport bucket</p>
                  <h2 className="mt-2 text-3xl font-semibold text-white">{group.sport} Games</h2>
                </div>
                <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
                  {group.items.length} matches
                </div>
              </div>
              <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
                {group.items.map((game) => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </DashboardShell>
  );
};

export default GamesFeedPage;
