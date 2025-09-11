import React from 'react';
import './Logo.css';

const Logo = ({ className = '', size = 'medium' }) => {
  return (
    <div className={`logo-container ${className} ${size}`}>
      <svg 
        viewBox="0 0 120 40" 
        className="wecare-logo"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background gradient definitions */}
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#667eea" />
            <stop offset="50%" stopColor="#764ba2" />
            <stop offset="100%" stopColor="#f093fb" />
          </linearGradient>
          <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff6b6b" />
            <stop offset="100%" stopColor="#ee5a24" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/> 
            </feMerge>
          </filter>
        </defs>
        
        {/* Main logo background circle */}
        <circle 
          cx="20" 
          cy="20" 
          r="18" 
          fill="url(#logoGradient)" 
          className="logo-bg"
        />
        
        {/* Healthcare cross symbol */}
        <g className="cross-symbol">
          <rect x="17" y="12" width="6" height="16" fill="white" rx="1" />
          <rect x="12" y="17" width="16" height="6" fill="white" rx="1" />
        </g>
        
        {/* Heart symbol integrated with cross */}
        <path 
          d="M20 15c-2-4-8-4-8 2 0 4 8 8 8 8s8-4 8-8c0-6-6-6-8-2z" 
          fill="url(#heartGradient)" 
          className="heart-symbol"
          opacity="0.8"
        />
        
        {/* DNA helix pattern */}
        <g className="dna-helix" opacity="0.6">
          <path d="M32 10 Q35 15 32 20 Q29 25 32 30" stroke="#4ecdc4" strokeWidth="1.5" fill="none" />
          <path d="M36 10 Q33 15 36 20 Q39 25 36 30" stroke="#45b7d1" strokeWidth="1.5" fill="none" />
          <circle cx="32" cy="12" r="1" fill="#4ecdc4" />
          <circle cx="36" cy="18" r="1" fill="#45b7d1" />
          <circle cx="32" cy="24" r="1" fill="#4ecdc4" />
          <circle cx="36" cy="30" r="1" fill="#45b7d1" />
        </g>
        
        {/* WeCare text */}
        <text x="45" y="16" className="logo-text-we" fill="#2c3e50" fontSize="12" fontWeight="700">We</text>
        <text x="45" y="28" className="logo-text-care" fill="url(#logoGradient)" fontSize="12" fontWeight="700">Care</text>
        
        {/* Subtitle */}
        <text x="45" y="35" className="logo-subtitle" fill="#7f8c8d" fontSize="6" fontWeight="400">Health Surveillance</text>
        
        {/* Decorative elements */}
        <g className="decorative-dots">
          <circle cx="85" cy="8" r="1.5" fill="#4ecdc4" opacity="0.7" className="dot-1" />
          <circle cx="90" cy="12" r="1" fill="#45b7d1" opacity="0.6" className="dot-2" />
          <circle cx="95" cy="16" r="1.2" fill="#667eea" opacity="0.5" className="dot-3" />
          <circle cx="100" cy="20" r="0.8" fill="#f093fb" opacity="0.8" className="dot-4" />
        </g>
        
        {/* Shield outline for security */}
        <path 
          d="M105 10 L115 10 Q118 10 118 13 L118 25 Q118 30 113 32 L110 33 Q108 34 108 34 Q108 34 106 33 L103 32 Q98 30 98 25 L98 13 Q98 10 101 10 Z" 
          fill="none" 
          stroke="url(#logoGradient)" 
          strokeWidth="1.5" 
          className="shield-outline"
        />
        <path d="M108 15 L106 17 L104 15" stroke="#27ae60" strokeWidth="2" fill="none" className="checkmark" />
      </svg>
    </div>
  );
};

export default Logo;