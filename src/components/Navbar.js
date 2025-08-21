import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Button, Container, Badge } from 'react-bootstrap';

const NavigationBar = ({ 
  user, 
  currentPage, 
  onNavigate, 
  onShowLogin, 
  onShowRegister, 
  onLogout 
}) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Navbar 
      bg="light" 
      variant="light" 
      expand="lg" 
      fixed="top"
      className="navbar"
    >
      <Container>
        <Navbar.Brand 
          onClick={() => onNavigate('home')}
          className="navbar-brand"
          style={{ cursor: 'pointer' }}
        >
          <span style={{ fontSize: '1.8rem', marginRight: '0.5rem' }}>🐣</span>
          <span>
            <span style={{ fontWeight: 800, fontSize: '1.5rem' }}>CareerNest</span>
            <br />
            <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>Where Opportunities Hatch</span>
          </span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link 
              onClick={() => onNavigate('home')}
              className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
            >
              <i className="fas fa-home me-1"></i>
              Home
            </Nav.Link>
            
            <Nav.Link 
              onClick={() => onNavigate('about')}
              className={`nav-link ${currentPage === 'about' ? 'active' : ''}`}
            >
              <i className="fas fa-info-circle me-1"></i>
              About Us
            </Nav.Link>
            
            <Nav.Link 
              onClick={() => onNavigate('internships')}
              className={`nav-link ${currentPage === 'internships' ? 'active' : ''}`}
            >
              <i className="fas fa-briefcase me-1"></i>
              Internships
              <Badge bg="warning" className="ms-1" style={{ color: '#ffffff' }}>New</Badge>
            </Nav.Link>
            
            {user && user.role === 'student' && (
              <Nav.Link 
                onClick={() => onNavigate('dashboard')}
                className={`nav-link ${currentPage === 'dashboard' ? 'active' : ''}`}
              >
                <i className="fas fa-chart-bar me-1"></i>
                Dashboard
              </Nav.Link>
            )}
            
            {user && user.role === 'admin' && (
              <Nav.Link 
                onClick={() => onNavigate('admin')}
                className={`nav-link ${currentPage === 'admin' ? 'active' : ''}`}
              >
                <i className="fas fa-cog me-1"></i>
                Admin Panel
              </Nav.Link>
            )}
            
            {user && user.role === 'company' && (
              <Nav.Link 
                onClick={() => onNavigate('company')}
                className={`nav-link ${currentPage === 'company' ? 'active' : ''}`}
              >
                <i className="fas fa-building me-1"></i>
                Company Dashboard
              </Nav.Link>
            )}
          </Nav>

          <Nav>
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>Welcome,</div>
                  <div style={{ color: '#1e3a8a', fontWeight: 600 }}>{user.name}!</div>
                </div>
                <Button 
                  variant="outline-primary"
                  onClick={onLogout}
                  size="sm"
                >
                  <i className="fas fa-sign-out-alt me-1"></i>
                  Logout
                </Button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '1rem' }}>
                <Button 
                  variant="outline-primary"
                  size="sm"
                  onClick={onShowLogin}
                >
                  <i className="fas fa-sign-in-alt me-1"></i>
                  Login
                </Button>
                <Button 
                  variant="primary"
                  size="sm"
                  onClick={onShowRegister}
                >
                  <i className="fas fa-user-plus me-1"></i>
                  Register
                </Button>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;  