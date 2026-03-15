const UserAvatar = ({ user, size = 'lg' }) => {
  const sizes = {
    sm: 'h-10 w-10 text-sm',
    md: 'h-16 w-16 text-lg',
    lg: 'h-24 w-24 text-2xl',
    xl: 'h-32 w-32 text-4xl',
  };

  return (
    <div
      className={`overflow-hidden rounded-full border border-white/10 bg-[linear-gradient(135deg,_rgba(34,211,238,0.24),_rgba(245,158,11,0.24))] ${sizes[size]}`}
    >
      <img
        src={user?.avatarUrl || 'https://placehold.co/256x256/0f172a/e2e8f0?text=A'}
        alt={user?.fullName || user?.name || 'ArenaX user'}
        className="h-full w-full object-cover"
      />
    </div>
  );
};

export default UserAvatar;
