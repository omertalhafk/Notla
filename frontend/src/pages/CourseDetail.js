import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Tabs,
  Tab,
  Button,
  Modal,
  Form,
  Alert,
  ListGroup,
  Spinner,
} from 'react-bootstrap';
import { motion } from 'framer-motion';
import { courseService } from '../services/api';

const CourseDetail = ({ user }) => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('notes');
  const [modalOpen, setModalOpen] = useState(false);
  const [noteForm, setNoteForm] = useState({ title: '', file: null });
  const [noteError, setNoteError] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [reviewFeedback, setReviewFeedback] = useState({ variant: '', message: '' });

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await courseService.getCourseDetail(id);
        setCourse(data);
      } catch (err) {
        setError('Ders bilgisi alınırken bir sorun oluştu.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const handleFileChange = (event) => {
    setNoteError('');
    setNoteForm((prev) => ({ ...prev, file: event.target.files[0] }));
  };

  const handleNoteSubmit = async (event) => {
    event.preventDefault();
    if (!noteForm.title || !noteForm.file) {
      setNoteError('Lütfen tüm alanları doldurun.');
      return;
    }
    const formData = new FormData();
    formData.append('title', noteForm.title);
    formData.append('file', noteForm.file);
    try {
      await courseService.uploadNote(id, formData);
      setModalOpen(false);
      setNoteForm({ title: '', file: null });
      setCourse((prev) => ({
        ...prev,
        notes: [{ title: noteForm.title, file: '#', id: Date.now() }, ...(prev?.notes || [])],
      }));
    } catch (err) {
      setNoteError('Not yüklenirken bir hata oluştu.');
    }
  };

  const handleReviewSubmit = async (event) => {
    event.preventDefault();
    if (!reviewText.trim()) return;
    try {
      const comment = reviewText.trim();
      await courseService.submitReview(id, { comment });
      setReviewFeedback({ variant: 'success', message: 'Değerlendirmeniz kaydedildi.' });
      setReviewText('');
      setCourse((prev) => ({
        ...prev,
        reviews: [{ comment, id: Date.now(), user: user?.username || 'Anonim' }, ...(prev?.reviews || [])],
      }));
      setTimeout(() => setReviewFeedback({ variant: '', message: '' }), 3000);
    } catch (err) {
      setReviewFeedback({ variant: 'danger', message: 'Değerlendirme kaydedilemedi.' });
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <div className="course-detail-page">
      <Container>
        <Row className="py-4">
          <Col md={8}>
            <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              {course?.name}
            </motion.h2>
            <p className="text-muted">{course?.description}</p>
          </Col>
          <Col md={4} className="text-md-end text-center">
            <Button variant="primary" onClick={() => setModalOpen(true)}>
              Not Yükle
            </Button>
          </Col>
        </Row>
        <Tabs activeKey={activeTab} onSelect={(key) => setActiveTab(key || 'notes')} className="mb-4">
          <Tab eventKey="notes" title="Ders Notları">
            <ListGroup variant="flush">
              {(course?.notes || []).map((note) => (
                <ListGroup.Item key={note.id} className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{note.title}</strong>
                    {note.uploader && <small className="d-block text-muted">{note.uploader}</small>}
                  </div>
                  <Button variant="outline-primary" href={note.file} target="_blank" rel="noreferrer">
                    İndir
                  </Button>
                </ListGroup.Item>
              ))}
              {!course?.notes?.length && <p className="text-muted py-3">Henüz not eklenmemiş.</p>}
            </ListGroup>
          </Tab>
          <Tab eventKey="reviews" title="Değerlendirmeler">
            <div className="mb-4">
              <h5>Yorum Yaz</h5>
              <Form onSubmit={handleReviewSubmit}>
                <Form.Group className="mb-3">
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Ders hakkındaki düşünceleriniz..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                  />
                </Form.Group>
                <Button type="submit" disabled={!reviewText.trim()}>
                  Gönder
                </Button>
              </Form>
              {reviewFeedback.message && (
                <Alert className="mt-3" variant={reviewFeedback.variant}>
                  {reviewFeedback.message}
                </Alert>
              )}
            </div>
            <ListGroup variant="flush">
              {(course?.reviews || []).map((review) => (
                <ListGroup.Item key={review.id}>
                  <strong>{review.user || 'Anonim'}</strong>
                  <p className="mb-0">{review.comment}</p>
                </ListGroup.Item>
              ))}
              {!course?.reviews?.length && <p className="text-muted">Henüz değerlendirme bulunmuyor.</p>}
            </ListGroup>
          </Tab>
        </Tabs>
      </Container>

      <Modal show={modalOpen} onHide={() => setModalOpen(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Not Yükle</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {noteError && <Alert variant="danger">{noteError}</Alert>}
          <Form onSubmit={handleNoteSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Başlık</Form.Label>
              <Form.Control
                type="text"
                placeholder="Örneğin: Vize Notları"
                value={noteForm.title}
                onChange={(e) => setNoteForm((prev) => ({ ...prev, title: e.target.value }))}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Dosya</Form.Label>
              <Form.Control type="file" onChange={handleFileChange} />
            </Form.Group>
            <Button type="submit" className="w-100">
              Yüklemeyi Tamamla
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CourseDetail;

