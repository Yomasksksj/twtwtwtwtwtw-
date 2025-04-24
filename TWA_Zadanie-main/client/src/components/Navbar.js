import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaBed, FaUserGraduate } from 'react-icons/fa';

function AppNavbar() {
  return (
    <Navbar bg="white" expand="lg" className="shadow-sm mb-4 border-bottom py-3">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-4 text-primary">
          Internát
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto gap-3">
            <Nav.Link as={Link} to="/rooms" className="d-flex align-items-center gap-2">
              <FaBed /> Izby
            </Nav.Link>
            <Nav.Link as={Link} to="/students" className="d-flex align-items-center gap-2">
              <FaUserGraduate /> Študenti
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
