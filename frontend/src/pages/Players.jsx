import { PlayersProvider } from '../context/PlayersContext';
import PlayersDiscoveryPage from './players/PlayersDiscoveryPage';

const Players = () => {
  return (
    <PlayersProvider>
      <PlayersDiscoveryPage />
    </PlayersProvider>
  );
};

export default Players;
