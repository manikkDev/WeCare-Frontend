import React, { useState, useEffect } from 'react';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose, initialMode = 'signin', onAuthSuccess }) => {
  const [mode, setMode] = useState(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: ''
  });
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
      generateParticles();
      // Reset form data when modal opens
      setFormData({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: ''
      });
    } else {
      setIsVisible(false);
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    setMode(initialMode);
    // Reset form data when mode changes
    setFormData({
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: ''
    });
  }, [initialMode]);

  const generateParticles = () => {
    const newParticles = [];
    for (let i = 0; i < 15; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
        delay: Math.random() * 2
      });
    }
    setParticles(newParticles);
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100
    });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const endpoint = mode === 'signin' ? '/api/auth/login' : '/api/auth/register';
      const payload = mode === 'signin' 
        ? { 
            email: formData.username, 
            password: formData.password 
          }
        : { 
            firstName: formData.firstName, 
            lastName: formData.lastName, 
            username: formData.username,
            email: formData.email, 
            password: formData.password 
          };
      
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Store token in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Call the success handler
        if (onAuthSuccess) {
          onAuthSuccess(data.user);
        }
        
        console.log('Authentication successful:', { mode, user: data.user });
      } else {
        console.error('Authentication failed:', data.message);
        alert(data.message || 'Authentication failed');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      alert('Network error. Please check if the backend server is running.');
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setShowPassword(false);
    setFormData({
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: ''
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (!isOpen) return null;

  return (
    <div className={`auth-modal-overlay ${isVisible ? 'visible' : ''}`} onClick={onClose}>
      <div 
        className={`auth-modal ${isVisible ? 'visible' : ''} ${mode}`}
        onClick={(e) => e.stopPropagation()}
        onMouseMove={handleMouseMove}
        style={{
          '--mouse-x': `${mousePosition.x}%`,
          '--mouse-y': `${mousePosition.y}%`
        }}
      >
        {/* Background Elements */}
        <div className="modal-background">
          <div className="gradient-mesh"></div>
          <div className="floating-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
            <div className="shape shape-4"></div>
          </div>
          <div className="particle-system">
            {particles.map(particle => (
              <div
                key={particle.id}
                className="modal-particle"
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  animationDelay: `${particle.delay}s`
                }}
              />
            ))}
          </div>
        </div>

        {/* Close Button */}
        <button className="modal-close" onClick={onClose}>
          <span className="close-icon">✕</span>
          <div className="close-ripple"></div>
        </button>

        {/* Modal Content */}
        <div className="modal-content">
          {/* Header */}
          <div className="modal-header">
            <div className="header-icon">
              <span className="icon-symbol">🏥</span>
              <div className="icon-pulse"></div>
            </div>
            <h2 className="modal-title">
              {mode === 'signin' ? 'Welcome Back' : 'Join WeCare'}
            </h2>
            <p className="modal-subtitle">
              {mode === 'signin' 
                ? 'Sign in to access your healthcare dashboard' 
                : 'Create your account to get started with personalized healthcare'
              }
            </p>
          </div>

          {/* Mode Toggle */}
          <div className="mode-toggle">
            <button 
              className={`toggle-btn ${mode === 'signin' ? 'active' : ''}`}
              onClick={() => switchMode('signin')}
            >
              <span className="btn-text">Sign In</span>
              <div className="btn-glow"></div>
            </button>
            <button 
              className={`toggle-btn ${mode === 'signup' ? 'active' : ''}`}
              onClick={() => switchMode('signup')}
            >
              <span className="btn-text">Sign Up</span>
              <div className="btn-glow"></div>
            </button>
            <div className="toggle-slider"></div>
          </div>

          {/* Form */}
          <form className="auth-form" onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <div className="input-container">
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Enter your first name"
                      required
                    />
                    <div className="input-glow"></div>
                    <div className="input-icon">👤</div>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <div className="input-container">
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Enter your last name"
                      required
                    />
                    <div className="input-glow"></div>
                    <div className="input-icon">👤</div>
                  </div>
                </div>
              </div>
            )}

            {mode === 'signup' && (
              <div className="form-group">
                <label className="form-label">Username</label>
                <div className="input-container">
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Choose a unique username"
                    required
                  />
                  <div className="input-glow"></div>
                  <div className="input-icon">@</div>
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">
                {mode === 'signin' ? 'Username or Email' : 'Email Address'}
              </label>
              <div className="input-container">
                <input
                  type={mode === 'signin' ? 'text' : 'email'}
                  name={mode === 'signin' ? 'username' : 'email'}
                  value={mode === 'signin' ? formData.username : formData.email}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder={mode === 'signin' ? 'Enter username or email' : 'Enter your email address'}
                  required
                />
                <div className="input-glow"></div>
                <div className="input-icon">{mode === 'signin' ? '👤' : '📧'}</div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="form-input password-input"
                  placeholder="Enter your password"
                  required
                />
                <div className="input-glow"></div>
                <div className="input-icon">🔒</div>
                <button
                  type="button"
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {mode === 'signin' && (
              <div className="form-options">
                <label className="checkbox-container">
                  <input type="checkbox" className="checkbox" />
                  <span className="checkmark"></span>
                  <span className="checkbox-text">Remember me</span>
                </label>
                <a href="#" className="forgot-link">Forgot password?</a>
              </div>
            )}



            <button type="submit" className="submit-btn">
              <span className="btn-content">
                <span className="btn-icon">{mode === 'signin' ? '🔓' : '🚀'}</span>
                <span className="btn-text">
                  {mode === 'signin' ? 'Sign In' : 'Create Account'}
                </span>
                <span className="btn-arrow">→</span>
              </span>
              <div className="btn-ripple"></div>
              <div className="btn-glow"></div>
            </button>
          </form>

          {/* Footer */}
          <div className="modal-footer">
            <div className="divider">
              <span className="divider-text">or</span>
            </div>
            <div className="social-auth">
              <button className="social-btn google">
                <span className="social-icon">🔍</span>
                <span className="social-text">Continue with Google</span>
                <div className="social-glow"></div>
              </button>
              <button className="social-btn facebook">
                <span className="social-icon">📘</span>
                <span className="social-text">Continue with Facebook</span>
                <div className="social-glow"></div>
              </button>
            </div>
            <p className="footer-text">
              {mode === 'signin' 
                ? "Don't have an account? " 
                : "Already have an account? "
              }
              <button 
                className="switch-link"
                onClick={() => switchMode(mode === 'signin' ? 'signup' : 'signin')}
              >
                {mode === 'signin' ? 'Sign up here' : 'Sign in here'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;