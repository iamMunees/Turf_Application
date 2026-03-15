import {
  dateRangeOptions,
  levelOptions,
  priceOptions,
  radiusOptions,
  sortOptions,
  sportOptions,
  statusOptions,
} from '../../data/eventsDiscoveryData';
import { useEvents } from '../../context/EventsContext';

const FilterPanel = () => {
  const { filters, updateFilters, clearFilters } = useEvents();

  const toggleSport = (sport) => {
    const nextSports = filters.sports.includes(sport)
      ? filters.sports.filter((item) => item !== sport)
      : [...filters.sports, sport];

    updateFilters({ sports: nextSports });
  };

  const toggleStatus = (status) => {
    const nextStatuses = filters.statuses.includes(status)
      ? filters.statuses.filter((item) => item !== status)
      : [...filters.statuses, status];

    updateFilters({ statuses: nextStatuses });
  };

  return (
    <aside className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-5 backdrop-blur md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-cyan-200/70">Filters</p>
          <h2 className="mt-2 text-lg font-semibold text-white">Refine discovery</h2>
        </div>
        <button
          type="button"
          onClick={clearFilters}
          className="text-xs font-medium text-amber-200 transition hover:text-white"
        >
          Reset
        </button>
      </div>

      <div className="mt-6 space-y-6">
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-white">Sport Type</h3>
          {sportOptions.map((sport) => (
            <label key={sport} className="flex items-center gap-3 text-sm text-slate-200">
              <input
                checked={filters.sports.includes(sport)}
                className="h-4 w-4 rounded border-white/20 bg-transparent accent-cyan-300"
                type="checkbox"
                onChange={() => toggleSport(sport)}
              />
              {sport}
            </label>
          ))}
        </section>

        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-white">Event Level</h3>
          {['Any', ...levelOptions].map((level) => (
            <label key={level} className="flex items-center gap-3 text-sm text-slate-200">
              <input
                checked={filters.level === level}
                className="h-4 w-4 accent-amber-300"
                name="level"
                type="radio"
                onChange={() => updateFilters({ level })}
              />
              {level}
            </label>
          ))}
        </section>

        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-white">Date Range</h3>
          {dateRangeOptions.map((option) => (
            <label key={option.id} className="flex items-center gap-3 text-sm text-slate-200">
              <input
                checked={filters.dateRange === option.id}
                className="h-4 w-4 accent-cyan-300"
                name="dateRange"
                type="radio"
                onChange={() => updateFilters({ dateRange: option.id })}
              />
              {option.label}
            </label>
          ))}
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between text-sm text-white">
            <h3 className="font-semibold">Price Range</h3>
            <span className="text-slate-300">{priceOptions[filters.priceIndex].label}</span>
          </div>
          <input
            className="w-full accent-amber-300"
            max="3"
            min="0"
            step="1"
            type="range"
            value={filters.priceIndex}
            onChange={(event) => updateFilters({ priceIndex: Number(event.target.value) })}
          />
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between text-sm text-white">
            <h3 className="font-semibold">Distance Radius</h3>
            <span className="text-slate-300">{radiusOptions[filters.radiusIndex].label}</span>
          </div>
          <input
            className="w-full accent-cyan-300"
            max="4"
            min="0"
            step="1"
            type="range"
            value={filters.radiusIndex}
            onChange={(event) => updateFilters({ radiusIndex: Number(event.target.value) })}
          />
        </section>

        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-white">Status</h3>
          {statusOptions.map((status) => (
            <label key={status} className="flex items-center gap-3 text-sm text-slate-200">
              <input
                checked={filters.statuses.includes(status)}
                className="h-4 w-4 rounded accent-cyan-300"
                type="checkbox"
                onChange={() => toggleStatus(status)}
              />
              {status}
            </label>
          ))}
        </section>

        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-white">Sort By</h3>
          <select
            className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white focus:border-cyan-300/40 focus:outline-none"
            value={filters.sortBy}
            onChange={(event) => updateFilters({ sortBy: event.target.value })}
          >
            {sortOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </section>
      </div>
    </aside>
  );
};

export default FilterPanel;
