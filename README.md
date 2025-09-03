# CareerNest Frontend 🐣

A modern React-based frontend for the CareerNest Internship Opportunity Portal with comprehensive user management and messaging system.

## 🚀 Features

### For Students:
- **User Authentication** - Unified login/register system with role-based access
- **Browse Internships** - Advanced search and filter internship opportunities
- **Apply to Internships** - Submit applications with cover letter
- **Track Applications** - Monitor application status with company messages
- **Company Messages** - Receive personalized letters from companies (hired/rejected)
- **Enhanced Profile Management** - Complete profile with education, skills, links, and experience
- **Professional Dashboard** - Overview, internships, applications, and profile tabs
- **Responsive Design** - Modern UI works on all devices

### For Companies:
- **Company Dashboard** - Manage internships and review applications
- **Internship Management** - Create, edit, and manage internship listings
- **Application Review** - Review student applications with detailed profiles
- **Messaging System** - Send personalized messages to students (hire/reject letters)
- **Application Status Updates** - Update application status with custom messages
- **Profile Management** - Manage company information and contact details

### For Admins:
- **Admin Panel** - Complete system management dashboard
- **Company Management** - Approve, edit, and manage companies
- **Internship Management** - Approve and manage all internship listings
- **Application Review** - Overview of all applications across the platform
- **Student Management** - View and manage student profiles
- **Approval System** - Control company and internship approval workflow

### General Features:
- **Professional UI/UX** - Modern, clean design with Bootstrap and Font Awesome
- **Messaging System** - Company-to-student communication for application updates
- **Real-time Updates** - Dynamic content updates without page refresh
- **Form Validation** - Comprehensive validation with real-time feedback
- **Professional Navigation** - Tab-based dashboards with role-based access

## 📁 Component Structure

```
src/components/
├── Home.js                 # Landing page with hero section
├── StudentDashboard.js     # Student dashboard with tabs (overview, internships, applications, profile)
├── CompanyDashboard.js     # Company dashboard with messaging system
├── AdminPanel.js          # Admin panel for system management
├── AboutUs.js             # Professional about us page
├── InternshipsPage.js     # Browse internships with advanced filtering
├── LoginModal.js          # Unified login modal with role selection
├── RegisterModal.js       # Registration modal with validation
├── InternshipCard.js      # Individual internship display card
├── SearchFilter.js        # Advanced search and filter functionality
├── Navbar.js              # Navigation bar with role-based menu
├── Footer.js              # Professional footer with links
└── Profile.js             # Detailed profile management component
```

## 🛠️ Tech Stack

- **React 18** - Frontend framework with hooks and functional components
- **React Bootstrap** - UI component library for responsive design
- **Bootstrap 5** - CSS framework with custom professional styling
- **Font Awesome** - Icon library for professional UI elements
- **React Hooks** - State management (useState, useEffect)
- **Local Storage** - Client-side authentication and user data persistence

## 🎯 Component Details

### Dashboard Components:

1. **StudentDashboard.js** - Multi-tab interface with:
   - Overview: Statistics and recent activity
   - Browse Internships: Advanced search and filtering
   - My Applications: Application tracking with company messages
   - Profile: Complete profile management with social links

2. **CompanyDashboard.js** - Company management interface with:
   - Overview: Company statistics and metrics
   - Internship Management: Create and manage internship listings
   - Application Management: Review applications with messaging system
   - Profile: Company information and contact details

3. **AdminPanel.js** - System administration with:
   - Dashboard Overview: Platform statistics
   - Company Management: Approve and manage companies
   - Internship Management: Approve and oversee all internships
   - Application Management: Monitor all applications
   - Student Management: View student profiles

### Core Features:

4. **Messaging System** - Companies can send personalized messages to students:
   - Hire notifications with contact information
   - Rejection letters with feedback
   - Automatic status updates
   - Professional message templates

5. **Enhanced Profile Management** - Comprehensive student profiles:
   - Personal information (name, email, phone, location, DOB)
   - Education details (university, major, GPA, graduation year)
   - Professional data (skills, experience, bio, additional education)
   - Social links (LinkedIn, GitHub, Portfolio)

6. **Professional UI Components** - Modern interface elements:
   - Tab-based navigation
   - Modal dialogs for detailed operations
   - Real-time form validation
   - Responsive design with Bootstrap
   - Font Awesome icons throughout

## 🚀 Getting Started

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Start Development Server:**
   ```bash
   npm start
   ```

3. **Build for Production:**
   ```bash
   npm run build
   ```

## 📱 User Interface

### Student Features:
- Clean, modern interface with Bootstrap styling
- Intuitive navigation between internships and applications
- Real-time search and filtering capabilities
- Professional application forms with file upload
- Status tracking with visual indicators

### Admin Features:
- Comprehensive dashboard with statistics
- Table-based data management
- Modal forms for adding companies and internships
- Status update functionality for applications

### About Us Page:
- Company mission and vision statements
- Team member profiles and roles
- Impact statistics and achievements
- Contact information and location details
- Professional values and principles

## 🔧 Customization

The frontend is built with modular components that can be easily customized:

- **Styling**: Modify Bootstrap classes or add custom CSS
- **Components**: Each component is self-contained and reusable
- **Data**: Mock data can be replaced with API calls
- **Features**: New components can be added to extend functionality

## 📊 Mock Data

The application currently uses mock data for:
- Internships (3 sample listings)
- Companies (2 sample companies)
- Applications (1 sample application)
- User profiles
- Team members and company information

## 🔗 Integration

Ready for backend integration with:
- RESTful API endpoints
- Authentication system
- File upload functionality
- Real-time updates

## 🎨 Design Principles

- **Responsive**: Mobile-first design approach
- **Accessible**: Bootstrap accessibility features
- **User-friendly**: Intuitive navigation and clear CTAs
- **Professional**: Clean, modern aesthetic suitable for career portal

## 📄 Pages

1. **Home Page** - Landing page with welcome message and CTAs
2. **About Us** - Company information, team, and contact details
3. **Dashboard** - Main application interface for authenticated users
4. **Login/Register** - Authentication modals

---

**CareerNest** — Where Opportunities Hatch 🐣
