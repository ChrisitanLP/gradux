import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col,
} from "reactstrap";
import UserHeader from "components/Headers/UserHeader.js";
import { updateUser, getUserById } from "../../api/users";

const Profile = () => {
  const { auth } = useAuth();
  const [user, setUser] = useState({
    nombre: "",
    apellido: "",
    email: "",
    rol: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUserById(auth.userId);
        setUser(userData);
        setFormData({
          nombre: userData.nombre,
          apellido: userData.apellido,
          email: userData.email,
        });
      } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
      }
    };

    fetchUserData();
  }, [auth.userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
    });
  };

  const handleSave = async () => {
    try {
      const response = await updateUser(auth.userId, formData);
      if (response.success) {
        setUser((prevUser) => ({
          ...prevUser,
          ...formData,
        }));
        setIsEditing(false);
      } else {
        console.error("Error al actualizar datos del usuario:", response.message);
      }
    } catch (error) {
      console.error("Error al actualizar datos del usuario:", error);
    }
  };

  return (
    <>
      <UserHeader />
      <Container className="mt--7" fluid>
        <Row>
          <Col className="order-xl-2 mb-5 mb-xl-0" xl="4">
            <Card className="card-profile shadow">
              <Row className="justify-content-center">
                <Col className="order-lg-2" lg="3">
                  <div className="card-profile-image">
                    <a href="#pablo" onClick={(e) => e.preventDefault()}>
                      <img
                        alt="..."
                        className="rounded-circle"
                        src={require("../../assets/img/theme/team-4-800x800.jpg")}
                      />
                    </a>
                  </div>
                </Col>
              </Row>
              <CardBody className="pt-0 pt-md-4">
                <Row>
                  <div className="col">
                    <div className="card-profile-stats d-flex justify-content-center mt-md-5">
                      <div>
                        <span className="heading"></span>
                      </div>
                    </div>
                  </div>
                </Row>
                <div className="text-center">
                  <h3>
                    {user.nombre} {user.apellido}
                    <span className="font-weight-light">, {user.id}</span>
                  </h3>
                  <div className="h5 font-weight-300">
                    <i className="ni location_pin mr-2" />
                    {user.email}
                  </div>
                  <div className="h5 mt-4">
                    <i className="ni business_briefcase-24 mr-2" />
                    {user.rol}
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col className="order-xl-1" xl="8">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">Mi Cuenta</h3>
                  </Col>
                  <Col className="text-right" xs="4">
                    {!isEditing ? (
                      <Button
                        color="primary"
                        onClick={handleEdit}
                        size="sm"
                      >
                        Configuración
                      </Button>
                    ) : (
                      <>
                        <Button
                          color="danger"
                          onClick={handleCancel}
                          size="sm"
                        >
                          Cancelar
                        </Button>
                        <Button
                          color="success"
                          onClick={handleSave}
                          size="sm"
                        >
                          Guardar
                        </Button>
                      </>
                    )}
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Form>
                  <h6 className="heading-small text-muted mb-4">
                    Información Personal
                  </h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-username"
                          >
                            Nombre
                          </label>
                          <Input
                            className="form-control-alternative"
                            name="nombre"
                            value={formData.nombre}
                            id="input-username"
                            placeholder="Nombre"
                            type="text"
                            onChange={handleChange}
                            readOnly={!isEditing}
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-email"
                          >
                            Apellido
                          </label>
                          <Input
                            className="form-control-alternative"
                            name="apellido"
                            value={formData.apellido}
                            id="input-email"
                            placeholder="Apellido"
                            type="text"
                            onChange={handleChange}
                            readOnly={!isEditing}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="12">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-last-name"
                          >
                            Correo Electrónico
                          </label>
                          <Input
                            className="form-control-alternative"
                            name="email"
                            value={formData.email}
                            id="input-last-name"
                            placeholder="Correo Electrónico"
                            type="email"
                            onChange={handleChange}
                            readOnly={!isEditing}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Profile;
