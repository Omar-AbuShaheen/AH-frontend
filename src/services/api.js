const API_BASE_URL = 'http://localhost:5000/api';

// Token management
const getToken = () => localStorage.getItem('token');
const setToken = (token) => localStorage.setItem('token', token);
const removeToken = () => localStorage.removeItem('token');

// API request helper
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (response.status === 401) {
      // Token expired or invalid
      removeToken();
      window.location.href = '/';
      return null;
    }
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Authentication API
export const authAPI = {
  // Unified login (automatically detects role)
  login: async (credentials) => {
    return await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  },

  // Student registration
  registerStudent: async (userData) => {
    return await apiRequest('/auth/student/register', {
      method: 'POST',
      body: JSON.stringify({
        first_name: userData.firstName,
        last_name: userData.lastName,
        email: userData.email,
        major: userData.major,
        university: userData.university,
        graduation_year: userData.graduationYear,
        phone: userData.phone,
        skills: userData.skills ? userData.skills.split(',').map(skill => skill.trim()).filter(skill => skill) : [],
        experience: userData.experience || '',
        password: userData.password
      })
    });
  },

  // Company registration
  registerCompany: async (userData) => {
    return await apiRequest('/auth/company/register', {
      method: 'POST',
      body: JSON.stringify({
        company_name: userData.companyName,
        email: userData.email,
        password: userData.password,
        contact_person: userData.contactPerson,
        phone: userData.phone,
        industry: userData.industry || '',
        location: userData.location || '',
        website: userData.website || '',
        description: userData.description || ''
      })
    });
  },

  // Get current user
  getCurrentUser: async () => {
    return await apiRequest('/auth/me');
  },

  // Logout
  logout: () => {
    removeToken();
  }
};

// Internships API
export const internshipsAPI = {
  // Get all approved internships
  getAll: async () => {
    return await apiRequest('/internships');
  },

  // Get internship by ID
  getById: async (id) => {
    return await apiRequest(`/internships/${id}`);
  },

  // Search internships
  search: async (filters) => {
    const queryParams = new URLSearchParams(filters).toString();
    return await apiRequest(`/internships/search?${queryParams}`);
  },

  // Apply to internship
  apply: async (internshipId, coverLetter) => {
    return await apiRequest(`/internships/${internshipId}/apply`, {
      method: 'POST',
      body: JSON.stringify({ cover_letter: coverLetter })
    });
  },

  // Get company internships (for companies)
  getCompanyInternships: async () => {
    return await apiRequest('/internships/company/internships');
  },

  // Create internship (for companies)
  create: async (internshipData) => {
    return await apiRequest('/internships', {
      method: 'POST',
      body: JSON.stringify(internshipData)
    });
  },

  // Update internship (for companies)
  update: async (id, internshipData) => {
    return await apiRequest(`/internships/${id}`, {
      method: 'PUT',
      body: JSON.stringify(internshipData)
    });
  },

  // Delete internship (for companies)
  delete: async (id) => {
    return await apiRequest(`/internships/${id}`, {
      method: 'DELETE'
    });
  }
};

// Applications API
export const applicationsAPI = {
  // Get student applications
  getStudentApplications: async () => {
    return await apiRequest('/applications/my-applications');
  },

  // Get company applications (for companies)
  getCompanyApplications: async () => {
    return await apiRequest('/applications/company');
  },

  // Get all applications (admin)
  getAll: async () => {
    return await apiRequest('/applications');
  },

  // Update application status (admin/company)
  updateStatus: async (id, status) => {
    return await apiRequest(`/applications/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  },

  // Get application statistics
  getStats: async () => {
    return await apiRequest('/applications/stats');
  }
};

// Students API
export const studentsAPI = {
  // Get student profile
  getProfile: async () => {
    return await apiRequest('/students/profile');
  },

  // Update student profile
  updateProfile: async (profileData) => {
    return await apiRequest('/students/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  },

  // Update password
  updatePassword: async (passwordData) => {
    return await apiRequest('/students/password', {
      method: 'PUT',
      body: JSON.stringify(passwordData)
    });
  },

  // Upload resume
  uploadResume: async (file) => {
    const formData = new FormData();
    formData.append('resume', file);
    
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/internships/student/upload-resume`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Upload failed');
    }
    
    return await response.json();
  }
};

// Admin API
export const adminAPI = {
  // Get dashboard stats
  getDashboardStats: async () => {
    return await apiRequest('/admin/dashboard');
  },

  // Get all students
  getStudents: async () => {
    return await apiRequest('/admin/students');
  },

  // Get all companies
  getCompanies: async () => {
    return await apiRequest('/admin/companies');
  },

  // Get all internships
  getInternships: async () => {
    return await apiRequest('/admin/internships');
  },

  // Update user status
  updateUserStatus: async (userId, status) => {
    return await apiRequest(`/admin/users/${userId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  },

  // Approve/Reject company
  updateCompanyApproval: async (companyId, isApproved) => {
    return await apiRequest(`/admin/companies/${companyId}/approval`, {
      method: 'PATCH',
      body: JSON.stringify({ is_approved: isApproved })
    });
  }
};

export { getToken, setToken, removeToken };
