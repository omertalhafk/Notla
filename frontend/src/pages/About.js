import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FiUsers, FiAward, FiShield, FiTarget } from 'react-icons/fi';

const metricCards = [
  { label: 'Aktif Öğrenci', value: '2.400+', desc: 'Her dönemde paylaşıma açık kullanıcı' },
  { label: 'Not Arşivi', value: '5.800+', desc: 'Güncel ders dokümanı' },
  { label: 'Rozetli Üye', value: '320+', desc: 'Katkısıyla öne çıkan öğrenci' },
];

const pillarCards = [
  {
    title: 'Topluluk Gücü',
    description:
      'Her paylaşım, başka bir öğrencinin sınav öncesi nefes almasını sağlar. Notla, dayanışma kültürünü görünür kılar.',
    icon: <FiUsers size={28} />,
  },
  {
    title: 'Rozet Kültürü',
    description:
      'Not yükleyen herkes dijital bir rozet kazanır. Bu rozet yalnızca emeğinizi temsil eder; maddi ya da akademik bir avantaj sunmaz.',
    icon: <FiAward size={28} />,
  },
  {
    title: 'Şeffaflık',
    description:
      'Her notun kim tarafından ve ne zaman yüklendiği topluluk içinde açıkça görüntülenir; güven tek önceliğimizdir.',
    icon: <FiShield size={28} />,
  },
  {
    title: 'Misyondan İlham',
    description:
      'Amacımız TOBB ETÜ’de sürdürülebilir, paylaşımcı ve öğrencinin öğrenciyi yükselttiği bir öğrenme döngüsü kurmak.',
    icon: <FiTarget size={28} />,
  },
];

const About = () => {
  return (
    <div className="about-page">
      <Container>
        <header className="about-hero text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="about-title">
            TOBB ETÜ’de Bilgi Paylaşımının Yeni Dili
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="about-lead"
          >
            Notla, sadece TOBB ETÜ öğrencilerinin notlarını güvenle sakladığı değil, aynı zamanda katkılarını rozetleriyle
            sergilediği seçkin bir paylaşım alanıdır.
          </motion.p>
        </header>

        <Row className="g-4 about-stats">
          {metricCards.map((metric, index) => (
            <Col md={4} key={metric.label}>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                <div className="metric-card">
                  <span className="metric-value">{metric.value}</span>
                  <small>{metric.label}</small>
                  <p>{metric.desc}</p>
                </div>
              </motion.div>
            </Col>
          ))}
        </Row>

        <Row className="g-4 mt-1">
          {pillarCards.map((pillar, index) => (
            <Col md={6} key={pillar.title}>
              <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.15 }}>
                <Card className="about-card h-100">
                  <Card.Body>
                    <div className="about-icon">{pillar.icon}</div>
                    <h4>{pillar.title}</h4>
                    <p>{pillar.description}</p>
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

export default About;

