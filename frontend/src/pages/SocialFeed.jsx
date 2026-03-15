import SocialFeed from '../components/social/SocialFeed';
import { SocialFeedProvider } from '../context/SocialFeedContext';

const SocialFeedPage = () => {
  return (
    <SocialFeedProvider>
      <SocialFeed />
    </SocialFeedProvider>
  );
};

export default SocialFeedPage;
