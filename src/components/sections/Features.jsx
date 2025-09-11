import React, { useEffect, useRef } from 'react';
import './Features.css';

const Features = () => {
  const featuresRef = useRef(null);
  const cardsRef = useRef([]);

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

    if (featuresRef.current) {
      observer.observe(featuresRef.current);
    }

    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      id: 1,
      icon: '🏥',
      title: 'Medical History Vault',
      description: 'One secure timeline for diagnoses, prescriptions, and scans.',
      gradient: 'linear-gradient(135deg, #667eea, #764ba2)',
      delay: '0.1s'
    },
    {
      id: 2,
      icon: '📄',
      title: 'Upload + OCR Report Parsing',
      description: 'Single-click upload → automated extraction of test names and values.',
      gradient: 'linear-gradient(135deg, #f093fb, #f5576c)',
      delay: '0.2s'
    },
    {
      id: 3,
      icon: '🤖',
      title: 'LLM Report Summary',
      description: 'Clear, empathetic plain-English summary + flagged concerns.',
      gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)',
      delay: '0.3s'
    },
    {
      id: 4,
      icon: '💡',
      title: 'Actionable Recommendations',
      description: 'Food, lifestyle, and follow-up suggestions tied to flagged values.',
      gradient: 'linear-gradient(135deg, #43e97b, #38f9d7)',
      delay: '0.4s'
    },
    {
      id: 5,
      icon: '🎯',
      title: 'Preventive AI Coach',
      description: '7-day adaptive micro-plans (meals, activity, check-ins) that change based on adherence.',
      gradient: 'linear-gradient(135deg, #fa709a, #fee140)',
      delay: '0.5s'
    },
    {
      id: 6,
      icon: '💊',
      title: 'Medication Scheduler',
      description: 'Timed notifications + adherence tracking.',
      gradient: 'linear-gradient(135deg, #a8edea, #fed6e3)',
      delay: '0.6s'
    },
    {
      id: 7,
      icon: '👨‍⚕️',
      title: 'Secure Share + Doctor Dashboard',
      description: 'Time-limited share links & doctor dashboard; clinicians review/approve AI suggestions.',
      gradient: 'linear-gradient(135deg, #d299c2, #fef9d7)',
      delay: '0.7s'
    },
    {
      id: 8,
      icon: '🔒',
      title: 'Privacy & Compliance Built-in',
      description: 'Opt-in sharing, revocable links, audit logs, encryption.',
      gradient: 'linear-gradient(135deg, #89f7fe, #66a6ff)',
      delay: '0.8s'
    }
  ];

  return (
    <section className="features" ref={featuresRef}>
      <div className="features-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
        <div className="floating-particles"></div>
      </div>

      <div className="features-container">
        <div className="features-header">
          <div className="section-badge">
            <span className="badge-icon">✨</span>
            <span>Core Features</span>
          </div>
          <h2 className="features-title">
            <span className="title-line-1">Advanced Health</span>
            <span className="title-line-2">
              <span className="highlight-word">Intelligence</span> & 
              <span className="highlight-word">Care</span>
            </span>
          </h2>
          <p className="features-subtitle">
            Comprehensive suite of AI-powered tools designed to revolutionize 
            personal health management and clinical decision-making.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div 
              key={feature.id}
              className="feature-card"
              ref={(el) => (cardsRef.current[index] = el)}
              style={{
                '--animation-delay': feature.delay,
                '--gradient': feature.gradient
              }}
            >
              <div className="feature-card-inner">
                <div className="feature-icon-container">
                  <div className="feature-icon-wrapper">
                    <span className="feature-icon">{feature.icon}</span>
                    <div className="icon-glow"></div>
                  </div>
                  <div className="feature-number">{String(feature.id).padStart(2, '0')}</div>
                </div>
                
                <div className="feature-content">
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </div>
                
                <div className="feature-overlay"></div>
                <div className="feature-border"></div>
              </div>
            </div>
          ))}
        </div>

        <div className="features-footer">
          <div className="integration-badges">
            <div className="integration-badge">
              <span className="badge-icon">🔗</span>
              <span>API Integration Ready</span>
            </div>
            <div className="integration-badge">
              <span className="badge-icon">⚡</span>
              <span>Real-time Processing</span>
            </div>
            <div className="integration-badge">
              <span className="badge-icon">🛡️</span>
              <span>HIPAA Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;