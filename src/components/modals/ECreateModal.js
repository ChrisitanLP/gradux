import React, { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, FormGroup, Label, Input, Row, Col } from 'reactstrap';
import { fetchCarreras, fetchUsuarios } from 'api/common'; 

const ECreateModal = ({ isOpen, toggle, onSave }) => {
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
    id_tutor: ''
  });
  const [carreras, setCarreras] = useState([]);
  const [tutores, setTutores] = useState([]);

  useEffect(() => {
    fetchCarreras().then((carrerasData) => setCarreras(carrerasData));
    fetchUsuarios().then((usuariosData) => setTutores(usuariosData));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStudentData({ ...studentData, [name]: value });
  };

  const handleSave = () => {
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
      id_tutor: ''
    });
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Crear Estudiante</ModalHeader>
      <ModalBody>
        <Row>
            <Col md={6}>
                <FormGroup>
                <Label for="nombre1">Primer Nombre</Label>
                <Input type="text" name="nombre1" id="nombre1" value={studentData.nombre1} onChange={handleInputChange} />
                </FormGroup>
            </Col>
            <Col md={6}>
                <FormGroup>
                <Label for="nombre2">Segundo Nombre</Label>
                <Input type="text" name="nombre2" id="nombre2" value={studentData.nombre2} onChange={handleInputChange} />
                </FormGroup>
            </Col>
        </Row>
        <Row>
            <Col md={6}>
                <FormGroup>
                <Label for="apellido1">Primer Apellido</Label>
                <Input type="text" name="apellido1" id="apellido1" value={studentData.apellido1} onChange={handleInputChange} />
                </FormGroup>
            </Col>
            <Col md={6}>
                <FormGroup>
                <Label for="apellido2">Segundo Apellido</Label>
                <Input type="text" name="apellido2" id="apellido2" value={studentData.apellido2} onChange={handleInputChange} />
                </FormGroup>
            </Col>
        </Row>
        <FormGroup>
          <Label for="id_carrera">Carrera</Label>
          <Input type="select" name="id_carrera" id="id_carrera" value={studentData.id_carrera} onChange={handleInputChange}>
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
                <Input type="date" name="fecha_asignacion_tutor" id="fecha_asignacion_tutor" value={studentData.fecha_asignacion_tutor} onChange={handleInputChange} />
                </FormGroup>
            </Col>
            <Col md={6}>
                <FormGroup>
                <Label for="fecha_aprobacion_tema">Fecha Aprobación Tema</Label>
                <Input type="date" name="fecha_aprobacion_tema" id="fecha_aprobacion_tema" value={studentData.fecha_aprobacion_tema} onChange={handleInputChange} />
                </FormGroup>
            </Col>
        </Row>
        <FormGroup>
          <Label for="tema_tesis">Tema de Tesis</Label>
          <Input type="text" name="tema_tesis" id="tema_tesis" value={studentData.tema_tesis} onChange={handleInputChange} />
        </FormGroup>
    
        <FormGroup>
          <Label for="id_tutor">Tutor</Label>
          <Input type="select" name="id_tutor" id="id_tutor" value={studentData.id_tutor} onChange={handleInputChange}>
            <option value="">Seleccionar Tutor</option>
            {tutores.map((tutor) => (
              <option key={tutor.id} value={tutor.id}>{tutor.nombre} {tutor.apellido}</option>
            ))}
          </Input>
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleSave}>Guardar</Button>{' '}
        <Button color="secondary" onClick={toggle}>Cancelar</Button>
      </ModalFooter>
    </Modal>
  );
};

export default ECreateModal;
