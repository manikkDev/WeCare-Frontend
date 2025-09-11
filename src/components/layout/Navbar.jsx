import React, { useState, useEffect } from 'react';
import Logo from '../common/Logo';
import './Navbar.css';

const Navbar = ({ onOpenAuthModal }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleAuthClick = (mode) => {
    if (onOpenAuthModal) {
      onOpenAuthModal(mode);
    }
    setIsMenuOpen(false); // Close mobile menu if open
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-brand">
          <Logo size="large" />
        </div>
        
        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <ul className="navbar-nav">
            <li className="nav-item">
              <a href="#home" className="nav-link">Home</a>
            </li>
            <li className="nav-item">
              <a href="#about" className="nav-link">About</a>
            </li>
            <li className="nav-item">
              <a href="#features" className="nav-link">Features</a>
            </li>
          </ul>
          
          <div className="auth-buttons">
            <button className="btn-signin" onClick={() => handleAuthClick('signin')}>Sign In</button>
            <button className="btn-signup" onClick={() => handleAuthClick('signup')}>Sign Up</button>
          </div>
        </div>
        
        <div className="navbar-toggle" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;