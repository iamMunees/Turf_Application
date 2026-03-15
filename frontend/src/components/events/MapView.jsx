import { MapIcon } from './icons';

const MapView = ({ event }) => {
  const mapUrl = `https://www.google.com/maps?q=${event.lat},${event.lng}`;

  return (
    <a
      className="block rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_right,_rgba(34,211,238,0.18),_transparent_35%),linear-gradient(180deg,_rgba(15,23,42,0.95),_rgba(15,23,42,0.76))] p-6 transition hover:border-cyan-300/25"
      href={mapUrl}
      rel="noreferrer"
      target="_blank"
    >
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-cyan-300/10 p-3 text-cyan-100">
          <MapIcon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Open Venue in Maps</p>
          <p className="text-sm text-slate-300">{event.address}</p>
        </div>
      </div>
      <div className="mt-6 grid h-48 place-items-center rounded-[1.5rem] border border-white/10 bg-[linear-gradient(135deg,_rgba(56,189,248,0.08),_rgba(251,191,36,0.08))] text-center">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Map Preview</p>
          <p className="mt-3 text-lg font-semibold text-white">{event.venue}</p>
          <p className="mt-1 text-sm text-slate-300">
            {event.lat.toFixed(3)}, {event.lng.toFixed(3)}
          </p>
        </div>
      </div>
    </a>
  );
};

export default MapView;
