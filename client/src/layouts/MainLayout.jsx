import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

function MainLayout() {
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />
      <main className="flex-1">
        <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/85 px-5 py-4 backdrop-blur-sm md:px-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-teal-300">Overview</p>
              <h2 className="text-2xl font-semibold text-white">Personal fitness dashboard</h2>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-300">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              Sync active
            </div>
          </div>
        </header>

        <div className="p-5 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default MainLayout;
