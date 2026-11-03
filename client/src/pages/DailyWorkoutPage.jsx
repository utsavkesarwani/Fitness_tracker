const workoutRows = [
  { exercise: 'Bench Press', set: 1, reps: 10, weight: 75, muscle: 'Chest' },
  { exercise: 'Bench Press', set: 2, reps: 8, weight: 80, muscle: 'Chest' },
  { exercise: 'Bent-Over Row', set: 1, reps: 10, weight: 70, muscle: 'Back' },
  { exercise: 'Incline DB Press', set: 1, reps: 12, weight: 22, muscle: 'Chest' },
];

function DailyWorkoutPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-slate-400">Today</p>
            <h2 className="text-2xl font-semibold text-white">Daily workout tracker</h2>
          </div>
          <button className="rounded-xl bg-teal-500 px-4 py-2 font-medium text-slate-950 transition hover:bg-teal-400">
            Save workout
          </button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr,0.7fr]">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">Workout log</h3>
            <button className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-800">
              Add exercise
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-slate-400">
                <tr>
                  <th className="pb-3 font-medium">Exercise</th>
                  <th className="pb-3 font-medium">Set</th>
                  <th className="pb-3 font-medium">Reps</th>
                  <th className="pb-3 font-medium">Weight</th>
                  <th className="pb-3 font-medium">Muscle</th>
                  <th className="pb-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="text-slate-200">
                {workoutRows.map((row, index) => (
                  <tr key={`${row.exercise}-${row.set}-${index}`} className="border-t border-slate-800">
                    <td className="py-3">{row.exercise}</td>
                    <td className="py-3">{row.set}</td>
                    <td className="py-3">{row.reps}</td>
                    <td className="py-3">{row.weight} kg</td>
                    <td className="py-3">{row.muscle}</td>
                    <td className="py-3">
                      <button className="text-teal-300 hover:text-teal-200">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <p className="text-sm text-slate-400">Session details</p>
            <div className="mt-3 space-y-3 text-sm text-slate-200">
              <div className="flex justify-between"><span>Workout date</span><span>2026-11-03</span></div>
              <div className="flex justify-between"><span>Duration</span><span>56 min</span></div>
              <div className="flex justify-between"><span>Rest time</span><span>90 sec</span></div>
              <div className="flex justify-between"><span>Completed</span><span className="text-emerald-300">Yes</span></div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <p className="text-sm text-slate-400">Quick notes</p>
            <textarea
              className="mt-3 h-28 w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-200 outline-none ring-0 placeholder:text-slate-500"
              defaultValue="Focused on chest and back volume. Kept form clean on the final heavy set."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DailyWorkoutPage;
