import { useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';

const MUSCLE_GROUPS = ['Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Legs', 'Abs', 'Cardio', 'Full Body'];

const createId = () => {
  if (globalThis.crypto && typeof globalThis.crypto.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const createSet = (setNumber = 1) => ({
  id: createId(),
  setNumber,
  reps: '',
  weight: '',
  restTime: '',
});

const createExercise = () => ({
  id: createId(),
  exerciseName: '',
  muscleGroup: 'Chest',
  sets: [createSet(1)],
});

const getTodaysDate = () => new Date().toISOString().split('T')[0];

function DailyWorkoutPage() {
  const [workoutDate, setWorkoutDate] = useState(getTodaysDate());
  const [notes, setNotes] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('60');
  const [restTimeSeconds, setRestTimeSeconds] = useState('90');
  const [completed, setCompleted] = useState(true);
  const [exercises, setExercises] = useState([createExercise()]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedWorkoutId, setSelectedWorkoutId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const loadWorkout = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await api.getWorkouts(workoutDate);
        const savedWorkout = response.workouts?.[0] || null;
        setSelectedWorkoutId(savedWorkout?._id || null);

        if (savedWorkout) {
          setNotes(savedWorkout.notes || '');
          setDurationMinutes(String(savedWorkout.durationMinutes ?? 60));
          setRestTimeSeconds(String(savedWorkout.restTimeSeconds ?? 90));
          setCompleted(Boolean(savedWorkout.completed));
          setExercises(
            (savedWorkout.exercises || []).map((exercise) => ({
              id: createId(),
              exerciseName: exercise.exerciseName || '',
              muscleGroup: exercise.muscleGroup || 'Chest',
              sets: (exercise.sets || []).map((set, index) => ({
                id: createId(),
                setNumber: set.setNumber ?? index + 1,
                reps: String(set.reps ?? ''),
                weight: String(set.weight ?? ''),
                restTime: String(set.restTime ?? ''),
              })),
            })),
          );
        } else {
          setNotes('');
          setDurationMinutes('60');
          setRestTimeSeconds('90');
          setCompleted(true);
          setExercises([createExercise()]);
        }
      } catch (err) {
        setError(err.message || 'Unable to load workouts for this date.');
      } finally {
        setLoading(false);
      }
    };

    loadWorkout();
  }, [workoutDate]);

  const summary = useMemo(() => {
    const totalSets = exercises.reduce((sum, exercise) => sum + exercise.sets.length, 0);
    const totalReps = exercises.reduce(
      (sum, exercise) => sum + exercise.sets.reduce((setSum, set) => setSum + Number(set.reps || 0), 0),
      0,
    );
    const totalVolume = exercises.reduce(
      (sum, exercise) =>
        sum +
        exercise.sets.reduce((setSum, set) => setSum + Number(set.weight || 0) * Number(set.reps || 0), 0),
      0,
    );

    return { totalSets, totalReps, totalVolume };
  }, [exercises]);

  const updateExercise = (exerciseId, field, value) => {
    setExercises((currentExercises) =>
      currentExercises.map((exercise) =>
        exercise.id === exerciseId ? { ...exercise, [field]: value } : exercise,
      ),
    );
  };

  const updateSet = (exerciseId, setId, field, value) => {
    setExercises((currentExercises) =>
      currentExercises.map((exercise) => {
        if (exercise.id !== exerciseId) {
          return exercise;
        }

        return {
          ...exercise,
          sets: exercise.sets.map((set) =>
            set.id === setId ? { ...set, [field]: value } : set,
          ),
        };
      }),
    );
  };

  const addExercise = () => {
    setExercises((currentExercises) => [...currentExercises, createExercise()]);
  };

  const removeExercise = (exerciseId) => {
    setExercises((currentExercises) =>
      currentExercises.length > 1
        ? currentExercises.filter((exercise) => exercise.id !== exerciseId)
        : currentExercises,
    );
  };

  const addSet = (exerciseId) => {
    setExercises((currentExercises) =>
      currentExercises.map((exercise) => {
        if (exercise.id !== exerciseId) {
          return exercise;
        }

        const nextSetNumber = (exercise.sets.at(-1)?.setNumber ?? 0) + 1;
        return {
          ...exercise,
          sets: [...exercise.sets, createSet(nextSetNumber)],
        };
      }),
    );
  };

  const removeSet = (exerciseId, setId) => {
    setExercises((currentExercises) =>
      currentExercises.map((exercise) => {
        if (exercise.id !== exerciseId) {
          return exercise;
        }

        if (exercise.sets.length === 1) {
          return exercise;
        }

        return {
          ...exercise,
          sets: exercise.sets
            .filter((set) => set.id !== setId)
            .map((set, index) => ({ ...set, setNumber: index + 1 })),
        };
      }),
    );
  };

  const handleSaveWorkout = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const payloadExercises = exercises
        .filter((exercise) => exercise.exerciseName.trim())
        .map((exercise) => ({
          exerciseName: exercise.exerciseName.trim(),
          muscleGroup: exercise.muscleGroup,
          sets: exercise.sets
            .filter((set) => Number(set.reps || 0) > 0 || Number(set.weight || 0) > 0)
            .map((set, index) => ({
              setNumber: Number(set.setNumber || index + 1),
              reps: Number(set.reps || 0),
              weight: Number(set.weight || 0),
              restTime: Number(set.restTime || 0),
            })),
        }))
        .filter((exercise) => exercise.sets.length > 0);

      if (payloadExercises.length === 0) {
        throw new Error('Add at least one completed exercise before saving.');
      }

      const payload = {
        date: workoutDate,
        notes,
        durationMinutes: Number(durationMinutes || 0),
        restTimeSeconds: Number(restTimeSeconds || 0),
        completed,
        exercises: payloadExercises,
      };

      const response = selectedWorkoutId ? await api.updateWorkout(selectedWorkoutId, payload) : await api.saveWorkout(payload);
      if (response?.workout?._id) {
        setSelectedWorkoutId(response.workout._id);
      }

      setSuccess(selectedWorkoutId ? 'Workout updated successfully.' : 'Workout saved successfully.');
    } catch (err) {
      setError(err.message || 'Workout could not be saved.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteWorkout = async () => {
    if (!selectedWorkoutId) {
      setError('No workout is available to delete for this date.');
      return;
    }

    const confirmed = window.confirm('Delete this workout?');
    if (!confirmed) {
      return;
    }

    try {
      setSaving(true);
      setError('');
      setSuccess('');
      await api.deleteWorkout(selectedWorkoutId);
      setSelectedWorkoutId(null);
      setNotes('');
      setDurationMinutes('60');
      setRestTimeSeconds('90');
      setCompleted(true);
      setExercises([createExercise()]);
      setSuccess('Workout deleted successfully.');
    } catch (err) {
      setError(err.message || 'Workout could not be deleted.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-slate-400">Today</p>
            <h2 className="text-2xl font-semibold text-white">Daily workout tracker</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedWorkoutId ? (
              <button
                type="button"
                onClick={handleDeleteWorkout}
                disabled={saving}
                className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2 font-medium text-red-200 transition hover:border-red-400 hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {saving ? 'Deleting…' : 'Delete workout'}
              </button>
            ) : null}
            <button
              type="button"
              onClick={handleSaveWorkout}
              disabled={saving}
              className="rounded-xl bg-teal-500 px-4 py-2 font-medium text-slate-950 transition hover:bg-teal-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
            >
              {saving ? (selectedWorkoutId ? 'Updating…' : 'Saving…') : selectedWorkoutId ? 'Update workout' : 'Save workout'}
            </button>
          </div>
        </div>
      </div>

      {error ? <div className="rounded-xl border border-rose-900 bg-rose-950/30 p-3 text-sm text-rose-200">{error}</div> : null}
      {success ? <div className="rounded-xl border border-emerald-900 bg-emerald-950/30 p-3 text-sm text-emerald-200">{success}</div> : null}

      <div className="grid gap-6 xl:grid-cols-[1.5fr,0.7fr]">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-xl font-semibold text-white">Workout log</h3>
            <button
              type="button"
              onClick={addExercise}
              className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-800"
            >
              Add exercise
            </button>
          </div>

          {loading ? (
            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 text-slate-300">Loading workout…</div>
          ) : (
            <div className="space-y-5">
              {exercises.map((exercise, exerciseIndex) => (
                <div key={exercise.id} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                  <div className="grid gap-3 md:grid-cols-[1.5fr,1fr,auto] md:items-center">
                    <input
                      type="text"
                      value={exercise.exerciseName}
                      onChange={(event) => updateExercise(exercise.id, 'exerciseName', event.target.value)}
                      placeholder="Exercise name"
                      className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-500"
                    />
                    <select
                      value={exercise.muscleGroup}
                      onChange={(event) => updateExercise(exercise.id, 'muscleGroup', event.target.value)}
                      className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none"
                    >
                      {MUSCLE_GROUPS.map((group) => (
                        <option key={group} value={group}>{group}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => removeExercise(exercise.id)}
                      className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="mt-4 overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                      <thead className="text-slate-400">
                        <tr>
                          <th className="pb-2 pr-2 font-medium">Set</th>
                          <th className="pb-2 pr-2 font-medium">Reps</th>
                          <th className="pb-2 pr-2 font-medium">Weight</th>
                          <th className="pb-2 pr-2 font-medium">Rest</th>
                          <th className="pb-2 font-medium">Action</th>
                        </tr>
                      </thead>
                      <tbody className="text-slate-200">
                        {exercise.sets.map((set, setIndex) => (
                          <tr key={set.id} className="border-t border-slate-800">
                            <td className="py-2 pr-2">
                              <input
                                type="number"
                                min="1"
                                value={set.setNumber}
                                onChange={(event) => updateSet(exercise.id, set.id, 'setNumber', event.target.value)}
                                className="w-16 rounded-lg border border-slate-700 bg-slate-900 px-2 py-1.5 text-center text-sm outline-none"
                              />
                            </td>
                            <td className="py-2 pr-2">
                              <input
                                type="number"
                                min="0"
                                value={set.reps}
                                onChange={(event) => updateSet(exercise.id, set.id, 'reps', event.target.value)}
                                className="w-20 rounded-lg border border-slate-700 bg-slate-900 px-2 py-1.5 text-sm outline-none"
                              />
                            </td>
                            <td className="py-2 pr-2">
                              <input
                                type="number"
                                min="0"
                                step="0.5"
                                value={set.weight}
                                onChange={(event) => updateSet(exercise.id, set.id, 'weight', event.target.value)}
                                className="w-24 rounded-lg border border-slate-700 bg-slate-900 px-2 py-1.5 text-sm outline-none"
                              />
                            </td>
                            <td className="py-2 pr-2">
                              <input
                                type="number"
                                min="0"
                                value={set.restTime}
                                onChange={(event) => updateSet(exercise.id, set.id, 'restTime', event.target.value)}
                                className="w-20 rounded-lg border border-slate-700 bg-slate-900 px-2 py-1.5 text-sm outline-none"
                              />
                            </td>
                            <td className="py-2">
                              <button
                                type="button"
                                onClick={() => removeSet(exercise.id, set.id)}
                                disabled={exercise.sets.length === 1}
                                className="text-teal-300 hover:text-teal-200 disabled:cursor-not-allowed disabled:text-slate-600"
                              >
                                {setIndex === 0 ? 'Delete' : 'Delete'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => addSet(exercise.id)}
                      className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-800"
                    >
                      Add set
                    </button>
                  </div>

                  {exerciseIndex < exercises.length - 1 ? <div className="mt-4 border-t border-slate-800" /> : null}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <p className="text-sm text-slate-400">Session details</p>
            <div className="mt-4 space-y-3 text-sm text-slate-200">
              <label className="block">
                <span className="mb-1.5 block text-slate-400">Workout date</span>
                <input
                  type="date"
                  value={workoutDate}
                  onChange={(event) => setWorkoutDate(event.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-slate-400">Workout duration (min)</span>
                <input
                  type="number"
                  min="0"
                  value={durationMinutes}
                  onChange={(event) => setDurationMinutes(event.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-slate-400">Rest between sets (sec)</span>
                <input
                  type="number"
                  min="0"
                  value={restTimeSeconds}
                  onChange={(event) => setRestTimeSeconds(event.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none"
                />
              </label>

              <label className="flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/50 px-3 py-2">
                <span>Workout completed</span>
                <input
                  type="checkbox"
                  checked={completed}
                  onChange={(event) => setCompleted(event.target.checked)}
                  className="h-4 w-4 accent-teal-500"
                />
              </label>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <p className="text-sm text-slate-400">Workout summary</p>
            <div className="mt-3 space-y-3 text-sm text-slate-200">
              <div className="flex justify-between"><span>Total sets</span><span>{summary.totalSets}</span></div>
              <div className="flex justify-between"><span>Total reps</span><span>{summary.totalReps}</span></div>
              <div className="flex justify-between"><span>Volume</span><span>{summary.totalVolume} kg</span></div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <p className="text-sm text-slate-400">Quick notes</p>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              className="mt-3 h-28 w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-200 outline-none placeholder:text-slate-500"
              placeholder="Focused on chest and back volume. Kept form clean on the final heavy set."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DailyWorkoutPage;
