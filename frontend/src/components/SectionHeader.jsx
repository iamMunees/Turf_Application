const SectionHeader = ({ eyebrow, title, description, actionLabel }) => {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-cyan-300/80">
          {eyebrow}
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-white md:text-3xl">{title}</h2>
        <p className="mt-2 text-sm text-slate-300 md:text-base">{description}</p>
      </div>
      {actionLabel ? (
        <button className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10">
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
};

export default SectionHeader;
