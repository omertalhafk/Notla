import React, { useEffect, useMemo, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import NotlaNavbar from './components/Navbar';
import Home from './pages/Home';
import Departments from './pages/Departments';
import CourseList from './pages/CourseList';
import CourseDetail from './pages/CourseDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import HowItWorks from './pages/HowItWorks';
import Profile from './pages/Profile';
import About from './pages/About';

const AnimatedRoutes = ({ user, onLoginSuccess, onLogout }) => {
  const location = useLocation();

  return (
    <>
      <NotlaNavbar user={user} onLogout={onLogout} />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/departmanlar" element={<Departments />} />
          <Route path="/courses" element={<CourseList user={user} />} />
          <Route path="/courses/:id" element={<CourseDetail user={user} />} />
          <Route path="/nasil-calisir" element={<HowItWorks />} />
          <Route path="/hakkimizda" element={<About />} />
          <Route path="/login" element={<Login onLoginSuccess={onLoginSuccess} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profil" element={<Profile user={user} />} />
        </Routes>
      </AnimatePresence>
    </>
  );
};

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('notlaUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('notlaUser', JSON.stringify(userData));
    if (userData.token) {
      localStorage.setItem('notlaToken', userData.token);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('notlaUser');
    localStorage.removeItem('notlaToken');
  };

  const memoizedHandlers = useMemo(
    () => ({
      onLoginSuccess: handleLoginSuccess,
      onLogout: handleLogout,
    }),
    []
  );

  return (
    <Router>
      <AnimatedRoutes user={user} {...memoizedHandlers} />
    </Router>
  );
};

export default App;

