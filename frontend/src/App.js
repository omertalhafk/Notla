import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import authService from './services/authService';

// Pages (henüz oluşturmadık, sonra ekleyeceğiz)
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import CourseDetail from './pages/CourseDetail';

// Protected Route (Giriş gerektiren sayfalar için)
const ProtectedRoute = ({ children }) => {
    return authService.isAuthenticated() ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    
                    {/* Protected Routes */}
                    <Route 
                        path="/" 
                        element={
                            <ProtectedRoute>
                                <Home />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/course/:id" 
                        element={
                            <ProtectedRoute>
                                <CourseDetail />
                            </ProtectedRoute>
                        } 
                    />
                    
                    {/* Default redirect */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;