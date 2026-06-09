import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Check for 'accessToken' to match our Login/Signup logic
  const initialToken = localStorage.getItem('accessToken') || localStorage.getItem('token') || null;
  
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(initialToken);

  useEffect(() => {
    if (token) {
      const savedUser = localStorage.getItem('user');
      
      if (savedUser) {
        try {
          // SAFE PARSING: Attempt to read the user object
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
        } catch (error) {
          // THE SAFETY NET: If the data is broken/corrupt, don't crash the app!
          // Just silently wipe the bad data and log them out.
          console.error("Corrupt user data found. Wiping local storage to protect app.");
          localStorage.removeItem('user');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
    }
  }, [token]);

  const login = (userData, receivedToken) => {
    setToken(receivedToken);
    setUser(userData);
    
    // Explicitly stringify the user object and save the token
    localStorage.setItem('accessToken', receivedToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    
    // Wipe everything clean on logout
    localStorage.removeItem('accessToken');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};