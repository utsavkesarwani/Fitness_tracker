import { useEffect, useState } from 'react';
import { api } from '../services/api';

function PersonalRecordsPage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await api.getPersonalRecords();
        setRecords(response.records || []);
      } catch (err) {
        setError(err.message || 'Unable to load personal records.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
        <p className="text-sm text-slate-400">Milestones</p>
        <h2 className="text-2xl font-semibold text-white">Personal records</h2>
      </div>

      {error ? <div className="rounded-xl border border-rose-900 bg-rose-950/30 p-3 text-sm text-rose-200">{error}</div> : null}

      {loading ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-slate-300">Loading records…</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {records.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-slate-400 md:col-span-2">
              No logged lifts yet. Save a workout to establish personal records.
            </div>
          ) : (
            records.map((record) => (
              <div key={record.exercise} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">{record.exercise}</h3>
                  <span className="rounded-full bg-teal-500/10 px-2 py-1 text-xs text-teal-300">PR</span>
                </div>
                <p className="mt-4 text-3xl font-bold text-white">{record.weight} kg</p>
                <p className="mt-2 text-sm text-slate-400">Recorded {record.date}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default PersonalRecordsPage;
