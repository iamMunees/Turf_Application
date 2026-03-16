import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardShell from '../../components/DashboardShell';
import GameDetails from '../../components/games/GameDetails';
import {
  addGameComment,
  ensureArenaXSession,
  getGameDetails,
  joinGame,
  togglePlayerFollow,
} from '../../lib/arenaxApi';

const GameDetailsPage = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [game, setGame] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [joining, setJoining] = useState(false);
  const [followBusyId, setFollowBusyId] = useState('');
  const [pendingCommentId, setPendingCommentId] = useState('');

  const loadGame = useCallback(async (token) => {
    const response = await getGameDetails(gameId, token);
    setGame(response.data.game);
  }, [gameId]);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        setError('');
        const sessionValue = await ensureArenaXSession();
        setSession(sessionValue);
        await loadGame(sessionValue.token);
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [loadGame]);

  const handleJoin = async () => {
    if (!session?.token || !game) {
      return;
    }

    try {
      setJoining(true);
      setError('');
      await joinGame(
        {
          gameId: game.id,
          paymentMethod: 'upi',
        },
        session.token,
      );
      await loadGame(session.token);
    } catch (joinError) {
      setError(joinError.message);
    } finally {
      setJoining(false);
    }
  };

  const updateFollowState = (targetId) => (node) => {
    if (!node) {
      return node;
    }

    const toggle = (player) => (player.id === targetId ? { ...player, following: !player.following } : player);

    return {
      ...node,
      host: toggle(node.host),
      players: node.players.map((entry) => ({
        ...entry,
        user: toggle(entry.user),
      })),
      comments: node.comments,
    };
  };

  const handleToggleFollow = async (playerId) => {
    if (!session?.token) {
      return;
    }

    try {
      setFollowBusyId(playerId);
      await togglePlayerFollow(playerId, session.token);
      setGame((current) => updateFollowState(playerId)(current));
    } catch (followError) {
      setError(followError.message);
    } finally {
      setFollowBusyId('');
    }
  };

  const handleSubmitComment = async (text, parentCommentId) => {
    if (!session?.token || !game) {
      return;
    }

    const marker = parentCommentId || 'root';

    try {
      setPendingCommentId(marker);
      await addGameComment(
        {
          gameId: game.id,
          text,
          parentCommentId,
        },
        session.token,
      );
      await loadGame(session.token);
    } catch (commentError) {
      setError(commentError.message);
    } finally {
      setPendingCommentId('');
    }
  };

  return (
    <DashboardShell
      title="Game room"
      description="Inspect lineup depth, venue details, host profile, and the live match chat before taking the final slot."
    >
      <div className="space-y-5">
        <button
          type="button"
          onClick={() => navigate('/dashboard/games')}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:border-cyan-300/30 hover:text-white"
        >
          Back to games
        </button>

        {isLoading ? (
          <div className="rounded-[2rem] border border-white/10 bg-slate-950/55 px-6 py-20 text-center text-slate-300">
            Loading game details...
          </div>
        ) : error && !game ? (
          <div className="rounded-[2rem] border border-rose-400/20 bg-rose-500/10 px-6 py-12 text-center text-rose-100">
            {error}
          </div>
        ) : game ? (
          <>
            {error ? (
              <div className="rounded-[1.5rem] border border-amber-300/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
                {error}
              </div>
            ) : null}
            <GameDetails
              game={game}
              onJoin={handleJoin}
              joining={joining}
              onToggleFollow={handleToggleFollow}
              followBusyId={followBusyId}
              onSubmitComment={handleSubmitComment}
              pendingCommentId={pendingCommentId}
            />
          </>
        ) : null}
      </div>
    </DashboardShell>
  );
};

export default GameDetailsPage;

