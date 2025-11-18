import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import courseService from '../services/courseService';
import authService from '../services/authService';
import './CourseDetail.css';

function CourseDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('notes'); // 'notes' veya 'reviews'
    
    // Note Upload
    const [showUploadForm, setShowUploadForm] = useState(false);
    const [uploadData, setUploadData] = useState({
        title: '',
        description: '',
        file_type: 'pdf',
        file: null,
    });
    const [uploading, setUploading] = useState(false);

    // Review
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviewData, setReviewData] = useState({
        rating: 5,
        comment: '',
        difficulty: 3,
        workload: 3,
    });
    const [submittingReview, setSubmittingReview] = useState(false);

    useEffect(() => {
        loadCourse();
    }, [id]);

    const loadCourse = async () => {
        try {
            setLoading(true);
            const data = await courseService.getCourseDetail(id);
            setCourse(data);
        } catch (error) {
            console.error('Ders yüklenemedi:', error);
            alert('Ders yüklenirken hata oluştu!');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        setUploadData({
            ...uploadData,
            file: e.target.files[0],
        });
    };

    const handleUploadSubmit = async (e) => {
        e.preventDefault();
        
        if (!uploadData.file) {
            alert('Lütfen dosya seçin!');
            return;
        }

        const formData = new FormData();
        formData.append('title', uploadData.title);
        formData.append('description', uploadData.description);
        formData.append('file_type', uploadData.file_type);
        formData.append('file', uploadData.file);

        try {
            setUploading(true);
            await courseService.uploadNote(id, formData);
            alert('Not başarıyla yüklendi! 📄');
            setShowUploadForm(false);
            setUploadData({ title: '', description: '', file_type: 'pdf', file: null });
            loadCourse(); // Sayfayı yenile
        } catch (error) {
            console.error('Not yüklenemedi:', error);
            alert('Not yüklenirken hata oluştu!');
        } finally {
            setUploading(false);
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();

        try {
            setSubmittingReview(true);
            await courseService.createReview(id, {
                ...reviewData,
                is_anonymous: true,
            });
            alert('Değerlendirme başarıyla eklendi! ⭐');
            setShowReviewForm(false);
            setReviewData({ rating: 5, comment: '', difficulty: 3, workload: 3 });
            loadCourse(); // Sayfayı yenile
        } catch (error) {
            console.error('Yorum eklenemedi:', error);
            if (error.response?.data?.non_field_errors) {
                alert(error.response.data.non_field_errors[0]);
            } else {
                alert('Değerlendirme eklenirken hata oluştu!');
            }
        } finally {
            setSubmittingReview(false);
        }
    };

    if (loading) {
        return <div className="loading-page">Yükleniyor...</div>;
    }

    if (!course) {
        return <div className="error-page">Ders bulunamadı!</div>;
    }

    return (
        <div className="course-detail-container">
            {/* Header */}
            <header className="detail-header">
                <div className="header-content">
                    <button onClick={() => navigate('/')} className="back-btn">
                        ← Geri
                    </button>
                    <h1>NOTLA</h1>
                    <button onClick={() => authService.logout() || navigate('/login')} className="logout-btn">
                        Çıkış
                    </button>
                </div>
            </header>

            {/* Course Info */}
            <div className="course-info">
                <div className="info-content">
                    <div className="course-code-badge">{course.code}</div>
                    <h2>{course.name}</h2>
                    {course.instructor && <p className="instructor">👨‍🏫 {course.instructor}</p>}
                    {course.description && <p className="description">{course.description}</p>}
                    
                    <div className="course-meta">
                        <span>📝 {course.notes?.length || 0} Not</span>
                        <span>💬 {course.reviews?.length || 0} Değerlendirme</span>
                        <span>⭐ {course.average_rating?.toFixed(1) || '0.0'}</span>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="actions-section">
                <button onClick={() => setShowUploadForm(!showUploadForm)} className="action-btn upload-btn">
                    📤 Not Yükle
                </button>
                <button onClick={() => setShowReviewForm(!showReviewForm)} className="action-btn review-btn">
                    ⭐ Değerlendir
                </button>
            </div>

            {/* Upload Form */}
            {showUploadForm && (
                <div className="form-modal">
                    <div className="modal-content">
                        <h3>Not Yükle</h3>
                        <form onSubmit={handleUploadSubmit}>
                            <input
                                type="text"
                                placeholder="Not Başlığı"
                                value={uploadData.title}
                                onChange={(e) => setUploadData({...uploadData, title: e.target.value})}
                                required
                            />
                            <textarea
                                placeholder="Açıklama (opsiyonel)"
                                value={uploadData.description}
                                onChange={(e) => setUploadData({...uploadData, description: e.target.value})}
                                rows="3"
                            />
                            <select
                                value={uploadData.file_type}
                                onChange={(e) => setUploadData({...uploadData, file_type: e.target.value})}
                            >
                                <option value="pdf">PDF</option>
                                <option value="docx">Word</option>
                                <option value="pptx">PowerPoint</option>
                                <option value="jpg">Resim (JPG)</option>
                                <option value="png">Resim (PNG)</option>
                                <option value="txt">Metin</option>
                            </select>
                            <input
                                type="file"
                                onChange={handleFileChange}
                                required
                            />
                            <div className="form-actions">
                                <button type="submit" disabled={uploading}>
                                    {uploading ? 'Yükleniyor...' : 'Yükle'}
                                </button>
                                <button type="button" onClick={() => setShowUploadForm(false)}>
                                    İptal
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Review Form */}
            {showReviewForm && (
                <div className="form-modal">
                    <div className="modal-content">
                        <h3>Ders Değerlendirmesi</h3>
                        <form onSubmit={handleReviewSubmit}>
                            <label>
                                Puan: {reviewData.rating} ⭐
                                <input
                                    type="range"
                                    min="1"
                                    max="5"
                                    value={reviewData.rating}
                                    onChange={(e) => setReviewData({...reviewData, rating: parseInt(e.target.value)})}
                                />
                            </label>
                            <textarea
                                placeholder="Yorumunuz..."
                                value={reviewData.comment}
                                onChange={(e) => setReviewData({...reviewData, comment: e.target.value})}
                                rows="4"
                                required
                            />
                            <label>
                                Zorluk: {reviewData.difficulty}/5
                                <input
                                    type="range"
                                    min="1"
                                    max="5"
                                    value={reviewData.difficulty}
                                    onChange={(e) => setReviewData({...reviewData, difficulty: parseInt(e.target.value)})}
                                />
                            </label>
                            <label>
                                İş Yükü: {reviewData.workload}/5
                                <input
                                    type="range"
                                    min="1"
                                    max="5"
                                    value={reviewData.workload}
                                    onChange={(e) => setReviewData({...reviewData, workload: parseInt(e.target.value)})}
                                />
                            </label>
                            <div className="form-actions">
                                <button type="submit" disabled={submittingReview}>
                                    {submittingReview ? 'Gönderiliyor...' : 'Gönder'}
                                </button>
                                <button type="button" onClick={() => setShowReviewForm(false)}>
                                    İptal
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div className="tabs">
                <button
                    className={activeTab === 'notes' ? 'active' : ''}
                    onClick={() => setActiveTab('notes')}
                >
                    📝 Notlar ({course.notes?.length || 0})
                </button>
                <button
                    className={activeTab === 'reviews' ? 'active' : ''}
                    onClick={() => setActiveTab('reviews')}
                >
                    💬 Değerlendirmeler ({course.reviews?.length || 0})
                </button>
            </div>

            {/* Content */}
            <div className="tab-content">
                {activeTab === 'notes' && (
                    <div className="notes-list">
                        {course.notes?.length === 0 ? (
                            <p className="empty-message">Henüz not eklenmemiş. İlk sen ekle! 📄</p>
                        ) : (
                            course.notes.map((note) => (
                                <div key={note.id} className="note-item">
                                    <div className="note-header">
                                        <h4>{note.title}</h4>
                                        <span className="file-type-badge">{note.file_type?.toUpperCase()}</span>
                                    </div>
                                    {note.description && <p>{note.description}</p>}
                                    <div className="note-footer">
                                        <span>👤 {note.user_email}</span>
                                        <span>👁️ {note.view_count} görüntülenme</span>
                                        <span>⬇️ {note.download_count} indirme</span>
                                        <a href={note.file_url} target="_blank" rel="noopener noreferrer" className="download-link">
                                            İndir
                                        </a>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === 'reviews' && (
                    <div className="reviews-list">
                        {course.reviews?.length === 0 ? (
                            <p className="empty-message">Henüz değerlendirme yapılmamış. İlk sen yap! ⭐</p>
                        ) : (
                            course.reviews.map((review) => (
                                <div key={review.id} className="review-item">
                                    <div className="review-header">
                                        <span className="rating">{'⭐'.repeat(review.rating)}</span>
                                        <span className="review-date">
                                            {new Date(review.created_at).toLocaleDateString('tr-TR')}
                                        </span>
                                    </div>
                                    <p className="review-comment">{review.comment}</p>
                                    <div className="review-meta">
                                        {review.difficulty && <span>Zorluk: {review.difficulty}/5</span>}
                                        {review.workload && <span>İş Yükü: {review.workload}/5</span>}
                                        <span className="review-author">
                                            {review.is_anonymous ? '👤 Anonim' : review.user_email}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default CourseDetail;