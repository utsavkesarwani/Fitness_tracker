const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const handleResponse = async (response, fallbackMessage) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: fallbackMessage }));
    throw new Error(errorData.message || fallbackMessage);
  }

  return response.json();
};

export const api = {
  getHealth: async () => {
    const response = await fetch(`${API_BASE_URL}/health`);
    return handleResponse(response, 'Health check failed');
  },

  getDashboardOverview: async () => {
    const response = await fetch(`${API_BASE_URL}/dashboard/overview`);
    return handleResponse(response, 'Dashboard data unavailable');
  },

  getWorkouts: async (date) => {
    const query = date ? `?date=${encodeURIComponent(date)}` : '';
    const response = await fetch(`${API_BASE_URL}/workouts${query}`);
    return handleResponse(response, 'Workout data unavailable');
  },

  saveWorkout: async (workoutData) => {
    const response = await fetch(`${API_BASE_URL}/workouts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(workoutData),
    });

    return handleResponse(response, 'Unable to save workout');
  },
};
