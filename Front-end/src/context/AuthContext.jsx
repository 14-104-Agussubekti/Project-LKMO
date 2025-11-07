import React, { useState, createContext, useContext } from 'react';
// (Kode AuthContext yang sama persis dari panduan sebelumnya)
// ... (salin kode AuthContext.jsx dari panduan tailwind) ...
export const AuthContext = createContext(null);
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const login = async (email, password) => {
    setLoading(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        let mockUser;
        if (email === 'admin@desa.id') {
          mockUser = { id: 1, name: 'Admin Desa', email: 'admin@desa.id', role: 'admin' };
        } else {
          mockUser = { id: 2, name: 'Warga Masyarakat', email: email, role: 'masyarakat' };
        }
        setUser(mockUser);
        setIsAuthenticated(true);
        setLoading(false);
        resolve({ success: true, user: mockUser });
      }, 500);
    });
  };
  const register = async (name, email, password) => {
    console.log('Register (mock):', name, email);
    return { success: true };
  };
  const logout = async () => {
    setUser(null);
    setIsAuthenticated(false);
  };
  const value = { user, isAuthenticated, loading, login, register, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
export const useAuth = () => {
  return useContext(AuthContext);
};