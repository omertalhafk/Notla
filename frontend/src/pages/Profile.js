import React from 'react';
import { Container, Card } from 'react-bootstrap';

const Profile = ({ user }) => {
  return (
    <div className="profile-page">
      <Container className="py-5">
        <Card className="auth-card">
          <Card.Body>
            <h3>Profilim</h3>
            <p className="text-muted">Merhaba {user?.username || 'Öğrenci'}!</p>
            <p>Profil detayları çok yakında burada olacak.</p>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default Profile;

