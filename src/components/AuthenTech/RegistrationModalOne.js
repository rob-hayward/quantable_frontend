// src/components/AuthenTech/RegistrationModalOne.js

import React, { useState } from 'react';
import './RegistrationModalOne.css';

const ModalOne = ({ handleUserDetails, nextStep }) => {
  const [preferredName, setPreferredName] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    handleUserDetails({ preferredName });
    nextStep();
  };

  return (
      <div className="modalContainer">
          <h2 className="heading">Hello. What name should I call you?</h2>
          <form onSubmit={handleSubmit} className="form">
              <input
                  type="text"
                  value={preferredName}
                  onChange={(e) => setPreferredName(e.target.value)}
                  placeholder="Preferred Name"
                  required
                  className="input"
                  autoFocus
              />
              <button type="submit" className="button modal-button">Next</button>

          </form>
          <div className="step-indicator">Step 1 of 4</div>
      </div>
  );
};

export default ModalOne;
