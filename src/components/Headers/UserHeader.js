import React, { useContext, useEffect, useState } from "react";
import { Button, Container, Row, Col } from "reactstrap";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const UserHeader = () => {
  const { auth } = useAuth();
  const [user, setUser] = useState({ nombre: '', apellido: '' });

  useEffect(() => {
    const fetchUser = async () => {
      if (auth.userId) {
        try {
          const response = await axios.get(`http://localhost:5000/api/usuarios/${auth.userId}`);
          if (response.data.success) {
            setUser(response.data.user);
          } else {
            console.error("Error al obtener los datos del usuario:", response.data.message);
          }
        } catch (error) {
          console.error("Error al obtener los datos del usuario:", error);
        }
      }
    };

    fetchUser();
  }, [auth.userId]);

  return (
    <>
      <div
        className="header pb-8 pt-5 pt-lg-8 d-flex align-items-center"
        style={{
          minHeight: "600px",
          backgroundImage:
            "url(" + require("../../assets/img/theme/profile-cover.jpg") + ")",
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      >
        {/* Mask */}
        <span className="mask bg-gradient-default opacity-8" />
        {/* Header container */}
        <Container className="d-flex align-items-center" fluid>
          <Row>
            <Col lg="7" md="10">
              <h1 className="display-2 text-white">Hola, {user.nombre}</h1>
              <p className="text-white mt-0 mb-5">
                Esta es la página de perfil del administrador. Aquí puedes gestionar a los estudiantes y docentes del sistema.
              </p>
              <Button
                color="info"
                href="#pablo"
                onClick={(e) => e.preventDefault()}
              >
                Perfil del Usuario
              </Button>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default UserHeader;
