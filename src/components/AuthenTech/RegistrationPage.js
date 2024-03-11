// src/components/AuthenTech/RegistrationPage.js

import React, { useState, useEffect } from 'react';
import { useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext'; // Import useUser
import './RegistrationPage.css';
import ModalOne from './RegistrationModalOne';
import ModalTwo from './RegistrationModalTwo';
import ModalThree from './RegistrationModalThree';
import ModalFour from './RegistrationModalFour';
import axiosInstance from '../../api/axiosConfig';

const RegistrationPage = () => {
  const [step, setStep] = useState(1);
  const { userDetails, updateUserDetails } = useUser(); // Use Context
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

   useEffect(() => {
        // Check if navigation state exists and set the step accordingly
        if (location.state?.step) {
            setStep(location.state.step);
        } else {
            // Existing logic for handling search params
            const stepParam = searchParams.get('step');
            const tokenParam = searchParams.get('token');

            if (stepParam === '4' && tokenParam) {
                verifyEmailToken(tokenParam);
                setStep(4);
            }
        }
    }, [location, searchParams]);

  const nextStep = () => {
    const newStep = step + 1;
    setStep(newStep);
    if (newStep === 5) {
      // The logic to navigate to ModalFive for WebAuthn registration
    }
  };

  const previousStep = () => {
    setStep(step - 1);
  };

  const handleUserDetails = (newDetails) => {
    updateUserDetails(newDetails); // Update context instead of local state
  };


  const handleSubmitEmail = async (email) => {
    try {
      const response = await axiosInstance.post('/send-verification-email/', { email, preferredName: userDetails.preferredName });
      if (response.status === 200) {
        handleUserDetails({ email });
        nextStep();
      }
    } catch (error) {
      console.error("Email submission error:", error);
    }
  };

  const verifyEmailToken = async (token) => {
    try {
      await axiosInstance.get(`/verify-email/${token}/`);
      // Handle successful verification
    } catch (error) {
      console.error("Email verification error:", error);
    }
  };

  const completeRegistration = () => {
    // Redirect to the dashboard after successful registration
    navigate('/dashboard');
  };

  const getModal = () => {
  switch (step) {
    case 1:
      return <ModalOne key="modal-one" handleUserDetails={handleUserDetails} nextStep={nextStep} />;
    case 2:
      return <ModalTwo key="modal-two" userDetails={userDetails} nextStep={nextStep} handleSubmitEmail={handleSubmitEmail} />;
    case 3:
      return <ModalThree key="modal-three" userDetails={userDetails} handleResendEmail={() => previousStep()} />;
    case 4:
      return <ModalFour key="modal-four" userDetails={userDetails} onRegistrationComplete={completeRegistration} />;
    default:
      return <div key="modal-error">Error: Unknown step</div>;
  }
};

  return (
    <div className="modalTransitionWrapper">
      {getModal()}
    </div>
  );
};

export default RegistrationPage;