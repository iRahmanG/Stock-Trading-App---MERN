import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize state directly from localStorage so it survives page refreshes instantly!
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('userInfo');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Logout function to clear data
  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
    window.location.href = '/'; // Kick them back to the landing page
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};