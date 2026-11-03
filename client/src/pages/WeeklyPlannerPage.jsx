const planner = [
  { day: 'Monday', focus: 'Chest + Triceps', status: 'Planned' },
  { day: 'Tuesday', focus: 'Back + Biceps', status: 'Completed' },
  { day: 'Wednesday', focus: 'Legs', status: 'Planned' },
  { day: 'Thursday', focus: 'Shoulders', status: 'Completed' },
  { day: 'Friday', focus: 'Upper Body', status: 'Planned' },
  { day: 'Saturday', focus: 'Full Body', status: 'Completed' },
  { day: 'Sunday', focus: 'Recovery / Mobility', status: 'Rest' },
];

function WeeklyPlannerPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">Schedule</p>
            <h2 className="text-2xl font-semibold text-white">Weekly planner</h2>
          </div>
          <button className="rounded-xl bg-teal-500 px-4 py-2 font-medium text-slate-950">Add plan</button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {planner.map((day) => (
          <div key={day.day} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">{day.day}</h3>
              <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                day.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-300' :
                day.status === 'Rest' ? 'bg-slate-700 text-slate-300' : 'bg-amber-500/10 text-amber-300'
              }`}>
                {day.status}
              </span>
            </div>
            <p className="text-slate-300">{day.focus}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WeeklyPlannerPage;
