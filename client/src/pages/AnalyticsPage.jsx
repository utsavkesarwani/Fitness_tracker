import { useEffect, useState } from 'react';
import { api } from '../services/api';

function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await api.getAnalytics();
        setAnalytics(response.analytics || null);
      } catch (err) {
        setError(err.message || 'Unable to load analytics.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (!analytics && !loading) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-slate-300">
        No analytics data available yet.
      </div>
    );
  }

  const metrics = analytics
    ? [
        { label: 'Workout consistency', value: `${analytics.consistency}%`, progress: analytics.consistency },
        { label: 'Weekly volume', value: `${analytics.totalVolume.toLocaleString()} kg`, progress: Math.min(100, Math.round((analytics.totalVolume / Math.max(analytics.totalSessions * 1500, 1)) * 100)) },
        { label: 'Recovery score', value: `${analytics.recoveryScore}/100`, progress: analytics.recoveryScore },
        { label: 'Progress trend', value: `${analytics.strengthTrend >= 0 ? '+' : ''}${analytics.strengthTrend}%`, progress: analytics.strengthTrend },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
        <p className="text-sm text-slate-400">Insights</p>
        <h2 className="text-2xl font-semibold text-white">Analytics dashboard</h2>
      </div>

      {error ? <div className="rounded-xl border border-rose-900 bg-rose-950/30 p-3 text-sm text-rose-200">{error}</div> : null}

      {loading ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-slate-300">Loading analytics…</div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric) => (
              <div key={metric.label} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
                <p className="text-sm text-slate-400">{metric.label}</p>
                <p className="mt-3 text-2xl font-semibold text-white">{metric.value}</p>
                <div className="mt-4 h-2 rounded-full bg-slate-800">
                  <div className="h-2 rounded-full bg-gradient-to-r from-teal-400 to-emerald-500" style={{ width: `${metric.progress}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.2fr,0.8fr]">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
              <h3 className="mb-4 text-xl font-semibold text-white">Weekly volume</h3>

              <div className="flex h-56 items-end gap-3">
                {analytics.weeklyVolume.map((day) => (
                  <div key={day.name} className="flex flex-1 flex-col items-center justify-end gap-2">
                    <div
                      className="w-full rounded-t-xl bg-gradient-to-t from-teal-500 to-emerald-400"
                      style={{
                        height: `${Math.max(12, (day.volume / Math.max(...analytics.weeklyVolume.map((item) => item.volume), 1)) * 100)}%`,
                      }}
                    />
                    <span className="text-xs text-slate-400">{day.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
              <h3 className="mb-4 text-xl font-semibold text-white">Performance snapshot</h3>
              <div className="space-y-4 text-sm text-slate-300">
                <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                  <span>Total sessions</span>
                  <span className="font-semibold text-white">{analytics.totalSessions}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                  <span>Total sets</span>
                  <span className="font-semibold text-white">{analytics.totalSets}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                  <span>Average volume</span>
                  <span className="font-semibold text-white">{analytics.averageVolume} kg</span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                  <span>Best lift</span>
                  <span className="font-semibold text-white">{analytics.bestLift ? `${analytics.bestLift.name} ${analytics.bestLift.weight} kg` : 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <h3 className="mb-4 text-xl font-semibold text-white">Progress intelligence</h3>
            <ul className="space-y-2 text-sm text-slate-300">
              {analytics.insights.map((insight) => (
                <li key={insight} className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                  {insight}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

export default AnalyticsPage;
