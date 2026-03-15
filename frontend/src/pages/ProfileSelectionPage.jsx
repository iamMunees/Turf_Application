import ProfileSelector from '../components/ProfileSelector';
import { profiles } from '../data/mockData';

const ProfileSelectionPage = () => {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.12),_transparent_28%),linear-gradient(180deg,_#020617,_#0f172a_60%,_#020617)] px-6 py-10 text-white md:px-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl flex-col justify-center">
        <div className="mb-16 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300/75">Lineup</p>
          <h1 className="mt-5 text-4xl font-semibold md:text-6xl">Choose your profile</h1>
          <p className="mt-4 text-base leading-7 text-slate-300 md:text-lg">
            Start with the experience that fits your role. Each profile unlocks a tailored dashboard for booking, events, social updates, and player discovery.
          </p>
        </div>
        <ProfileSelector profiles={profiles} />
      </div>
    </main>
  );
};

export default ProfileSelectionPage;
