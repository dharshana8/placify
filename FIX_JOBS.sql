-- SQL Script to Check and Fix Job Status Issues
-- Run this in your PostgreSQL database

-- 1. Check current job statuses
SELECT id, title, status, company_id, created_at 
FROM jobs 
ORDER BY created_at DESC;

-- 2. Count jobs by status
SELECT status, COUNT(*) as count 
FROM jobs 
GROUP BY status;

-- 3. Check if there are any NULL statuses
SELECT COUNT(*) as null_status_count 
FROM jobs 
WHERE status IS NULL;

-- 4. Fix: Update all NULL or non-ACTIVE jobs to ACTIVE
UPDATE jobs 
SET status = 'ACTIVE' 
WHERE status IS NULL OR status != 'ACTIVE';

-- 5. Verify the fix
SELECT status, COUNT(*) as count 
FROM jobs 
GROUP BY status;

-- 6. Check jobs with their companies
SELECT 
    j.id,
    j.title,
    j.status,
    j.location,
    j.salary_package,
    c.company_name,
    c.status as company_status
FROM jobs j
LEFT JOIN companies c ON j.company_id = c.id
ORDER BY j.created_at DESC;

-- 7. Check if companies are approved
SELECT 
    id,
    company_name,
    status,
    hr_email
FROM companies
ORDER BY id;

-- 8. Approve all companies (if needed)
UPDATE companies 
SET status = 'APPROVED' 
WHERE status != 'APPROVED';

-- 9. Final verification - Show all active jobs with company info
SELECT 
    j.id as job_id,
    j.title as job_title,
    j.status as job_status,
    j.location,
    j.salary_package,
    c.company_name,
    c.status as company_status,
    (SELECT COUNT(*) FROM applications a WHERE a.job_id = j.id) as applicant_count
FROM jobs j
LEFT JOIN companies c ON j.company_id = c.id
WHERE j.status = 'ACTIVE'
ORDER BY j.created_at DESC;

-- 10. Check job skills
SELECT 
    j.id,
    j.title,
    jrs.skill
FROM jobs j
LEFT JOIN job_required_skills jrs ON j.id = jrs.job_id
WHERE j.status = 'ACTIVE'
ORDER BY j.id, jrs.skill;
