const history = [
  { date: '2026-11-01', exercise: 'Bench Press', sets: 3, reps: '8-10', weight: '80 kg', trend: '+5%' },
  { date: '2026-10-28', exercise: 'Squat', sets: 4, reps: '6-8', weight: '110 kg', trend: '+3%' },
  { date: '2026-10-25', exercise: 'Deadlift', sets: 3, reps: '5-6', weight: '140 kg', trend: '+7%' },
  { date: '2026-10-22', exercise: 'Shoulder Press', sets: 3, reps: '8-10', weight: '42 kg', trend: '+2%' },
];

function WorkoutHistoryPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-slate-400">History</p>
            <h2 className="text-2xl font-semibold text-white">Workout history</h2>
          </div>
          <div className="flex gap-2">
            <input
              className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500"
              placeholder="Search exercise"
            />
            <button className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200">Filter</button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-slate-400">
              <tr>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Exercise</th>
                <th className="pb-3 font-medium">Sets</th>
                <th className="pb-3 font-medium">Rep range</th>
                <th className="pb-3 font-medium">Weight</th>
                <th className="pb-3 font-medium">Change</th>
              </tr>
            </thead>
            <tbody className="text-slate-200">
              {history.map((day) => (
                <tr key={`${day.date}-${day.exercise}`} className="border-t border-slate-800">
                  <td className="py-3">{day.date}</td>
                  <td className="py-3">{day.exercise}</td>
                  <td className="py-3">{day.sets}</td>
                  <td className="py-3">{day.reps}</td>
                  <td className="py-3">{day.weight}</td>
                  <td className="py-3 text-emerald-300">{day.trend}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default WorkoutHistoryPage;
