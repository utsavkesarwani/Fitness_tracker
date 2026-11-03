import { BarChart3, CalendarDays, Dumbbell, Flame, HeartPulse, LayoutDashboard, ListTodo, Settings, Target, Weight } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Daily Workout', href: '/daily-workout', icon: Dumbbell },
  { name: 'Workout History', href: '/workout-history', icon: ListTodo },
  { name: 'Weekly Planner', href: '/weekly-planner', icon: CalendarDays },
  { name: 'Exercise Library', href: '/exercise-library', icon: Target },
  { name: 'Body Measurements', href: '/body-measurements', icon: Weight },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Personal Records', href: '/personal-records', icon: Flame },
  { name: 'Settings', href: '/settings', icon: Settings },
];

function Sidebar() {
  return (
    <aside className="hidden w-72 shrink-0 border-r border-slate-800 bg-slate-950/80 p-5 lg:block">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-500/15 text-teal-300">
          <HeartPulse className="h-6 w-6" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-teal-300">Gym</p>
          <h1 className="text-lg font-semibold text-white">Tracker</h1>
        </div>
      </div>

      <nav className="space-y-2">
        {navigation.map(({ name, href, icon: Icon }) => (
          <NavLink
            key={name}
            to={href}
            end={href === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? 'bg-teal-500/15 text-teal-200 ring-1 ring-teal-500/40'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`
            }
          >
            <Icon className="h-4 w-4" />
            {name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
