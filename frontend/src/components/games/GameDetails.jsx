import CommentsSection from './CommentsSection';
import JoinGameButton from './JoinGameButton';
import PlayerCard from './PlayerCard';
import ProgressBar from './ProgressBar';
import { formatDistance, formatGameDateLong } from '../../utils/games';

const DetailItem = ({ label, value }) => (
  <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.04] p-4">
    <p className="text-xs uppercase tracking-[0.25em] text-slate-500">{label}</p>
    <p className="mt-2 text-lg font-semibold text-white">{value}</p>
  </div>
);

const GameDetails = ({
  game,
  onJoin,
  joining,
  onToggleFollow,
  followBusyId,
  onSubmitComment,
  pendingCommentId,
}) => (
  <div className="space-y-6">
    <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/70">
      <div className="relative h-[280px] sm:h-[360px]">
        <img
          src={game.venue?.imageUrl || game.imageUrl}
          alt={game.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.12),rgba(2,6,23,0.92))]" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-3 text-sm text-cyan-200">
            <span className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1">{game.sport}</span>
            <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1">{game.format}</span>
            <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1">{game.visibility}</span>
          </div>
          <h1 className="mt-4 text-3xl font-semibold text-white md:text-5xl">{game.title}</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">{game.notes}</p>
        </div>
      </div>

      <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-4">
        <DetailItem label="Date" value={formatGameDateLong(game.date)} />
        <DetailItem label="Time" value={`${game.startTime} - ${game.endTime}`} />
        <DetailItem label="Capacity" value={`${game.currentPlayers} / ${game.maxPlayers} players`} />
        <DetailItem label="Price" value={`₹${game.pricePerPlayer} per player`} />
      </div>

      <div className="px-6 pb-6">
        <ProgressBar currentPlayers={game.currentPlayers} maxPlayers={game.maxPlayers} accent="from-cyan-400 via-blue-500 to-amber-400" />
      </div>
    </section>

    <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_380px]">
      <div className="space-y-6">
        <section className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-6">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Venue</p>
          <div className="mt-4 flex flex-col gap-5 md:flex-row">
            <img
              src={game.venue?.imageUrl || game.imageUrl}
              alt={game.venue?.name}
              className="h-48 w-full rounded-[1.6rem] object-cover md:w-72"
            />
            <div className="flex-1 space-y-3">
              <h2 className="text-2xl font-semibold text-white">{game.venue?.name}</h2>
              <p className="text-slate-300">{game.venue?.address}</p>
              <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-cyan-200">
                {formatDistance(game.venue?.distanceKm || game.distanceKm)}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Players</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Joined squad</h2>
            </div>
            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
              {game.players.length} visible
            </div>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {game.players.map((entry) => (
              <PlayerCard
                key={entry.id}
                player={entry.user}
                onToggleFollow={onToggleFollow}
                isBusy={followBusyId === entry.user.id}
                compact
              />
            ))}
          </div>
        </section>

        <CommentsSection
          comments={game.comments}
          onSubmitComment={onSubmitComment}
          pendingCommentId={pendingCommentId}
        />
      </div>

      <aside className="space-y-6">
        <section className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-6">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Hosted by</p>
          <div className="mt-5">
            <PlayerCard
              player={game.host}
              onToggleFollow={onToggleFollow}
              isBusy={followBusyId === game.host.id}
            />
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-[linear-gradient(160deg,_rgba(34,211,238,0.14),_rgba(245,158,11,0.12))] p-6">
          <p className="text-xs uppercase tracking-[0.28em] text-amber-100/75">Join game</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">Secure your slot</h2>
          <p className="mt-3 text-sm leading-6 text-slate-200">
            Capacity is checked before payment, then your name is added to the lineup immediately.
          </p>
          <div className="mt-5">
            <JoinGameButton
              currentPlayers={game.currentPlayers}
              maxPlayers={game.maxPlayers}
              pricePerPlayer={game.pricePerPlayer}
              loading={joining}
              onClick={onJoin}
            />
          </div>
        </section>
      </aside>
    </section>
  </div>
);

export default GameDetails;
