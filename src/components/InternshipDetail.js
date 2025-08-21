import React, { useState } from 'react';
import { Container, Card, Button, Badge, Row, Col, Modal, Form } from 'react-bootstrap';

const InternshipDetail = ({ internship, onApply, onClose }) => {
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyForm, setApplyForm] = useState({
    coverLetter: '',
    resume: null
  });

  const handleApply = (e) => {
    e.preventDefault();
    onApply(internship.id, applyForm);
    setShowApplyModal(false);
  };

  return (
    <Container className="mt-4">
      <Button variant="outline-secondary" onClick={onClose} className="mb-3">
        ← Back to Internships
      </Button>

      <Card>
        <Card.Header>
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h2>{internship.title}</h2>
              <h5 className="text-muted">{internship.company}</h5>
            </div>
            <Badge bg="primary" className="fs-6">{internship.type}</Badge>
          </div>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={8}>
              <h5>Description</h5>
              <p className="mb-4">{internship.description}</p>

              <h5>Requirements</h5>
              <ul>
                {internship.requirements?.map((req, index) => (
                  <li key={index}>{req}</li>
                )) || (
                  <li>No specific requirements listed</li>
                )}
              </ul>

              <h5>Responsibilities</h5>
              <ul>
                {internship.responsibilities?.map((resp, index) => (
                  <li key={index}>{resp}</li>
                )) || (
                  <li>Responsibilities will be discussed during the interview process</li>
                )}
              </ul>
            </Col>
            <Col md={4}>
              <Card className="border-primary">
                <Card.Header className="bg-primary text-white">
                  <h6 className="mb-0">Internship Details</h6>
                </Card.Header>
                <Card.Body>
                  <div className="mb-3">
                    <strong>Location:</strong><br />
                    {internship.location}
                  </div>
                  <div className="mb-3">
                    <strong>Type:</strong><br />
                    {internship.type}
                  </div>
                  <div className="mb-3">
                    <strong>Duration:</strong><br />
                    {internship.duration || '3-6 months'}
                  </div>
                  <div className="mb-3">
                    <strong>Deadline:</strong><br />
                    {new Date(internship.deadline).toLocaleDateString()}
                  </div>
                  <div className="mb-3">
                    <strong>Stipend:</strong><br />
                    {internship.stipend || 'Competitive'}
                  </div>
                  <Button 
                    variant="primary"
                    size="lg" 
                    className="w-100"
                    onClick={() => setShowApplyModal(true)}
                  >
                    Apply Now
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Apply Modal */}
      <Modal show={showApplyModal} onHide={() => setShowApplyModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Apply for {internship.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleApply}>
            <Form.Group className="mb-3">
              <Form.Label>Cover Letter</Form.Label>
              <Form.Control
                as="textarea"
                rows={6}
                placeholder="Tell us why you're interested in this internship and what makes you a great candidate..."
                value={applyForm.coverLetter}
                onChange={(e) => setApplyForm({...applyForm, coverLetter: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Resume/CV</Form.Label>
              <Form.Control
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setApplyForm({...applyForm, resume: e.target.files[0]})}
                required
              />
              <Form.Text className="text-muted">
                Accepted formats: PDF, DOC, DOCX (Max 5MB)
              </Form.Text>
            </Form.Group>
            <div className="d-flex gap-2">
              <Button variant="secondary" onClick={() => setShowApplyModal(false)}>
                Cancel
              </Button>
              <Button 
                variant="primary"
                type="submit"
              >
                Submit Application
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default InternshipDetail; 