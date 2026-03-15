const FeedComposer = () => {
  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-400/20 text-sm font-semibold text-cyan-200">
          LM
        </div>
        <button className="flex-1 rounded-full border border-white/10 bg-slate-950/60 px-5 py-3 text-left text-sm text-slate-400">
          Post a match photo, highlight reel, or quick result update...
        </button>
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <button className="rounded-full border border-white/10 px-4 py-2 text-sm text-white">Photo</button>
        <button className="rounded-full border border-white/10 px-4 py-2 text-sm text-white">Video</button>
        <button className="rounded-full border border-white/10 px-4 py-2 text-sm text-white">Highlight</button>
      </div>
    </div>
  );
};

export default FeedComposer;
