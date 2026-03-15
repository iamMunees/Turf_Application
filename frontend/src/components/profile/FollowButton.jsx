const FollowButton = ({ isFollowing, onClick, disabled = false }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
      isFollowing
        ? 'border border-white/10 bg-white/5 text-white'
        : 'bg-cyan-300 text-slate-950 hover:bg-cyan-200'
    } ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
  >
    {isFollowing ? 'Following' : 'Follow'}
  </button>
);

export default FollowButton;
