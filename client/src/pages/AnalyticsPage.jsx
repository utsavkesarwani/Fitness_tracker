const metrics = [
  { label: 'Workout consistency', value: '86%', progress: 86 },
  { label: 'Weekly volume', value: '12,450 kg', progress: 72 },
  { label: 'Recovery score', value: '82/100', progress: 82 },
  { label: 'Progress trend', value: '+14%', progress: 76 },
];

function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
        <p className="text-sm text-slate-400">Insights</p>
        <h2 className="text-2xl font-semibold text-white">Analytics dashboard</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <p className="text-sm text-slate-400">{metric.label}</p>
            <p className="mt-3 text-2xl font-semibold text-white">{metric.value}</p>
            <div className="mt-4 h-2 rounded-full bg-slate-800">
              <div className="h-2 rounded-full bg-gradient-to-r from-teal-400 to-emerald-500" style={{ width: `${metric.progress}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AnalyticsPage;
