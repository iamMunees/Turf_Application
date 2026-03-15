import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardShell from '../components/DashboardShell';
import {
  ensureArenaXSession,
  formatCurrency,
  getVenueFilters,
  getVenues,
} from '../lib/arenaxApi';

const VenueList = () => {
  const [session, setSession] = useState(null);
  const [filterOptions, setFilterOptions] = useState({ cities: [], sports: [] });
  const [filters, setFilters] = useState({ city: '', area: '', sport: '' });
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadFilters = async () => {
      setLoading(true);
      setError('');

      try {
        const [arenaSession, filtersPayload] = await Promise.all([
          ensureArenaXSession(),
          getVenueFilters(),
        ]);

        setSession(arenaSession);
        setFilterOptions(filtersPayload);

        const firstCity = filtersPayload.cities[0]?.city || '';
        const firstArea = filtersPayload.cities[0]?.areas[0] || '';

        setFilters({
          city: firstCity,
          area: firstArea,
          sport: '',
        });
      } catch (requestError) {
        setError(requestError.message);
        setLoading(false);
      }
    };

    loadFilters();
  }, []);

  useEffect(() => {
    const loadVenues = async () => {
      if (!filters.city && !filters.area && !filters.sport) {
        return;
      }

      setLoading(true);
      setError('');

      try {
        const venuesPayload = await getVenues(filters);
        setVenues(venuesPayload.venues);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    };

    loadVenues();
  }, [filters]);

  const selectedCity = filterOptions.cities.find((city) => city.city === filters.city);
  const areaOptions = selectedCity?.areas || [];

  return (
    <DashboardShell
      title="Venue list"
      description="Discover ArenaX venues by City, Area, and sport type. Every card shows distance, rating, images, slot price, and split-per-player cost."
    >
      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-cyan-300/80">ArenaX Discovery</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Choose city, area, and venue</h2>
            {session ? (
              <p className="mt-2 text-sm text-slate-300">
                Demo session active for {session.user.fullName} in {session.user.city}
              </p>
            ) : null}
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <label className="space-y-2 text-sm text-slate-300">
            <span>City</span>
            <select
              value={filters.city}
              onChange={(event) => {
                const nextCity = event.target.value;
                const nextArea = filterOptions.cities.find((city) => city.city === nextCity)?.areas[0] || '';

                setFilters((current) => ({
                  ...current,
                  city: nextCity,
                  area: nextArea,
                }));
              }}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none"
            >
              {filterOptions.cities.map((city) => (
                <option key={city.city} value={city.city}>
                  {city.city}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm text-slate-300">
            <span>Area</span>
            <select
              value={filters.area}
              onChange={(event) => setFilters((current) => ({ ...current, area: event.target.value }))}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none"
            >
              {areaOptions.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm text-slate-300">
            <span>Sport</span>
            <select
              value={filters.sport}
              onChange={(event) => setFilters((current) => ({ ...current, sport: event.target.value }))}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none"
            >
              <option value="">All sports</option>
              {filterOptions.sports.map((sport) => (
                <option key={sport} value={sport}>
                  {sport}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      {error ? <p className="rounded-2xl border border-rose-400/30 bg-rose-500/10 p-4 text-sm text-rose-200">{error}</p> : null}

      {loading ? (
        <p className="text-slate-300">Loading venues...</p>
      ) : (
        <section className="grid gap-5 xl:grid-cols-2">
          {venues.map((venue) => (
            <article
              key={venue.id}
              className="overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(140deg,_rgba(2,6,23,0.92),_rgba(15,23,42,0.96))]"
            >
              <div className="">
                <div className="grid min-h-[14rem] grid-cols-2 gap-1 bg-slate-950/50 p-1">
                  {venue.images.slice(0, 2).map((image) => (
                    <img
                      key={image}
                      src={image}
                      alt={venue.name}
                      className="h-full w-full rounded-[1.25rem] object-cover"
                    />
                  ))}
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.2em] text-cyan-200/80">
                    {venue.sportTypes.map((sport) => (
                      <span key={sport} className="rounded-full border border-cyan-300/20 px-3 py-1">
                        {sport}
                      </span>
                    ))}
                  </div>
                  <h3 className="mt-4 text-2xl font-semibold text-white">{venue.name}</h3>
                  <p className="mt-2 text-sm text-slate-300">
                    {venue.area}, {venue.city}
                  </p>
                  <div className="mt-5 grid gap-3 text-sm text-slate-200 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                      <p className="text-slate-400">Rating</p>
                      <p className="mt-1 font-semibold text-white">{venue.rating} / 5</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                      <p className="text-slate-400">Distance</p>
                      <p className="mt-1 font-semibold text-white">{venue.distanceKm} km</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                      <p className="text-slate-400">Slot price</p>
                      <p className="mt-1 font-semibold text-white">{formatCurrency(venue.slotPrice)}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                      <p className="text-slate-400">Per player</p>
                      <p className="mt-1 font-semibold text-white">{formatCurrency(venue.pricePerPlayer)}</p>
                    </div>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      to={`/dashboard/venues/${venue.id}`}
                      className="rounded-full  border border-cyan-300/40  px-5 py-3 text-sm font-semibold text-slate-950"
                    >
                      View venue
                    </Link>
                    <Link
                      to={`/dashboard/slot-booking?venueId=${venue.id}`}
                      className="rounded-full border border-cyan-300/40 px-5 py-3 text-sm font-semibold text-cyan-100"
                    >
                      Book a slot
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </DashboardShell>
  );
};

export default VenueList;
