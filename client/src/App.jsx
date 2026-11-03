import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AnalyticsPage from './pages/AnalyticsPage';
import BodyMeasurementsPage from './pages/BodyMeasurementsPage';
import DailyWorkoutPage from './pages/DailyWorkoutPage';
import DashboardPage from './pages/DashboardPage';
import ExerciseLibraryPage from './pages/ExerciseLibraryPage';
import PersonalRecordsPage from './pages/PersonalRecordsPage';
import SettingsPage from './pages/SettingsPage';
import WeeklyPlannerPage from './pages/WeeklyPlannerPage';
import WorkoutHistoryPage from './pages/WorkoutHistoryPage';

function App() {
  return (
    <BrowserRouter>
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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
