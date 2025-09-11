import React, { useEffect } from 'react';
import './SignOutModal.css';

const SignOutModal = ({ isOpen, onClose, onConfirm, userName }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="signout-modal-overlay" onClick={onClose}>
      <div className="signout-modal" onClick={(e) => e.stopPropagation()}>
        {/* Removed animated background elements for cleaner appearance */}

        {/* Close button */}
        <button className="modal-close-btn" onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path 
              d="M18 6L6 18M6 6L18 18" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Modal content */}
        <div className="modal-content">
          {/* Icon with pulse animation */}
          <div className="modal-icon">
            <div className="icon-pulse"></div>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <path 
                d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              <polyline 
                points="16,17 21,12 16,7" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              <line 
                x1="21" 
                y1="12" 
                x2="9" 
                y2="12" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Title and message */}
          <div className="modal-text">
            <h2 className="modal-title">Sign Out Confirmation</h2>
            <p className="modal-message">
              Hey {userName || 'there'}! Are you sure you want to sign out of your WeCare account?
            </p>
            <p className="modal-submessage">
              You'll need to sign in again to access your dashboard and reports.
            </p>
          </div>

          {/* Action buttons */}
          <div className="modal-actions">
            <button className="btn-cancel" onClick={onClose}>
              <span className="btn-text">Cancel</span>
              <div className="btn-ripple"></div>
            </button>
            <button className="btn-confirm" onClick={onConfirm}>
              <span className="btn-text">Sign Out</span>
              <div className="btn-ripple"></div>
              <div className="btn-glow"></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignOutModal;