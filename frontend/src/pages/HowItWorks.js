import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaUserPlus, FaFolderOpen, FaUpload, FaMedal } from 'react-icons/fa';

const steps = [
  {
    title: 'Hesap Oluştur',
    desc: 'etu.edu.tr mail adresinle saniyeler içinde Notla hesabı aç.',
    icon: <FaUserPlus size={26} />,
  },
  {
    title: 'Dersini Seç',
    desc: 'Departmanına göre filtrele, ilgilendiğin dersin güncel notlarını keşfet.',
    icon: <FaFolderOpen size={26} />,
  },
  {
    title: 'Not Yükle',
    desc: 'Kendi notlarını toplulukla paylaş, herkesin işini kolaylaştır.',
    icon: <FaUpload size={26} />,
  },
  {
    title: 'Rozet Kazan',
    desc: 'Katkın görünür olsun: dijital rozetin profilinde parlasın.',
    icon: <FaMedal size={26} />,
  },
];

const HowItWorks = () => {
  return (
    <div className="how-page">
      <Container>
        <header className="how-hero text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            Sistem Nasıl Çalışır?
          </motion.h1>
          <p>Not paylaşım döngüsünü dört adımda tamamla, topluluğun bir parçası ol.</p>
        </header>

        <div className="how-flow">
          {steps.map((step, index) => (
            <React.Fragment key={step.title}>
              <motion.div
                className={`how-step-card ${index === steps.length - 1 ? 'final-step' : ''}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
                viewport={{ once: true, amount: 0.4 }}
              >
                <div className="step-icon">{step.icon}</div>
                <h4>{step.title}</h4>
                <p>{step.desc}</p>
              </motion.div>
              {index < steps.length - 1 && (
                <div className="how-connector">
                  <span className="connector-dot" />
                  <span className="connector-line" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="text-center mt-4">
          <Button className="how-cta-btn" href="/register">
            İlk Adımı At
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default HowItWorks;

