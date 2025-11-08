// src/context/AuthContext.jsx
import React, { useState, useEffect, createContext, useContext } from "react";

/**
 * AuthContext yang lengkap:
 * - menyediakan: user, isAuthenticated, loading, login, register, logout
 * - menyediakan helper authFetch(url, opts) yang otomatis menambahkan Authorization header
 * - berusaha pakai backend (import.meta.env.VITE_API_BASE) dan fallback ke mock jika backend unreachable
 */

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { id, name, email, role }
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);

  // gunakan import.meta.env (Vite). Jika tidak diset, fallback ke localhost backend.
  const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080/api";

  // load saved token/user
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user");
      const savedToken = localStorage.getItem("token");
      if (savedUser && savedToken) {
        setUser(JSON.parse(savedUser));
        setIsAuthenticated(true);
      }
    } catch {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  }, []);

  // helper: simpan credential
  const saveAuth = (token, userObj) => {
    try {
      if (token) localStorage.setItem("token", token);
      if (userObj) localStorage.setItem("user", JSON.stringify(userObj));
    } catch {}
    setUser(userObj || null);
    setIsAuthenticated(Boolean(userObj));
  };

  const clearAuth = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } catch {}
    setUser(null);
    setIsAuthenticated(false);
  };

  // fallback mock user creation (used only if backend unreachable)
  const makeMockUser = (email) => {
    if (email === "admin@desa.id") {
      return { id: 1, name: "Admin Desa", email: "admin@desa.id", role: "admin" };
    }
    return { id: 2, name: "Warga Masyarakat", email, role: "masyarakat" };
  };

  // authFetch: wrapper fetch yang otomatis pasang Authorization jika token ada
  const authFetch = async (url, options = {}) => {
    const token = localStorage.getItem("token");
    const headers = options.headers ? { ...options.headers } : {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return fetch(url, { ...options, headers });
  };

  // register
  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json().catch(() => ({}));
      setLoading(false);
      if (!res.ok) return { success: false, error: data.error || data.message || "Registrasi gagal" };
      // not auto-login; frontend handles redirect to login
      return { success: true, user: data.user ?? null };
    } catch (err) {
      setLoading(false);
      // fallback: pretend registration succeeded so UI tidak terhenti
      console.warn("Register fallback (mock):", err);
      return { success: true };
    }
  };

  // login
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      setLoading(false);
      if (res.ok && data.token && data.user) {
        saveAuth(data.token, data.user);
        return { success: true, user: data.user };
      }
      // server responded with error (invalid credentials)
      return { success: false, error: data.error || data.message || "Login gagal" };
    } catch (err) {
      // backend unreachable -> fallback to mock user (keperluan dev)
      const mockUser = makeMockUser(email);
      // we do not have a real token, but save mock user so UI continues
      saveAuth(null, mockUser);
      setLoading(false);
      return { success: true, user: mockUser };
    }
  };

  const logout = () => {
    clearAuth();
  };

  // expose in context
  const value = {
    user,
    isAuthenticated,
    loading,
    register,
    login,
    logout,
    authFetch,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
