import { useTheams } from '../hooks/useTheams';

const modeLabels = {
  default: 'Default',
  light: 'Light',
  dark: 'Dark',
};

const TheamToggle = () => {
  const { mode, modes, setMode, resolvedMode } = useTheams();

  return (
    <div
      className="inline-flex items-center rounded-full border border-white/10 bg-slate-950/55 p-1 text-xs text-slate-300 shadow-sm"
      aria-label={`Theme mode, currently ${modeLabels[mode]} (${resolvedMode})`}
    >
      {modes.map((item) => {
        const active = mode === item;

        return (
          <button
            key={item}
            type="button"
            onClick={() => setMode(item)}
            className={`rounded-full px-3 py-1.5 font-semibold transition ${
              active ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
            aria-pressed={active}
          >
            {modeLabels[item]}
          </button>
        );
      })}
    </div>
  );
};

export default TheamToggle;
