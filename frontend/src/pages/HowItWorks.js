import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { motion } from 'framer-motion';

const steps = [
  { number: '1', title: 'Üye Ol', desc: 'Hızlıca kayıt ol ve topluluğa katıl.' },
  { number: '2', title: 'Dersini Seç', desc: 'İlgili dersini bul ve detaylarını incele.' },
  { number: '3', title: 'Notunu İndir veya Yükle', desc: 'Topluluktan indir, katkın için rozetini sergile.' },
];

const HowItWorks = () => {
  return (
    <div className="how-page">
      <Container>
        <header className="page-header text-center">
          <h2>Nasıl Çalışır?</h2>
          <p>Üç basit adımda Notla deneyimine başla.</p>
        </header>
        <Row className="g-4">
          {steps.map((step, index) => (
            <Col md={4} key={step.number}>
              <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.15 }} viewport={{ once: true }}>
                <Card className="how-card h-100 text-center">
                  <Card.Body>
                    <div className="step-number">{step.number}</div>
                    <Card.Title>{step.title}</Card.Title>
                    <Card.Text>{step.desc}</Card.Text>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default HowItWorks;

