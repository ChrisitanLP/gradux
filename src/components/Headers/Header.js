import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";

const Header = () => {
  const [estudiantesCount, setEstudiantesCount] = useState(0);
  const [docentesCount, setDocentesCount] = useState(0);
  const [administradoresCount, setAdministradoresCount] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const estudiantesResponse = await axios.get('http://localhost:5000/api/estudiantes-count');
        setEstudiantesCount(estudiantesResponse.data.count);

        const docentesResponse = await axios.get('http://localhost:5000/api/docentescount');
        setDocentesCount(docentesResponse.data.count);

        const administradoresResponse = await axios.get('http://localhost:5000/api/administradorescount');
        setAdministradoresCount(administradoresResponse.data.count);
      } catch (error) {
        console.error('Error al obtener las cantidades:', error);
      }
    };

    fetchCounts();
  }, []);

  return (
    <>
      <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
        <Container fluid>
          <div className="header-body">
            <Row>
              <Col lg="6" xl="4">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                          Estudiantes
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">{estudiantesCount}</span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                          <i className="fas fa-user-graduate" />
                        </div>
                      </Col>
                    </Row>
                    <p className="mt-3 mb-0 text-muted text-sm">
                      <span className="text-nowrap">Total</span>
                    </p>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="6" xl="4">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                          Docentes
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">{docentesCount}</span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-success text-white rounded-circle shadow">
                          <i className="fas fa-chalkboard-teacher" />
                        </div>
                      </Col>
                    </Row>
                    <p className="mt-3 mb-0 text-muted text-sm">
                      <span className="text-nowrap">Total</span>
                    </p>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="6" xl="4">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                          Administradores
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">{administradoresCount}</span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
                          <i className="fas fa-user-shield" />
                        </div>
                      </Col>
                    </Row>
                    <p className="mt-3 mb-0 text-muted text-sm">
                      <span className="text-nowrap">Total</span>
                    </p>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    </>
  );
};

export default Header;
