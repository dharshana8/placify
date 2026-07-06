# Placify AI - Company Login Credentials

## How to Seed Data
1. Start the backend server
2. Make a POST request to: `http://localhost:8080/api/admin/seed-companies-jobs`
3. This will create 3 companies with 18 jobs

## Company Credentials

### 1. Tata Consultancy Services (TCS)
- **Email**: hr@tcs.com
- **Password**: password123
- **HR Name**: Rajesh Kumar
- **Jobs**: 6 positions (Software Engineer, Frontend Developer, Data Analyst, DevOps Engineer, QA Engineer, Business Analyst)

### 2. Infosys Limited
- **Email**: hr@infosys.com
- **Password**: password123
- **HR Name**: Priya Sharma
- **Jobs**: 6 positions (Full Stack Developer, Python Developer, Cloud Engineer, Mobile App Developer, Machine Learning Engineer, Cybersecurity Analyst)

### 3. Wipro Technologies
- **Email**: hr@wipro.com
- **Password**: password123
- **HR Name**: Amit Patel
- **Jobs**: 6 positions (Java Backend Developer, UI/UX Developer, Data Engineer, SAP Consultant, Network Engineer, Automation Tester)

## Admin Credentials
- **Email**: admin@placify.com
- **Password**: admin123

## Test Student Credentials
- **Email**: student@test.com
- **Password**: student123

## Department Credentials
- **Email**: dept@cse.com
- **Password**: dept123

---

## Quick Setup Steps

1. **Start Backend**:
   ```bash
   cd backend
   mvn spring-boot:run
   ```

2. **Seed Companies & Jobs** (using curl):
   ```bash
   curl -X POST http://localhost:8080/api/admin/seed-companies-jobs
   ```

3. **Start Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

4. **Login as Company**:
   - Go to http://localhost:5173/login
   - Use any company email above with password: password123
   - Post jobs or manage applicants

5. **Login as Student**:
   - Register a new student account or use test account
   - Browse and apply for jobs

## Notes
- All companies are pre-approved (status: APPROVED)
- All jobs are active (status: ACTIVE)
- Jobs have interview dates set 12-28 days from creation
- Minimum CGPA requirements range from 6.0 to 8.0
- Each job has 4-5 required skills listed
