// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import "../axiosConfig"; // Importa tu configuración de axios aquí

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});

  const checkAuth = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/check-auth", {
        withCredentials: true
      });
      setAuth(response.data);
    } catch (error) {
      console.error("Error al verificar autenticación:", error);
      setAuth({});
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = (userData) => {
    setAuth(userData);
    checkAuth();
  };

  const logout = async () => {
    localStorage.removeItem('token');
    setAuth({});
    try {
      await axios.post("http://localhost:5000/api/logout", {}, { withCredentials: true });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
