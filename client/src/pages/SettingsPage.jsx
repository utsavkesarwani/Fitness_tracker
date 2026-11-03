import { clearAuthSession, getStoredUser } from '../services/api';

function SettingsPage() {
  const user = getStoredUser();

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
        <p className="text-sm text-slate-400">Preferences</p>
        <h2 className="text-2xl font-semibold text-white">Settings</h2>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <h3 className="text-lg font-semibold text-white">Training preferences</h3>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            <label className="flex items-center justify-between gap-3"><span>Automatic workout reminders</span><input type="checkbox" defaultChecked className="h-4 w-4 accent-teal-500" /></label>
            <label className="flex items-center justify-between gap-3"><span>Weekly planner notifications</span><input type="checkbox" defaultChecked className="h-4 w-4 accent-teal-500" /></label>
            <label className="flex items-center justify-between gap-3"><span>Dark mode / energy theme</span><input type="checkbox" defaultChecked className="h-4 w-4 accent-teal-500" /></label>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <h3 className="text-lg font-semibold text-white">Profile</h3>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            <div className="flex justify-between"><span>Name</span><span className="text-white">{user?.name || 'Demo User'}</span></div>
            <div className="flex justify-between"><span>Email</span><span className="text-white">{user?.email || 'demo@fitness.local'}</span></div>
            <div className="flex justify-between"><span>Units</span><span className="text-white">Metric</span></div>
            <div className="flex justify-between"><span>Goal</span><span className="text-white">Strength gain</span></div>
            <div className="flex justify-between"><span>Workout days</span><span className="text-white">6 / week</span></div>
          </div>
          <button
            type="button"
            onClick={() => {
              clearAuthSession();
              window.location.href = '/auth';
            }}
            className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-200 transition hover:bg-red-500/20"
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
