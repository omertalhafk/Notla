import api from './api';  // baseURL = http://localhost:8000/api/

const courseService = {

    // 🔹 1. TÜM DERSLERİ GETİR (LIST)
    getCourses: async (search = '') => {
        const params = search ? `?search=${search}` : '';
        const response = await api.get(`courses/${params}`);
        return response.data;
    },

    // 🔹 2. TEK DERS DETAYI (+ notlar + yorumlar)
    getCourseDetail: async (id) => {
        const response = await api.get(`courses/${id}/`);
        return response.data;
    },

    // 🔹 3. NOT YÜKLE
    uploadNote: async (courseId, formData) => {
        const response = await api.post(`courses/${courseId}/notes/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

     // ------------------------------
    // 4) NOTLARI GETİR
    // /api/notes/?course=ID&file_type=pdf
    // ------------------------------
    getNotes: async (courseId = null, fileType = null) => {
        let params = [];

        if (courseId) params.push(`course=${courseId}`);
        if (fileType) params.push(`file_type=${fileType}`);

        const query = params.length ? `?${params.join("&")}` : "";

        const res = await api.get(`/api/notes/${query}`);
        return res.data;
    },

    // ------------------------------
    // 5) YORUM EKLE
    // ------------------------------
    createReview: async (courseId, reviewData) => {
        const res = await api.post(
        `/api/courses/${courseId}/reviews/`,
        reviewData,
        {
            headers: {
            "Content-Type": "application/json",
            },
        }
        );
        return res.data;
    },
    };


export default courseService;
