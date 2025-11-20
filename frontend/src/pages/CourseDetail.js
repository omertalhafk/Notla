import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import courseService from "../services/courseService";
import { Button } from "react-bootstrap";
import './CourseDetail.css';


const CourseDetail = () => {
  const { id } = useParams();

  const [course, setCourse] = useState(null);
  const [activeTab, setActiveTab] = useState("notes");
  const [loading, setLoading] = useState(true);

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

  if (loading) return <p>Ders yükleniyor...</p>;
  if (!course) return <p>Ders bulunamadı.</p>;

  return (
    <div className="course-detail">
      <div className="course-detail-wrapper">
        <h2>{course.name}</h2>

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


      {/* ---------------- YORUMLAR TAB ---------------- */}
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
    </div>
  );
};

export default CourseDetail;
