import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('notlaToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authService = {
  login: (payload) => api.post('/api/auth/login/', payload),
  register: (payload) => api.post('/api/auth/register/', payload),
};

export const courseService = {
  getCourses: () => api.get('/api/courses/'),
  getCourseDetail: (id) => api.get(`/api/courses/${id}/`),
  uploadNote: (id, data) =>
    api.post(`/api/courses/${id}/notes/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  submitReview: (id, data) => api.post(`/api/courses/${id}/reviews/`, data),
};

export default api;

