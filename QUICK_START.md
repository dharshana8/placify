# 🚀 Placify AI - Quick Start Guide

## Prerequisites
- ✅ Java 17+ installed
- ✅ Node.js 18+ installed
- ✅ PostgreSQL 13+ installed and running
- ✅ Maven 3.6+ installed

## Step-by-Step Setup

### 1️⃣ Database Setup (One-time)

Open PostgreSQL and run:
```sql
CREATE DATABASE placify_ai;
CREATE USER placify_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE placify_ai TO placify_user;
```

### 2️⃣ Backend Configuration (One-time)

Edit `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/placify_ai
spring.datasource.username=placify_user
spring.datasource.password=your_password
```

### 3️⃣ Start Backend

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Wait for: `Started PlacifyApplication in X seconds`

### 4️⃣ Start Frontend

Open a new terminal:
```bash
cd frontend
npm install
npm run dev
```

Wait for: `Local: http://localhost:5173/`

### 5️⃣ Seed Data

**Option A - Using HTML Page (Recommended)**:
1. Open `SEED_DATA.html` in your browser
2. Click "🚀 Seed Companies & Jobs" button
3. Wait for success message

**Option B - Using curl**:
```bash
curl -X POST http://localhost:8080/api/admin/seed-companies-jobs
```

**Option C - Using Postman**:
- Method: POST
- URL: `http://localhost:8080/api/admin/seed-companies-jobs`
- Click Send

### 6️⃣ Login & Test

Open browser: `http://localhost:5173`

**Test as Company**:
1. Login with: `hr@tcs.com` / `password123`
2. Go to "My Jobs" - should see 6 jobs
3. Click on any job to see applicants

**Test as Student**:
1. Register a new student account
2. Complete your profile (add CGPA, skills, upload resume)
3. Go to "Available Jobs" - should see 18 jobs
4. Apply to any job
5. Check "My Applications" to see status

**Test as Admin**:
1. Login with: `admin@placify.com` / `admin123`
2. View all students, companies, jobs
3. Approve/reject companies
4. Send announcements

**Test as Department**:
1. Login with: `dept@cse.com` / `dept123`
2. View department students
3. Create quizzes
4. Review achievements

## 🎯 All Login Credentials

### Companies (All use password: `password123`)
| Company | Email | Jobs |
|---------|-------|------|
| TCS | hr@tcs.com | 6 |
| Infosys | hr@infosys.com | 6 |
| Wipro | hr@wipro.com | 6 |

### Other Accounts
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@placify.com | admin123 |
| Test Student | student@test.com | student123 |
| Department (CSE) | dept@cse.com | dept123 |

## 📋 Feature Checklist

After setup, verify these features work:

### Student Features
- [ ] Register and login
- [ ] Update profile (CGPA, skills, resume)
- [ ] Browse 18 available jobs
- [ ] Apply to jobs
- [ ] View application status
- [ ] Receive notifications
- [ ] Take department quizzes
- [ ] Submit achievements
- [ ] Use AI features (placement prediction, skill gap analysis)

### Company Features
- [ ] Login with company credentials
- [ ] View posted jobs (6 jobs per company)
- [ ] Create new job postings
- [ ] View applicants for each job
- [ ] Update application status (Shortlist, Interview, Select, Reject)
- [ ] View analytics
- [ ] Compare candidates

### Department Features
- [ ] View department students
- [ ] Add internal notes
- [ ] Update internal marks
- [ ] Create quizzes
- [ ] View quiz attempts
- [ ] Review student achievements
- [ ] Send department announcements
- [ ] Schedule placement drives
- [ ] View department analytics

### Admin Features
- [ ] View platform statistics
- [ ] Manage all students
- [ ] Approve/reject companies
- [ ] View all jobs and applications
- [ ] Send global announcements
- [ ] View department-wise stats
- [ ] Manage permissions

## 🐛 Common Issues

### "No jobs found"
- Run seed script: Open `SEED_DATA.html` and click seed button
- Check backend logs for errors
- Verify database has jobs: `SELECT COUNT(*) FROM jobs;`

### Backend won't start
- Check if port 8080 is free: `netstat -ano | findstr :8080`
- Verify PostgreSQL is running
- Check database credentials in `application.properties`

### Frontend won't start
- Delete `node_modules` and run `npm install` again
- Check if port 5173 is free
- Clear npm cache: `npm cache clean --force`

### Can't login
- Check if user exists in database
- Verify password is correct
- Check browser console for errors
- Clear browser cookies

## 🔄 Reset Everything

If you want to start fresh:

```sql
-- Drop and recreate database
DROP DATABASE placify_ai;
CREATE DATABASE placify_ai;
```

Then:
1. Restart backend (tables will be auto-created)
2. Run seed script again
3. Register new accounts

## 📊 Expected Data After Seeding

- **Companies**: 3 (TCS, Infosys, Wipro)
- **Jobs**: 18 (6 per company)
- **Job Status**: All ACTIVE
- **Company Status**: All APPROVED
- **Skills per Job**: 4-5 skills
- **CGPA Requirements**: 6.0 to 8.0
- **Interview Dates**: 12-28 days from now

## 🎓 Test Scenarios

### Scenario 1: Student applies for job
1. Login as student
2. Go to "Available Jobs"
3. Click "Apply Now" on any job
4. Check "My Applications" - status should be "APPLIED"
5. Login as company
6. Go to "My Jobs" → Click job → See applicant
7. Update status to "SHORTLISTED"
8. Login back as student
9. Check notifications - should see status update

### Scenario 2: Department creates quiz
1. Login as department
2. Go to "Quizzes"
3. Click "Create Quiz"
4. Add questions with options
5. Save quiz
6. Login as student (same department)
7. Go to "Quizzes"
8. Take the quiz
9. Submit and see score
10. Login back as department
11. View quiz attempts

### Scenario 3: Admin sends announcement
1. Login as admin
2. Go to "Announcements"
3. Type message and send
4. Login as any student
5. See notification popup on login
6. Check notifications page

## 📞 Need Help?

Check these files:
- `TROUBLESHOOTING.md` - Detailed troubleshooting guide
- `COMPANY_CREDENTIALS.md` - All login credentials
- `README.md` - Full project documentation

---

**Happy Testing! 🎉**
