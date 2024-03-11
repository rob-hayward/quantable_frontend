//src/contexts/UserContext.js

import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [userDetails, setUserDetails] = useState({
    preferredName: '',
    email: '',
    fullName: '',
    address: '',
    password: '',
  });

  const updateUserDetails = (newDetails) => {
    setUserDetails({ ...userDetails, ...newDetails });
  };

  return (
    <UserContext.Provider value={{ userDetails, updateUserDetails }}>
      {children}
    </UserContext.Provider>
  );
};
