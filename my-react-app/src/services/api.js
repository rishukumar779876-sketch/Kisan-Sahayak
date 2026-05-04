/**
 * API Service for Kisan Sahayak Frontend
 * Handles all API calls to the backend
 */

const API_BASE = '/api';

// Helper function for API calls
async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

// Health check
export async function checkHealth() {
  return apiCall('/health');
}

// Chat API
export const chatAPI = {
  sendMessage: (message) => 
    apiCall('/chat/send', {
      method: 'POST',
      body: JSON.stringify({ message }),
    }),
  
  getHistory: (limit = 50) => 
    apiCall(`/chat/history?limit=${limit}`),
  
  getQuickSuggestions: () => 
    apiCall('/chat/quick-suggestions'),
  
  analyzeImage: (imageUrl) => 
    apiCall('/chat/analyze', {
      method: 'POST',
      body: JSON.stringify({ imageUrl }),
    }),
};

// Dashboard API
export const dashboardAPI = {
  getAll: () => apiCall('/dashboard'),
  getWeather: () => apiCall('/dashboard/weather'),
  getCrops: () => apiCall('/dashboard/crops'),
  getAlerts: () => apiCall('/dashboard/alerts'),
  getMarket: () => apiCall('/dashboard/market'),
};

// Schemes API
export const schemesAPI = {
  getAll: (category = null, search = null) => {
    let params = new URLSearchParams();
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiCall(`/schemes${query}`);
  },
  
  getById: (id) => apiCall(`/schemes/${id}`),
  
  checkEligibility: (schemeId) => 
    apiCall('/schemes/check-eligibility', {
      method: 'POST',
      body: JSON.stringify({ schemeId }),
    }),
  
  getCategories: () => apiCall('/schemes/meta/categories'),
  
  getRecommended: () => apiCall('/schemes/recommended'),
};

// Alerts API
export const alertsAPI = {
  getAll: (unreadOnly = false) => 
    apiCall(`/alerts?unreadOnly=${unreadOnly}`),
  
  getById: (id) => apiCall(`/alerts/${id}`),
  
  markRead: (alertIds) => 
    apiCall('/alerts/mark-read', {
      method: 'POST',
      body: JSON.stringify({ alertIds }),
    }),
  
  markAllRead: () => 
    apiCall('/alerts/mark-all-read', {
      method: 'POST',
      body: JSON.stringify({}),
    }),
  
  generate: (alertData) => 
    apiCall('/alerts/generate', {
      method: 'POST',
      body: JSON.stringify(alertData),
    }),
  
  getSettings: () => apiCall('/alerts/settings'),
  
  updateSettings: (settings) => 
    apiCall('/alerts/settings', {
      method: 'POST',
      body: JSON.stringify({ settings }),
    }),
};

// Profile API
export const profileAPI = {
  get: () => apiCall('/profile'),
  
  update: (profileData) => 
    apiCall('/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    }),
  
  // Crops
  getCrops: () => apiCall('/profile/crops'),
  
  addCrop: (cropData) => 
    apiCall('/profile/crops', {
      method: 'POST',
      body: JSON.stringify(cropData),
    }),
  
  updateCrop: (id, cropData) => 
    apiCall(`/profile/crops/${id}`, {
      method: 'PUT',
      body: JSON.stringify(cropData),
    }),
  
  deleteCrop: (id) => 
    apiCall(`/profile/crops/${id}`, {
      method: 'DELETE',
    }),
  
  // Settings
  getSettings: () => apiCall('/profile/settings'),
  
  updateSettings: (settings) => 
    apiCall('/profile/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    }),
};

export default {
  checkHealth,
  chatAPI,
  dashboardAPI,
  schemesAPI,
  alertsAPI,
  profileAPI,
};
