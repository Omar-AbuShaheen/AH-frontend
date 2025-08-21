import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Form, InputGroup } from 'react-bootstrap';
import { FaSearch, FaFilter, FaEye, FaEdit, FaUser, FaBriefcase, FaFileAlt, FaChartLine, FaClock, FaCalendarAlt } from 'react-icons/fa';
import SearchFilter from './SearchFilter';
import ApplicationStatus from './ApplicationStatus';
import Profile from './Profile';
import { internshipsAPI, applicationsAPI } from '../services/api';

function Dashboard({ user, onNavigate, onProfileUpdate }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [internships, setInternships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [filteredInternships, setFilteredInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    location: '',
    type: '',
    company: ''
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch internships
      const internshipsData = await internshipsAPI.getAll();
      setInternships(internshipsData);
      setFilteredInternships(internshipsData);

      // Fetch user's applications
      const applicationsData = await applicationsAPI.getStudentApplications();
      setApplications(applicationsData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    filterInternships(term, selectedFilters);
  };

  const handleFilterChange = (filters) => {
    setSelectedFilters(filters);
    filterInternships(searchTerm, filters);
  };

  const filterInternships = (search, filters) => {
    let filtered = internships.filter(internship => {
      const matchesSearch = !search || 
        internship.title.toLowerCase().includes(search.toLowerCase()) ||
        internship.company_name?.toLowerCase().includes(search.toLowerCase()) ||
        internship.description.toLowerCase().includes(search.toLowerCase());
      
      const matchesLocation = !filters.location || 
        internship.location.toLowerCase().includes(filters.location.toLowerCase());
      
      const matchesType = !filters.type || 
        internship.type === filters.type;
      
      const matchesCompany = !filters.company || 
        internship.company_name?.toLowerCase().includes(filters.company.toLowerCase());
      
      return matchesSearch && matchesLocation && matchesType && matchesCompany;
    });
    
    setFilteredInternships(filtered);
  };

  const handleApply = async (internshipId) => {
    try {
      await internshipsAPI.apply(internshipId, 'I am excited to apply for this position and believe my skills and experience make me a great candidate...');
      alert('Application submitted successfully!');
      // Refresh data
      fetchDashboardData();
    } catch (error) {
      alert(error.message || 'Failed to submit application. Please try again.');
    }
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

  const getLocationIcon = (location) => {
    return location === 'Remote' ? <FaFilter className="me-2" /> : <FaSearch className="me-2" />;
  };

  const renderOverview = () => (
    <div>
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center h-100 border-0 shadow-sm">
            <Card.Body>
              <FaUser className="text-primary mb-3" style={{ fontSize: '2rem' }} />
              <h4>{applications.length}</h4>
              <p className="text-muted mb-0">Applications</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100 border-0 shadow-sm">
            <Card.Body>
              <FaBriefcase className="text-success mb-3" style={{ fontSize: '2rem' }} />
              <h4>{internships.length}</h4>
              <p className="text-muted mb-0">Available Internships</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100 border-0 shadow-sm">
            <Card.Body>
              <FaFileAlt className="text-warning mb-3" style={{ fontSize: '2rem' }} />
                      <h4>{applications.filter(app => app.status === 'Applied').length}</h4>
        <p className="text-muted mb-0">Applied</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100 border-0 shadow-sm">
            <Card.Body>
              <FaChartLine className="text-info mb-3" style={{ fontSize: '2rem' }} />
                      <h4>{applications.filter(app => app.status === 'Hired').length}</h4>
        <p className="text-muted mb-0">Hired</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">Recent Applications</h5>
            </Card.Header>
            <Card.Body>
              {applications.length === 0 ? (
                <p className="text-muted text-center py-3">No applications yet. Start applying to internships!</p>
              ) : (
                <div>
                  {applications.slice(0, 5).map(application => (
                    <div key={application.id} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                      <div>
                        <h6 className="mb-1">{application.title}</h6>
                        <small className="text-muted">{application.company_name}</small>
                      </div>
                      <Badge bg={getTypeColor(application.status)}>
                        {application.status}
                      </Badge>
                    </div>
                  ))}
                  {applications.length > 5 && (
                    <div className="text-center mt-3">
                      <Button variant="outline-primary" size="sm" onClick={() => setActiveTab('applications')}>
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
      <SearchFilter 
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        filters={selectedFilters}
      />

      <div className="mt-4">
        <h5>Available Internships ({filteredInternships.length})</h5>
        
        {filteredInternships.length === 0 ? (
          <div className="text-center py-5">
            <p className="text-muted">No internships found matching your criteria.</p>
          </div>
        ) : (
          <Row>
            {filteredInternships.map(internship => (
              <Col key={internship.id} lg={6} xl={4} className="mb-4">
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h6 className="card-title mb-1">{internship.title}</h6>
                      <Badge bg={getTypeColor(internship.type)}>
                        {internship.type}
                      </Badge>
                    </div>
                    
                    <div className="company-info mb-3">
                      <h6 className="text-muted mb-2">
                        <FaBriefcase className="me-2" />
                        {internship.company_name || 'Company Name'}
                      </h6>
                    </div>
                    
                    <p className="card-text text-muted mb-3">
                      {internship.description && internship.description.length > 100 
                        ? `${internship.description.substring(0, 100)}...`
                        : internship.description || 'No description available'
                      }
                    </p>
                    
                    <div className="internship-details mb-3">
                      <div className="d-flex gap-2 mb-2">
                        <Badge bg="secondary">
                          {getLocationIcon(internship.location)}
                          {internship.location}
                        </Badge>
                        <Badge bg={getTypeColor(internship.type)}>
                          {internship.type}
                        </Badge>
                      </div>
                      
                      <div className="d-flex gap-2 mb-2">
                        <Badge bg="warning">
                          <FaClock className="me-1" />
                          {internship.duration || '3-6 months'}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">
                        <FaCalendarAlt className="me-1" />
                        Deadline: {new Date(internship.deadline).toLocaleDateString()}
                      </small>
                      
                      <div className="d-flex gap-2">
                        <Button 
                          variant="outline-secondary" 
                          size="sm"
                          onClick={() => onNavigate('internship-detail', internship.id)}
                        >
                          <FaEye className="me-1" />
                          View
                        </Button>
                        
                        {getApplicationStatus(internship.id) ? (
                          <Badge bg="info">Already Applied</Badge>
                        ) : (
                          <Button 
                            variant="primary" 
                            size="sm"
                            onClick={() => handleApply(internship.id)}
                          >
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
    </div>
  );

  const renderApplications = () => (
    <div>
      <h5>My Applications ({applications.length})</h5>
      
      {applications.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted">You haven't applied to any internships yet.</p>
                     <Button 
             variant="primary"
             onClick={() => setActiveTab('internships')}
           >
             Browse Internships
           </Button>
        </div>
      ) : (
        <div>
          {applications.map(application => (
            <Card key={application.id} className="mb-3 border-0 shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start">
                  <div className="flex-grow-1">
                    <h6 className="mb-2">{application.title}</h6>
                    <p className="text-muted mb-2">{application.company_name}</p>
                    <div className="d-flex gap-2 mb-2">
                      <Badge bg="secondary">{application.location}</Badge>
                      <Badge bg={getTypeColor(application.type)}>{application.type}</Badge>
                    </div>
                    <small className="text-muted">
                      Applied on: {new Date(application.created_at).toLocaleDateString()}
                    </small>
                  </div>
                  <div className="text-end">
                    <Badge bg={getTypeColor(application.status)} className="mb-2">
                      {application.status}
                    </Badge>
                    <br />
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={() => onNavigate('internship-detail', application.internship_id)}
                    >
                      <FaEye className="me-1" />
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
    <Profile user={user} onUpdateProfile={onProfileUpdate} />
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
      <Container className="py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading dashboard...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <h1 className="display-5 mb-3">Welcome back, {user?.first_name || 'Student'}!</h1>
          <p className="lead text-muted">Manage your internship applications and profile</p>
        </Col>
      </Row>

      <Row>
        <Col lg={3}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-0">
              <div className="list-group list-group-flush">
                <button
                  className={`list-group-item list-group-item-action border-0 ${activeTab === 'overview' ? 'active' : ''}`}
                  onClick={() => setActiveTab('overview')}
                >
                  <FaChartLine className="me-2" />
                  Overview
                </button>
                <button
                  className={`list-group-item list-group-item-action border-0 ${activeTab === 'internships' ? 'active' : ''}`}
                  onClick={() => setActiveTab('internships')}
                >
                  <FaBriefcase className="me-2" />
                  Browse Internships
                </button>
                <button
                  className={`list-group-item list-group-item-action border-0 ${activeTab === 'applications' ? 'active' : ''}`}
                  onClick={() => setActiveTab('applications')}
                >
                  <FaFileAlt className="me-2" />
                  My Applications
                </button>
                <button
                  className={`list-group-item list-group-item-action border-0 ${activeTab === 'profile' ? 'active' : ''}`}
                  onClick={() => setActiveTab('profile')}
                >
                  <FaUser className="me-2" />
                  Profile
                </button>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={9}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              {renderContent()}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard; 