import {
  feedDateRanges,
  feedSortOptions,
  feedTabs,
  playerTypes,
  socialCities,
  socialSportOptions,
} from '../../data/socialFeedData';
import { useSocialFeed } from '../../context/SocialFeedContext';

const FilterBar = () => {
  const { filters, updateFilters } = useSocialFeed();

  return (
    <section className="space-y-4 rounded-[2rem] border border-white/10 bg-slate-950/60 p-5">
      <div className="flex flex-wrap gap-2">
        {feedTabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => updateFilters({ tab })}
            className={`rounded-full px-4 py-2 text-sm transition ${
              filters.tab === tab ? 'bg-white text-slate-950' : 'bg-white/5 text-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid gap-3 md:grid-cols-2 ">
        <select
          className="rounded-2xl border border-white/10 bg-white/80 px-4 py-3 text-sm text-black outline-none"
          value={filters.sortBy}
          onChange={(event) => updateFilters({ sortBy: event.target.value })}
        >
          {feedSortOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
        <select
          className="rounded-2xl border border-white/10 bg-white/80 px-4 py-3 text-sm text-black outline-none"
          value={filters.sport}
          onChange={(event) => updateFilters({ sport: event.target.value })}
        >
          {socialSportOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
        <select
          className="rounded-2xl border border-white/10 bg-white/80 px-4 py-3 text-sm text-black outline-none"
          value={filters.city}
          onChange={(event) => updateFilters({ city: event.target.value })}
        >
          {socialCities.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
        <select
          className="rounded-2xl border border-white/10 bg-white/80 px-4 py-3 text-sm text-black outline-none"
          value={filters.playerType}
          onChange={(event) => updateFilters({ playerType: event.target.value })}
        >
          <option>All</option>
          {playerTypes.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
        <select
          className="rounded-2xl border border-white/10 bg-white/80 px-4 py-3 text-sm text-black outline-none"
          value={filters.dateRange}
          onChange={(event) => updateFilters({ dateRange: event.target.value })}
        >
          {feedDateRanges.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>

      <label className="inline-flex items-center gap-3 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-sm text-emerald-100">
        <input
          checked={filters.discoverTalentOnly}
          className="accent-emerald-300"
          type="checkbox"
          onChange={(event) => updateFilters({ discoverTalentOnly: event.target.checked })}
        />
        Discover Talent
      </label>
    </section>
  );
};

export default FilterBar;
