import React, { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, FormGroup, Label, Input, Row, Col, Alert } from 'reactstrap';
import { fetchCarreras } from 'api/common';

const ECreateModal = ({ isOpen, toggle, onSave, tutorId }) => {
  const [studentData, setStudentData] = useState({
    nombre1: '',
    nombre2: '',
    apellido1: '',
    apellido2: '',
    id_carrera: '',
    fecha_asignacion_tutor: '',
    tema_tesis: '',
    fecha_aprobacion_tema: '',
    estado_estudiante: 'En progreso',
    id_tutor: tutorId,  // Set tutorId directly here
    cedula: ''
  });
  const [carreras, setCarreras] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [cedulaError, setCedulaError] = useState('');

  useEffect(() => {
    fetchCarreras().then((carrerasData) => setCarreras(carrerasData));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStudentData({ ...studentData, [name]: value });

    if (name === 'cedula') {
      if (cedulaError) setCedulaError(''); // Clear the cedula error if the user is modifying the cedula
    }
  };

  const validateCedula = (cedula) => {
    if (cedula.length !== 10) return false;

    const digits = cedula.split('').map(Number);
    const provinceCode = digits[0] * 10 + digits[1];

    if (provinceCode < 1 || provinceCode > 24) return false;

    const thirdDigit = digits[2];
    if (thirdDigit > 6) return false;

    const checkDigit = digits.pop();

    let evenSum = 0;
    let oddSum = 0;

    digits.forEach((digit, index) => {
      if (index % 2 === 0) {
        let product = digit * 2;
        if (product > 9) product -= 9;
        oddSum += product;
      } else {
        evenSum += digit;
      }
    });

    const totalSum = oddSum + evenSum;
    const calculatedCheckDigit = 10 - (totalSum % 10);
    return checkDigit === (calculatedCheckDigit === 10 ? 0 : calculatedCheckDigit);
  };

  const validateInputs = () => {
    const { nombre1, nombre2, apellido1, apellido2, id_carrera, fecha_asignacion_tutor, tema_tesis, fecha_aprobacion_tema, cedula } = studentData;
    const namePattern = /^[a-zA-Z]+$/;

    if (Object.values(studentData).some(value => value === '')) {
      return "Por favor, complete todos los campos.";
    }

    if (!nombre1.match(namePattern) || !nombre2.match(namePattern) || !apellido1.match(namePattern) || !apellido2.match(namePattern)) {
      return "Los nombres y apellidos solo deben contener letras.";
    }

    if (!validateCedula(cedula)) {
      setCedulaError("Cédula no válida.");
      return "Cédula no válida.";
    }

    setCedulaError('');
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
      id_carrera: '',
      fecha_asignacion_tutor: '',
      tema_tesis: '',
      fecha_aprobacion_tema: '',
      estado_estudiante: 'En progreso',
      id_tutor: tutorId,  // Reset tutorId here as well
      cedula: ''
    });
    setErrorMessage('');
    setCedulaError('');
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Crear Estudiante</ModalHeader>
      <ModalBody>
        {errorMessage && <Alert color="danger">{errorMessage}</Alert>}
        <FormGroup>
          <Label for="cedula">Cédula</Label>
          <Input
            type="text"
            name="cedula"
            id="cedula"
            value={studentData.cedula}
            onChange={handleInputChange}
            required
            title="Ingrese una cédula válida"
            maxLength="10"
          />
        </FormGroup>
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
          <Label for="id_carrera">Carrera</Label>
          <Input
            type="select"
            name="id_carrera"
            id="id_carrera"
            value={studentData.id_carrera}
            onChange={handleInputChange}
            required
          >
            <option value="">Seleccionar Carrera</option>
            {carreras.map((carrera) => (
              <option key={carrera.id_carrera} value={carrera.id_carrera}>{carrera.nombre_carrera}</option>
            ))}
          </Input>
        </FormGroup>
        <Row>
          <Col md={6}>
            <FormGroup>
              <Label for="fecha_asignacion_tutor">Fecha Asignación Tutor</Label>
              <Input
                type="date"
                name="fecha_asignacion_tutor"
                id="fecha_asignacion_tutor"
                value={studentData.fecha_asignacion_tutor}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label for="fecha_aprobacion_tema">Fecha Aprobación Tema</Label>
              <Input
                type="date"
                name="fecha_aprobacion_tema"
                id="fecha_aprobacion_tema"
                value={studentData.fecha_aprobacion_tema}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
          </Col>
        </Row>
        <FormGroup>
          <Label for="tema_tesis">Tema de Tesis</Label>
          <Input
            type="text"
            name="tema_tesis"
            id="tema_tesis"
            value={studentData.tema_tesis}
            onChange={handleInputChange}
            required
          />
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <Button color="warning" onClick={toggle}>Cancelar</Button>
        <Button color="info" onClick={handleSave}>Guardar</Button>
      </ModalFooter>
    </Modal>
  );
};

export default ECreateModal;
