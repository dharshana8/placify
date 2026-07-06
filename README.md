# Placify AI - Campus Placement Management System

A comprehensive SaaS web application for managing campus placements with AI-powered features and multi-role dashboard system.

## 🚀 Features

### 🎓 Student Dashboard
- **Profile Management**: CGPA, skills, resume upload
- **Job Browsing**: Filter by role, salary, location
- **Application Tracking**: Real-time status updates
- **Notifications**: Announcements and updates
- **AI Features**: Resume analyzer, interview prep, skill gap analysis

### 🏢 Company Dashboard
- **Job Management**: Post, edit, delete job openings
- **Applicant Pipeline**: Advanced filtering and bulk operations
- **Candidate Comparison**: Side-by-side comparison tool
- **Analytics**: Hiring insights and performance metrics
- **AI Features**: Candidate ranking, auto-shortlisting

### 🏫 Department Dashboard
- **Student Management**: Department-specific student view
- **Excel Integration**: Upload and process student data
- **Analytics**: Department performance and placement stats
- **Internal Notes**: Private notes and recommendations

### 🛡️ Admin Dashboard
- **Complete Control**: Manage students, companies, departments
- **Approval System**: Company verification and job approval
- **Placement Tracking**: Comprehensive placement analytics
- **System Analytics**: Platform-wide insights and reports

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API calls
- **Lucide React** for icons
- **Recharts** for analytics

### Backend
- **Spring Boot 3** (Java)
- **Spring Security** with JWT
- **Spring Data JPA** with Hibernate
- **PostgreSQL** database
- **Apache POI** for Excel processing
- **WebSocket** for real-time notifications

## 📁 Project Structure

```
placify-ai/



















































































































































































































































































































































































































































































































































































































































































































├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   │   ├── auth/       # Login/Register
│   │   │   ├── student/    # Student dashboard
│   │   │   ├── company/    # Company dashboard
│   │   │   ├── department/ # Department dashboard
│   │   │   └── admin/      # Admin dashboard
│   │   ├── context/        # React contexts
│   │   ├── services/       # API services
│   │   └── utils/          # Utility functions
│   └── package.json
└── backend/                 # Spring Boot backend
    ├── src/main/java/com/placify/
    │   ├── controller/     # REST controllers
    │   ├── service/        # Business logic
    │   ├── repository/     # Data access layer
    │   ├── model/          # JPA entities
    │   ├── security/       # Security configuration
    │   ├── dto/            # Data transfer objects
    │   └── config/         # Configuration classes
    └── pom.xml
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Java 17+
- PostgreSQL 13+
- Maven 3.6+

### Backend Setup

1. **Database Setup**
   ```sql
   CREATE DATABASE placify_ai;
   CREATE USER placify_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE placify_ai TO placify_user;
   ```

2. **Configure Application Properties**
   ```properties
   # Update src/main/resources/application.properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/placify_ai
   spring.datasource.username=placify_user
   spring.datasource.password=your_password
   ```

3. **Run Backend**
   ```bash
   cd backend
   mvn clean install
   mvn spring-boot:run
   ```

### Frontend Setup

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Access Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8080

## 🔐 Authentication & Authorization

### User Roles
- **STUDENT**: Access to job browsing, applications, profile management
- **COMPANY**: Job posting, applicant management, hiring pipeline
- **DEPARTMENT**: Department-specific student management and analytics
- **ADMIN**: Complete system administration and oversight

### Security Features
- JWT-based authentication
- Role-based access control (RBAC)
- Password encryption with BCrypt
- Protected API endpoints
- CORS configuration

## 📊 Database Schema

### Core Entities
- **Users**: Base user information with roles
- **Students**: Student-specific data (CGPA, skills, resume)
- **Companies**: Company profiles and HR details
- **Departments**: Academic departments
- **Jobs**: Job postings with requirements
- **Applications**: Job applications with status tracking
- **Notifications**: Real-time notifications system

## 🔄 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Student APIs
- `GET /api/student/profile` - Get student profile
- `PUT /api/student/profile` - Update profile
- `POST /api/student/resume` - Upload resume
- `GET /api/jobs` - Browse jobs
- `POST /api/student/apply/{jobId}` - Apply for job

### Company APIs
- `GET /api/company/jobs` - Get company jobs
- `POST /api/company/jobs` - Create job posting
- `GET /api/company/jobs/{jobId}/applicants` - Get applicants
- `PUT /api/company/applications/{id}/status` - Update application status

### Admin APIs
- `GET /api/admin/stats` - Platform statistics
- `GET /api/admin/students` - Manage students
- `GET /api/admin/companies/pending` - Pending approvals
- `GET /api/admin/analytics` - System analytics

## 🎨 UI/UX Features

### Design System
- **Modern SaaS Interface**: Clean, professional design
- **Responsive Layout**: Mobile and desktop optimized
- **Dark/Light Theme**: User preference support
- **Consistent Components**: Reusable UI components
- **Smooth Animations**: Enhanced user experience

### Color Scheme
- **Primary**: Yellow/Gold theme (#f59e0b)
- **Secondary**: Gray scale for balance
- **Status Colors**: Green (success), Red (error), Blue (info)

## 🔮 AI Features (Planned)

### Student AI Tools
- **Resume Analyzer**: Score and improvement suggestions
- **Interview Prep**: AI-generated questions
- **Skill Gap Analysis**: Personalized recommendations
- **Placement Probability**: Success prediction

### Company AI Tools
- **Candidate Ranking**: AI-powered applicant scoring
- **Auto-shortlisting**: Intelligent candidate filtering
- **Hiring Insights**: Data-driven recruitment analytics

### Admin AI Tools
- **Placement Prediction**: Department and student analytics
- **Smart Matching**: Student-company compatibility
- **Trend Analysis**: Market and skill insights

## 📈 Analytics & Reporting

### Student Analytics
- Application success rates
- Skill demand analysis
- Placement probability scoring

### Company Analytics
- Hiring pipeline metrics
- Candidate quality insights
- Time-to-hire analysis

### Department Analytics
- Placement percentage tracking
- Student performance metrics
- Skill gap identification

### Admin Analytics
- Platform-wide statistics
- Department comparisons
- Market trend analysis

## 🔧 Development

### Code Structure
- **Clean Architecture**: Separation of concerns
- **Service Layer Pattern**: Business logic isolation
- **Repository Pattern**: Data access abstraction
- **DTO Pattern**: Data transfer optimization

### Best Practices
- **Error Handling**: Comprehensive error management
- **Validation**: Input validation and sanitization
- **Logging**: Structured logging for debugging
- **Testing**: Unit and integration tests
- **Documentation**: API documentation with Swagger

## 🚀 Deployment

### Production Setup
1. **Database**: PostgreSQL with connection pooling
2. **Backend**: Spring Boot with embedded Tomcat
3. **Frontend**: Static build served by Nginx
4. **Security**: HTTPS, CORS, rate limiting
5. **Monitoring**: Application performance monitoring

### Environment Variables
```bash
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=placify_ai
DB_USER=placify_user
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=86400000

# File Upload
UPLOAD_DIR=/uploads
MAX_FILE_SIZE=10MB
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Email: support@placify-ai.com
- Documentation: [Wiki](https://github.com/your-repo/placify-ai/wiki)

---

**Placify AI** - Revolutionizing campus placements with AI-powered insights and comprehensive management tools.#   p l a c i f y  
 