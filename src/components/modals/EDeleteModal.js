import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

const EDeleteModal = ({ isOpen, toggle, onDelete, student }) => {
  const handleDelete = () => {
    onDelete(student.id_estudiante);
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Eliminar Estudiante</ModalHeader>
      <ModalBody>
        ¿Estás seguro de que quieres eliminar al estudiante {student?.nombre1} {student?.apellido1}?<br />Esta acción no se puede deshacer.
      </ModalBody>
      <ModalFooter>
        <Button color="danger" onClick={handleDelete}>Eliminar</Button>{' '}
        <Button color="secondary" onClick={toggle}>Cancelar</Button>
      </ModalFooter>
    </Modal>
  );
};

export default EDeleteModal;
