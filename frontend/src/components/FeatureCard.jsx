import { Link } from 'react-router-dom';

const FeatureCard = ({ title, description, to, accent, meta }) => {
  return (
    <Link
      to={to}
      className="group overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-cyan-300/30 hover:bg-white/7"
    >
      <div className={`h-1 w-24 rounded-full bg-gradient-to-r ${accent}`} />
      <div className="mt-6 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-300">{description}</p>
        </div>
        <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
          {meta}
        </span>
      </div>
      <div className="mt-8 flex items-center justify-between text-sm">
        <span className="text-cyan-200">Open feature</span>
        <span className="text-slate-400 transition group-hover:text-white">View page</span>
      </div>
    </Link>
  );
};

export default FeatureCard;
