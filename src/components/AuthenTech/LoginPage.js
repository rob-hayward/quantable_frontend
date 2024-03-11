// src/components/AuthenTech/LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useWebAuthnAuthentication from '../../hooks/useWebAuthnAuthentication';
import { useAuth } from '../../contexts/AuthContext'; // Ensure the path is correct
import './LoginPage.css';
import logo from "../../assets/logo.png";

const LoginPage = () => {
  const [username, setUsername] = useState('');
  // Removed the onSuccessLogin parameter since it's not used within the hook
  const { initiateWebAuthnAuthentication, error } = useWebAuthnAuthentication();
  const { login } = useAuth(); // Use login from AuthContext
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
        const response = await initiateWebAuthnAuthentication(username);
        // Ensure response.data exists and has the token property
        if (response && response.status === 'success' && response.token) {
            login(response.token); // Pass the token to login function
            navigate('/dashboard'); // Navigate to the dashboard upon successful login
        } else {
            // Handle the case where login is not successful or token is missing
            console.error('Login failed or token missing in response');
        }
    } catch (error) {
        // Handle any errors that occur during the login process
        console.error('Login error:', error);
    }
};


  return (
    <div className="loginContainer">
        <img src={logo} alt="Discussable Logo" className="logo"/>
        <form onSubmit={handleSubmit} className="loginForm">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter Email Address"
          required
          className="loginInput"
          autoFocus
        />
        <button type="submit" className="loginButton">Login with WebAuthn</button>
      </form>
      {error && <p className="loginError">Error: {error.message}</p>}
    </div>
  );
};

export default LoginPage;
