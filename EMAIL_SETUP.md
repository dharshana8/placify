# Email Campaign Setup Guide

## Overview
This guide explains how to configure email functionality for the Placify AI platform. Email campaigns allow admins to send bulk emails to students, companies, or specific groups.

---

## 🔧 Configuration Steps

### 1. Gmail SMTP Setup (Recommended)

#### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account: https://myaccount.google.com/
2. Navigate to **Security** → **2-Step Verification**
3. Enable 2-Step Verification

#### Step 2: Generate App Password
1. Go to: https://myaccount.google.com/apppasswords
2. Select **Mail** and **Windows Computer** (or Other)
3. Click **Generate**
4. Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)

#### Step 3: Update application.properties
Open `backend/src/main/resources/application.properties` and update:

```properties
# Email Configuration (Gmail SMTP)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-16-char-app-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true
```

**Replace:**
- `your-email@gmail.com` → Your Gmail address
- `your-16-char-app-password` → The app password from Step 2 (remove spaces)

---

## 📧 Features Implemented

### 1. Announcements (In-App Notifications)
- **Location**: Inside the application only
- **Target Audiences**:
  - All Students
  - All Companies
  - Specific Department
  - All Users
- **Features**:
  - Title and message
  - Timestamp tracking
  - Delete functionality
  - Filtered by role and department

### 2. Email Campaigns (External Emails)
- **Location**: Sent to users' email inboxes
- **Target Audiences**:
  - All Students
  - All Companies
  - Specific Department
  - CGPA Range (e.g., 7.0-8.5)
  - All Users
- **Features**:
  - Subject and body
  - Recipient count tracking
  - Campaign history
  - Status tracking (SENT/FAILED)

---

## 🚀 Usage

### Admin Dashboard

#### Create Announcement
1. Go to **Admin Dashboard** → **Announcements**
2. Enter title and message
3. Select target audience
4. Click **Create Announcement**
5. Users will see it in their dashboard notifications

#### Send Email Campaign
1. Go to **Admin Dashboard** → **Email Campaigns**
2. Enter subject and body
3. Select target audience
4. (Optional) Filter by department or CGPA range
5. Click **Send Email Campaign**
6. Emails will be sent to all matching recipients

---

## 🔍 API Endpoints

### Announcements
```
POST   /api/announcements          - Create announcement
GET    /api/announcements          - Get announcements (filtered by role)
DELETE /api/announcements/{id}     - Delete announcement
```

### Email Campaigns
```
POST   /api/email-campaigns        - Send email campaign
GET    /api/email-campaigns        - Get campaign history
```

---

## 📊 Database Tables

### announcements
```sql
id                BIGSERIAL PRIMARY KEY
title             VARCHAR(255) NOT NULL
message           TEXT NOT NULL
target_audience   VARCHAR(50) NOT NULL
department_name   VARCHAR(100)
created_at        TIMESTAMP
created_by        BIGINT (FK to users)
```

### email_campaigns
```sql
id                BIGSERIAL PRIMARY KEY
subject           VARCHAR(255) NOT NULL
body              TEXT NOT NULL
target_audience   VARCHAR(50) NOT NULL
department_name   VARCHAR(100)
min_cgpa          DOUBLE PRECISION
max_cgpa          DOUBLE PRECISION
recipient_count   INTEGER NOT NULL
status            VARCHAR(20) NOT NULL
sent_at           TIMESTAMP
sent_by           BIGINT (FK to users)
```

---

## 🧪 Testing

### Test Announcements
1. Login as admin (admin@placify.com / admin123)
2. Create announcement with target "All Students"
3. Logout and login as student
4. Check if announcement appears in student dashboard

### Test Email Campaigns (Without SMTP)
If you don't configure SMTP, emails won't actually send, but:
- Campaign will be saved to database
- Status will be FAILED
- You can see campaign history
- Recipient count will be calculated

### Test Email Campaigns (With SMTP)
1. Configure Gmail SMTP (see above)
2. Restart backend server
3. Login as admin
4. Send test email to "All Students"
5. Check student email inboxes

---

## ⚠️ Important Notes

### Email Sending
- **Without SMTP config**: Emails won't send, but system will work (status: FAILED)
- **With SMTP config**: Real emails will be sent to all recipients
- **Gmail limits**: 500 emails/day for free accounts
- **Production**: Use SendGrid, AWS SES, or Mailgun for bulk emails

### Security
- Never commit real email credentials to Git
- Use environment variables in production
- App passwords are safer than real passwords
- Revoke app passwords when not needed

### Performance
- Sending 68 emails takes ~10-20 seconds
- Email sending is synchronous (blocks request)
- For production, use async email queue (RabbitMQ, Redis)

---

## 🐛 Troubleshooting

### "Failed to send email campaign"
- Check SMTP credentials in application.properties
- Verify 2FA is enabled on Gmail
- Ensure app password is correct (no spaces)
- Check internet connection

### "Authentication failed"
- App password might be wrong
- 2FA might not be enabled
- Try generating new app password

### Emails not received
- Check spam/junk folder
- Verify recipient email addresses in database
- Check Gmail sent folder
- Review backend logs for errors

---

## 📝 Example Payloads

### Create Announcement
```json
{
  "title": "Placement Drive Tomorrow",
  "message": "TCS recruitment drive at 10 AM in Auditorium",
  "targetAudience": "ALL_STUDENTS",
  "departmentName": null
}
```

### Send Email Campaign
```json
{
  "subject": "Important: Update Your Profiles",
  "body": "Dear Students,\n\nPlease update your profiles before Friday.\n\nRegards,\nPlacement Cell",
  "targetAudience": "CGPA_RANGE",
  "minCgpa": 7.0,
  "maxCgpa": 10.0
}
```

---

## 🎯 Next Steps

1. Configure Gmail SMTP (optional but recommended)
2. Restart backend server
3. Test announcements first (no SMTP needed)
4. Test email campaigns (requires SMTP)
5. Monitor campaign history in admin dashboard

---

## 📞 Support

For issues or questions:
- Check backend console logs
- Verify database tables were created
- Test with small recipient groups first
- Review this guide carefully

---

**Note**: Email functionality is fully implemented but requires SMTP configuration to actually send emails. Without SMTP, the system will work but emails won't be delivered (status will be FAILED).
