import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="brand-logo">
              <div className="logo-icon">
                <span className="logo-symbol">🏥</span>
              </div>
              <div className="logo-text">
                <h3 className="brand-name">WeCare</h3>
                <p className="brand-tagline">Your Health, Our Priority</p>
              </div>
            </div>
            <p className="brand-description">
              Providing quality healthcare services with compassion and excellence.
            </p>
          </div>
          
          <div className="footer-links">
            <div className="link-section">
              <h4>Services</h4>
              <ul>
                <li><a href="#">Emergency Care</a></li>
                <li><a href="#">General Medicine</a></li>
                <li><a href="#">Specialist Care</a></li>
                <li><a href="#">Health Checkups</a></li>
              </ul>
            </div>
            
            <div className="link-section">
              <h4>About</h4>
              <ul>
                <li><a href="#">Our Story</a></li>
                <li><a href="#">Our Team</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Contact</a></li>
              </ul>
            </div>
            
            <div className="link-section">
              <h4>Support</h4>
              <ul>
                <li><a href="#">Help Center</a></li>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
                <li><a href="#">Feedback</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-divider"></div>
          <div className="bottom-content">
            <p className="copyright">
              © 2024 WeCare. All rights reserved.
            </p>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="Facebook">
                <span>📘</span>
              </a>
              <a href="#" className="social-link" aria-label="Twitter">
                <span>🐦</span>
              </a>
              <a href="#" className="social-link" aria-label="LinkedIn">
                <span>💼</span>
              </a>
              <a href="#" className="social-link" aria-label="Instagram">
                <span>📷</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;