import React from 'react';
import { Badge, Card } from 'react-bootstrap';

const ApplicationStatus = ({ application }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Applied': return 'secondary';
      case 'Shortlisted': return 'warning';
      case 'Hired': return 'success';
      case 'Rejected': return 'danger';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Applied': return 'fas fa-file-alt';
      case 'Shortlisted': return 'fas fa-star';
      case 'Hired': return 'fas fa-trophy';
      case 'Rejected': return 'fas fa-times-circle';
      default: return 'fas fa-file-alt';
    }
  };

  const getDaysSinceApplied = (appliedDate) => {
    const days = Math.ceil((new Date() - new Date(appliedDate)) / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <Card className="application-status-card mb-3 border-0 shadow-sm">
      <Card.Body className="p-4">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="flex-grow-1">
            <div className="d-flex align-items-center mb-2">
              <h6 className="mb-0 fw-bold text-primary me-2">
                {application.internshipTitle}
              </h6>
              <Badge 
                bg={getStatusColor(application.status)} 
                className="px-3 py-2"
              >
                <i className={`${getStatusIcon(application.status)} me-1`}></i>
                {application.status}
              </Badge>
            </div>
            <div className="d-flex align-items-center text-muted mb-2">
              <span className="me-3"><i className="fas fa-building me-1"></i>{application.company}</span>
              <span><i className="fas fa-calendar me-1"></i>Applied {getDaysSinceApplied(application.appliedDate)} days ago</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress mb-3" style={{ height: '8px' }}>
          <div 
            className={`progress-bar bg-${getStatusColor(application.status)}`}
            style={{ 
              width: application.status === 'Applied' ? '25%' : 
                     application.status === 'Shortlisted' ? '50%' : 
                     application.status === 'Hired' ? '100%' : '0%' 
            }}
          ></div>
        </div>

        {/* Status Timeline */}
        <div className="status-timeline">
          <div className="row text-center">
            <div className="col-3">
              <div className={`status-step ${application.status !== 'Rejected' ? 'completed' : ''}`}>
                <div className="status-icon"><i className="fas fa-file-alt"></i></div>
                <div className="status-label small">Applied</div>
              </div>
            </div>
            <div className="col-3">
              <div className={`status-step ${['Shortlisted', 'Hired'].includes(application.status) ? 'completed' : ''}`}>
                <div className="status-icon"><i className="fas fa-star"></i></div>
                <div className="status-label small">Shortlisted</div>
              </div>
            </div>
            <div className="col-3">
              <div className={`status-step ${application.status === 'Hired' ? 'completed' : ''}`}>
                <div className="status-icon"><i className="fas fa-trophy"></i></div>
                <div className="status-label small">Hired</div>
              </div>
            </div>
            <div className="col-3">
              <div className={`status-step ${application.status === 'Rejected' ? 'rejected' : ''}`}>
                <div className="status-icon"><i className="fas fa-times-circle"></i></div>
                <div className="status-label small">Rejected</div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-3 pt-3 border-top">
          <div className="row text-center">
            <div className="col-4">
              <div className="text-muted small"><i className="fas fa-chart-bar"></i></div>
              <div className="text-muted small">Application #1234</div>
            </div>
            <div className="col-4">
              <div className="text-muted small"><i className="fas fa-file-alt"></i></div>
              <div className="text-muted small">Resume Submitted</div>
            </div>
            <div className="col-4">
              <div className="text-muted small"><i className="fas fa-envelope"></i></div>
              <div className="text-muted small">Email Sent</div>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ApplicationStatus; 