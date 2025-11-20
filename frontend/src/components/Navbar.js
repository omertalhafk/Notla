import React from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import Logo from './Logo';

const mainLinks = [
  { label: 'Ana Sayfa', path: '/' },
  { label: 'Dersler', path: '/departmanlar' },
  { label: 'Nasıl Çalışır?', path: '/nasil-calisir' },
  { label: 'Hakkımızda', path: '/hakkimizda' },
];

const NotlaNavbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (event, path) => {
    event.preventDefault();
    navigate(path);
  };

  const handleAuthClick = (path) => {
    navigate(path);
  };

  const handleBrandClick = () => {
    navigate('/');
  };

  const renderAuthButtons = () => {
    if (user) {
      return (
        <div className="d-flex gap-2">
          <Button variant="outline-light" onClick={() => navigate('/profil')} className="nav-auth-btn">
            Profilim
          </Button>
          <Button variant="light" onClick={onLogout} className="nav-auth-btn">
            Çıkış Yap
          </Button>
        </div>
      );
    }

    return (
      <div className="hero-auth-buttons nav-auth-buttons">
        <Button variant="outline-light" onClick={() => handleAuthClick('/login')} className="hero-auth-btn hero-login-btn">
          Giriş Yap
        </Button>
        <Button onClick={() => handleAuthClick('/register')} className="hero-auth-btn hero-register-btn">
          Kayıt Ol
        </Button>
      </div>
    );
  };

  return (
    <Navbar expand="lg" className="notla-navbar" fixed="top">
      <Container>
        <Navbar.Brand onClick={handleBrandClick} className="brand-clickable">
          <div className="d-flex align-items-center gap-2">
            <Logo />
            <span>Notla</span>
          </div>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="notla-navbar-nav" />
        <Navbar.Collapse id="notla-navbar-nav" className="justify-content-between">
          <Nav className="me-auto align-items-lg-center">
            {mainLinks.map((link) => (
              <Nav.Link
                key={link.path}
                href={link.path}
                active={location.pathname === link.path}
                onClick={(e) => handleNavClick(e, link.path)}
                className="text-uppercase fw-semibold nav-link-item"
              >
                {link.label}
              </Nav.Link>
            ))}
          </Nav>
          <div className="d-flex align-items-center">{renderAuthButtons()}</div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NotlaNavbar;

