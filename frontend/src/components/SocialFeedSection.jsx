import { feedPosts } from '../data/mockData';
import FeedComposer from './FeedComposer';
import FeedPostCard from './FeedPostCard';
import SectionHeader from './SectionHeader';

const SocialFeedSection = () => {
  return (
    <section className="space-y-8">
      <SectionHeader
        eyebrow="Social Feed"
        title="Instagram-style sports storytelling"
        description="Creators, players, and organizers can post reels, match photos, and behind-the-scenes highlights."
      />
      <FeedComposer />
      <div className="grid gap-5 lg:grid-cols-2">
        {feedPosts.map((post) => (
          <FeedPostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
};

export default SocialFeedSection;
