import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import DashboardShell from '../components/DashboardShell';
import {
  createVenueReview,
  ensureArenaXSession,
  formatCurrency,
  formatDateLabel,
  getVenueDetails,
  getVenueSlots,
} from '../lib/arenaxApi';

const getToday = () => new Date().toISOString().slice(0, 10);

const VenueDetails = () => {
  const { venueId } = useParams();
  const [session, setSession] = useState(null);
  const [venue, setVenue] = useState(null);
  const [slots, setSlots] = useState([]);
  const [date, setDate] = useState(getToday());
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [error, setError] = useState('');

  const loadVenue = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const [arenaSession, venuePayload, slotsPayload] = await Promise.all([
        ensureArenaXSession(),
        getVenueDetails(venueId),
        getVenueSlots(venueId, date),
      ]);

      setSession(arenaSession);
      setVenue(venuePayload.venue);
      setSlots(slotsPayload.slots);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, [venueId, date]);

  useEffect(() => {
    loadVenue();
  }, [loadVenue]);

  const handleReviewSubmit = async (event) => {
    event.preventDefault();

    if (!session) {
      return;
    }

    setSubmittingReview(true);
    setError('');

    try {
      await createVenueReview(
        venueId,
        {
          rating: Number(reviewForm.rating),
          comment: reviewForm.comment,
        },
        session.token,
      );

      setReviewForm({ rating: 5, comment: '' });
      await loadVenue();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <DashboardShell
      title="Venue details"
      description="Inspect facilities, contact details, reviews, and the full 24-hour slot list before moving to checkout."
    >
      {error ? <p className="rounded-2xl border border-rose-400/30 bg-rose-500/10 p-4 text-sm text-rose-200">{error}</p> : null}

      {loading || !venue ? (
        <p className="text-slate-300">Loading venue...</p>
      ) : (
        <div className="space-y-6">
          <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5">
            <div className="grid gap-1 md:grid-cols-[1.45fr_0.8fr]">
              <img src={venue.images[0]} alt={venue.name} className="h-full min-h-[22rem] w-full object-cover" />
              <div className="grid gap-1">
                {venue.images.slice(1, 3).map((image) => (
                  <img key={image} src={image} alt={venue.name} className="h-[10.95rem] w-full object-cover" />
                ))}
              </div>
            </div>
            <div className="grid gap-6 p-6 xl:grid-cols-[1.15fr_0.85fr]">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-cyan-300/80">{venue.city}</p>
                <h2 className="mt-2 text-3xl font-semibold text-white">{venue.name}</h2>
                <p className="mt-3 text-slate-300">{venue.address}</p>

                <div className="mt-5 flex flex-wrap gap-3">
                  {venue.sportTypes.map((sport) => (
                    <span key={sport} className="rounded-full border border-cyan-300/20 px-4 py-2 text-sm text-cyan-100">
                      {sport}
                    </span>
                  ))}
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                    <p className="text-sm text-slate-400">Rating</p>
                    <p className="mt-1 text-xl font-semibold text-white">{venue.rating} / 5</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                    <p className="text-sm text-slate-400">Slot price</p>
                    <p className="mt-1 text-xl font-semibold text-white">{formatCurrency(venue.slotPrice)}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                    <p className="text-sm text-slate-400">Per player</p>
                    <p className="mt-1 text-xl font-semibold text-white">{formatCurrency(venue.pricePerPlayer)}</p>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-white">Facilities</h3>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {venue.facilities.map((facility) => (
                      <span key={facility} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
                        {facility}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-[1.75rem] border border-white/10 bg-[linear-gradient(160deg,_rgba(8,47,73,0.78),_rgba(15,23,42,0.94))] p-5">
                  <p className="text-sm uppercase tracking-[0.22em] text-cyan-200/80">Contact</p>
                  <p className="mt-3 text-sm text-slate-300">{venue.contact.phone}</p>
                  <p className="mt-1 text-sm text-slate-300">{venue.contact.email}</p>
                  <p className="mt-4 text-sm text-slate-400">
                    Managed by {venue.owner?.fullName || 'ArenaX venue owner'}
                  </p>
                </div>

                <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/40 p-5">
                  <p className="text-sm uppercase tracking-[0.22em] text-cyan-200/80">Map</p>
                  <div className="mt-3 rounded-[1.25rem] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.18),_transparent_45%),linear-gradient(135deg,_rgba(8,47,73,0.4),_rgba(15,23,42,0.9))] p-5">
                    <p className="text-lg font-semibold text-white">{venue.area}</p>
                    <p className="mt-2 text-sm text-slate-300">
                      Lat {venue.coordinates.lat}, Lng {venue.coordinates.lng}
                    </p>
                    <a
                      href={`https://www.google.com/maps?q=${venue.coordinates.lat},${venue.coordinates.lng}`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-flex text-sm text-cyan-200 underline"
                    >
                      Open map
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-cyan-300/80">Slot list</p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">{formatDateLabel(date)}</h3>
                </div>
                <input
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none"
                />
              </div>

              <div className="mt-6 grid max-h-[34rem] gap-3 overflow-auto pr-1">
                {slots.map((slot) => (
                  <div key={slot.id} className="rounded-3xl border border-white/10 bg-slate-950/40 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="text-lg font-semibold text-white">{slot.timeLabel}</p>
                        <p className="mt-1 text-sm text-slate-300">
                          Players: {slot.bookedPlayers} / {slot.maxPlayers}
                        </p>
                        <p className="mt-1 text-sm text-slate-400">
                          Price per player: {formatCurrency(slot.pricePerPlayer)}
                        </p>
                      </div>
                      <Link
                        to={`/dashboard/slot-booking?venueId=${venue.id}&slotId=${slot.id}&date=${date}`}
                        className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950"
                      >
                        Book
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-cyan-300/80">Reviews</p>
                    <h3 className="mt-2 text-2xl font-semibold text-white">{venue.reviews.length} recent reviews</h3>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  {venue.reviews.map((review) => (
                    <article key={review.id} className="rounded-3xl border border-white/10 bg-slate-950/40 p-4">
                      <div className="flex items-center justify-between gap-4">
                        <p className="font-semibold text-white">{review.user?.fullName || 'ArenaX user'}</p>
                        <p className="text-sm text-cyan-200">{review.rating} / 5</p>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-slate-300">{review.comment}</p>
                    </article>
                  ))}
                </div>
              </section>

              <section className="rounded-[2rem] border border-white/10 bg-[linear-gradient(160deg,_rgba(8,47,73,0.85),_rgba(15,23,42,0.96))] p-6">
                <p className="text-xs uppercase tracking-[0.28em] text-cyan-300/80">Leave a review</p>
                <form onSubmit={handleReviewSubmit} className="mt-4 space-y-4">
                  <label className="block space-y-2 text-sm text-slate-300">
                    <span>Rating</span>
                    <select
                      value={reviewForm.rating}
                      onChange={(event) => setReviewForm((current) => ({ ...current, rating: event.target.value }))}
                      className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none"
                    >
                      {[5, 4, 3, 2, 1].map((value) => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block space-y-2 text-sm text-slate-300">
                    <span>Comment</span>
                    <textarea
                      rows="4"
                      value={reviewForm.comment}
                      onChange={(event) => setReviewForm((current) => ({ ...current, comment: event.target.value }))}
                      className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none"
                    />
                  </label>

                  <button
                    type="submit"
                    disabled={submittingReview || !reviewForm.comment.trim()}
                    className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-slate-300"
                  >
                    {submittingReview ? 'Posting review...' : 'Post review'}
                  </button>
                </form>
              </section>
            </div>
          </section>
        </div>
      )}
    </DashboardShell>
  );
};

export default VenueDetails;
