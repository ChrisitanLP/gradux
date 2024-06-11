import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

const IDeleteModal = ({ isOpen, toggle, onDelete, report }) => {
  const handleDelete = () => {
    onDelete(report.id_informe);
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Eliminar Informe</ModalHeader>
      <ModalBody>
        ¿Estás seguro de que quieres eliminar el informe <br />Esta acción no se puede deshacer.
      </ModalBody>
      <ModalFooter>
        <Button color="warning" onClick={toggle}>Cancelar</Button>
        <Button color="danger" onClick={handleDelete}>Eliminar</Button>
      </ModalFooter>
    </Modal>
  );
};

export default IDeleteModal;
