import React from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';

const AboutUs = () => {
  const teamMembers = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Director of Career Services',
      department: 'University Career Center',
      bio: 'Leading career development initiatives and student success programs.'
    },
    {
      name: 'Michael Chen',
      role: 'Senior Career Advisor',
      department: 'Student Affairs',
      bio: 'Specializing in technology and engineering career pathways.'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Internship Coordinator',
      department: 'Career Development',
      bio: 'Managing corporate partnerships and internship opportunities.'
    }
  ];

  const stats = [
    { number: '500+', label: 'Students Placed' },
    { number: '50+', label: 'Partner Companies' },
    { number: '95%', label: 'Success Rate' },
    { number: '3+', label: 'Years Experience' }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="about-hero" style={{
        background: 'linear-gradient(135deg, #33A1E0 0%, #2a8bd1 100%)',
        color: '#ffffff',
        padding: '120px 0 80px 0',
        marginTop: '0'
      }}>
        <Container>
          <div className="text-center">
            <h1 className="display-4 mb-3" style={{
              fontSize: '3.5rem',
              fontWeight: '800',
              lineHeight: '1.3',
              marginBottom: '2rem',
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              color: '#ffffff',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
              marginTop: '0',
              paddingTop: '0'
            }}>About CareerNest</h1>
            <p className="lead mb-3" style={{
              fontSize: '1.5rem',
              fontWeight: '400',
              color: '#ffffff',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
            }}>
              Where Opportunities Hatch
            </p>
            <p className="fs-5" style={{
              fontSize: '1.2rem',
              color: 'rgba(255, 255, 255, 0.9)',
              maxWidth: '800px',
              margin: '0 auto'
            }}>
              Empowering students to discover, apply, and succeed in their dream internships
            </p>
          </div>
        </Container>
      </section>

      <Container className="py-5">

      {/* Mission & Vision */}
      <Row className="mb-5">
        <Col md={6} className="mb-4">
          <Card className="h-100" style={{
            border: 'none',
            borderRadius: '16px',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
            overflow: 'hidden'
          }}>
            <Card.Header style={{
              background: 'linear-gradient(135deg, #33A1E0 0%, #2a8bd1 100%)',
              color: '#ffffff',
              border: 'none',
              padding: '1.5rem'
            }}>
              <h4 className="mb-0" style={{ fontWeight: '700' }}>
                <i className="fas fa-bullseye me-2"></i>Our Mission
              </h4>
            </Card.Header>
            <Card.Body style={{ padding: '2rem' }}>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.7', color: '#495057' }}>
                To bridge the gap between talented students and innovative companies by providing 
                a seamless platform for internship discovery and application management. We believe 
                every student deserves access to meaningful career opportunities that align with 
                their academic and professional goals.
              </p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="mb-4">
          <Card className="h-100" style={{
            border: 'none',
            borderRadius: '16px',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
            overflow: 'hidden'
          }}>
            <Card.Header style={{
              background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
              color: '#ffffff',
              border: 'none',
              padding: '1.5rem'
            }}>
              <h4 className="mb-0" style={{ fontWeight: '700' }}>
                <i className="fas fa-eye me-2"></i>Our Vision
              </h4>
            </Card.Header>
            <Card.Body style={{ padding: '2rem' }}>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.7', color: '#495057' }}>
                To become the leading university-driven internship platform, fostering strong 
                partnerships between academia and industry while preparing the next generation 
                of professionals for successful careers.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Statistics */}
      <Row className="mb-5">
        <Col>
          <Card className="text-center" style={{
            border: 'none',
            borderRadius: '16px',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
            background: '#ffffff'
          }}>
            <Card.Body style={{ padding: '3rem 2rem' }}>
              <h3 className="mb-5" style={{
                color: '#2c3e50',
                fontWeight: '700',
                fontSize: '2.2rem'
              }}>
                <i className="fas fa-chart-line me-2" style={{ color: '#33A1E0' }}></i>Our Impact
              </h3>
              <Row>
                {stats.map((stat, index) => (
                  <Col key={index} md={3} className="mb-4">
                    <div className="stat-item" style={{
                      padding: '1.5rem',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #f8fafc 0%, #e9ecef 100%)',
                      border: '1px solid #e9ecef'
                    }}>
                      <h2 style={{
                        color: '#33A1E0',
                        fontWeight: '800',
                        fontSize: '3rem',
                        marginBottom: '0.5rem'
                      }}>{stat.number}</h2>
                      <p style={{
                        color: '#495057',
                        fontWeight: '600',
                        fontSize: '1rem',
                        margin: '0',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>{stat.label}</p>
                    </div>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* What We Do */}
      <Row className="mb-5">
        <Col>
          <Card style={{
            border: 'none',
            borderRadius: '16px',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
            background: '#ffffff'
          }}>
            <Card.Header style={{
              background: 'linear-gradient(135deg, #33A1E0 0%, #2a8bd1 100%)',
              color: '#ffffff',
              border: 'none',
              padding: '1.5rem'
            }}>
              <h4 className="mb-0" style={{ fontWeight: '700' }}>
                <i className="fas fa-cogs me-2"></i>What We Do
              </h4>
            </Card.Header>
            <Card.Body style={{ padding: '3rem 2rem' }}>
              <Row>
                <Col md={4} className="mb-4">
                  <div className="text-center">
                    <div style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #33A1E0, #2a8bd1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1.5rem auto',
                      boxShadow: '0 4px 15px rgba(51, 161, 224, 0.3)'
                    }}>
                      <i className="fas fa-bullseye" style={{ fontSize: '2rem', color: '#ffffff' }}></i>
                    </div>
                    <h5 style={{
                      color: '#2c3e50',
                      fontWeight: '700',
                      marginBottom: '1rem',
                      fontSize: '1.3rem'
                    }}>Connect Students</h5>
                    <p style={{
                      color: '#6c757d',
                      lineHeight: '1.6',
                      fontSize: '1rem'
                    }}>
                      We connect talented students with internship opportunities that match their skills and career goals.
                    </p>
                  </div>
                </Col>
                <Col md={4} className="mb-4">
                  <div className="text-center">
                    <div style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #28a745, #20c997)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1.5rem auto',
                      boxShadow: '0 4px 15px rgba(40, 167, 69, 0.3)'
                    }}>
                      <i className="fas fa-building" style={{ fontSize: '2rem', color: '#ffffff' }}></i>
                    </div>
                    <h5 style={{
                      color: '#2c3e50',
                      fontWeight: '700',
                      marginBottom: '1rem',
                      fontSize: '1.3rem'
                    }}>Partner with Companies</h5>
                    <p style={{
                      color: '#6c757d',
                      lineHeight: '1.6',
                      fontSize: '1rem'
                    }}>
                      We build strong partnerships with companies to provide quality internship opportunities.
                    </p>
                  </div>
                </Col>
                <Col md={4} className="mb-4">
                  <div className="text-center">
                    <div style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #ffc107, #fd7e14)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1.5rem auto',
                      boxShadow: '0 4px 15px rgba(255, 193, 7, 0.3)'
                    }}>
                      <i className="fas fa-chart-line" style={{ fontSize: '2rem', color: '#ffffff' }}></i>
                    </div>
                    <h5 style={{
                      color: '#2c3e50',
                      fontWeight: '700',
                      marginBottom: '1rem',
                      fontSize: '1.3rem'
                    }}>Track Success</h5>
                    <p style={{
                      color: '#6c757d',
                      lineHeight: '1.6',
                      fontSize: '1rem'
                    }}>
                      We provide comprehensive tracking and analytics to ensure successful placements.
                    </p>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Team Section */}
      <Row className="mb-5">
        <Col>
          <Card style={{
            border: 'none',
            borderRadius: '16px',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
            background: '#ffffff'
          }}>
            <Card.Header style={{
              background: 'linear-gradient(135deg, #33A1E0 0%, #2a8bd1 100%)',
              color: '#ffffff',
              border: 'none',
              padding: '1.5rem'
            }}>
              <h4 className="mb-0" style={{ fontWeight: '700' }}>
                <i className="fas fa-users me-2"></i>Our Team
              </h4>
            </Card.Header>
            <Card.Body style={{ padding: '3rem 2rem' }}>
              <Row>
                {teamMembers.map((member, index) => (
                  <Col key={index} md={4} className="mb-4">
                    <Card className="text-center h-100" style={{
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                    }}>
                      <Card.Body style={{ padding: '2rem 1.5rem' }}>
                        <div style={{
                          width: '80px',
                          height: '80px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #f8fafc 0%, #e9ecef 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 1.5rem auto',
                          border: '3px solid #33A1E0'
                        }}>
                          <i className="fas fa-user" style={{ fontSize: '2rem', color: '#33A1E0' }}></i>
                        </div>
                        <h5 style={{
                          color: '#2c3e50',
                          fontWeight: '700',
                          marginBottom: '0.5rem',
                          fontSize: '1.2rem'
                        }}>{member.name}</h5>
                        <Badge style={{
                          background: '#33A1E0',
                          padding: '0.5rem 1rem',
                          borderRadius: '20px',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          marginBottom: '0.5rem'
                        }}>{member.role}</Badge>
                        <p style={{
                          color: '#6c757d',
                          fontSize: '0.9rem',
                          marginBottom: '1rem',
                          fontWeight: '500'
                        }}>{member.department}</p>
                        <p style={{
                          color: '#495057',
                          fontSize: '0.9rem',
                          lineHeight: '1.6'
                        }}>{member.bio}</p>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Values */}
      <Row className="mb-5">
        <Col>
          <Card style={{
            border: 'none',
            borderRadius: '16px',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
            background: '#ffffff'
          }}>
            <Card.Header style={{
              background: 'linear-gradient(135deg, #33A1E0 0%, #2a8bd1 100%)',
              color: '#ffffff',
              border: 'none',
              padding: '1.5rem'
            }}>
              <h4 className="mb-0" style={{ fontWeight: '700' }}>
                <i className="fas fa-heart me-2"></i>Our Values
              </h4>
            </Card.Header>
            <Card.Body style={{ padding: '3rem 2rem' }}>
              <Row>
                <Col md={6} className="mb-4">
                  <div style={{
                    padding: '1.5rem',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #f8fafc 0%, #e9ecef 100%)',
                    border: '1px solid #e9ecef'
                  }}>
                    <h6 style={{
                      color: '#33A1E0',
                      fontWeight: '700',
                      fontSize: '1.1rem',
                      marginBottom: '1rem'
                    }}>
                      <i className="fas fa-graduation-cap me-2"></i>Excellence in Education
                    </h6>
                    <p style={{
                      color: '#495057',
                      lineHeight: '1.6',
                      margin: '0'
                    }}>
                      We are committed to supporting academic excellence and professional development.
                    </p>
                  </div>
                </Col>
                <Col md={6} className="mb-4">
                  <div style={{
                    padding: '1.5rem',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #f8fafc 0%, #e9ecef 100%)',
                    border: '1px solid #e9ecef'
                  }}>
                    <h6 style={{
                      color: '#33A1E0',
                      fontWeight: '700',
                      fontSize: '1.1rem',
                      marginBottom: '1rem'
                    }}>
                      <i className="fas fa-handshake me-2"></i>Strong Partnerships
                    </h6>
                    <p style={{
                      color: '#495057',
                      lineHeight: '1.6',
                      margin: '0'
                    }}>
                      We believe in building lasting relationships with students, universities, and companies.
                    </p>
                  </div>
                </Col>
                <Col md={6} className="mb-4">
                  <div style={{
                    padding: '1.5rem',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #f8fafc 0%, #e9ecef 100%)',
                    border: '1px solid #e9ecef'
                  }}>
                    <h6 style={{
                      color: '#33A1E0',
                      fontWeight: '700',
                      fontSize: '1.1rem',
                      marginBottom: '1rem'
                    }}>
                      <i className="fas fa-lightbulb me-2"></i>Innovation
                    </h6>
                    <p style={{
                      color: '#495057',
                      lineHeight: '1.6',
                      margin: '0'
                    }}>
                      We continuously innovate to provide the best possible experience for all users.
                    </p>
                  </div>
                </Col>
                <Col md={6} className="mb-4">
                  <div style={{
                    padding: '1.5rem',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #f8fafc 0%, #e9ecef 100%)',
                    border: '1px solid #e9ecef'
                  }}>
                    <h6 style={{
                      color: '#33A1E0',
                      fontWeight: '700',
                      fontSize: '1.1rem',
                      marginBottom: '1rem'
                    }}>
                      <i className="fas fa-star me-2"></i>Student Success
                    </h6>
                    <p style={{
                      color: '#495057',
                      lineHeight: '1.6',
                      margin: '0'
                    }}>
                      Every decision we make is focused on student success and career growth.
                    </p>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Contact Information */}
      <Row>
        <Col>
          <Card style={{
            border: 'none',
            borderRadius: '16px',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
            background: 'linear-gradient(135deg, #33A1E0 0%, #2a8bd1 100%)',
            color: '#ffffff'
          }}>
            <Card.Body className="text-center" style={{ padding: '3rem 2rem' }}>
              <h4 style={{
                fontWeight: '700',
                marginBottom: '1rem',
                fontSize: '2rem'
              }}>
                <i className="fas fa-envelope me-2"></i>Get in Touch
              </h4>
              <p style={{
                fontSize: '1.1rem',
                marginBottom: '2rem',
                opacity: '0.9'
              }}>
                Have questions about CareerNest? We'd love to hear from you!
              </p>
              <div className="row justify-content-center">
                <div className="col-md-4 mb-3">
                  <div style={{
                    padding: '1.5rem',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}>
                    <i className="fas fa-envelope mb-2" style={{ fontSize: '1.5rem' }}></i><br />
                    <strong>Email:</strong><br />
                    <a href="mailto:careers@careernest.edu" style={{ color: '#ffffff', textDecoration: 'none' }}>careers@careernest.edu</a>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div style={{
                    padding: '1.5rem',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}>
                    <i className="fas fa-phone mb-2" style={{ fontSize: '1.5rem' }}></i><br />
                    <strong>Phone:</strong><br />
                    <a href="tel:+1-555-123-4567" style={{ color: '#ffffff', textDecoration: 'none' }}>+1 (555) 123-4567</a>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div style={{
                    padding: '1.5rem',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}>
                    <i className="fas fa-map-marker-alt mb-2" style={{ fontSize: '1.5rem' }}></i><br />
                    <strong>Location:</strong><br />
                    University Career Center<br />
                    Main Campus, Building A
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      </Container>
    </div>
  );
};

export default AboutUs; 