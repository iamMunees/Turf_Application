const TrainingSection = ({ player, onBook }) => {
  if (!player.trainingOffered) {
    return null;
  }

  return (
    <section className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-6">
      <h2 className="text-2xl font-semibold text-white">Training Offered</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <div className="rounded-[1.5rem] bg-white/5 p-4">
          <p className="text-sm text-slate-400">Price per session</p>
          <p className="mt-3 text-2xl font-semibold text-white">₹{player.trainingPrice}/hr</p>
        </div>
        <div className="rounded-[1.5rem] bg-white/5 p-4 md:col-span-2">
          <p className="text-sm text-slate-400">Available slots</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {player.trainingSlots.map((slot) => (
              <span key={`${slot.day}-${slot.time}`} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white">
                {slot.day} {slot.time}
              </span>
            ))}
          </div>
        </div>
      </div>
      <button type="button" onClick={onBook} className="mt-5 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950">
        Book Now
      </button>
    </section>
  );
};

export default TrainingSection;
