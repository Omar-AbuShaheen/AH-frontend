import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Modal, Form, Badge, Alert, Spinner, Nav, Tab, ProgressBar, Dropdown } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaEye, FaBuilding, FaBriefcase, FaFileAlt, FaChartLine, FaUsers, FaUserEdit, FaCheck, FaTimes, FaClock, FaChartBar, FaFilter, FaSearch, FaEyeSlash, FaEye as FaEyeOpen, FaCalendarAlt, FaMapMarkerAlt, FaMoneyBillWave, FaGraduationCap } from 'react-icons/fa';

const API_BASE_URL = 'http://localhost:5000/api';

function CompanyDashboard({ user, onNavigate }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [internships, setInternships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states
  const [showInternshipModal, setShowInternshipModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [editingInternship, setEditingInternship] = useState(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [applicationStatusFilter, setApplicationStatusFilter] = useState('all');
  
  // Form states
  const [internshipForm, setInternshipForm] = useState({
    title: '',
    description: '',
    requirements: '',
    responsibilities: '',
    location: '',
    type: 'Full-time',
    duration: '',
    stipend: '',
    deadline: '',
    is_active: true
  });
  
  const [profileForm, setProfileForm] = useState({
    company_name: '',
    contact_person: '',
    industry: '',
    location: '',
    website: '',
    description: '',
    phone: ''
  });

  useEffect(() => {
    fetchCompanyData();
    if (user) {
      setProfileForm({
        company_name: user.company_name || '',
        contact_person: user.contact_person || '',
        industry: user.industry || '',
        location: user.location || '',
        website: user.website || '',
        description: user.description || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  // Debug modal state
  useEffect(() => {
    console.log('Modal state changed:', { showApplicationModal, selectedApplication });
  }, [showApplicationModal, selectedApplication]);

  const fetchCompanyData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      
      // Fetch company's internships and applications
      const [internshipsRes, applicationsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/internships/company/my-internships`, { 
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }),
        fetch(`${API_BASE_URL}/applications/company`, { 
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
      console.error('Error fetching company data:', error);
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  // Enhanced statistics calculations
  const getStats = () => {
    const totalInternships = internships.length;
    const activeInternships = internships.filter(i => i.is_active && i.is_approved).length;
    const pendingInternships = internships.filter(i => !i.is_approved).length;
    const totalApplications = applications.length;
    
    const applicationStats = {
      applied: applications.filter(app => app.status === 'Applied').length,
      shortlisted: applications.filter(app => app.status === 'Shortlisted').length,
      hired: applications.filter(app => app.status === 'Hired').length,
      rejected: applications.filter(app => app.status === 'Rejected').length
    };

    const recentApplications = applications
      .sort((a, b) => new Date(b.applied_date) - new Date(a.applied_date))
      .slice(0, 5);

    return {
      totalInternships,
      activeInternships,
      pendingInternships,
      totalApplications,
      applicationStats,
      recentApplications
    };
  };

  const handleInternshipSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const url = editingInternship 
        ? `${API_BASE_URL}/internships/${editingInternship.id}`
        : `${API_BASE_URL}/internships`;
      
      const method = editingInternship ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(internshipForm)
      });

      if (response.ok) {
        setShowInternshipModal(false);
        setEditingInternship(null);
        setInternshipForm({
          title: '', description: '', requirements: '', responsibilities: '', 
          location: '', type: 'Full-time', duration: '', stipend: '', 
          deadline: '', is_active: true
        });
        fetchCompanyData();
        alert(editingInternship ? 'Internship updated successfully!' : 'Internship posted successfully!');
      } else {
        const error = await response.json();
        alert(error.message || 'Operation failed');
      }
    } catch (error) {
      alert('Error saving internship');
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/auth/company/profile`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileForm)
      });

      if (response.ok) {
        setShowProfileModal(false);
        fetchCompanyData();
        alert('Company profile updated successfully!');
      } else {
        const error = await response.json();
        alert(error.message || 'Update failed');
      }
    } catch (error) {
      alert('Error updating profile');
    }
  };

  const handleDeleteInternship = async (internshipId) => {
    if (!window.confirm('Are you sure you want to delete this internship? This action cannot be undone.')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/internships/${internshipId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchCompanyData();
        alert('Internship deleted successfully!');
      } else {
        const error = await response.json();
        alert(error.message || 'Delete failed');
      }
    } catch (error) {
      alert('Error deleting internship');
    }
  };

  const handleApplicationStatusUpdate = async (applicationId, status) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/applications/company/${applicationId}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        fetchCompanyData();
        alert('Application status updated successfully!');
      } else {
        const error = await response.json();
        alert(error.message || 'Status update failed');
      }
    } catch (error) {
      alert('Error updating application status');
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
                         internship.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'approved' && internship.is_approved) ||
                         (statusFilter === 'pending' && !internship.is_approved);
    const matchesType = typeFilter === 'all' || internship.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const filteredApplications = applications.filter(application => {
    const matchesSearch = application.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         application.internship_title?.toLowerCase().includes(searchTerm.toLowerCase());
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
              <i className="fas fa-briefcase dashboard-stat-icon text-primary mb-3"></i>
              <h3>{stats.totalInternships}</h3>
              <p className="text-muted mb-0">Total Internships</p>
              {stats.pendingInternships > 0 && (
                <Badge bg="warning" className="mt-2">
                  {stats.pendingInternships} Pending
                </Badge>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100 dashboard-stat-card">
            <Card.Body>
              <i className="fas fa-check dashboard-stat-icon text-success mb-3"></i>
              <h3>{stats.activeInternships}</h3>
              <p className="text-muted mb-0">Active Internships</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100 dashboard-stat-card">
            <Card.Body>
              <i className="fas fa-file-alt dashboard-stat-icon text-info mb-3"></i>
              <h3>{stats.totalApplications}</h3>
              <p className="text-muted mb-0">Total Applications</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100 dashboard-stat-card">
            <Card.Body>
              <i className="fas fa-users dashboard-stat-icon text-warning mb-3"></i>
              <h3>{stats.applicationStats.shortlisted}</h3>
              <p className="text-muted mb-0">Shortlisted</p>
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
                    <h6 className="mb-1">{app.student_name}</h6>
                    <p className="text-muted mb-1 small">{app.internship_title}</p>
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
                    onClick={() => setShowInternshipModal(true)}
                  >
                    <i className="fas fa-briefcase me-2"></i>
                    Post Internship
                  </Button>
                </Col>
                <Col md={3}>
                  <Button 
                    variant="outline-info" 
                    className="w-100 mb-2"
                    onClick={() => setActiveTab('internships')}
                  >
                    <i className="fas fa-edit me-2"></i>
                    Manage Internships
                  </Button>
                </Col>
                <Col md={3}>
                  <Button 
                    variant="outline-warning" 
                    className="w-100 mb-2"
                    onClick={() => setActiveTab('applications')}
                  >
                    <i className="fas fa-file-alt me-2"></i>
                    Review Applications
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
        <h4>Internship Management</h4>
        <Button variant="primary" onClick={() => setShowInternshipModal(true)}>
          <FaPlus className="me-2" />
          Post New Internship
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
            <Col md={3}>
              <Form.Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending Approval</option>
              </Form.Select>
            </Col>
            <Col md={3}>
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
              <Button 
                variant="outline-secondary" 
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setTypeFilter('all');
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
                <th>Title</th>
                <th>Location</th>
                <th>Type</th>
                <th>Status</th>
                <th>Deadline</th>
                <th>Applications</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInternships.map(internship => (
                <tr key={internship.id}>
                  <td>
                    <strong>{internship.title}</strong>
                    <br />
                    <small className="text-muted">{internship.description?.substring(0, 50)}...</small>
                  </td>
                  <td>
                    <i className="fas fa-map-marker-alt me-1 text-muted"></i>
                    {internship.location || 'N/A'}
                  </td>
                  <td>
                    <Badge bg={getTypeColor(internship.type)}>{internship.type || 'N/A'}</Badge>
                  </td>
                  <td>
                    <Badge bg={internship.is_approved ? 'success' : 'warning'}>
                      {internship.is_approved ? 'Approved' : 'Pending Approval'}
                    </Badge>
                  </td>
                  <td>
                    <i className="fas fa-calendar-alt me-1 text-muted"></i>
                    {internship.deadline ? new Date(internship.deadline).toLocaleDateString() : 'N/A'}
                  </td>
                  <td>
                    <Badge bg="info">
                      {applications.filter(app => app.internship_id === internship.id).length}
                    </Badge>
                  </td>
                  <td>
                    <div className="d-flex gap-1">
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => {
                          setEditingInternship(internship);
                          setInternshipForm({
                            title: internship.title || '',
                            description: internship.description || '',
                            requirements: internship.requirements || '',
                            responsibilities: internship.responsibilities || '',
                            location: internship.location || '',
                            type: internship.type || 'Full-time',
                            duration: internship.duration || '',
                            stipend: internship.stipend || '',
                            deadline: internship.deadline || '',
                            is_active: internship.is_active
                          });
                          setShowInternshipModal(true);
                        }}
                      >
                        <i className="fas fa-edit"></i>
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleDeleteInternship(internship.id)}
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
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
        <h4>Application Management</h4>
        <Button variant="info" onClick={() => setShowStatsModal(true)}>
          <FaChartBar className="me-2" />
          View Statistics
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

      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          <Table responsive striped hover className="mb-0">
            <thead>
              <tr>
                <th>Student</th>
                <th>Internship</th>
                <th>Applied Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.map(app => {
                const internship = internships.find(i => i.id === app.internship_id);
                
                return (
                  <tr key={app.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="avatar-placeholder me-3">
                          <i className="fas fa-user-graduate"></i>
                        </div>
                        <div>
                          <strong>{app.student_name || 'Student'}</strong>
                          <br />
                          <small className="text-muted">{app.student_email}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <strong>{internship?.title || 'N/A'}</strong>
                      <br />
                      <small className="text-muted">
                        <i className="fas fa-map-marker-alt me-1"></i>
                        {internship?.location || 'N/A'}
                      </small>
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
                        <Form.Select
                          size="sm"
                          value={app.status}
                          onChange={(e) => handleApplicationStatusUpdate(app.id, e.target.value)}
                          style={{ minWidth: '120px' }}
                        >
                          <option value="Applied">Applied</option>
                          <option value="Shortlisted">Shortlisted</option>
                          <option value="Hired">Hired</option>
                          <option value="Rejected">Rejected</option>
                          <option value="Withdrawn">Withdrawn</option>
                        </Form.Select>
                        <Button 
                          variant="outline-info" 
                          size="sm"
                          onClick={() => {
                            console.log('View button clicked for application:', app);
                            setSelectedApplication(app);
                            setShowApplicationModal(true);
                            console.log('Modal state set to true');
                          }}
                        >
                          <i className="fas fa-eye"></i>
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
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
          <Button variant="outline-danger" onClick={fetchCompanyData} className="mt-3">
            <i className="fas fa-redo me-2"></i>
            Try Again
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-5 pt-4">
      <div className="company-header">
        <div className="d-flex align-items-center mb-3">
          <div className="avatar-placeholder me-3">
            <i className="fas fa-building"></i>
          </div>
          <div>
            <h2>Company Dashboard</h2>
            <p className="text-muted mb-0">Welcome back, {user?.company_name || 'Company'}! Manage your internships and applications.</p>
          </div>
        </div>
      </div>

      {/* Enhanced Navigation Tabs */}
      <div className="company-tabs mb-4">
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
              My Internships
              {stats.pendingInternships > 0 && (
                <Badge bg="warning" className="ms-2">
                  {stats.pendingInternships}
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
              Applications
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

      {/* Internship Modal */}
      <Modal show={showInternshipModal} onHide={() => {
        setShowInternshipModal(false);
        setEditingInternship(null);
        setInternshipForm({
          title: '', description: '', requirements: '', responsibilities: '', 
          location: '', type: 'Full-time', duration: '', stipend: '', 
          deadline: '', is_active: true
        });
      }} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingInternship ? 'Edit Internship' : 'Post New Internship'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleInternshipSubmit}>
          <Modal.Body>
            <Row>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>Title *</Form.Label>
                  <Form.Control
                    type="text"
                    value={internshipForm.title}
                    onChange={(e) => setInternshipForm({...internshipForm, title: e.target.value})}
                    required
                    placeholder="e.g., Software Engineering Intern"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Type</Form.Label>
                  <Form.Select
                    value={internshipForm.type}
                    onChange={(e) => setInternshipForm({...internshipForm, type: e.target.value})}
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    value={internshipForm.location}
                    onChange={(e) => setInternshipForm({...internshipForm, location: e.target.value})}
                    placeholder="e.g., New York, NY or Remote"
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Duration</Form.Label>
                  <Form.Control
                    type="text"
                    value={internshipForm.duration}
                    onChange={(e) => setInternshipForm({...internshipForm, duration: e.target.value})}
                    placeholder="e.g., 3 months"
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Stipend ($/month)</Form.Label>
                  <Form.Control
                    type="number"
                    value={internshipForm.stipend}
                    onChange={(e) => setInternshipForm({...internshipForm, stipend: e.target.value})}
                    placeholder="e.g., 3000"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Deadline *</Form.Label>
                  <Form.Control
                    type="date"
                    value={internshipForm.deadline}
                    onChange={(e) => setInternshipForm({...internshipForm, deadline: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <div className="d-flex align-items-center">
                    <Form.Check
                      type="checkbox"
                      label="Active"
                      checked={internshipForm.is_active}
                      onChange={(e) => setInternshipForm({...internshipForm, is_active: e.target.checked})}
                      className="me-3"
                    />
                    <small className="text-muted">Note: New internships require admin approval</small>
                  </div>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Description *</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={internshipForm.description}
                onChange={(e) => setInternshipForm({...internshipForm, description: e.target.value})}
                required
                placeholder="Provide a detailed description of the internship role and responsibilities..."
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Requirements</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={internshipForm.requirements}
                    onChange={(e) => setInternshipForm({...internshipForm, requirements: e.target.value})}
                    placeholder="List the skills and qualifications required..."
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Responsibilities</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={internshipForm.responsibilities}
                    onChange={(e) => setInternshipForm({...internshipForm, responsibilities: e.target.value})}
                    placeholder="Describe what the intern will be doing..."
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowInternshipModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingInternship ? 'Update' : 'Post'} Internship
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Profile Modal */}
      <Modal show={showProfileModal} onHide={() => setShowProfileModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <FaUserEdit className="me-2" />
            Edit Company Profile
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleProfileSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Company Name *</Form.Label>
                  <Form.Control
                    type="text"
                    value={profileForm.company_name}
                    onChange={(e) => setProfileForm({...profileForm, company_name: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Contact Person</Form.Label>
                  <Form.Control
                    type="text"
                    value={profileForm.contact_person}
                    onChange={(e) => setProfileForm({...profileForm, contact_person: e.target.value})}
                    placeholder="e.g., John Doe"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Industry</Form.Label>
                  <Form.Control
                    type="text"
                    value={profileForm.industry}
                    onChange={(e) => setProfileForm({...profileForm, industry: e.target.value})}
                    placeholder="e.g., Technology, Healthcare, Finance"
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
                  <Form.Label>Website</Form.Label>
                  <Form.Control
                    type="url"
                    value={profileForm.website}
                    onChange={(e) => setProfileForm({...profileForm, website: e.target.value})}
                    placeholder="https://www.company.com"
                  />
                </Form.Group>
              </Col>
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
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Company Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={profileForm.description}
                onChange={(e) => setProfileForm({...profileForm, description: e.target.value})}
                placeholder="Tell students about your company, culture, and what makes you unique..."
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

      {/* Application Detail Modal */}
      <Modal 
        show={showApplicationModal} 
        onHide={() => {
          console.log('Modal closing');
          setShowApplicationModal(false);
          setSelectedApplication(null);
        }} 
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <FaEye className="me-2" />
            Application Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>Debug: Modal is open, selectedApplication: {selectedApplication ? 'yes' : 'no'}</div>
          {selectedApplication && (
            <div>
              <Row>
                <Col md={6}>
                  <h6 className="text-primary">Student Information</h6>
                  <div className="mb-3">
                    <strong>Name:</strong> {selectedApplication.student_name}
                  </div>
                  <div className="mb-3">
                    <strong>Email:</strong> {selectedApplication.student_email}
                  </div>
                  <div className="mb-3">
                    <strong>Applied Date:</strong> {selectedApplication.applied_date ? new Date(selectedApplication.applied_date).toLocaleDateString() : 'N/A'}
                  </div>
                </Col>
                <Col md={6}>
                  <h6 className="text-primary">Internship Details</h6>
                  <div className="mb-3">
                    <strong>Position:</strong> {selectedApplication.internship_title}
                  </div>
                  <div className="mb-3">
                    <strong>Current Status:</strong> 
                    <Badge bg={getStatusColor(selectedApplication.status)} className="ms-2">
                      {selectedApplication.status}
                    </Badge>
                  </div>
                </Col>
              </Row>
              <hr />
              <Row>
                <Col>
                  <h6 className="text-primary">Update Application Status</h6>
                  <Form.Group className="mb-3">
                    <Form.Label>New Status</Form.Label>
                    <Form.Select
                      value={selectedApplication.status}
                      onChange={(e) => handleApplicationStatusUpdate(selectedApplication.id, e.target.value)}
                    >
                      <option value="Applied">Applied</option>
                      <option value="Shortlisted">Shortlisted</option>
                      <option value="Hired">Hired</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Withdrawn">Withdrawn</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowApplicationModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Statistics Modal */}
      <Modal show={showStatsModal} onHide={() => setShowStatsModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <FaChartBar className="me-2" />
            Company Statistics
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <h6>Application Status Distribution</h6>
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
          <hr />
          <Row>
            <Col md={6}>
              <h6>Internship Overview</h6>
              <ul className="list-unstyled">
                <li><strong>Total Internships:</strong> {stats.totalInternships}</li>
                <li><strong>Active Internships:</strong> {stats.activeInternships}</li>
                <li><strong>Pending Approval:</strong> {stats.pendingInternships}</li>
                <li><strong>Total Applications:</strong> {stats.totalApplications}</li>
              </ul>
            </Col>
            <Col md={6}>
              <h6>Recent Activity</h6>
              <div className="mb-3">
                <strong>Recent Applications:</strong> {stats.recentApplications.length}
              </div>
              <div className="mb-3">
                <strong>Success Rate:</strong> {stats.totalApplications > 0 ? Math.round((stats.applicationStats.hired / stats.totalApplications) * 100) : 0}%
              </div>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowStatsModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default CompanyDashboard;
