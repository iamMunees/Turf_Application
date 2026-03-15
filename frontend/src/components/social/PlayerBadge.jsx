const toneMap = {
  Local: 'border-white/15 bg-white/8 text-slate-100',
  State: 'border-sky-300/20 bg-sky-300/10 text-sky-100',
  National: 'border-amber-300/20 bg-amber-300/10 text-amber-100',
  International: 'border-rose-300/20 bg-rose-300/10 text-rose-100',
  career: 'border-emerald-300/25 bg-emerald-300/10 text-emerald-100',
  scout: 'border-cyan-300/25 bg-cyan-300/10 text-cyan-100',
  verified: 'border-violet-300/25 bg-violet-300/10 text-violet-100',
  rising: 'border-pink-300/25 bg-pink-300/10 text-pink-100',
};

const PlayerBadge = ({ label, tone = 'Local' }) => (
  <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${toneMap[tone]}`}>
    {label}
  </span>
);

export default PlayerBadge;
