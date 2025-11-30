import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import authService from "../services/authService";

const Register = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    if (!form.username.trim()) {
      setError('Kullanıcı adı zorunludur.');
      return false;
    }
    if (!form.email.endsWith('@etu.edu.tr')) {
      setError('Sadece etu.edu.tr uzantılı e-postalar kabul edilir.');
      return false;
    }
    if (form.password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır.');
      return false;
    }
    if (form.password !== form.confirmPassword) {
      setError('Şifreler uyuşmuyor.');
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
      await authService.register({
        username: form.username,
        email: form.email,
        password: form.password,
        password_confirm: form.confirmPassword,
      });
      setSuccess('Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz.');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError('Kayıt işlemi sırasında bir hata oluştu.');
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
                  <h3 className="mb-3">Kayıt Ol</h3>
                  <p className="text-muted mb-4">TOBB ETÜ topluluğuna katıl, notlarını paylaş.</p>
                  {error && <Alert variant="danger">{error}</Alert>}
                  {success && <Alert variant="success">{success}</Alert>}
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>Kullanıcı Adı</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="notla_ogrenci"
                        value={form.username}
                        onChange={(e) => setForm((prev) => ({ ...prev, username: e.target.value }))}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>E-posta</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="ad.soyad@etu.edu.tr"
                        value={form.email}
                        onChange={(e) =>
                          setForm((prev) => ({ ...prev, email: e.target.value.toLowerCase().trim() }))
                        }
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Şifre</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Şifrenizi giriniz"
                        value={form.password}
                        onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                      />
                    </Form.Group>
                    <Form.Group className="mb-4">
                      <Form.Label>Şifre Tekrar</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Şifrenizi tekrar giriniz"
                        value={form.confirmPassword}
                        onChange={(e) => setForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                      />
                    </Form.Group>
                    <Button type="submit" disabled={loading} className="w-100">
                      {loading ? 'Kayıt yapılıyor...' : 'Kayıt Ol'}
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register;

