import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavigationBar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import StudentDashboard from './components/StudentDashboard';
import AboutUs from './components/AboutUs';
import InternshipsPage from './components/InternshipsPage';
import AdminPanel from './components/AdminPanel';
import CompanyDashboard from './components/CompanyDashboard';
import LoginModal from './components/LoginModal';
import RegisterModal from './components/RegisterModal';
import { authAPI, getToken, setToken, removeToken } from './services/api';
import './index.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [user, setUser] = useState(null);
  const [modals, setModals] = useState({
    showLogin: false,
    showRegister: false
  });
  const [currentPage, setCurrentPage] = useState('home');
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  const [registerForm, setRegisterForm] = useState({
    role: 'student', // Add role selection
    firstName: '',
    lastName: '',
    email: '',
    major: '',
    university: '',
    graduationYear: '',
    phone: '',
    skills: '',
    experience: '',
    password: '',
    // Company fields
    companyName: '',
    contactPerson: '',
    industry: '',
    location: '',
    website: '',
    description: ''
  });


  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);

  const showAlert = (message, type) => {
    const id = Date.now();
    setAlerts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setAlerts(prev => prev.filter(alert => alert.id !== id));
    }, 5000);
  };

  // Check token validity on app start
  useEffect(() => {
    console.log('App useEffect: Checking authentication...');
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.role) {
          setUser(user);
          
          // Navigate to appropriate dashboard based on user role
          if (user.role === 'student') {
            setCurrentPage('dashboard');
          } else if (user.role === 'company') {
            setCurrentPage('company');
          } else if (user.role === 'admin') {
            setCurrentPage('admin');
          } else {
            setCurrentPage('home');
          }
        } else {
          // Invalid user data, clear everything
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
          setCurrentPage('home');
        }
      } catch (error) {
        // Error parsing user data, clear everything
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setCurrentPage('home');
      }
    } else {
      // No token, ensure user is logged out
      setUser(null);
      setCurrentPage('home');
    }
  }, []);

  const handleLogin = (user) => {
    setUser(user);
    
    // Navigate based on user role
    if (user.role === 'student') {
      setCurrentPage('dashboard');
    } else if (user.role === 'company') {
      setCurrentPage('company');
    } else if (user.role === 'admin') {
      setCurrentPage('admin');
    }
    
    showAlert(`Welcome back, ${user.first_name || user.name || 'User'}!`, 'success');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setCurrentPage('home');
    showAlert('Logged out successfully', 'info');
  };

  const handleProfileUpdate = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    showAlert('Profile updated successfully!', 'success');
  };

  const handleUnifiedLogin = async (credentials) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Navigate based on user role
        if (data.user.role === 'student') {
          setCurrentPage('dashboard');
        } else if (data.user.role === 'company') {
          setCurrentPage('company');
        } else if (data.user.role === 'admin') {
          setCurrentPage('admin');
        }
        
        setUser(data.user);
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }
    } catch (error) {
      throw error;
    }
  };

  const handleAdminLogin = async (credentials) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        setCurrentPage('admin');
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }
    } catch (error) {
      throw error;
    }
  };

  const handleCompanyLogin = async (credentials) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        setCurrentPage('company');
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }
    } catch (error) {
      throw error;
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await authAPI.registerStudent(registerForm);
      if (response.token) {
        setToken(response.token);
        setUser(response.user);
        setModals({ ...modals, showRegister: false });
        setCurrentPage('dashboard');
        showAlert('Registration successful!', 'success');
        // Reset form
        setRegisterForm({ role: 'student', firstName: '', lastName: '', email: '', major: '', university: '', graduationYear: '', phone: '', skills: '', experience: '', password: '', companyName: '', contactPerson: '', industry: '', location: '', website: '', description: '' });
      }
    } catch (error) {
      showAlert(error.message || 'Registration failed', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleCompanyRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await authAPI.registerCompany(registerForm);
      if (response.token) {
        setToken(response.token);
        setUser(response.user);
        setModals({ ...modals, showRegister: false });
        setCurrentPage('company');
        showAlert('Company registration successful!', 'success');
        // Reset form
        setRegisterForm({ role: 'student', firstName: '', lastName: '', email: '', major: '', university: '', graduationYear: '', phone: '', skills: '', experience: '', password: '', companyName: '', contactPerson: '', industry: '', location: '', website: '', description: '' });
      }
    } catch (error) {
      showAlert(error.message || 'Company registration failed', 'danger');
    } finally {
      setLoading(false);
    }
  };






  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home 
          onShowLogin={() => setModals({ ...modals, showLogin: true })}
          onShowRegister={() => setModals({ ...modals, showRegister: true })}
        />;
      case 'about':
        return <AboutUs />;
      case 'internships':
        return <InternshipsPage user={user} onNavigate={setCurrentPage} />;
      case 'dashboard':
        return user ? <StudentDashboard user={user} onNavigate={setCurrentPage} onProfileUpdate={handleProfileUpdate} /> : <Home 
          onShowLogin={() => setModals({ ...modals, showLogin: true })}
          onShowRegister={() => setModals({ ...modals, showRegister: true })}
        />;
      case 'admin':
        return user && user.role === 'admin' ? <AdminPanel user={user} onNavigate={setCurrentPage} /> : <Home 
          onShowLogin={() => setModals({ ...modals, showLogin: true })}
          onShowRegister={() => setModals({ ...modals, showRegister: true })}
        />;
      case 'company':
        return user && user.role === 'company' ? <CompanyDashboard user={user} onNavigate={setCurrentPage} /> : <Home 
          onShowLogin={() => setModals({ ...modals, showLogin: true })}
          onShowRegister={() => setModals({ ...modals, showRegister: true })}
        />;
      default:
        return <Home 
          onShowLogin={() => setModals({ ...modals, showLogin: true })}
          onShowRegister={() => setModals({ ...modals, showRegister: true })}
        />;
    }
  };

  return (
    <div className="App">
      <NavigationBar 
        user={user} 
        currentPage={currentPage}
        onNavigate={setCurrentPage} 
        onLogout={handleLogout}
        onShowLogin={() => setModals({ ...modals, showLogin: true })}
        onShowRegister={() => setModals({ ...modals, showRegister: true })}

      />
      
      <main className="main-content">
        <Container fluid>
          {alerts.map(alert => (
            <div key={alert.id} className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
              {alert.message}
              <button type="button" className="btn-close" onClick={() => setAlerts(prev => prev.filter(a => a.id !== alert.id))}></button>
            </div>
          ))}
          
          {renderPage()}
        </Container>
      </main>

      <Footer />

      <LoginModal
        show={modals.showLogin}
        onHide={() => setModals({ ...modals, showLogin: false })}
        loginForm={loginForm}
        onLoginChange={setLoginForm}
        onLogin={handleLogin}
        loading={loading}
        onAdminLogin={handleAdminLogin}
        onCompanyLogin={handleCompanyLogin}
      />

      <RegisterModal
        show={modals.showRegister}
        onHide={() => setModals({ ...modals, showRegister: false })}
        registerForm={registerForm}
        onRegisterChange={setRegisterForm}
        onRegister={handleRegister}
        loading={loading}
        onCompanyRegister={handleCompanyRegister}
      />
    </div>
  );
}

export default App;
