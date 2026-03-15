import { usePlayers } from '../../context/PlayersContext';
import PlayerCard from './PlayerCard';

const PlayerGrid = () => {
  const { isLoading, players } = usePlayers();

  if (isLoading) {
    return (
      <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-[360px] animate-pulse rounded-[2rem] border border-white/10 bg-white/5" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
      {players.map((player) => (
        <PlayerCard key={player.id} player={player} />
      ))}
    </div>
  );
};

export default PlayerGrid;
