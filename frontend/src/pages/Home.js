import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import courseService from '../services/courseService';
import authService from '../services/authService';
import './Home.css';

function Home() {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Kullanıcı bilgisini al
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);

        // Dersleri yükle
        loadCourses();
    }, []);

    const loadCourses = async (search = '') => {
        try {
            setLoading(true);
            const data = await courseService.getCourses(search);
            setCourses(data.results || data);
        } catch (error) {
            console.error('Dersler yüklenemedi:', error);
            alert('Dersler yüklenirken hata oluştu!');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        loadCourses(searchTerm);
    };

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    const goToCourseDetail = (courseId) => {
        navigate(`/course/${courseId}`);
    };

    return (
        <div className="home-container">
            {/* Header */}
            <header className="home-header">
                <div className="header-content">
                    <h1>NOTLA</h1>
                    <div className="header-right">
                        <span className="user-info">
                            👤 {user?.username || user?.email}
                        </span>
                        <button onClick={handleLogout} className="logout-btn">
                            Çıkış Yap
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="home-main">
                <div className="content-wrapper">
                    {/* Search Bar */}
                    <div className="search-section">
                        <h2>Ders Ara</h2>
                        <form onSubmit={handleSearch} className="search-form">
                            <input
                                type="text"
                                placeholder="Ders kodu veya adı (örn: BIL481, Yazılım)"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                            <button type="submit" className="search-btn">
                                🔍 Ara
                            </button>
                        </form>
                        {searchTerm && (
                            <button 
                                onClick={() => {
                                    setSearchTerm('');
                                    loadCourses();
                                }}
                                className="clear-search-btn"
                            >
                                ✕ Aramayı Temizle
                            </button>
                        )}
                    </div>

                    {/* Course List */}
                    <div className="courses-section">
                        <h2>
                            {searchTerm ? `"${searchTerm}" için Sonuçlar` : 'Tüm Dersler'}
                            {!loading && ` (${courses.length})`}
                        </h2>

                        {loading ? (
                            <div className="loading">Yükleniyor...</div>
                        ) : courses.length === 0 ? (
                            <div className="no-courses">
                                {searchTerm 
                                    ? '🔍 Arama sonucu bulunamadı.' 
                                    : '📚 Henüz ders eklenmemiş.'}
                            </div>
                        ) : (
                            <div className="courses-grid">
                                {courses.map((course) => (
                                    <div 
                                        key={course.id} 
                                        className="course-card"
                                        onClick={() => goToCourseDetail(course.id)}
                                    >
                                        <div className="course-code">{course.code}</div>
                                        <h3 className="course-name">{course.name}</h3>
                                        {course.instructor && (
                                            <p className="course-instructor">
                                                👨‍🏫 {course.instructor}
                                            </p>
                                        )}
                                        {course.description && (
                                            <p className="course-description">
                                                {course.description.substring(0, 100)}
                                                {course.description.length > 100 ? '...' : ''}
                                            </p>
                                        )}
                                        <div className="course-stats">
                                            <span>📝 {course.notes_count || 0} Not</span>
                                            <span>💬 {course.reviews_count || 0} Yorum</span>
                                            <span>⭐ {course.average_rating?.toFixed(1) || '0.0'}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Home;