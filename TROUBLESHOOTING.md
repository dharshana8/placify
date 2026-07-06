# Troubleshooting: "No Jobs Found" Issue

## Quick Fix Steps

### Step 1: Seed the Database
Open `SEED_DATA.html` in your browser and click the "Seed Companies & Jobs" button. This will create:
- 3 Companies (TCS, Infosys, Wipro)
- 18 Active Jobs across all companies

### Step 2: Verify Backend is Running
Make sure your Spring Boot backend is running on `http://localhost:8080`

### Step 3: Check Database
If seeding fails, manually check your PostgreSQL database:

```sql
-- Check if companies exist
SELECT * FROM companies;

-- Check if jobs exist
SELECT * FROM jobs;

-- Check job status
SELECT id, title, company_id, status FROM jobs;
```

### Step 4: Update Job Status (If Needed)
If jobs exist but have NULL or wrong status:

```sql
-- Update all jobs to ACTIVE status
UPDATE jobs SET status = 'ACTIVE' WHERE status IS NULL OR status != 'ACTIVE';
```

## Company Login Credentials

### TCS
- Email: `hr@tcs.com`
- Password: `password123`

### Infosys
- Email: `hr@infosys.com`
- Password: `password123`

### Wipro
- Email: `hr@wipro.com`
- Password: `password123`

## Manual Job Creation (Alternative Method)

If seeding doesn't work, you can manually create jobs:

1. Login as a company (use credentials above)
2. Go to "My Jobs" tab
3. Click "Post New Job"
4. Fill in the job details
5. Make sure to set status as ACTIVE

## Common Issues & Solutions

### Issue 1: "No jobs found" even after seeding
**Solution**: Check if jobs have ACTIVE status
```sql
SELECT status, COUNT(*) FROM jobs GROUP BY status;
```

### Issue 2: Backend not responding
**Solution**: 
1. Check if backend is running: `http://localhost:8080/actuator/health`
2. Check console for errors
3. Restart backend: `mvn spring-boot:run`

### Issue 3: Database connection error
**Solution**: 
1. Check PostgreSQL is running
2. Verify database credentials in `application.properties`
3. Create database if it doesn't exist:
   ```sql
   CREATE DATABASE placify_ai;
   ```

### Issue 4: Jobs showing for companies but not for students
**Solution**: This was a bug that has been fixed. The issue was:
- Jobs were not explicitly set to ACTIVE status when created
- The query was filtering for ACTIVE jobs only

**Fix Applied**:
- Updated `CompanyService.postJob()` to explicitly set `status = ACTIVE`
- Updated `JobController` to check if student has applied to jobs

### Issue 5: CORS errors in browser console
**Solution**: Backend should have CORS configured. If not, add this to your Spring Boot config:
```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:5173")
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowCredentials(true);
    }
}
```

## Verification Steps

After seeding, verify everything works:

1. **Check Backend Logs**:
   Look for these lines when accessing jobs:
   ```
   === Getting Active Jobs ===
   Total jobs in database: 18
   Active jobs found: 18
   ```

2. **Test API Directly**:
   ```bash
   curl http://localhost:8080/api/jobs
   ```
   Should return JSON array with 18 jobs

3. **Login as Student**:
   - Register a new student account
   - Go to "Available Jobs" tab
   - You should see 18 jobs listed

4. **Apply to a Job**:
   - Click "Apply Now" on any job
   - Check "My Applications" tab
   - Application should appear with status "APPLIED"

## Database Schema Check

Ensure your database has these tables:
- `users`
- `companies`
- `jobs`
- `job_required_skills`
- `students`
- `applications`
- `notifications`
- `departments`

If any table is missing, run:
```bash
mvn spring-boot:run
```
This will auto-create tables using JPA/Hibernate.

## Still Having Issues?

1. **Clear browser cache and cookies**
2. **Check browser console for JavaScript errors**
3. **Check backend console for Java exceptions**
4. **Verify all dependencies are installed**:
   ```bash
   cd frontend && npm install
   cd backend && mvn clean install
   ```

## Success Indicators

You'll know everything is working when:
- ✅ Seed endpoint returns: "Successfully created 3 companies with 18 jobs"
- ✅ Student dashboard shows 18 jobs in "Available Jobs"
- ✅ Each job shows company name, location, salary, and skills
- ✅ "Apply Now" button works and changes to "Applied" after clicking
- ✅ Applications appear in "My Applications" tab

## Contact

If you're still experiencing issues after following these steps, check:
1. Backend console logs for detailed error messages
2. Browser developer console (F12) for frontend errors
3. PostgreSQL logs for database issues
