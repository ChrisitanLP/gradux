import React, { useState, useEffect } from 'react';
import { Button, Card, Container, Row, Col, Input } from 'reactstrap';
import Header from 'components/Headers/Header';
import ECreateModal from 'components/modals/ECreateModal'; 
import EDeleteModal from 'components/modals/EDeleteModal';
import EEditModal from 'components/modals/EEditModal';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { fetchStudents, deleteStudent, createStudent, updateStudent } from 'api/students';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';

const Estudents = () => {
  const [students, setStudents] = useState([]);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    fetchAllStudents();
  }, []);

  const fetchAllStudents = async () => {
    try {
      const studentsData = await fetchStudents();
      setStudents(studentsData);
    } catch (error) {
      console.error('Error al obtener estudiantes:', error);
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

  const handleCreateStudent = async (studentData) => {
    try {
      await createStudent(studentData);
      fetchAllStudents();
      toggleCreateModal();
    } catch (error) {
      console.error('Error al crear estudiante:', error);
    }
  };

  const handleEditStudent = async (studentData) => {
    try {
      await updateStudent(selectedStudent.id_estudiante, studentData);
      fetchAllStudents();
      toggleEditModal();
    } catch (error) {
      console.error('Error al editar estudiante:', error);
    }
  };

  const handleDeleteStudent = async () => {
    try {
      await deleteStudent(selectedStudent.id_estudiante);
      // Actualiza la lista de estudiantes eliminando al estudiante eliminado
      setStudents(students.filter(student => student.id_estudiante !== selectedStudent.id_estudiante));
      toggleDeleteModal();
    } catch (error) {
      console.error('Error al eliminar estudiante:', error);
    }
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <>
        <Button color="primary" onClick={() => { setSelectedStudent(rowData); toggleEditModal(); }}>
          <FontAwesomeIcon icon={faEdit} />
        </Button>
        <Button color="danger" onClick={() => { setSelectedStudent(rowData); toggleDeleteModal(); }}>
          <FontAwesomeIcon icon={faTrash} />
        </Button>
      </>
    );
  };

  const header = (
    <div className="table-header">
      <Row className="align-items-center">
        <div className="col">
          <h3 className="mb-0">Listado de Estudiantes</h3>
        </div>
        <div className="col text-right">
          <Button color="primary" onClick={toggleCreateModal}>
            Agregar Estudiante <FontAwesomeIcon icon={faPlus} />
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
                value={students} 
                className="p-datatable-striped"
                paginator
                rows={5}
                rowsPerPageOptions={[5, 10, 20]}
                globalFilter={globalFilter}
                header={header}
              >
                <Column field="id_estudiante" header="ID" sortable filter filterPlaceholder="Buscar por ID" style={{ maxWidth: '10%' }} />
                <Column field="cedula" header="Cedula" sortable filter filterPlaceholder="Buscar por cedula" style={{ maxWidth: '15%' }} />
                <Column field="nombre1" header="Nombre" sortable filter filterPlaceholder="Buscar por nombre" style={{ maxWidth: '10%' }} />
                <Column field="apellido1" header="Apellido" sortable filter filterPlaceholder="Buscar por apellido" style={{ maxWidth: '10%' }} />
                <Column field="nombre_carrera" header="Carrera" sortable filter filterPlaceholder="Buscar por carrera" style={{ maxWidth: '15%' }} />
                <Column field="nombre_tutor" header="Tutor" sortable filter filterPlaceholder="Buscar por tutor" style={{ maxWidth: '15%' }} />
                <Column field="tema_tesis" header="Tema de Tesis" sortable filter filterPlaceholder="Buscar por tema" style={{ maxWidth: '15%' }} bodyStyle={{ maxWidth: '100px', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }} />
                <Column field="estado_estudiante" header="Estado" sortable filter filterPlaceholder="Buscar por estado" style={{ maxWidth: '10%' }} />
                <Column body={actionBodyTemplate} header="Acciones" style={{ maxWidth: '15%' }} />
              </DataTable>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Modales */}
      <ECreateModal isOpen={createModalOpen} toggle={toggleCreateModal} onSave={handleCreateStudent} />
      <EDeleteModal isOpen={deleteModalOpen} toggle={toggleDeleteModal} onDelete={handleDeleteStudent} student={selectedStudent} />
      <EEditModal isOpen={editModalOpen} toggle={toggleEditModal} onSave={handleEditStudent} student={selectedStudent} />
    </>
  );
};

export default Estudents;
