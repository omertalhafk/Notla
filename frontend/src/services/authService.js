import api from './api';

const authService = {
  // Kayıt olma
  register: async (payload) => {
    const response = await api.post('/auth/register/', payload);
    return response.data;
  },

  // Giriş yapma
  login: async (payload) => {
    // payload artık { email: "...", password: "..." } objesidir.
    const response = await api.post('/auth/login/', payload);

    if (response.data.tokens) {
      // Token ve kullanıcı bilgilerini kaydediyoruz
      localStorage.setItem('notlaToken', response.data.tokens.access);
      localStorage.setItem('notlaRefreshToken', response.data.tokens.refresh);
      localStorage.setItem('notlaUser', JSON.stringify(response.data.user));
    }

    return response.data;
  },

  // Çıkış yapma
  logout: () => {
    localStorage.removeItem('notlaToken');
    localStorage.removeItem('notlaRefreshToken');
    localStorage.removeItem('notlaUser');
  },

  // Profil getirme
  getProfile: async () => {
    const response = await api.get('/auth/profile/');
    return response.data;
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('notlaUser');
    return user ? JSON.parse(user) : null;
  },
};

export default authService;