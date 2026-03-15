import { useMemo, useState } from 'react';
import { useEvents } from '../../context/EventsContext';
import { SearchIcon } from './icons';

const SearchBar = () => {
  const { searchQuery, setSearchQuery, suggestionList, saveSearch, recentSearches } = useEvents();
  const [isFocused, setIsFocused] = useState(false);

  const filteredSuggestions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return [];
    }
    return suggestionList
      .filter((item) => item.toLowerCase().includes(query))
      .slice(0, 6);
  }, [searchQuery, suggestionList]);

  const handleSubmit = (event) => {
    event.preventDefault();
    saveSearch(searchQuery);
    setIsFocused(false);
  };

  const applySuggestion = (value) => {
    setSearchQuery(value);
    saveSearch(value);
    setIsFocused(false);
  };

  return (
    <div className="relative w-full max-w-xl">
      <form onSubmit={handleSubmit} className="relative">
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          aria-label="Search events"
          className="w-full rounded-2xl border border-white/12 bg-slate-950/70 py-3 pl-11 pr-4 text-sm text-white placeholder:text-slate-400 focus:border-cyan-300/45 focus:outline-none"
          placeholder="Search by event name, sport type, or location"
          value={searchQuery}
          onBlur={() => window.setTimeout(() => setIsFocused(false), 100)}
          onChange={(event) => setSearchQuery(event.target.value)}
          onFocus={() => setIsFocused(true)}
        />
      </form>
      {isFocused ? (
        <div className="absolute top-[calc(100%+0.75rem)] z-30 w-full rounded-3xl border border-white/10 bg-slate-950/95 p-4 shadow-2xl shadow-slate-950/50 backdrop-blur">
          {filteredSuggestions.length > 0 ? (
            <div className="space-y-2">
              <p className="text-[11px] uppercase tracking-[0.28em] text-cyan-200/75">Suggestions</p>
              {filteredSuggestions.map((item) => (
                <button
                  key={item}
                  type="button"
                  onMouseDown={() => applySuggestion(item)}
                  className="block w-full rounded-2xl px-3 py-2 text-left text-sm text-slate-200 transition hover:bg-white/6"
                >
                  {item}
                </button>
              ))}
            </div>
          ) : null}
          <div className={`${filteredSuggestions.length > 0 ? 'mt-4' : ''} space-y-2`}>
            <p className="text-[11px] uppercase tracking-[0.28em] text-slate-400">Recent searches</p>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((item) => (
                <button
                  key={item}
                  type="button"
                  onMouseDown={() => applySuggestion(item)}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-200"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default SearchBar;
