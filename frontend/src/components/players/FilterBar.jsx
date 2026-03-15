import {
  playerCityOptions,
  playerLevelOptions,
  playerSortOptions,
  playerSportOptions,
  playerTypeOptions,
} from '../../data/playerDiscoveryData';
import { usePlayers } from '../../context/PlayersContext';

const FilterBar = () => {
  const { filters, updateFilters } = usePlayers();

  return (
    <aside className="space-y-4 rounded-[2rem] border border-white/10 bg-slate-950/60 p-5">
      <div>
        <p className="text-[11px] uppercase tracking-[0.3em] text-cyan-200/75">Filters</p>
        <h2 className="mt-2 text-xl font-semibold text-white">Refine players</h2>
      </div>
      <input
        className="w-full rounded-2xl border border-white/10 bg-white/80 px-4 py-3 text-sm text-black"
        placeholder="Search by player name, sport, or city"
        value={filters.search}
        onChange={(event) => updateFilters({ search: event.target.value })}
      />
      <select className="w-full rounded-2xl border border-white/10 bg-white/80 px-4 py-3 text-black" value={filters.sport} onChange={(event) => updateFilters({ sport: event.target.value })}>
        {playerSportOptions.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
      <select className="w-full rounded-2xl border border-white/10 bg-white/80 px-4 py-3 text-black" value={filters.city} onChange={(event) => updateFilters({ city: event.target.value })}>
        {playerCityOptions.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
      <select className="w-full rounded-2xl border border-white/10 bg-white/80 px-4 py-3 text-black" value={filters.level} onChange={(event) => updateFilters({ level: event.target.value })}>
        {playerLevelOptions.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
      <select className="w-full rounded-2xl border border-white/10 bg-white/80 px-4 py-3 text-black" value={filters.playerType} onChange={(event) => updateFilters({ playerType: event.target.value })}>
        {playerTypeOptions.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
      <select className="w-full rounded-2xl border border-white/10 bg-white/80 px-4 py-3 text-black" value={filters.sortBy} onChange={(event) => updateFilters({ sortBy: event.target.value })}>
        {playerSortOptions.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
      <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-blue-400 px-4 py-3 text-sm text-black">
        <input checked={filters.verifiedOnly} type="checkbox" className="accent-cyan-300" onChange={(event) => updateFilters({ verifiedOnly: event.target.checked })} />
        Verified only
      </label>
      <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-blue-400 px-4 py-3 text-sm text-black">
        <input checked={filters.risingStarOnly} type="checkbox" className="accent-cyan-300" onChange={(event) => updateFilters({ risingStarOnly: event.target.checked })} />
        Rising star only
      </label>
    </aside>
  );
};

export default FilterBar;
