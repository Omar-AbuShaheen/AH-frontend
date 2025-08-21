import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Browse Internships', href: '#internships' },
    { name: 'About Us', href: '#about' },
    { name: 'Contact', href: '#contact' },
    { name: 'Privacy Policy', href: '#privacy' },
    { name: 'Terms of Service', href: '#terms' },
    { name: 'FAQ', href: '#faq' }
  ];

  const studentResources = [
    { name: 'Resume Builder', href: '#resume' },
    { name: 'Interview Tips', href: '#interview' },
    { name: 'Career Guide', href: '#career' },
    { name: 'Success Stories', href: '#stories' }
  ];

  const companyResources = [
    { name: 'Post Internship', href: '#post' },
    { name: 'Company Dashboard', href: '#dashboard' },
    { name: 'Partner Program', href: '#partner' },
    { name: 'Recruitment Guide', href: '#recruitment' }
  ];

  const socialLinks = [
    { name: 'LinkedIn', icon: '💼', href: '#' },
    { name: 'Twitter', icon: '🐦', href: '#' },
    { name: 'Facebook', icon: '📘', href: '#' },
    { name: 'Instagram', icon: '📷', href: '#' }
  ];

  return (
    <footer className="footer-section">
      {/* Main Footer Content */}
      <div className="footer-main py-5">
        <Container>
          <Row>
            {/* Company Info */}
            <Col lg={4} md={6} className="mb-4">
              <div className="footer-brand mb-4">
                <h4 className="text-white mb-3">
                  🐣 CareerNest
                </h4>
                <p className="text-light mb-4">
                  Where Opportunities Hatch. Connecting talented students with amazing internship opportunities through our university-driven platform.
                </p>
                <div className="social-links">
                  {socialLinks.map((social, index) => (
                    <a 
                      key={index}
                      href={social.href}
                      className="social-link me-3"
                      title={social.name}
                    >
                      <span className="social-icon">{social.icon}</span>
                    </a>
                  ))}
                </div>
              </div>
            </Col>

            {/* Quick Links */}
            <Col lg={2} md={6} className="mb-4">
              <h6 className="text-white mb-3 fw-bold">Quick Links</h6>
              <ul className="footer-links list-unstyled">
                {quickLinks.map((link, index) => (
                  <li key={index} className="mb-2">
                    <a href={link.href} className="footer-link">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </Col>

            {/* Student Resources */}
            <Col lg={2} md={6} className="mb-4">
              <h6 className="text-white mb-3 fw-bold">For Students</h6>
              <ul className="footer-links list-unstyled">
                {studentResources.map((resource, index) => (
                  <li key={index} className="mb-2">
                    <a href={resource.href} className="footer-link">
                      {resource.name}
                    </a>
                  </li>
                ))}
              </ul>
            </Col>

            {/* Company Resources */}
            <Col lg={2} md={6} className="mb-4">
              <h6 className="text-white mb-3 fw-bold">For Companies</h6>
              <ul className="footer-links list-unstyled">
                {companyResources.map((resource, index) => (
                  <li key={index} className="mb-2">
                    <a href={resource.href} className="footer-link">
                      {resource.name}
                    </a>
                  </li>
                ))}
              </ul>
            </Col>

            {/* Newsletter */}
            <Col lg={2} md={6} className="mb-4">
              <h6 className="text-white mb-3 fw-bold">Stay Updated</h6>
              <p className="text-light small mb-3">
                Get the latest internship opportunities and career tips.
              </p>
              <div className="newsletter-form">
                <input 
                  type="email" 
                  className="form-control form-control-sm mb-2" 
                  placeholder="Enter your email"
                />
                <Button variant="outline-light" size="sm" className="w-100">
                  Subscribe
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom py-3">
        <Container>
          <Row className="align-items-center">
            <Col md={6} className="text-center text-md-start">
              <p className="text-light mb-0 small">
                © {currentYear} CareerNest. All rights reserved.
              </p>
            </Col>
            <Col md={6} className="text-center text-md-end">
              <div className="footer-stats">
                <span className="text-light small me-3">
                  <i className="fas fa-chart-bar me-1"></i>500+ Students Placed
                </span>
                <span className="text-light small me-3">
                  <i className="fas fa-building me-1"></i>50+ Partner Companies
                </span>
                <span className="text-light small">
                  <i className="fas fa-star me-1"></i>95% Success Rate
                </span>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Back to Top Button */}
      <button 
        className="back-to-top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        title="Back to top"
      >
        ↑
      </button>
    </footer>
  );
};

export default Footer; 