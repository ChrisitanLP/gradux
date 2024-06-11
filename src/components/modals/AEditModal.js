import React, { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, FormGroup, Label, Input, Alert } from 'reactstrap';

const AEditModal = ({ isOpen, toggle, onSave, activity }) => {
  const [activityData, setActivityData] = useState({
    nombreActividad: '',
    fecha_Actividad: ''
  });

  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (activity) {
      setActivityData({
        nombreActividad: activity.nombreActividad || '',
        fecha_Actividad: formatDate(activity.fecha_Actividad) || ''
      });
    }
  }, [activity]);

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
    setActivityData({ ...activityData, [name]: value });
  };

  const validateInputs = () => {
    const { nombreActividad, fecha_Actividad } = activityData;

    if (!nombreActividad || !fecha_Actividad) {
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
      <ModalHeader toggle={toggle}>Editar Actividad</ModalHeader>
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

export default AEditModal;
