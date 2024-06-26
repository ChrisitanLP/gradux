import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Navbar,
  Nav,
  Container,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Media,
} from "reactstrap";
import { useAuth } from "context/AuthContext";

const TeacherNavbar = (props) => {
  const [user, setUser] = useState({ nombre: '', apellido: '' });
  const { auth } = useAuth();

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

  const handleLogout = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/logout", {}, { withCredentials: true });
      if (response.data.success) {
        localStorage.removeItem("isLoggedIn");
        window.location.href = "/auth/login"; // Redirige a la página de inicio de sesión
      } else {
        console.error("Error al cerrar sesión:", response.data.message);
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <Navbar className="navbar-top navbar-dark" expand="md" id="navbar-main">
      <Container fluid>
        <Link
          className="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block"
          to="/"
        >
          {props.brandText}
        </Link>
        <Nav className="align-items-center d-none d-md-flex" navbar>
          <UncontrolledDropdown nav>
            <DropdownToggle className="pr-0" nav>
              <Media className="align-items-center">
                <span className="avatar avatar-sm rounded-circle">
                  <img
                    alt="..."
                    src={require("../../assets/img/theme/perfil1.png")}
                  />
                </span>
                <Media className="ml-2 d-none d-lg-block">
                  <span className="mb-0 text-sm font-weight-bold">
                    {user.nombre} {user.apellido}
                  </span>
                </Media>
              </Media>
            </DropdownToggle>
            <DropdownMenu className="dropdown-menu-arrow" right>
              <DropdownItem onClick={handleLogout}>
                <i className="ni ni-user-run" />
                <span>Cerrar Sesión</span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default TeacherNavbar;
