import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import courseService from "../services/courseService";
import { Button } from "react-bootstrap";
import "./CourseDetail.css";

const CourseDetail = () => {
  const { id } = useParams();

  const [course, setCourse] = useState(null);
  const [activeTab, setActiveTab] = useState("notes");
  const [loading, setLoading] = useState(true);

  // Not yükleme form state
  const [showUpload, setShowUpload] = useState(false);
  const [noteForm, setNoteForm] = useState({
    title: "",
    description: "",
    file_type: "pdf",
    file: null,
  });

  // Review form state
  const [showReview, setShowReview] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: "",
    difficulty: 3,
    workload: 3,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await courseService.getCourseDetail(id);
        setCourse(data);
      } catch (e) {
        console.error("Ders yüklenemedi", e);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  // Not yükleme
  const handleUpload = async () => {
    try {
      if (!noteForm.file) {
        alert("Lütfen bir dosya seçin.");
        return;
      }

      const fd = new FormData();
      fd.append("title", noteForm.title);
      fd.append("description", noteForm.description);
      fd.append("file_type", noteForm.file_type);
      fd.append("file", noteForm.file);

      await courseService.uploadNote(id, fd);
      alert("Not başarıyla yüklendi!");

      setShowUpload(false);

      // listeyi yenile
      const d = await courseService.getCourseDetail(id);
      setCourse(d);
    } catch (err) {
      console.error("Not yüklenemedi", err);
      alert("Not yüklenirken hata oluştu. (Konsola bak)");
    }
  };

  // Yorum gönderme
  const handleReviewSubmit = async () => {
    try {
      if (!reviewForm.comment.trim()) {
        alert("Lütfen bir yorum yazın.");
        return;
      }
      await courseService.createReview(id, reviewForm);

      alert("Değerlendirme eklendi!");
      setShowReview(false);

      const d = await courseService.getCourseDetail(id);
      setCourse(d);
    } catch (err) {
      console.error("Yorum eklenemedi:", err);
      alert("Yorum eklenirken hata oluştu. (Muhtemelen 401: Giriş yapman gerekiyor)");
    }
  };

  if (loading) return <p>Ders yükleniyor...</p>;
  if (!course) return <p>Ders bulunamadı.</p>;

  return (
    <div className="course-detail">
      <div className="course-detail-wrapper">
        <h2>{course.name}</h2>

        <div className="tabs-row">
          <div className="tabs">
            <Button
              variant={activeTab === "notes" ? "primary" : "outline-primary"}
              onClick={() => setActiveTab("notes")}
            >
              Ders Notları
            </Button>

            <Button
              variant={activeTab === "reviews" ? "primary" : "outline-primary"}
              onClick={() => setActiveTab("reviews")}
            >
              Değerlendirmeler
            </Button>
          </div>

          {activeTab === "notes" && (
            <button className="upload-btn" onClick={() => setShowUpload(true)}>
              Not Yükle
            </button>
          )}

          {activeTab === "reviews" && (
            <button className="upload-btn" onClick={() => setShowReview(true)}>
              Değerlendirme Yap
            </button>
          )}
        </div>
      </div>

      {/* ----- NOTLAR TAB ----- */}
      {activeTab === "notes" && (
        <div className="notes-grid">
          {course.notes && course.notes.length > 0 ? (
            course.notes.map((note) => (
              <div key={note.id} className="note-card">
                <h4 className="note-title">{note.title}</h4>
                <p className="note-desc">{note.description}</p>

                <a
                  href={note.file_url}
                  target="_blank"
                  rel="noreferrer"
                  className="note-button"
                >
                  📄 Dosyayı Aç
                </a>
              </div>
            ))
          ) : (
            <p className="empty-text">Henüz not eklenmemiş.</p>
          )}
        </div>
      )}

      {/* ----- YORUMLAR TAB ----- */}
      {activeTab === "reviews" && (
        <div className="reviews-section">
          {course.reviews && course.reviews.length > 0 ? (
            course.reviews.map((review) => (
              <div key={review.id} className="review-card">
                <strong>{review.rating} ⭐</strong>
                <p>{review.comment}</p>
              </div>
            ))
          ) : (
            <p>Henüz değerlendirme yapılmamış.</p>
          )}
        </div>
      )}

      {/* NOT YÜKLE MODAL */}
      {showUpload && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Not Yükle</h3>

            <input
              type="text"
              placeholder="Başlık"
              className="modal-input"
              value={noteForm.title}
              onChange={(e) =>
                setNoteForm({ ...noteForm, title: e.target.value })
              }
            />

            <textarea
              placeholder="Açıklama"
              className="modal-input"
              value={noteForm.description}
              onChange={(e) =>
                setNoteForm({ ...noteForm, description: e.target.value })
              }
            />

            <select
              className="modal-input"
              value={noteForm.file_type}
              onChange={(e) =>
                setNoteForm({ ...noteForm, file_type: e.target.value })
              }
            >
              <option value="pdf">PDF</option>
              <option value="docx">Word</option>
              <option value="pptx">PowerPoint</option>
              <option value="jpg">JPG</option>
              <option value="png">PNG</option>
              <option value="txt">TXT</option>
              <option value="other">Diğer</option>
            </select>

            <input
              type="file"
              className="modal-input"
              onChange={(e) =>
                setNoteForm({ ...noteForm, file: e.target.files[0] })
              }
            />

            <button className="modal-btn" onClick={handleUpload}>
              Yükle
            </button>
            <button
              className="modal-close"
              onClick={() => setShowUpload(false)}
            >
              Kapat
            </button>
          </div>
        </div>
      )}

      {/* REVIEW MODAL */}
      {showReview && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Değerlendirme Yap</h3>

            <input
              type="number"
              min="1"
              max="5"
              className="modal-input"
              value={reviewForm.rating}
              onChange={(e) =>
                setReviewForm({ ...reviewForm, rating: e.target.value })
              }
            />

            <textarea
              className="modal-input"
              placeholder="Yorum"
              value={reviewForm.comment}
              onChange={(e) =>
                setReviewForm({ ...reviewForm, comment: e.target.value })
              }
            />

            <button className="modal-btn" onClick={handleReviewSubmit}>
              Gönder
            </button>

            <button
              className="modal-close"
              onClick={() => setShowReview(false)}
            >
              Kapat
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetail;
