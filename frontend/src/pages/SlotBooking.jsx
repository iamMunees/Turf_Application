import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import AddOnModal from '../components/addons/AddOnModal';
import CartIcon from '../components/addons/CartIcon';
import DashboardShell from '../components/DashboardShell';
import { useAddOns } from '../context/AddOnsContext';
import {
  createBooking,
  ensureArenaXSession,
  formatCurrency,
  formatDateLabel,
  getVenueDetails,
  getVenueSlots,
} from '../lib/arenaxApi';

const getToday = () => new Date().toISOString().slice(0, 10);

const SlotBooking = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [session, setSession] = useState(null);
  const [venue, setVenue] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedSlotId, setSelectedSlotId] = useState(searchParams.get('slotId') || '');
  const [date, setDate] = useState(searchParams.get('date') || getToday());
  const [bookingType, setBookingType] = useState('individual');
  const [playerCount, setPlayerCount] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { openRecommendationsForBooking, registerLatestBooking } = useAddOns();
  const selectedSlotIdRef = useRef(selectedSlotId);
  const addOnTimeoutRef = useRef(null);

  const venueId = searchParams.get('venueId') || '';

  useEffect(() => {
    selectedSlotIdRef.current = selectedSlotId;
  }, [selectedSlotId]);

  useEffect(() => {
    const syncQuery = async () => {
      if (!venueId) {
        setLoading(false);
        return;
      }

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

        const openSlot =
          slotsPayload.slots.find((slot) => slot.id === selectedSlotIdRef.current) ||
          slotsPayload.slots.find((slot) => slot.canJoin || slot.canBookFullSlot) ||
          slotsPayload.slots[0];

        if (openSlot) {
          setSelectedSlotId(openSlot.id);
        }
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    };

    syncQuery();
  }, [venueId, date]);

  useEffect(
    () => () => {
      if (addOnTimeoutRef.current) {
        window.clearTimeout(addOnTimeoutRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    const nextParams = new URLSearchParams();

    if (venueId) {
      nextParams.set('venueId', venueId);
    }

    if (selectedSlotId) {
      nextParams.set('slotId', selectedSlotId);
    }

    nextParams.set('date', date);

    const nextQuery = nextParams.toString();

    if (nextQuery !== searchParams.toString()) {
      setSearchParams(nextParams, { replace: true });
    }
  }, [date, selectedSlotId, venueId, searchParams, setSearchParams]);

  const selectedSlot = slots.find((slot) => slot.id === selectedSlotId);
  const amount =
    bookingType === 'full'
      ? selectedSlot?.slotPrice || 0
      : (selectedSlot?.pricePerPlayer || 0) * playerCount;

  const handleBooking = async () => {
    if (!session || !venue || !selectedSlot) {
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccessMessage('');

    try {
      const payload = {
        venueId: venue.id,
        slotId: selectedSlot.id,
        bookingType,
        playerCount,
      };

      const response = await createBooking(payload, session.token);
      registerLatestBooking(response.booking);
      setSuccessMessage(
        `Booked ${response.booking.venue.name} for ${response.booking.slot.timeLabel} on ${response.booking.slot.slotDate}.`,
      );

      const slotsPayload = await getVenueSlots(venue.id, date);
      setSlots(slotsPayload.slots);
      if (addOnTimeoutRef.current) {
        window.clearTimeout(addOnTimeoutRef.current);
      }
      addOnTimeoutRef.current = window.setTimeout(() => {
        openRecommendationsForBooking(response.booking._id || response.booking.id, session.token).catch(
          () => undefined,
        );
      }, 1000);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardShell
      title="Slot booking"
      description="Choose a venue slot, then reserve the full slot or split the price per player with your group."
    >
      {!venueId ? (
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 text-slate-200">
          <p className="text-lg font-semibold text-white">Select a venue first</p>
          <p className="mt-2 max-w-2xl text-sm text-slate-300">
            Start from the venue explorer to choose City, Area, and Venue before confirming a slot booking.
          </p>
          <Link
            to="/dashboard/venues"
            className="mt-6 inline-flex rounded-full bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950"
          >
            Open Venue List
          </Link>
        </section>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1.25fr_0.95fr]">
          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-cyan-300/80">ArenaX Booking</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  {venue ? venue.name : 'Loading venue'}
                </h2>
                <p className="mt-2 text-sm text-slate-300">
                  {venue ? `${venue.area}, ${venue.city}` : 'Fetching venue details'}
                </p>
              </div>
              <label className="space-y-2 text-sm text-slate-300">
                <span>Date</span>
                <input
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none"
                />
              </label>
            </div>

            {loading ? (
              <p className="mt-6 text-slate-300">Loading live slots...</p>
            ) : (
              <div className="mt-6 grid max-h-[38rem] gap-3 overflow-auto pr-1">
                {slots.map((slot) => {
                  const isSelected = slot.id === selectedSlotId;

                  return (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => setSelectedSlotId(slot.id)}
                      className={`rounded-3xl border p-4 text-left transition ${
                        isSelected
                          ? 'border-cyan-300 bg-cyan-400/10'
                          : 'border-white/10 bg-slate-950/40 hover:border-white/30'
                      }`}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <p className="text-lg font-semibold text-white">{slot.timeLabel}</p>
                          <p className="mt-2 text-sm text-slate-300">
                            Players: {slot.bookedPlayers} / {slot.maxPlayers}
                          </p>
                          <p className="mt-1 text-sm text-slate-400">
                            Remaining: {slot.remainingPlayers} players
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-slate-400">Per player</p>
                          <p className="text-lg font-semibold text-cyan-200">
                            {formatCurrency(slot.pricePerPlayer)}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-[linear-gradient(160deg,_rgba(8,47,73,0.85),_rgba(15,23,42,0.96))] p-6">
            <p className="text-xs uppercase tracking-[0.28em] text-cyan-300/80">Checkout</p>
            <div className="mt-2 flex items-center justify-between gap-3">
              <h2 className="text-2xl font-semibold text-white">Booking summary</h2>
              <CartIcon />
            </div>

            {session ? (
              <p className="mt-3 text-sm text-slate-300">Booking as {session.user.fullName}</p>
            ) : null}

            {selectedSlot ? (
              <div className="mt-6 space-y-5">
                <div className="rounded-3xl border border-white/10 bg-slate-950/40 p-4">
                  <p className="text-sm text-slate-400">Slot</p>
                  <p className="mt-1 text-lg font-semibold text-white">{selectedSlot.timeLabel}</p>
                  <p className="mt-1 text-sm text-slate-300">{formatDateLabel(date)}</p>
                </div>

                <div className="grid gap-3">
                  <button
                    type="button"
                    onClick={() => setBookingType('individual')}
                    className={`rounded-3xl border p-4 text-left ${
                      bookingType === 'individual'
                        ? 'border-cyan-300 bg-cyan-400/10'
                        : 'border-white/10 bg-slate-950/40'
                    }`}
                  >
                    <p className="text-sm font-semibold text-white">Individual Booking</p>
                    <p className="mt-2 text-sm text-slate-300">
                      Join existing players at {formatCurrency(selectedSlot.pricePerPlayer)} per player.
                    </p>
                  </button>

                  <button
                    type="button"
                    disabled={!selectedSlot.canBookFullSlot}
                    onClick={() => setBookingType('full')}
                    className={`rounded-3xl border p-4 text-left ${
                      bookingType === 'full'
                        ? 'border-emerald-300 bg-emerald-400/10'
                        : 'border-white/10 bg-slate-950/40'
                    } disabled:cursor-not-allowed disabled:opacity-50`}
                  >
                    <p className="text-sm font-semibold text-white">Full Slot Booking</p>
                    <p className="mt-2 text-sm text-slate-300">
                      Reserve the full slot for {formatCurrency(selectedSlot.slotPrice)}.
                    </p>
                  </button>
                </div>

                {bookingType === 'individual' ? (
                  <label className="space-y-2 text-sm text-slate-300">
                    <span>Players joining</span>
                    <input
                      type="number"
                      min="1"
                      max={Math.max(selectedSlot.remainingPlayers, 1)}
                      value={playerCount}
                      onChange={(event) =>
                        setPlayerCount(
                          Math.max(
                            1,
                            Math.min(
                              Number(event.target.value) || 1,
                              Math.max(selectedSlot.remainingPlayers, 1),
                            ),
                          ),
                        )
                      }
                      className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none"
                    />
                  </label>
                ) : null}

                <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
                  <div className="flex items-center justify-between text-sm text-slate-300">
                    <span>Amount payable</span>
                    <span className="text-lg font-semibold text-white">{formatCurrency(amount)}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm text-slate-400">
                    <span>Venue capacity</span>
                    <span>{selectedSlot.maxPlayers} players</span>
                  </div>
                </div>

                {error ? <p className="text-sm text-rose-300">{error}</p> : null}
                {successMessage ? <p className="text-sm text-emerald-300">{successMessage}</p> : null}

                <button
                  type="button"
                  onClick={handleBooking}
                  disabled={
                    submitting ||
                    (bookingType === 'full' && !selectedSlot.canBookFullSlot) ||
                    (bookingType === 'individual' &&
                      (!selectedSlot.canJoin || playerCount > selectedSlot.remainingPlayers))
                  }
                  className="w-full rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-slate-300"
                >
                  {submitting ? 'Confirming booking...' : 'Confirm booking'}
                </button>

                <Link to="/dashboard/my-bookings" className="inline-flex text-sm text-cyan-200 underline">
                  View my bookings
                </Link>
              </div>
            ) : (
              <p className="mt-6 text-slate-300">Select a slot to continue.</p>
            )}
          </section>
        </div>
      )}
      <AddOnModal />
    </DashboardShell>
  );
};

export default SlotBooking;
