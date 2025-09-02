import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { name: 'About Us', href: '#about' },
    { name: 'Privacy Policy', href: '#privacy' },
    { name: 'Terms of Service', href: '#terms' },
    { name: 'Contact Support', href: '#contact' }
  ];

  const socialLinks = [
    { name: 'LinkedIn', icon: 'fab fa-linkedin-in', href: '#' },
    { name: 'Twitter', icon: 'fab fa-twitter', href: '#' },
    { name: 'Facebook', icon: 'fab fa-facebook-f', href: '#' },
    { name: 'Instagram', icon: 'fab fa-instagram', href: '#' }
  ];

  return (
    <footer 
      style={{
        background: 'linear-gradient(135deg, #2c5282 0%, #33A1E0 100%)',
        color: '#ffffff',
        marginTop: 'auto'
      }}
    >
      {/* Main Footer Content */}
      <div style={{ padding: '3rem 0 2rem 0' }}>
        <Container>
          <Row className="justify-content-between align-items-start">
            {/* Brand Section */}
            <Col lg={4} md={6} className="mb-4">
              <div className="d-flex align-items-center mb-3">
                <div 
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '12px'
                  }}
                >
                  <i className="fas fa-briefcase" style={{ fontSize: '1.2rem', color: '#ffffff' }}></i>
                </div>
                <div>
                  <h5 className="mb-0 fw-bold" style={{ color: '#ffffff' }}>CareerNest</h5>
                  <small style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Where Opportunities Match</small>
                </div>
              </div>
              <p style={{ color: 'rgba(255, 255, 255, 0.9)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                Connecting talented students with amazing internship opportunities. 
                Building bridges between education and industry for a brighter future.
              </p>
              {/* Social Links */}
              <div>
                <h6 className="mb-3 fw-bold" style={{ color: '#ffffff', fontSize: '0.9rem' }}>Follow Us</h6>
                <div className="d-flex gap-2">
                  {socialLinks.map((social, index) => (
                    <a 
                      key={index}
                      href={social.href}
                      className="d-flex align-items-center justify-content-center"
                      title={social.name}
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: '#ffffff',
                        textDecoration: 'none',
                        transition: 'all 0.3s ease',
                        border: '1px solid rgba(255, 255, 255, 0.2)'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                        e.target.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                        e.target.style.transform = 'translateY(0)';
                      }}
                    >
                      <i className={social.icon} style={{ fontSize: '0.9rem' }}></i>
                    </a>
                  ))}
                </div>
              </div>
            </Col>

            {/* Quick Links Section */}
            <Col lg={3} md={6} className="mb-4">
              <h6 className="mb-3 fw-bold" style={{ color: '#ffffff', fontSize: '0.9rem' }}>Quick Links</h6>
              <ul className="list-unstyled">
                {footerLinks.map((link, index) => (
                  <li key={index} className="mb-2">
                    <a 
                      href={link.href}
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        textDecoration: 'none',
                        fontSize: '0.85rem',
                        transition: 'color 0.3s ease'
                      }}
                      onMouseEnter={(e) => e.target.style.color = '#ffffff'}
                      onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.8)'}
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </Col>

            {/* Contact Info Section */}
            <Col lg={4} md={6} className="mb-4">
              <h6 className="mb-3 fw-bold" style={{ color: '#ffffff', fontSize: '0.9rem' }}>Contact Information</h6>
              <div className="mb-2">
                <i className="fas fa-envelope me-2" style={{ color: 'rgba(255, 255, 255, 0.7)', width: '16px' }}></i>
                <a 
                  href="mailto:hello@careernest.com" 
                  style={{ 
                    color: 'rgba(255, 255, 255, 0.8)', 
                    textDecoration: 'none', 
                    fontSize: '0.85rem' 
                  }}
                >
                  hello@careernest.com
                </a>
              </div>
              <div className="mb-2">
                <i className="fas fa-phone me-2" style={{ color: 'rgba(255, 255, 255, 0.7)', width: '16px' }}></i>
                <a 
                  href="tel:+15551234567" 
                  style={{ 
                    color: 'rgba(255, 255, 255, 0.8)', 
                    textDecoration: 'none', 
                    fontSize: '0.85rem' 
                  }}
                >
                  +1 (555) 123-4567
                </a>
              </div>
              <div className="mb-3">
                <i className="fas fa-map-marker-alt me-2" style={{ color: 'rgba(255, 255, 255, 0.7)', width: '16px' }}></i>
                <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.85rem' }}>
                  123 Innovation Drive, Tech City, TC 12345
                </span>
              </div>
              
              {/* Quick Stats */}
              <div>
                <h6 className="mb-2 fw-bold" style={{ color: '#ffffff', fontSize: '0.9rem' }}>Platform Stats</h6>
                <div className="d-flex justify-content-between" style={{ fontSize: '0.8rem' }}>
                  <div className="text-center">
                    <div style={{ color: '#ffffff', fontWeight: 'bold', fontSize: '1.1rem' }}>500+</div>
                    <div style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Students</div>
                  </div>
                  <div className="text-center">
                    <div style={{ color: '#ffffff', fontWeight: 'bold', fontSize: '1.1rem' }}>50+</div>
                    <div style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Companies</div>
                  </div>
                  <div className="text-center">
                    <div style={{ color: '#ffffff', fontWeight: 'bold', fontSize: '1.1rem' }}>95%</div>
                    <div style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Success Rate</div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Footer Bottom */}
      <div 
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '1.5rem 0',
          background: 'rgba(0, 0, 0, 0.1)'
        }}
      >
        <Container>
          <Row className="align-items-center">
            <Col md={6} className="text-center text-md-start">
              <p className="mb-0" style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.85rem' }}>
                <i className="fas fa-copyright me-1"></i>
                {currentYear} CareerNest. All rights reserved.
              </p>
            </Col>
            <Col md={6} className="text-center text-md-end">
              <p className="mb-0" style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.8rem' }}>
                Made with <i className="fas fa-heart text-danger mx-1"></i> for students and companies
              </p>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Back to Top Button */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        title="Back to top"
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #33A1E0, #2c5282)',
          color: '#ffffff',
          border: 'none',
          fontSize: '1rem',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 20px rgba(51, 161, 224, 0.3)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'translateY(-3px) scale(1.05)';
          e.target.style.boxShadow = '0 6px 25px rgba(51, 161, 224, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0) scale(1)';
          e.target.style.boxShadow = '0 4px 20px rgba(51, 161, 224, 0.3)';
        }}
      >
        <i className="fas fa-arrow-up"></i>
      </button>
    </footer>
  );
};

export default Footer;