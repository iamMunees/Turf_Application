import { useState } from 'react';
import { usePlayers } from '../../context/PlayersContext';

const InviteModal = ({ player, onClose }) => {
  const { organizerEvents, sendInvite } = usePlayers();
  const [eventId, setEventId] = useState(organizerEvents[0]?.id ?? '');
  const [message, setMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    sendInvite({ playerId: player.id, eventId, message });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/70 px-4">
      <form className="w-full max-w-lg space-y-4 rounded-[2rem] border border-white/10 bg-slate-950 p-6" onSubmit={handleSubmit}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-cyan-200/75">Invite to Event</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">{player.name}</h2>
          </div>
          <button type="button" onClick={onClose} className="text-sm text-slate-300">
            Close
          </button>
        </div>
        <label className="block space-y-2">
          <span className="text-sm text-slate-200">Select event</span>
          <select
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white"
            value={eventId}
            onChange={(event) => setEventId(event.target.value)}
          >
            {organizerEvents.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block space-y-2">
          <span className="text-sm text-slate-200">Custom message</span>
          <textarea
            className="min-h-28 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />
        </label>
        <button type="submit" className="w-full rounded-2xl bg-white px-5 py-3 font-semibold text-slate-950">
          Send Invite
        </button>
      </form>
    </div>
  );
};

export default InviteModal;
