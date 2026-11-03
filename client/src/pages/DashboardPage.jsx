import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Activity, CalendarRange, Dumbbell, Gauge, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import StatCard from '../components/StatCard';
import { api } from '../services/api';

function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const overview = await api.getDashboardOverview();
        setData(overview);
      } catch (err) {
        setError(err.message || 'Unable to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, []);

  if (loading) {
    return <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-8 text-slate-300">Loading dashboard…</div>;
  }

  if (error) {
    return <div className="rounded-xl border border-rose-900/70 bg-rose-950/30 p-8 text-rose-200">{error}</div>;
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total sessions" value={data.overview.totalSessions} detail="Across all logged workouts" icon={CalendarRange} accent="teal" />
        <StatCard title="Workout streak" value={`${data.overview.currentStreak} days`} detail="Best consistency this month" icon={TrendingUp} accent="emerald" />
        <StatCard title="Completed sets" value={data.overview.totalSets} detail="Tracked across recent sessions" icon={Dumbbell} accent="violet" />
        <StatCard title="Current weight" value={`${data.overview.currentWeight} kg`} detail="Latest body measurement" icon={Gauge} accent="amber" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.7fr,1fr]">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Weekly activity</p>
              <h3 className="text-xl font-semibold text-white">Workout consistency</h3>
            </div>
            <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-300">
              {data.overview.weeklyCompletion}% this week
            </span>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.weeklyActivity}>
                <defs>
                  <linearGradient id="areaFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#334155" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="sessions" stroke="#2dd4bf" fill="url(#areaFill)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <div className="mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5 text-teal-300" />
            <h3 className="text-xl font-semibold text-white">Performance summary</h3>
          </div>

          <div className="space-y-4">
            {data.summary.map((item) => (
              <div key={item.label} className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                <div className="flex items-center justify-between text-sm text-slate-400">
                  <span>{item.label}</span>
                  <span className="text-white">{item.value}</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-slate-800">
                  <div className="h-2 rounded-full bg-gradient-to-r from-teal-400 to-emerald-500" style={{ width: `${item.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr,1fr]">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">Recent workouts</h3>
            <span className="text-sm text-slate-400">Last 5 entries</span>
          </div>

          <div className="space-y-3">
            {data.recentWorkouts.map((workout) => (
              <div key={workout.id} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                <div>
                  <p className="font-medium text-white">{workout.name}</p>
                  <p className="text-sm text-slate-400">{workout.date} · {workout.muscleGroup}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-teal-300">{workout.volume} kg</p>
                  <p className="text-xs text-slate-400">{workout.sets} sets</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <div className="mb-4">
            <p className="text-sm text-slate-400">Volume trend</p>
            <h3 className="text-xl font-semibold text-white">Training load</h3>
          </div>

          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.volumeTrend}>
                <CartesianGrid stroke="#334155" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }} />
                <Bar dataKey="volume" fill="#14b8a6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
