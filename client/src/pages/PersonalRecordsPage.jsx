const records = [
  { exercise: 'Bench Press', weight: '115 kg', date: '2026-10-22' },
  { exercise: 'Squat', weight: '165 kg', date: '2026-11-01' },
  { exercise: 'Deadlift', weight: '185 kg', date: '2026-10-18' },
  { exercise: 'Overhead Press', weight: '75 kg', date: '2026-09-30' },
];

function PersonalRecordsPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
        <p className="text-sm text-slate-400">Milestones</p>
        <h2 className="text-2xl font-semibold text-white">Personal records</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {records.map((record) => (
          <div key={record.exercise} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">{record.exercise}</h3>
              <span className="rounded-full bg-teal-500/10 px-2 py-1 text-xs text-teal-300">PR</span>
            </div>
            <p className="mt-4 text-3xl font-bold text-white">{record.weight}</p>
            <p className="mt-2 text-sm text-slate-400">Recorded {record.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PersonalRecordsPage;
