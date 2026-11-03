import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AnalyticsPage from './pages/AnalyticsPage';
import AuthPage from './pages/AuthPage';
import BodyMeasurementsPage from './pages/BodyMeasurementsPage';
import DailyWorkoutPage from './pages/DailyWorkoutPage';
import DashboardPage from './pages/DashboardPage';
import ExerciseLibraryPage from './pages/ExerciseLibraryPage';
import PersonalRecordsPage from './pages/PersonalRecordsPage';
import SettingsPage from './pages/SettingsPage';
import WeeklyPlannerPage from './pages/WeeklyPlannerPage';
import WorkoutHistoryPage from './pages/WorkoutHistoryPage';
import { isAuthenticated } from './services/api';

function ProtectedRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="daily-workout" element={<DailyWorkoutPage />} />
        <Route path="workout-history" element={<WorkoutHistoryPage />} />
        <Route path="weekly-planner" element={<WeeklyPlannerPage />} />
        <Route path="exercise-library" element={<ExerciseLibraryPage />} />
        <Route path="body-measurements" element={<BodyMeasurementsPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="personal-records" element={<PersonalRecordsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

function App() {
  const [, setSessionTick] = useState(0);

  useEffect(() => {
    const handleStorageChange = () => setSessionTick((current) => current + 1);
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const authenticated = isAuthenticated();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthPage onAuthenticated={() => setSessionTick((current) => current + 1)} />} />
        <Route path="*" element={authenticated ? <ProtectedRoutes /> : <Navigate to="/auth" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
