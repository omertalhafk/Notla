import React, { useEffect, useMemo, useState } from 'react';
import { Container, Row, Col, Card, Spinner, Alert, Button } from 'react-bootstrap';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { courseService } from '../services/api';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await courseService.getCourses();
        setCourses(data || []);
      } catch (err) {
        setError('Dersler yüklenirken bir sorun oluştu.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = useMemo(() => {
    const dept = searchParams.get('dept');
    if (!dept) return courses;
    if (dept === 'BIL') {
      return courses.filter((course) => course.code?.startsWith('BIL'));
    }
    if (dept === 'YZM') {
      return courses.filter((course) => course.code?.startsWith('YZM') || course.code?.startsWith('AI'));
    }
    return courses;
  }, [courses, searchParams]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="d-flex justify-content-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      );
    }

    if (error) {
      return <Alert variant="danger">{error}</Alert>;
    }

    if (!filteredCourses.length) {
      return <Alert variant="secondary">Aradığınız kriterde ders bulunamadı.</Alert>;
    }

    return (
      <Row className="g-4">
        {filteredCourses.map((course) => (
          <Col md={4} key={course.id}>
            <motion.div whileHover={{ y: -6 }}>
              <Card className="course-card h-100">
                <Card.Body>
                  <Card.Subtitle className="mb-2 text-muted">{course.code}</Card.Subtitle>
                  <Card.Title>{course.name}</Card.Title>
                  <Card.Text className="text-truncate-multiline">{course.description}</Card.Text>
                  <Button variant="primary" onClick={() => navigate(`/courses/${course.id}`)}>
                    Detayları Gör
                  </Button>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>
    );
  };

  return (
    <div className="course-list-page">
      <Container>
        <header className="page-header">
          <h2>Dersler</h2>
          <p>İlgini çeken dersi seç, notları incele.</p>
        </header>
        {renderContent()}
      </Container>
    </div>
  );
};

export default CourseList;

