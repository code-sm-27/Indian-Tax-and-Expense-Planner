import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // Vite proxy will handle the exact localhost port
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
