import api from './api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const courseService = {

  getCourses: async (search = '') => {
    const params = search ? `?search=${search}` : '';
    const response = await api.get(`/courses/${params}`);
    return response.data;
  },

  getCourseDetail: async (id) => {
    const response = await api.get(`/courses/${id}/`);
    return response.data;
  },

  uploadNote: async (courseId, formData) => {
    const response = await api.post(
      `/courses/${courseId}/notes/`,
      formData,
      {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  createReview: async (courseId, reviewData) => {
    const response = await api.post(
      `/courses/${courseId}/reviews/`,
      reviewData,
      {
        headers: {
          ...getAuthHeaders(),
        },
      }
    );
    return response.data;
  },

  getNotes: async (courseId = null, fileType = null) => {
    let params = '';
    if (courseId) params += `?course=${courseId}`;
    if (fileType) params += `${params ? '&' : '?'}file_type=${fileType}`;

    const response = await api.get(`/notes/${params}`, {
      headers: {
        ...getAuthHeaders(),
      },
    });
    return response.data;
  },
};

export default courseService;
