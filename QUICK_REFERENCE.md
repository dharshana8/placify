# QUICK REFERENCE CARD
## Placify AI - Developer Cheat Sheet

---

## 🚀 START COMMANDS

```bash
# Backend
cd backend && mvn spring-boot:run

# Frontend  
cd frontend && npm run dev
```

**URLs**:
- Frontend: http://localhost:5173
- Backend: http://localhost:8080
- API Docs: http://localhost:8080/swagger-ui.html

---

## 🔑 TEST CREDENTIALS

| Role | Email | Password |
|------|-------|----------|
| Student | student@test.com | student123 |
| Company | company@test.com | company123 |
| Department | dept@test.com | dept123 |
| Admin | admin@test.com | admin123 |

---

## 📁 KEY FILES

### Frontend
```
src/
├── services/
│   ├── api.js              # All API methods
│   ├── aiService.js        # AI integration (Gemini)
│   └── mockAiService.js    # Fallback AI
├── pages/
│   ├── student/StudentDashboard.jsx
│   ├── company/CompanyDashboard.jsx
│   ├── department/DepartmentDashboard.jsx
│   └── admin/AdminDashboard.jsx
└── components/
    ├── Sidebar.jsx
    └── ProtectedRoute.jsx
```

### Backend
```
src/main/java/com/placify/
├── controller/
│   ├── StudentController.java
│   ├── CompanyController.java
│   ├── DepartmentController.java
│   └── AdminController.java
├── service/
│   ├── StudentService.java
│   ├── CompanyService.java
│   ├── DepartmentService.java
│   └── AdminService.java
└── repository/
    └── [All JPA repositories]
```

---

## 🔧 COMMON FIXES

### AI Rate Limit Error
```javascript
// Error: "All API keys failed"
// Fix: Wait 60 seconds, keys rotate automatically
```

### Skills Not Displaying
```javascript
// Already fixed in DepartmentDashboard.jsx
// Handles both array and string formats
```

### Edit Button Not Working
```javascript
// Already fixed in CompanyDashboard.jsx
// Edit button now populates form correctly
```

### Contact Admin Not Sending
```javascript
// Already fixed in CompanyDashboard.jsx
// Now uses companyAPI.contactAdmin()
```

---

## 📡 API ENDPOINTS

### Student
```
GET    /api/student/profile
PUT    /api/student/profile
POST   /api/student/apply/{jobId}
GET    /api/student/applications
GET    /api/student/notifications
POST   /api/student/contact-admin
POST   /api/student/request-permission
```

### Company
```
GET    /api/company/profile
PUT    /api/company/profile
GET    /api/company/jobs
POST   /api/company/jobs
PUT    /api/company/jobs/{id}
DELETE /api/company/jobs/{id}
GET    /api/company/jobs/{id}/applicants
PUT    /api/company/jobs/{id}/applicants/{appId}
POST   /api/company/jobs/{id}/bulk-action
GET    /api/company/analytics
POST   /api/company/contact-admin
```

### Admin
```
GET    /api/admin/stats
GET    /api/admin/students
DELETE /api/admin/students/{id}
PUT    /api/admin/students/{id}/permission
GET    /api/admin/companies
GET    /api/admin/companies/pending
PUT    /api/admin/companies/{id}/approve
PUT    /api/admin/companies/{id}/reject
DELETE /api/admin/companies/{id}
GET    /api/admin/jobs
GET    /api/admin/applications
GET    /api/admin/placements
POST   /api/admin/announcements
GET    /api/admin/department-stats
GET    /api/admin/risk-students
```

### Department
```
GET    /api/department/students
GET    /api/department/students/filter
PUT    /api/department/students/{id}/notes
PUT    /api/department/students/{id}/marks
PUT    /api/department/students/{id}/recommend
POST   /api/department/upload-excel
GET    /api/department/analytics
POST   /api/department/announcements
```

---

## 🤖 AI FUNCTIONS

```javascript
// Placement Prediction
aiService.predictPlacement(profile)
// Returns: {probability, verdict, strengths, weaknesses, advice}

// Skill Gap Analysis
aiService.skillGapAnalysis(skills, role)
// Returns: {missingSkills, strongSkills, roadmap, estimatedWeeks}

// Mock Interview
aiService.mockInterview(role, question)
// Returns: {questions: [{q, hint}]} or {answer}

// Candidate Ranking
aiService.rankCandidates(jobTitle, skills, candidates)
// Returns: {ranked: [{name, score, reason}]}

// Department Insights
aiService.departmentInsights(deptName, stats)
// Returns: {insights: [{title, description, priority}]}

// Admin Strategy
aiService.adminStrategy(platformStats)
// Returns: {strategies: [{title, description, impact}]}
```

---

## 🐛 DEBUG TIPS

### Frontend Errors
```bash
# Open browser console
F12 → Console tab

# Check for:
- API call failures (red errors)
- State update issues
- Rendering errors
```

### Backend Errors
```bash
# Check terminal output
# Look for:
- SQL errors
- Validation errors
- Authentication errors
```

### Database Issues
```bash
# Connect to database
psql -U placify_user -d placify_ai

# Check tables
\dt

# View data
SELECT * FROM users;
SELECT * FROM students;
SELECT * FROM companies;
SELECT * FROM jobs;
```

---

## 📊 STATUS CODES

| Code | Meaning | Action |
|------|---------|--------|
| 200 | Success | ✅ All good |
| 400 | Bad Request | Check request body |
| 401 | Unauthorized | Check JWT token |
| 403 | Forbidden | Check user role |
| 404 | Not Found | Check endpoint URL |
| 500 | Server Error | Check backend logs |

---

## 🔐 SECURITY

### JWT Token
```javascript
// Stored in localStorage
const token = localStorage.getItem('token');

// Auto-added to requests via interceptor
// See: frontend/src/services/api.js
```

### Roles
```
STUDENT     → Student dashboard only
COMPANY     → Company dashboard only
DEPARTMENT  → Department dashboard only
ADMIN       → Admin dashboard only
```

---

## 📦 DEPENDENCIES

### Frontend
```json
{
  "react": "^18.2.0",
  "react-router-dom": "^6.x",
  "axios": "^1.x",
  "tailwindcss": "^3.x",
  "lucide-react": "^0.x"
}
```

### Backend
```xml
<dependencies>
  <spring-boot-starter-web/>
  <spring-boot-starter-security/>
  <spring-boot-starter-data-jpa/>
  <postgresql/>
  <jjwt/>
  <lombok/>
</dependencies>
```

---

## 🎯 QUICK TESTS

### Test Student Flow
```
1. Login as student@test.com
2. Update profile
3. Upload resume
4. Browse jobs
5. Apply to job
6. Check AI features
```

### Test Company Flow
```
1. Login as company@test.com
2. Post new job
3. Edit job
4. View applicants
5. Update status
6. Use AI ranking
```

### Test Admin Flow
```
1. Login as admin@test.com
2. Approve pending company
3. View all data
4. Send announcement
5. Generate AI strategy
```

---

## 📞 HELP

**Documentation**:
- `SYSTEM_FIX_REPORT.md` - Complete fix details
- `TESTING_GUIDE.md` - Testing instructions
- `FIX_SUMMARY.md` - Executive summary

**Common Issues**:
- AI rate limit → Wait 60 seconds
- 401 error → Re-login
- 400 error → Check request body
- Skills not showing → Already fixed
- Edit not working → Already fixed

---

## ✅ VERIFICATION

**System is working if**:
- ✅ All dashboards load
- ✅ All buttons work
- ✅ All forms submit
- ✅ AI returns JSON
- ✅ No console errors

---

**Quick Reference v1.0** | Last Updated: 2024
