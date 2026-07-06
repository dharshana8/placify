# Placify AI - Development Setup Guide

## 🚀 Quick Start

### Prerequisites
- **Java 17+** (for Spring Boot backend)
- **Node.js 18+** (for React frontend)
- **PostgreSQL 13+** (database)
- **Maven 3.6+** (for Java build)

### 1. Database Setup

```sql
-- Connect to PostgreSQL as superuser
CREATE DATABASE placify_ai;
CREATE USER placify_user WITH PASSWORD 'placify123';
GRANT ALL PRIVILEGES ON DATABASE placify_ai TO placify_user;
```

### 2. Backend Configuration

Update `backend/src/main/resources/application.properties`:

```properties
# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/placify_ai
spring.datasource.username=placify_user
spring.datasource.password=placify123

# JWT Configuration
jwt.secret=mySecretKey123456789012345678901234567890
jwt.expiration=86400000

# File Upload Configuration
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
upload.dir=./uploads
```

### 3. Easy Startup (Windows)

Simply double-click `start.bat` - it will:
- Install frontend dependencies
- Start backend server on port 8080
- Start frontend dev server on port 5173

### 4. Manual Startup

**Backend:**
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### 5. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080
- **API Documentation**: http://localhost:8080/swagger-ui.html (when implemented)

## 🔐 Default Test Accounts

Create these accounts through the registration page:

### Admin Account
- **Email**: admin@placify.com
- **Password**: admin123
- **Role**: ADMIN

### Student Account
- **Email**: student@college.edu
- **Password**: student123
- **Role**: STUDENT

### Company Account
- **Email**: hr@company.com
- **Password**: company123
- **Role**: COMPANY

### Department Account
- **Email**: dept@college.edu
- **Password**: dept123
- **Role**: DEPARTMENT

## 📁 Project Structure

```
placify-ai/
├── backend/                 # Spring Boot backend
│   ├── src/main/java/com/placify/
│   │   ├── controller/     # REST controllers
│   │   ├── service/        # Business logic
│   │   ├── repository/     # Data access
│   │   ├── model/          # JPA entities
│   │   ├── security/       # Security config
│   │   ├── dto/            # Data transfer objects
│   │   └── config/         # Configuration
│   └── pom.xml
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React contexts
│   │   ├── services/       # API services
│   │   └── utils/          # Utilities
│   └── package.json
├── start.bat              # Windows startup script
└── README.md
```

## 🛠️ Development Workflow

### 1. Backend Development
- Controllers handle HTTP requests
- Services contain business logic
- Repositories handle database operations
- DTOs for data transfer
- Security layer handles authentication

### 2. Frontend Development
- React components with hooks
- Context for state management
- Axios for API calls
- Tailwind CSS for styling
- React Router for navigation

### 3. API Integration
- All API calls go through `src/services/api.js`
- JWT tokens handled automatically
- Error handling with interceptors
- Role-based access control

## 🔧 Common Development Tasks

### Adding a New API Endpoint

1. **Create DTO** (if needed):
```java
// backend/src/main/java/com/placify/dto/NewDto.java
public class NewDto {
    private String field;
    // getters and setters
}
```

2. **Add Service Method**:
```java
// backend/src/main/java/com/placify/service/SomeService.java
public ResponseDto someMethod(RequestDto request) {
    // business logic
    return response;
}
```

3. **Add Controller Endpoint**:
```java
// backend/src/main/java/com/placify/controller/SomeController.java
@PostMapping("/endpoint")
public ResponseEntity<ResponseDto> endpoint(@RequestBody RequestDto request) {
    return ResponseEntity.ok(service.someMethod(request));
}
```

4. **Add Frontend API Call**:
```javascript
// frontend/src/services/api.js
export const someAPI = {
  someMethod: (data) => api.post('/endpoint', data),
};
```

### Adding a New Page

1. **Create Component**:
```jsx
// frontend/src/pages/role/NewPage.jsx
const NewPage = () => {
  return <div>New Page Content</div>;
};
export default NewPage;
```

2. **Add to Sidebar**:
```jsx
// frontend/src/components/Sidebar.jsx
// Add to appropriate role's menu items
{ id: 'new-page', label: 'New Page', icon: SomeIcon }
```

3. **Add Route** (if needed):
```jsx
// frontend/src/App.jsx
// Add to Routes if it's a separate page
```

## 🐛 Troubleshooting

### Backend Issues
- **Port 8080 in use**: Change port in `application.properties`
- **Database connection**: Check PostgreSQL is running
- **Maven build fails**: Ensure Java 17+ is installed

### Frontend Issues
- **Port 5173 in use**: Vite will automatically use next available port
- **API calls fail**: Check backend is running on port 8080
- **Build errors**: Delete `node_modules` and run `npm install`

### Common Errors
- **CORS errors**: Backend has CORS configured for localhost:5173
- **JWT expired**: Tokens expire after 24 hours, login again
- **Database errors**: Check PostgreSQL connection and credentials

## 📚 Learning Resources

### Spring Boot
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Security](https://spring.io/projects/spring-security)
- [Spring Data JPA](https://spring.io/projects/spring-data-jpa)

### React
- [React Documentation](https://react.dev/)
- [React Router](https://reactrouter.com/)
- [Tailwind CSS](https://tailwindcss.com/)

### Database
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [JPA/Hibernate](https://hibernate.org/orm/documentation/)

## 🚀 Deployment

### Development
- Use `start.bat` for local development
- Both servers run in development mode with hot reload

### Production
- Build frontend: `cd frontend && npm run build`
- Package backend: `cd backend && mvn clean package`
- Deploy JAR file with built frontend assets
- Configure production database and environment variables

---

**Happy Coding! 🎉**

For issues or questions, check the main README.md or create an issue on GitHub.