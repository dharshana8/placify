-- Database initialization script
-- This will be executed by Spring Boot on startup

-- Create database if it doesn't exist (PostgreSQL specific)
SELECT 'CREATE DATABASE placify_ai'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'placify_ai');