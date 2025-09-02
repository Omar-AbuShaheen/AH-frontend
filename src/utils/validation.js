// Validation utility functions for CareerNest forms

// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    return { isValid: false, message: 'Email is required' };
  }
  if (!emailRegex.test(email)) {
    return { isValid: false, message: 'Please enter a valid email address' };
  }
  return { isValid: true, message: '' };
};

// Password validation
export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }
  
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long' };
  }
  
  if (password.length > 50) {
    return { isValid: false, message: 'Password must be less than 50 characters' };
  }
  
  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter' };
  }
  
  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one lowercase letter' };
  }
  
  // Check for at least one number
  if (!/\d/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one number' };
  }
  
  // Check for at least one special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one special character (!@#$%^&*...)' };
  }
  
  return { isValid: true, message: '' };
};

// Confirm password validation
export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) {
    return { isValid: false, message: 'Please confirm your password' };
  }
  
  if (password !== confirmPassword) {
    return { isValid: false, message: 'Passwords do not match' };
  }
  
  return { isValid: true, message: '' };
};

// Name validation
export const validateName = (name, fieldName = 'Name') => {
  if (!name) {
    return { isValid: false, message: `${fieldName} is required` };
  }
  
  if (name.length < 2) {
    return { isValid: false, message: `${fieldName} must be at least 2 characters long` };
  }
  
  if (name.length > 50) {
    return { isValid: false, message: `${fieldName} must be less than 50 characters` };
  }
  
  // Check for valid characters (letters, spaces, hyphens, apostrophes)
  if (!/^[a-zA-Z\s\-']+$/.test(name)) {
    return { isValid: false, message: `${fieldName} can only contain letters, spaces, hyphens, and apostrophes` };
  }
  
  return { isValid: true, message: '' };
};

// Company name validation
export const validateCompanyName = (companyName) => {
  if (!companyName) {
    return { isValid: false, message: 'Company name is required' };
  }
  
  if (companyName.length < 2) {
    return { isValid: false, message: 'Company name must be at least 2 characters long' };
  }
  
  if (companyName.length > 100) {
    return { isValid: false, message: 'Company name must be less than 100 characters' };
  }
  
  return { isValid: true, message: '' };
};

// Phone number validation
export const validatePhone = (phone) => {
  if (!phone) {
    return { isValid: true, message: '' }; // Phone is optional
  }
  
  // Remove all non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');
  
  if (cleanPhone.length < 10) {
    return { isValid: false, message: 'Phone number must have at least 10 digits' };
  }
  
  if (cleanPhone.length > 15) {
    return { isValid: false, message: 'Phone number must have less than 15 digits' };
  }
  
  return { isValid: true, message: '' };
};

// Website URL validation
export const validateWebsite = (website) => {
  if (!website) {
    return { isValid: true, message: '' }; // Website is optional
  }
  
  try {
    const url = new URL(website);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return { isValid: false, message: 'Website must start with http:// or https://' };
    }
    return { isValid: true, message: '' };
  } catch (error) {
    return { isValid: false, message: 'Please enter a valid website URL' };
  }
};

// University validation
export const validateUniversity = (university) => {
  if (!university) {
    return { isValid: true, message: '' }; // University is optional
  }
  
  if (university.length < 2) {
    return { isValid: false, message: 'University name must be at least 2 characters long' };
  }
  
  if (university.length > 100) {
    return { isValid: false, message: 'University name must be less than 100 characters' };
  }
  
  return { isValid: true, message: '' };
};

// Major validation
export const validateMajor = (major) => {
  if (!major) {
    return { isValid: true, message: '' }; // Major is optional
  }
  
  if (major.length < 2) {
    return { isValid: false, message: 'Major must be at least 2 characters long' };
  }
  
  if (major.length > 100) {
    return { isValid: false, message: 'Major must be less than 100 characters' };
  }
  
  return { isValid: true, message: '' };
};

// Graduation year validation
export const validateGraduationYear = (year) => {
  if (!year) {
    return { isValid: true, message: '' }; // Year is optional
  }
  
  const currentYear = new Date().getFullYear();
  const yearNum = parseInt(year);
  
  if (isNaN(yearNum)) {
    return { isValid: false, message: 'Please enter a valid year' };
  }
  
  if (yearNum < currentYear - 10) {
    return { isValid: false, message: 'Graduation year cannot be more than 10 years ago' };
  }
  
  if (yearNum > currentYear + 10) {
    return { isValid: false, message: 'Graduation year cannot be more than 10 years in the future' };
  }
  
  return { isValid: true, message: '' };
};

// GPA validation
export const validateGPA = (gpa) => {
  if (!gpa) {
    return { isValid: true, message: '' }; // GPA is optional
  }
  
  const gpaNum = parseFloat(gpa);
  
  if (isNaN(gpaNum)) {
    return { isValid: false, message: 'Please enter a valid GPA' };
  }
  
  if (gpaNum < 0 || gpaNum > 4.0) {
    return { isValid: false, message: 'GPA must be between 0.0 and 4.0' };
  }
  
  return { isValid: true, message: '' };
};

// Skills validation
export const validateSkills = (skills) => {
  if (!skills) {
    return { isValid: true, message: '' }; // Skills are optional
  }
  
  if (typeof skills === 'string') {
    if (skills.length > 500) {
      return { isValid: false, message: 'Skills description must be less than 500 characters' };
    }
  } else if (Array.isArray(skills)) {
    if (skills.length > 20) {
      return { isValid: false, message: 'You can add maximum 20 skills' };
    }
    
    for (let skill of skills) {
      if (skill.length > 50) {
        return { isValid: false, message: 'Each skill must be less than 50 characters' };
      }
    }
  }
  
  return { isValid: true, message: '' };
};

// Experience validation
export const validateExperience = (experience) => {
  if (!experience) {
    return { isValid: true, message: '' }; // Experience is optional
  }
  
  if (experience.length > 1000) {
    return { isValid: false, message: 'Experience description must be less than 1000 characters' };
  }
  
  return { isValid: true, message: '' };
};

// Bio validation
export const validateBio = (bio) => {
  if (!bio) {
    return { isValid: true, message: '' }; // Bio is optional
  }
  
  if (bio.length > 500) {
    return { isValid: false, message: 'Bio must be less than 500 characters' };
  }
  
  return { isValid: true, message: '' };
};

// Industry validation
export const validateIndustry = (industry) => {
  if (!industry) {
    return { isValid: true, message: '' }; // Industry is optional
  }
  
  if (industry.length < 2) {
    return { isValid: false, message: 'Industry must be at least 2 characters long' };
  }
  
  if (industry.length > 100) {
    return { isValid: false, message: 'Industry must be less than 100 characters' };
  }
  
  return { isValid: true, message: '' };
};

// Location validation
export const validateLocation = (location) => {
  if (!location) {
    return { isValid: true, message: '' }; // Location is optional
  }
  
  if (location.length < 2) {
    return { isValid: false, message: 'Location must be at least 2 characters long' };
  }
  
  if (location.length > 100) {
    return { isValid: false, message: 'Location must be less than 100 characters' };
  }
  
  return { isValid: true, message: '' };
};

// Description validation
export const validateDescription = (description) => {
  if (!description) {
    return { isValid: true, message: '' }; // Description is optional
  }
  
  if (description.length > 1000) {
    return { isValid: false, message: 'Description must be less than 1000 characters' };
  }
  
  return { isValid: true, message: '' };
};

// Requirements validation
export const validateRequirements = (requirements) => {
  if (!requirements) {
    return { isValid: true, message: '' }; // Requirements are optional
  }
  
  if (requirements.length > 1000) {
    return { isValid: false, message: 'Requirements must be less than 1000 characters' };
  }
  
  return { isValid: true, message: '' };
};

// Responsibilities validation
export const validateResponsibilities = (responsibilities) => {
  if (!responsibilities) {
    return { isValid: true, message: '' }; // Responsibilities are optional
  }
  
  if (responsibilities.length > 1000) {
    return { isValid: false, message: 'Responsibilities must be less than 1000 characters' };
  }
  
  return { isValid: true, message: '' };
};

// Duration validation
export const validateDuration = (duration) => {
  if (!duration) {
    return { isValid: true, message: '' }; // Duration is optional
  }
  
  if (duration.length > 50) {
    return { isValid: false, message: 'Duration must be less than 50 characters' };
  }
  
  return { isValid: true, message: '' };
};

// Stipend validation
export const validateStipend = (stipend) => {
  if (!stipend) {
    return { isValid: true, message: '' }; // Stipend is optional
  }
  
  if (stipend.length > 50) {
    return { isValid: false, message: 'Stipend must be less than 50 characters' };
  }
  
  return { isValid: true, message: '' };
};

// Deadline validation
export const validateDeadline = (deadline) => {
  if (!deadline) {
    return { isValid: true, message: '' }; // Deadline is optional
  }
  
  const selectedDate = new Date(deadline);
  const today = new Date();
  
  if (isNaN(selectedDate.getTime())) {
    return { isValid: false, message: 'Please enter a valid date' };
  }
  
  if (selectedDate < today) {
    return { isValid: false, message: 'Deadline cannot be in the past' };
  }
  
  return { isValid: true, message: '' };
};

// Cover letter validation
export const validateCoverLetter = (coverLetter) => {
  if (!coverLetter) {
    return { isValid: true, message: '' }; // Cover letter is optional
  }
  
  if (coverLetter.length > 2000) {
    return { isValid: false, message: 'Cover letter must be less than 2000 characters' };
  }
  
  return { isValid: true, message: '' };
};

// Generic form validation
export const validateForm = (formData, validationRules) => {
  const errors = {};
  let isValid = true;
  
  for (const [field, rule] of Object.entries(validationRules)) {
    const value = formData[field];
    const validation = rule(value, formData);
    
    if (!validation.isValid) {
      errors[field] = validation.message;
      isValid = false;
    }
  }
  
  return { isValid, errors };
};

// Password strength indicator
export const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: '', color: '' };
  
  let score = 0;
  
  // Length check
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  
  // Character variety checks
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 1;
  
  // Determine strength level
  if (score <= 2) {
    return { score, label: 'Weak', color: '#dc3545' };
  } else if (score <= 4) {
    return { score, label: 'Fair', color: '#ffc107' };
  } else if (score <= 6) {
    return { score, label: 'Good', color: '#17a2b8' };
  } else {
    return { score, label: 'Strong', color: '#28a745' };
  }
};

// Real-time validation helper
export const validateField = (fieldName, value, formData = {}) => {
  const validators = {
    email: validateEmail,
    password: validatePassword,
    confirmPassword: (val) => validateConfirmPassword(formData.password, val),
    firstName: (val) => validateName(val, 'First name'),
    lastName: (val) => validateName(val, 'Last name'),
    companyName: validateCompanyName,
    phone: validatePhone,
    website: validateWebsite,
    university: validateUniversity,
    major: validateMajor,
    graduationYear: validateGraduationYear,
    gpa: validateGPA,
    skills: validateSkills,
    experience: validateExperience,
    bio: validateBio,
    industry: validateIndustry,
    location: validateLocation,
    description: validateDescription,
    requirements: validateRequirements,
    responsibilities: validateResponsibilities,
    duration: validateDuration,
    stipend: validateStipend,
    deadline: validateDeadline,
    coverLetter: validateCoverLetter
  };
  
  const validator = validators[fieldName];
  if (validator) {
    return validator(value, formData);
  }
  
  return { isValid: true, message: '' };
};
