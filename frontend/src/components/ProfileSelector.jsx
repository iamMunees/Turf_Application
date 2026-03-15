import ProfileCard from './ProfileCard';

const ProfileSelector = ({ profiles }) => {
  return (
    <div className="grid gap-10 md:grid-cols-3">
      {profiles.map((profile) => (
        <ProfileCard key={profile.id} profile={profile} />
      ))}
    </div>
  );
};

export default ProfileSelector;
