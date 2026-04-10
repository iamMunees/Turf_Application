import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import DashboardShell from '../components/DashboardShell';
import EditProfile from '../components/profile/EditProfile';
import FollowButton from '../components/profile/FollowButton';
import UserAvatar from '../components/profile/UserAvatar';
import UserStats from '../components/profile/UserStats';
import { useAuth } from '../context/AuthContext';
import {
  ensureArenaXSession,
  getCurrentUserProfile,
  getUserProfile,
  toggleUserFollow,
  updateUserProfile,
} from '../lib/arenaxApi';

const ProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { updateSession } = useAuth();
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [followBusy, setFollowBusy] = useState(false);

  const isOwnProfile = !userId || userId === session?.user?.id;

  const loadProfile = useCallback(async (token, sessionValue) => {
    const response = userId ? await getUserProfile(userId, token) : await getCurrentUserProfile(token);
    setProfile(response.data.user);

    if (!userId && sessionValue) {
      const nextSession = {
        ...sessionValue,
        user: {
          ...sessionValue.user,
          ...response.data.user,
        },
      };
      setSession(nextSession);
      updateSession(nextSession);
    }
  }, [updateSession, userId]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const sessionValue = await ensureArenaXSession();
        setSession(sessionValue);
        await loadProfile(sessionValue.token, sessionValue);
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [loadProfile]);

  const handleSave = async (payload) => {
    if (!session?.token) {
      return;
    }

    try {
      setSaving(true);
      const response = await updateUserProfile(payload, session.token);
      const updatedUser = response.data.user;
      setProfile(updatedUser);
      const nextSession = {
        ...session,
        user: {
          ...session.user,
          ...updatedUser,
        },
      };
      setSession(nextSession);
      updateSession(nextSession);
      setEditing(false);
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleFollow = async () => {
    if (!session?.token || !profile) {
      return;
    }

    try {
      setFollowBusy(true);
      const response = await toggleUserFollow(profile.id, session.token);
      setProfile(response.data.user);
    } catch (followError) {
      setError(followError.message);
    } finally {
      setFollowBusy(false);
    }
  };

  return (
    <DashboardShell
      title="ArenaX profile"
      description="One profile system across games, bookings, events, players, messages, and the social feed."
    >
      {error ? (
        <div className="mb-5 rounded-[1.5rem] border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-[2rem] border border-white/10 bg-slate-950/55 px-6 py-20 text-center text-slate-300">
          Loading profile...
        </div>
      ) : profile ? (
        <div className="space-y-6">
          <section className="rounded-[2rem] border border-white/10 bg-[linear-gradient(125deg,_rgba(8,47,73,0.85),_rgba(15,23,42,0.96)_45%,_rgba(120,53,15,0.76))] p-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex flex-col gap-5 md:flex-row md:items-center">
                <UserAvatar user={profile} size="xl" />
                <div>
                  <p className="text-xs uppercase tracking-[0.32em] text-cyan-200/80">Profile overview</p>
                  <h1 className="mt-3 text-3xl font-semibold text-white md:text-5xl">{profile.fullName}</h1>
                  <p className="mt-2 text-lg text-slate-200">@{profile.username}</p>
                  <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-200">{profile.bio}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {isOwnProfile ? (
                  <button
                    type="button"
                    onClick={() => setEditing(true)}
                    className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950"
                  >
                    Edit profile
                  </button>
                ) : (
                  <>
                    <FollowButton isFollowing={profile.isFollowing} onClick={handleToggleFollow} disabled={followBusy} />
                    <button
                      type="button"
                      onClick={() => navigate(`/dashboard/messages?userId=${profile.id}`)}
                      className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white"
                    >
                      Message
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate(`/dashboard/messages?inviteUserId=${profile.id}`)}
                      className="rounded-full border border-amber-300/30 bg-amber-300/10 px-5 py-3 text-sm font-semibold text-amber-100"
                    >
                      Invite to game
                    </button>
                  </>
                )}
              </div>
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-6">
              <section className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-6">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Sports info</p>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <article className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4">
                    <p className="text-sm text-slate-400">Email</p>
                    <p className="mt-2 text-lg font-semibold text-white">{profile.email}</p>
                  </article>
                  <article className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4">
                    <p className="text-sm text-slate-400">Phone</p>
                    <p className="mt-2 text-lg font-semibold text-white">{profile.phone || 'Not added'}</p>
                  </article>
                  <article className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4">
                    <p className="text-sm text-slate-400">City</p>
                    <p className="mt-2 text-lg font-semibold text-white">{profile.city || 'Not added'}</p>
                  </article>
                  <article className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4">
                    <p className="text-sm text-slate-400">Preferred position</p>
                    <p className="mt-2 text-lg font-semibold text-white">{profile.playingPosition}</p>
                  </article>
                  <article className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4">
                    <p className="text-sm text-slate-400">Skill level</p>
                    <p className="mt-2 text-lg font-semibold text-white">{profile.skillLevel}</p>
                  </article>
                  <article className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4">
                    <p className="text-sm text-slate-400">Followers</p>
                    <p className="mt-2 text-lg font-semibold text-white">{profile.followersCount}</p>
                  </article>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {profile.sportsInterests.length ? (
                    profile.sportsInterests.map((sport) => (
                      <span key={sport} className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100">
                        {sport}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-slate-400">No sports interests added</span>
                  )}
                </div>
              </section>

              <section className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-6">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Activity stats</p>
                <div className="mt-5">
                  <UserStats stats={profile.stats} />
                </div>
              </section>
            </div>

            <section className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-6">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Recent activity</p>
              <div className="mt-5 space-y-3">
                {profile.recentActivity.length ? (
                  profile.recentActivity.map((activity, index) => (
                    <article key={`${activity.type}-${index}`} className="rounded-[1.4rem] border border-white/10 bg-white/[0.04] p-4">
                      <p className="font-semibold text-white">{activity.title}</p>
                      <p className="mt-1 text-sm text-slate-400">{activity.subtitle}</p>
                      <p className="mt-2 text-xs uppercase tracking-[0.22em] text-cyan-200/75">
                        {new Date(activity.occurredAt).toLocaleDateString('en-IN')}
                      </p>
                    </article>
                  ))
                ) : (
                  <p className="text-sm text-slate-400">No recent activity yet.</p>
                )}
              </div>

              {!isOwnProfile ? (
                <div className="mt-6 rounded-[1.6rem] border border-white/10 bg-white/[0.04] p-4 text-sm text-slate-300">
                  <p>Games played: {profile.stats.gamesJoined}</p>
                  <p className="mt-2">Following: {profile.followingCount}</p>
                  <Link to="/dashboard/games" className="mt-4 inline-flex text-cyan-200">
                    Browse games
                  </Link>
                </div>
              ) : null}
            </section>
          </section>
        </div>
      ) : null}

      {editing && profile ? (
        <EditProfile user={profile} onClose={() => setEditing(false)} onSave={handleSave} saving={saving} />
      ) : null}
    </DashboardShell>
  );
};

export default ProfilePage;

