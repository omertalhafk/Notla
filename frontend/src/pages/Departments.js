import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaLaptopCode } from 'react-icons/fa';
import { GiRobotGolem } from 'react-icons/gi';
import { useNavigate } from 'react-router-dom';

const departments = [
  {
    title: 'Bilgisayar Mühendisliği',
    code: 'BIL',
    icon: <FaLaptopCode size={48} />,
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  },
  {
    title: 'Yapay Zeka Mühendisliği',
    code: 'YAP',
    icon: <GiRobotGolem size={48} />,
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  },
];

const Departments = () => {
  const navigate = useNavigate();

  const handleClick = (code) => {
    navigate(`/courses?dept=${code}`);
  };

  return (
    <div className="departments-page">
      <Container>
        <Row className="justify-content-center g-4">
          {departments.map((dept) => (
            <Col md={6} key={dept.code}>
              <motion.div
                className="department-card"
                style={{ backgroundImage: dept.gradient }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleClick(dept.code)}
              >
                <div className="department-icon">{dept.icon}</div>
                <h3>{dept.title}</h3>
                <p>{`Şimdi keşfet >`}</p>
              </motion.div>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default Departments;

