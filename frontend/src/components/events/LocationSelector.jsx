import { useEvents } from '../../context/EventsContext';
import { ChevronDownIcon, LocationPinIcon } from './icons';

const LocationSelector = () => {
  const { cityOptions, currentCity, selectCity, useMyLocation, locationPermission } = useEvents();

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <div className="relative min-w-[210px]">
        <LocationPinIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-300" />
        <select
          aria-label="Select city"
          className="w-full appearance-none rounded-2xl border border-white/12 bg-slate-950/70 py-3 pl-10 pr-10 text-sm text-white outline-none transition focus:border-amber-300/50"
          value={currentCity.id}
          onChange={(event) => selectCity(event.target.value)}
        >
          {cityOptions.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </select>
        <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300" />
      </div>
      <button
        type="button"
        onClick={useMyLocation}
        className="rounded-2xl border border-amber-300/30 bg-amber-300/10 px-4 py-3 text-sm font-medium text-amber-100 transition hover:bg-amber-300/15"
      >
        {locationPermission === 'loading' ? 'Locating...' : 'Use My Location'}
      </button>
    </div>
  );
};

export default LocationSelector;
