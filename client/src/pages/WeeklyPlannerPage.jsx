import { useEffect, useState } from 'react';
import { api } from '../services/api';

const defaultPlanner = [
  { day: 'Monday', focus: 'Chest + Triceps', status: 'Planned' },
  { day: 'Tuesday', focus: 'Back + Biceps', status: 'Completed' },
  { day: 'Wednesday', focus: 'Legs', status: 'Planned' },
  { day: 'Thursday', focus: 'Shoulders', status: 'Completed' },
  { day: 'Friday', focus: 'Upper Body', status: 'Planned' },
  { day: 'Saturday', focus: 'Full Body', status: 'Completed' },
  { day: 'Sunday', focus: 'Recovery / Mobility', status: 'Rest' },
];

function WeeklyPlannerPage() {
  const [planner, setPlanner] = useState(defaultPlanner);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const loadPlans = async () => {
      try {
        const response = await api.getWeeklyPlans();
        const plans = response.plans || defaultPlanner;
        setPlanner(
          defaultPlanner.map((defaultPlan) => {
            const existing = plans.find((plan) => plan.day === defaultPlan.day);
            return existing ? { ...defaultPlan, ...existing } : defaultPlan;
          }),
        );
      } catch (err) {
        setError(err.message || 'Unable to load weekly planner.');
      } finally {
        setLoading(false);
      }
    };

    loadPlans();
  }, []);

  const updatePlan = (day, field, value) => {
    setPlanner((current) => current.map((plan) => (plan.day === day ? { ...plan, [field]: value } : plan)));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      for (const plan of planner) {
        await api.saveWeeklyPlan({ day: plan.day, focus: plan.focus, status: plan.status, notes: '' });
      }

      setSuccess('Weekly planner saved.');
    } catch (err) {
      setError(err.message || 'Unable to save the weekly planner.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">Schedule</p>
            <h2 className="text-2xl font-semibold text-white">Weekly planner</h2>
          </div>
          <button type="button" onClick={handleSave} disabled={saving} className="rounded-xl bg-teal-500 px-4 py-2 font-medium text-slate-950 hover:bg-teal-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400">
            {saving ? 'Saving…' : 'Save plan'}
          </button>
        </div>
      </div>

      {error ? <div className="rounded-xl border border-rose-900 bg-rose-950/30 p-3 text-sm text-rose-200">{error}</div> : null}
      {success ? <div className="rounded-xl border border-emerald-900 bg-emerald-950/30 p-3 text-sm text-emerald-200">{success}</div> : null}

      {loading ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-slate-300">Loading planner…</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {planner.map((day) => (
            <div key={day.day} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
              <div className="mb-3 flex items-center justify-between gap-2">
                <h3 className="text-lg font-semibold text-white">{day.day}</h3>
                <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                  day.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-300' :
                  day.status === 'Rest' ? 'bg-slate-700 text-slate-300' : 'bg-amber-500/10 text-amber-300'
                }`}>
                  {day.status}
                </span>
              </div>

              <div className="space-y-3">
                <input
                  value={day.focus}
                  onChange={(event) => updatePlan(day.day, 'focus', event.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200"
                />

                <select
                  value={day.status}
                  onChange={(event) => updatePlan(day.day, 'status', event.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200"
                >
                  <option value="Planned">Planned</option>
                  <option value="Completed">Completed</option>
                  <option value="Rest">Rest</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default WeeklyPlannerPage;
