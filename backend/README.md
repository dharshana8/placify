# Placify AI Backend

Spring Boot backend for the Placify AI campus placement management system.

## 🚀 Quick Start

### Prerequisites
- Java 17+
- Maven 3.6+
- PostgreSQL 13+git init

### Database Setup
1. Start PostgreSQL service
2. Run the database setup script:
   ```bash
   # From project root
   ./setup-database.bat
   ```

### Running the Application
1. **Using the startup script (Recommended):**
   ```bash
   # From project root
   ./start-backend.bat
   ```

2. **Manual startup:**
   ```bash
   cd backend
   mvn clean install
   mvn spring-boot:run
   ```

The backend will start on `http://localhost:8080`

## 📋 API Endpoints

### Health Check
- `GET /api/health` - Application health status
- `GET /api/health/db` - Database connection status

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Student APIs
- `GET /api/student/profile` - Get student profile
- `PUT /api/student/profile` - Update profile (with resume upload)
- `POST /api/student/apply/{jobId}` - Apply for job
- `GET /api/student/applications` - Get applications
- `GET /api/student/notifications` - Get notifications

### Company APIs
- `GET /api/company/profile` - Get company profile
- `PUT /api/company/profile` - Update company profile
- `GET /api/company/jobs` - Get company jobs
- `POST /api/company/jobs` - Create job posting
- `PUT /api/company/jobs/{id}` - Update job
- `DELETE /api/company/jobs/{id}` - Delete job
- `GET /api/company/jobs/{id}/applicants` - Get job applicants
- `PUT /api/company/applications/{id}/status` - Update application status

### Job APIs (Public)
- `GET /api/jobs` - Browse active jobs (with filters)
- `GET /api/jobs/{id}` - Get job details

### Admin APIs
- `GET /api/admin/stats` - Platform statistics
- `GET /api/admin/students` - Manage students
- `GET /api/admin/companies/pending` - Pending company approvals

## 🔐 Sample Users

The application initializes with sample data:

### Admin
- **Email:** admin@placify.com
- **Password:** admin123

### Company (HR)
- **Email:** hr@techcorp.com
- **Password:** company123

### Student
- **Email:** student@college.edu
- **Password:** student123

## 🏗️ Architecture

### Models
- **User** - Base user entity with roles
- **Student** - Student profile with academic details
- **Company** - Company profile and HR information
- **Job** - Job postings with requirements
- **Application** - Job applications with AI scoring
- **Department** - Academic departments
- **Notification** - Real-time notifications

### Security
- JWT-based authentication
- Role-based access control (RBAC)
- Password encryption with BCrypt
- CORS configuration for frontend

### Features
- **File Upload** - Resume upload with validation
- **AI Scoring** - Automatic candidate scoring
- **Real-time Notifications** - WebSocket support
- **Excel Processing** - Bulk student data import
- **Analytics** - Placement and hiring insights

## 🔧 Configuration

### Database Configuration
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/placify_ai
spring.datasource.username=postgres
spring.datasource.password=your_password
```

### JWT Configuration
```properties
app.jwt.secret=your_jwt_secret
app.jwt.expiration=86400000
```

### File Upload Configuration
```properties
spring.servlet.multipart.max-file-size=10MB
app.upload.dir=uploads
```

## 🧪 Testing

### Manual Testing
1. Start the backend
2. Test health endpoint: `GET http://localhost:8080/api/health`
3. Register a new user: `POST http://localhost:8080/api/auth/register`
4. Login: `POST http://localhost:8080/api/auth/login`

### Sample Registration Request
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "STUDENT",
  "departmentName": "Computer Science"
}
```

### Sample Login Request
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

## 📁 Project Structure

```
backend/
├── src/main/java/com/placify/
│   ├── config/          # Security and WebSocket config
│   ├── controller/      # REST controllers
│   ├── dto/            # Data transfer objects
│   ├── exception/      # Global exception handling
│   ├── model/          # JPA entities
│   ├── repository/     # Data access layer
│   ├── security/       # JWT and authentication
│   ├── service/        # Business logic
│   └── PlacifyAiApplication.java
├── src/main/resources/
│   ├── application.properties
│   └── data.sql
└── pom.xml
```

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure PostgreSQL is running
   - Check database credentials in `application.properties`
   - Verify database `placify_ai` exists

2. **Port Already in Use**
   - Change server port in `application.properties`: `server.port=8081`

3. **File Upload Issues**
   - Check upload directory permissions
   - Verify file size limits

4. **JWT Token Issues**
   - Ensure JWT secret is properly configured
   - Check token expiration settings

### Logs
Application logs are available in the console output. For debugging:
```properties
logging.level.com.placify=DEBUG
spring.jpa.show-sql=true
```

## 🔄 Development

### Adding New Features
1. Create model entities in `model/`
2. Add repositories in `repository/`
3. Implement business logic in `service/`
4. Create REST endpoints in `controller/`
5. Add DTOs for data transfer

### Database Changes
- Use `spring.jpa.hibernate.ddl-auto=update` for development
- For production, use proper database migrations

## 📞 Support

For issues and questions:
- Check the logs for error details
- Verify database connectivity
- Ensure all dependencies are properly installed
- Check the main project README for additional setup instructions