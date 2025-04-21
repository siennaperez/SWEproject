import React from 'react';
import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export  const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);

  return (
    <UserContext.Provider value={{ 
      userId, 
      setUserId: (id) => {
        console.log('Setting user ID:', id); // Add logging
        setUserId(id);
      } 
    }}>
      {children}
    </UserContext.Provider>
  );
};


