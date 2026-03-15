const JoinGameButton = ({ disabled, loading, onClick, currentPlayers, maxPlayers, pricePerPlayer }) => {
  const isFull = currentPlayers >= maxPlayers;

  return (
    <button
      type="button"
      disabled={disabled || loading || isFull}
      onClick={onClick}
      className={`w-full rounded-[1.4rem] px-5 py-4 text-sm font-semibold transition ${
        disabled || loading || isFull
          ? 'cursor-not-allowed border border-white/10 bg-white/5 text-slate-400'
          : 'bg-[linear-gradient(135deg,_#22d3ee,_#2563eb_52%,_#f59e0b)] text-slate-950 shadow-[0_16px_40px_rgba(37,99,235,0.35)] hover:-translate-y-0.5'
      }`}
    >
      {loading
        ? 'Processing payment...'
        : isFull
          ? 'Game Full'
          : `Pay & Join • ₹${pricePerPlayer}`}
    </button>
  );
};

export default JoinGameButton;
