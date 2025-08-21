import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Modal, Form, Badge, Alert, Spinner, Nav, Tab, ProgressBar, Dropdown } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaEye, FaBuilding, FaBriefcase, FaFileAlt, FaChartLine, FaUsers, FaUserEdit, FaCheck, FaTimes, FaClock, FaChartBar, FaFilter, FaSearch, FaEyeSlash, FaEye as FaEyeOpen, FaCalendarAlt, FaMapMarkerAlt, FaMoneyBillWave, FaGraduationCap, FaHeart, FaBookmark, FaDownload, FaUpload } from 'react-icons/fa';

const API_BASE_URL = 'http://localhost:5000/api';

function StudentDashboard({ user, onNavigate }) {
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
    experience: ''
  });

  const [resumeForm, setResumeForm] = useState({
    resume_file: null
  });

  useEffect(() => {
    fetchStudentData();
    if (user) {
      setProfileForm({
        name: user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim(),
        phone: user.phone || '',
        university: user.university || '',
        major: user.major || '',
        graduation_year: user.graduation_year || '',
        skills: user.skills || '',
        experience: user.experience || ''
      });
    }
  }, [user]);

  // Debug modal state
  useEffect(() => {
    console.log('Modal state changed:', { showApplicationModal, selectedApplication, selectedInternship });
  }, [showApplicationModal, selectedApplication, selectedInternship]);

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
        fetch(`${API_BASE_URL}/applications/student`, { 
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
      ]);

      if (internshipsRes.ok) {
        const internshipsData = await internshipsRes.json();
        setInternships(internshipsData);
      }

      if (applicationsRes.ok) {
        const applicationsData = await applicationsRes.json();
        setApplications(applicationsData);
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
        fetchStudentData();
        alert('Application submitted successfully!');
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to submit application');
      }
    } catch (error) {
      alert('Error submitting application');
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/auth/students/profile`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileForm)
      });

      if (response.ok) {
        setShowProfileModal(false);
        fetchStudentData();
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

  const getTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'full-time': return 'success';
      case 'part-time': return 'info';
      case 'remote': return 'warning';
      case 'hybrid': return 'primary';
      default: return 'secondary';
    }
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
      {/* Enhanced Statistics Cards */}
      <Row className="mb-4 stats-overview">
        <Col md={3}>
          <Card className="text-center h-100 dashboard-stat-card">
            <Card.Body>
              <i className="fas fa-file-alt dashboard-stat-icon text-primary mb-3"></i>
              <h3>{stats.totalApplications}</h3>
              <p className="text-muted mb-0">Total Applications</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100 dashboard-stat-card">
            <Card.Body>
              <i className="fas fa-briefcase dashboard-stat-icon text-success mb-3"></i>
              <h3>{stats.availableInternships}</h3>
              <p className="text-muted mb-0">Available Internships</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100 dashboard-stat-card">
            <Card.Body>
              <i className="fas fa-check dashboard-stat-icon text-warning mb-3"></i>
              <h3>{stats.applicationStats.shortlisted}</h3>
              <p className="text-muted mb-0">Shortlisted</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100 dashboard-stat-card">
            <Card.Body>
              <i className="fas fa-users dashboard-stat-icon text-info mb-3"></i>
              <h3>{stats.applicationStats.hired}</h3>
              <p className="text-muted mb-0">Hired</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Application Status Chart */}
      <Row className="mb-4 charts-section">
        <Col md={8}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">
                <i className="fas fa-chart-bar me-2"></i>
                Application Status Distribution
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span>Applied</span>
                      <span>{stats.applicationStats.applied}</span>
                    </div>
                    <ProgressBar 
                      variant="primary" 
                      now={stats.totalApplications > 0 ? (stats.applicationStats.applied / stats.totalApplications) * 100 : 0} 
                    />
                  </div>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span>Shortlisted</span>
                      <span>{stats.applicationStats.shortlisted}</span>
                    </div>
                    <ProgressBar 
                      variant="warning" 
                      now={stats.totalApplications > 0 ? (stats.applicationStats.shortlisted / stats.totalApplications) * 100 : 0} 
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span>Hired</span>
                      <span>{stats.applicationStats.hired}</span>
                    </div>
                    <ProgressBar 
                      variant="success" 
                      now={stats.totalApplications > 0 ? (stats.applicationStats.hired / stats.totalApplications) * 100 : 0} 
                    />
                  </div>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span>Rejected</span>
                      <span>{stats.applicationStats.rejected}</span>
                    </div>
                    <ProgressBar 
                      variant="danger" 
                      now={stats.totalApplications > 0 ? (stats.applicationStats.rejected / stats.totalApplications) * 100 : 0} 
                    />
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="recent-activity-card">
            <Card.Header>
              <h5 className="mb-0">
                <i className="fas fa-clock me-2"></i>
                Recent Applications
              </h5>
            </Card.Header>
            <Card.Body>
              {stats.recentApplications.length > 0 ? (
                stats.recentApplications.map(app => (
                  <div key={app.id} className="mb-3 p-2 border rounded">
                    <h6 className="mb-1">{app.internship_title}</h6>
                    <p className="text-muted mb-1 small">{app.company_name}</p>
                    <Badge bg={getStatusColor(app.status)}>{app.status}</Badge>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <i className="fas fa-inbox"></i>
                  <p className="text-muted mb-0">No recent applications</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row>
        <Col>
          <Card className="quick-actions-card">
            <Card.Header>
              <h5 className="mb-0">
                <i className="fas fa-plus me-2"></i>
                Quick Actions
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={3}>
                  <Button 
                    variant="outline-primary" 
                    className="w-100 mb-2"
                    onClick={() => setActiveTab('internships')}
                  >
                    <i className="fas fa-briefcase me-2"></i>
                    Browse Internships
                  </Button>
                </Col>
                <Col md={3}>
                  <Button 
                    variant="outline-info" 
                    className="w-100 mb-2"
                    onClick={() => setActiveTab('applications')}
                  >
                    <i className="fas fa-file-alt me-2"></i>
                    My Applications
                  </Button>
                </Col>
                <Col md={3}>
                  <Button 
                    variant="outline-warning" 
                    className="w-100 mb-2"
                    onClick={() => setShowResumeModal(true)}
                  >
                    <i className="fas fa-upload me-2"></i>
                    Upload Resume
                  </Button>
                </Col>
                <Col md={3}>
                  <Button 
                    variant="outline-success" 
                    className="w-100 mb-2"
                    onClick={() => setShowProfileModal(true)}
                  >
                    <i className="fas fa-user-edit me-2"></i>
                    Edit Profile
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );

  const renderInternships = () => (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Available Internships</h4>
        <Button variant="info" onClick={() => setActiveTab('applications')}>
          <FaFileAlt className="me-2" />
          View My Applications
        </Button>
      </div>

      {/* Enhanced Search and Filter */}
      <Card className="search-filter-card">
        <Card.Body>
          <Row>
            <Col md={4}>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-search"></i>
                </span>
                <Form.Control
                  type="text"
                  placeholder="Search internships..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </Col>
            <Col md={2}>
              <Form.Select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
              </Form.Select>
            </Col>
            <Col md={2}>
              <Form.Select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              >
                <option value="all">All Locations</option>
                {Array.from(new Set(internships.map(i => i.location))).map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </Form.Select>
            </Col>
            <Col md={2}>
              <Form.Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="applied">Applied</option>
                <option value="not-applied">Not Applied</option>
              </Form.Select>
            </Col>
            <Col md={2}>
              <Button 
                variant="outline-secondary" 
                onClick={() => {
                  setSearchTerm('');
                  setTypeFilter('all');
                  setLocationFilter('all');
                  setStatusFilter('all');
                }}
              >
                <i className="fas fa-filter me-2"></i>
                Clear
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body className="p-0">
          <Table responsive striped hover className="mb-0">
            <thead>
              <tr>
                <th>Position</th>
                <th>Company</th>
                <th>Location</th>
                <th>Type</th>
                <th>Deadline</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInternships.map(internship => {
                const isApplied = applications.some(app => app.internship_id === internship.id);
                const application = applications.find(app => app.internship_id === internship.id);
                
                return (
                  <tr key={internship.id}>
                    <td>
                      <strong>{internship.title}</strong>
                      <br />
                      <small className="text-muted">{internship.description?.substring(0, 50)}...</small>
                    </td>
                    <td>
                      <i className="fas fa-building me-1 text-muted"></i>
                      {internship.company_name || 'N/A'}
                    </td>
                    <td>
                      <i className="fas fa-map-marker-alt me-1 text-muted"></i>
                      {internship.location || 'N/A'}
                    </td>
                    <td>
                      <Badge bg={getTypeColor(internship.type)}>{internship.type || 'N/A'}</Badge>
                    </td>
                    <td>
                      <i className="fas fa-calendar-alt me-1 text-muted"></i>
                      {internship.deadline ? new Date(internship.deadline).toLocaleDateString() : 'N/A'}
                    </td>
                    <td>
                      {isApplied ? (
                        <Badge bg={getStatusColor(application?.status)}>
                          {application?.status || 'Applied'}
                        </Badge>
                      ) : (
                        <Badge bg="secondary">Not Applied</Badge>
                      )}
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <Button 
                          variant="outline-info" 
                          size="sm"
                          onClick={() => {
                            console.log('View button clicked for internship:', internship);
                            setSelectedInternship(internship);
                            setSelectedApplication(null);
                            setShowApplicationModal(true);
                            console.log('Modal state set to true');
                          }}
                        >
                          <i className="fas fa-eye"></i>
                        </Button>
                        {!isApplied && (
                          <Button 
                            variant="outline-success" 
                            size="sm"
                            onClick={() => handleApply(internship.id)}
                          >
                            Apply
                          </Button>
                        )}
                        <Button 
                          variant="outline-warning" 
                          size="sm"
                        >
                          <i className="fas fa-heart"></i>
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
          {filteredInternships.length === 0 && (
            <div className="empty-state">
              <i className="fas fa-search"></i>
              <p className="text-muted">No internships found matching your criteria.</p>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );

  const renderApplications = () => (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>My Applications</h4>
        <Button variant="info" onClick={() => setActiveTab('internships')}>
          <FaBriefcase className="me-2" />
          Browse More Internships
        </Button>
      </div>

      {/* Enhanced Search and Filter */}
      <Card className="search-filter-card">
        <Card.Body>
          <Row>
            <Col md={6}>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-search"></i>
                </span>
                <Form.Control
                  type="text"
                  placeholder="Search applications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </Col>
            <Col md={3}>
              <Form.Select
                value={applicationStatusFilter}
                onChange={(e) => setApplicationStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="Applied">Applied</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Hired">Hired</option>
                <option value="Rejected">Rejected</option>
                <option value="Withdrawn">Withdrawn</option>
              </Form.Select>
            </Col>
            <Col md={3}>
              <Button 
                variant="outline-secondary" 
                onClick={() => {
                  setSearchTerm('');
                  setApplicationStatusFilter('all');
                }}
              >
                <i className="fas fa-filter me-2"></i>
                Clear Filters
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body className="p-0">
          <Table responsive striped hover className="mb-0">
            <thead>
              <tr>
                <th>Position</th>
                <th>Company</th>
                <th>Applied Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.map(app => (
                <tr key={app.id}>
                  <td>
                    <strong>{app.internship_title}</strong>
                    <br />
                    <small className="text-muted">
                      <i className="fas fa-map-marker-alt me-1"></i>
                      {app.location || 'N/A'}
                    </small>
                  </td>
                  <td>
                    <i className="fas fa-building me-1 text-muted"></i>
                    {app.company_name || 'N/A'}
                  </td>
                  <td>
                    <i className="fas fa-calendar-alt me-1 text-muted"></i>
                    {app.applied_date ? new Date(app.applied_date).toLocaleDateString() : 'N/A'}
                  </td>
                  <td>
                    <Badge bg={getStatusColor(app.status)}>{app.status}</Badge>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button 
                        variant="outline-info" 
                        size="sm"
                        onClick={() => {
                          console.log('View button clicked for application:', app);
                          setSelectedApplication(app);
                          setSelectedInternship(null);
                          setShowApplicationModal(true);
                          console.log('Modal state set to true');
                        }}
                      >
                        <i className="fas fa-eye"></i>
                      </Button>
                      <Button 
                        variant="outline-warning" 
                        size="sm"
                      >
                        <i className="fas fa-download"></i>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {filteredApplications.length === 0 && (
            <div className="empty-state">
              <i className="fas fa-search"></i>
              <p className="text-muted">No applications found matching your criteria.</p>
            </div>
          )}
        </Card.Body>
      </Card>
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
        </Nav>
      </div>

      {renderContent()}

      {/* Profile Modal */}
      <Modal show={showProfileModal} onHide={() => setShowProfileModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <FaUserEdit className="me-2" />
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
          console.log('Modal closing');
          setShowApplicationModal(false);
          setSelectedApplication(null);
          setSelectedInternship(null);
        }} 
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <FaEye className="me-2" />
            {selectedApplication ? 'Application Details' : 'Internship Details'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>Debug: Modal is open, selectedApplication: {selectedApplication ? 'yes' : 'no'}, selectedInternship: {selectedInternship ? 'yes' : 'no'}</div>
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
                    <FaBuilding className="me-2" />
                    {selectedInternship.company_name}
                  </p>
                </Col>
                <Col md={4} className="text-end">
                  <Badge bg={getTypeColor(selectedInternship.type)} className="mb-2">
                    {selectedInternship.type}
                  </Badge>
                  <br />
                  <Badge bg="secondary">
                    <FaMapMarkerAlt className="me-1" />
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
                      <FaFileAlt className="me-2" />
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
            <FaUpload className="me-2" />
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
