import { Link } from 'react-router-dom';
import { useEvents } from '../../context/EventsContext';
import { formatDateTime, formatPrice } from '../../utils/events';

const EventRegistrationsPage = () => {
  const { registrations, cancelRegistration } = useEvents();

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_24%),linear-gradient(180deg,_#020617,_#081223_40%,_#020617)] px-4 py-6 text-white md:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <Link className="inline-flex text-sm text-cyan-200 transition hover:text-white" to="/dashboard/events">
          Back to discovery
        </Link>

        <section className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-6">
          <p className="text-[11px] uppercase tracking-[0.32em] text-cyan-200/80">Dashboard</p>
          <h1 className="mt-3 text-3xl font-semibold text-white md:text-4xl">My registrations</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
            Review upcoming entries, contact organizers, or cancel a registration before the deadline.
          </p>
        </section>

        <section className="space-y-4">
          {registrations.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-white/15 bg-slate-950/40 p-10 text-center">
              <p className="text-lg font-semibold text-white">No event registrations yet.</p>
              <Link className="mt-4 inline-block rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950" to="/dashboard/events">
                Explore events
              </Link>
            </div>
          ) : (
            registrations.map((registration) => (
              <article
                key={registration.eventId}
                className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-5"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm text-cyan-200">{registration.eventSport}</p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">{registration.eventName}</h2>
                    <p className="mt-2 text-sm text-slate-300">
                      {registration.eventCity} | {formatDateTime(registration.eventDateTime)}
                    </p>
                    <p className="mt-2 text-sm text-slate-300">
                      Registered as {registration.attendee.name} | {registration.attendee.ageGroup}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-amber-300/10 px-4 py-2 text-sm font-semibold text-amber-100">
                      {formatPrice(registration.fee)}
                    </span>
                    <Link
                      className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white"
                      to={`/dashboard/events/${registration.eventId}`}
                    >
                      View event
                    </Link>
                    <button
                      type="button"
                      onClick={() => cancelRegistration(registration.eventId)}
                      className="rounded-full border border-rose-300/25 bg-rose-300/10 px-4 py-2 text-sm text-rose-100"
                    >
                      Cancel registration
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </section>
      </div>
    </main>
  );
};

export default EventRegistrationsPage;
