import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardShell from '../components/DashboardShell';
import {
  ensureArenaXSession,
  formatCurrency,
  formatDateLabel,
  getMyBookings,
} from '../lib/arenaxApi';

const MyBookings = () => {
  const [session, setSession] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadBookings = async () => {
      setLoading(true);
      setError('');

      try {
        const arenaSession = await ensureArenaXSession();
        const payload = await getMyBookings(arenaSession.token);

        setSession(arenaSession);
        setBookings(payload.bookings);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  return (
    <DashboardShell
      title="My bookings"
      description="Review every confirmed ArenaX reservation, including venue, slot, booking type, seats booked, and amount paid."
    >
      {session ? (
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <p className="text-xs uppercase tracking-[0.28em] text-cyan-300/80">ArenaX account</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">{session.user.fullName}</h2>
          <p className="mt-2 text-sm text-slate-300">{session.user.email}</p>
        </section>
      ) : null}

      {error ? <p className="rounded-2xl border border-rose-400/30 bg-rose-500/10 p-4 text-sm text-rose-200">{error}</p> : null}

      {loading ? (
        <p className="text-slate-300">Loading your bookings...</p>
      ) : bookings.length === 0 ? (
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 text-slate-200">
          <p className="text-lg font-semibold text-white">No bookings yet</p>
          <p className="mt-2 text-sm text-slate-300">Reserve a slot to populate your ArenaX booking history.</p>
          <Link
            to="/dashboard/venues"
            className="mt-6 inline-flex rounded-full bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950"
          >
            Browse venues
          </Link>
        </section>
      ) : (
        <section className="grid gap-5 xl:grid-cols-2">
          {bookings.map((booking) => (
            <article
              key={booking._id}
              className="rounded-[2rem] border border-white/10 bg-[linear-gradient(160deg,_rgba(8,47,73,0.76),_rgba(15,23,42,0.96))] p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan-200/80">{booking.bookingType}</p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">{booking.venue.name}</h3>
                  <p className="mt-2 text-sm text-slate-300">
                    {booking.venue.area}, {booking.venue.city}
                  </p>
                </div>
                <span className="rounded-full border border-white/10 px-4 py-2 text-sm text-white">
                  {booking.status}
                </span>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-black/15 p-4">
                  <p className="text-sm text-slate-400">Slot</p>
                  <p className="mt-1 font-semibold text-white">{booking.slot.timeLabel}</p>
                  <p className="mt-1 text-sm text-slate-300">{formatDateLabel(booking.slot.slotDate)}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/15 p-4">
                  <p className="text-sm text-slate-400">Amount paid</p>
                  <p className="mt-1 font-semibold text-white">{formatCurrency(booking.amountPaid)}</p>
                  <p className="mt-1 text-sm text-slate-300">
                    {booking.playersBooked} player{booking.playersBooked > 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  to={`/dashboard/venues/${booking.venue._id}`}
                  className="rounded-full border border-cyan-300/40 px-4 py-2 text-sm font-semibold text-cyan-100"
                >
                  Venue details
                </Link>
                <Link
                  to={`/dashboard/slot-booking?venueId=${booking.venue._id}&slotId=${booking.slot._id}&date=${booking.slot.slotDate}`}
                  className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950"
                >
                  Book again
                </Link>
              </div>
            </article>
          ))}
        </section>
      )}
    </DashboardShell>
  );
};

export default MyBookings;
