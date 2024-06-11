import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, Row, Col, Alert } from 'reactstrap';

const EditModal = ({ isOpen, toggle, onSave, user }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
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
    const { nombre, apellido, email, rol } = formData;
    const namePattern = /^[a-zA-Z]+$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Verificar campos vacíos
    if (Object.values(formData).some((value) => value === '' && value !== formData.password)) {
      return "Por favor, complete todos los campos.";
    }

    // Verificar que los nombres solo contienen letras
    if (!nombre.match(namePattern) || !apellido.match(namePattern)) {
      return "Los nombres y apellidos solo deben contener letras.";
    }

    // Verificar formato de email
    if (!email.match(emailPattern)) {
      return "Por favor, ingrese un correo electrónico válido.";
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
      rol: '',
    });
    setErrorMessage('');
    toggle();
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Editar Usuario</ModalHeader>
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
            <Col md={12}>
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
