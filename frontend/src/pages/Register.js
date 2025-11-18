import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';
import './Login.css'; // Aynı CSS'i kullanıyoruz

function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        password_confirm: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.password_confirm) {
            setError('Şifreler eşleşmiyor!');
            return;
        }

        setLoading(true);

        try {
            await authService.register(
                formData.email,
                formData.username,
                formData.password,
                formData.password_confirm
            );
            alert('Kayıt başarılı! Şimdi giriş yapabilirsiniz.');
            navigate('/login');
        } catch (err) {
            const errorData = err.response?.data;
            if (errorData?.email) {
                setError(errorData.email[0]);
            } else if (errorData?.username) {
                setError(errorData.username[0]);
            } else {
                setError('Kayıt başarısız!');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h1>NOTLA</h1>
                <h2>Kayıt Ol</h2>
                
                {error && <div className="error-message">{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="ornek@tobb.edu.tr"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Kullanıcı Adı</label>
                        <input
                            type="text"
                            name="username"
                            placeholder="kullaniciadi"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Şifre</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Şifre Tekrar</label>
                        <input
                            type="password"
                            name="password_confirm"
                            placeholder="••••••••"
                            value={formData.password_confirm}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? 'Kaydediliyor...' : 'Kayıt Ol'}
                    </button>
                </form>

                <p className="register-link">
                    Hesabın var mı? <Link to="/login">Giriş Yap</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;