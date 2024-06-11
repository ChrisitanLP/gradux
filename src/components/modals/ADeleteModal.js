import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

const ADeleteModal = ({ isOpen, toggle, onDelete, activity }) => {
  const handleDelete = () => {
    onDelete(activity.id_actividad);
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Eliminar Informe</ModalHeader>
      <ModalBody>
        ¿Estás seguro de que quieres eliminar la actividad <br />Esta acción no se puede deshacer.
      </ModalBody>
      <ModalFooter>
        <Button color="warning" onClick={toggle}>Cancelar</Button>
        <Button color="danger" onClick={handleDelete}>Eliminar</Button>
      </ModalFooter>
    </Modal>
  );
};

export default ADeleteModal;
