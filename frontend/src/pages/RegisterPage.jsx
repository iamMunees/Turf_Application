import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const roleOptions = ['player', 'organizer'];

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, isAuthLoading } = useAuth();
  const [form, setForm] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    city: '',
    role: 'player',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      await register({
        ...form,
        favoriteSports: [],
      });
      navigate('/dashboard', { replace: true });
    } catch (registerError) {
      setError(registerError.message);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.16),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(34,211,238,0.18),_transparent_28%),linear-gradient(180deg,_#020617,_#0f172a_48%,_#020617)] px-4 py-8 text-white md:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-[2.25rem] border border-white/10 bg-slate-950/75 p-8 shadow-[0_24px_80px_rgba(2,6,23,0.32)] md:p-10">
          <p className="text-xs uppercase tracking-[0.3em] text-amber-300/80">Create Account</p>
          <h1 className="mt-4 text-3xl font-semibold text-white">Start your ArenaX profile</h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Build one account for booking, games, events, messaging, and the player network.
          </p>

          {error ? (
            <div className="mt-6 rounded-[1.35rem] border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
              {error}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="mt-8 grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm text-slate-300 md:col-span-2">
              <span>Full name</span>
              <input
                value={form.fullName}
                onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))}
                className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none placeholder:text-slate-500"
                placeholder="Aarav Kumar"
                required
              />
            </label>
            <label className="space-y-2 text-sm text-slate-300">
              <span>Username</span>
              <input
                value={form.username}
                onChange={(event) => setForm((current) => ({ ...current, username: event.target.value }))}
                className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none placeholder:text-slate-500"
                placeholder="aaravk"
              />
            </label>
            <label className="space-y-2 text-sm text-slate-300">
              <span>City</span>
              <input
                value={form.city}
                onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))}
                className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none placeholder:text-slate-500"
                placeholder="Chennai"
              />
            </label>
            <label className="space-y-2 text-sm text-slate-300 md:col-span-2">
              <span>Email</span>
              <input
                type="email"
                value={form.email}
                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none placeholder:text-slate-500"
                placeholder="you@example.com"
                required
              />
            </label>
            <label className="space-y-2 text-sm text-slate-300">
              <span>Password</span>
              <input
                type="password"
                value={form.password}
                onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none placeholder:text-slate-500"
                placeholder="Choose a password"
                required
              />
            </label>
            <label className="space-y-2 text-sm text-slate-300">
              <span>Role</span>
              <select
                value={form.role}
                onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))}
                className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none"
              >
                {roleOptions.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="submit"
              disabled={isAuthLoading}
              className="mt-2 md:col-span-2 w-full rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isAuthLoading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="mt-8 text-sm text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-cyan-200">
              Log in
            </Link>
          </p>
        </section>

        <section className="rounded-[2.25rem] border border-white/10 bg-[linear-gradient(145deg,_rgba(120,53,15,0.72),_rgba(15,23,42,0.96)_44%,_rgba(8,47,73,0.85))] p-8 md:p-10">
          <p className="text-xs uppercase tracking-[0.35em] text-amber-200/80">Why Sign Up</p>
          <h2 className="mt-5 max-w-xl text-4xl font-semibold leading-tight md:text-5xl">
            One identity across bookings, players, games, and events.
          </h2>
          <div className="mt-10 space-y-4">
            {[
              ['Track bookings', 'Keep your slot history, payments, and venue activity in one place.'],
              ['Build your profile', 'Show sports interests, skill level, and your recent ArenaX activity.'],
              ['Join the network', 'Follow players, message contacts, and accept game invites.'],
            ].map(([title, text]) => (
              <article key={title} className="rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-5">
                <p className="text-lg font-semibold text-white">{title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-200">{text}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};

export default RegisterPage;
