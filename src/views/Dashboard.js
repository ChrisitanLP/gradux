import React, { useState, useEffect } from 'react';
import { Card, Container, Row, Col, Input } from 'reactstrap';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Header from 'components/Headers/TeacherHeader';
import PDFGeneratorDashboard from 'components/PDF/pdfGeneratorDashboard';
import axios from 'axios';
import { useAuth } from 'context/AuthContext';

const Index = () => {
  const [students, setStudents] = useState([]);
  const [expandedRows, setExpandedRows] = useState([]);
  const [globalFilter, setGlobalFilter] = useState(null);
  const { auth } = useAuth();

  useEffect(() => {
    if (auth.userId) {
      fetchStudentsAndReportsByTutor(auth.userId);
    }
  }, [auth.userId]);

  const fetchStudentsAndReportsByTutor = async (tutorId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/studentsAndReportsByTutor/${tutorId}`);
      setStudents(response.data.students);
    } catch (error) {
      console.error('Error al obtener los estudiantes y sus informes:', error);
    }
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <PDFGeneratorDashboard student={rowData} />
      </React.Fragment>
    );
  };

  const renderExtraInfo = (student) => {
    return (
      <div className="p-3">
        <strong>Información Adicional:</strong>
        <Row>
          <Col md="6">
            <p><strong>Fecha de Asignación del Tutor:</strong> {student.fecha_asignacion_tutor}<br /></p>
          </Col>
          <Col md="6">
            <p><strong>Fecha de Aprobación del Tema:</strong> {student.fecha_aprobacion_tema}<br /></p>
          </Col>
        </Row>
        <strong>Listado de Informes:</strong>
        <table className="table table-bordered table-hover">
          <thead className="table-header-custom">
            <tr>
              <th>ID</th>
              <th>Tipo Anexo</th>
              <th>Fecha Creación</th>
              <th>Observaciones</th>
              <th>Porcentaje</th>
              <th>Visualizar</th>
            </tr>
          </thead>
          <tbody>
            {student.informes.map((report) => (
              <tr key={report.id_Informe}>
                <td>{report.id_Informe}</td>
                <td>{report.tipo_informe}</td>
                <td>{report.fecha_creacion}</td>
                <td>{report.observaciones}</td>
                <td>{report.porcentaje}%</td>
                <td>{actionBodyTemplate(report)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const header = (
    <div className="table-header">
      <Row className="align-items-center">
        <div className="col">
          <h3 className="mb-0">Listado de Estudiantes a Cargo</h3>
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
                paginator
                rows={5}
                rowsPerPageOptions={[5, 10, 20]}
                className="p-datatable-striped"
                globalFilter={globalFilter}
                header={header}
                rowExpansionTemplate={renderExtraInfo}
                expandedRows={expandedRows}
                onRowToggle={(e) => setExpandedRows(e.data)}
                dataKey="id_estudiante"
              >
                <Column expander style={{ width: '3em' }} />
                <Column field="id_estudiante" header="ID" sortable filter filterPlaceholder="Buscar por ID" style={{ maxWidth: '10%' }}/>
                <Column field="cedula" header="Cedula" sortable filter filterPlaceholder="Buscar por cedula" style={{ maxWidth: '10%' }} />
                <Column field="nombre1" header="Nombre" sortable filter filterPlaceholder="Buscar por nombre" style={{ maxWidth: '10%' }}/>
                <Column field="apellido1" header="Apellido" sortable filter filterPlaceholder="Buscar por apellido" style={{ maxWidth: '10%' }}/>
                <Column field="nombre_carrera" header="Carrera" sortable filter filterPlaceholder="Buscar por carrera" style={{ maxWidth: '15%' }}/>
                <Column field="tema_tesis" header="Tema de Tesis" sortable filter filterPlaceholder="Buscar por tema" style={{ maxWidth: '15%' }}/>
                <Column field="estado_estudiante" header="Estado" sortable filter filterPlaceholder="Buscar por estado" style={{ maxWidth: '10%' }}/>
              </DataTable>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Index;
