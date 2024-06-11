import React, { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, FormGroup, Label, Input, Row, Col, Alert } from 'reactstrap';

const IEditModal = ({ isOpen, toggle, onSave, report }) => {
  const [reportData, setReportData] = useState({
    observaciones: '',
    porcentaje: '',
    fecha_aprobacion: ''
  });

  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (report) {
      setReportData({
        observaciones: report.observaciones || '',
        porcentaje: report.porcentaje || '',
        fecha_aprobacion: formatDate(report.fecha_aprobacion) || ''
      });
    }
  }, [report]);

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReportData({ ...reportData, [name]: value });
  };

  const validateInputs = () => {
    const { observaciones, porcentaje, fecha_aprobacion } = reportData;

    if (!observaciones || !porcentaje || !fecha_aprobacion) {
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
      <ModalHeader toggle={toggle}>Editar Informe</ModalHeader>
      <ModalBody>
        {errorMessage && <Alert color="danger">{errorMessage}</Alert>}
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

export default IEditModal;
