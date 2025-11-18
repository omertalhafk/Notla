import api from './api';

const authService = {
    // Kayıt
    register: async (email, username, password, password_confirm) => {
        const response = await api.post('/auth/register/', {
            email,
            username,
            password,
            password_confirm,
        });
        return response.data;
    },

    // Login
    login: async (email, password) => {
        const response = await api.post('/auth/login/', {
            email,
            password,
        });
        
        if (response.data.tokens) {
            // Token'ları localStorage'a kaydet
            localStorage.setItem('access_token', response.data.tokens.access);
            localStorage.setItem('refresh_token', response.data.tokens.refresh);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        
        return response.data;
    },

    // Logout
    logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
    },

    // Profil
    getProfile: async () => {
        const response = await api.get('/auth/profile/');
        return response.data;
    },

    // Token var mı kontrol
    isAuthenticated: () => {
        return !!localStorage.getItem('access_token');
    },

    // Mevcut kullanıcı
    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },
};

export default authService;