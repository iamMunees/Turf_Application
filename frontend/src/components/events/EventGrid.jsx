import { useEvents } from '../../context/EventsContext';
import EventCard from './EventCard';
import { GridIcon, ListIcon } from './icons';

const EventGrid = () => {
  const { filteredEvents, isLoading, page, setPage, viewMode, setViewMode, visibleEvents } = useEvents();

  if (isLoading) {
    return (
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-[420px] animate-pulse rounded-[2rem] border border-white/10 bg-white/5"
          />
        ))}
      </div>
    );
  }

  if (filteredEvents.length === 0) {
    return (
      <div className="rounded-[2rem] border border-dashed border-white/15 bg-slate-950/40 p-10 text-center">
        <p className="text-lg font-semibold text-white">No events match these filters.</p>
        <p className="mt-2 text-sm text-slate-300">Try widening your radius, price, or sport selections.</p>
      </div>
    );
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-slate-400">Events Feed</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">{filteredEvents.length} events found</h2>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/60 p-1">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`rounded-full px-4 py-2 text-sm transition ${
              viewMode === 'grid' ? 'bg-white text-slate-950' : 'text-slate-200'
            }`}
          >
            <span className="flex items-center gap-2">
              <GridIcon className="h-4 w-4" />
              Grid
            </span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`rounded-full px-4 py-2 text-sm transition ${
              viewMode === 'list' ? 'bg-white text-slate-950' : 'text-slate-200'
            }`}
          >
            <span className="flex items-center gap-2">
              <ListIcon className="h-4 w-4" />
              List
            </span>
          </button>
        </div>
      </div>

      <div className={viewMode === 'grid' ? 'grid gap-5 md:grid-cols-2 2xl:grid-cols-3' : 'space-y-5'}>
        {visibleEvents.map((event) => (
          <EventCard key={event.id} event={event} viewMode={viewMode} />
        ))}
      </div>

      {visibleEvents.length < filteredEvents.length ? (
        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={() => setPage(page + 1)}
            className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Load more events
          </button>
        </div>
      ) : null}
    </section>
  );
};

export default EventGrid;
