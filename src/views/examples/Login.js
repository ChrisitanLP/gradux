import React, { useState } from "react";
import axios from "axios";
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
  Row,
  Col,
} from "reactstrap";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
      });
      // Si el inicio de sesión es exitoso, redirigir al usuario a otra página
      if (response.data.success) {
        window.location.href = "/dashboard"; // Cambiar "/dashboard" por la ruta deseada
      } else {
        // Si hay un error en el inicio de sesión, mostrar un mensaje de error
        setLoginError(response.data.message);
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      // Si hay un error en la solicitud, mostrar un mensaje de error genérico
      setLoginError("Error al iniciar sesión. Inténtelo de nuevo más tarde.");
    }
  };

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
      <Row className="mt-3">
        <Col xs="6">
          <a
            className="text-light"
            href="#pablo"
            onClick={(e) => e.preventDefault()}
          >
            <small>¿Olvidó su contraseña?</small>
          </a>
        </Col>
        <Col className="text-right" xs="6">
          <a
            className="text-light"
            href="#pablo"
            onClick={(e) => e.preventDefault()}
          >
            <small>Crear una Cuenta</small>
          </a>
        </Col>
      </Row>
    </Col>
  );
};

export default Login;
