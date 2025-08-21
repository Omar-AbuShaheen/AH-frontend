import React, { useState } from 'react';
import { Form, Row, Col, Button, InputGroup } from 'react-bootstrap';

const SearchFilter = ({ onSearch, onFilter }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    type: '',
    company: '',
    industry: ''
  });

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const clearFilters = () => {
    setFilters({
      location: '',
      type: '',
      company: '',
      industry: ''
    });
    setSearchTerm('');
    onFilter({});
    onSearch('');
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '') || searchTerm !== '';

  return (
    <div className="search-filter-section" style={{
      background: '#ffffff',
      borderRadius: '16px',
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
      padding: '2rem',
      border: '1px solid #e9ecef'
    }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="mb-0 fw-bold" style={{
          color: '#33A1E0',
          fontSize: '1.3rem'
        }}>
          <i className="fas fa-search me-2"></i>Search & Filter Internships
        </h5>
        {hasActiveFilters && (
          <Button 
            variant="outline-secondary" 
            size="sm"
            onClick={clearFilters}
            className="px-3"
            style={{
              borderRadius: '8px',
              fontWeight: '600',
              borderWidth: '2px'
            }}
          >
            <i className="fas fa-times me-1"></i>Clear All
          </Button>
        )}
      </div>
      
      {/* Search Bar */}
      <Form onSubmit={handleSearch} className="mb-4">
        <InputGroup className="shadow-sm" style={{
          borderRadius: '12px',
          overflow: 'hidden'
        }}>
          <InputGroup.Text className="bg-white border-end-0" style={{
            border: '2px solid #e9ecef',
            borderRight: 'none'
          }}>
            <i className="fas fa-search" style={{ color: '#33A1E0' }}></i>
          </InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Search internships by title, company, or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-start-0"
            style={{
              border: '2px solid #e9ecef',
              borderLeft: 'none',
              padding: '0.875rem 1rem',
              fontSize: '1rem'
            }}
          />
          <Button 
            variant="primary" 
            type="submit"
            className="px-4"
            style={{
              padding: '0.875rem 2rem',
              fontWeight: '600',
              borderRadius: '0 12px 12px 0'
            }}
          >
            <i className="fas fa-search me-2"></i>Search
          </Button>
        </InputGroup>
      </Form>

      {/* Filters */}
      <Row className="g-3">
        <Col md={3} sm={6}>
          <Form.Group>
            <Form.Label className="small fw-medium mb-2" style={{
              color: '#33A1E0',
              fontWeight: '600',
              fontSize: '0.9rem'
            }}>
              <i className="fas fa-map-marker-alt me-1"></i>Location
            </Form.Label>
            <Form.Select
              size="sm"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="shadow-sm"
              style={{
                borderRadius: '8px',
                border: '2px solid #e9ecef',
                padding: '0.75rem 1rem',
                fontSize: '0.95rem'
              }}
            >
              <option value="">All Locations</option>
              <option value="Remote"><i className="fas fa-home me-1"></i>Remote</option>
              <option value="New York"><i className="fas fa-city me-1"></i>New York</option>
              <option value="Los Angeles"><i className="fas fa-city me-1"></i>Los Angeles</option>
              <option value="San Francisco"><i className="fas fa-city me-1"></i>San Francisco</option>
              <option value="Chicago"><i className="fas fa-city me-1"></i>Chicago</option>
            </Form.Select>
          </Form.Group>
        </Col>
        
        <Col md={3} sm={6}>
          <Form.Group>
            <Form.Label className="small fw-medium mb-2" style={{
              color: '#33A1E0',
              fontWeight: '600',
              fontSize: '0.9rem'
            }}>
              <i className="fas fa-clock me-1"></i>Type
            </Form.Label>
            <Form.Select
              size="sm"
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="shadow-sm"
              style={{
                borderRadius: '8px',
                border: '2px solid #e9ecef',
                padding: '0.75rem 1rem',
                fontSize: '0.95rem'
              }}
            >
              <option value="">All Types</option>
                              <option value="Full-time"><i className="fas fa-briefcase me-1"></i>Full-time</option>
                              <option value="Part-time"><i className="fas fa-clock me-1"></i>Part-time</option>
                <option value="Remote"><i className="fas fa-home me-1"></i>Remote</option>
                              <option value="Hybrid"><i className="fas fa-sync-alt me-1"></i>Hybrid</option>
            </Form.Select>
          </Form.Group>
        </Col>
        
        <Col md={3} sm={6}>
          <Form.Group>
            <Form.Label className="small fw-medium mb-2" style={{
              color: '#33A1E0',
              fontWeight: '600',
              fontSize: '0.9rem'
            }}>
              <i className="fas fa-building me-1"></i>Company
            </Form.Label>
            <Form.Select
              size="sm"
              value={filters.company}
              onChange={(e) => handleFilterChange('company', e.target.value)}
              className="shadow-sm"
              style={{
                borderRadius: '8px',
                border: '2px solid #e9ecef',
                padding: '0.75rem 1rem',
                fontSize: '0.95rem'
              }}
            >
              <option value="">All Companies</option>
              <option value="TechBridge Solutions">TechBridge Solutions</option>
              <option value="DataCorp Analytics">DataCorp Analytics</option>
              <option value="Growth Marketing Co">Growth Marketing Co</option>
            </Form.Select>
          </Form.Group>
        </Col>
        
        <Col md={3} sm={6}>
          <Form.Group>
            <Form.Label className="small fw-medium mb-2" style={{
              color: '#33A1E0',
              fontWeight: '600',
              fontSize: '0.9rem'
            }}>
              <i className="fas fa-industry me-1"></i>Industry
            </Form.Label>
            <Form.Select
              size="sm"
              value={filters.industry}
              onChange={(e) => handleFilterChange('industry', e.target.value)}
              className="shadow-sm"
              style={{
                borderRadius: '8px',
                border: '2px solid #e9ecef',
                padding: '0.75rem 1rem',
                fontSize: '0.95rem'
              }}
            >
              <option value="">All Industries</option>
              <option value="Technology"><i className="fas fa-laptop-code me-1"></i>Technology</option>
              <option value="Data Science"><i className="fas fa-chart-bar me-1"></i>Data Science</option>
              <option value="Marketing"><i className="fas fa-bullhorn me-1"></i>Marketing</option>
              <option value="Finance"><i className="fas fa-dollar-sign me-1"></i>Finance</option>
              <option value="Healthcare"><i className="fas fa-heartbeat me-1"></i>Healthcare</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-3 pt-3 border-top">
          <div className="d-flex flex-wrap gap-2">
            {searchTerm && (
              <span className="badge bg-primary">
                Search: "{searchTerm}" ✕
              </span>
            )}
            {filters.location && (
              <span className="badge bg-info">
                Location: {filters.location} ✕
              </span>
            )}
            {filters.type && (
              <span className="badge bg-warning">
                Type: {filters.type} ✕
              </span>
            )}
            {filters.company && (
              <span className="badge bg-success">
                Company: {filters.company} ✕
              </span>
            )}
            {filters.industry && (
              <span className="badge bg-secondary">
                Industry: {filters.industry} ✕
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilter; 