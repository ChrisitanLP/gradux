import React, { useState, useEffect } from 'react';
import { Card, CardHeader, Table, Container, Row, Col } from 'reactstrap';
import Header from 'components/Headers/TeacherHeader';
import axios from 'axios';
import { useAuth } from 'context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

const Index = () => {
  const [students, setStudents] = useState([]);
  const [expandedRows, setExpandedRows] = useState([]);
  const { auth } = useAuth();

  useEffect(() => {
    if (auth.userId) {
      fetchStudentsByTutor(auth.userId);
    }
  }, [auth.userId]);

  const fetchStudentsByTutor = async (tutorId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/bytutor/${tutorId}`);
      setStudents(response.data.students);
    } catch (error) {
      console.error('Error al obtener los estudiantes:', error);
    }
  };

  const handleRowClick = (studentId) => {
    const currentIndex = expandedRows.indexOf(studentId);
    const newExpandedRows = [...expandedRows];

    if (currentIndex >= 0) {
      newExpandedRows.splice(currentIndex, 1);
    } else {
      newExpandedRows.push(studentId);
    }

    setExpandedRows(newExpandedRows);
  };

  const renderExtraInfo = (student) => {
    return (
      <tr key={`extra-${student.id_estudiante}`}>
        <td colSpan="7">
          <div className="p-3">
            <strong>Información Adicional:</strong>
            <Row>
              <Col md="6">
                <p><strong>Fecha de Asignación del Tutor:</strong> {student.fecha_asignacion_tutor}<br></br>
                <strong>Fecha de Aprobación del Tema:</strong> {student.fecha_aprobacion_tema}<br></br>
                <strong>Nombre del Tutor:</strong> {student.nombre_tutor}</p>
              </Col>
            </Row>
          </div>
        </td>
      </tr>
    );
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
                    <h3 className="mb-0">Listado de Estudiantes a Cargo</h3>
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
                    <th scope="col">Tema de Tesis</th>
                    <th scope="col">Estado</th>
                    <th scope="col">Leer Más</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(student => (
                    <React.Fragment key={student.id_estudiante}>
                      <tr>
                        <td>{student.id_estudiante}</td>
                        <td>{student.nombre1} {student.nombre2}</td>
                        <td>{student.apellido1} {student.apellido2}</td>
                        <td>{student.nombre_carrera}</td>
                        <td>{student.tema_tesis}</td>
                        <td>{student.estado_estudiante}</td>
                        <td>
                          <FontAwesomeIcon
                            icon={expandedRows.includes(student.id_estudiante) ? faMinus : faPlus}
                            onClick={() => handleRowClick(student.id_estudiante)}
                            style={{ cursor: 'pointer' }}
                          />
                        </td>
                      </tr>
                      {expandedRows.includes(student.id_estudiante) && renderExtraInfo(student)}
                    </React.Fragment>
                  ))}
                </tbody>
              </Table>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Index;
