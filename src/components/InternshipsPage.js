import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Alert } from 'react-bootstrap';
import InternshipCard from './InternshipCard';
import SearchFilter from './SearchFilter';
import { internshipsAPI } from '../services/api';

function InternshipsPage({ user, onNavigate }) {
  const [internships, setInternships] = useState([]);
  const [filteredInternships, setFilteredInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    location: '',
    type: '',
    company: '',
    industry: '',
    salary: '',
    duration: '',
    deadline: ''
  });

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await internshipsAPI.getAll();
      setInternships(data);
      setFilteredInternships(data);
    } catch (error) {
      console.error('Error fetching internships:', error);
      setError('Failed to fetch internships. Please try again.');
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
        internship.location?.toLowerCase().includes(filters.location.toLowerCase());
      
      const matchesType = !filters.type || 
        internship.type === filters.type;
      
      const matchesCompany = !filters.company || 
        internship.company_name?.toLowerCase().includes(filters.company.toLowerCase());
      
      const matchesIndustry = !filters.industry || 
        internship.industry?.toLowerCase().includes(filters.industry.toLowerCase());
      
      const matchesSalary = !filters.salary || 
        (() => {
          if (filters.salary === 'Unpaid') return !internship.stipend || internship.stipend.toLowerCase().includes('unpaid');
          if (filters.salary === '4000+') return internship.stipend && parseInt(internship.stipend.replace(/\D/g, '')) >= 4000;
          if (filters.salary.includes('-')) {
            const [min, max] = filters.salary.split('-').map(n => parseInt(n));
            const stipendNum = internship.stipend ? parseInt(internship.stipend.replace(/\D/g, '')) : 0;
            return stipendNum >= min && stipendNum <= max;
          }
          return true;
        })();
      
      const matchesDuration = !filters.duration || 
        internship.duration?.toLowerCase().includes(filters.duration.toLowerCase());
      
      const matchesDeadline = !filters.deadline || 
        (() => {
          if (!internship.deadline) return false;
          const deadline = new Date(internship.deadline);
          const today = new Date();
          
          switch (filters.deadline) {
            case 'this-week':
              const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
              return deadline <= weekFromNow;
            case 'this-month':
              const monthFromNow = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
              return deadline <= monthFromNow;
            case 'next-month':
              const nextMonth = new Date(today.getFullYear(), today.getMonth() + 2, today.getDate());
              return deadline <= nextMonth;
            case '3-months':
              const threeMonths = new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000);
              return deadline <= threeMonths;
            case '6-months':
              const sixMonths = new Date(today.getTime() + 180 * 24 * 60 * 60 * 1000);
              return deadline <= sixMonths;
            default:
              return true;
          }
        })();
      
      return matchesSearch && matchesLocation && matchesType && matchesCompany && 
             matchesIndustry && matchesSalary && matchesDuration && matchesDeadline;
    });
    
    // Apply sorting if specified
    if (filters.sort) {
      filtered.sort((a, b) => {
        switch (filters.sort) {
          case 'deadline':
            return new Date(a.deadline || 0) - new Date(b.deadline || 0);
          case 'salary':
            const aSalary = a.stipend ? parseInt(a.stipend.replace(/\D/g, '')) : 0;
            const bSalary = b.stipend ? parseInt(b.stipend.replace(/\D/g, '')) : 0;
            return bSalary - aSalary;
          case 'company':
            return (a.company_name || '').localeCompare(b.company_name || '');
          case 'recent':
          default:
            return new Date(b.created_at || 0) - new Date(a.created_at || 0);
        }
      });
    }
    
    setFilteredInternships(filtered);
  };

  const handleApply = async (internshipId) => {
    if (!user) {
      alert('Please login to apply for internships!');
      return;
    }

    try {
      await internshipsAPI.apply(internshipId, 'I am excited to apply for this position and believe my skills and experience make me a great candidate...');
      alert('Application submitted successfully!');
      // Refresh internships to show updated application count
      fetchInternships();
    } catch (error) {
      alert(error.message || 'Failed to submit application. Please try again.');
    }
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
    return location === 'Remote' ? <i className="fas fa-home me-2"></i> : <i className="fas fa-map-marker-alt me-2"></i>;
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading internships...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error}</p>
          <Button onClick={fetchInternships} variant="outline-danger">
            Try Again
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="internships-hero" style={{ marginTop: '0' }}>
        <Container>
          <Row className="mb-4">
            <Col>
              <h1 className="display-4 text-center mb-3">Find Your Perfect Internship</h1>
              <p className="lead text-center text-muted">
                Discover amazing opportunities from top companies around the world
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      <Container className="py-5">
        {/* Search & Filter Section */}
        <div className="search-filter-container mb-5">
          <SearchFilter 
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
            filters={selectedFilters}
            internships={internships} // Pass internships data to SearchFilter
          />
        </div>

        {/* Results Header */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h3 className="mb-1" style={{
                  color: '#2c3e50',
                  fontWeight: '700',
                  fontSize: '1.8rem'
                }}>
                  Available Internships
                </h3>
                <p className="text-muted mb-0" style={{ fontSize: '1rem' }}>
                  {filteredInternships.length} opportunity{filteredInternships.length !== 1 ? 'ies' : 'y'} found
                </p>
              </div>
              {user && (
                <Button 
                  variant="outline-primary" 
                  onClick={() => onNavigate('dashboard')}
                  style={{
                    padding: '0.75rem 1.5rem',
                    fontWeight: '600',
                    borderRadius: '8px',
                    borderWidth: '2px'
                  }}
                >
                  <i className="fas fa-briefcase me-2"></i>
                  View My Applications
                </Button>
              )}
            </div>
          </Col>
        </Row>

             {filteredInternships.length === 0 ? (
         <Row>
           <Col>
             <Card className="text-center py-5" style={{
               border: 'none',
               borderRadius: '16px',
               boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
               background: '#ffffff'
             }}>
               <Card.Body>
                 <div className="mb-4">
                   <i className="fas fa-search" style={{
                     fontSize: '4rem',
                     color: '#33A1E0',
                     opacity: '0.5'
                   }}></i>
                 </div>
                 <h4 style={{
                   color: '#2c3e50',
                   fontWeight: '700',
                   marginBottom: '1rem'
                 }}>No internships found</h4>
                 <p className="text-muted" style={{ fontSize: '1.1rem' }}>
                   Try adjusting your search criteria or check back later for new opportunities.
                 </p>
                 <Button 
                   variant="outline-primary" 
                   className="mt-3"
                   onClick={() => {
                     setSearchTerm('');
                     setSelectedFilters({ location: '', type: '', company: '', industry: '', salary: '', duration: '', deadline: '' });
                     setFilteredInternships(internships);
                   }}
                   style={{
                     padding: '0.75rem 1.5rem',
                     fontWeight: '600',
                     borderRadius: '8px',
                     borderWidth: '2px'
                   }}
                 >
                   <i className="fas fa-refresh me-2"></i>
                   Clear Filters
                 </Button>
               </Card.Body>
             </Card>
           </Col>
         </Row>
       ) : (
         <Row>
           {filteredInternships.map(internship => (
             <Col key={internship.id} lg={6} xl={4} className="mb-4">
               <InternshipCard
                 internship={internship}
                 user={user}
                 onApply={handleApply}
                 onViewDetails={() => onNavigate('internship-detail', internship.id)}
                 getTypeColor={getTypeColor}
                 getLocationIcon={getLocationIcon}
               />
             </Col>
           ))}
         </Row>
       )}
     </Container>
     </div>
   );
 }

export default InternshipsPage; 