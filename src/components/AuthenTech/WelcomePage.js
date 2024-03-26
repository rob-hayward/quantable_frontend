// src/components/AuthenTech/WelcomePage.js

import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import './WelcomePage.css';

const WelcomePage = () => {
  return (
    <div className="welcome-page">
      {/* Logo Image */}
      <img src={logo} alt="Quantable Logo" className="logo" />

        <div className="statement-container">
            <span className="fixed-text">How much is</span>
            <div className="scrolling-options">
                <span>too much</span>
                <span>enough</span>
                <span>too few</span>
                <span>excessive</span>
                <span>sufficient</span>
                <span>deprived</span>
                {/* Add more options as needed */}
            </div>
            <span className="fixed-text">?</span>
        </div>

        <div className="paragraph-container">
                <h4>Quantify Your Beliefs, With Quantable</h4>
        <div className="auth-options">
          <Link to="/register" className="auth-link">Register</Link>
          <Link to="/login" className="auth-link">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;