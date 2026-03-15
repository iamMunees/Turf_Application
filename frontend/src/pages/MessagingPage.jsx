import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import DashboardShell from '../components/DashboardShell';
import {
  createClub,
  ensureArenaXSession,
  getGames,
  getMessages,
  sendMessage,
} from '../lib/arenaxApi';
import { flattenGameGroups } from '../utils/games';

const MessagingPage = () => {
  const [searchParams] = useSearchParams();
  const [session, setSession] = useState(null);
  const [inbox, setInbox] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMode, setSelectedMode] = useState('contact');
  const [selectedTargetId, setSelectedTargetId] = useState('');
  const [composer, setComposer] = useState({ text: '', type: 'direct', gameId: '' });
  const [clubForm, setClubForm] = useState({ name: '', sport: 'Football', description: '' });

  const loadData = async (token) => {
    const [messagesResponse, gamesResponse] = await Promise.all([getMessages(token), getGames()]);
    setInbox(messagesResponse.data.inbox || []);
    setContacts(messagesResponse.data.contacts || []);
    setClubs(messagesResponse.data.clubs || []);
    setGames(flattenGameGroups(gamesResponse.data.groups || []));
  };

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const sessionValue = await ensureArenaXSession();
        setSession(sessionValue);
        await loadData(sessionValue.token);
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  useEffect(() => {
    const targetUserId = searchParams.get('userId') || searchParams.get('inviteUserId');
    if (targetUserId && contacts.some((contact) => contact.id === targetUserId)) {
      setSelectedMode('contact');
      setSelectedTargetId(targetUserId);
    }

    if (searchParams.get('inviteUserId')) {
      setComposer((current) => ({ ...current, type: 'invite' }));
    }
  }, [contacts, searchParams]);

  const visibleMessages = useMemo(() => {
    if (!selectedTargetId) {
      return inbox.slice(0, 12);
    }

    if (selectedMode === 'club') {
      return inbox.filter((message) => message.club?.id === selectedTargetId);
    }

    return inbox.filter(
      (message) =>
        message.sender.id === selectedTargetId || message.recipient?.id === selectedTargetId,
    );
  }, [inbox, selectedMode, selectedTargetId]);

  const handleSend = async (event) => {
    event.preventDefault();
    if (!session?.token || !composer.text.trim()) {
      return;
    }

    const messageType = selectedMode === 'club' && composer.type === 'direct' ? 'club' : composer.type;

    try {
      setError('');
      await sendMessage(
        {
          text: composer.text,
          type: messageType,
          recipientId: selectedMode === 'contact' ? selectedTargetId : null,
          clubId: selectedMode === 'club' ? selectedTargetId : null,
          gameId: messageType === 'invite' ? composer.gameId : null,
        },
        session.token,
      );
      setComposer((current) => ({ ...current, text: '' }));
      await loadData(session.token);
    } catch (sendError) {
      setError(sendError.message);
    }
  };

  const handleCreateClub = async (event) => {
    event.preventDefault();
    if (!session?.token) {
      return;
    }

    try {
      setError('');
      await createClub(clubForm, session.token);
      setClubForm({ name: '', sport: 'Football', description: '' });
      await loadData(session.token);
    } catch (clubError) {
      setError(clubError.message);
    }
  };

  return (
    <DashboardShell
      title="Inbox for players, clubs, and game invites"
      description="Chat one-to-one, create sport clubs, and send direct game invites from a dedicated ArenaX communication hub."
    >
      {error ? (
        <div className="mb-5 rounded-[1.5rem] border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
          {error}
        </div>
      ) : null}

      {isLoading ? (
        <div className="rounded-[2rem] border border-white/10 bg-slate-950/55 px-6 py-20 text-center text-slate-300">
          Loading inbox...
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="space-y-6">
            <section className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Contacts</p>
              <div className="mt-4 space-y-3">
                {contacts.map((contact) => (
                  <button
                    key={contact.id}
                    type="button"
                    onClick={() => {
                      setSelectedMode('contact');
                      setSelectedTargetId(contact.id);
                    }}
                    className={`flex w-full items-center gap-3 rounded-[1.3rem] border px-3 py-3 text-left transition ${
                      selectedMode === 'contact' && selectedTargetId === contact.id
                        ? 'border-cyan-300/30 bg-cyan-300/10'
                        : 'border-white/10 bg-white/[0.04]'
                    }`}
                  >
                    <img src={contact.avatarUrl} alt={contact.name} className="h-11 w-11 rounded-2xl object-cover" />
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-white">{contact.name}</p>
                      <p className="text-sm text-slate-400">
                        {contact.skillLevel} • {contact.playingPosition}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Clubs</p>
              <div className="mt-4 space-y-3">
                {clubs.map((club) => (
                  <button
                    key={club.id}
                    type="button"
                    onClick={() => {
                      setSelectedMode('club');
                      setSelectedTargetId(club.id);
                    }}
                    className={`flex w-full items-center justify-between rounded-[1.3rem] border px-3 py-3 text-left transition ${
                      selectedMode === 'club' && selectedTargetId === club.id
                        ? 'border-amber-300/30 bg-amber-300/10'
                        : 'border-white/10 bg-white/[0.04]'
                    }`}
                  >
                    <div>
                      <p className="font-semibold text-white">{club.name}</p>
                      <p className="text-sm text-slate-400">
                        {club.sport} • {club.memberCount} members
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Create club</p>
              <form onSubmit={handleCreateClub} className="mt-4 space-y-3">
                <input
                  value={clubForm.name}
                  onChange={(event) => setClubForm((current) => ({ ...current, name: event.target.value }))}
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none"
                  placeholder="Club name"
                />
                <select
                  value={clubForm.sport}
                  onChange={(event) => setClubForm((current) => ({ ...current, sport: event.target.value }))}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none"
                >
                  <option>Football</option>
                  <option>Badminton</option>
                  <option>Cricket</option>
                </select>
                <textarea
                  value={clubForm.description}
                  onChange={(event) =>
                    setClubForm((current) => ({ ...current, description: event.target.value }))
                  }
                  rows={3}
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none"
                  placeholder="Short club description"
                />
                <button type="submit" className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-950">
                  Create club
                </button>
              </form>
            </section>
          </aside>

          <section className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-6">
            <div className="flex flex-col gap-3 border-b border-white/10 pb-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Conversation</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  {selectedTargetId ? 'Focused thread' : 'Recent activity'}
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setComposer((current) => ({ ...current, type: 'direct' }))}
                  className={`rounded-full px-4 py-2 text-sm ${
                    composer.type === 'direct' ? 'bg-cyan-300 text-slate-950' : 'border border-white/10 bg-white/5 text-slate-300'
                  }`}
                >
                  Direct
                </button>
                <button
                  type="button"
                  onClick={() => setComposer((current) => ({ ...current, type: 'invite' }))}
                  className={`rounded-full px-4 py-2 text-sm ${
                    composer.type === 'invite' ? 'bg-amber-300 text-slate-950' : 'border border-white/10 bg-white/5 text-slate-300'
                  }`}
                >
                  Game invite
                </button>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {visibleMessages.length ? (
                visibleMessages.map((message) => (
                  <article key={message.id} className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-white">{message.sender.name}</p>
                        <p className="text-sm text-slate-400">
                          {message.type === 'invite' && message.game
                            ? `Invite for ${message.game.title}`
                            : message.club
                              ? `${message.club.name} club`
                              : 'Direct message'}
                        </p>
                      </div>
                      <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                        {new Date(message.createdAt).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-200">{message.text}</p>
                  </article>
                ))
              ) : (
                <div className="rounded-[1.6rem] border border-dashed border-white/10 px-4 py-16 text-center text-sm text-slate-400">
                  No messages in this thread yet.
                </div>
              )}
            </div>

            <form onSubmit={handleSend} className="mt-6 space-y-3 border-t border-white/10 pt-5">
              {composer.type === 'invite' ? (
                <select
                  value={composer.gameId}
                  onChange={(event) => setComposer((current) => ({ ...current, gameId: event.target.value }))}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none"
                >
                  <option value="">Select game to invite for</option>
                  {games.map((game) => (
                    <option key={game.id} value={game.id}>
                      {game.title} • {game.sport} • {game.startTime}
                    </option>
                  ))}
                </select>
              ) : null}
              <textarea
                value={composer.text}
                onChange={(event) => setComposer((current) => ({ ...current, text: event.target.value }))}
                rows={4}
                className="w-full rounded-[1.6rem] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none"
                placeholder={
                  composer.type === 'invite'
                    ? 'Write the invite note for this player or club'
                    : 'Write a message to the selected player or club'
                }
              />
              <button
                type="submit"
                disabled={!selectedTargetId || (composer.type === 'invite' && !composer.gameId)}
                className="rounded-full bg-[linear-gradient(135deg,_#22d3ee,_#2563eb)] px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Send message
              </button>
            </form>
          </section>
        </div>
      )}
    </DashboardShell>
  );
};

export default MessagingPage;
