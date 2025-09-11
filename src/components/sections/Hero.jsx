import React, { useEffect, useRef } from 'react';
import './Hero.css';

const Hero = ({ onOpenAuthModal }) => {
  const heroRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="hero" ref={heroRef}>
      <div className="hero-background">
        <div className="gradient-mesh"></div>
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
          <div className="shape shape-5"></div>
        </div>
      </div>
      
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-icon">🏥</span>
            <span className="badge-text">Digital Health Initiative</span>
          </div>
          
          <h1 className="hero-title">
            Transforming Healthcare Access for <span className="title-highlight">Kerala's Migrant Community</span>
          </h1>
          
          <div className="hero-description">
            <p className="description-main">
              Addressing the critical healthcare gap faced by over 2.5 million migrant workers in Kerala through innovative digital health record solutions that ensure equitable access to quality healthcare services.
            </p>
            
            <div className="problem-solution-grid">
              <div className="problem-card">
                <div className="card-icon problem-icon">⚠️</div>
                <h3>The Challenge</h3>
                <p>85% of migrant workers lack proper health documentation, creating barriers to healthcare access and emergency treatment.</p>
              </div>
              
              <div className="solution-card">
                <div className="card-icon solution-icon">💡</div>
                <h3>Our Solution</h3>
                <p>Comprehensive digital health records ensuring healthcare equity, supporting SDG goals, and strengthening public health infrastructure.</p>
              </div>
            </div>
          </div>
          
          <div className="impact-metrics">
            <div className="metric-item">
              <div className="metric-number">2.5M+</div>
              <div className="metric-label">Migrant Workers</div>
              <div className="metric-description">in Kerala requiring health documentation</div>
            </div>
            <div className="metric-item">
              <div className="metric-number">85%</div>
              <div className="metric-label">Coverage Gap</div>
              <div className="metric-description">currently without proper health records</div>
            </div>
            <div className="metric-item">
              <div className="metric-number">100%</div>
              <div className="metric-label">Our Goal</div>
              <div className="metric-description">universal health record coverage</div>
            </div>
          </div>
          
          <div className="hero-actions">
            <button className="primary-cta" onClick={() => onOpenAuthModal && onOpenAuthModal('signup')}>
              <span className="cta-icon">🚀</span>
              <span className="cta-text">Start Health Registration</span>
              <div className="cta-glow"></div>
            </button>
            
            <button className="secondary-cta">
              <span className="cta-icon">📊</span>
              <span className="cta-text">View Impact Report</span>
            </button>
          </div>
          
          <div className="trust-indicators">
            <div className="trust-item">
              <span className="trust-icon">🔒</span>
              <span>Secure & Confidential</span>
            </div>
            <div className="trust-item">
              <span className="trust-icon">✓</span>
              <span>Government Approved</span>
            </div>
            <div className="trust-item">
              <span className="trust-icon">🌟</span>
              <span>Free Registration</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;