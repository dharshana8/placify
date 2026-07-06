-- Placify AI Database Setup Script
-- Run this in PostgreSQL (psql or pgAdmin)

-- Create database
CREATE DATABASE placify_ai;

-- Create user
CREATE USER placify_user WITH PASSWORD 'placify123';

-- Grant all privileges
GRANT ALL PRIVILEGES ON DATABASE placify_ai TO placify_user;

-- Connect to the database
\c placify_ai;

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO placify_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO placify_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO placify_user;

-- Verify connection
SELECT current_database(), current_user;