const exercises = [
  { name: 'Bench Press', category: 'Chest', target: 'Upper body power' },
  { name: 'Barbell Row', category: 'Back', target: 'Mid-back strength' },
  { name: 'Back Squat', category: 'Legs', target: 'Lower body mass' },
  { name: 'Overhead Press', category: 'Shoulders', target: 'Shoulder stability' },
  { name: 'Pull-Up', category: 'Back', target: 'Grip and pull strength' },
  { name: 'Dumbbell Curl', category: 'Biceps', target: 'Arm isolation' },
];

function ExerciseLibraryPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">Catalog</p>
            <h2 className="text-2xl font-semibold text-white">Exercise library</h2>
          </div>
          <button className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200">Add exercise</button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {exercises.map((exercise) => (
          <div key={exercise.name} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">{exercise.name}</h3>
              <span className="rounded-full bg-teal-500/10 px-2 py-1 text-xs text-teal-300">{exercise.category}</span>
            </div>
            <p className="text-slate-300">{exercise.target}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExerciseLibraryPage;
