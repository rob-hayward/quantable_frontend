// src/components/AuthenTech/RegistrationModalTwo.js
import React, { useState } from 'react';
import { useUser } from '../../contexts/UserContext'; // Import useUser
import './RegistrationModalTwo.css'; // Import the CSS file

const ModalTwo = ({ nextStep, handleSubmitEmail }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const { userDetails, updateUserDetails } = useUser(); // Use context

  const handleEmailSubmit = async (event) => {
    event.preventDefault();
    try {
      await handleSubmitEmail(email);
      updateUserDetails({ ...userDetails, email }); // Update email in context
      nextStep();
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
      <div className="modalContainerTwo">
        <h2 className="headingTwo">Welcome to Discussable {userDetails.preferredName}.</h2>
        <p>Please provide and verify your email address to show that you are a real person.</p>
        {error && <p className="error">{error}</p>}
          <form onSubmit={handleEmailSubmit} className="formTwo">
              <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  required
                  className="inputTwo"
                  autoFocus
              />
              <button type="submit" className="button modal-button">Submit Email</button>
          </form>
          <div className="step-indicator">Step 2 of 4</div>
      </div>
  );
};

export default ModalTwo;