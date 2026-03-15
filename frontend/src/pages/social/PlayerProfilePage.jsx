import { Link, useParams } from 'react-router-dom';
import PostCard from '../../components/social/PostCard';
import PlayerBadge from '../../components/social/PlayerBadge';
import { SocialFeedProvider, useSocialFeed } from '../../context/SocialFeedContext';

const PlayerProfileView = () => {
  const { profileId } = useParams();
  const { getProfileById } = useSocialFeed();
  const profile = getProfileById(profileId);

  if (!profile) {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-6 text-white">
        <div className="mx-auto max-w-5xl rounded-[2rem] border border-white/10 bg-slate-950/60 p-8 text-center">
          Profile not found.
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_24%),linear-gradient(180deg,_#020617,_#091221_38%,_#020617)] px-4 py-6 text-white md:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <Link className="text-sm text-cyan-200" to="/dashboard/social-feed">
          Back to social feed
        </Link>

        <section className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div className="flex items-start gap-4">
              <div className="grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-cyan-300 to-amber-300 text-2xl font-bold text-slate-950">
                {profile.avatar}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-3xl font-semibold text-white">{profile.name}</h1>
                  <PlayerBadge label={profile.level} tone={profile.level} />
                  {profile.badgeState.verifiedPlayer ? <PlayerBadge label="Verified Player" tone="verified" /> : null}
                  {profile.badgeState.risingStar ? <PlayerBadge label="Rising Star" tone="rising" /> : null}
                </div>
                <p className="mt-2 text-sm text-slate-300">
                  {profile.sport} | {profile.city} | {profile.playerType}
                </p>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">{profile.bio}</p>
              </div>
            </div>
            {profile.badgeState.verifiedPlayer ? (
              <button className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950">
                Contact Coach
              </button>
            ) : null}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-slate-400">Total posts</p>
            <p className="mt-3 text-3xl font-semibold text-white">{profile.totalPosts}</p>
          </div>
          <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-slate-400">Events registered</p>
            <p className="mt-3 text-3xl font-semibold text-white">{profile.registeredEvents}</p>
          </div>
          <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-slate-400">Followers</p>
            <p className="mt-3 text-3xl font-semibold text-white">{profile.followers}</p>
          </div>
          <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-slate-400">Avg likes / scout views</p>
            <p className="mt-3 text-3xl font-semibold text-white">
              {profile.averageLikes} / {profile.scoutViewPosts}
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.32em] text-cyan-200/75">Posts</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Recent highlights</h2>
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            {profile.posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};

const PlayerProfilePage = () => (
  <SocialFeedProvider>
    <PlayerProfileView />
  </SocialFeedProvider>
);

export default PlayerProfilePage;
