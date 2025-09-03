import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';

const InternshipCard = ({ internship, user, onApply, onViewDetails, getTypeColor, getLocationIcon }) => {
  const formatDeadline = (deadline) => {
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const daysLeft = Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24));
    
    if (daysLeft < 0) return 'Expired';
    if (daysLeft === 0) return 'Today';
    if (daysLeft === 1) return 'Tomorrow';
    return `${daysLeft} days left`;
  };

  const isExpired = new Date(internship.deadline) < new Date();

  return (
    <Card className="internship-card h-100 border-0 shadow-sm hover-shadow">
      <Card.Body className="p-4">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="flex-grow-1">
            <Card.Title className="h5 mb-2 fw-bold text-primary">
              {internship.title}
            </Card.Title>
            <div className="d-flex align-items-center mb-2">
              <i className="fas fa-building text-muted me-2"></i>
              <span className="text-dark fw-medium">{internship.company_name || 'Company Name'}</span>
            </div>
          </div>
          <Badge 
            bg={getTypeColor(internship.type)} 
            className="ms-2 px-3 py-2"
          >
            {internship.type}
          </Badge>
        </div>

        <div className="d-flex align-items-center mb-3">
          <i className={`${internship.location === 'Remote' ? 'fas fa-home' : 'fas fa-map-marker-alt'} text-muted me-2`}></i>
          <span className="text-muted small">{internship.location}</span>
        </div>

        <Card.Text className="text-muted mb-3" style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
          {internship.description && internship.description.length > 120 
            ? `${internship.description.substring(0, 120)}...` 
            : internship.description || 'No description available'
          }
        </Card.Text>

        <div className="internship-details mb-3">
          <div className="d-flex gap-2 mb-2">
            <Badge bg="secondary" className="d-flex align-items-center">
              <i className="fas fa-clock me-1"></i>
              {internship.duration || '3-6 months'}
            </Badge>
            {internship.is_remote && (
              <Badge bg="info">Remote</Badge>
            )}
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center">
          <div className="text-muted small">
            <span className="d-block">
              <i className="fas fa-calendar-alt me-1"></i>
              Deadline: {new Date(internship.deadline).toLocaleDateString()}
            </span>
            <span className={`d-block mt-1 ${isExpired ? 'text-danger' : 'text-muted'}`}>
              {formatDeadline(internship.deadline)}
            </span>
          </div>
          <div className="d-flex gap-2">
            <Button 
              variant="outline-secondary" 
              size="sm"
              className="px-3 py-2 fw-medium"
              onClick={() => onViewDetails()}
            >
              View Details
            </Button>
            <Button 
              variant="primary"
              size="sm"
              className="px-3 py-2 fw-medium"
              onClick={() => onApply(internship.id)}
              disabled={isExpired || !user}
              title={!user ? 'Please login to apply' : isExpired ? 'Application deadline has passed' : 'Apply for this internship'}
            >
              {isExpired ? 'Expired' : 'Apply Now'}
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-3 pt-3 border-top">
          <div className="row text-center">
            <div className="col-4">
              <div className="text-muted small">
                <i className="fas fa-users"></i>
              </div>
              <div className="text-muted small">
                {internship.application_count || 0} applied
              </div>
            </div>
            <div className="col-4">
              <div className="text-muted small">
                <i className="fas fa-star"></i>
              </div>
              <div className="text-muted small">4.8 rating</div>
            </div>
            <div className="col-4">
              <div className="text-muted small">
                <i className="fas fa-dollar-sign"></i>
              </div>
              <div className="text-muted small">Competitive</div>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default InternshipCard; 