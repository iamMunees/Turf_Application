import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PlayersProvider, usePlayers } from '../../context/PlayersContext';
import BookingModal from './BookingModal';
import FollowButton from './FollowButton';
import InviteModal from './InviteModal';
import TrainingSection from './TrainingSection';

const PlayerProfileView = () => {
  const { playerId } = useParams();
  const { currentUser, cancelBooking, getPlayerById } = usePlayers();
  const [showInvite, setShowInvite] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const player = getPlayerById(playerId);

  if (!player) {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-6 text-white">
        <div className="mx-auto max-w-5xl rounded-[2rem] border border-white/10 bg-slate-950/60 p-8 text-center">
          Player not found.
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_24%),linear-gradient(180deg,_#020617,_#091221_38%,_#020617)] px-4 py-6 text-white md:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <Link className="text-sm text-cyan-200" to="/dashboard/players">
            Back to players
          </Link>

          <section className={`overflow-hidden rounded-[2.25rem] border border-white/10 bg-gradient-to-br ${player.bannerTone}`}>
            <div className="bg-slate-950/55 p-6 md:p-8">
              <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                <div className="flex items-end gap-4">
                  <div className="grid h-24 w-24 place-items-center rounded-full bg-white text-2xl font-bold text-slate-950">
                    {player.avatar}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h1 className="text-3xl font-semibold text-white md:text-4xl">{player.name}</h1>
                      <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-white">{player.level}</span>
                      {player.isVerified ? <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-100">Verified</span> : null}
                      {player.isRisingStar ? <span className="rounded-full border border-pink-300/20 bg-pink-300/10 px-3 py-1 text-xs text-pink-100">Rising Star</span> : null}
                    </div>
                    <p className="mt-2 text-sm text-slate-200">
                      {player.sport} | {player.city} | {player.playerType}
                    </p>
                    <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-200">{player.bio}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <FollowButton playerId={player.id} isFollowing={player.isFollowing} />
                  {currentUser.role === 'organizer' ? (
                    <button type="button" onClick={() => setShowInvite(true)} className="rounded-full border border-white/10 px-4 py-2 text-sm text-white">
                      Invite to Event
                    </button>
                  ) : null}
                  <button type="button" className="rounded-full border border-white/10 px-4 py-2 text-sm text-white">
                    Send Message
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-4">
            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-slate-400">Total posts</p>
              <p className="mt-3 text-3xl font-semibold text-white">{player.totalPosts}</p>
            </div>
            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-slate-400">Events registered</p>
              <p className="mt-3 text-3xl font-semibold text-white">{player.eventsRegistered}</p>
            </div>
            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-slate-400">Followers</p>
              <p className="mt-3 text-3xl font-semibold text-white">{player.followers.toLocaleString('en-IN')}</p>
            </div>
            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-slate-400">Following</p>
              <p className="mt-3 text-3xl font-semibold text-white">{player.following}</p>
            </div>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-6">
            <h2 className="text-2xl font-semibold text-white">Career Boost Posts</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {player.careerHighlights.map((highlight) => (
                <div key={highlight.id} className="aspect-square rounded-[1.75rem] border border-white/10 bg-white/5 p-4">
                  <div className="flex h-full items-end rounded-[1.25rem] bg-gradient-to-br from-cyan-300/15 to-amber-300/10 p-4 text-sm text-white">
                    {highlight.label}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <TrainingSection player={player} onBook={() => setShowBooking(true)} />

          <section className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-6">
              <h2 className="text-2xl font-semibold text-white">Followers</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {player.followersPreview.map((follower) => (
                  <span key={follower} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white">
                    {follower}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-6">
              <h2 className="text-2xl font-semibold text-white">Training bookings</h2>
              <div className="mt-4 space-y-3">
                {player.bookings.length === 0 ? (
                  <p className="text-sm text-slate-300">No bookings yet.</p>
                ) : (
                  player.bookings.map((booking) => (
                    <div key={booking.id} className="rounded-2xl bg-white/5 p-4 text-sm text-slate-200">
                      <p>
                        {booking.date} | {booking.time} | {booking.status}
                      </p>
                      {booking.status !== 'Cancelled' ? (
                        <button type="button" onClick={() => cancelBooking(booking.id)} className="mt-2 text-rose-200">
                          Cancel booking
                        </button>
                      ) : null}
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
      {showInvite ? <InviteModal player={player} onClose={() => setShowInvite(false)} /> : null}
      {showBooking ? <BookingModal player={player} onClose={() => setShowBooking(false)} /> : null}
    </>
  );
};

const PlayerProfile = () => (
  <PlayersProvider>
    <PlayerProfileView />
  </PlayersProvider>
);

export default PlayerProfile;
