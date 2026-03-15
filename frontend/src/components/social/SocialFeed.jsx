import FilterBar from './FilterBar';
import PostCard from './PostCard';
import PostCreator from './PostCreator';
import { useSocialFeed } from '../../context/SocialFeedContext';

const SocialFeed = () => {
  const { posts, isLoading } = useSocialFeed();

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(251,191,36,0.14),_transparent_26%),linear-gradient(180deg,_#020617,_#091221_38%,_#020617)] px-4 py-5 text-white md:px-6 lg:px-8">
      <div className="mx-auto max-w-[1480px] space-y-6">
        <section className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-5">
          <p className="text-[11px] uppercase tracking-[0.35em] text-cyan-200/80">Talent Feed</p>
          <h1 className="mt-3 text-3xl font-semibold text-white md:text-4xl">Social feed for athletes, scouts, coaches, and fans</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
            Discover clips, match photos, and standout performances with scout-first filtering, player-type labels, and profile badges.
          </p>
        </section>

        <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          <div className="space-y-6">
            <FilterBar />
          </div>

          <div className="space-y-6">
            <PostCreator />
            {isLoading ? (
              <div className="grid gap-5 xl:grid-cols-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="h-[520px] animate-pulse rounded-[2rem] border border-white/10 bg-white/5" />
                ))}
              </div>
            ) : (
              <div className="grid gap-5 xl:grid-cols-2 2xl:grid-cols-3">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default SocialFeed;
