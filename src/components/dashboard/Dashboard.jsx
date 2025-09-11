import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import OCRReportParser from './features/OCRReportParser';
import MedicalReports from './features/MedicalReports';
import DashboardLoader from './DashboardLoader';
import FeatureSkeleton from './FeatureSkeleton';
import './Dashboard.css';

const Dashboard = () => {
  const [activeFeature, setActiveFeature] = useState('ocr-parser');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingStep, setLoadingStep] = useState(0);
  const [featureLoading, setFeatureLoading] = useState(false);

  useEffect(() => {
    // Simulate loading steps with realistic timing
    const loadingSteps = [
      { step: 0, delay: 800, message: 'Initializing...' },
      { step: 1, delay: 1200, message: 'Loading Dashboard...' },
      { step: 2, delay: 1000, message: 'Setting up Features...' },
      { step: 3, delay: 800, message: 'Almost Ready...' }
    ];

    let currentStepIndex = 0;
    
    const executeStep = () => {
      if (currentStepIndex < loadingSteps.length) {
        const currentStep = loadingSteps[currentStepIndex];
        setLoadingStep(currentStep.step);
        
        setTimeout(() => {
          currentStepIndex++;
          if (currentStepIndex < loadingSteps.length) {
            executeStep();
          } else {
            // Final step - complete loading
            setTimeout(() => {
              setIsLoading(false);
            }, 500);
          }
        }, currentStep.delay);
      }
    };

    executeStep();
  }, []);

  // Handle feature switching with loading animation
  const handleFeatureChange = (newFeature) => {
    if (newFeature !== activeFeature) {
      setFeatureLoading(true);
      
      // Simulate feature loading time
      setTimeout(() => {
        setActiveFeature(newFeature);
        setTimeout(() => {
          setFeatureLoading(false);
        }, 800);
      }, 300);
    }
  };

  const renderActiveFeature = () => {
    switch (activeFeature) {
      case 'ocr-parser':
        return <OCRReportParser />;
      case 'reports':
        return featureLoading ? (
          <FeatureSkeleton type="reports" />
        ) : (
          <MedicalReports />
        );
      case 'analytics':
        return featureLoading ? (
          <FeatureSkeleton type="analytics" />
        ) : (
          <div className="feature-placeholder">
            <h2>Health Analytics</h2>
            <p>Analyze your health data and trends.</p>
          </div>
        );
      case 'appointments':
        return featureLoading ? (
          <FeatureSkeleton type="appointments" />
        ) : (
          <div className="feature-placeholder">
            <h2>Appointments</h2>
            <p>Schedule and manage your medical appointments.</p>
          </div>
        );
      default:
        return <OCRReportParser />;
    }
  };

  if (isLoading) {
    return <DashboardLoader currentStep={loadingStep} />;
  }

  return (
    <div className="dashboard dashboard-loaded">
      <Sidebar 
        activeFeature={activeFeature}
        setActiveFeature={handleFeatureChange}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />
      <div className={`dashboard-content ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <div className="content-wrapper">
          {renderActiveFeature()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;