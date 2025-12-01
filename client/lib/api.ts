import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import Constants from 'expo-constants';

// Get API base URL from environment variables only
const getApiBaseUrl = (): string => {
  // Try Constants.expoConfig.extra first (for Expo native apps)
  const extra = Constants.expoConfig?.extra;
  const apiUrl = extra?.apiUrl || process.env.EXPO_PUBLIC_API_URL;
  
  if (!apiUrl) {
    throw new Error(
      'API URL is not configured. Please set EXPO_PUBLIC_API_URL environment variable ' +
      'or add apiUrl to app.json under expo.extra'
    );
  }
  
  return apiUrl;
};

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token if available
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      // Dynamically import storage to avoid circular dependencies
      const { storage } = await import('@/utils/storage');
      const token = await storage.getToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token for request:', error);
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    // Handle common errors
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - Clear token and redirect to login
          try {
            const { storage } = await import('@/utils/storage');
            await storage.clearAuth();
            // Dispatch logout action if needed (handled by Redux)
          } catch (error) {
            console.error('Error clearing auth on 401:', error);
          }
          break;
        case 403:
          // Forbidden
          console.error('Access forbidden:', data);
          break;
        case 404:
          // Not found
          console.error('Resource not found:', data);
          break;
        case 500:
          // Server error
          console.error('Server error:', data);
          break;
        default:
          console.error('API Error:', status, data);
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network error:', error.message);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;




