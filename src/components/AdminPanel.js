import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Modal, Form, Badge, Alert, Spinner, Nav, ProgressBar, Dropdown } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaEye, FaBuilding, FaBriefcase, FaFileAlt, FaChartLine, FaUsers, FaCheck, FaTimes, FaClock, FaUserCheck, FaUserTimes, FaChartBar, FaFilter, FaSearch } from 'react-icons/fa';

const API_BASE_URL = 'http://localhost:5000/api';

function AdminPanel({ user, onNavigate }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [companies, setCompanies] = useState([]);
  const [internships, setInternships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [showInternshipModal, setShowInternshipModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  
  // Form states
  const [companyForm, setCompanyForm] = useState({
    name: '',
    industry: '',
    location: '',
    description: '',
    website: '',
    contact_email: '',
    contact_phone: ''
  });
  
  const [internshipForm, setInternshipForm] = useState({
    title: '',
    company_id: '',
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

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all data in parallel using the correct admin endpoints
      const [companiesRes, internshipsRes, applicationsRes, studentsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/admin/companies`, { 
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }),
        fetch(`${API_BASE_URL}/admin/internships`, { 
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }),
        fetch(`${API_BASE_URL}/admin/applications`, { 
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }),
        fetch(`${API_BASE_URL}/admin/students`, { 
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
      ]);

      if (companiesRes.ok) {
        const companiesData = await companiesRes.json();
        setCompanies(companiesData);
      }

      if (internshipsRes.ok) {
        const internshipsData = await internshipsRes.json();
        setInternships(internshipsData);
      }

      if (applicationsRes.ok) {
        const applicationsData = await applicationsRes.json();
        setApplications(applicationsData);
      }

      if (studentsRes.ok) {
        const studentsData = await studentsRes.json();
        setStudents(studentsData);
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  // Enhanced statistics calculations
  const getStats = () => {
    const pendingCompanies = companies.filter(c => !c.is_approved).length;
    const pendingInternships = internships.filter(i => !i.is_approved).length;
    const totalApplications = applications.length;
    const activeInternships = internships.filter(i => i.is_active && i.is_approved).length;
    
    const applicationStats = {
      applied: applications.filter(app => app.status === 'Applied').length,
      shortlisted: applications.filter(app => app.status === 'Shortlisted').length,
      hired: applications.filter(app => app.status === 'Hired').length,
      rejected: applications.filter(app => app.status === 'Rejected').length
    };

    return {
      totalCompanies: companies.length,
      totalStudents: students.length,
      totalInternships: internships.length,
      totalApplications,
      pendingCompanies,
      pendingInternships,
      activeInternships,
      applicationStats
    };
  };

  const handleCompanySubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingItem 
        ? `${API_BASE_URL}/companies/${editingItem.id}`
        : `${API_BASE_URL}/companies`;
      
      const method = editingItem ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(companyForm)
      });

      if (response.ok) {
        setShowCompanyModal(false);
        setEditingItem(null);
        setCompanyForm({
          name: '', industry: '', location: '', description: '', 
          website: '', contact_email: '', contact_phone: ''
        });
        fetchAdminData();
        alert(editingItem ? 'Company updated successfully!' : 'Company created successfully!');
      } else {
        const error = await response.json();
        alert(error.message || 'Operation failed');
      }
    } catch (error) {
      alert('Error saving company');
    }
  };

  const handleInternshipSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const url = editingItem 
        ? `${API_BASE_URL}/admin/internships/${editingItem.id}`
        : `${API_BASE_URL}/admin/internships`;
      
      const method = editingItem ? 'PUT' : 'POST';
      
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
        setEditingItem(null);
        setInternshipForm({
          title: '', company_id: '', description: '', requirements: '', 
          responsibilities: '', location: '', type: 'Full-time', duration: '', 
          stipend: '', deadline: '', is_active: true
        });
        fetchAdminData();
        alert(editingItem ? 'Internship updated successfully!' : 'Internship created successfully!');
      } else {
        const error = await response.json();
        alert(error.message || 'Operation failed');
      }
    } catch (error) {
      alert('Error saving internship');
    }
  };

  const handleApproveCompany = async (companyId, isApproved) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/admin/companies/${companyId}/approval`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ is_approved: isApproved })
      });

      if (response.ok) {
        fetchAdminData();
        alert(`Company ${isApproved ? 'approved' : 'rejected'} successfully!`);
      } else {
        const error = await response.json();
        alert(error.message || 'Operation failed');
      }
    } catch (error) {
      alert('Error updating company approval');
    }
  };

  const handleApproveInternship = async (internshipId, isApproved) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/admin/internships/${internshipId}/approval`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ is_approved: isApproved })
      });

      if (response.ok) {
        fetchAdminData();
        alert(`Internship ${isApproved ? 'approved' : 'rejected'} successfully!`);
      } else {
        const error = await response.json();
        alert(error.message || 'Operation failed');
      }
    } catch (error) {
      alert('Error updating internship approval');
    }
  };

  const handleDeleteCompany = async (companyId) => {
    if (!window.confirm('Are you sure you want to delete this company? This action cannot be undone.')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/admin/companies/${companyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchAdminData();
        alert('Company deleted successfully!');
      } else {
        const error = await response.json();
        alert(error.message || 'Delete failed');
      }
    } catch (error) {
      alert('Error deleting company');
    }
  };

  const handleDeleteInternship = async (internshipId) => {
    if (!window.confirm('Are you sure you want to delete this internship? This action cannot be undone.')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/admin/internships/${internshipId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchAdminData();
        alert('Internship deleted successfully!');
      } else {
        const error = await response.json();
        alert(error.message || 'Delete failed');
      }
    } catch (error) {
      alert('Error deleting internship');
    }
  };

  const handleDeleteStudent = async (studentId) => {
    if (!window.confirm('Are you sure you want to delete this student? This action cannot be undone.')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/admin/students/${studentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchAdminData();
        alert('Student deleted successfully!');
      } else {
        const error = await response.json();
        alert(error.message || 'Delete failed');
      }
    } catch (error) {
      alert('Error deleting student');
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
  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.industry?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'approved' && company.is_approved) ||
                         (statusFilter === 'pending' && !company.is_approved);
    return matchesSearch && matchesStatus;
  });

  const filteredInternships = internships.filter(internship => {
    const matchesSearch = internship.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         internship.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         internship.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'approved' && internship.is_approved) ||
                         (statusFilter === 'pending' && !internship.is_approved);
    const matchesType = typeFilter === 'all' || internship.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const filteredApplications = applications.filter(application => {
    const matchesSearch = application.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         application.internship_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         application.company_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || application.status === statusFilter;
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
              <i className="fas fa-building dashboard-stat-icon text-primary mb-3"></i>
              <h3>{stats.totalCompanies}</h3>
              <p className="text-muted mb-0">Total Companies</p>
              {stats.pendingCompanies > 0 && (
                <Badge bg="warning" className="mt-2">
                  {stats.pendingCompanies} Pending
                </Badge>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100 dashboard-stat-card">
            <Card.Body>
              <i className="fas fa-users dashboard-stat-icon text-success mb-3"></i>
              <h3>{stats.totalStudents}</h3>
              <p className="text-muted mb-0">Total Students</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100 dashboard-stat-card">
            <Card.Body>
              <i className="fas fa-briefcase dashboard-stat-icon text-info mb-3"></i>
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
              <i className="fas fa-file-alt dashboard-stat-icon text-warning mb-3"></i>
              <h3>{stats.totalApplications}</h3>
              <p className="text-muted mb-0">Total Applications</p>
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
          <Card className="pending-approvals-card">
            <Card.Header>
              <h5 className="mb-0">
                <i className="fas fa-clock me-2"></i>
                Pending Approvals
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <h6 className="text-warning">Company Approvals</h6>
                <p className="mb-2">{stats.pendingCompanies} companies waiting for approval</p>
                <Button 
                  variant="outline-warning" 
                  size="sm"
                  onClick={() => setActiveTab('companies')}
                >
                  Review Companies
                </Button>
              </div>
              <div>
                <h6 className="text-warning">Internship Approvals</h6>
                <p className="mb-2">{stats.pendingInternships} internships waiting for approval</p>
                <Button 
                  variant="outline-warning" 
                  size="sm"
                  onClick={() => setActiveTab('internships')}
                >
                  Review Internships
                </Button>
              </div>
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
                    onClick={() => setShowCompanyModal(true)}
                  >
                    <i className="fas fa-building me-2"></i>
                    Add Company
                  </Button>
                </Col>
                <Col md={3}>
                  <Button 
                    variant="outline-info" 
                    className="w-100 mb-2"
                    onClick={() => setShowInternshipModal(true)}
                  >
                    <i className="fas fa-briefcase me-2"></i>
                    Add Internship
                  </Button>
                </Col>
                <Col md={3}>
                  <Button 
                    variant="outline-warning" 
                    className="w-100 mb-2"
                    onClick={() => setActiveTab('companies')}
                  >
                    <i className="fas fa-user-check me-2"></i>
                    Review Companies
                  </Button>
                </Col>
                <Col md={3}>
                  <Button 
                    variant="outline-success" 
                    className="w-100 mb-2"
                    onClick={() => setActiveTab('internships')}
                  >
                    <i className="fas fa-check me-2"></i>
                    Review Internships
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );

  const renderCompanies = () => (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Company Management</h4>
        <Button variant="primary" onClick={() => setShowCompanyModal(true)}>
          <FaPlus className="me-2" />
          Add Company
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
                  placeholder="Search companies..."
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
                <option value="pending">Pending</option>
              </Form.Select>
            </Col>
            <Col md={3}>
              <Button 
                variant="outline-secondary" 
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
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
                <th>Company Name</th>
                <th>Industry</th>
                <th>Location</th>
                <th>Contact Person</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCompanies.map(company => (
                <tr key={company.id}>
                  <td>
                    <strong>{company.company_name || 'Company'}</strong>
                    <br />
                    <small className="text-muted">{company.email}</small>
                  </td>
                  <td>
                    <Badge bg="info">{company.industry || 'N/A'}</Badge>
                  </td>
                  <td>{company.location || 'N/A'}</td>
                  <td>{company.contact_person || 'N/A'}</td>
                  <td>
                    <Badge bg={company.is_approved ? 'success' : 'warning'}>
                      {company.is_approved ? 'Approved' : 'Pending Approval'}
                    </Badge>
                  </td>
                  <td>
                    {!company.is_approved && (
                      <Button 
                        variant="success" 
                        size="sm" 
                        className="me-2"
                        onClick={() => handleApproveCompany(company.id, true)}
                      >
                        <i className="fas fa-check me-1"></i>
                        Approve
                      </Button>
                    )}
                    {company.is_approved && (
                      <Button 
                        variant="danger" 
                        size="sm" 
                        className="me-2"
                        onClick={() => handleApproveCompany(company.id, false)}
                      >
                        <i className="fas fa-times me-1"></i>
                        Reject
                      </Button>
                    )}
                    <Button 
                      variant="outline-primary" 
                      size="sm" 
                      className="me-2"
                      onClick={() => {
                        setEditingItem(company);
                        setCompanyForm({
                          name: company.company_name || '',
                          industry: company.industry || '',
                          location: company.location || '',
                          description: company.description || '',
                          website: company.website || '',
                          contact_email: company.email || '',
                          contact_phone: company.phone || ''
                        });
                        setShowCompanyModal(true);
                      }}
                    >
                      <i className="fas fa-edit"></i>
                    </Button>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => handleDeleteCompany(company.id)}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {filteredCompanies.length === 0 && (
            <div className="empty-state">
              <i className="fas fa-search"></i>
              <p className="text-muted">No companies found matching your criteria.</p>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );

  const renderInternships = () => (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Internship Management</h4>
        <Button variant="primary" onClick={() => setShowInternshipModal(true)}>
          <FaPlus className="me-2" />
          Add Internship
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
                <option value="pending">Pending</option>
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

      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          <Table responsive striped hover className="mb-0">
            <thead className="table-dark">
          <tr>
            <th>Title</th>
            <th>Company</th>
            <th>Location</th>
            <th>Type</th>
            <th>Status</th>
            <th>Deadline</th>
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
                    <strong>{internship.company_name || 'N/A'}</strong>
                    <br />
                    <small className="text-muted">{internship.company_email || 'N/A'}</small>
              </td>
                  <td>{internship.location || 'N/A'}</td>
                  <td>
                    <Badge bg={getTypeColor(internship.type)}>{internship.type || 'N/A'}</Badge>
                  </td>
                  <td>
                    <Badge bg={internship.is_approved ? 'success' : 'warning'}>
                      {internship.is_approved ? 'Approved' : 'Pending Approval'}
                </Badge>
              </td>
                  <td>{internship.deadline ? new Date(internship.deadline).toLocaleDateString() : 'N/A'}</td>
                  <td>
                    {!internship.is_approved && (
                      <Button 
                        variant="success" 
                        size="sm" 
                        className="me-2"
                        onClick={() => handleApproveInternship(internship.id, true)}
                      >
                        <FaCheck className="me-1" />
                        Approve
                      </Button>
                    )}
                    {internship.is_approved && (
                      <Button 
                        variant="danger" 
                        size="sm" 
                        className="me-2"
                        onClick={() => handleApproveInternship(internship.id, false)}
                      >
                        <FaTimes className="me-1" />
                        Reject
                      </Button>
                    )}
                <Button 
                  variant="outline-primary" 
                  size="sm" 
                  className="me-2"
                      onClick={() => {
                        setEditingItem(internship);
                        setInternshipForm({
                          title: internship.title || '',
                          company_id: internship.company_id || '',
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
                  <FaEdit />
                </Button>
                <Button 
                  variant="outline-danger" 
                  size="sm"
                      onClick={() => handleDeleteInternship(internship.id)}
                >
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
          {filteredInternships.length === 0 && (
            <div className="text-center py-4">
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
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
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
                  setStatusFilter('all');
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
            <thead className="table-dark">
          <tr>
            <th>Student</th>
            <th>Internship</th>
            <th>Company</th>
            <th>Applied Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
              {filteredApplications.map(app => {
            const internship = internships.find(i => i.id === app.internship_id);
            const company = companies.find(c => c.id === internship?.company_id);
            
            return (
              <tr key={app.id}>
                <td>
                      <strong>{app.student_name || 'Student'}</strong>
                  <br />
                      <small className="text-muted">{app.student_email}</small>
                </td>
                    <td>{internship?.title || 'N/A'}</td>
                    <td>
                      <strong>{company?.company_name || 'N/A'}</strong>
                      <br />
                      <small className="text-muted">{company?.email || 'N/A'}</small>
                    </td>
                    <td>{app.applied_date ? new Date(app.applied_date).toLocaleDateString() : 'N/A'}</td>
                <td>
                  <Badge bg={getStatusColor(app.status)}>{app.status}</Badge>
                </td>
                <td>
                      <Form.Select
                        size="sm"
                    value={app.status}
                        onChange={async (e) => {
                          try {
                            const token = localStorage.getItem('token');
                            const response = await fetch(`${API_BASE_URL}/admin/applications/${app.id}/status`, {
                              method: 'PUT',
                              headers: { 
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                              },
                              body: JSON.stringify({ status: e.target.value })
                            });

                            if (response.ok) {
                              fetchAdminData();
                              alert('Application status updated successfully!');
                            } else {
                              const error = await response.json();
                              alert(error.message || 'Status update failed');
                            }
                          } catch (error) {
                            alert('Error updating application status');
                          }
                        }}
                  >
                    <option value="Applied">Applied</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Hired">Hired</option>
                    <option value="Rejected">Rejected</option>
                        <option value="Withdrawn">Withdrawn</option>
                      </Form.Select>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
          {filteredApplications.length === 0 && (
            <div className="text-center py-4">
              <p className="text-muted">No applications found matching your criteria.</p>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );

  const renderStudents = () => (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Student Management</h4>
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
                  placeholder="Search students..."
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
                <option value="all">All Students</option>
                <option value="with_applications">With Applications</option>
                <option value="without_applications">Without Applications</option>
              </Form.Select>
            </Col>
            <Col md={3}>
              <Button 
                variant="outline-secondary" 
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
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
            <thead className="table-dark">
              <tr>
                <th>Student Name</th>
            <th>Email</th>
            <th>Major</th>
            <th>University</th>
            <th>Graduation Year</th>
            <th>Applications</th>
                <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => (
            <tr key={student.id}>
              <td>
                    <strong>{student.name || `${student.first_name} ${student.last_name}`}</strong>
                <br />
                    <small className="text-muted">{student.phone || 'No phone'}</small>
              </td>
              <td>{student.email}</td>
                  <td>
                    <Badge bg="info">{student.major || 'N/A'}</Badge>
                  </td>
                  <td>{student.university || 'N/A'}</td>
                  <td>
                    <Badge bg="secondary">{student.graduation_year || 'N/A'}</Badge>
                  </td>
                  <td>
                    <Badge bg="primary">
                  {applications.filter(app => app.student_id === student.id).length}
                </Badge>
              </td>
                  <td>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => handleDeleteStudent(student.id)}
                    >
                      <FaTimes />
                    </Button>
                  </td>
            </tr>
          ))}
        </tbody>
      </Table>
          {students.length === 0 && (
            <div className="text-center py-4">
              <p className="text-muted">No students found.</p>
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
      case 'companies':
        return renderCompanies();
      case 'internships':
        return renderInternships();
      case 'applications':
        return renderApplications();
      case 'students':
        return renderStudents();
      default:
        return renderOverview();
    }
  };

  if (loading) {
    return (
      <Container className="mt-5 pt-4">
        <div className="loading-container">
          <Spinner animation="border" variant="primary" size="lg" />
          <p className="mt-3 text-muted">Loading admin dashboard...</p>
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
          <Button variant="outline-danger" onClick={fetchAdminData} className="mt-3">
            <i className="fas fa-redo me-2"></i>
            Try Again
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-5 pt-4">
      <div className="admin-header">
        <div className="d-flex align-items-center mb-3">
          <div className="avatar-placeholder me-3">
            <i className="fas fa-user-shield"></i>
          </div>
          <div>
            <h2>Admin Dashboard</h2>
            <p className="text-muted mb-0">Welcome back, Admin! Manage your platform and monitor activities.</p>
          </div>
        </div>
      </div>

      {/* Enhanced Navigation Tabs */}
      <div className="admin-tabs mb-4">
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
              active={activeTab === 'companies'}
              onClick={() => setActiveTab('companies')}
              className="nav-link-custom"
            >
              <i className="fas fa-building me-2"></i>
              Companies
              {stats.pendingCompanies > 0 && (
                <Badge bg="warning" className="ms-2">
                  {stats.pendingCompanies}
                </Badge>
              )}
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link 
              active={activeTab === 'internships'}
              onClick={() => setActiveTab('internships')}
              className="nav-link-custom"
            >
              <i className="fas fa-briefcase me-2"></i>
              Internships
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
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link 
              active={activeTab === 'students'}
              onClick={() => setActiveTab('students')}
              className="nav-link-custom"
            >
              <i className="fas fa-users me-2"></i>
              Students
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </div>

      {renderContent()}

      {/* Company Modal */}
      <Modal show={showCompanyModal} onHide={() => {
        setShowCompanyModal(false);
        setEditingItem(null);
        setCompanyForm({
          name: '', industry: '', location: '', description: '', 
          website: '', contact_email: '', contact_phone: ''
        });
      }}>
        <Modal.Header closeButton>
          <Modal.Title>{editingItem ? 'Edit Company' : 'Add New Company'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCompanySubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Company Name *</Form.Label>
                  <Form.Control
                    type="text"
                    value={companyForm.name}
                    onChange={(e) => setCompanyForm({...companyForm, name: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Industry</Form.Label>
                  <Form.Control
                    type="text"
                    value={companyForm.industry}
                    onChange={(e) => setCompanyForm({...companyForm, industry: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    value={companyForm.location}
                    onChange={(e) => setCompanyForm({...companyForm, location: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Website</Form.Label>
                  <Form.Control
                    type="url"
                    value={companyForm.website}
                    onChange={(e) => setCompanyForm({...companyForm, website: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Contact Person</Form.Label>
                  <Form.Control
                    type="text"
                    value={companyForm.contact_person}
                    onChange={(e) => setCompanyForm({...companyForm, contact_person: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Contact Phone</Form.Label>
                  <Form.Control
                    type="tel"
                    value={companyForm.contact_phone}
                    onChange={(e) => setCompanyForm({...companyForm, contact_phone: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={companyForm.description}
                onChange={(e) => setCompanyForm({...companyForm, description: e.target.value})}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowCompanyModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingItem ? 'Update' : 'Add'} Company
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Internship Modal */}
      <Modal show={showInternshipModal} onHide={() => {
        setShowInternshipModal(false);
        setEditingItem(null);
        setInternshipForm({
          title: '', company_id: '', description: '', requirements: '', 
          responsibilities: '', location: '', type: 'Full-time', duration: '', 
          stipend: '', deadline: '', is_active: true
        });
      }}>
        <Modal.Header closeButton>
          <Modal.Title>{editingItem ? 'Edit Internship' : 'Add New Internship'}</Modal.Title>
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
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Company *</Form.Label>
                  <Form.Select
                    value={internshipForm.company_id}
                    onChange={(e) => setInternshipForm({...internshipForm, company_id: e.target.value})}
                    required
                  >
                    <option value="">Select Company</option>
                    {companies.filter(c => c.is_approved).map(company => (
                      <option key={company.id} value={company.id}>
                        {company.company_name}
                      </option>
                    ))}
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
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
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
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Duration</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., 3 months"
                    value={internshipForm.duration}
                    onChange={(e) => setInternshipForm({...internshipForm, duration: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Deadline</Form.Label>
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
                  <Form.Label>Stipend ($/month)</Form.Label>
                  <Form.Control
                    type="number"
                    value={internshipForm.stipend}
                    onChange={(e) => setInternshipForm({...internshipForm, stipend: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={internshipForm.description}
                onChange={(e) => setInternshipForm({...internshipForm, description: e.target.value})}
                required
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Requirements</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={internshipForm.requirements}
                    onChange={(e) => setInternshipForm({...internshipForm, requirements: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Responsibilities</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={internshipForm.responsibilities}
                    onChange={(e) => setInternshipForm({...internshipForm, responsibilities: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Active"
                checked={internshipForm.is_active}
                onChange={(e) => setInternshipForm({...internshipForm, is_active: e.target.checked})}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowInternshipModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingItem ? 'Update' : 'Add'} Internship
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Statistics Modal */}
      <Modal show={showStatsModal} onHide={() => setShowStatsModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <FaChartBar className="me-2" />
            Platform Statistics
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
              <h6>Platform Overview</h6>
              <ul className="list-unstyled">
                <li><strong>Total Companies:</strong> {stats.totalCompanies}</li>
                <li><strong>Total Students:</strong> {stats.totalStudents}</li>
                <li><strong>Total Internships:</strong> {stats.totalInternships}</li>
                <li><strong>Total Applications:</strong> {stats.totalApplications}</li>
              </ul>
            </Col>
            <Col md={6}>
              <h6>Pending Approvals</h6>
              <ul className="list-unstyled">
                <li><strong>Companies:</strong> {stats.pendingCompanies}</li>
                <li><strong>Internships:</strong> {stats.pendingInternships}</li>
                <li><strong>Active Internships:</strong> {stats.activeInternships}</li>
              </ul>
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

export default AdminPanel; 