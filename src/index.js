// src/views/index.js

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";
import 'primereact/resources/themes/saga-blue/theme.css';  // Tema
import 'primereact/resources/primereact.min.css';          // Estilos de PrimeReact
import 'primeicons/primeicons.css';                        // Iconos de PrimeReact

import AdminLayout from "layouts/Admin.js";
import TeacherLayout from "layouts/Teacher.js";
import AuthLayout from "layouts/Auth.js";
import { AuthProvider, useAuth } from "context/AuthContext";

const PrivateRoute = ({ element: Element, ...rest }) => {
  const { auth } = useAuth();
  return auth.isLoggedIn ? <Element {...rest} /> : <Navigate to="/auth/login" replace />;
};

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route path="/admin/*" element={<PrivateRoute element={AdminLayout} />} />
        <Route path="/teacher/*" element={<PrivateRoute element={TeacherLayout} />} />
        <Route path="/auth/*" element={<AuthLayout />} />
        <Route path="*" element={<Navigate to="/admin/index" replace />} />
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);