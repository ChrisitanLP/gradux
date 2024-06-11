import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, Row, Col, Alert } from 'reactstrap';

const EditModal = ({ isOpen, toggle, onSave, user }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    rol: '',
    estado:'',
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
        estado: user.estado || ''
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
    const { nombre, apellido, email, rol ,estado} = formData;
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
      estado:'',
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
          <Row>
            <Col md={12}>
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
                <Label for="estado">Estado</Label>
                <Input
                  type="select"
                  name="estado"
                  id="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  required
                >
                  <option value="activo">Activado</option>
                  <option value="bloqueado">Bloqueado</option>
                </Input>
              </FormGroup>
            </Col>
          </Row>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          Cancelar
        </Button>
        <Button color="primary" onClick={handleSubmit}>
          Guardar
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default EditModal;
