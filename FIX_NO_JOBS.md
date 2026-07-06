# Fix "No Jobs Found" Issue - Step by Step

## Problem
Students see "No jobs found" even after seeding data.

## Root Causes
1. Jobs don't have ACTIVE status in database
2. Companies are not APPROVED
3. Backend query is failing
4. Frontend is not calling the API correctly

## Solution Steps

### Step 1: Check Backend Logs
When you access the jobs page, check your backend console for these lines:
```
=== Getting Active Jobs ===
Total jobs in database: X
Active jobs found: Y
```

If X > 0 but Y = 0, then jobs exist but aren't marked as ACTIVE.

### Step 2: Run SQL Fixes

Open PostgreSQL and run these commands:

```sql
-- Check current status
SELECT id, title, status FROM jobs;

-- Fix job status
UPDATE jobs SET status = 'ACTIVE' WHERE status IS NULL OR status != 'ACTIVE';

-- Check company status
SELECT id, company_name, status FROM companies;

-- Fix company status
UPDATE companies SET status = 'APPROVED' WHERE status != 'APPROVED';

-- Verify
SELECT 
    j.id, 
    j.title, 
    j.status as job_status,
    c.company_name,
    c.status as company_status
FROM jobs j
LEFT JOIN companies c ON j.company_id = c.id;
```

### Step 3: Restart Backend

After running SQL fixes:
```bash
# Stop backend (Ctrl+C)
# Start again
cd backend
mvn spring-boot:run
```

### Step 4: Clear Browser Cache

1. Open browser DevTools (F12)
2. Go to Network tab
3. Check "Disable cache"
4. Refresh page (Ctrl+Shift+R)

### Step 5: Test API Directly

Open browser and go to:
```
http://localhost:8080/api/jobs
```

You should see JSON array with jobs. If you see `[]`, jobs aren't being returned.

### Step 6: Re-seed Data

If still no jobs, re-run the seed script:

**Option A - HTML Page:**
1. Open `SEED_DATA.html`
2. Click "Seed Companies & Jobs"

**Option B - curl:**
```bash
curl -X POST http://localhost:8080/api/admin/seed-companies-jobs
```

**Option C - Postman:**
- POST to `http://localhost:8080/api/admin/seed-companies-jobs`

### Step 7: Verify Database

```sql
-- Should return 18
SELECT COUNT(*) FROM jobs WHERE status = 'ACTIVE';

-- Should return 3
SELECT COUNT(*) FROM companies WHERE status = 'APPROVED';

-- Should show all jobs
SELECT j.title, j.status, c.company_name, c.status 
FROM jobs j 
JOIN companies c ON j.company_id = c.id;
```

### Step 8: Check Frontend Console

1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for errors
4. Check Network tab for `/api/jobs` request
5. Click on the request to see response

### Step 9: Manual Job Creation

If seeding fails, create a job manually:

1. Login as company: `hr@tcs.com` / `password123`
2. Go to "Post New Job"
3. Fill in details:
   - Title: Test Job
   - Package: 10 LPA
   - Location: Bangalore
   - Min CGPA: 7.0
4. Click "Post Job"
5. Logout and login as student
6. Check "Available Jobs"

## Common Issues & Fixes

### Issue 1: "Total jobs in database: 18, Active jobs found: 0"
**Fix:** Run SQL update:
```sql
UPDATE jobs SET status = 'ACTIVE';
```

### Issue 2: Backend error "could not execute query"
**Fix:** The JPQL query might be wrong. Check backend logs for exact error.

### Issue 3: Jobs show for companies but not students
**Fix:** This was a query issue. Make sure you've updated the code with the latest changes.

### Issue 4: CORS error in browser
**Fix:** Backend should allow requests from frontend. Check if backend is running on port 8080.

### Issue 5: 401 Unauthorized
**Fix:** Student needs to be logged in. Check if token is valid.

## Verification Checklist

After fixes, verify:

- [ ] Backend logs show: "Active jobs found: 18"
- [ ] `http://localhost:8080/api/jobs` returns JSON array
- [ ] SQL query `SELECT COUNT(*) FROM jobs WHERE status = 'ACTIVE'` returns 18
- [ ] Student dashboard shows 18 jobs
- [ ] Each job shows company name, location, salary
- [ ] "Apply Now" button is visible
- [ ] No errors in browser console

## Still Not Working?

### Debug Mode

Add this to your `application.properties`:
```properties
logging.level.org.hibernate.SQL=DEBUG
logging.level.org.hibernate.type.descriptor.sql.BasicBinder=TRACE
logging.level.com.placify=DEBUG
```

This will show all SQL queries in backend logs.

### Check Database Connection

```sql
-- Test connection
SELECT current_database(), current_user, version();

-- Check tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';
```

### Nuclear Option - Reset Everything

If nothing works, reset:

```sql
-- Drop all data
TRUNCATE TABLE applications CASCADE;
TRUNCATE TABLE job_required_skills CASCADE;
TRUNCATE TABLE jobs CASCADE;
TRUNCATE TABLE companies CASCADE;
TRUNCATE TABLE users CASCADE;
```

Then:
1. Restart backend (tables will be recreated)
2. Run seed script
3. Test again

## Success Indicators

You'll know it's working when:
- ✅ Backend logs: "Active jobs found: 18"
- ✅ API returns: `[{id: 1, title: "Software Engineer", ...}, ...]`
- ✅ Student sees: 18 jobs with details
- ✅ Can apply to jobs successfully

## Contact

If still having issues:
1. Check backend console for errors
2. Check browser console for errors
3. Run `FIX_JOBS.sql` script
4. Verify database has data
5. Try manual job creation

---

**Last Updated:** After fixing JobRepository query and adding better error handling
