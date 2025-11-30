import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaCloudUploadAlt, FaBookOpen, FaCertificate } from 'react-icons/fa';

const featureCards = [
  {
    title: 'Kolay Erişim',
    description: 'Ders notlarını tek tıkla bul, indir ve paylaş.',
    icon: <FaBookOpen size={32} />,
  },
  {
    title: 'Güncel Notlar',
    description: 'Topluluk tarafından sürekli güncellenen içerikler.',
    icon: <FaCloudUploadAlt size={32} />,
  },
  {
    title: 'Rozetini Sergile',
    description: 'Not yükleyen öğrenciler, katkılarını temsil eden özel bir rozet kazanır.',
    icon: <FaCertificate size={32} />,
  },
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <section className="hero-section">
        <Container>
          <Row className="align-items-center">
            <Col md={7}>
              <motion.h1
                className="hero-title"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                Ders Notlarına Hükmet!
              </motion.h1>
              <motion.p
                className="hero-subtitle"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                TOBB ETÜ’de ders notlarına hızlıca ulaş, topluluğa katkını rozetinle göster.
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="hero-cta">
                <Button size="lg" onClick={() => navigate('/departmanlar')} className="hero-btn">
                  Hemen Başla
                </Button>
              </motion.div>
            </Col>
            <Col md={5}>
              <motion.div
                className="hero-visual"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
              >
                <div className="neon-art">
                  <div className="neon-square" />
                  <div className="neon-circle" />
                  <div className="neon-trail" />
                </div>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="features-section">
        <Container>
          <Row className="g-4">
            {featureCards.map((feature) => (
              <Col md={4} key={feature.title}>
                <motion.div whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 120 }}>
                  <Card className="feature-card h-100">
                    <Card.Body>
                      <div className="feature-icon">{feature.icon}</div>
                      <Card.Title>{feature.title}</Card.Title>
                      <Card.Text>{feature.description}</Card.Text>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section className="about-section">
        <Container>
          <Row className="align-items-center">
            <Col md={7}>
              <motion.h2 initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                Notla Hakkında
              </motion.h2>
              <p>
                Notla, TOBB ETÜ öğrencilerinin ders notlarını paylaşabildiği, sadece topluluğa görünürlük kazandıran
                rozet sistemiyle desteklenen modern bir platformdur.
              </p>
            </Col>
            <Col md={5}>
              <motion.div whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 20 }} viewport={{ once: true }}>
                <Button className="about-cta-btn w-100" onClick={() => navigate('/hakkimizda')}>
                  Hakkımızda Sayfasına Git
                </Button>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Home;

