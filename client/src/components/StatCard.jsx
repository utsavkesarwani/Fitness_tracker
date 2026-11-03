function StatCard({ title, value, detail, accent = 'teal', icon: Icon }) {
  const accentMap = {
    teal: 'bg-teal-500/10 text-teal-300 ring-teal-500/30',
    violet: 'bg-violet-500/10 text-violet-300 ring-violet-500/30',
    amber: 'bg-amber-500/10 text-amber-300 ring-amber-500/30',
    emerald: 'bg-emerald-500/10 text-emerald-300 ring-emerald-500/30',
    rose: 'bg-rose-500/10 text-rose-300 ring-rose-500/30',
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg shadow-slate-950/20">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-slate-400">{title}</p>
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ring-1 ${accentMap[accent]}`}>
          {Icon ? <Icon className="h-5 w-5" /> : null}
        </div>
      </div>

      <div className="mb-2 text-3xl font-bold text-white">{value}</div>
      <p className="text-sm text-slate-400">{detail}</p>
    </div>
  );
}

export default StatCard;
