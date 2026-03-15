import { usePlayers } from '../../context/PlayersContext';

const FollowButton = ({ playerId, isFollowing }) => {
  const { toggleFollow } = usePlayers();

  return (
    <button
      type="button"
      onClick={() => toggleFollow(playerId)}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
        isFollowing ? 'border border-white/10 bg-white/5 text-white' : 'bg-white text-slate-950'
      }`}
    >
      {isFollowing ? 'Following' : 'Follow'}
    </button>
  );
};

export default FollowButton;
