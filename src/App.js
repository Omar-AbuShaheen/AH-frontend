import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavigationBar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import AboutUs from './components/AboutUs';
import InternshipsPage from './components/InternshipsPage';
import AdminPanel from './components/AdminPanel';
import CompanyDashboard from './components/CompanyDashboard';
import LoginModal from './components/LoginModal';
import RegisterModal from './components/RegisterModal';
import { authAPI, getToken, setToken, removeToken } from './services/api';
import './App.css';

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

  // Check if user is already logged in on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const token = getToken();
    if (!token) return;

    try {
      const userData = await authAPI.getCurrentUser();
      setUser(userData);
      if (userData.role === 'admin') {
        setCurrentPage('admin');
      } else if (userData.role === 'company') {
        setCurrentPage('company');
      } else {
        setCurrentPage('dashboard');
      }
    } catch (error) {
      console.log('Token invalid, logging out');
      removeToken();
      setUser(null);
    }
  };

  const showAlert = (message, type = 'info') => {
    const id = Date.now();
    setAlerts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setAlerts(prev => prev.filter(alert => alert.id !== id));
    }, 5000);
  };

  const handleLogin = async (e, response = null) => {
    console.log('👨‍🎓 App.js handleLogin called!');
    e.preventDefault();
    
    // If response is provided (from LoginModal), use it directly
    if (response) {
      console.log('📨 Using response from LoginModal:', response);
      
      if (response.token) {
        setToken(response.token);
        setUser(response.user);
        setModals({ ...modals, showLogin: false });
        
        // Navigate based on user role
        if (response.user.role === 'student') {
          console.log('🎯 Navigating to student dashboard...');
          setCurrentPage('dashboard');
          showAlert('Student login successful!', 'success');
        } else if (response.user.role === 'company') {
          console.log('🎯 Navigating to company dashboard...');
          setCurrentPage('company');
          showAlert('Company login successful!', 'success');
        } else if (response.user.role === 'admin') {
          console.log('🎯 Navigating to admin panel...');
          setCurrentPage('admin');
          showAlert('Admin login successful!', 'success');
        }
        
        // Reset form
        setLoginForm({ email: '', password: '' });
      }
      return;
    }
    
    // Fallback to the old logic if no response provided
    setLoading(true);
    try {
      console.log('📡 Calling unified auth API...');
      const response = await authAPI.login(loginForm);
      console.log('📨 Login response:', response);
      
      if (response.token) {
        setToken(response.token);
        setUser(response.user);
        setModals({ ...modals, showLogin: false });
        
        // Navigate based on user role
        if (response.user.role === 'student') {
          console.log('🎯 Navigating to student dashboard...');
          setCurrentPage('dashboard');
          showAlert('Student login successful!', 'success');
        } else if (response.user.role === 'company') {
          console.log('🎯 Navigating to company dashboard...');
          setCurrentPage('company');
          showAlert('Company login successful!', 'success');
        } else if (response.user.role === 'admin') {
          console.log('🎯 Navigating to admin panel...');
          setCurrentPage('admin');
          showAlert('Admin login successful!', 'success');
        }
        
        // Reset form
        setLoginForm({ email: '', password: '' });
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      showAlert(error.message || 'Login failed', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e) => {
    // This function is now handled by the unified login
    console.log('👑 Admin login handled by unified login');
  };

  const handleCompanyLogin = async (e) => {
    // This function is now handled by the unified login
    console.log('🏢 Company login handled by unified login');
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


  const handleLogout = async () => {
    authAPI.logout();
    setUser(null);
    setCurrentPage('home');
    showAlert('Logged out successfully', 'info');
  };

  const handleProfileUpdate = (updatedUser) => {
    setUser(updatedUser);
    showAlert('Profile updated successfully!', 'success');
  };

  const renderPage = () => {
    console.log('🎭 renderPage called with currentPage:', currentPage, 'user:', user);
    
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
        return user ? <Dashboard user={user} onNavigate={setCurrentPage} onProfileUpdate={handleProfileUpdate} /> : <Home 
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
