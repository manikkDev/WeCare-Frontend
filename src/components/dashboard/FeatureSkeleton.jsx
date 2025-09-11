import React from 'react';
import './FeatureSkeleton.css';

const FeatureSkeleton = ({ type = 'default' }) => {
  const renderDefaultSkeleton = () => (
    <div className="feature-skeleton">
      <div className="skeleton-header">
        <div className="skeleton-title"></div>
        <div className="skeleton-subtitle"></div>
      </div>
      
      <div className="skeleton-content">
        <div className="skeleton-cards">
          {[1, 2, 3].map((index) => (
            <div key={index} className={`skeleton-card skeleton-card-${index}`}>
              <div className="skeleton-card-header">
                <div className="skeleton-icon"></div>
                <div className="skeleton-card-title"></div>
              </div>
              <div className="skeleton-card-content">
                <div className="skeleton-line skeleton-line-long"></div>
                <div className="skeleton-line skeleton-line-medium"></div>
                <div className="skeleton-line skeleton-line-short"></div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="skeleton-stats">
          <div className="skeleton-stat-item">
            <div className="skeleton-stat-value"></div>
            <div className="skeleton-stat-label"></div>
          </div>
          <div className="skeleton-stat-item">
            <div className="skeleton-stat-value"></div>
            <div className="skeleton-stat-label"></div>
          </div>
          <div className="skeleton-stat-item">
            <div className="skeleton-stat-value"></div>
            <div className="skeleton-stat-label"></div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOCRSkeleton = () => (
    <div className="feature-skeleton ocr-skeleton">
      <div className="skeleton-header">
        <div className="skeleton-title"></div>
        <div className="skeleton-subtitle"></div>
      </div>
      
      <div className="skeleton-upload-area">
        <div className="skeleton-upload-icon"></div>
        <div className="skeleton-upload-text"></div>
        <div className="skeleton-upload-button"></div>
      </div>
      
      <div className="skeleton-results">
        <div className="skeleton-result-header">
          <div className="skeleton-result-title"></div>
          <div className="skeleton-result-actions">
            <div className="skeleton-action-button"></div>
            <div className="skeleton-action-button"></div>
          </div>
        </div>
        
        <div className="skeleton-result-content">
          {[1, 2, 3, 4, 5].map((index) => (
            <div key={index} className={`skeleton-text-line skeleton-line-${index}`}></div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderReportsSkeleton = () => (
    <div className="feature-skeleton reports-skeleton">
      <div className="skeleton-header">
        <div className="skeleton-title"></div>
        <div className="skeleton-actions">
          <div className="skeleton-search-bar"></div>
          <div className="skeleton-filter-button"></div>
        </div>
      </div>
      
      <div className="skeleton-table">
        <div className="skeleton-table-header">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="skeleton-table-header-cell"></div>
          ))}
        </div>
        
        {[1, 2, 3, 4, 5].map((rowIndex) => (
          <div key={rowIndex} className={`skeleton-table-row skeleton-row-${rowIndex}`}>
            {[1, 2, 3, 4].map((cellIndex) => (
              <div key={cellIndex} className="skeleton-table-cell"></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  const renderAnalyticsSkeleton = () => (
    <div className="feature-skeleton analytics-skeleton">
      <div className="skeleton-header">
        <div className="skeleton-title"></div>
        <div className="skeleton-date-range"></div>
      </div>
      
      <div className="skeleton-metrics">
        {[1, 2, 3, 4].map((index) => (
          <div key={index} className={`skeleton-metric-card skeleton-metric-${index}`}>
            <div className="skeleton-metric-icon"></div>
            <div className="skeleton-metric-content">
              <div className="skeleton-metric-value"></div>
              <div className="skeleton-metric-label"></div>
              <div className="skeleton-metric-change"></div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="skeleton-charts">
        <div className="skeleton-chart-large">
          <div className="skeleton-chart-header">
            <div className="skeleton-chart-title"></div>
            <div className="skeleton-chart-legend">
              {[1, 2, 3].map((index) => (
                <div key={index} className="skeleton-legend-item"></div>
              ))}
            </div>
          </div>
          <div className="skeleton-chart-area"></div>
        </div>
        
        <div className="skeleton-chart-small">
          <div className="skeleton-chart-header">
            <div className="skeleton-chart-title"></div>
          </div>
          <div className="skeleton-chart-area"></div>
        </div>
      </div>
    </div>
  );

  const renderAppointmentsSkeleton = () => (
    <div className="feature-skeleton appointments-skeleton">
      <div className="skeleton-header">
        <div className="skeleton-title"></div>
        <div className="skeleton-add-button"></div>
      </div>
      
      <div className="skeleton-calendar">
        <div className="skeleton-calendar-header">
          <div className="skeleton-month-nav"></div>
          <div className="skeleton-month-title"></div>
          <div className="skeleton-month-nav"></div>
        </div>
        
        <div className="skeleton-calendar-grid">
          {[1, 2, 3, 4, 5, 6, 7].map((day) => (
            <div key={day} className="skeleton-day-header"></div>
          ))}
          {Array.from({ length: 35 }, (_, index) => (
            <div key={index} className={`skeleton-day-cell skeleton-day-${index + 1}`}></div>
          ))}
        </div>
      </div>
      
      <div className="skeleton-upcoming">
        <div className="skeleton-upcoming-header">
          <div className="skeleton-upcoming-title"></div>
        </div>
        
        {[1, 2, 3].map((index) => (
          <div key={index} className={`skeleton-appointment-item skeleton-appointment-${index}`}>
            <div className="skeleton-appointment-time"></div>
            <div className="skeleton-appointment-content">
              <div className="skeleton-appointment-title"></div>
              <div className="skeleton-appointment-doctor"></div>
              <div className="skeleton-appointment-location"></div>
            </div>
            <div className="skeleton-appointment-status"></div>
          </div>
        ))}
      </div>
    </div>
  );

  const skeletonTypes = {
    'ocr-parser': renderOCRSkeleton,
    'reports': renderReportsSkeleton,
    'analytics': renderAnalyticsSkeleton,
    'appointments': renderAppointmentsSkeleton,
    'default': renderDefaultSkeleton
  };

  return skeletonTypes[type] || renderDefaultSkeleton();
};

export default FeatureSkeleton;