import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { validateRegisterForm, getFieldError, isFieldValid } from '../utils/validation';

const RegisterModal = ({
  show,
  onHide,
  registerForm,
  onRegisterChange,
  onRegister,
  onCompanyRegister,
  loading = false
}) => {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Validate form on form data change
  useEffect(() => {
    if (Object.keys(touched).length > 0) {
      const validation = validateRegisterForm(registerForm);
      setErrors(validation.errors);
    }
  }, [registerForm, touched]);

  const handleFieldChange = (field, value) => {
    onRegisterChange({ ...registerForm, [field]: value });
    
    // Mark field as touched for validation
    if (!touched[field]) {
      setTouched({ ...touched, [field]: true });
    }
  };

  const handleRoleChange = (role) => {
    // Reset form when role changes
    const resetForm = {
      role: role,
      firstName: '',
      lastName: '',
      email: '',
      major: '',
      university: '',
      graduationYear: '',
      phone: '',
      skills: '',
      experience: '',
      password: '',
      companyName: '',
      contactPerson: '',
      industry: '',
      location: '',
      website: '',
      description: ''
    };
    onRegisterChange(resetForm);
    setTouched({});
    setErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Mark all relevant fields as touched based on role
    const fieldsToTouch = {
      email: true,
      password: true,
      phone: true
    };

    if (registerForm.role === 'student') {
      Object.assign(fieldsToTouch, {
        firstName: true,
        lastName: true,
        university: true,
        major: true,
        graduationYear: true
      });
    } else if (registerForm.role === 'company') {
      Object.assign(fieldsToTouch, {
        companyName: true,
        contactPerson: true
      });
    }
    
    setTouched(fieldsToTouch);
    
    // Validate form
    const validation = validateRegisterForm(registerForm);
    setErrors(validation.errors);
    
    if (validation.isValid) {
      if (registerForm.role === 'company') {
        onCompanyRegister(e);
      } else {
        onRegister(e);
      }
    }
  };

  const handleFieldBlur = (field) => {
    setTouched({ ...touched, [field]: true });
  };

  // Check if form has required data based on role
  const hasRequiredData = () => {
    const commonFields = registerForm.email && registerForm.password && registerForm.phone;
    
    if (registerForm.role === 'student') {
      return commonFields && 
             registerForm.firstName && 
             registerForm.lastName && 
             registerForm.university && 
             registerForm.major && 
             registerForm.graduationYear;
    } else if (registerForm.role === 'company') {
      return commonFields && 
             registerForm.companyName && 
             registerForm.contactPerson;
    }
    
    return false;
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Modal.Header closeButton style={{
        background: 'linear-gradient(135deg, #33A1E0 0%, #2a8bd1 100%)',
        color: '#ffffff',
        borderBottom: 'none',
        borderRadius: '12px 12px 0 0'
      }}>
                 <Modal.Title style={{
           fontSize: '1.5rem',
           fontWeight: '700',
           color: '#ffffff'
         }}>
           <i className="fas fa-user-plus me-2"></i>
           Register for CareerNest
         </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ padding: '2rem' }}>
        <Form onSubmit={handleSubmit} noValidate>
          {/* Role Selection */}
          <Form.Group className="mb-4">
            <Form.Label style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: '#2c3e50',
              marginBottom: '1rem'
            }}>
              Choose Your Account Type:
            </Form.Label>
            <div style={{
              display: 'flex',
              gap: '1rem',
              marginBottom: '1rem'
            }}>
              <div style={{
                flex: 1,
                padding: '1rem',
                border: `2px solid ${registerForm.role === 'student' ? '#33A1E0' : '#e9ecef'}`,
                borderRadius: '8px',
                background: registerForm.role === 'student' ? 'rgba(51, 161, 224, 0.1)' : '#ffffff',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }} onClick={() => handleRoleChange('student')}>
                <Form.Check
                  type="radio"
                  id="role-student"
                  name="role"
                  value="student"
                  checked={registerForm.role === 'student'}
                  onChange={(e) => handleRoleChange(e.target.value)}
                                     label={
                     <div style={{ textAlign: 'center' }}>
                       <div style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#33A1E0' }}>
                         <i className="fas fa-graduation-cap"></i>
                       </div>
                       <div style={{ fontWeight: '600', color: '#2c3e50' }}>Student</div>
                       <div style={{ fontSize: '0.8rem', color: '#6c757d' }}>Find internships</div>
                     </div>
                   }
                />
              </div>
              <div style={{
                flex: 1,
                padding: '1rem',
                border: `2px solid ${registerForm.role === 'company' ? '#33A1E0' : '#e9ecef'}`,
                borderRadius: '8px',
                background: registerForm.role === 'company' ? 'rgba(51, 161, 224, 0.1)' : '#ffffff',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }} onClick={() => handleRoleChange('company')}>
                <Form.Check
                  type="radio"
                  id="role-company"
                  name="role"
                  value="company"
                  checked={registerForm.role === 'company'}
                  onChange={(e) => handleRoleChange(e.target.value)}
                                     label={
                     <div style={{ textAlign: 'center' }}>
                       <div style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#33A1E0' }}>
                         <i className="fas fa-building"></i>
                       </div>
                       <div style={{ fontWeight: '600', color: '#2c3e50' }}>Company</div>
                       <div style={{ fontSize: '0.8rem', color: '#6c757d' }}>Post internships</div>
                     </div>
                   }
                />
              </div>
            </div>
          </Form.Group>

          {/* Common Fields */}
          <Row>
            <Col md={6}>
              <Form.Group className="mb-4">
                <Form.Label style={{
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: '#2c3e50',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '0.5rem'
                }}>
                  Email Address
                </Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email address"
                  value={registerForm.email}
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                  onBlur={() => handleFieldBlur('email')}
                  isInvalid={touched.email && !!errors.email}
                  isValid={touched.email && !errors.email}
                  required
                  style={{
                    borderRadius: '8px',
                    border: '2px solid #e9ecef',
                    padding: '0.75rem 1rem',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease'
                  }}
                />
                <Form.Control.Feedback type="invalid" style={{ fontSize: '0.85rem' }}>
                  {getFieldError('email', errors)}
                </Form.Control.Feedback>
                <Form.Control.Feedback type="valid" style={{ fontSize: '0.85rem', color: '#28a745' }}>
                  ✓ Valid email
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-4">
                <Form.Label style={{
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: '#2c3e50',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '0.5rem'
                }}>
                  Password
                </Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter your password"
                  value={registerForm.password || ''}
                  onChange={(e) => handleFieldChange('password', e.target.value)}
                  onBlur={() => handleFieldBlur('password')}
                  isInvalid={touched.password && !!errors.password}
                  isValid={touched.password && !errors.password}
                  required
                  style={{
                    borderRadius: '8px',
                    border: '2px solid #e9ecef',
                    padding: '0.75rem 1rem',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease'
                  }}
                />
                <Form.Control.Feedback type="invalid" style={{ fontSize: '0.85rem' }}>
                  {getFieldError('password', errors)}
                </Form.Control.Feedback>
                <Form.Control.Feedback type="valid" style={{ fontSize: '0.85rem', color: '#28a745' }}>
                  ✓ Valid password
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-4">
            <Form.Label style={{
              fontSize: '0.9rem',
              fontWeight: '600',
              color: '#2c3e50',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '0.5rem'
            }}>
              Phone Number
            </Form.Label>
            <Form.Control
              type="tel"
              placeholder="e.g., +1234567890"
              value={registerForm.phone}
              onChange={(e) => handleFieldChange('phone', e.target.value)}
              onBlur={() => handleFieldBlur('phone')}
              isInvalid={touched.phone && !!errors.phone}
              isValid={touched.phone && !errors.phone}
              required
              style={{
                borderRadius: '8px',
                border: '2px solid #e9ecef',
                padding: '0.75rem 1rem',
                fontSize: '1rem',
                transition: 'all 0.3s ease'
              }}
            />
            <Form.Control.Feedback type="invalid" style={{ fontSize: '0.85rem' }}>
              {getFieldError('phone', errors)}
            </Form.Control.Feedback>
            <Form.Control.Feedback type="valid" style={{ fontSize: '0.85rem', color: '#28a745' }}>
              ✓ Valid phone number
            </Form.Control.Feedback>
          </Form.Group>

          {/* Student-specific fields */}
          {registerForm.role === 'student' && (
            <>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label style={{
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      color: '#2c3e50',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      marginBottom: '0.5rem'
                    }}>
                      First Name
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your first name"
                      value={registerForm.firstName || ''}
                      onChange={(e) => handleFieldChange('firstName', e.target.value)}
                      onBlur={() => handleFieldBlur('firstName')}
                      isInvalid={touched.firstName && !!errors.firstName}
                      isValid={touched.firstName && !errors.firstName}
                      required
                      style={{
                        borderRadius: '8px',
                        border: '2px solid #e9ecef',
                        padding: '0.75rem 1rem',
                        fontSize: '1rem',
                        transition: 'all 0.3s ease'
                      }}
                    />
                    <Form.Control.Feedback type="invalid" style={{ fontSize: '0.85rem' }}>
                      {getFieldError('firstName', errors)}
                    </Form.Control.Feedback>
                    <Form.Control.Feedback type="valid" style={{ fontSize: '0.85rem', color: '#28a745' }}>
                      ✓ Valid first name
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label style={{
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      color: '#2c3e50',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      marginBottom: '0.5rem'
                    }}>
                      Last Name
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your last name"
                      value={registerForm.lastName || ''}
                      onChange={(e) => handleFieldChange('lastName', e.target.value)}
                      onBlur={() => handleFieldBlur('lastName')}
                      isInvalid={touched.lastName && !!errors.lastName}
                      isValid={touched.lastName && !errors.lastName}
                      required
                      style={{
                        borderRadius: '8px',
                        border: '2px solid #e9ecef',
                        padding: '0.75rem 1rem',
                        fontSize: '1rem',
                        transition: 'all 0.3s ease'
                      }}
                    />
                    <Form.Control.Feedback type="invalid" style={{ fontSize: '0.85rem' }}>
                      {getFieldError('lastName', errors)}
                    </Form.Control.Feedback>
                    <Form.Control.Feedback type="valid" style={{ fontSize: '0.85rem', color: '#28a745' }}>
                      ✓ Valid last name
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>University</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="e.g., University of Technology"
                      value={registerForm.university}
                      onChange={(e) => handleFieldChange('university', e.target.value)}
                      onBlur={() => handleFieldBlur('university')}
                      isInvalid={touched.university && !!errors.university}
                      isValid={touched.university && !errors.university}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {getFieldError('university', errors)}
                    </Form.Control.Feedback>
                    <Form.Control.Feedback type="valid">
                      ✓ Valid university
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Major/Field of Study</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="e.g., Computer Science"
                      value={registerForm.major}
                      onChange={(e) => handleFieldChange('major', e.target.value)}
                      onBlur={() => handleFieldBlur('major')}
                      isInvalid={touched.major && !!errors.major}
                      isValid={touched.major && !errors.major}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {getFieldError('major', errors)}
                    </Form.Control.Feedback>
                    <Form.Control.Feedback type="valid">
                      ✓ Valid major
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Graduation Year</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="e.g., 2025"
                      min="2024"
                      max="2030"
                      value={registerForm.graduationYear}
                      onChange={(e) => handleFieldChange('graduationYear', e.target.value)}
                      onBlur={() => handleFieldBlur('graduationYear')}
                      isInvalid={touched.graduationYear && !!errors.graduationYear}
                      isValid={touched.graduationYear && !errors.graduationYear}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {getFieldError('graduationYear', errors)}
                    </Form.Control.Feedback>
                    <Form.Control.Feedback type="valid">
                      ✓ Valid graduation year
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Skills</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="e.g., JavaScript, React, Python"
                      value={registerForm.skills || ''}
                      onChange={(e) => handleFieldChange('skills', e.target.value)}
                      onBlur={() => handleFieldBlur('skills')}
                      isInvalid={touched.skills && !!errors.skills}
                      isValid={touched.skills && !errors.skills}
                    />
                    <Form.Control.Feedback type="invalid">
                      {getFieldError('skills', errors)}
                    </Form.Control.Feedback>
                    <Form.Control.Feedback type="valid">
                      ✓ Valid skills
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Experience</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Brief description of your experience..."
                  value={registerForm.experience || ''}
                  onChange={(e) => handleFieldChange('experience', e.target.value)}
                  onBlur={() => handleFieldBlur('experience')}
                  isInvalid={touched.experience && !!errors.experience}
                  isValid={touched.experience && !errors.experience}
                />
                <Form.Control.Feedback type="invalid">
                  {getFieldError('experience', errors)}
                </Form.Control.Feedback>
                <Form.Control.Feedback type="valid">
                  ✓ Valid experience
                </Form.Control.Feedback>
              </Form.Group>
            </>
          )}

          {/* Company-specific fields */}
          {registerForm.role === 'company' && (
            <>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Company Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter company name"
                      value={registerForm.companyName || ''}
                      onChange={(e) => handleFieldChange('companyName', e.target.value)}
                      onBlur={() => handleFieldBlur('companyName')}
                      isInvalid={touched.companyName && !!errors.companyName}
                      isValid={touched.companyName && !errors.companyName}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {getFieldError('companyName', errors)}
                    </Form.Control.Feedback>
                    <Form.Control.Feedback type="valid">
                      ✓ Valid company name
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Contact Person</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter contact person name"
                      value={registerForm.contactPerson || ''}
                      onChange={(e) => handleFieldChange('contactPerson', e.target.value)}
                      onBlur={() => handleFieldBlur('contactPerson')}
                      isInvalid={touched.contactPerson && !!errors.contactPerson}
                      isValid={touched.contactPerson && !errors.contactPerson}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {getFieldError('contactPerson', errors)}
                    </Form.Control.Feedback>
                    <Form.Control.Feedback type="valid">
                      ✓ Valid contact person
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Industry</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="e.g., Technology, Healthcare, Finance"
                      value={registerForm.industry || ''}
                      onChange={(e) => handleFieldChange('industry', e.target.value)}
                      onBlur={() => handleFieldBlur('industry')}
                      isInvalid={touched.industry && !!errors.industry}
                      isValid={touched.industry && !errors.industry}
                    />
                    <Form.Control.Feedback type="invalid">
                      {getFieldError('industry', errors)}
                    </Form.Control.Feedback>
                    <Form.Control.Feedback type="valid">
                      ✓ Valid industry
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Location</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="e.g., New York, NY"
                      value={registerForm.location || ''}
                      onChange={(e) => handleFieldChange('location', e.target.value)}
                      onBlur={() => handleFieldBlur('location')}
                      isInvalid={touched.location && !!errors.location}
                      isValid={touched.location && !errors.location}
                    />
                    <Form.Control.Feedback type="invalid">
                      {getFieldError('location', errors)}
                    </Form.Control.Feedback>
                    <Form.Control.Feedback type="valid">
                      ✓ Valid location
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Website</Form.Label>
                    <Form.Control
                      type="url"
                      placeholder="https://www.company.com"
                      value={registerForm.website || ''}
                      onChange={(e) => handleFieldChange('website', e.target.value)}
                      onBlur={() => handleFieldBlur('website')}
                      isInvalid={touched.website && !!errors.website}
                      isValid={touched.website && !errors.website}
                    />
                    <Form.Control.Feedback type="invalid">
                      {getFieldError('website', errors)}
                    </Form.Control.Feedback>
                    <Form.Control.Feedback type="valid">
                      ✓ Valid website
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Company Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Brief description of your company..."
                      value={registerForm.description || ''}
                      onChange={(e) => handleFieldChange('description', e.target.value)}
                      onBlur={() => handleFieldBlur('description')}
                      isInvalid={touched.description && !!errors.description}
                      isValid={touched.description && !errors.description}
                    />
                    <Form.Control.Feedback type="invalid">
                      {getFieldError('description', errors)}
                    </Form.Control.Feedback>
                    <Form.Control.Feedback type="valid">
                      ✓ Valid description
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
            </>
          )}

          <Button 
            variant="primary"
            type="submit" 
            className="w-100" 
            disabled={loading || !hasRequiredData()}
            style={{
              background: '#33A1E0',
              border: 'none',
              borderRadius: '8px',
              padding: '0.875rem 1.5rem',
              fontSize: '1rem',
              fontWeight: '700',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(51, 161, 224, 0.3)',
              marginTop: '1rem'
            }}
          >
                         {loading ? (
               <>
                 <i className="fas fa-spinner fa-spin me-2"></i>
                 Creating Account...
               </>
             ) : (
               <>
                 <i className="fas fa-user-plus me-2"></i>
                 Create {registerForm.role === 'company' ? 'Company' : 'Student'} Account
               </>
             )}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default RegisterModal;
