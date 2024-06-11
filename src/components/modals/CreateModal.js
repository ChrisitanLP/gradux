import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, Row, Col, Alert } from 'reactstrap';

const EditModal = ({ isOpen, toggle, onSave, user }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    confirmPassword: '',
    rol: '',
  });

  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || '',
        apellido: user.apellido || '',
        email: user.email || '',
        password: '',
        confirmPassword: '',
        rol: user.rol || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateInputs = () => {
    const { nombre, apellido, email, password, confirmPassword, rol } = formData;
    const namePattern = /^[a-zA-Z]+$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if (Object.values(formData).some((value) => value === '')) {
      return "Por favor, complete todos los campos.";
    }

    if (!nombre.match(namePattern) || !apellido.match(namePattern)) {
      return "Los nombres y apellidos solo deben contener letras.";
    }

    if (!email.match(emailPattern)) {
      return "Por favor, ingrese un correo electrónico válido.";
    }

    if (!password.match(passwordPattern)) {
      return "La contraseña debe tener al menos 8 caracteres, incluyendo una letra mayúscula y un número.";
    }

    if (password !== confirmPassword) {
      return "Las contraseñas no coinciden.";
    }

    return '';
  };

  const handleSubmit = () => {
    const error = validateInputs();
    if (error) {
      setErrorMessage(error);
      return;
    }

    onSave(formData);
    setFormData({
      nombre: '',
      apellido: '',
      email: '',
      password: '',
      confirmPassword: '',
      rol: '',
    });
    setErrorMessage('');
    toggle();
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Agregar Usuario</ModalHeader>
      <ModalBody>
        {errorMessage && <Alert color="danger">{errorMessage}</Alert>}
        <Form>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="nombre">Nombre</Label>
                <Input
                  type="text"
                  name="nombre"
                  id="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  pattern="[a-zA-Z]+"
                  title="Solo se permiten letras"
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="apellido">Apellido</Label>
                <Input
                  type="text"
                  name="apellido"
                  id="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  required
                  pattern="[a-zA-Z]+"
                  title="Solo se permiten letras"
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="email">Email</Label>
                <Input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="rol">Rol</Label>
                <Input
                  type="select"
                  name="rol"
                  id="rol"
                  value={formData.rol}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar Rol</option>
                  <option value="administrador">Administrador</option>
                  <option value="docente">Docente</option>
                </Input>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="password">Contraseña</Label>
                <Input
                  type="password"
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  pattern="^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$"
                  title="La contraseña debe tener al menos 8 caracteres, incluyendo una letra mayúscula y un número."
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="confirmPassword">Confirmar Contraseña</Label>
                <Input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
            </Col>
          </Row>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="warning" onClick={toggle}>
          Cancelar
        </Button>
        <Button color="info" onClick={handleSubmit}>
          Guardar
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default EditModal;
