import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import authService from "../services/authService";

const Login = ({ onLoginSuccess }) => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    if (!form.email.includes('@')) {
      setError('Lütfen geçerli bir email giriniz.');
      return false;
    }
    if (form.password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const { data } = await authService.login({ email: form.email, password: form.password });
      onLoginSuccess?.(data);
      navigate('/');
    } catch (err) {
      setError('Giriş başarısız. Bilgilerinizi kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Container>
        <Row className="justify-content-center">
          <Col md={6}>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="auth-card">
                <Card.Body>
                  <h3 className="mb-3">Giriş Yap</h3>
                  <p className="text-muted mb-4">Notlarını yönetmek için hesabına giriş yap.</p>
                  {error && <Alert variant="danger">{error}</Alert>}
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>E-posta</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="ornek@universite.edu"
                        value={form.email}
                        onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                      />
                    </Form.Group>
                    <Form.Group className="mb-4">
                      <Form.Label>Şifre</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Şifrenizi giriniz"
                        value={form.password}
                        onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                      />
                    </Form.Group>
                    <Button type="submit" disabled={loading} className="w-100">
                      {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
                    </Button>
                  </Form>
                  <div className="auth-alt-link">
                    <span>Hesabınız yok mu?</span>
                    <Button
                      variant="link"
                      className="p-0 text-decoration-none text-light fw-semibold"
                      onClick={() => navigate('/register')}
                    >
                      Kayıt Ol
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;

