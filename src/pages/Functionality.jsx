import React from 'react';
import FunctionalityNavbar from '../components/layout/FunctionalityNavbar';
import Dashboard from '../components/dashboard/Dashboard';
import './Functionality.css';

const Functionality = ({ user, onLogout }) => {
  return (
    <div className="functionality-page">
      <FunctionalityNavbar user={user} onLogout={onLogout} />
      <div className="functionality-content">
        <Dashboard user={user} />
      </div>
    </div>
  );
};

export default Functionality;