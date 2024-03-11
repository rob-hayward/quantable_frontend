// src/components/AuthenTech/WelcomePage.js

import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import './WelcomePage.css';

const WelcomePage = () => {
  return (
      <div className="welcome-page">
          {/* Logo Image */}
          <img src={logo} alt="Discussable Logo" className="logo"/>

          <h1>Discussable</h1>
          <div className="paragraph-container">
              <ul>
                  <li>Freedom to Speak. Freedom to Listen</li>
                  <li>Community Content, Personally Controlled.</li>
              </ul>
              <div className="auth-options">
                  <Link to="/register" className="auth-link">Register</Link>
                  <Link to="/login" className="auth-link">Login</Link>
              </div>
          </div>
      </div>
  );
};

export default WelcomePage;
