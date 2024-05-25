import React, { useState, useEffect } from 'react';
import { Button, Card, CardHeader, Table, Container, Row, Col } from 'reactstrap';
import Header from 'components/Headers/Header';
import { fetchUsers, createUser, updateUser } from 'api/users';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';

import CreateModal from 'components/modals/CreateModal';
import EditModal from 'components/modals/EditModal';
import DeleteModal from 'components/modals/DeleteModal';

const Index = () => {
  const [users, setUsers] = useState([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      const usersData = await fetchUsers();
      setUsers(usersData);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    }
  };

  const toggleCreateModal = () => {
    setCreateModalOpen(!createModalOpen);
  };

  const toggleEditModal = () => {
    setEditModalOpen(!editModalOpen);
  };

  const toggleDeleteModal = () => {
    setDeleteModalOpen(!deleteModalOpen);
  };

  const handleCreateUser = async (userData) => {
    try {
      await createUser(userData);
      fetchAllUsers();
      toggleCreateModal();
    } catch (error) {
      console.error('Error al crear usuario:', error);
    }
  };

  const handleEditUser = async (userData) => {
    try {
      await updateUser(selectedUser.id, userData);
      fetchAllUsers();
      toggleEditModal();
    } catch (error) {
      console.error('Error al editar usuario:', error);
    }
  };

  const handleDeleteUser = (userId) => {
    setUsers(users.filter(user => user.id !== userId)); // Actualiza la lista de usuarios después de eliminar
    toggleDeleteModal();
  };

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row className="mt-5">
          <Col className="mb-5 mb-xl-0" xl="12">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Listado de Usuarios</h3>
                  </div>
                  <div className="col text-right">
                    <Button color="primary" onClick={toggleCreateModal}>
                      Agregar Usuario <FontAwesomeIcon icon={faPlus} />
                    </Button>
                  </div>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Nombre</th>
                    <th scope="col">Apellido</th>
                    <th scope="col">Email</th>
                    <th scope="col">Contraseña</th>
                    <th scope="col">Rol</th>
                    <th scope="col">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.nombre}</td>
                      <td>{user.apellido}</td>
                      <td>{user.email}</td>
                      <td>{user.password}</td>
                      <td>{user.rol}</td>
                      <td>
                        <Button color="primary" onClick={() => { setSelectedUser(user); toggleEditModal(); }}>
                          Editar <FontAwesomeIcon icon={faEdit} />
                        </Button>{' '}
                        <Button color="danger" onClick={() => { setSelectedUser(user); toggleDeleteModal(); }}>
                          Eliminar <FontAwesomeIcon icon={faTrash} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Modales */}
      <CreateModal isOpen={createModalOpen} toggle={toggleCreateModal} onSave={handleCreateUser} />
      <EditModal isOpen={editModalOpen} toggle={toggleEditModal} user={selectedUser} onSave={handleEditUser} />
      <DeleteModal isOpen={deleteModalOpen} toggle={toggleDeleteModal} user={selectedUser} onDelete={handleDeleteUser} />
    </>
  );
};

export default Index;
