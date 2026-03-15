import { useState } from 'react';
import { usePlayers } from '../../context/PlayersContext';

const BookingModal = ({ player, onClose }) => {
  const { createBooking } = usePlayers();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    createBooking({ playerId: player.id, date, time, notes });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/70 px-4">
      <form className="w-full max-w-lg space-y-4 rounded-[2rem] border border-white/10 bg-slate-950 p-6" onSubmit={handleSubmit}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-cyan-200/75">Book Training</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">{player.name}</h2>
          </div>
          <button type="button" onClick={onClose} className="text-sm text-slate-300">
            Close
          </button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-2">
            <span className="text-sm text-slate-200">Date</span>
            <input
              required
              type="date"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white"
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </label>
          <label className="block space-y-2">
            <span className="text-sm text-slate-200">Time</span>
            <input
              required
              type="time"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white"
              value={time}
              onChange={(event) => setTime(event.target.value)}
            />
          </label>
        </div>
        <label className="block space-y-2">
          <span className="text-sm text-slate-200">Notes</span>
          <textarea
            className="min-h-28 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />
        </label>
        <button type="submit" className="w-full rounded-2xl bg-white px-5 py-3 font-semibold text-slate-950">
          Confirm Booking
        </button>
      </form>
    </div>
  );
};

export default BookingModal;
