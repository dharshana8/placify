# 🗄️ Database Setup Guide

## ⚠️ **IMPORTANT: Database Setup Required**

The application is **NOT connected to PostgreSQL by default**. You need to set up the database first.

## 📋 **Step-by-Step Setup**

### **Step 1: Install PostgreSQL**

1. **Download PostgreSQL**: https://www.postgresql.org/download/windows/
2. **Install** with these settings:
   - Port: `5432` (default)
   - Superuser: `postgres`
   - **Remember the password** you set!

### **Step 2: Create Database**

**Option A: Using pgAdmin (GUI)**
1. Open pgAdmin
2. Connect to PostgreSQL server
3. Right-click "Databases" → Create → Database
4. Name: `placify_ai`
5. Owner: `postgres`

**Option B: Using Command Line**
1. Open Command Prompt as Administrator
2. Navigate to PostgreSQL bin folder:
   ```cmd
   cd "C:\Program Files\PostgreSQL\15\bin"
   ```
3. Connect to PostgreSQL:
   ```cmd
   psql -U postgres
   ```
4. Run the setup script:
   ```sql
   \i 'D:\placify2\placify\placify-ai\database_setup.sql'
   ```

**Option C: Copy-Paste SQL**
Open pgAdmin Query Tool and run:
```sql
-- Create database
CREATE DATABASE placify_ai;

-- Create user
CREATE USER placify_user WITH PASSWORD 'placify123';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE placify_ai TO placify_user;
```

### **Step 3: Verify Database Connection**

1. **Check if database exists**:
   ```sql
   SELECT datname FROM pg_database WHERE datname = 'placify_ai';
   ```

2. **Test connection with new user**:
   ```cmd
   psql -U placify_user -d placify_ai -h localhost
   ```

### **Step 4: Update Application Configuration (Already Done)**

The `application.properties` file is configured with:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/placify_ai
spring.datasource.username=placify_user
spring.datasource.password=placify123
```

### **Step 5: Start the Application**

1. **Run the startup script**:
   ```cmd
   double-click start.bat
   ```

2. **Or manually**:
   ```cmd
   cd backend
   mvn spring-boot:run
   ```

## 🔧 **Troubleshooting**

### **Common Issues:**

**1. "Connection refused" error**
- ✅ Check if PostgreSQL service is running
- ✅ Verify port 5432 is not blocked
- ✅ Check Windows Services for "postgresql-x64-15"

**2. "Authentication failed" error**
- ✅ Verify username: `placify_user`
- ✅ Verify password: `placify123`
- ✅ Check if user was created successfully

**3. "Database does not exist" error**
- ✅ Verify database name: `placify_ai`
- ✅ Check if database was created successfully

**4. "Permission denied" error**
- ✅ Grant privileges to placify_user
- ✅ Run as administrator if needed

### **Alternative: Use Default Postgres User**

If you prefer to use the default postgres user, update `application.properties`:

```properties
spring.datasource.username=postgres
spring.datasource.password=YOUR_POSTGRES_PASSWORD
```

## 🚀 **After Database Setup**

Once PostgreSQL is configured:

1. **Start the application** with `start.bat`
2. **Tables will be created automatically** (Hibernate DDL)
3. **Access the app** at http://localhost:5173
4. **Register test accounts** with different roles
5. **Test all features**

## 📊 **Database Schema**

The application will automatically create these tables:
- `users` - User authentication
- `students` - Student profiles  
- `companies` - Company profiles
- `departments` - Academic departments
- `jobs` - Job postings
- `applications` - Job applications
- `notifications` - System notifications
- `department_staff` - Department access

## ✅ **Verification**

After setup, you should see:
1. **Backend logs**: "Started PlacifyAiApplication"
2. **Database tables**: Created automatically
3. **Frontend**: Accessible at localhost:5173
4. **No connection errors** in console

---

**Need Help?** Check the main README.md or DEVELOPMENT.md for more details.