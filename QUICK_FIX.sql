-- QUICK FIX: Run this in PostgreSQL to fix "No Jobs Found" issue
-- Copy and paste all commands below into your PostgreSQL terminal

-- Step 1: Fix job statuses
UPDATE jobs SET status = 'ACTIVE' WHERE status IS NULL OR status != 'ACTIVE';

-- Step 2: Fix company statuses  
UPDATE companies SET status = 'APPROVED' WHERE status != 'APPROVED';

-- Step 3: Verify the fix
SELECT 
    'Jobs Fixed' as message,
    COUNT(*) as active_jobs 
FROM jobs 
WHERE status = 'ACTIVE';

SELECT 
    'Companies Fixed' as message,
    COUNT(*) as approved_companies 
FROM companies 
WHERE status = 'APPROVED';

-- Step 4: Show all active jobs with company info
SELECT 
    j.id,
    j.title,
    j.status as job_status,
    j.location,
    j.salary_package,
    c.company_name,
    c.status as company_status
FROM jobs j
LEFT JOIN companies c ON j.company_id = c.id
WHERE j.status = 'ACTIVE'
ORDER BY j.created_at DESC;

-- Done! Now restart your backend and refresh the student page.
