import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, continueWithDemo, isAuthLoading } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const destination = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      await login(form);
      navigate(destination, { replace: true });
    } catch (loginError) {
      setError(loginError.message);
    }
  };

  const handleDemoLogin = async () => {
    setError('');

    try {
      await continueWithDemo();
      navigate(destination, { replace: true });
    } catch (demoError) {
      setError(demoError.message);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_26%),radial-gradient(circle_at_bottom_right,_rgba(251,191,36,0.16),_transparent_24%),linear-gradient(180deg,_#020617,_#0f172a_48%,_#020617)] px-4 py-8 text-white md:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[2.25rem] border border-white/10 bg-[linear-gradient(145deg,_rgba(8,47,73,0.88),_rgba(15,23,42,0.96)_44%,_rgba(120,53,15,0.72))] p-8 md:p-10">
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/80">ArenaX Access</p>
          <h1 className="mt-5 max-w-xl text-4xl font-semibold leading-tight md:text-6xl">
            Log in and pick up your sports flow where you left it.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-200">
            Book slots, manage bookings, join games, message players, and keep one profile across every ArenaX module.
          </p>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              ['Bookings', 'Secure your next venue slot in a few taps.'],
              ['Players', 'Discover and connect with nearby athletes.'],
              ['Messages', 'Send invites and manage club conversations.'],
            ].map(([title, text]) => (
              <article key={title} className="rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-4">
                <p className="text-sm font-semibold text-white">{title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[2.25rem] border border-white/10 bg-slate-950/75 p-8 shadow-[0_24px_80px_rgba(2,6,23,0.32)] md:p-10">
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/80">Sign In</p>
          <h2 className="mt-4 text-3xl font-semibold text-white">Welcome back</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Use your ArenaX account, or jump in with the seeded demo player.
          </p>

          {error ? (
            <div className="mt-6 rounded-[1.35rem] border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
              {error}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <label className="block space-y-2 text-sm text-slate-300">
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
            <label className="block space-y-2 text-sm text-slate-300">
              <span>Password</span>
              <input
                type="password"
                value={form.password}
                onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none placeholder:text-slate-500"
                placeholder="Enter your password"
                required
              />
            </label>
            <button
              type="submit"
              disabled={isAuthLoading}
              className="w-full rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isAuthLoading ? 'Signing in...' : 'Log in'}
            </button>
          </form>

          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={isAuthLoading}
            className="mt-4 w-full rounded-full border border-cyan-300/30 bg-cyan-300/10 px-5 py-3 text-sm font-semibold text-cyan-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Continue with demo account
          </button>

          <p className="mt-8 text-sm text-slate-400">
            New here?{' '}
            <Link to="/register" className="font-semibold text-cyan-200">
              Create an account
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
};

export default LoginPage;
