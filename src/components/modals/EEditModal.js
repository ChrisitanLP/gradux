import React, { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, FormGroup, Label, Input, Row, Col, Alert } from 'reactstrap';

const EEditModal = ({ isOpen, toggle, onSave, student }) => {
  const [studentData, setStudentData] = useState({
    nombre1: '',
    nombre2: '',
    apellido1: '',
    apellido2: '',
    estado_estudiante: 'En progreso',
    id_tutor: ''
  });

  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (student) {
      setStudentData({
        nombre1: student.nombre1 || '',
        nombre2: student.nombre2 || '',
        apellido1: student.apellido1 || '',
        apellido2: student.apellido2 || '',
        estado_estudiante: student.estado_estudiante || 'En progreso'
      });
    }
  }, [student]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStudentData({ ...studentData, [name]: value });
  };

  const validateInputs = () => {
    const { nombre1, nombre2, apellido1, apellido2, estado_estudiante } = studentData;
    const namePattern = /^[a-zA-Z]+$/;

    if (Object.values(studentData).some(value => value === '')) {
      return "Por favor, complete todos los campos.";
    }

    if (!nombre1.match(namePattern) || !nombre2.match(namePattern) || !apellido1.match(namePattern) || !apellido2.match(namePattern)) {
      return "Los nombres y apellidos solo deben contener letras.";
    }

    return '';
  };

  const handleSave = () => {
    const error = validateInputs();
    if (error) {
      setErrorMessage(error);
      return;
    }

    onSave(studentData);
    setStudentData({
      nombre1: '',
      nombre2: '',
      apellido1: '',
      apellido2: '',
      estado_estudiante: 'En progreso',
    });
    setErrorMessage('');
    toggle();
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Editar Estudiante</ModalHeader>
      <ModalBody>
        {errorMessage && <Alert color="danger">{errorMessage}</Alert>}
        <Row>
          <Col md={6}>
            <FormGroup>
              <Label for="nombre1">Primer Nombre</Label>
              <Input
                type="text"
                name="nombre1"
                id="nombre1"
                value={studentData.nombre1}
                onChange={handleInputChange}
                required
                title="Solo se permiten letras"
              />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label for="nombre2">Segundo Nombre</Label>
              <Input
                type="text"
                name="nombre2"
                id="nombre2"
                value={studentData.nombre2}
                onChange={handleInputChange}
                required
                title="Solo se permiten letras"
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <FormGroup>
              <Label for="apellido1">Primer Apellido</Label>
              <Input
                type="text"
                name="apellido1"
                id="apellido1"
                value={studentData.apellido1}
                onChange={handleInputChange}
                required
                title="Solo se permiten letras"
              />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label for="apellido2">Segundo Apellido</Label>
              <Input
                type="text"
                name="apellido2"
                id="apellido2"
                value={studentData.apellido2}
                onChange={handleInputChange}
                required
                title="Solo se permiten letras"
              />
            </FormGroup>
          </Col>
        </Row>
        <FormGroup>
          <Label for="estado_estudiante">Estado del Estudiante</Label>
          <Input
            type="select"
            name="estado_estudiante"
            id="estado_estudiante"
            value={studentData.estado_estudiante}
            onChange={handleInputChange}
            required
          >
            <option value="En progreso">En progreso</option>
            <option value="Graduado">Graduado</option>
            <option value="Retirado">Retirado</option>
          </Input>
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <Button color="warning" onClick={toggle}>Cancelar</Button>
        <Button color="info" onClick={handleSave}>Guardar</Button>
      </ModalFooter>
    </Modal>
  );
};

export default EEditModal;
