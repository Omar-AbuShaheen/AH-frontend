# CareerNest Frontend 🐣

A React-based frontend for the CareerNest Internship Opportunity Portal.

## 🚀 Features

### For Students:
- **User Authentication** - Register and login functionality
- **Browse Internships** - Search and filter internship opportunities
- **Apply to Internships** - Submit applications with cover letter and resume
- **Track Applications** - Monitor application status (Applied, Shortlisted, Hired, Rejected)
- **Profile Management** - Update personal information, skills, and experience
- **Responsive Design** - Works on desktop and mobile devices

### For Admins:
- **Company Management** - Add, edit, and delete companies
- **Internship Management** - Create and manage internship listings
- **Application Review** - View and update application statuses
- **Dashboard Analytics** - Overview of companies, internships, and applications

### General Features:
- **About Us Page** - Company information, mission, vision, and team details
- **Navigation System** - Clean routing between different pages
- **Professional UI** - Modern, responsive design with Bootstrap

## 📁 Component Structure

```
src/components/
├── Home.js                 # Landing page for non-authenticated users
├── Dashboard.js            # Main dashboard for authenticated users
├── AboutUs.js             # About us page with company information
├── AuthModals.js           # Login and registration modals
├── InternshipCard.js       # Individual internship display card
├── InternshipDetail.js     # Detailed view of internship with apply form
├── ApplicationStatus.js    # Application status tracking component
├── SearchFilter.js         # Search and filter functionality
├── Profile.js             # User profile management
└── AdminPanel.js          # Admin dashboard for managing the system
```

## 🛠️ Tech Stack

- **React 18** - Frontend framework
- **React Bootstrap** - UI component library
- **Bootstrap 5** - CSS framework
- **React Hooks** - State management

## 🎯 Component Details

### Core Components:

1. **Home.js** - Welcome page with call-to-action buttons
2. **Dashboard.js** - Main interface with tabs for internships and applications
3. **AboutUs.js** - Company information, mission, vision, team, and contact details
4. **AuthModals.js** - Login and registration forms
5. **InternshipCard.js** - Compact internship display with apply button
6. **InternshipDetail.js** - Full internship details with application form
7. **ApplicationStatus.js** - Status tracking with color-coded badges
8. **SearchFilter.js** - Advanced search and filtering options
9. **Profile.js** - User profile management with skills and experience
10. **AdminPanel.js** - Admin dashboard with CRUD operations

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
