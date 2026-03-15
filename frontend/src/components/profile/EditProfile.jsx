import { useState } from 'react';

const SPORTS = ['Football', 'Cricket', 'Badminton', 'Tennis', 'Basketball', 'Volleyball', 'Pickleball'];
const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Pro'];

const EditProfile = ({ user, onClose, onSave, saving }) => {
  const [form, setForm] = useState({
    fullName: user.fullName || '',
    username: user.username || '',
    phone: user.phone || '',
    city: user.city || '',
    favoriteSports: user.sportsInterests || [],
    skillLevel: user.skillLevel || 'Intermediate',
    playingPosition: user.playingPosition || '',
    bio: user.bio || '',
    avatarUrl: user.avatarUrl || '',
  });

  const toggleSport = (sport) => {
    setForm((current) => ({
      ...current,
      favoriteSports: current.favoriteSports.includes(sport)
        ? current.favoriteSports.filter((item) => item !== sport)
        : [...current.favoriteSports, sport],
    }));
  };

  const handleFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setForm((current) => ({
        ...current,
        avatarUrl: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const submit = async (event) => {
    event.preventDefault();
    await onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/70 px-4 py-6 backdrop-blur">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-auto rounded-[2rem] border border-white/10 bg-slate-950 p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/80">Profile editor</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Update your ArenaX profile</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-full border border-white/10 px-4 py-2 text-sm text-white">
            Close
          </button>
        </div>

        <form onSubmit={submit} className="mt-6 space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <input
              value={form.fullName}
              onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))}
              className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none"
              placeholder="Full name"
            />
            <input
              value={form.username}
              onChange={(event) => setForm((current) => ({ ...current, username: event.target.value.toLowerCase() }))}
              className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none"
              placeholder="Username"
            />
            <input
              value={form.phone}
              onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
              className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none"
              placeholder="Phone"
            />
            <input
              value={form.city}
              onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))}
              className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none"
              placeholder="City"
            />
            <select
              value={form.skillLevel}
              onChange={(event) => setForm((current) => ({ ...current, skillLevel: event.target.value }))}
              className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"
            >
              {SKILL_LEVELS.map((level) => (
                <option key={level}>{level}</option>
              ))}
            </select>
            <input
              value={form.playingPosition}
              onChange={(event) => setForm((current) => ({ ...current, playingPosition: event.target.value }))}
              className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none"
              placeholder="Preferred position"
            />
          </div>

          <textarea
            value={form.bio}
            onChange={(event) => setForm((current) => ({ ...current, bio: event.target.value }))}
            rows={4}
            className="w-full rounded-[1.6rem] border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none"
            placeholder="Short bio"
          />

          <div className="space-y-3">
            <p className="text-sm font-semibold text-white">Sports interests</p>
            <div className="flex flex-wrap gap-2">
              {SPORTS.map((sport) => (
                <button
                  key={sport}
                  type="button"
                  onClick={() => toggleSport(sport)}
                  className={`rounded-full px-4 py-2 text-sm ${
                    form.favoriteSports.includes(sport)
                      ? 'bg-cyan-300 text-slate-950'
                      : 'border border-white/10 bg-white/[0.04] text-slate-300'
                  }`}
                >
                  {sport}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <input
              value={form.avatarUrl}
              onChange={(event) => setForm((current) => ({ ...current, avatarUrl: event.target.value }))}
              className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none"
              placeholder="Avatar image URL"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-300 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-[linear-gradient(135deg,_#22d3ee,_#2563eb)] px-6 py-3 text-sm font-semibold text-white"
          >
            {saving ? 'Saving...' : 'Save profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
