import { useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';

const emptyForm = {
  date: new Date().toISOString().split('T')[0],
  weight: '',
  height: '',
  chest: '',
  waist: '',
  hips: '',
  biceps: '',
  thigh: '',
  bodyFatPercent: '',
  restingHeartRate: '',
};

function BodyMeasurementsPage() {
  const [measurements, setMeasurements] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadMeasurements = async () => {
    try {
      setLoading(true);
      const response = await api.getMeasurements();
      setMeasurements(response.measurements || []);
    } catch (err) {
      setError(err.message || 'Unable to load measurements.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMeasurements();
  }, []);

  const latest = measurements[0] || null;

  const summaryCards = useMemo(
    () => [
      { name: 'Body weight', value: latest ? `${latest.weight} kg` : 'Not logged' },
      { name: 'Height', value: latest ? `${latest.height} cm` : 'Not logged' },
      { name: 'BMI', value: latest ? `${latest.bmi}` : 'N/A' },
      { name: 'Chest', value: latest ? `${latest.chest} cm` : 'N/A' },
      { name: 'Waist', value: latest ? `${latest.waist} cm` : 'N/A' },
      { name: 'Hips', value: latest ? `${latest.hips} cm` : 'N/A' },
      { name: 'Biceps', value: latest ? `${latest.biceps} cm` : 'N/A' },
      { name: 'Thigh', value: latest ? `${latest.thigh} cm` : 'N/A' },
    ],
    [latest],
  );

  const handleChange = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSave = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const payload = {
        date: form.date || new Date().toISOString(),
        weight: Number(form.weight || 0),
        height: Number(form.height || 0),
        chest: Number(form.chest || 0),
        waist: Number(form.waist || 0),
        hips: Number(form.hips || 0),
        biceps: Number(form.biceps || 0),
        thigh: Number(form.thigh || 0),
        bodyFatPercent: Number(form.bodyFatPercent || 0),
        restingHeartRate: Number(form.restingHeartRate || 0),
      };

      await api.saveMeasurement(payload);
      setSuccess('Measurement entry saved successfully.');
      setForm(emptyForm);
      await loadMeasurements();
    } catch (err) {
      setError(err.message || 'Unable to save measurement.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">Progress</p>
            <h2 className="text-2xl font-semibold text-white">Body measurements</h2>
          </div>
        </div>
      </div>

      {error ? <div className="rounded-xl border border-rose-900 bg-rose-950/30 p-3 text-sm text-rose-200">{error}</div> : null}
      {success ? <div className="rounded-xl border border-emerald-900 bg-emerald-950/30 p-3 text-sm text-emerald-200">{success}</div> : null}

      <div className="grid gap-6 xl:grid-cols-[1.2fr,0.8fr]">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <h3 className="mb-4 text-lg font-semibold text-white">Latest measurements</h3>

          {loading ? (
            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 text-slate-300">Loading measurements…</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {summaryCards.map((metric) => (
                <div key={metric.name} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                  <p className="text-sm text-slate-400">{metric.name}</p>
                  <p className="mt-3 text-xl font-semibold text-white">{metric.value}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <form onSubmit={handleSave} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <h3 className="mb-4 text-lg font-semibold text-white">Add body entry</h3>

          <div className="grid gap-3 md:grid-cols-2">
            <label className="text-sm text-slate-300">
              <span className="mb-1 block">Date</span>
              <input type="date" value={form.date} onChange={(event) => handleChange('date', event.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100" />
            </label>
            <label className="text-sm text-slate-300">
              <span className="mb-1 block">Weight (kg)</span>
              <input type="number" step="0.1" value={form.weight} onChange={(event) => handleChange('weight', event.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100" />
            </label>
            <label className="text-sm text-slate-300">
              <span className="mb-1 block">Height (cm)</span>
              <input type="number" step="0.1" value={form.height} onChange={(event) => handleChange('height', event.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100" />
            </label>
            <label className="text-sm text-slate-300">
              <span className="mb-1 block">Chest (cm)</span>
              <input type="number" step="0.1" value={form.chest} onChange={(event) => handleChange('chest', event.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100" />
            </label>
            <label className="text-sm text-slate-300">
              <span className="mb-1 block">Waist (cm)</span>
              <input type="number" step="0.1" value={form.waist} onChange={(event) => handleChange('waist', event.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100" />
            </label>
            <label className="text-sm text-slate-300">
              <span className="mb-1 block">Hips (cm)</span>
              <input type="number" step="0.1" value={form.hips} onChange={(event) => handleChange('hips', event.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100" />
            </label>
            <label className="text-sm text-slate-300">
              <span className="mb-1 block">Biceps (cm)</span>
              <input type="number" step="0.1" value={form.biceps} onChange={(event) => handleChange('biceps', event.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100" />
            </label>
            <label className="text-sm text-slate-300">
              <span className="mb-1 block">Thigh (cm)</span>
              <input type="number" step="0.1" value={form.thigh} onChange={(event) => handleChange('thigh', event.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100" />
            </label>
            <label className="text-sm text-slate-300">
              <span className="mb-1 block">Body fat %</span>
              <input type="number" step="0.1" value={form.bodyFatPercent} onChange={(event) => handleChange('bodyFatPercent', event.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100" />
            </label>
            <label className="text-sm text-slate-300">
              <span className="mb-1 block">Resting HR</span>
              <input type="number" value={form.restingHeartRate} onChange={(event) => handleChange('restingHeartRate', event.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100" />
            </label>
          </div>

          <button type="submit" disabled={saving} className="mt-4 rounded-xl bg-teal-500 px-4 py-2 font-medium text-slate-950 hover:bg-teal-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400">
            {saving ? 'Saving…' : 'Add entry'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default BodyMeasurementsPage;
