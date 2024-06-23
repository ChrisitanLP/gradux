import React, { useState, useEffect } from 'react';
import { Button, Card, Container, Row, Col, Input } from 'reactstrap';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Header from 'components/Headers/TeacherHeader';
import ICreateModal from 'components/modals/ICreateModal';
import IDeleteModal from 'components/modals/IDeleteModal';
import IEditModal from 'components/modals/IEditModal';
import ACreateModal from 'components/modals/ACreateModal';
import AEditModal from 'components/modals/AEditModal';
import ADeleteModal from 'components/modals/ADeleteModal';
import PDFGenerator from 'components/PDF/pdfGenerator';
import { createReport, deleteReport, updateReport } from 'api/reports';
import { createActivity, deleteActivity, updateActivity } from 'api/activities';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useAuth } from 'context/AuthContext';

const Tables = () => {
  const [reports, setReports] = useState([]);
  const [expandedRows, setExpandedRows] = useState([]);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const [createActivityModalOpen, setCreateActivityModalOpen] = useState(false);
  const [editActivityModalOpen, setEditActivityModalOpen] = useState(false);
  const [deleteActivityModalOpen, setDeleteActivityModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [selectedReportIdForActivity, setSelectedReportIdForActivity] = useState(null);

  const { auth } = useAuth();

  useEffect(() => {
    if (auth.userId) {
      fetchReportsByTutor(auth.userId);
    }
  }, [auth.userId]);

  const fetchReportsByTutor = async (tutorId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/reportsbytutor/${tutorId}`);
      setReports(response.data.informes);
    } catch (error) {
      console.error('Error al obtener informes:', error);
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

  const toggleCreateActivityModal = (reportId = null) => {
    setSelectedReportIdForActivity(reportId);
    setCreateActivityModalOpen(!createActivityModalOpen);
  };

  const toggleEditActivityModal = () => {
    setEditActivityModalOpen(!editActivityModalOpen);
  };

  const toggleDeleteActivityModal = () => {
    setDeleteActivityModalOpen(!deleteActivityModalOpen);
  };

  const handleCreateReport = async (reportData) => {
    try {
      await createReport(reportData);
      fetchReportsByTutor(auth.userId);
      toggleCreateModal();
    } catch (error) {
      console.error('Error al crear informes:', error);
    }
  };

  const handleEditReport = async (reportData) => {
    try {
      await updateReport(selectedReport.id_Informe, reportData);
      fetchReportsByTutor(auth.userId);
      toggleEditModal();
    } catch (error) {
      console.error('Error al editar informes:', error);
    }
  };

  const handleDeleteReport = async () => {
    try {
      await deleteReport(selectedReport.id_Informe);
      setReports(reports.filter(report => report.id_Informe !== selectedReport.id_Informe));
      toggleDeleteModal();
    } catch (error) {
      console.error('Error al eliminar informes:', error);
    }
  };

  const handleCreateActivity = async (activityData) => {
    try {
      await createActivity(activityData);
      fetchReportsByTutor(auth.userId);  // Refresh reports to show new activity
      toggleCreateActivityModal();
    } catch (error) {
      console.error('Error al crear actividad:', error);
    }
  };

  const handleEditActivity = async (activityData) => {
    try {
      await updateActivity(selectedActivity.id_actividad, activityData);
      fetchReportsByTutor(auth.userId);  // Refresh reports to show updated activity
      toggleEditActivityModal();
    } catch (error) {
      console.error('Error al editar actividad:', error);
    }
  };

  const handleDeleteActivity = async () => {
    try {
      await deleteActivity(selectedActivity.id_actividad);
      fetchReportsByTutor(auth.userId);  // Refresh reports to remove deleted activity
      toggleDeleteActivityModal();
    } catch (error) {
      console.error('Error al eliminar actividad:', error);
    }
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button color="primary" onClick={() => { setSelectedReport(rowData); toggleEditModal(); }}>
          <FontAwesomeIcon icon={faEdit} />
        </Button>
        <Button color="danger" onClick={() => { setSelectedReport(rowData); toggleDeleteModal(); }}>
          <FontAwesomeIcon icon={faTrash} />
        </Button>
        <PDFGenerator report={rowData} />
      </React.Fragment>
    );
  };

  const actionBodyAditional = (actividad) => {
    return (
      <React.Fragment>
        <Button color="info" onClick={() => { setSelectedActivity(actividad); toggleEditActivityModal(); }}>
          <FontAwesomeIcon icon={faEdit} />
        </Button>
        <Button color="warning" onClick={() => { setSelectedActivity(actividad); toggleDeleteActivityModal(); }}>
          <FontAwesomeIcon icon={faTrash} />
        </Button>
      </React.Fragment>
    );
  };

  const renderExtraInfo = (informes) => {
    return (
      <div className="p-3">
        <Button color="info" onClick={() => toggleCreateActivityModal(informes.id_Informe)}>
          Agregar Actividad <FontAwesomeIcon icon={faPlus} />
        </Button>
        <table className="table table-bordered table-hover">
          <thead className="table-header-custom">
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Actividad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {informes.actividades.map((actividad) => (
              <tr key={actividad.id_actividad}>
                <td style={{ maxWidth: '5%' }}>{actividad.id_actividad}</td>
                <td style={{ maxWidth: '8%' }}>{actividad.fecha_Actividad}</td>
                <td style={{ maxWidth: '30%' }}>{actividad.nombreActividad}</td>
                <td>{actionBodyAditional(actividad)}</td>
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
          <h3 className="mb-0">Anexo 5</h3>
        </div>
        <div className="col text-right">
          <Button color="primary" onClick={toggleCreateModal}>
            Agregar Anexo 5 <FontAwesomeIcon icon={faPlus} />
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
        <Row>
          <Col className="mb-5 mb-xl-0" xl="12">
            <Card className="shadow">
              <DataTable
                value={reports}
                paginator
                rows={5}
                rowsPerPageOptions={[5, 10, 20]}
                className="p-datatable-striped"
                globalFilter={globalFilter}
                header={header}
                rowExpansionTemplate={renderExtraInfo}
                expandedRows={expandedRows}
                onRowToggle={(e) => setExpandedRows(e.data)}
                dataKey="id_Informe"
              >
                <Column expander style={{ width: '3em' }} />
                <Column field="id_Informe" header="ID" sortable filter filterPlaceholder="Buscar por ID" style={{ maxWidth: '10%' }} />
                <Column field="tipo_informe" header="Tipo" sortable filter filterPlaceholder="Buscar por tipo" style={{ maxWidth: '10%' }} />
                <Column field="cedula" header="Cédula" sortable filter filterPlaceholder="Buscar por cédula" style={{ maxWidth: '15%' }} />
                <Column field="nombre_completo_estudiante" header="Nombre Completo" sortable filter filterPlaceholder="Buscar por nombre" style={{ maxWidth: '10%' }} />
                <Column field="tema_tesis" header="Tema de Tesis" sortable filter filterPlaceholder="Buscar por tema" style={{ maxWidth: '10%' }} />
                <Column field="porcentaje" header="Porcentaje" sortable filter filterPlaceholder="Buscar por porcentaje" style={{ maxWidth: '10%' }} />
                <Column body={actionBodyTemplate} header="Acciones" style={{ maxWidth: '15%' }}/>
              </DataTable>
            </Card>
          </Col>
        </Row>
      </Container>

      <ICreateModal 
        isOpen={createModalOpen} 
        toggle={toggleCreateModal} 
        onSave={handleCreateReport} 
        tutorId={auth.userId} 
      />

      <IDeleteModal 
        isOpen={deleteModalOpen} 
        toggle={toggleDeleteModal} 
        onDelete={handleDeleteReport} 
        report={selectedReport} 
      />

      <IEditModal 
        isOpen={editModalOpen} 
        toggle={toggleEditModal} 
        onSave={handleEditReport} 
        report={selectedReport} 
      />

      <ACreateModal 
        isOpen={createActivityModalOpen} 
        toggle={toggleCreateActivityModal} 
        onSave={handleCreateActivity} 
        reportId={selectedReportIdForActivity} 
      />

      <AEditModal 
        isOpen={editActivityModalOpen} 
        toggle={toggleEditActivityModal} 
        onSave={handleEditActivity} 
        activity={selectedActivity} 
      />

      <ADeleteModal 
        isOpen={deleteActivityModalOpen} 
        toggle={toggleDeleteActivityModal} 
        onDelete={handleDeleteActivity} 
        activity={selectedActivity} 
      />
    </>
  );
};

export default Tables;
