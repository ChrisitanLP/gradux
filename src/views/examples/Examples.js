import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Card, CardHeader, CardBody, Container, Row, Col, } from 'reactstrap';
import Header from 'components/Headers/Header';
import Chart from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import {
    chartOptions,
    parseOptions,
    chartExample1,
    chartExample2,
  } from "variables/charts.js";
  

const Tables = () => {
    const cars = [
        { nombre: 'Christian', apellido: 'López', tema: 'Beneficios del uso de REACT', carrera: 'Software', tutor: 'Christian Lopez' },
        { nombre: 'Micaela', apellido: 'Ramon', tema: 'Beneficios del uso de REACT', carrera: 'Tecnologías de la Información', tutor: 'Christian Lopez' },
        { nombre: 'Mateo', apellido: 'Ortiz', tema: 'Beneficios del uso de REACT', carrera: 'Software', tutor: 'Christian Lopez' },
        { nombre: 'Axel', apellido: 'Vargas', tema: 'Beneficios del uso de REACT', carrera: 'Robotica', tutor: 'Christian Lopez' },
        { nombre: 'Elena', apellido: 'Intriago', tema: 'Beneficios del uso de REACT', carrera: 'Software', tutor: 'Christian Lopez' },
        { nombre: 'Stefania', apellido: 'Mora', tema: 'Beneficios del uso de REACT', carrera: 'Tecnologías de la Información', tutor: 'Christian Lopez' },
        { nombre: 'Ariel', apellido: 'Navas', tema: 'Beneficios del uso de REACT', carrera: 'Ingeniería Industrial', tutor: 'Christian Lopez' }
    ];

    const header = (
        <div className="table-header">
            <h3 className="mb-0">Registro Estudiantes</h3>
            
        </div>
    );

    return (
        <>
            <Header />
            <Container className="mt--7" fluid>
                <Row>
                    <div className="col">
                        <Card className="shadow">
                            <DataTable value={cars} header={header} paginator rows={5} rowsPerPageOptions={[5, 10, 20]} className="p-datatable-striped">
                                <Column field="nombre" header="Nombre" sortable filter filterPlaceholder="Buscar por nombre" />
                                <Column field="apellido" header="Apellido" sortable filter filterPlaceholder="Buscar por apellido" />
                                <Column field="tema" header="Tema" sortable filter filterPlaceholder="Buscar por tema" />
                                <Column field="carrera" header="Carrera" sortable filter filterPlaceholder="Buscar por carrera" />
                                <Column field="tutor" header="Tutor" sortable filter filterPlaceholder="Buscar por tutor" />
                            </DataTable>
                        </Card>
                    </div>
                </Row>
            </Container>
        </>
    );
};

export default Tables;

  