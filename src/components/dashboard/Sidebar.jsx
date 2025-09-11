import React from 'react';
import './Sidebar.css';

const Sidebar = ({ activeFeature, setActiveFeature, isCollapsed, setIsCollapsed }) => {
  const menuItems = [
    {
      id: 'ocr-parser',
      label: 'Upload + OCR Report Parsing',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M4 4C4 2.89543 4.89543 2 6 2H10L14 6V16C14 17.1046 13.1046 18 12 18H6C4.89543 18 4 17.1046 4 16V4Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10 2V6H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M7 10H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M7 12H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M7 14H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
      description: 'Upload medical reports and extract text using OCR'
    },
    {
      id: 'reports',
      label: 'Medical Reports',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M3 4C3 2.89543 3.89543 2 5 2H15C16.1046 2 17 2.89543 17 4V16C17 17.1046 16.1046 18 15 18H5C3.89543 18 3 17.1046 3 16V4Z" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M7 6H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M7 9H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M7 12H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
      description: 'View and manage your medical reports'
    },
    {
      id: 'analytics',
      label: 'Health Analytics',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M3 17L7 13L11 17L17 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14 11H17V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      description: 'Analyze your health data and trends'
    },
    {
      id: 'appointments',
      label: 'Appointments',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M3 8H17M3 8V16C3 17.1046 3.89543 18 5 18H15C16.1046 18 17 17.1046 17 16V8M3 8V6C3 4.89543 3.89543 4 5 4H15C16.1046 4 17 4.89543 17 6V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M7 2V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M13 2V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
      description: 'Schedule and manage appointments'
    }
  ];

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-title">
          {!isCollapsed && (
            <>
              <h2>Dashboard</h2>
              <p>Healthcare Management</p>
            </>
          )}
        </div>
        <button 
          className="sidebar-toggle"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 16 16" 
            fill="none"
            className={isCollapsed ? 'rotated' : ''}
          >
            <path 
              d="M6 4L10 8L6 12" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <nav className="sidebar-nav">
        <ul className="nav-list">
          {menuItems.map((item, index) => (
            <li 
              key={item.id} 
              className="nav-item"
              style={{
                animationDelay: `${0.1 + index * 0.1}s`
              }}
            >
              <button
                className={`nav-button ${activeFeature === item.id ? 'active' : ''}`}
                onClick={() => setActiveFeature(item.id)}
                title={isCollapsed ? item.label : ''}
              >
                <div className="nav-icon">
                  {item.icon}
                </div>
                {!isCollapsed && (
                  <div className="nav-content">
                    <span className="nav-label">{item.label}</span>
                    <span className="nav-description">{item.description}</span>
                  </div>
                )}
                {activeFeature === item.id && (
                  <div className="nav-indicator"></div>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        {!isCollapsed && (
          <div className="footer-content">
            <div className="footer-stats">
              <div className="stat-item">
                <span className="stat-value">12</span>
                <span className="stat-label">Reports</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">3</span>
                <span className="stat-label">Pending</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;