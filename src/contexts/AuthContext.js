// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // Initialize isLoggedIn based on the presence of a token in localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(localStorage.getItem('token')));

  const login = (token) => {
    localStorage.setItem('token', token); // Save the token for future requests
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('token'); // Clear the token from local storage
    setIsLoggedIn(false);
  };

  // Optionally, add a useEffect hook to validate token or perform further actions on state change
  useEffect(() => {
    // Here, you could add logic to validate the token's validity
    // For example, by sending a request to a backend endpoint that verifies the token
    // If the token is invalid or expired, you could then call logout()
  }, [isLoggedIn]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
