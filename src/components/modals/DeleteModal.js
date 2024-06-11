import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { deleteUser } from 'api/users';

const DeleteModal = ({ isOpen, toggle, onDelete, user }) => {
  const handleDelete = async () => {
    try {
      await deleteUser(user.id);
      onDelete(user.id); // Pasa el id del usuario eliminado para actualizar la lista en el componente principal
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      // Manejar errores (mostrar mensaje de error, etc.)
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Eliminar Usuario</ModalHeader>
      <ModalBody>
        ¿Está seguro de que desea eliminar al usuario {user?.nombre}?<br />Esta acción no se puede deshacer.
      </ModalBody>
      <ModalFooter>
        <Button color="warning" onClick={toggle}>
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
