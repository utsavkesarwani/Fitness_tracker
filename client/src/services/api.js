const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = {
  getHealth: async () => {
    const response = await fetch(`${API_BASE_URL}/health`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Health check failed' }));
      throw new Error(errorData.message || 'Health check failed');
    }

    return response.json();
  },

  getDashboardOverview: async () => {
    const response = await fetch(`${API_BASE_URL}/dashboard/overview`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Dashboard data unavailable' }));
      throw new Error(errorData.message || 'Dashboard data unavailable');
    }

    return response.json();
  },
};
