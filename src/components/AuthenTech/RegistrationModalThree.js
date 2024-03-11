// src/components/AuthenTech/RegistrationModalThree.js
import React from 'react';
import { useUser } from '../../contexts/UserContext';
import './RegistrationModalThree.css'; // Import the CSS file

const ModalThree = ({ handleResendEmail }) => {
  const { userDetails } = useUser();

  return (
      <div className="modalContainerThree">
          <h2 className="headingThree">Verify Your Email</h2>
          <p className="descriptionThree">
              Thank you for providing your email address, {userDetails.preferredName}. <br/>
              Please check your inbox for {userDetails.email} and click on the link provided to verify. <br/>
              Did not receive an email?
          </p>
          <button onClick={handleResendEmail} className="button modal-button">Click here to resend</button>
          <div className="step-indicator">Step 3 of 4</div>
      </div>
  );
};

export default ModalThree;
