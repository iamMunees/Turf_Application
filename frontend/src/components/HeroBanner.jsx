const roleCopy = {
  player: 'Secure premium slots, scout teammates, and share the moments that win matches.',
  organizer: 'Run tournaments from one dashboard with live registrations, schedules, and social reach.',
  fan: 'Follow the action, discover events nearby, and stay close to the players you support.',
};

const HeroBanner = ({ role }) => {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.24),_transparent_30%),linear-gradient(135deg,_rgba(15,23,42,0.98),_rgba(12,18,34,0.92))] p-8 md:p-12">
      <div className="absolute inset-y-0 right-0 hidden w-1/3 bg-[radial-gradient(circle_at_center,_rgba(14,165,233,0.18),_transparent_65%)] lg:block" />
      <div className="relative max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-cyan-300/80">Lineup</p>
        <h1 className="mt-4 text-4xl font-semibold text-white md:text-6xl">
          Professional sports experiences built for the <span className="text-cyan-300">{role}</span> journey.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
          {roleCopy[role] ?? roleCopy.player}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200">
            Explore Live Features
          </button>
          <button className="rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
            Watch Demo
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
