// useWebAuthnRegistration.js
import { useState } from 'react';
import axiosInstance from '../api/axiosConfig';

const useWebAuthnRegistration = () => {
  const [error, setError] = useState(null);

  // Helper function: Convert a base64url string to a Uint8Array
  const base64urlToUint8Array = (base64url) => {
    const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
    const raw = window.atob(base64);
    const rawLength = raw.length;
    let array = new Uint8Array(new ArrayBuffer(rawLength));
    for (let i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
    }
    return array;
  };

  // Helper function: Convert an ArrayBuffer to a base64 string
  const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  // Main function for registration
  const initiateWebAuthnRegistration = async (username) => {
    try {
      // Request registration challenge from server
      const challengeResponse = await axiosInstance.post('/webauthn/register/challenge/', { username });
      const options = challengeResponse.data;

      // Convert challenge and user ID from base64url to Uint8Array
      options.user.id = base64urlToUint8Array(options.user.id);
      options.challenge = base64urlToUint8Array(options.challenge);

      // Handle excludeCredentials if present
      if (options.excludeCredentials) {
        options.excludeCredentials = options.excludeCredentials.map(cred => {
          return { ...cred, id: base64urlToUint8Array(cred.id) };
        });
      }

      // Create credentials using the WebAuthn API
      const credentials = await navigator.credentials.create({ publicKey: options });

      // Prepare registration response data
      const registrationData = {
        id: credentials.id,
        rawId: arrayBufferToBase64(credentials.rawId),
        response: {
          attestationObject: arrayBufferToBase64(credentials.response.attestationObject),
          clientDataJSON: arrayBufferToBase64(credentials.response.clientDataJSON),
        },
        type: credentials.type,
      };

      // Send registration response to server
      const registrationResponse = await axiosInstance.post('/webauthn/register/response/', registrationData);

      // Directly return the response data for handling in the component
      return registrationResponse.data;
    } catch (e) {
      console.error("Error during WebAuthn registration:", e);
      setError(e);
    }
  };

  return { initiateWebAuthnRegistration, error };
};

export default useWebAuthnRegistration;
