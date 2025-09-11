import React, { useState, useEffect } from 'react';
import './DashboardLoader.css';

const DashboardLoader = () => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    const stepInterval = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % 4);
    }, 1500);

    return () => {
      clearInterval(interval);
      clearInterval(stepInterval);
    };
  }, []);

  return (
    <div className="professional-loader">
      {/* Dynamic Background Grid */}
      <div className="grid-background">
        <div className="grid-lines">
          {[...Array(20)].map((_, i) => (
            <div key={i} className={`grid-line grid-line-${i}`}></div>
          ))}
        </div>
        <div className="floating-elements">
          {[...Array(8)].map((_, i) => (
            <div key={i} className={`floating-element element-${i + 1}`}></div>
          ))}
        </div>
      </div>

      {/* Main Content Container */}
      <div className="loader-container">
        {/* Header Section */}
        <div className="loader-header">
          <div className="brand-container">
            <div className="brand-icon">
              <div className="icon-layers">
                <div className="layer layer-1"></div>
                <div className="layer layer-2"></div>
                <div className="layer layer-3"></div>
              </div>
            </div>
            <div className="brand-text">
              <h1 className="brand-title">WeCare</h1>
              <p className="brand-subtitle">Professional Healthcare Management</p>
            </div>
          </div>
        </div>

        {/* Welcome Section */}
        <div className="welcome-section">
          <h2 className="welcome-title">
            <span className="title-line">Welcome to the Future</span>
            <span className="title-line">of Healthcare Management</span>
          </h2>
          <p className="welcome-description">
            Initializing your comprehensive healthcare dashboard with advanced analytics and seamless patient management capabilities.
          </p>
        </div>

        {/* Progress Section */}
        <div className="progress-section">
          <div className="progress-header">
            <h3 className="progress-title">System Initialization</h3>
            <span className="progress-percentage">{loadingProgress}%</span>
          </div>
          
          <div className="progress-track">
            <div 
              className="progress-fill" 
              style={{ width: `${loadingProgress}%` }}
            ></div>
            <div className="progress-glow"></div>
          </div>

          <div className="loading-steps">
            {[
              { label: 'Authenticating User', icon: '🔐' },
              { label: 'Loading Healthcare Data', icon: '📊' },
              { label: 'Initializing Analytics', icon: '📈' },
              { label: 'Finalizing Dashboard', icon: '✨' }
            ].map((step, i) => (
              <div 
                key={i} 
                className={`loading-step ${
                  i <= currentStep ? 'active' : ''
                } ${i < currentStep ? 'completed' : ''}`}
              >
                <div className="step-indicator">
                  <span className="step-icon">{step.icon}</span>
                  <div className="step-pulse"></div>
                </div>
                <span className="step-label">{step.label}</span>
              </div>
            ))}
          </div>
        </div>


      </div>
    </div>
  );
};

export default DashboardLoader;