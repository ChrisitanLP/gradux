// src/views/examples/Login.js

import React, { useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Col,
} from "reactstrap";
import { useAuth } from "context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const { auth, login } = useAuth();

  const handleLogin = async () => {
    setLoginError("");

    if (!email || !password) {
      setLoginError("Todos los campos son obligatorios.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/login",
        { email, password },
        { withCredentials: true }
      );

      if (response.data.success) {
        login();
      } else {
        setLoginError(response.data.message);
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setLoginError("Error al iniciar sesión. Inténtelo de nuevo más tarde.");
    }
  };

  if (auth.isLoggedIn) {
    if (auth.rol == 'administrador'){
      return <Navigate to="/admin/index" replace />;
    }else if (auth.rol == 'docente'){
      return <Navigate to="/teacher/index" replace />;
    }
  }

  return (
    <Col lg="5" md="7">
      <Card className="bg-secondary shadow border-0">
        <CardBody className="px-lg-5 py-lg-5">
          <div className="text-center text-muted mb-4">
            <h1 className="mb-4">Inicio de Sesión</h1>
            <small>Inicie Sesión con sus credenciales</small>
          </div>
          <Form role="form">
            <FormGroup className="mb-3">
              <InputGroup className="input-group-alternative">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="ni ni-email-83" />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  placeholder="Correo Electrónico"
                  type="email"
                  autoComplete="new-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <InputGroup className="input-group-alternative">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="ni ni-lock-circle-open" />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  placeholder="Contraseña"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </InputGroup>
            </FormGroup>
            {loginError && (
              <div className="text-center text-danger mb-3">{loginError}</div>
            )}
            <div className="custom-control custom-control-alternative custom-checkbox">
              <input
                className="custom-control-input"
                id="customCheckLogin"
                type="checkbox"
              />
              <label
                className="custom-control-label"
                htmlFor="customCheckLogin"
              >
                <span className="text-muted">Recordar Contraseña</span>
              </label>
            </div>
            <div className="text-center">
              <Button
                className="my-4"
                color="primary"
                type="button"
                onClick={handleLogin}
              >
                Iniciar Sesión
              </Button>
            </div>
          </Form>
        </CardBody>
      </Card>
    </Col>
  );
};

export default Login;