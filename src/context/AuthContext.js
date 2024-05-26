// src/context/AuthContext.js

import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});

  const checkAuth = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/check-auth", { withCredentials: true });
      setAuth(response.data);
    } catch (error) {
      console.error("Error al verificar autenticación:", error);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = () => {
    checkAuth();
  }
  const logout = () => {
    setAuth(false);
    axios.post("http://localhost:5000/api/logout", {}, { withCredentials: true });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);