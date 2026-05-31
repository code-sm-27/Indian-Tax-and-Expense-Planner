import axios from 'axios';

const rawApiUrl = import.meta.env.VITE_API_URL || '';
const baseURL = rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl}/api`;

const api = axios.create({
  baseURL: baseURL, // Automatically handles missing /api suffix and local proxy
  withCredentials: true, // Crucial for HTTP-only cookies
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            // Token expired, missing, or invalid
            localStorage.removeItem('user');
            if (window.location.pathname !== '/auth') {
                window.location.href = '/auth';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
