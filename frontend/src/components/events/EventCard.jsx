import { Link } from 'react-router-dom';
import { useEvents } from '../../context/EventsContext';
import {
  formatDateTime,
  formatPrice,
  getLevelTone,
  getSportIcon,
  getStatusTone,
} from '../../utils/events';
import { CalendarIcon, HeartIcon, ShareIcon, StarIcon, UsersIcon } from './icons';

const shareEvent = async (event) => {
  const shareUrl = `${window.location.origin}/dashboard/events/${event.id}`;

  if (navigator.share) {
    try {
      await navigator.share({ title: event.name, text: `${event.sport} in ${event.city}`, url: shareUrl });
      return;
    } catch {
      return;
    }
  }

  window.open(
    `https://wa.me/?text=${encodeURIComponent(`${event.name} - ${shareUrl}`)}`,
    '_blank',
    'noopener,noreferrer'
  );
};

const EventCard = ({ event, viewMode = 'grid' }) => {
  const { favorites, toggleFavorite } = useEvents();
  const isFavorite = favorites.includes(event.id);

  return (
    <article
      className={`overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/70 shadow-[0_25px_70px_rgba(15,23,42,0.45)] backdrop-blur ${
        viewMode === 'list' ? 'md:grid md:grid-cols-[320px_1fr]' : ''
      }`}
    >
      <div className="relative">
        <img alt={event.name} className="h-56 w-full object-cover" src={event.image} />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/15 to-transparent" />
        <div className="absolute left-4 top-4 flex items-center gap-2">
          <span className={`rounded-full border px-3 py-1 text-xs font-medium ${getLevelTone(event.level)}`}>
            {event.level}
          </span>
          <span className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusTone(event.status)}`}>
            {event.status}
          </span>
        </div>
        <button
          aria-label="Save event"
          className="absolute right-4 top-4 rounded-full border border-white/15 bg-slate-950/65 p-2 text-white"
          type="button"
          onClick={() => toggleFavorite(event.id)}
        >
          <HeartIcon className="h-5 w-5" filled={isFavorite} />
        </button>
      </div>

      <div className="space-y-4 p-5 md:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-cyan-200">
              {getSportIcon(event.sport)} {event.sport}
            </p>
            <h3 className="mt-2 text-xl font-semibold text-white">{event.name}</h3>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-amber-300/10 px-3 py-1 text-sm text-amber-100">
            <StarIcon className="h-4 w-4" />
            {event.rating}
          </div>
        </div>

        <div className="grid gap-3 text-sm text-slate-200 sm:grid-cols-2">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-cyan-200" />
            <span>{formatDateTime(event.dateTime)}</span>
          </div>
          <div className="flex items-center gap-2">
            <UsersIcon className="h-4 w-4 text-cyan-200" />
            <span>{event.participantsCount} registered</span>
          </div>
        </div>

        <div className="rounded-3xl bg-white/5 p-4 text-sm text-slate-200">
          <p className="font-medium text-white">{event.venue}</p>
          <p className="mt-1 text-slate-300">{event.distanceLabel}</p>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.26em] text-slate-400">Entry Fee</p>
            <p className="mt-1 text-lg font-semibold text-white">{formatPrice(event.fee)}</p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => shareEvent(event)}
              className="rounded-full border border-white/10 bg-white/5 p-3 text-slate-100 transition hover:bg-white/10"
            >
              <ShareIcon className="h-4 w-4" />
            </button>
            <Link
              className="rounded-full bg-gradient-to-r from-cyan-300 to-amber-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-90"
              to={`/dashboard/events/${event.id}`}
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};

export default EventCard;
