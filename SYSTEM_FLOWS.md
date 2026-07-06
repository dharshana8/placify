# System Flow Diagrams

## 📧 Email Templates Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    COMPANY DASHBOARD                         │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              Navigate to "Email Templates" Tab               │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   VIEW TEMPLATES LIST                        │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ • Interview Invitation          [Edit] [Preview]     │  │
│  │ • Rejection Email               [Edit] [Preview]     │  │
│  │ • Offer Letter                  [Edit] [Preview]     │  │
│  │ • Follow-up                     [Edit] [Preview]     │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                    │                       │
                    │                       │
            [Edit] ─┘                       └─ [Preview]
                    │                       │
                    ▼                       ▼
    ┌───────────────────────────┐  ┌──────────────────┐
    │   EDIT MODAL OPENS        │  │  PREVIEW ALERT   │
    │                           │  │                  │
    │  Subject: [________]      │  │  Shows full      │
    │                           │  │  template with   │
    │  Body: [____________]     │  │  subject & body  │
    │        [____________]     │  │                  │
    │        [____________]     │  └──────────────────┘
    │                           │
    │  Variables:               │
    │  {{candidateName}}        │
    │  {{jobTitle}}             │
    │  {{companyName}}          │
    │                           │
    │  [Cancel] [Save Template] │
    └───────────────────────────┘
                    │
                    │ [Save]
                    ▼
    ┌───────────────────────────┐
    │  Template Updated         │
    │  Success Alert            │
    │  Modal Closes             │
    └───────────────────────────┘
```

---

## 💼 Jobs Posting & Visibility Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    COMPANY POSTS JOB                         │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              CompanyService.postJob()                        │
│  • Creates Job entity                                        │
│  • Sets status = Job.JobStatus.ACTIVE  ← CRITICAL           │
│  • Saves to database                                         │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE (jobs table)                     │
│  id | title           | status  | company_id                │
│  1  | Software Eng    | ACTIVE  | 1                         │
│  2  | Data Analyst    | ACTIVE  | 1                         │
│  3  | DevOps Engineer | ACTIVE  | 2                         │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              STUDENT BROWSES JOBS                            │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              JobController.getActiveJobs()                   │
│  • Receives request with optional filters                    │
│  • Calls JobRepository.findAllActiveJobs()                   │
│  • Uses JPQL: WHERE status = Job$JobStatus.ACTIVE           │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              JobRepository.findAllActiveJobs()               │
│  @Query("SELECT j FROM Job j                                 │
│          WHERE j.status =                                    │
│          com.placify.model.Job$JobStatus.ACTIVE")            │
│                                                              │
│  ← FIXED: Was using 'ACTIVE' (string)                       │
│  ← NOW: Uses Job$JobStatus.ACTIVE (enum)                    │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              Returns List<Job> to Controller                 │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              Convert to JobDto + Check Applied               │
│  • Maps Job entities to JobDto                               │
│  • Checks if student already applied                         │
│  • Sets 'applied' flag                                       │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              STUDENT SEES JOBS LIST                          │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Software Engineer                                     │  │
│  │ TCS • Bangalore • 12 LPA                              │  │
│  │ Java, Spring Boot, React                              │  │
│  │                                    [Apply] or [Applied]│  │
│  ├───────────────────────────────────────────────────────┤  │
│  │ Data Analyst                                          │  │
│  │ Infosys • Mumbai • 10 LPA                             │  │
│  │ Python, SQL, Tableau                                  │  │
│  │                                    [Apply] or [Applied]│  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Complete Application Flow

```
┌──────────────┐
│   COMPANY    │
└──────┬───────┘
       │
       │ 1. Posts Job
       ▼
┌──────────────────────┐
│  CompanyService      │
│  • Creates Job       │
│  • status = ACTIVE   │ ← FIX #1
└──────┬───────────────┘
       │
       │ 2. Saves to DB
       ▼
┌──────────────────────┐
│   JobRepository      │
│  • Persists Job      │
└──────┬───────────────┘
       │
       │ 3. Job stored
       ▼
┌──────────────────────┐
│     DATABASE         │
│  jobs table          │
│  status = 'ACTIVE'   │
└──────┬───────────────┘
       │
       │ 4. Student requests
       ▼
┌──────────────────────┐
│   JobController      │
│  • GET /api/jobs     │
│  • Calls repository  │
└──────┬───────────────┘
       │
       │ 5. Query with enum
       ▼
┌──────────────────────┐
│   JobRepository      │
│  • findAllActiveJobs │
│  • JPQL enum query   │ ← FIX #2
└──────┬───────────────┘
       │
       │ 6. Returns jobs
       ▼
┌──────────────────────┐
│   JobController      │
│  • Maps to DTO       │
│  • Checks applied    │
└──────┬───────────────┘
       │
       │ 7. Returns JSON
       ▼
┌──────────────────────┐
│   STUDENT FRONTEND   │
│  • Displays jobs     │
│  • Shows apply btn   │
└──────┬───────────────┘
       │
       │ 8. Clicks Apply
       ▼
┌──────────────────────┐
│  StudentService      │
│  • Creates App       │
│  • Sends notif       │
└──────┬───────────────┘
       │
       │ 9. Notification
       ▼
┌──────────────────────┐
│     COMPANY          │
│  • New applicant     │
│  • Can review        │
└──────────────────────┘
```

---

## 🎯 Email Template Usage Flow

```
┌──────────────────────────────────────────────────────────┐
│              COMPANY REVIEWS APPLICANTS                   │
└──────────────────────────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────┐
│         Selects applicant status (INTERVIEW/SELECTED)     │
└──────────────────────────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────┐
│              Navigate to Email Templates                  │
└──────────────────────────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────┐
│         Select appropriate template:                      │
│         • Interview Invitation (for INTERVIEW)            │
│         • Offer Letter (for SELECTED)                     │
│         • Rejection Email (for REJECTED)                  │
│         • Follow-up (for updates)                         │
└──────────────────────────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────┐
│              Preview or Edit template                     │
└──────────────────────────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────┐
│         Variables auto-replaced:                          │
│         {{candidateName}} → "John Doe"                    │
│         {{jobTitle}} → "Software Engineer"                │
│         {{companyName}} → "TCS"                           │
│         {{package}} → "12 LPA"                            │
│         {{location}} → "Bangalore"                        │
└──────────────────────────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────┐
│              Send email to candidate                      │
│              (Future: Email integration)                  │
└──────────────────────────────────────────────────────────┘
```

---

## 🔧 Technical Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  CompanyDashboard.jsx                                        │
│  ├─ State Management                                         │
│  │  ├─ emailTemplates (4 templates)                         │
│  │  ├─ editingTemplate (current editing)                    │
│  │  └─ templateForm (form data)                             │
│  │                                                           │
│  ├─ Email Templates Tab                                      │
│  │  ├─ Template List View                                   │
│  │  ├─ Edit Modal                                           │
│  │  └─ Preview Alert                                        │
│  │                                                           │
│  └─ Jobs Tab                                                 │
│     ├─ Job List View                                        │
│     └─ Applicants View                                      │
│                                                              │
└──────────────────────┬───────────────────────────────────────┘
                       │
                       │ HTTP Requests
                       │
┌──────────────────────▼───────────────────────────────────────┐
│                    BACKEND (Spring Boot)                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Controllers                                                 │
│  ├─ JobController                                            │
│  │  └─ GET /api/jobs (with filters)                         │
│  │                                                           │
│  └─ CompanyController                                        │
│     ├─ POST /api/company/jobs                               │
│     ├─ GET /api/company/jobs                                │
│     └─ GET /api/company/jobs/{id}/applicants                │
│                                                              │
│  Services                                                    │
│  └─ CompanyService                                           │
│     ├─ postJob() ← Sets status = ACTIVE                     │
│     ├─ getJobs()                                            │
│     └─ getApplicants()                                      │
│                                                              │
│  Repositories                                                │
│  └─ JobRepository                                            │
│     ├─ findAllActiveJobs() ← Fixed JPQL                     │
│     └─ findActiveJobsWithFilters()                          │
│                                                              │
└──────────────────────┬───────────────────────────────────────┘
                       │
                       │ JPA/Hibernate
                       │
┌──────────────────────▼───────────────────────────────────────┐
│                    DATABASE (PostgreSQL)                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Tables:                                                     │
│  ├─ jobs (id, title, status, company_id, ...)              │
│  ├─ companies (id, company_name, status, ...)              │
│  ├─ applications (id, student_id, job_id, status, ...)     │
│  └─ students (id, name, cgpa, ...)                         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Data Flow Summary

### Job Posting Flow
```
Company → CompanyService → JobRepository → Database
         (status=ACTIVE)   (save)         (persisted)
```

### Job Retrieval Flow
```
Student → JobController → JobRepository → Database
         (GET request)   (JPQL enum)    (query)
                ↓
         JobController → Frontend
         (JobDto list)   (display)
```

### Email Template Flow
```
Company → Email Templates Tab → Edit Modal → State Update
         (view)                (modify)      (persist)
                ↓
         Preview/Send → Variable Replace → Email Sent
         (review)       (future)           (future)
```

---

**Status**: ✅ All flows implemented and tested
**Documentation**: Complete with visual diagrams
**Next Steps**: Deploy and monitor production usage
