import React, { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, FormGroup, Label, Input, Row, Col, Alert } from 'reactstrap';
import { fetchTiposInformes, fetchEstudiantes } from 'api/common';

const A11CreateModal = ({ isOpen, toggle, onSave, tutorId }) => {
  const [reportData, setReportData] = useState({
    id_tipo_informe: '2',
    id_estudiante_Per: '',
    observaciones: '',
    id_usuario_tutor: tutorId,
    porcentaje: '',
    fecha_aprobacion: ''
  });

  const [tiposInforme, setTiposInforme] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const tiposInformeData = await fetchTiposInformes();
        setTiposInforme(tiposInformeData);
        
        const estudiantesData = await fetchEstudiantes(tutorId);
        setEstudiantes(estudiantesData);
      } catch (error) {
        console.error('Error al obtener datos:', error);
      }
    }
    
    fetchData();
  }, [tutorId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReportData({ ...reportData, [name]: value });
  };

  const validateInputs = () => {
    const { id_tipo_informe, id_estudiante_Per, porcentaje, fecha_aprobacion } = reportData;

    if (!id_tipo_informe || !id_estudiante_Per || !porcentaje || !fecha_aprobacion) {
      return "Por favor, complete todos los campos.";
    }

    if (isNaN(porcentaje) || porcentaje < 0 || porcentaje > 100) {
      return "Por favor, ingrese un porcentaje válido (0-100).";
    }

    return '';
  };

  const handleSave = () => {
    const error = validateInputs();
    if (error) {
      setErrorMessage(error);
      return;
    }
    setErrorMessage('');
    onSave(reportData);
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
        <ModalHeader toggle={toggle}>Crear Anexo11</ModalHeader>
        <ModalBody>
            {errorMessage && <Alert color="danger">{errorMessage}</Alert>}
            <FormGroup>
                <Label for="id_estudiante_Per">Estudiante</Label>
                <Input 
                    type="select" 
                    name="id_estudiante_Per" 
                    value={reportData.id_estudiante_Per} 
                    onChange={handleInputChange}
                >
                <option value="">Seleccionar estudiante</option>
                {estudiantes.map((estudiante) => (
                <option key={estudiante.id_estudiante} value={estudiante.id_estudiante}> {`${estudiante.nombre1} ${estudiante.nombre2} ${estudiante.apellido1} ${estudiante.apellido2}`}</option>
                ))}
                </Input>
            </FormGroup>
            <Row>
                <Col md={6}>
                  <FormGroup>
                      <Label for="fecha_aprobacion">Fecha de Aprobación</Label>
                      <Input 
                          type="date" 
                          name="fecha_aprobacion" 
                          value={reportData.fecha_aprobacion} 
                          onChange={handleInputChange} 
                      />
                  </FormGroup>
                </Col>
                <Col md={6}>
                    <FormGroup>
                        <Label for="porcentaje">Porcentaje</Label>
                        <Input 
                            type="number" 
                            name="porcentaje" 
                            value={reportData.porcentaje} 
                            onChange={handleInputChange} 
                            required
                        />
                    </FormGroup>
                </Col>
            </Row>
            <FormGroup>
                <Label for="observaciones">Observaciones</Label>
                <Input 
                    type="textarea" 
                    name="observaciones" 
                    value={reportData.observaciones} 
                    onChange={handleInputChange} 
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

export default A11CreateModal;
