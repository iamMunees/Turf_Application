import { Link, useParams } from 'react-router-dom';
import { useMemo } from 'react';
import { useEvents } from '../../context/EventsContext';
import {
  formatDateOnly,
  formatDateTime,
  formatPrice,
  getLevelTone,
  getRelatedEvents,
  getSportIcon,
} from '../../utils/events';
import EventCard from './EventCard';
import MapView from './MapView';
import RegistrationForm from './RegistrationForm';
import { CalendarIcon, ShareIcon, StarIcon, UsersIcon } from './icons';

const shareLinks = (event) => {
  const url = encodeURIComponent(`${window.location.origin}/dashboard/events/${event.id}`);
  const text = encodeURIComponent(`${event.name} | ${event.sport} | ${event.city}`);
  return [
    { label: 'WhatsApp', href: `https://wa.me/?text=${text}%20${url}` },
    { label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${url}` },
    { label: 'Twitter', href: `https://twitter.com/intent/tweet?text=${text}&url=${url}` },
  ];
};

const initials = (name) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

const EventDetailPage = () => {
  const { eventId } = useParams();
  const { events, getEventById } = useEvents();
  const event = getEventById(eventId);

  const relatedEvents = useMemo(
    () => (event ? getRelatedEvents(events, event).slice(0, 3) : []),
    [event, events]
  );

  if (!event) {
    return (
      <div className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-8 text-center">
        <p className="text-xl font-semibold text-white">Event not found.</p>
        <Link className="mt-4 inline-block text-cyan-200" to="/dashboard/events">
          Back to discovery
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link className="inline-flex text-sm text-cyan-200 transition hover:text-white" to="/dashboard/events">
        Back to discovery
      </Link>

      <section className="overflow-hidden rounded-[2.25rem] border border-white/10 bg-slate-950/70">
        <div className="relative h-80">
          <img alt={event.name} className="h-full w-full object-cover" src={event.image} />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className={`rounded-full border px-3 py-1 text-xs font-medium ${getLevelTone(event.level)}`}>
                {event.level}
              </span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white">
                {getSportIcon(event.sport)} {event.sport}
              </span>
            </div>
            <h1 className="mt-4 max-w-3xl text-3xl font-semibold text-white md:text-5xl">{event.name}</h1>
            <div className="mt-4 flex flex-wrap items-center gap-5 text-sm text-slate-200">
              <span className="inline-flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-cyan-200" />
                {formatDateTime(event.dateTime)}
              </span>
              <span className="inline-flex items-center gap-2">
                <UsersIcon className="h-4 w-4 text-cyan-200" />
                {event.participantsCount} participants
              </span>
              <span className="inline-flex items-center gap-2">
                <StarIcon className="h-4 w-4 text-amber-300" />
                {event.rating} organizer score
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5">
              <p className="text-[11px] uppercase tracking-[0.3em] text-slate-400">Venue</p>
              <p className="mt-3 text-lg font-semibold text-white">{event.venue}</p>
              <p className="mt-2 text-sm text-slate-300">{event.distanceLabel}</p>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5">
              <p className="text-[11px] uppercase tracking-[0.3em] text-slate-400">Entry Fee</p>
              <p className="mt-3 text-lg font-semibold text-white">{formatPrice(event.fee)}</p>
              <p className="mt-2 text-sm text-slate-300">Deadline {formatDateOnly(event.registrationDeadline)}</p>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5">
              <p className="text-[11px] uppercase tracking-[0.3em] text-slate-400">Organizer</p>
              <p className="mt-3 text-lg font-semibold text-white">{event.organizer.name}</p>
              <p className="mt-2 text-sm text-slate-300">{event.organizer.contact}</p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-6">
            <h2 className="text-2xl font-semibold text-white">About this event</h2>
            <p className="mt-4 text-base leading-7 text-slate-200">{event.description}</p>
            <h3 className="mt-6 text-lg font-semibold text-white">Rules</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              {event.rules.map((rule) => (
                <li key={rule}>- {rule}</li>
              ))}
            </ul>
          </div>

          <MapView event={event} />

          <div className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-6">
            <h2 className="text-2xl font-semibold text-white">Participants</h2>
            <p className="mt-2 text-sm text-slate-300">Teams and players already confirmed.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              {event.participants.map((participant) => (
                <div
                  key={participant.id}
                  className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-cyan-300 to-amber-300 text-sm font-semibold text-slate-950">
                    {initials(participant.name)}
                  </span>
                  <span className="text-sm text-white">{participant.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-6">
            <h2 className="text-2xl font-semibold text-white">Comments & Reviews</h2>
            <div className="mt-5 space-y-4">
              {event.comments.map((comment) => (
                <article key={comment.id} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-white">{comment.author}</p>
                    <p className="text-sm text-amber-200">{'*'.repeat(comment.rating)}</p>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{comment.text}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-slate-400">Related Events</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Similar sport or nearby picks</h2>
            </div>
            <div className="grid gap-5 lg:grid-cols-2">
              {relatedEvents.map((relatedEvent) => (
                <EventCard key={relatedEvent.id} event={relatedEvent} />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <RegistrationForm event={event} />
          <div className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-6">
            <div className="flex items-center gap-2 text-white">
              <ShareIcon className="h-4 w-4 text-cyan-200" />
              <h2 className="text-lg font-semibold">Share Event</h2>
            </div>
            <div className="mt-4 grid gap-3">
              {shareLinks(event).map((item) => (
                <a
                  key={item.label}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 transition hover:bg-white/10"
                  href={item.href}
                  rel="noreferrer"
                  target="_blank"
                >
                  Share on {item.label}
                </a>
              ))}
            </div>
          </div>
          <Link
            className="block rounded-[2rem] border border-cyan-300/20 bg-cyan-300/10 px-5 py-4 text-center text-sm font-semibold text-cyan-100"
            to="/dashboard/events/registrations"
          >
            View my registrations
          </Link>
        </div>
      </section>
    </div>
  );
};

export default EventDetailPage;
