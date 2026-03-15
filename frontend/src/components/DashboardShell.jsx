import Navbar from './Navbar';
import Sidebar from './Sidebar';

const DashboardShell = ({ title, description, children, showSidebar = true }) => {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#020617,_#0f172a_38%,_#020617)] px-4 py-6 text-white md:px-8 md:py-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <Navbar />
        <section className="rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_30%),linear-gradient(135deg,_rgba(15,23,42,0.98),_rgba(12,18,34,0.92))] p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300/80">Dashboard</p>
          <h1 className="mt-4 text-3xl font-semibold text-white md:text-5xl">{title}</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">{description}</p>
        </section>
        <div className={`grid gap-6 ${showSidebar ? 'xl:grid-cols-[280px_1fr]' : ''}`}>
          {showSidebar ? <Sidebar /> : null}
          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </main>
  );
};

export default DashboardShell;
