import { Link } from 'react-router-dom';
import { useState } from 'react';
import { usePlayers } from '../../context/PlayersContext';
import BookingModal from './BookingModal';
import FollowButton from './FollowButton';
import InviteModal from './InviteModal';

const levelTone = {
  Local: 'bg-white/10 text-slate-100 border-white/10',
  State: 'bg-sky-300/10 text-sky-100 border-sky-300/20',
  National: 'bg-amber-300/10 text-amber-100 border-amber-300/20',
};

const sportIcon = {
  Cricket: '🏏',
  Badminton: '🏸',
  Football: '⚽',
  Basketball: '🏀',
  Volleyball: '🏐',
  Tennis: '🎾',
};

const PlayerCard = ({ player }) => {
  const { currentUser } = usePlayers();
  const [showInvite, setShowInvite] = useState(false);
  const [showBooking, setShowBooking] = useState(false);

  return (
    <>
      <article className="rounded-[2rem] border border-white/10 bg-slate-950/65 p-5 shadow-[0_20px_60px_rgba(2,6,23,0.45)]">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link to={`/dashboard/users/${player.id}`} className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-cyan-300 to-amber-300 text-lg font-bold text-slate-950">
              {player.avatar}
            </Link>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Link to={`/dashboard/users/${player.id}`} className="text-xl font-semibold text-white">
                  {player.name}
                </Link>
                <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${levelTone[player.level]}`}>
                  {player.level}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-300">
                {sportIcon[player.sport]} {player.sport} | {player.city}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-amber-100">⭐ {player.rating}</p>
            <p className="mt-1 text-xs text-slate-400">{player.followers.toLocaleString('en-IN')} followers</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white">{player.playerType}</span>
          {player.isVerified ? <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-xs text-cyan-100">Verified</span> : null}
          {player.isRisingStar ? <span className="rounded-full border border-pink-300/20 bg-pink-300/10 px-3 py-1.5 text-xs text-pink-100">Rising Star</span> : null}
        </div>

        <p className="mt-4 text-sm leading-6 text-slate-300">{player.bio}</p>

        <div className="mt-5 grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
          <div className="rounded-2xl bg-white/5 p-3">{player.distanceKm.toFixed(1)} km away</div>
          <div className="rounded-2xl bg-white/5 p-3">{player.eventsRegistered} events registered</div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <FollowButton playerId={player.id} isFollowing={player.isFollowing} />
          {currentUser.role === 'organizer' ? (
            <button type="button" onClick={() => setShowInvite(true)} className="rounded-full border border-white/10 px-4 py-2 text-sm text-white">
              Invite to Event
            </button>
          ) : null}
          {player.trainingOffered ? (
            <button type="button" onClick={() => setShowBooking(true)} className="rounded-full border border-white/10 px-4 py-2 text-sm text-white">
              Book Training
            </button>
          ) : null}
        </div>
      </article>
      {showInvite ? <InviteModal player={player} onClose={() => setShowInvite(false)} /> : null}
      {showBooking ? <BookingModal player={player} onClose={() => setShowBooking(false)} /> : null}
    </>
  );
};

export default PlayerCard;
