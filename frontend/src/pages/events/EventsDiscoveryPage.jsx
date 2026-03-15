import { Link } from 'react-router-dom';
import EventGrid from '../../components/events/EventGrid';
import FilterPanel from '../../components/events/FilterPanel';
import LocationSelector from '../../components/events/LocationSelector';
import SearchBar from '../../components/events/SearchBar';
import { useEvents } from '../../context/EventsContext';
import { FilterIcon, HeartIcon, LocationPinIcon, StarIcon } from '../../components/events/icons';
import { formatDateOnly, formatPrice, getSportIcon } from '../../utils/events';

const EventStripCard = ({ event }) => (
  <Link
    className="min-w-[260px] rounded-[2rem] border border-white/10 bg-white/5 p-4 transition hover:border-cyan-300/30 hover:bg-white/[0.07]"
    to={`/dashboard/events/${event.id}`}
  >
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-sm text-cyan-200">
          {getSportIcon(event.sport)} {event.sport}
        </p>
        <h3 className="mt-2 text-lg font-semibold text-white">{event.name}</h3>
      </div>
      <div className="flex items-center gap-1 rounded-full bg-amber-300/10 px-3 py-1 text-xs text-amber-100">
        <StarIcon className="h-3.5 w-3.5" />
        {event.rating}
      </div>
    </div>
    <p className="mt-3 text-sm text-slate-300">{event.venue}</p>
    <div className="mt-4 flex items-center justify-between text-sm text-slate-200">
      <span>{formatDateOnly(event.dateTime)}</span>
      <span>{formatPrice(event.fee)}</span>
    </div>
  </Link>
);

const RegistrationsPreview = () => {
  const { registrations, cancelRegistration } = useEvents();

  return (
    <section className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-slate-400">Dashboard</p>
          <h2 className="mt-2 text-xl font-semibold text-white">My registrations</h2>
        </div>
        <Link className="text-sm text-cyan-200" to="/dashboard/events/registrations">
          View all
        </Link>
      </div>
      <div className="mt-4 space-y-3">
        {registrations.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-white/10 px-4 py-5 text-sm text-slate-300">
            No registrations yet. Pick an event and register from its detail page.
          </p>
        ) : (
          registrations.slice(0, 3).map((registration) => (
            <div key={registration.eventId} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="font-medium text-white">{registration.eventName}</p>
              <p className="mt-1 text-sm text-slate-300">
                {registration.eventCity} | {formatDateOnly(registration.eventDateTime)}
              </p>
              <button
                type="button"
                onClick={() => cancelRegistration(registration.eventId)}
                className="mt-3 text-sm font-medium text-rose-200"
              >
                Cancel registration
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

const EventsDiscoveryPage = () => {
  const {
    currentCity,
    favorites,
    isFilterOpen,
    popularEvents,
    recommendedEvents,
    setIsFilterOpen,
  } = useEvents();

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(251,191,36,0.14),_transparent_28%),linear-gradient(180deg,_#020617,_#081223_40%,_#020617)] px-4 py-5 text-white md:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px] space-y-6">
        <header className="rounded-[2rem] border border-white/10 bg-slate-950/55 px-5 py-4 backdrop-blur md:px-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-4">
              <div className="grid h-14 w-14 place-items-center rounded-[1.5rem] bg-gradient-to-br from-cyan-300 to-amber-300 text-lg font-black text-slate-950">
                LU
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.35em] text-cyan-200/80">LineUp Sports</p>
                <h1 className="mt-1 text-2xl font-semibold text-white">Discover nearby tournaments</h1>
              </div>
            </div>
            <div className="flex items-center gap-3 self-start rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-100 xl:self-auto">
              <HeartIcon className="h-4 w-4" filled />
              {favorites.length} saved
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <SearchBar />
            <LocationSelector />
            <button
              type="button"
              className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/5 text-slate-100"
              aria-label="User profile"
            >
              <span className="text-sm font-semibold">AK</span>
            </button>
          </div>
        </header>

        <section className="rounded-[2rem] border border-amber-300/15 bg-[linear-gradient(120deg,_rgba(251,191,36,0.14),_rgba(34,211,238,0.1))] px-5 py-4 backdrop-blur md:px-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-amber-300/15 p-3 text-amber-100">
                <LocationPinIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-amber-100/90">Showing events near: {currentCity.name}</p>
                <p className="text-xs uppercase tracking-[0.28em] text-slate-200/65">{currentCity.state}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/50 px-4 py-2 text-sm text-white lg:hidden"
            >
              <FilterIcon className="h-4 w-4" />
              Filters
            </button>
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.32em] text-slate-400">Trending</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Popular events carousel</h2>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none]">
            {popularEvents.map((event) => (
              <EventStripCard key={event.id} event={event} />
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <div className={`${isFilterOpen ? 'block' : 'hidden'} lg:block`}>
            <FilterPanel />
          </div>

          <div className="space-y-6">
            <EventGrid />

            <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
              <div className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.3em] text-slate-400">Recommended</p>
                    <h2 className="mt-2 text-xl font-semibold text-white">Recommended for you</h2>
                  </div>
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  {recommendedEvents.slice(0, 4).map((event) => (
                    <EventStripCard key={event.id} event={event} />
                  ))}
                </div>
              </div>

              <RegistrationsPreview />
            </section>
          </div>
        </section>
      </div>
    </main>
  );
};

export default EventsDiscoveryPage;
