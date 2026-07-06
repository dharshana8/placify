# Quick Testing Guide - Email Templates & Jobs Fix

## 🚀 Quick Start

### 1. Test Email Templates (Company Dashboard)

**Login**: hr@tcs.com / password123

**Steps**:
1. Navigate to "Email Templates" tab
2. You should see 4 templates:
   - Interview Invitation
   - Rejection Email
   - Offer Letter
   - Follow-up

3. Click "Edit" on any template
4. Modal should open with:
   - Subject line field
   - Email body textarea (12 rows)
   - Available variables section
   - Cancel and Save buttons

5. Modify the template:
   - Change subject: "Interview Invitation - {{jobTitle}}"
   - Edit body text
   - Use variables like {{candidateName}}

6. Click "Save Template"
7. Should see success alert

8. Click "Preview" button
9. Should see alert with full template content

**Expected Result**: ✅ All templates editable, preview works, changes persist

---

### 2. Test Jobs Visibility (Student View)

**Login**: Create a student account or use existing

**Steps**:
1. Navigate to "Browse Jobs" tab
2. Should see list of available jobs from TCS, Infosys, Wipro
3. Each job should show:
   - Job title
   - Company name
   - Location
   - Salary package
   - Required skills
   - Apply button (or "Applied" if already applied)

**Expected Result**: ✅ All active jobs visible, can apply successfully

---

### 3. Test Job Posting (Company View)

**Login**: hr@tcs.com / password123

**Steps**:
1. Navigate to "Post New Job" tab
2. Fill in job details:
   - Title: "Senior Developer"
   - Package: "15 LPA"
   - Location: "Mumbai"
   - Min CGPA: 7.5
   - Skills: "Java, Spring Boot, React"
   - Description: "Looking for experienced developer..."

3. Click "Post Job"
4. Should see success message
5. Job should appear in "My Jobs" tab
6. **CRITICAL**: Open student account and verify job appears immediately

**Expected Result**: ✅ Job posted successfully, visible to students instantly

---

## 🔍 Verification Checklist

### Email Templates
- [ ] All 4 templates visible
- [ ] Edit button opens modal with full form
- [ ] Subject and body fields editable
- [ ] Variables section shows all available variables
- [ ] Save button persists changes
- [ ] Preview button shows full template
- [ ] Cancel button closes modal without saving
- [ ] Modal has proper styling (dark theme)

### Jobs System
- [ ] Company can post jobs (if approved)
- [ ] Jobs have ACTIVE status by default
- [ ] Students see all active jobs
- [ ] Job filters work (role, location)
- [ ] Apply button works correctly
- [ ] "Applied" badge shows for applied jobs
- [ ] Job details display properly

### Company Dashboard
- [ ] Analytics graphs render
- [ ] Selected candidates tab shows selections
- [ ] Bulk actions functional
- [ ] CSV export works
- [ ] Email templates accessible

---

## 🐛 Troubleshooting

### Problem: Email template modal doesn't open
**Solution**: Check browser console for errors, ensure XCircle icon imported

### Problem: Template changes don't save
**Solution**: Check emailTemplates state, verify setEmailTemplates called correctly

### Problem: Jobs still not visible to students
**Solution**: 
1. Check database: `SELECT * FROM jobs WHERE status = 'ACTIVE';`
2. Run QUICK_FIX.sql
3. Verify company status is APPROVED
4. Check backend logs for errors

### Problem: Can't edit template body
**Solution**: Ensure textarea has proper value binding and onChange handler

---

## 📊 Database Verification

### Check Job Status
```sql
SELECT id, title, status, company_id 
FROM jobs 
ORDER BY id DESC 
LIMIT 10;
```

**Expected**: All jobs should have `status = 'ACTIVE'`

### Check Company Status
```sql
SELECT id, company_name, status 
FROM companies;
```

**Expected**: All companies should have `status = 'APPROVED'`

### Check Applications
```sql
SELECT a.id, s.name, j.title, a.status 
FROM applications a
JOIN students s ON a.student_id = s.id
JOIN jobs j ON a.job_id = j.id
ORDER BY a.applied_at DESC
LIMIT 10;
```

---

## 🎯 Success Criteria

### Email Templates
✅ Can view all templates
✅ Can edit subject and body
✅ Can preview templates
✅ Changes persist after save
✅ Modal UI is professional
✅ Variables section helpful

### Jobs System
✅ Companies can post jobs
✅ Jobs visible to students immediately
✅ Filters work correctly
✅ Apply functionality works
✅ Status tracking accurate
✅ No console errors

---

## 📝 Test Accounts

### Company Accounts
- **TCS**: hr@tcs.com / password123
- **Infosys**: hr@infosys.com / password123
- **Wipro**: hr@wipro.com / password123

### Student Account
- Create via registration or use existing

### Admin Account
- admin@sece.ac.in / admin123

---

## 🔄 Quick Reset (if needed)

### Reset Job Statuses
```sql
UPDATE jobs SET status = 'ACTIVE';
```

### Reset Company Statuses
```sql
UPDATE companies SET status = 'APPROVED';
```

### Reset Email Templates
- Refresh page - templates are stored in component state
- Default templates will reload

---

## 📞 Support

If issues persist:
1. Check browser console for errors
2. Check backend logs for exceptions
3. Verify database schema matches entities
4. Ensure all dependencies installed
5. Try clearing browser cache

---

**Last Updated**: Now
**Status**: Ready for testing
**Priority**: High - Core functionality
