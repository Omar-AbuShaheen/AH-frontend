// Validation utility functions for CareerNest forms

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return 'Email is required';
  if (!emailRegex.test(email)) return 'Please enter a valid email address';
  return null;
};

export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters long';
  if (password.length > 50) return 'Password must be less than 50 characters';
  return null;
};

export const validateName = (name, fieldName = 'Name') => {
  if (!name) return `${fieldName} is required`;
  if (name.length < 2) return `${fieldName} must be at least 2 characters long`;
  if (name.length > 50) return `${fieldName} must be less than 50 characters`;
  if (!/^[a-zA-Z\s]+$/.test(name)) return `${fieldName} can only contain letters and spaces`;
  return null;
};

export const validateCompanyName = (companyName) => {
  if (!companyName) return 'Company name is required';
  if (companyName.length < 2) return 'Company name must be at least 2 characters long';
  if (companyName.length > 200) return 'Company name must be less than 200 characters';
  return null;
};

export const validatePhone = (phone) => {
  if (!phone) return 'Phone number is required';
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) {
    return 'Please enter a valid phone number';
  }
  return null;
};

export const validateUniversity = (university) => {
  if (!university) return 'University is required';
  if (university.length < 3) return 'University name must be at least 3 characters long';
  if (university.length > 100) return 'University name must be less than 100 characters';
  return null;
};

export const validateMajor = (major) => {
  if (!major) return 'Major/Field of study is required';
  if (major.length < 2) return 'Major must be at least 2 characters long';
  if (major.length > 100) return 'Major must be less than 100 characters';
  return null;
};

export const validateGraduationYear = (year) => {
  if (!year) return 'Graduation year is required';
  const currentYear = new Date().getFullYear();
  const yearNum = parseInt(year);
  if (isNaN(yearNum)) return 'Please enter a valid year';
  if (yearNum < currentYear) return 'Graduation year cannot be in the past';
  if (yearNum > currentYear + 10) return 'Graduation year cannot be more than 10 years in the future';
  return null;
};

export const validateSkills = (skills) => {
  if (!skills) return null; // Skills are optional
  if (skills.length > 500) return 'Skills description must be less than 500 characters';
  return null;
};

export const validateExperience = (experience) => {
  if (!experience) return null; // Experience is optional
  if (experience.length > 1000) return 'Experience description must be less than 1000 characters';
  return null;
};

export const validateIndustry = (industry) => {
  if (!industry) return null; // Industry is optional
  if (industry.length > 100) return 'Industry must be less than 100 characters';
  return null;
};

export const validateLocation = (location) => {
  if (!location) return null; // Location is optional
  if (location.length > 100) return 'Location must be less than 100 characters';
  return null;
};

export const validateWebsite = (website) => {
  if (!website) return null; // Website is optional
  const urlRegex = /^https?:\/\/.+/;
  if (!urlRegex.test(website)) return 'Please enter a valid website URL starting with http:// or https://';
  if (website.length > 255) return 'Website URL must be less than 255 characters';
  return null;
};

export const validateDescription = (description) => {
  if (!description) return null; // Description is optional
  if (description.length > 1000) return 'Description must be less than 1000 characters';
  return null;
};

// Form validation functions
export const validateLoginForm = (formData) => {
  const errors = {};
  
  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;
  
  const passwordError = validatePassword(formData.password);
  if (passwordError) errors.password = passwordError;
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateRegisterForm = (formData) => {
  const errors = {};
  
  // Common fields for both roles
  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;
  
  const passwordError = validatePassword(formData.password);
  if (passwordError) errors.password = passwordError;
  
  const phoneError = validatePhone(formData.phone);
  if (phoneError) errors.phone = phoneError;
  
  // Role-specific validation
  if (formData.role === 'student') {
    const firstNameError = validateName(formData.firstName, 'First name');
    if (firstNameError) errors.firstName = firstNameError;
    
    const lastNameError = validateName(formData.lastName, 'Last name');
    if (lastNameError) errors.lastName = lastNameError;
    
    const universityError = validateUniversity(formData.university);
    if (universityError) errors.university = universityError;
    
    const majorError = validateMajor(formData.major);
    if (majorError) errors.major = majorError;
    
    const graduationYearError = validateGraduationYear(formData.graduationYear);
    if (graduationYearError) errors.graduationYear = graduationYearError;
    
    const skillsError = validateSkills(formData.skills);
    if (skillsError) errors.skills = skillsError;
    
    const experienceError = validateExperience(formData.experience);
    if (experienceError) errors.experience = experienceError;
  } else if (formData.role === 'company') {
    const companyNameError = validateCompanyName(formData.companyName);
    if (companyNameError) errors.companyName = companyNameError;
    
    const contactPersonError = validateName(formData.contactPerson, 'Contact person');
    if (contactPersonError) errors.contactPerson = contactPersonError;
    
    const industryError = validateIndustry(formData.industry);
    if (industryError) errors.industry = industryError;
    
    const locationError = validateLocation(formData.location);
    if (locationError) errors.location = locationError;
    
    const websiteError = validateWebsite(formData.website);
    if (websiteError) errors.website = websiteError;
    
    const descriptionError = validateDescription(formData.description);
    if (descriptionError) errors.description = descriptionError;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Real-time validation helpers
export const getFieldError = (fieldName, errors) => {
  return errors[fieldName] || null;
};

export const isFieldValid = (fieldName, errors) => {
  return !errors[fieldName];
};
