import React, { useState, useEffect } from 'react';
import { Button, Card, CardHeader, Table, Container, Row, Col } from 'reactstrap';
import Header from 'components/Headers/Header';
import ECreateModal from 'components/modals/ECreateModal'; // Importamos ECreateModal correctamente
import EDeleteModal from 'components/modals/EDeleteModal';
import EEditModal from 'components/modals/EEditModal';
import { fetchStudents, deleteStudent, createStudent, updateStudent } from 'api/students';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';

const Estudents = () => {
  const [students, setStudents] = useState([]);
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
                    <h3 className="mb-0">Listado de Estudiantes</h3>
                  </div>
                  <div className="col text-right">
                    <Button color="primary" onClick={toggleCreateModal} >
                      Agregar Estudiante <FontAwesomeIcon icon={faPlus}/>
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
                    <th scope="col">Carrera</th>
                    <th scope="col">Tutor</th>
                    <th scope="col">Tema de Tesis</th>
                    <th scope="col">Estado</th>
                    <th scope="col">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id_estudiante}>
                      <td>{student.id_estudiante}</td>
                      <td>{student.nombre1} {student.nombre2}</td>
                      <td>{student.apellido1} {student.apellido2}</td>
                      <td>{student.nombre_carrera}</td>
                      <td>{student.nombre_tutor}</td>
                      <td>{student.tema_tesis}</td>
                      <td>{student.estado_estudiante}</td>
                      <td>
                        <Button color="primary" onClick={() => {setSelectedStudent(student); toggleEditModal();}}>
                          Editar <FontAwesomeIcon icon={faEdit} />
                        </Button>{' '}
                        <Button color="danger" onClick={() => {setSelectedStudent(student); toggleDeleteModal();}}>
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
      <ECreateModal isOpen={createModalOpen} toggle={toggleCreateModal} onSave={handleCreateStudent} />
      <EDeleteModal isOpen={deleteModalOpen} toggle={toggleDeleteModal} onDelete={handleDeleteStudent} student={selectedStudent} />
      <EEditModal isOpen={editModalOpen} toggle={toggleEditModal} onSave={handleEditStudent} student={selectedStudent} />
    </>
  );
};

export default Estudents;
