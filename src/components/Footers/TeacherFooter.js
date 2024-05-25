import React from "react";
import { Container, Row, Col, Nav, NavItem, NavLink } from "reactstrap";

const TeacherFooter = () => {
  return (
    <footer className="footer">
      <Row className="align-items-center justify-content-xl-between">
        <Col xl="6">
          <div className="copyright text-center text-xl-left text-muted">
            © {new Date().getFullYear()}{" "}
            <a
              className="font-weight-bold ml-1"
              href="https://chrisitanlp.github.io/"
              rel="noopener noreferrer"
              target="_blank"
            >
              CodeCraft Studios
            </a>
          </div>
        </Col>
      </Row>
    </footer>
  );
};

export default TeacherFooter;
