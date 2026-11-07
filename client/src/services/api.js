const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const TOKEN_STORAGE_KEY = 'fitness-tracker-token';
const USER_STORAGE_KEY = 'fitness-tracker-user';

export const getStoredToken = () => localStorage.getItem(TOKEN_STORAGE_KEY);
export const getStoredUser = () => {
  const raw = localStorage.getItem(USER_STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
};
export const isAuthenticated = () => Boolean(getStoredToken());

export const setAuthSession = ({ token, user }) => {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
};

export const clearAuthSession = () => {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(USER_STORAGE_KEY);
};

const buildHeaders = (options = {}) => {
  const token = getStoredToken();
  const headers = { ...(options.headers || {}) };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (options.body && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  return headers;
};

const handleResponse = async (response, fallbackMessage) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: fallbackMessage }));
    throw new Error(errorData.message || fallbackMessage);
  }

  return response.json();
};

const request = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: buildHeaders(options),
  });

  return handleResponse(response, options.fallbackMessage || 'Request failed');
};

export const api = {
  getHealth: async () => request('/health', { fallbackMessage: 'Health check failed' }),

  getDashboardOverview: async () => request('/dashboard/overview', { fallbackMessage: 'Dashboard data unavailable' }),

  getWorkouts: async (date) => {
    const query = date ? `?date=${encodeURIComponent(date)}` : '';
    return request(`/workouts${query}`, { fallbackMessage: 'Workout data unavailable' });
  },

  saveWorkout: async (workoutData) =>
    request('/workouts', {
      method: 'POST',
      body: JSON.stringify(workoutData),
      fallbackMessage: 'Unable to save workout',
    }),

  getWorkout: async (id) => request(`/workouts/${id}`, { fallbackMessage: 'Workout unavailable' }),

  updateWorkout: async (id, workoutData) =>
    request(`/workouts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(workoutData),
      fallbackMessage: 'Unable to update workout',
    }),

  deleteWorkout: async (id) =>
    request(`/workouts/${id}`, {
      method: 'DELETE',
      fallbackMessage: 'Unable to delete workout',
    }),

  getMeasurements: async () => request('/measurements', { fallbackMessage: 'Measurements unavailable' }),

  saveMeasurement: async (measurementData) =>
    request('/measurements', {
      method: 'POST',
      body: JSON.stringify(measurementData),
      fallbackMessage: 'Unable to save measurement',
    }),

  getWeeklyPlans: async () => request('/weekly-plans', { fallbackMessage: 'Weekly plans unavailable' }),

  saveWeeklyPlan: async (planData) =>
    request('/weekly-plans', {
      method: 'POST',
      body: JSON.stringify(planData),
      fallbackMessage: 'Unable to save weekly plan',
    }),

  getAnalytics: async () => request('/analytics', { fallbackMessage: 'Analytics unavailable' }),

  getPersonalRecords: async () => request('/personal-records', { fallbackMessage: 'Personal records unavailable' }),

  register: async (payload) =>
    request('/register', {
      method: 'POST',
      body: JSON.stringify(payload),
      fallbackMessage: 'Unable to register user',
    }),

  login: async (payload) =>
    request('/login', {
      method: 'POST',
      body: JSON.stringify(payload),
      fallbackMessage: 'Unable to log in',
    }),

  demoLogin: async () => request('/demo-login', { method: 'POST', fallbackMessage: 'Unable to create demo session' }),

  getCurrentUser: async () => request('/me', { fallbackMessage: 'Unable to load user profile' }),
};
