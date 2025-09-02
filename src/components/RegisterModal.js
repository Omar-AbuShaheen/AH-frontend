import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { 
  validateEmail, 
  validatePassword, 
  validateConfirmPassword,
  validateName,
  validateCompanyName,
  validatePhone,
  validateWebsite,
  validateUniversity,
  validateMajor,
  validateGraduationYear,
  validateIndustry,
  validateLocation,
  validateDescription,
  getPasswordStrength
} from '../utils/validation';

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
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: '', color: '' });

  const handleFieldChange = (field, value) => {
    onRegisterChange({ ...registerForm, [field]: value });
    
    // Mark field as touched for validation
    if (!touched[field]) {
      setTouched({ ...touched, [field]: true });
    }
    
    // Real-time validation on every change (not just when touched)
    validateField(field, value);
    
    // Update password strength for password field
    if (field === 'password') {
      setPasswordStrength(getPasswordStrength(value));
    }
  };

  const validateField = (field, value) => {
    let validation;
    
    switch (field) {
      case 'email':
        validation = validateEmail(value);
        break;
      case 'password':
        validation = validatePassword(value);
        break;
      case 'confirmPassword':
        validation = validateConfirmPassword(registerForm.password, value);
        break;
      case 'firstName':
        validation = validateName(value, 'First name');
        break;
      case 'lastName':
        validation = validateName(value, 'Last name');
        break;
      case 'companyName':
        validation = validateCompanyName(value);
        break;
      case 'contactPerson':
        validation = validateName(value, 'Contact person');
        break;
      case 'phone':
        validation = validatePhone(value);
        break;
      case 'website':
        validation = validateWebsite(value);
        break;
      case 'university':
        validation = validateUniversity(value);
        break;
      case 'major':
        validation = validateMajor(value);
        break;
      case 'graduationYear':
        validation = validateGraduationYear(value);
        break;
      case 'industry':
        validation = validateIndustry(value);
        break;
      case 'location':
        validation = validateLocation(value);
        break;
      case 'description':
        validation = validateDescription(value);
        break;
      default:
        return;
    }
    
    if (validation) {
      setErrors(prev => ({ 
        ...prev, 
        [field]: validation.isValid ? '' : validation.message 
      }));
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
      confirmPassword: '',
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
    setPasswordStrength({ score: 0, label: '', color: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Common validations
    const emailValidation = validateEmail(registerForm.email);
    if (!emailValidation.isValid) newErrors.email = emailValidation.message;
    
    const passwordValidation = validatePassword(registerForm.password);
    if (!passwordValidation.isValid) newErrors.password = passwordValidation.message;
    
    const confirmPasswordValidation = validateConfirmPassword(registerForm.password, registerForm.confirmPassword);
    if (!confirmPasswordValidation.isValid) newErrors.confirmPassword = confirmPasswordValidation.message;
    
    const phoneValidation = validatePhone(registerForm.phone);
    if (!phoneValidation.isValid) newErrors.phone = phoneValidation.message;
    
    // Role-specific validations
    if (registerForm.role === 'student') {
      const firstNameValidation = validateName(registerForm.firstName, 'First name');
      if (!firstNameValidation.isValid) newErrors.firstName = firstNameValidation.message;
      
      const lastNameValidation = validateName(registerForm.lastName, 'Last name');
      if (!lastNameValidation.isValid) newErrors.lastName = lastNameValidation.message;
      
      const universityValidation = validateUniversity(registerForm.university);
      if (!universityValidation.isValid) newErrors.university = universityValidation.message;
      
      const majorValidation = validateMajor(registerForm.major);
      if (!majorValidation.isValid) newErrors.major = majorValidation.message;
      
      const graduationYearValidation = validateGraduationYear(registerForm.graduationYear);
      if (!graduationYearValidation.isValid) newErrors.graduationYear = graduationYearValidation.message;
    } else if (registerForm.role === 'company') {
      const companyNameValidation = validateCompanyName(registerForm.companyName);
      if (!companyNameValidation.isValid) newErrors.companyName = companyNameValidation.message;
      
      const contactPersonValidation = validateName(registerForm.contactPerson, 'Contact person');
      if (!contactPersonValidation.isValid) newErrors.contactPerson = contactPersonValidation.message;
      
      const industryValidation = validateIndustry(registerForm.industry);
      if (!industryValidation.isValid) newErrors.industry = industryValidation.message;
      
      const locationValidation = validateLocation(registerForm.location);
      if (!locationValidation.isValid) newErrors.location = locationValidation.message;
      
      const websiteValidation = validateWebsite(registerForm.website);
      if (!websiteValidation.isValid) newErrors.website = websiteValidation.message;
      
      const descriptionValidation = validateDescription(registerForm.description);
      if (!descriptionValidation.isValid) newErrors.description = descriptionValidation.message;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Mark all relevant fields as touched based on role
    const fieldsToTouch = {
      email: true,
      password: true,
      confirmPassword: true,
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
        contactPerson: true,
        industry: true,
        location: true,
        website: true,
        description: true
      });
    }
    
    setTouched(fieldsToTouch);
    
    // Validate form
    if (validateForm()) {
      if (registerForm.role === 'company') {
        onCompanyRegister(e);
      } else {
        onRegister(e);
      }
    }
  };

  const handleFieldBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, registerForm[field]);
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
                  {errors.email}
                </Form.Control.Feedback>
                <Form.Control.Feedback type="valid" style={{ fontSize: '0.85rem', color: '#28a745' }}>
                  ✓ Valid email
                </Form.Control.Feedback>
                
                {/* Email Validation Indicator */}
                {registerForm.email && (
                  <div className="mt-2">
                    <small className={`${errors.email ? 'text-danger' : 'text-success'}`}>
                      <i className={`fas ${errors.email ? 'fa-times-circle' : 'fa-check-circle'} me-1`}></i>
                      {errors.email ? errors.email : 'Valid email format'}
                    </small>
                  </div>
                )}
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
                  {errors.password}
                </Form.Control.Feedback>
                <Form.Control.Feedback type="valid" style={{ fontSize: '0.85rem', color: '#28a745' }}>
                  ✓ Valid password
                </Form.Control.Feedback>
                
                {/* Enhanced Password Strength Indicator */}
                {registerForm.password && (
                  <div className="mt-2">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <small className="text-muted">Password Strength:</small>
                      <small style={{ color: passwordStrength.color, fontWeight: '600' }}>
                        {passwordStrength.label}
                      </small>
                    </div>
                    <div className="progress" style={{ height: '4px' }}>
                      <div 
                        className="progress-bar" 
                        style={{ 
                          width: `${(passwordStrength.score / 6) * 100}%`,
                          backgroundColor: passwordStrength.color,
                          transition: 'all 0.3s ease'
                        }}
                      ></div>
                    </div>
                  </div>
                )}
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
              Confirm Password
            </Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm your password"
              value={registerForm.confirmPassword || ''}
              onChange={(e) => handleFieldChange('confirmPassword', e.target.value)}
              onBlur={() => handleFieldBlur('confirmPassword')}
              isInvalid={touched.confirmPassword && !!errors.confirmPassword}
              isValid={touched.confirmPassword && !errors.confirmPassword}
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
              {errors.confirmPassword}
            </Form.Control.Feedback>
            <Form.Control.Feedback type="valid" style={{ fontSize: '0.85rem', color: '#28a745' }}>
              ✓ Passwords match
            </Form.Control.Feedback>
            
            {/* Password Match Indicator */}
            {registerForm.confirmPassword && (
              <div className="mt-2">
                <small className={`${errors.confirmPassword ? 'text-danger' : 'text-success'}`}>
                  <i className={`fas ${errors.confirmPassword ? 'fa-times-circle' : 'fa-check-circle'} me-1`}></i>
                  {errors.confirmPassword ? 'Passwords do not match' : 'Passwords match'}
                </small>
              </div>
            )}
          </Form.Group>

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
              {errors.phone}
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
                      {errors.firstName}
                    </Form.Control.Feedback>
                    <Form.Control.Feedback type="valid" style={{ fontSize: '0.85rem', color: '#28a745' }}>
                      ✓ Valid first name
                    </Form.Control.Feedback>
                    
                    {/* First Name Validation Indicator */}
                    {registerForm.firstName && (
                      <div className="mt-2">
                        <small className={`${errors.firstName ? 'text-danger' : 'text-success'}`}>
                          <i className={`fas ${errors.firstName ? 'fa-times-circle' : 'fa-check-circle'} me-1`}></i>
                          {errors.firstName ? errors.firstName : 'Valid first name'}
                        </small>
                      </div>
                    )}
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
                      {errors.lastName}
                    </Form.Control.Feedback>
                    <Form.Control.Feedback type="valid" style={{ fontSize: '0.85rem', color: '#28a745' }}>
                      ✓ Valid last name
                    </Form.Control.Feedback>
                    
                    {/* Last Name Validation Indicator */}
                    {registerForm.lastName && (
                      <div className="mt-2">
                        <small className={`${errors.lastName ? 'text-danger' : 'text-success'}`}>
                          <i className={`fas ${errors.lastName ? 'fa-times-circle' : 'fa-check-circle'} me-1`}></i>
                          {errors.lastName ? errors.lastName : 'Valid last name'}
                        </small>
                      </div>
                    )}
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
                      {errors.university}
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
                      {errors.major}
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
                      {errors.graduationYear}
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
                      {errors.skills}
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
                  {errors.experience}
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
                      {errors.companyName}
                    </Form.Control.Feedback>
                    <Form.Control.Feedback type="valid">
                      ✓ Valid company name
                    </Form.Control.Feedback>
                    
                    {/* Company Name Validation Indicator */}
                    {registerForm.companyName && (
                      <div className="mt-2">
                        <small className={`${errors.companyName ? 'text-danger' : 'text-success'}`}>
                          <i className={`fas ${errors.companyName ? 'fa-times-circle' : 'fa-check-circle'} me-1`}></i>
                          {errors.companyName ? errors.companyName : 'Valid company name'}
                        </small>
                      </div>
                    )}
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
                      {errors.contactPerson}
                    </Form.Control.Feedback>
                    <Form.Control.Feedback type="valid">
                      ✓ Valid contact person
                    </Form.Control.Feedback>
                    
                    {/* Contact Person Validation Indicator */}
                    {registerForm.contactPerson && (
                      <div className="mt-2">
                        <small className={`${errors.contactPerson ? 'text-danger' : 'text-success'}`}>
                          <i className={`fas ${errors.contactPerson ? 'fa-times-circle' : 'fa-check-circle'} me-1`}></i>
                          {errors.contactPerson ? errors.contactPerson : 'Valid contact person name'}
                        </small>
                      </div>
                    )}
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
                      {errors.industry}
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
                      {errors.location}
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
                      {errors.website}
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
                      {errors.description}
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
