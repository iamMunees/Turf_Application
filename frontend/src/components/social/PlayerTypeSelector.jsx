import { playerTypes } from '../../data/socialFeedData';

const PlayerTypeSelector = ({ value, onChange }) => (
  <div className="grid gap-2 sm:grid-cols-2">
    {playerTypes.map((item) => (
      <label
        key={item}
        className={`rounded-2xl border px-4 py-3 text-sm transition ${
          value === item
            ? 'border-cyan-300/35 bg-cyan-300/10 text-white'
            : 'border-white/10 bg-white/5 text-slate-300'
        }`}
      >
        <input
          checked={value === item}
          className="sr-only"
          name="player-type"
          type="radio"
          onChange={() => onChange(item)}
        />
        {item}
      </label>
    ))}
  </div>
);

export default PlayerTypeSelector;
