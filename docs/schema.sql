-- Database Schema for Internship Management & Monitoring System (IMMS)
-- Database: PostgreSQL

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ENUMS
CREATE TYPE user_role AS ENUM ('student', 'company_supervisor', 'university_coordinator');
CREATE TYPE log_status AS ENUM ('pending', 'approved', 'rejected');

-- 1. USERS TABLE
-- Stores authentication constraints and role. 
-- Minimal data to start.
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. PRIVACY & COMPLIANCE MODULE
-- GDPR/DPA Compliance: Consent Management.
-- Must exist for a user to use the system.
CREATE TABLE privacy_consents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    consent_granted BOOLEAN NOT NULL DEFAULT FALSE,
    policy_version VARCHAR(50) NOT NULL, -- To track which version they agreed to
    ip_address VARCHAR(45), -- Audit trail
    consent_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_active_consent UNIQUE (user_id, policy_version)
);

-- 3. INTERN PROFILES
-- Data Minimization: Only strictly necessary info.
CREATE TABLE intern_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(100) NOT NULL,
    student_id VARCHAR(50) UNIQUE,
    university_department VARCHAR(100),
    current_placement_company VARCHAR(100)
);

-- 4. SUPERVISORS
CREATE TABLE supervisors (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(100) NOT NULL,
    company_name VARCHAR(100) NOT NULL,
    designation VARCHAR(100)
);

-- 5. DAILY LOGS (eLogbook)
-- Monitoring System.
CREATE TABLE daily_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    intern_id UUID REFERENCES users(id) ON DELETE CASCADE,
    log_date DATE NOT NULL,
    activity_description TEXT NOT NULL,
    image_url TEXT, -- Support for image upload
    status log_status DEFAULT 'pending',
    supervisor_comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(intern_id, log_date) -- One log per day constraint
);

-- 6. EVALUATIONS (Competency Tracking)
-- Based on NACE Career Readiness Competencies.
CREATE TABLE evaluations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    intern_id UUID REFERENCES users(id) ON DELETE CASCADE,
    supervisor_id UUID REFERENCES users(id), -- Nullable if self-eval, but typically supervisor
    evaluation_date DATE DEFAULT CURRENT_DATE,
    
    -- Competency Scores (1-10 or 1-5 scale)
    critical_thinking_score INTEGER CHECK (critical_thinking_score BETWEEN 1 AND 10),
    communication_score INTEGER CHECK (communication_score BETWEEN 1 AND 10),
    teamwork_score INTEGER CHECK (teamwork_score BETWEEN 1 AND 10),
    professionalism_score INTEGER CHECK (professionalism_score BETWEEN 1 AND 10),
    
    technical_skills_score INTEGER CHECK (technical_skills_score BETWEEN 1 AND 10),
    
    feedback_notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. JOB/PLACEMENT POSTINGS
CREATE TABLE job_postings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supervisor_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending_approval', -- Needs Admin approval
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_logs_intern_date ON daily_logs(intern_id, log_date);
CREATE INDEX idx_users_email ON users(email);
