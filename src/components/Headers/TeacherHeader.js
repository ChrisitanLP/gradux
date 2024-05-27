import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";
import { useAuth } from "context/AuthContext";

const TeacherHeader = () => {
  const [graduadosCount, setGraduadosCount] = useState(0);
  const [enProgresoCount, setEnProgresoCount] = useState(0);
  const [retiradosCount, setRetiradosCount] = useState(0);
  const { auth } = useAuth();

  useEffect(() => {
    const fetchCounts = async () => {
      if (auth.userId) {
        try {
          const graduadosResponse = await axios.get(`http://localhost:5000/api/graduados/${auth.userId}`);
          setGraduadosCount(graduadosResponse.data.count);

          const enProgresoResponse = await axios.get(`http://localhost:5000/api/enprogreso/${auth.userId}`);
          setEnProgresoCount(enProgresoResponse.data.count);

          const retiradosResponse = await axios.get(`http://localhost:5000/api/retirados/${auth.userId}`);
          setRetiradosCount(retiradosResponse.data.count);
        } catch (error) {
          console.error('Error al obtener las cantidades:', error);
        }
      }
    };

    fetchCounts();
  }, [auth.userId]);

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
                          Graduados
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">{graduadosCount}</span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                          <i className="fas fa-user-graduate" />
                        </div>
                      </Col>
                    </Row>
                    <p className="mt-3 mb-0 text-muted text-sm">
                      <span className="text-nowrap">Total Estudiantes</span>
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
                          En Proceso
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">{enProgresoCount}</span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-success text-white rounded-circle shadow">
                        <i className="fas fa-spinner" />
                        </div>
                      </Col>
                    </Row>
                    <p className="mt-3 mb-0 text-muted text-sm">
                      <span className="text-nowrap">Total Estudiantes</span>
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
                          Retirados
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">{retiradosCount}</span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
                        <i className="fas fa-user-times" />
                        </div>
                      </Col>
                    </Row>
                    <p className="mt-3 mb-0 text-muted text-sm">
                      <span className="text-nowrap">Total Estudiantes</span>
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

export default TeacherHeader;
