import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { studentsAPI } from '../services/api';

const Profile = ({ user, onUpdateProfile }) => {
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    major: user?.major || '',
    phone: user?.phone || '',
    university: user?.university || '',
    graduationYear: user?.graduation_year || '',
    skills: Array.isArray(user?.skills) ? user.skills : (user?.skills ? user.skills.split(',').map(skill => skill.trim()).filter(skill => skill) : []),
    experience: user?.experience || '',
    resume: user?.resume || null
  });

  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch latest profile data when component mounts
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const profileData = await studentsAPI.getProfile();
      
      // Handle skills field - convert string to array if needed
      let skills = [];
      if (profileData.skills) {
        if (Array.isArray(profileData.skills)) {
          skills = profileData.skills;
        } else if (typeof profileData.skills === 'string') {
          skills = profileData.skills.split(',').map(skill => skill.trim()).filter(skill => skill);
        }
      }
      
      setProfile({
        name: profileData.name || '',
        email: profileData.email || '',
        major: profileData.major || '',
        phone: profileData.phone || '',
        university: profileData.university || '',
        graduationYear: profileData.graduation_year || '',
        skills: skills,
        experience: profileData.experience || '',
        resume: profileData.resume || null
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Prepare data for backend (convert graduationYear to graduation_year)
      const updateData = {
        name: profile.name,
        major: profile.major,
        university: profile.university,
        graduation_year: profile.graduationYear,
        phone: profile.phone,
        skills: profile.skills,
        experience: profile.experience
      };
      
      const result = await studentsAPI.updateProfile(updateData);
      
      // Update the user data in parent component
      if (onUpdateProfile && result.user) {
        onUpdateProfile(result.user);
      }
      
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    } finally {
      setLoading(false);
    }
  };



  return (
    <Container className="mt-4">
      <h2 className="mb-4">My Profile</h2>

      {showAlert && (
        <Alert variant="success" dismissible onClose={() => setShowAlert(false)}>
          Profile updated successfully!
        </Alert>
      )}

      <Card>
        <Card.Header>
          <h4>Personal Information</h4>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Major/Field of Study</Form.Label>
                  <Form.Control
                    type="text"
                    value={profile.major}
                    onChange={(e) => setProfile({...profile, major: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>University</Form.Label>
                  <Form.Control
                    type="text"
                    value={profile.university}
                    onChange={(e) => setProfile({...profile, university: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Expected Graduation Year</Form.Label>
                  <Form.Control
                    type="number"
                    min="2024"
                    max="2030"
                    value={profile.graduationYear}
                    onChange={(e) => setProfile({...profile, graduationYear: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Skills</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g., JavaScript, React, Python, SQL"
                value={profile.skills ? (Array.isArray(profile.skills) ? profile.skills.join(', ') : profile.skills) : ''}
                onChange={(e) => {
                  const skillsArray = e.target.value.split(',').map(skill => skill.trim()).filter(skill => skill);
                  setProfile({...profile, skills: skillsArray});
                }}
              />
              <Form.Text className="text-muted">
                Enter skills separated by commas
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Experience & Achievements</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Describe your relevant experience, projects, achievements..."
                value={profile.experience}
                onChange={(e) => setProfile({...profile, experience: e.target.value})}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Resume/CV</Form.Label>
              <Form.Control
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setProfile({...profile, resume: e.target.files[0]})}
              />
              <Form.Text className="text-muted">
                Upload your latest resume (PDF, DOC, DOCX - Max 5MB)
              </Form.Text>
            </Form.Group>

            <div className="d-flex gap-2">
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button variant="outline-secondary" type="button" onClick={fetchProfile}>
                Reset
              </Button>
              <Button variant="outline-info" type="button" onClick={fetchProfile}>
                Refresh
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Profile; 