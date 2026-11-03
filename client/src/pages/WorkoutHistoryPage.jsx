import { useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';

function WorkoutHistoryPage() {
  const [workouts, setWorkouts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await api.getWorkouts();
        setWorkouts(response.workouts || []);
      } catch (err) {
        setError(err.message || 'Unable to load workout history.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const comparisonCards = useMemo(() => {
    const sortedByDate = [...workouts].sort((first, second) => new Date(first.date) - new Date(second.date));
    const previousByExercise = new Map();
    const comparisons = [];

    sortedByDate.forEach((workout) => {
      (workout.exercises || []).forEach((exercise) => {
        const currentWeight = (exercise.sets || []).reduce((highest, set) => Math.max(highest, Number(set.weight || 0)), 0);
        const currentReps = (exercise.sets || []).reduce((sum, set) => sum + Number(set.reps || 0), 0);
        const previous = previousByExercise.get(exercise.exerciseName);

        if (previous) {
          const deltaWeight = currentWeight - previous.weight;
          const deltaReps = currentReps - previous.reps;

          comparisons.push({
            exercise: exercise.exerciseName,
            previousDate: previous.date,
            previousWeight: previous.weight,
            currentWeight,
            previousReps: previous.reps,
            currentReps,
            deltaWeight,
            deltaReps,
          });
        }

        previousByExercise.set(exercise.exerciseName, {
          weight: currentWeight,
          reps: currentReps,
          date: new Date(workout.date).toISOString().slice(0, 10),
        });
      });
    });

    return comparisons.slice(-6).reverse();
  }, [workouts]);

  const historyRows = useMemo(() => {
    const normalizedQuery = searchTerm.trim().toLowerCase();

    return workouts
      .flatMap((workout) =>
        (workout.exercises || []).map((exercise) => {
          const reps = (exercise.sets || []).map((set) => Number(set.reps || 0));
          const weights = (exercise.sets || []).map((set) => Number(set.weight || 0));
          const repRange = reps.length ? `${Math.min(...reps)}-${Math.max(...reps)}` : '0';
          const heaviestWeight = weights.length ? `${Math.max(...weights)} kg` : '0 kg';

          return {
            id: `${workout._id}-${exercise.exerciseName}`,
            date: new Date(workout.date).toISOString().slice(0, 10),
            exercise: exercise.exerciseName,
            sets: (exercise.sets || []).length,
            reps: repRange,
            weight: heaviestWeight,
            trend: '+0%',
          };
        }),
      )
      .filter((item) => {
        if (!normalizedQuery) {
          return true;
        }

        return item.exercise.toLowerCase().includes(normalizedQuery);
      });
  }, [workouts, searchTerm]);

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
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500"
              placeholder="Search exercise"
            />
          </div>
        </div>
      </div>

      {error ? <div className="rounded-xl border border-rose-900 bg-rose-950/30 p-3 text-sm text-rose-200">{error}</div> : null}

      {comparisonCards.length > 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <h3 className="mb-4 text-xl font-semibold text-white">Exercise comparisons</h3>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {comparisonCards.map((comparison) => (
              <div key={`${comparison.exercise}-${comparison.previousDate}`} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <p className="text-lg font-semibold text-white">{comparison.exercise}</p>
                <div className="mt-3 space-y-2 text-sm text-slate-300">
                  <div className="flex justify-between"><span>Previous</span><span>{comparison.previousWeight} kg</span></div>
                  <div className="flex justify-between"><span>Today</span><span>{comparison.currentWeight} kg</span></div>
                  <div className="flex justify-between"><span>Reps</span><span>{comparison.previousReps} → {comparison.currentReps}</span></div>
                  <div className="mt-2 text-emerald-300">{comparison.deltaWeight >= 0 ? '+' : ''}{comparison.deltaWeight} kg vs prior</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
        {loading ? (
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 text-slate-300">Loading workout history…</div>
        ) : (
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
                {historyRows.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-6 text-center text-slate-400">
                      No workouts match your search.
                    </td>
                  </tr>
                ) : (
                  historyRows.map((day) => (
                    <tr key={day.id} className="border-t border-slate-800">
                      <td className="py-3">{day.date}</td>
                      <td className="py-3">{day.exercise}</td>
                      <td className="py-3">{day.sets}</td>
                      <td className="py-3">{day.reps}</td>
                      <td className="py-3">{day.weight}</td>
                      <td className="py-3 text-emerald-300">{day.trend}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default WorkoutHistoryPage;
