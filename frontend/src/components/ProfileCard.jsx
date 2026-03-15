import { Link } from 'react-router-dom';

const ProfileCard = ({ profile }) => {
  return (
    <Link
      to={`/dashboard/${profile.id}`}
      className="group flex flex-col items-center gap-5 text-center"
    >
      <div
        className={`flex h-36 w-36 items-center justify-center rounded-full bg-gradient-to-br ${profile.accent} p-[1px] shadow-[0_20px_80px_rgba(6,182,212,0.18)] transition duration-300 group-hover:scale-105`}
      >
        <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-950/90 text-2xl font-semibold tracking-wide text-white">
          {profile.name.charAt(0)}
        </div>
      </div>
      <div className="space-y-1">
        <h3 className="text-xl font-medium text-white">{profile.name}</h3>
        <p className="max-w-44 text-sm text-slate-400">{profile.tagline}</p>
      </div>
    </Link>
  );
};

export default ProfileCard;
