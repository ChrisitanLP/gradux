import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { deleteUser } from 'api/users';

const DeleteModal = ({ isOpen, toggle, user, onDelete }) => {

  const handleDelete = async () => {
    try {
      await deleteUser(user.id);
      onDelete(); // Llama a la función onDelete proporcionada para actualizar la lista de usuarios después de eliminar
      toggle(); // Cierra el modal
      window.location.reload(); // Recarga la página para reflejar los cambios
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      // Manejar errores
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Eliminar Usuario</ModalHeader>
      <ModalBody>
        ¿Está seguro de que desea eliminar este usuario? <br />Esta acción no se puede deshacer.
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          Cancelar
        </Button>
        <Button color="danger" onClick={handleDelete}>
          Eliminar
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default DeleteModal;
