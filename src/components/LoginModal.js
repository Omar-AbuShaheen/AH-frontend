import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { authAPI } from '../services/api';

const LoginModal = ({ show, onHide, onLogin, onAdminLogin, onCompanyLogin }) => {
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);

  const handleFieldChange = (field, value) => {
    setLoginForm(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log('🚀 Attempting unified login...');
      const response = await authAPI.login(loginForm);
      console.log('📨 Login response:', response);
      
      if (response.token) {
        // Call the main login function with the response
        onLogin(e, response);
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      setErrors({ general: error.message || 'Login failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleFieldBlur = (field) => {
    setTouched({ ...touched, [field]: true });
  };

  // Check if form has required data
  const hasRequiredData = () => {
    return loginForm.email && loginForm.password;
  };

  return (
    <Modal show={show} onHide={onHide} style={{ fontFamily: "'Inter', sans-serif" }}>
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
           <i className="fas fa-sign-in-alt me-2"></i>
           Login to CareerNest
         </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ padding: '2rem' }}>
        <Form onSubmit={handleSubmit} noValidate>
          {errors.general && (
            <Alert variant="danger" onClose={() => setErrors({})} dismissible style={{
              borderRadius: '8px',
              border: 'none',
              fontSize: '0.9rem'
            }}>
              {errors.general}
            </Alert>
          )}

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
              value={loginForm.email}
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
              Password
            </Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter your password"
              value={loginForm.password || ''}
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
          </Form.Group>

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
              boxShadow: '0 4px 15px rgba(51, 161, 224, 0.3)'
            }}
          >
                         {loading ? (
               <>
                 <i className="fas fa-spinner fa-spin me-2"></i>
                 Logging in...
               </>
             ) : (
               <>
                 <i className="fas fa-sign-in-alt me-2"></i>
                 Login
               </>
             )}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default LoginModal;
