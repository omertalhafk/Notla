import api from './api';

const courseService = {
    // Tüm dersleri getir
    getCourses: async (search = '') => {
        const params = search ? `?search=${search}` : '';
        const response = await api.get(`/courses/${params}`);
        return response.data;
    },

    // Ders detayı
    getCourseDetail: async (id) => {
        const response = await api.get(`/courses/${id}/`);
        return response.data;
    },

    // Not yükle
    uploadNote: async (courseId, formData) => {
        const response = await api.post(`/courses/${courseId}/notes/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // Yorum yap
    createReview: async (courseId, reviewData) => {
        const response = await api.post(`/courses/${courseId}/reviews/`, reviewData);
        return response.data;
    },

    // Notları getir
    getNotes: async (courseId = null, fileType = null) => {
        let params = '';
        if (courseId) params += `?course=${courseId}`;
        if (fileType) params += `${params ? '&' : '?'}file_type=${fileType}`;
        
        const response = await api.get(`/notes/${params}`);
        return response.data;
    },
};

export default courseService;