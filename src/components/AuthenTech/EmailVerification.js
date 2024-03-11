// src/components/AuthenTech/EmailVerification.js

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosConfig';
import { useUser } from '../../contexts/UserContext';

const EmailVerification = () => {
    const [verificationStatus, setVerificationStatus] = useState('');
    const { token } = useParams(); // Use useParams to get the token
    const navigate = useNavigate();
    const { updateUserDetails } = useUser();

    useEffect(() => {
        console.log("EmailVerification component mounted");
        console.log("Token:", token);

        const verifyEmail = async () => {
            if (!token) {
                console.log("No token found");
                setVerificationStatus('No verification token found.');
                return;
            }

            console.log("Verifying email with token:", token);

     try {
                const response = await axiosInstance.get(`/verify-email/${token}/`);
                if (response.data.status === 'success') {
                    updateUserDetails({ email: response.data.email, preferredName: response.data.preferredName });
                    navigate('/register', { state: { step: 4 } }); // Update this line
                } else {
                    throw new Error('Verification failed.');
                }
            } catch (error) {
                setVerificationStatus('Verification failed. Invalid or expired token.');
            }
        };

        verifyEmail().catch(error => console.error("Error in verifyEmail:", error));
    }, [token, navigate, updateUserDetails]);

    return (
        <div>{verificationStatus}</div>
    );
};

export default EmailVerification;