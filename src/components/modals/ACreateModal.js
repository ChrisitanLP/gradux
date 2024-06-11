import React, { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, FormGroup, Label, Input, Alert } from 'reactstrap';

const ACreateModal = ({ isOpen, toggle, onSave, reportId }) => {
  const [activityData, setActivityData] = useState({
    id_informe_corr: '',
    nombreActividad: '',
    fecha_Actividad: ''
  });

  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (reportId) {
      setActivityData((prevState) => ({
        ...prevState,
        id_informe_corr: reportId
      }));
    }
  }, [reportId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setActivityData({ ...activityData, [name]: value });
  };

  const validateInputs = () => {
    const { id_informe_corr, nombreActividad, fecha_Actividad } = activityData;

    if (!id_informe_corr || !nombreActividad || !fecha_Actividad) {
      return "Por favor, complete todos los campos.";
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
    onSave(activityData);
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Crear Actividad</ModalHeader>
      <ModalBody>
        {errorMessage && <Alert color="danger">{errorMessage}</Alert>}
        <FormGroup>
          <Label for="fecha_Actividad">Fecha de Actividad</Label>
          <Input
            type="date"
            name="fecha_Actividad"
            value={activityData.fecha_Actividad}
            onChange={handleInputChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="nombreActividad">Actividad</Label>
          <Input
            type="textarea"
            name="nombreActividad"
            value={activityData.nombreActividad}
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

export default ACreateModal;
