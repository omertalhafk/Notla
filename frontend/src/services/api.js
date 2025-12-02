import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Her istekten önce çalışır: Token varsa header'a ekler
api.interceptors.request.use((config) => {
    // App.js ile uyumlu olması için 'notlaToken' kullanıyoruz
    const token = localStorage.getItem("notlaToken");  
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;