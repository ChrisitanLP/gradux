import React, { useState, useEffect } from 'react';
import { Button, Card, Container, Row, Col, Input } from 'reactstrap';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
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
  const [globalFilter, setGlobalFilter] = useState(null);

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

  const actionTemplate = (rowData) => {
    return (
      <>
        <Button color="primary" onClick={() => { setSelectedUser(rowData); toggleEditModal(); }}>
          <FontAwesomeIcon icon={faEdit} />
        </Button>
        <Button color="danger" onClick={() => { setSelectedUser(rowData); toggleDeleteModal(); }}>
          <FontAwesomeIcon icon={faTrash} />
        </Button>
      </>
    );
  };

  const header = (
    <div className="table-header">
      <Row className="align-items-center">
        <div className="col">
          <h3 className="mb-0">Listado de Usuarios</h3>
        </div>
        <div className="col text-right">
          <Button color="primary" onClick={toggleCreateModal}>
            Agregar Usuario <FontAwesomeIcon icon={faPlus} />
          </Button>
        </div>
        <div className="col">
          <Input
            type="search"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Buscar..."
          />
        </div>
      </Row>
    </div>
  );

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row className="mt-5">
          <Col className="mb-5 mb-xl-0" xl="12">
            <Card className="shadow">
              
              <DataTable
                value={users}
                paginator
                rows={5}
                rowsPerPageOptions={[5, 10, 20]}
                className="p-datatable-striped"
                globalFilter={globalFilter}
                header={header}
                dataKey="id"
              >
                <Column field="id" header="ID" sortable filter filterPlaceholder="Buscar por ID" style={{ maxWidth: '10%' }}/>
                <Column field="nombre" header="Nombre" sortable filter filterPlaceholder="Buscar por nombre" style={{ maxWidth: '10%' }}/>
                <Column field="apellido" header="Apellido" sortable filter filterPlaceholder="Buscar por apellido" style={{ maxWidth: '10%' }}/>
                <Column field="email" header="Email" sortable filter filterPlaceholder="Buscar por email" style={{ maxWidth: '15%' }}/>
                
                <Column field="rol" header="Rol" sortable filter filterPlaceholder="Buscar por rol" style={{ maxWidth: '10%' }}/>
                <Column body={actionTemplate} header="Acciones" />
              </DataTable>
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
