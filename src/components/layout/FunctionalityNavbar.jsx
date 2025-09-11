import React, { useState, useEffect } from 'react';
import Logo from '../common/Logo';
import SignOutModal from '../modals/SignOutModal';
import './FunctionalityNavbar.css';

const FunctionalityNavbar = ({ user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);

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

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleSignOutClick = () => {
    setIsProfileOpen(false);
    setIsSignOutModalOpen(true);
  };

  const handleSignOutConfirm = () => {
    setIsSignOutModalOpen(false);
    onLogout();
  };

  const handleSignOutCancel = () => {
    setIsSignOutModalOpen(false);
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <nav className={`functionality-navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <div className="nav-brand">
          <Logo />
        </div>
        
        <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <a href="#dashboard" className="nav-link">Dashboard</a>
          <a href="#reports" className="nav-link">Reports</a>
          <a href="#analytics" className="nav-link">Analytics</a>
          <a href="#settings" className="nav-link">Settings</a>
        </div>

        <div className="nav-actions">
          <div className="profile-container">
            <button 
              className="profile-button"
              onClick={toggleProfile}
              aria-label="User profile"
            >
              <div className="profile-avatar">
                {user?.profileImage ? (
                  <img src={user.profileImage} alt="Profile" />
                ) : (
                  <span className="profile-initials">
                    {getInitials(user?.firstName || user?.username || 'User')}
                  </span>
                )}
              </div>
              <span className="profile-name">
                {user?.firstName || user?.username || 'User'}
              </span>
              <svg 
                className={`dropdown-arrow ${isProfileOpen ? 'open' : ''}`}
                width="12" 
                height="12" 
                viewBox="0 0 12 12" 
                fill="none"
              >
                <path 
                  d="M3 4.5L6 7.5L9 4.5" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            
            {isProfileOpen && (
              <div className="profile-dropdown">
                <div className="dropdown-header">
                  <div className="dropdown-avatar">
                    {user?.profileImage ? (
                      <img src={user.profileImage} alt="Profile" />
                    ) : (
                      <span className="dropdown-initials">
                        {getInitials(user?.firstName || user?.username || 'User')}
                      </span>
                    )}
                  </div>
                  <div className="dropdown-info">
                    <p className="dropdown-name">
                      {user?.firstName && user?.lastName 
                        ? `${user.firstName} ${user.lastName}` 
                        : user?.username || 'User'
                      }
                    </p>
                    <p className="dropdown-email">{user?.email || 'user@example.com'}</p>
                  </div>
                </div>
                <div className="dropdown-divider"></div>
                <div className="dropdown-menu">
                  <button className="dropdown-item">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 8C10.2091 8 12 6.20914 12 4C12 1.79086 10.2091 0 8 0C5.79086 0 4 1.79086 4 4C4 6.20914 5.79086 8 8 8Z" fill="currentColor"/>
                      <path d="M8 10C3.58172 10 0 13.5817 0 18H16C16 13.5817 12.4183 10 8 10Z" fill="currentColor"/>
                    </svg>
                    Profile Settings
                  </button>
                  <button className="dropdown-item">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 0C8.55228 0 9 0.447715 9 1V2.05493C10.9649 2.27806 12.7221 3.35186 13.8944 5.10557L14.6056 4.39443C15.0961 3.90393 15.9039 3.90393 16.3944 4.39443C16.8849 4.88493 16.8849 5.69264 16.3944 6.18314L15.6833 6.89429C16.5 8.5 16.5 10.5 15.6833 12.1057L16.3944 12.8169C16.8849 13.3074 16.8849 14.1151 16.3944 14.6056C15.9039 15.0961 15.0961 15.0961 14.6056 14.6056L13.8944 13.8944C12.7221 15.6481 10.9649 16.7219 9 16.9451V18C9 18.5523 8.55228 19 8 19C7.44772 19 7 18.5523 7 18V16.9451C5.03514 16.7219 3.27792 15.6481 2.10557 13.8944L1.39443 14.6056C0.903932 15.0961 0.0962132 15.0961 -0.394287 14.6056C-0.884787 14.1151 -0.884787 13.3074 -0.394287 12.8169L0.316671 12.1057C-0.5 10.5 -0.5 8.5 0.316671 6.89429L-0.394287 6.18314C-0.884787 5.69264 -0.884787 4.88493 -0.394287 4.39443C0.0962132 3.90393 0.903932 3.90393 1.39443 4.39443L2.10557 5.10557C3.27792 3.35186 5.03514 2.27806 7 2.05493V1C7 0.447715 7.44772 0 8 0ZM8 4C5.79086 4 4 5.79086 4 8C4 10.2091 5.79086 12 8 12C10.2091 12 12 10.2091 12 8C12 5.79086 10.2091 4 8 4Z" fill="currentColor"/>
                    </svg>
                    Settings
                  </button>
                  <button className="dropdown-item">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 0C8.55228 0 9 0.447715 9 1V7H15C15.5523 7 16 7.44772 16 8C16 8.55228 15.5523 9 15 9H9V15C9 15.5523 8.55228 16 8 16C7.44772 16 7 15.5523 7 15V9H1C0.447715 9 0 8.55228 0 8C0 7.44772 0.447715 7 1 7H7V1C7 0.447715 7.44772 0 8 0Z" fill="currentColor"/>
                    </svg>
                    Help & Support
                  </button>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item logout" onClick={handleSignOutClick}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M6 2H2C1.44772 2 1 2.44772 1 3V13C1 13.5523 1.44772 14 2 14H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      <path d="M11 12L15 8L11 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M15 8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="nav-toggle" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      
      <SignOutModal 
        isOpen={isSignOutModalOpen}
        onClose={handleSignOutCancel}
        onConfirm={handleSignOutConfirm}
        userName={user?.firstName || user?.username}
      />
    </nav>
  );
};

export default FunctionalityNavbar;