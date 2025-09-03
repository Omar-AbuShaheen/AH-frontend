import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Modal, Form, Badge, Alert, Spinner, Nav, ProgressBar, Dropdown } from 'react-bootstrap';

const API_BASE_URL = 'http://localhost:5000/api';

function StudentDashboard({ user, onNavigate, onProfileUpdate }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [internships, setInternships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [selectedInternship, setSelectedInternship] = useState(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [applicationStatusFilter, setApplicationStatusFilter] = useState('all');
  
  // Form states
  const [profileForm, setProfileForm] = useState({
    name: '',
    phone: '',
    university: '',
    major: '',
    graduation_year: '',
    skills: '',
    experience: '',
    gpa: '',
    education: '',
    location: '',
    bio: '',
    date_of_birth: '',
    linkedin_url: '',
    github_url: '',
    portfolio_url: ''
  });

  // Messages state
  const [messages, setMessages] = useState([]);

  const [resumeForm, setResumeForm] = useState({
    resume_file: null
  });

  useEffect(() => {
    fetchStudentData();
    fetchMessages();
    if (user) {
      setProfileForm({
        name: user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim(),
        phone: user.phone || '',
        university: user.university || '',
        major: user.major || '',
        graduation_year: user.graduation_year || '',
        skills: user.skills || '',
        experience: user.experience || '',
        gpa: user.gpa || '',
        education: user.education || '',
        location: user.location || '',
        bio: user.bio || '',
        date_of_birth: user.date_of_birth || '',
        linkedin_url: user.linkedin_url || '',
        github_url: user.github_url || '',
        portfolio_url: user.portfolio_url || ''
      });
    }
  }, [user]);

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');

      // Fetch available internships and student's applications
      const [internshipsRes, applicationsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/internships`, { 
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }),
        fetch(`${API_BASE_URL}/applications/my-applications`, { 
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
      ]);

      if (internshipsRes.ok) {
        const internshipsData = await internshipsRes.json();
        setInternships(internshipsData);
      } else {
        console.error('Failed to fetch internships:', internshipsRes.status);
      }

      if (applicationsRes.ok) {
        const applicationsData = await applicationsRes.json();
        setApplications(applicationsData);
      } else {
        console.error('Failed to fetch applications:', applicationsRes.status);
      }
    } catch (error) {
      console.error('Error fetching student data:', error);
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  // Enhanced statistics calculations
  const getStats = () => {
    const totalApplications = applications.length;
    const appliedCount = applications.filter(app => app.status === 'Applied').length;
    const shortlistedCount = applications.filter(app => app.status === 'Shortlisted').length;
    const hiredCount = applications.filter(app => app.status === 'Hired').length;
    const rejectedCount = applications.filter(app => app.status === 'Rejected').length;
    
    const availableInternships = internships.filter(i => i.is_active && i.is_approved).length;
    const appliedInternships = applications.length;
    const savedInternships = 0; // Placeholder for saved internships feature

    const recentApplications = applications
      .sort((a, b) => new Date(b.applied_date) - new Date(a.applied_date))
      .slice(0, 5);

    const applicationStats = {
      applied: appliedCount,
      shortlisted: shortlistedCount,
      hired: hiredCount,
      rejected: rejectedCount
    };

    return {
      totalApplications,
      availableInternships,
      appliedInternships,
      savedInternships,
      applicationStats,
      recentApplications
    };
  };

  const handleApply = async (internshipId) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/internships/${internshipId}/apply`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          cover_letter: 'I am excited to apply for this position and believe my skills and experience make me a great candidate for this role.'
        })
      });

      if (response.ok) {
        const result = await response.json();
        
        // Refresh the data to show the new application
        await fetchStudentData();
        
        // Also manually add the new application to the state if needed
        const internship = internships.find(i => i.id === internshipId);
        if (internship) {
          const newApplication = {
            id: result.id || Date.now(), // Use result ID or fallback
            internship_id: internshipId,
            internship_title: internship.title,
            company_name: internship.company_name,
            location: internship.location,
            type: internship.type,
            status: 'Applied',
            created_at: new Date().toISOString(),
            applied_date: new Date().toISOString()
          };
          
          setApplications(prev => [newApplication, ...prev]);
        }
        
        alert('Application submitted successfully!');
      } else {
        const error = await response.json();
        console.error('Application failed:', error);
        alert(error.message || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Application error:', error);
      alert('Error submitting application');
    }
  };

  const handleViewInternship = (internship) => {
    setSelectedInternship(internship);
    setShowApplicationModal(true);
  };

  const handleCloseInternshipModal = () => {
    setShowApplicationModal(false);
    setSelectedInternship(null);
  };

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/applications/my-messages`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const messagesData = await response.json();
        setMessages(messagesData);
      } else {
        console.error('Failed to fetch messages:', response.status);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const fetchUpdatedProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/students/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const updatedUser = await response.json();
        // Update the profile form with fresh data
        setProfileForm({
          name: updatedUser.name || `${updatedUser.first_name || ''} ${updatedUser.last_name || ''}`.trim(),
          phone: updatedUser.phone || '',
          university: updatedUser.university || '',
          major: updatedUser.major || '',
          graduation_year: updatedUser.graduation_year || '',
          skills: updatedUser.skills || '',
          experience: updatedUser.experience || '',
          gpa: updatedUser.gpa || '',
          education: updatedUser.education || '',
          location: updatedUser.location || '',
          bio: updatedUser.bio || '',
          date_of_birth: updatedUser.date_of_birth || '',
          linkedin_url: updatedUser.linkedin_url || '',
          github_url: updatedUser.github_url || '',
          portfolio_url: updatedUser.portfolio_url || ''
        });
        
        // Notify parent component to update user data
        if (onProfileUpdate) {
          onProfileUpdate(updatedUser);
        }
      }
    } catch (error) {
      console.error('Error fetching updated profile:', error);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/students/profile`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileForm)
      });

      if (response.ok) {
        setShowProfileModal(false);
        // Fetch updated profile data to refresh the UI
        await fetchUpdatedProfile();
        alert('Profile updated successfully!');
      } else {
        const error = await response.json();
        alert(error.message || 'Update failed');
      }
    } catch (error) {
      alert('Error updating profile');
    }
  };

  const handleResumeUpload = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('resume', resumeForm.resume_file);

      const response = await fetch(`${API_BASE_URL}/auth/students/resume`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        setShowResumeModal(false);
        setResumeForm({ resume_file: null });
        alert('Resume uploaded successfully!');
      } else {
        const error = await response.json();
        alert(error.message || 'Upload failed');
      }
    } catch (error) {
      alert('Error uploading resume');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Applied': return 'primary';
      case 'Shortlisted': return 'warning';
      case 'Hired': return 'success';
      case 'Rejected': return 'danger';
      case 'Withdrawn': return 'secondary';
      default: return 'secondary';
    }
  };

  const getLocationIcon = (location) => {
    return location === 'Remote' ? <i className="fas fa-filter me-2"></i> : <i className="fas fa-search me-2"></i>;
  };

  const getApplicationStatus = (internshipId) => {
    const application = applications.find(app => app.internship_id === internshipId);
    return application ? application.status : null;
  };

  const getTypeColor = (type) => {
    const colors = {
      'full-time': 'success',
      'part-time': 'info',
      'remote': 'warning',
      'hybrid': 'primary'
    };
    return colors[type] || 'secondary';
  };

  // Filter functions
  const filteredInternships = internships.filter(internship => {
    const matchesSearch = internship.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         internship.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         internship.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || internship.type === typeFilter;
    const matchesLocation = locationFilter === 'all' || internship.location === locationFilter;
    const isApplied = applications.some(app => app.internship_id === internship.id);
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'applied' && isApplied) ||
                         (statusFilter === 'not-applied' && !isApplied);
    return matchesSearch && matchesType && matchesLocation && matchesStatus;
  });

  const filteredApplications = applications.filter(application => {
    const matchesSearch = application.internship_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         application.company_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = applicationStatusFilter === 'all' || application.status === applicationStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = getStats();

  const renderOverview = () => (
    <div>
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center h-100 border-0 shadow-sm" style={{
            borderRadius: '12px',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
          }}>
            <Card.Body className="p-4">
              <i className="fas fa-user text-primary mb-3" style={{ fontSize: '2.5rem' }}></i>
              <h4 className="fw-bold mb-2" style={{ color: '#2c3e50' }}>{applications.length}</h4>
              <p className="text-muted mb-0 fw-medium">Total Applications</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100 border-0 shadow-sm" style={{
            borderRadius: '12px',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
          }}>
            <Card.Body className="p-4">
              <i className="fas fa-briefcase text-success mb-3" style={{ fontSize: '2.5rem' }}></i>
              <h4 className="fw-bold mb-2" style={{ color: '#2c3e50' }}>{internships.length}</h4>
              <p className="text-muted mb-0 fw-medium">Available Internships</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100 border-0 shadow-sm" style={{
            borderRadius: '12px',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
          }}>
            <Card.Body className="p-4">
              <i className="fas fa-file-alt text-warning mb-3" style={{ fontSize: '2.5rem' }}></i>
              <h4 className="fw-bold mb-2" style={{ color: '#2c3e50' }}>{applications.filter(app => app.status === 'Applied').length}</h4>
              <p className="text-muted mb-0 fw-medium">Pending Review</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100 border-0 shadow-sm" style={{
            borderRadius: '12px',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
          }}>
            <Card.Body className="p-4">
              <i className="fas fa-chart-line text-info mb-3" style={{ fontSize: '2.5rem' }}></i>
              <h4 className="fw-bold mb-2" style={{ color: '#2c3e50' }}>{applications.filter(app => app.status === 'Hired').length}</h4>
              <p className="text-muted mb-0 fw-medium">Hired Positions</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card className="border-0 shadow-sm" style={{ borderRadius: '12px' }}>
            <Card.Header className="bg-primary text-white" style={{ 
              borderRadius: '12px 12px 0 0',
              backgroundColor: '#33A1E0 !important',
              borderColor: '#33A1E0'
            }}>
              <h5 className="mb-0 fw-bold">
                <i className="fas fa-clock me-2"></i>
                Recent Applications
              </h5>
            </Card.Header>
            <Card.Body className="p-4">
              {applications.length === 0 ? (
                <div className="text-center py-4">
                  <i className="fas fa-inbox" style={{ fontSize: '2rem', color: '#dee2e6' }}></i>
                  <p className="text-muted mt-3 mb-0">No applications yet. Start applying to internships!</p>
                </div>
              ) : (
                <div>
                  {applications.slice(0, 5).map(application => (
                    <div key={application.id} className="d-flex justify-content-between align-items-center py-3 border-bottom">
                      <div>
                        <h6 className="mb-1 fw-bold" style={{ color: '#2c3e50' }}>{application.title}</h6>
                        <small className="text-muted d-flex align-items-center">
                          <i className="fas fa-building me-1" style={{ color: '#33A1E0' }}></i>
                          {application.company_name}
                        </small>
                      </div>
                      <Badge 
                        bg={getStatusColor(application.status)}
                        style={{
                          padding: '0.5rem 1rem',
                          borderRadius: '20px',
                          fontSize: '0.8rem',
                          fontWeight: '600'
                        }}
                      >
                        {application.status}
                      </Badge>
                    </div>
                  ))}
                  {applications.length > 5 && (
                    <div className="text-center mt-4">
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        onClick={() => setActiveTab('applications')}
                        style={{
                          borderRadius: '8px',
                          padding: '0.5rem 1.5rem',
                          borderColor: '#33A1E0',
                          color: '#33A1E0'
                        }}
                      >
                        <i className="fas fa-eye me-2"></i>
                        View All Applications
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );

  const renderInternships = () => (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="mb-0 fw-bold" style={{ color: '#33A1E0' }}>
          <i className="fas fa-briefcase me-2"></i>
          Available Internships ({internships.length})
        </h5>
        <div className="d-flex gap-2">
          <Form.Control
            type="text"
            placeholder="Search internships..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="shadow-sm"
            style={{
              borderRadius: '8px',
              border: '2px solid #e9ecef',
              padding: '0.5rem 1rem',
              fontSize: '0.9rem'
            }}
          />
          <Form.Select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="shadow-sm"
            style={{
              borderRadius: '8px',
              border: '2px solid #e9ecef',
              padding: '0.5rem 1rem',
              fontSize: '0.9rem'
            }}
          >
            <option value="all">All Types</option>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
          </Form.Select>
          <Form.Select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="shadow-sm"
            style={{
              borderRadius: '8px',
              border: '2px solid #e9ecef',
              padding: '0.5rem 1rem',
              fontSize: '0.9rem'
            }}
          >
            <option value="all">All Locations</option>
            <option value="Remote">Remote</option>
            <option value="New York">New York</option>
            <option value="Boston">Boston</option>
            <option value="Austin">Austin</option>
            <option value="JAM'A STREET">JAM'A STREET</option>
          </Form.Select>
        </div>
      </div>

      {internships.length === 0 ? (
        <div className="text-center py-5">
          <i className="fas fa-search" style={{ fontSize: '3rem', color: '#dee2e6' }}></i>
          <p className="text-muted mt-3">No internships found matching your criteria.</p>
        </div>
      ) : (
        <Row>
          {internships.map(internship => (
            <Col key={internship.id} lg={6} xl={4} className="mb-4">
              <Card className="h-100 border-0 shadow-sm" style={{
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                borderRadius: '12px'
              }}>
                <Card.Body className="p-4">
                  {/* Header with title and type badge */}
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h6 className="card-title mb-0 fw-bold" style={{ 
                      color: '#2c3e50',
                      fontSize: '1.1rem',
                      lineHeight: '1.3'
                    }}>
                      {internship.title}
                    </h6>
                    <Badge 
                      bg={getTypeColor(internship.type)} 
                      className="ms-2 px-3 py-2"
                      style={{ 
                        fontSize: '0.75rem',
                        borderRadius: '20px',
                        fontWeight: '600'
                      }}
                    >
                      {internship.type?.toUpperCase()}
                    </Badge>
                  </div>
                  
                  {/* Company info */}
                  <div className="company-info mb-3">
                    <h6 className="text-muted mb-0 d-flex align-items-center" style={{ fontSize: '0.9rem' }}>
                      <i className="fas fa-building me-2" style={{ color: '#33A1E0' }}></i>
                      {internship.company_name || 'Company Name'}
                    </h6>
                  </div>
                  
                  {/* Description */}
                  <p className="card-text text-muted mb-3" style={{ 
                    fontSize: '0.9rem',
                    lineHeight: '1.5',
                    minHeight: '3rem'
                  }}>
                    {internship.description && internship.description.length > 80 
                      ? `${internship.description.substring(0, 80)}...`
                      : internship.description || 'No description available'
                    }
                  </p>
                  
                  {/* Details badges */}
                  <div className="internship-details mb-4">
                    <div className="d-flex flex-wrap gap-2 mb-2">
                      <Badge 
                        bg="light" 
                        className="text-dark border"
                        style={{ 
                          fontSize: '0.75rem',
                          padding: '0.5rem 0.75rem',
                          borderRadius: '20px'
                        }}
                      >
                        <i className="fas fa-map-marker-alt me-1" style={{ color: '#33A1E0' }}></i>
                        {internship.location}
                      </Badge>
                      <Badge 
                        bg="warning" 
                        className="text-dark"
                        style={{ 
                          fontSize: '0.75rem',
                          padding: '0.5rem 0.75rem',
                          borderRadius: '20px'
                        }}
                      >
                        <i className="fas fa-clock me-1"></i>
                        {internship.duration || '3-6 months'}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Footer with deadline and actions */}
                  <div className="mt-auto">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <small className="text-muted d-flex align-items-center" style={{ fontSize: '0.8rem' }}>
                        <i className="fas fa-calendar-alt me-1" style={{ color: '#33A1E0' }}></i>
                        Deadline: {new Date(internship.deadline).toLocaleDateString()}
                      </small>
                    </div>
                    
                    {/* Action buttons */}
                    <div className="d-flex gap-2 flex-wrap">
                      <Button 
                        variant="outline-secondary" 
                        size="sm"
                        onClick={() => handleViewInternship(internship)}
                        className="flex-fill"
                        style={{
                          borderRadius: '8px',
                          fontSize: '0.85rem',
                          padding: '0.5rem 1rem',
                          borderWidth: '2px'
                        }}
                      >
                        <i className="fas fa-eye me-1"></i>
                        View
                      </Button>
                      
                      {getApplicationStatus(internship.id) ? (
                        <Badge 
                          bg="info" 
                          className="flex-fill d-flex align-items-center justify-content-center"
                          style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '8px',
                            fontSize: '0.85rem'
                          }}
                        >
                          <i className="fas fa-check me-1"></i>
                          Applied
                        </Badge>
                      ) : (
                        <Button 
                          variant="primary" 
                          size="sm"
                          onClick={() => handleApply(internship.id)}
                          className="flex-fill"
                          style={{
                            borderRadius: '8px',
                            fontSize: '0.85rem',
                            padding: '0.5rem 1rem',
                            backgroundColor: '#33A1E0',
                            borderColor: '#33A1E0'
                          }}
                        >
                          <i className="fas fa-paper-plane me-1"></i>
                          Apply
                        </Button>
                      )}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );

  const renderApplications = () => (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="mb-0 fw-bold" style={{ color: '#33A1E0' }}>
          <i className="fas fa-file-alt me-2"></i>
          My Applications ({applications.length})
        </h5>
        <Button 
          variant="outline-primary" 
          size="sm"
          onClick={fetchStudentData}
          style={{
            borderRadius: '8px',
            padding: '0.5rem 1rem',
            borderColor: '#33A1E0',
            color: '#33A1E0'
          }}
        >
          <i className="fas fa-sync-alt me-2"></i>
          Refresh
        </Button>
      </div>
      
      {applications.length === 0 ? (
        <div className="text-center py-5">
          <i className="fas fa-inbox" style={{ fontSize: '3rem', color: '#dee2e6' }}></i>
          <p className="text-muted mt-3">You haven't applied to any internships yet.</p>
          <div className="mt-3">
            <Button 
              variant="primary"
              onClick={() => setActiveTab('internships')}
              className="me-2"
              style={{
                borderRadius: '8px',
                padding: '0.75rem 2rem',
                backgroundColor: '#33A1E0',
                borderColor: '#33A1E0'
              }}
            >
              <i className="fas fa-search me-2"></i>
              Browse Internships
            </Button>
            <Button 
              variant="outline-secondary"
              onClick={fetchStudentData}
              style={{
                borderRadius: '8px',
                padding: '0.75rem 2rem'
              }}
            >
              <i className="fas fa-sync-alt me-2"></i>
              Check for Applications
            </Button>
          </div>
        </div>
      ) : (
        <div>
          {applications.map(application => (
            <Card key={application.id} className="mb-3 border-0 shadow-sm" style={{
              borderRadius: '12px',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}>
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-start">
                  <div className="flex-grow-1">
                    <h6 className="mb-2 fw-bold" style={{ color: '#2c3e50' }}>{application.internship_title}</h6>
                    <p className="text-muted mb-3 d-flex align-items-center" style={{ fontSize: '0.9rem' }}>
                      <i className="fas fa-building me-2" style={{ color: '#33A1E0' }}></i>
                      {application.company_name}
                    </p>
                    <div className="d-flex gap-2 mb-3 flex-wrap">
                      <Badge 
                        bg="light" 
                        className="text-dark border"
                        style={{ 
                          fontSize: '0.75rem',
                          padding: '0.5rem 0.75rem',
                          borderRadius: '20px'
                        }}
                      >
                        <i className="fas fa-map-marker-alt me-1" style={{ color: '#33A1E0' }}></i>
                        {application.location}
                      </Badge>
                      <Badge 
                        bg={getTypeColor(application.type)}
                        style={{ 
                          fontSize: '0.75rem',
                          padding: '0.5rem 0.75rem',
                          borderRadius: '20px'
                        }}
                      >
                        {application.type}
                      </Badge>
                    </div>
                    
                    {/* Company Message Section */}
                    {application.company_message && (
                      <div className={`alert ${application.message_type === 'hired' ? 'alert-success' : 'alert-danger'} mb-3`} style={{
                        fontSize: '0.9rem',
                        padding: '0.75rem 1rem',
                        borderRadius: '8px',
                        border: `2px solid ${application.message_type === 'hired' ? '#d4edda' : '#f8d7da'}`
                      }}>
                        <div className="d-flex align-items-center mb-2">
                          <i className={`fas ${application.message_type === 'hired' ? 'fa-check-circle' : 'fa-times-circle'} me-2`}></i>
                          <strong>{application.message_type === 'hired' ? 'Congratulations!' : 'Update on Your Application'}</strong>
                        </div>
                        <div className="mb-2">
                          {application.company_message}
                        </div>
                        {application.company_contact_email && (
                          <div className="mt-2">
                            <small className="text-dark">
                              <i className="fas fa-envelope me-1"></i>
                              <strong>Contact:</strong> {application.company_contact_email}
                            </small>
                          </div>
                        )}
                        <small className="text-muted d-block mt-1">
                          Message sent on: {new Date(application.message_date).toLocaleDateString()}
                        </small>
                      </div>
                    )}
                    
                    <small className="text-muted d-flex align-items-center" style={{ fontSize: '0.8rem' }}>
                      <i className="fas fa-calendar me-1" style={{ color: '#33A1E0' }}></i>
                      Applied on: {new Date(application.applied_date || application.created_at).toLocaleDateString()}
                    </small>
                  </div>
                  <div className="text-end ms-3">
                    <Badge 
                      bg={getStatusColor(application.status)} 
                      className="mb-3 d-block"
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: '600'
                      }}
                    >
                      {application.status}
                    </Badge>
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={() => {
                        setSelectedApplication(application);
                        setShowApplicationModal(true);
                      }}
                      style={{
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        padding: '0.5rem 1rem',
                        borderWidth: '2px',
                        borderColor: '#33A1E0',
                        color: '#33A1E0'
                      }}
                    >
                      <i className="fas fa-eye me-1"></i>
                      View Details
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  const renderProfile = () => (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="mb-0 fw-bold" style={{ color: '#33A1E0' }}>
          <i className="fas fa-user-edit me-2"></i>
          My Profile
        </h5>
        <Button 
          variant="primary" 
          onClick={() => setShowProfileModal(true)}
          style={{
            borderRadius: '8px',
            padding: '0.5rem 1rem',
            backgroundColor: '#33A1E0',
            borderColor: '#33A1E0'
          }}
        >
          <i className="fas fa-edit me-2"></i>
          Edit Profile
        </Button>
      </div>

      <Row>
        <Col lg={8}>
          <Card className="border-0 shadow-sm mb-4" style={{ borderRadius: '12px' }}>
            <Card.Header className="bg-primary text-white" style={{ 
              borderRadius: '12px 12px 0 0',
              backgroundColor: '#33A1E0 !important',
              borderColor: '#33A1E0'
            }}>
              <h6 className="mb-0 fw-bold">
                <i className="fas fa-info-circle me-2"></i>
                Personal Information
              </h6>
            </Card.Header>
            <Card.Body className="p-4">
              <Row>
                <Col md={6} className="mb-3">
                  <div className="mb-2">
                    <strong>Full Name:</strong>
                    <div className="text-muted">{user?.name || 'Not provided'}</div>
                  </div>
                </Col>
                <Col md={6} className="mb-3">
                  <div className="mb-2">
                    <strong>Email:</strong>
                    <div className="text-muted">{user?.email || 'Not provided'}</div>
                  </div>
                </Col>
                <Col md={6} className="mb-3">
                  <div className="mb-2">
                    <strong>Phone:</strong>
                    <div className="text-muted">{user?.phone || 'Not provided'}</div>
                  </div>
                </Col>
                <Col md={6} className="mb-3">
                  <div className="mb-2">
                    <strong>Location:</strong>
                    <div className="text-muted">{user?.location || 'Not provided'}</div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card className="border-0 shadow-sm mb-4" style={{ borderRadius: '12px' }}>
            <Card.Header className="bg-success text-white" style={{ 
              borderRadius: '12px 12px 0 0'
            }}>
              <h6 className="mb-0 fw-bold">
                <i className="fas fa-graduation-cap me-2"></i>
                Education
              </h6>
            </Card.Header>
            <Card.Body className="p-4">
              <Row>
                <Col md={6} className="mb-3">
                  <div className="mb-2">
                    <strong>University:</strong>
                    <div className="text-muted">{user?.university || 'Not provided'}</div>
                  </div>
                </Col>
                <Col md={6} className="mb-3">
                  <div className="mb-2">
                    <strong>Major:</strong>
                    <div className="text-muted">{user?.major || 'Not provided'}</div>
                  </div>
                </Col>
                <Col md={6} className="mb-3">
                  <div className="mb-2">
                    <strong>Graduation Year:</strong>
                    <div className="text-muted">{user?.graduation_year || 'Not provided'}</div>
                  </div>
                </Col>
                <Col md={6} className="mb-3">
                  <div className="mb-2">
                    <strong>GPA:</strong>
                    <div className="text-muted">{user?.gpa || 'Not provided'}</div>
                  </div>
                </Col>
                {user?.education && (
                  <Col md={12} className="mb-3">
                    <div className="mb-2">
                      <strong>Additional Education:</strong>
                      <div className="text-muted">{user.education}</div>
                    </div>
                  </Col>
                )}
              </Row>
            </Card.Body>
          </Card>

          <Card className="border-0 shadow-sm" style={{ borderRadius: '12px' }}>
            <Card.Header className="bg-info text-white" style={{ 
              borderRadius: '12px 12px 0 0'
            }}>
              <h6 className="mb-0 fw-bold">
                <i className="fas fa-code me-2"></i>
                Skills & Experience
              </h6>
            </Card.Header>
            <Card.Body className="p-4">
              <div className="mb-3">
                <strong>Skills:</strong>
                <div className="text-muted mt-1">{user?.skills || 'No skills listed'}</div>
              </div>
              <div className="mb-3">
                <strong>Experience:</strong>
                <div className="text-muted mt-1">{user?.experience || 'No experience listed'}</div>
              </div>
              {user?.bio && (
                <div className="mb-3">
                  <strong>Bio:</strong>
                  <div className="text-muted mt-1">{user.bio}</div>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="border-0 shadow-sm mb-4" style={{ borderRadius: '12px' }}>
            <Card.Header className="bg-warning text-dark" style={{ 
              borderRadius: '12px 12px 0 0'
            }}>
              <h6 className="mb-0 fw-bold">
                <i className="fas fa-link me-2"></i>
                Links & Portfolio
              </h6>
            </Card.Header>
            <Card.Body className="p-4">
              <div className="mb-3">
                <strong>LinkedIn:</strong>
                {user?.linkedin_url ? (
                  <div>
                    <a href={user.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-primary">
                      View Profile
                    </a>
                  </div>
                ) : (
                  <div className="text-muted">Not provided</div>
                )}
              </div>
              <div className="mb-3">
                <strong>GitHub:</strong>
                {user?.github_url ? (
                  <div>
                    <a href={user.github_url} target="_blank" rel="noopener noreferrer" className="text-primary">
                      View Profile
                    </a>
                  </div>
                ) : (
                  <div className="text-muted">Not provided</div>
                )}
              </div>
              <div className="mb-3">
                <strong>Portfolio:</strong>
                {user?.portfolio_url ? (
                  <div>
                    <a href={user.portfolio_url} target="_blank" rel="noopener noreferrer" className="text-primary">
                      View Portfolio
                    </a>
                  </div>
                ) : (
                  <div className="text-muted">Not provided</div>
                )}
              </div>
            </Card.Body>
          </Card>


        </Col>
      </Row>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'internships':
        return renderInternships();
      case 'applications':
        return renderApplications();
      case 'profile':
        return renderProfile();
      default:
        return renderOverview();
    }
  };

  if (loading) {
    return (
      <Container className="mt-5 pt-4">
        <div className="loading-container">
          <Spinner animation="border" variant="primary" size="lg" />
          <p className="mt-3 text-muted">Loading your dashboard...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5 pt-4">
        <div className="error-container">
          <i className="fas fa-exclamation-triangle text-danger mb-3" style={{fontSize: '3rem'}}></i>
          <h4 className="text-danger">Error Loading Dashboard</h4>
          <p className="text-muted">{error}</p>
          <Button variant="outline-danger" onClick={fetchStudentData} className="mt-3">
            <i className="fas fa-redo me-2"></i>
            Try Again
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-5 pt-4">
      <div className="student-header">
        <div className="d-flex align-items-center mb-3">
          <div className="avatar-placeholder me-3">
            <i className="fas fa-user-graduate"></i>
          </div>
          <div>
            <h2>Student Dashboard</h2>
            <p className="text-muted mb-0">Welcome back, {user?.name || 'Student'}! Find your dream internship and track your applications.</p>
          </div>
        </div>
      </div>

      {/* Enhanced Navigation Tabs */}
      <div className="student-tabs mb-4">
        <Nav variant="pills" className="nav-pills-custom">
          <Nav.Item>
            <Nav.Link 
              active={activeTab === 'overview'}
              onClick={() => setActiveTab('overview')}
              className="nav-link-custom"
            >
              <i className="fas fa-chart-line me-2"></i>
              Overview
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link 
              active={activeTab === 'internships'}
              onClick={() => setActiveTab('internships')}
              className="nav-link-custom"
            >
              <i className="fas fa-briefcase me-2"></i>
              Browse Internships
              {stats.availableInternships > 0 && (
                <Badge bg="success" className="ms-2">
                  {stats.availableInternships}
                </Badge>
              )}
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link 
              active={activeTab === 'applications'}
              onClick={() => setActiveTab('applications')}
              className="nav-link-custom"
            >
              <i className="fas fa-file-alt me-2"></i>
              My Applications
              {stats.totalApplications > 0 && (
                <Badge bg="info" className="ms-2">
                  {stats.totalApplications}
                </Badge>
              )}
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link 
              active={activeTab === 'profile'}
              onClick={() => setActiveTab('profile')}
              className="nav-link-custom"
            >
              <i className="fas fa-user me-2"></i>
              Profile
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </div>

      {renderContent()}

      {/* Profile Modal */}
      <Modal show={showProfileModal} onHide={() => setShowProfileModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-user-edit me-2"></i>
            Edit Student Profile
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleProfileSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name *</Form.Label>
                  <Form.Control
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                    required
                    placeholder="e.g., John Doe"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>GPA</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    min="0"
                    max="4.0"
                    value={profileForm.gpa}
                    onChange={(e) => setProfileForm({...profileForm, gpa: e.target.value})}
                    placeholder="e.g., 3.75"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                    placeholder="e.g., +1 (555) 123-4567"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    value={profileForm.location}
                    onChange={(e) => setProfileForm({...profileForm, location: e.target.value})}
                    placeholder="e.g., New York, NY"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>University *</Form.Label>
                  <Form.Control
                    type="text"
                    value={profileForm.university}
                    onChange={(e) => setProfileForm({...profileForm, university: e.target.value})}
                    required
                    placeholder="e.g., University of Technology"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Date of Birth</Form.Label>
                  <Form.Control
                    type="date"
                    value={profileForm.date_of_birth}
                    onChange={(e) => setProfileForm({...profileForm, date_of_birth: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Major *</Form.Label>
                  <Form.Control
                    type="text"
                    value={profileForm.major}
                    onChange={(e) => setProfileForm({...profileForm, major: e.target.value})}
                    required
                    placeholder="e.g., Computer Science"
                  />
                </Form.Group>
              </Col>
                             <Col md={6}>
                 <Form.Group className="mb-3">
                   <Form.Label>Graduation Year</Form.Label>
                   <Form.Control
                     type="number"
                     value={profileForm.graduation_year}
                     onChange={(e) => setProfileForm({...profileForm, graduation_year: e.target.value})}
                     placeholder="e.g., 2024"
                     min="2020"
                     max="2030"
                   />
                 </Form.Group>
               </Col>
              
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Skills</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={profileForm.skills}
                onChange={(e) => setProfileForm({...profileForm, skills: e.target.value})}
                placeholder="List your technical and soft skills (e.g., JavaScript, React, Leadership, Communication)"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Experience</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={profileForm.experience}
                onChange={(e) => setProfileForm({...profileForm, experience: e.target.value})}
                placeholder="Describe your relevant work experience, projects, and achievements..."
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Bio</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={profileForm.bio}
                onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})}
                placeholder="Tell us about yourself, your goals, and what makes you unique..."
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Additional Education</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={profileForm.education}
                onChange={(e) => setProfileForm({...profileForm, education: e.target.value})}
                placeholder="Certifications, courses, workshops, etc."
              />
            </Form.Group>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>LinkedIn URL</Form.Label>
                  <Form.Control
                    type="url"
                    value={profileForm.linkedin_url}
                    onChange={(e) => setProfileForm({...profileForm, linkedin_url: e.target.value})}
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>GitHub URL</Form.Label>
                  <Form.Control
                    type="url"
                    value={profileForm.github_url}
                    onChange={(e) => setProfileForm({...profileForm, github_url: e.target.value})}
                    placeholder="https://github.com/yourusername"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Portfolio URL</Form.Label>
                  <Form.Control
                    type="url"
                    value={profileForm.portfolio_url}
                    onChange={(e) => setProfileForm({...profileForm, portfolio_url: e.target.value})}
                    placeholder="https://yourportfolio.com"
                  />
                </Form.Group>
              </Col>
            </Row>
            
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowProfileModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Update Profile
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Application/Internship Detail Modal */}
      <Modal 
        show={showApplicationModal} 
        onHide={() => {
          setShowApplicationModal(false);
          setSelectedApplication(null);
          setSelectedInternship(null);
        }} 
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-eye me-2"></i>
            {selectedApplication ? 'Application Details' : 'Internship Details'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedApplication ? (
            <div>
              <Row>
                <Col md={6}>
                  <h6 className="text-primary">Application Information</h6>
                  <div className="mb-3">
                    <strong>Position:</strong> {selectedApplication.internship_title}
                  </div>
                  <div className="mb-3">
                    <strong>Company:</strong> {selectedApplication.company_name}
                  </div>
                  <div className="mb-3">
                    <strong>Applied Date:</strong> {selectedApplication.applied_date ? new Date(selectedApplication.applied_date).toLocaleDateString() : 'N/A'}
                  </div>
                  <div className="mb-3">
                    <strong>Status:</strong> 
                    <Badge bg={getStatusColor(selectedApplication.status)} className="ms-2">
                      {selectedApplication.status}
                    </Badge>
                  </div>
                </Col>
                <Col md={6}>
                  <h6 className="text-primary">Internship Details</h6>
                  <div className="mb-3">
                    <strong>Location:</strong> {selectedApplication.location || 'N/A'}
                  </div>
                  <div className="mb-3">
                    <strong>Type:</strong> {selectedApplication.type || 'N/A'}
                  </div>
                  <div className="mb-3">
                    <strong>Deadline:</strong> {selectedApplication.deadline ? new Date(selectedApplication.deadline).toLocaleDateString() : 'N/A'}
                  </div>
                </Col>
              </Row>
              <hr />
              
              {/* Company Message Section */}
              {selectedApplication.company_message && (
                <>
                  <Row>
                    <Col>
                      <h6 className="text-primary">
                        <i className={`fas ${selectedApplication.message_type === 'hired' ? 'fa-check-circle text-success' : 'fa-times-circle text-danger'} me-2`}></i>
                        Company Message
                      </h6>
                      <div className={`alert ${selectedApplication.message_type === 'hired' ? 'alert-success' : 'alert-danger'}`} style={{
                        borderRadius: '8px',
                        border: `2px solid ${selectedApplication.message_type === 'hired' ? '#d4edda' : '#f8d7da'}`
                      }}>
                        <div className="d-flex align-items-center mb-3">
                          <i className={`fas ${selectedApplication.message_type === 'hired' ? 'fa-check-circle' : 'fa-times-circle'} me-2`}></i>
                          <strong>{selectedApplication.message_type === 'hired' ? 'Congratulations!' : 'Update on Your Application'}</strong>
                          <Badge 
                            bg={selectedApplication.message_type === 'hired' ? 'success' : 'danger'}
                            className="ms-auto"
                          >
                            {selectedApplication.message_type === 'hired' ? 'HIRED' : 'REJECTED'}
                          </Badge>
                        </div>
                        <div className="mb-3" style={{ fontSize: '1rem', lineHeight: '1.5' }}>
                          {selectedApplication.company_message}
                        </div>
                        {selectedApplication.company_contact_email && (
                          <div className="mt-3 p-3 bg-white rounded border">
                            <strong className="text-dark">
                              <i className="fas fa-envelope me-2"></i>
                              Contact for Next Steps:
                            </strong>
                            <div className="mt-1">
                              <a href={`mailto:${selectedApplication.company_contact_email}`} className="text-primary">
                                {selectedApplication.company_contact_email}
                              </a>
                            </div>
                          </div>
                        )}
                        <small className="text-muted d-block mt-3">
                          <i className="fas fa-clock me-1"></i>
                          Message sent on: {new Date(selectedApplication.message_date).toLocaleDateString()}
                        </small>
                      </div>
                    </Col>
                  </Row>
                  <hr />
                </>
              )}
              
              <Row>
                <Col>
                  <h6 className="text-primary">Cover Letter</h6>
                  <div className="p-3 bg-light rounded">
                    {selectedApplication.cover_letter || 'No cover letter provided'}
                  </div>
                </Col>
              </Row>
            </div>
          ) : selectedInternship ? (
            <div>
              <Row>
                <Col md={8}>
                  <h4>{selectedInternship.title}</h4>
                  <p className="text-muted mb-3">
                    <i className="fas fa-building me-2"></i>
                    {selectedInternship.company_name}
                  </p>
                </Col>
                <Col md={4} className="text-end">
                  <Badge bg={getTypeColor(selectedInternship.type)} className="mb-2">
                    {selectedInternship.type}
                  </Badge>
                  <br />
                  <Badge bg="secondary">
                    <i className="fas fa-map-marker-alt me-1"></i>
                    {selectedInternship.location}
                  </Badge>
                </Col>
              </Row>
              <hr />
              <Row>
                <Col md={6}>
                  <h6 className="text-primary">Details</h6>
                  <div className="mb-2">
                    <strong>Duration:</strong> {selectedInternship.duration || 'N/A'}
                  </div>
                  <div className="mb-2">
                    <strong>Stipend:</strong> {selectedInternship.stipend ? `$${selectedInternship.stipend}/month` : 'N/A'}
                  </div>
                  <div className="mb-2">
                    <strong>Deadline:</strong> {selectedInternship.deadline ? new Date(selectedInternship.deadline).toLocaleDateString() : 'N/A'}
                  </div>
                </Col>
                <Col md={6}>
                  <h6 className="text-primary">Requirements</h6>
                  <div className="mb-2">
                    {selectedInternship.requirements || 'No specific requirements listed'}
                  </div>
                </Col>
              </Row>
              <hr />
              <Row>
                <Col>
                  <h6 className="text-primary">Description</h6>
                  <p>{selectedInternship.description}</p>
                </Col>
              </Row>
              {selectedInternship.responsibilities && (
                <>
                  <hr />
                  <Row>
                    <Col>
                      <h6 className="text-primary">Responsibilities</h6>
                      <p>{selectedInternship.responsibilities}</p>
                    </Col>
                  </Row>
                </>
              )}
              <hr />
              <Row>
                <Col className="text-center">
                  {applications.some(app => app.internship_id === selectedInternship.id) ? (
                    <Badge bg="success" className="fs-6">
                      Already Applied
                    </Badge>
                  ) : (
                    <Button 
                      variant="success" 
                      size="lg"
                      onClick={() => {
                        handleApply(selectedInternship.id);
                        setShowApplicationModal(false);
                      }}
                    >
                      <i className="fas fa-file-alt me-2"></i>
                      Apply Now
                    </Button>
                  )}
                </Col>
              </Row>
            </div>
          ) : null}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowApplicationModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Resume Upload Modal */}
      <Modal show={showResumeModal} onHide={() => setShowResumeModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-upload me-2"></i>
            Upload Resume
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleResumeUpload}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Resume File *</Form.Label>
              <Form.Control
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setResumeForm({...resumeForm, resume_file: e.target.files[0]})}
                required
              />
              <Form.Text className="text-muted">
                Accepted formats: PDF, DOC, DOCX (Max size: 5MB)
              </Form.Text>
            </Form.Group>
            <Alert variant="info">
              <Alert.Heading>Tips for a great resume:</Alert.Heading>
              <ul className="mb-0">
                <li>Keep it concise and well-formatted</li>
                <li>Highlight relevant skills and experience</li>
                <li>Include your education and achievements</li>
                <li>Proofread for any errors</li>
              </ul>
            </Alert>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowResumeModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Upload Resume
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}

export default StudentDashboard;
