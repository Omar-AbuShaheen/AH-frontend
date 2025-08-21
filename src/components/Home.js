import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';

const Home = ({ onShowLogin, onShowRegister }) => {
  const features = [
    {
      icon: 'fas fa-bullseye',
      title: 'Find Your Perfect Match',
      description: 'Browse hundreds of internship opportunities tailored to your skills and interests.'
    },
    {
      icon: 'fas fa-file-alt',
      title: 'Easy Application Process',
      description: 'Apply to multiple internships with just a few clicks. No more complicated forms!'
    },
    {
      icon: 'fas fa-chart-line',
      title: 'Track Your Progress',
      description: 'Monitor your application status in real-time. Know exactly where you stand.'
    },
    {
      icon: 'fas fa-trophy',
      title: 'Career Growth',
      description: 'Connect with top companies and kickstart your professional journey.'
    }
  ];

  const stats = [
    { number: '500+', label: 'Students Placed' },
    { number: '50+', label: 'Partner Companies' },
    { number: '95%', label: 'Success Rate' },
    { number: '1000+', label: 'Internships Posted' }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section 
        className="hero-section"
        style={{
          background: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${process.env.PUBLIC_URL}/bg.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '120px 0 80px 0',
          position: 'relative'
        }}
      >
        <div className="hero-content" style={{
          textAlign: 'center',
          maxWidth: '1200px',
          padding: '0 2rem',
          zIndex: '2',
          position: 'relative'
        }}>
           <div className="hero-badge mb-4">
                           <span className="badge" style={{
                backgroundColor: '#33A1E0',
                color: '#ffffff',
                fontSize: '0.9rem',
                padding: '0.75rem 1.5rem',
                borderRadius: '25px',
                fontWeight: '600',
                letterSpacing: '0.5px'
              }}>
                <i className="fas fa-graduation-cap me-2"></i>
                University-Driven Platform
              </span>
           </div>
           <h1 className="hero-title" style={{
             fontSize: '3.5rem',
             fontWeight: '800',
             lineHeight: '1.3',
             marginBottom: '2rem',
             fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
             color: '#ffffff',
             textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
             marginTop: '0',
             paddingTop: '0'
           }}>
             Boost Your Career with an<br />
             <span style={{ color: '#33A1E0' }}>International Internship</span>
           </h1>
           <p className="hero-subtitle" style={{
             fontSize: '1.3rem',
             fontWeight: '400',
             lineHeight: '1.6',
             marginBottom: '3rem',
             maxWidth: '800px',
             marginLeft: 'auto',
             marginRight: 'auto',
             opacity: '0.95',
             color: '#ffffff',
             textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
           }}>
             Award-Winning In-person and Remote International Internships in Elite Cities Worldwide
           </p>
           <div className="hero-buttons">
             <Button 
               variant="primary"
               size="lg" 
               className="me-4 mb-3"
               style={{
                 fontSize: '1.1rem',
                 fontWeight: '700',
                 padding: '1rem 2.5rem',
                 borderRadius: '8px',
                 letterSpacing: '1px',
                 textTransform: 'uppercase',
                 minWidth: '180px'
               }}
               onClick={onShowRegister}
             >
               Learn More
             </Button>
             <Button 
               variant="outline-light"
               size="lg"
               className="mb-3"
               style={{
                 fontSize: '1.1rem',
                 fontWeight: '700',
                 padding: '1rem 2.5rem',
                 borderRadius: '8px',
                 letterSpacing: '1px',
                 textTransform: 'uppercase',
                 borderWidth: '2px',
                 minWidth: '180px'
               }}
               onClick={onShowLogin}
             >
               Apply Now
             </Button>
           </div>
         </div>
      </section>

             {/* Stats Section */}
       <section className="py-5" style={{ background: '#f8fafc' }}>
         <Container>
           <Row className="text-center">
             {stats.map((stat, index) => (
               <Col key={index} md={3} sm={6} className="mb-4">
                 <div className="stats-card" style={{
                   padding: '2rem 1rem',
                   borderRadius: '12px',
                   background: '#ffffff',
                   boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                   border: '1px solid #e9ecef',
                   transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                 }}>
                   <div className="stats-number" style={{
                     fontSize: '3rem',
                     fontWeight: '800',
                     color: '#33A1E0',
                     marginBottom: '0.5rem',
                     fontFamily: "'Inter', sans-serif"
                   }}>{stat.number}</div>
                   <div className="stats-label" style={{
                     fontSize: '1rem',
                     fontWeight: '600',
                     color: '#495057',
                     textTransform: 'uppercase',
                     letterSpacing: '1px'
                   }}>{stat.label}</div>
                 </div>
               </Col>
             ))}
           </Row>
         </Container>
       </section>

             {/* Features Section */}
       <section className="py-5">
         <Container>
           <div className="text-center mb-5">
             <h2 className="section-title" style={{
               fontSize: '2.5rem',
               fontWeight: '700',
               color: '#2c3e50',
               marginBottom: '1rem',
               fontFamily: "'Inter', sans-serif"
             }}>Why Choose CareerNest?</h2>
             <p className="section-subtitle" style={{
               fontSize: '1.2rem',
               color: '#6c757d',
               maxWidth: '600px',
               margin: '0 auto',
               lineHeight: '1.6'
             }}>
               Everything you need to succeed in your internship search
             </p>
           </div>
           <Row>
             {features.map((feature, index) => (
               <Col key={index} lg={3} md={6} className="mb-4">
                 <Card className="feature-card h-100" style={{
                   border: 'none',
                   borderRadius: '16px',
                   boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
                   transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                   background: '#ffffff',
                   overflow: 'hidden'
                 }}>
                   <Card.Body className="text-center p-5">
                     <div className="feature-icon mb-4" style={{
                       width: '80px',
                       height: '80px',
                       borderRadius: '50%',
                       background: 'linear-gradient(135deg, #33A1E0, #2a8bd1)',
                       display: 'flex',
                       alignItems: 'center',
                       justifyContent: 'center',
                       margin: '0 auto',
                       boxShadow: '0 4px 15px rgba(51, 161, 224, 0.3)'
                     }}>
                       <i className={feature.icon} style={{ fontSize: '2.5rem', color: '#ffffff' }}></i>
                     </div>
                     <h5 className="card-title" style={{
                       fontSize: '1.3rem',
                       fontWeight: '700',
                       color: '#2c3e50',
                       marginBottom: '1rem',
                       fontFamily: "'Inter', sans-serif"
                     }}>{feature.title}</h5>
                     <p className="card-text" style={{
                       fontSize: '1rem',
                       color: '#6c757d',
                       lineHeight: '1.6',
                       margin: '0'
                     }}>
                       {feature.description}
                     </p>
                   </Card.Body>
                 </Card>
               </Col>
             ))}
           </Row>
         </Container>
       </section>

                           {/* CTA Section */}
        <section className="py-5" style={{ 
          background: 'linear-gradient(135deg, #33A1E0 0%, #2a8bd1 100%)',
          color: '#ffffff'
        }}>
          <Container>
            <Row className="align-items-center">
              <Col md={8} className="text-center text-md-start">
                <h3 className="section-title mb-3" style={{
                  fontSize: '2.2rem',
                  fontWeight: '700',
                  color: '#ffffff',
                  marginBottom: '1rem',
                  fontFamily: "'Inter', sans-serif"
                }}>Ready to Start Your Journey?</h3>
                <p className="section-subtitle mb-0" style={{
                  fontSize: '1.1rem',
                  color: 'rgba(255, 255, 255, 0.9)',
                  lineHeight: '1.6',
                  margin: '0'
                }}>
                  Join thousands of students who have found their dream internships through CareerNest.
                </p>
              </Col>
              <Col md={4} className="text-center text-md-end mt-4 mt-md-0">
                <Button 
                  variant="light"
                  size="lg"
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: '700',
                    padding: '1rem 2rem',
                    borderRadius: '8px',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                    color: '#33A1E0',
                    border: 'none',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
                  }}
                  onClick={onShowRegister}
                >
                  Create Account
                </Button>
              </Col>
            </Row>
          </Container>
        </section>

             {/* Testimonials Section */}
       <section className="py-5" style={{ background: '#f8fafc' }}>
         <Container>
           <div className="text-center mb-5">
             <h2 className="section-title" style={{
               fontSize: '2.5rem',
               fontWeight: '700',
               color: '#2c3e50',
               marginBottom: '1rem',
               fontFamily: "'Inter', sans-serif"
             }}>What Students Say</h2>
             <p className="section-subtitle" style={{
               fontSize: '1.2rem',
               color: '#6c757d',
               maxWidth: '600px',
               margin: '0 auto',
               lineHeight: '1.6'
             }}>
               Success stories from our community
             </p>
           </div>
           <Row>
             <Col md={4} className="mb-4">
               <Card className="testimonial-card h-100" style={{
                 border: 'none',
                 borderRadius: '16px',
                 boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
                 transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                 background: '#ffffff',
                 overflow: 'hidden'
               }}>
                 <Card.Body className="p-5">
                   <div className="testimonial-rating mb-4" style={{
                     fontSize: '1.2rem',
                     color: '#ffc107'
                   }}>
                     <i className="fas fa-star"></i>
                     <i className="fas fa-star"></i>
                     <i className="fas fa-star"></i>
                     <i className="fas fa-star"></i>
                     <i className="fas fa-star"></i>
                   </div>
                   <p className="card-text mb-4" style={{
                     fontSize: '1rem',
                     color: '#495057',
                     lineHeight: '1.7',
                     fontStyle: 'italic'
                   }}>
                     "CareerNest made my internship search so much easier. I found my dream role at a top tech company!"
                   </p>
                   <div className="testimonial-author">
                     <strong style={{
                       fontSize: '1.1rem',
                       color: '#2c3e50',
                       fontFamily: "'Inter', sans-serif"
                     }}>Sarah Chen</strong>
                     <small className="d-block" style={{ 
                       color: '#6c757d',
                       fontSize: '0.9rem',
                       marginTop: '0.25rem'
                     }}>Computer Science Student</small>
                   </div>
                 </Card.Body>
               </Card>
             </Col>
             <Col md={4} className="mb-4">
               <Card className="testimonial-card h-100" style={{
                 border: 'none',
                 borderRadius: '16px',
                 boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
                 transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                 background: '#ffffff',
                 overflow: 'hidden'
               }}>
                 <Card.Body className="p-5">
                   <div className="testimonial-rating mb-4" style={{
                     fontSize: '1.2rem',
                     color: '#ffc107'
                   }}>
                     <i className="fas fa-star"></i>
                     <i className="fas fa-star"></i>
                     <i className="fas fa-star"></i>
                     <i className="fas fa-star"></i>
                     <i className="fas fa-star"></i>
                   </div>
                   <p className="card-text mb-4" style={{
                     fontSize: '1rem',
                     color: '#495057',
                     lineHeight: '1.7',
                     fontStyle: 'italic'
                   }}>
                     "The application tracking feature is amazing. I always know the status of my applications."
                   </p>
                   <div className="testimonial-author">
                     <strong style={{
                       fontSize: '1.1rem',
                       color: '#2c3e50',
                       fontFamily: "'Inter', sans-serif"
                     }}>Michael Rodriguez</strong>
                     <small className="d-block" style={{ 
                       color: '#6c757d',
                       fontSize: '0.9rem',
                       marginTop: '0.25rem'
                     }}>Business Student</small>
                   </div>
                 </Card.Body>
               </Card>
             </Col>
             <Col md={4} className="mb-4">
               <Card className="testimonial-card h-100" style={{
                 border: 'none',
                 borderRadius: '16px',
                 boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
                 transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                 background: '#ffffff',
                 overflow: 'hidden'
               }}>
                 <Card.Body className="p-5">
                   <div className="testimonial-rating mb-4" style={{
                     fontSize: '1.2rem',
                     color: '#ffc107'
                   }}>
                     <i className="fas fa-star"></i>
                     <i className="fas fa-star"></i>
                     <i className="fas fa-star"></i>
                     <i className="fas fa-star"></i>
                     <i className="fas fa-star"></i>
                   </div>
                   <p className="card-text mb-4" style={{
                     fontSize: '1rem',
                     color: '#495057',
                     lineHeight: '1.7',
                     fontStyle: 'italic'
                   }}>
                     "Great platform with excellent opportunities. The search filters helped me find exactly what I was looking for."
                   </p>
                   <div className="testimonial-author">
                     <strong style={{
                       fontSize: '1.1rem',
                       color: '#2c3e50',
                       fontFamily: "'Inter', sans-serif"
                     }}>Emily Johnson</strong>
                     <small className="d-block" style={{ 
                       color: '#6c757d',
                       fontSize: '0.9rem',
                       marginTop: '0.25rem'
                     }}>Marketing Student</small>
                   </div>
                 </Card.Body>
               </Card>
             </Col>
           </Row>
         </Container>
       </section>

             {/* Footer */}
       <footer className="footer" style={{
         background: '#2c3e50',
         color: '#ffffff',
         padding: '3rem 0 2rem 0'
       }}>
         <Container>
           <div className="footer-content text-center">
             <p style={{
               fontSize: '1.1rem',
               fontWeight: '600',
               marginBottom: '1rem',
               color: '#33A1E0'
             }}>Featured on the World's Top News Media</p>
             <p style={{
               fontSize: '0.9rem',
               color: '#bdc3c7',
               margin: '0'
             }}>&copy; 2024 CareerNest. All rights reserved.</p>
           </div>
         </Container>
       </footer>
    </div>
  );
};

export default Home; 