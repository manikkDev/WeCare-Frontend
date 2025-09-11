import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Hero from './components/sections/Hero';
import Features from './components/sections/Features';
import Footer from './components/sections/Footer';
import AuthModal from './components/auth/AuthModal';
import Functionality from './pages/Functionality';
import './App.css';

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('signin');
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for existing authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const openAuthModal = (mode) => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Update state
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/" 
            element={
              isAuthenticated ? (
                <Navigate to="/functionality" replace />
              ) : (
                <>
                  <Navbar onOpenAuthModal={openAuthModal} />
                  <Hero onOpenAuthModal={openAuthModal} />
                  <Features />
                  <Footer />
                </>
              )
            } 
          />
          <Route 
            path="/functionality" 
            element={
              isAuthenticated ? (
                <Functionality user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
        </Routes>
        
        <AuthModal 
          isOpen={isAuthModalOpen}
          onClose={closeAuthModal}
          initialMode={authMode}
          onAuthSuccess={handleAuthSuccess}
        />
      </div>
    </Router>
  );
}

export default App;
