-- Phase 1: AI Agents & Learning Hub Tables

-- Resume Optimization Table
CREATE TABLE IF NOT EXISTS resume_optimizations (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL,
    original_score INT,
    ats_score INT,
    improvements JSONB,
    original_file_path VARCHAR(500),
    optimized_file_path VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

CREATE INDEX idx_resume_opt_student ON resume_optimizations(student_id);

-- Placement Predictions Table
CREATE TABLE IF NOT EXISTS placement_predictions (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL,
    prediction_score DECIMAL(5,2),
    confidence DECIMAL(5,2),
    skill_gaps JSONB,
    explanation TEXT,
    predicted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

CREATE INDEX idx_placement_pred_student ON placement_predictions(student_id);

-- Learning Resources Table
CREATE TABLE IF NOT EXISTS learning_resources (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    resource_type VARCHAR(50) CHECK (resource_type IN ('COURSE', 'VIDEO', 'ARTICLE', 'PROBLEM_SET', 'TUTORIAL', 'BOOK')),
    url VARCHAR(1000),
    platform VARCHAR(100),
    difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED')),
    skills_covered JSONB,
    duration_hours INT,
    rating DECIMAL(3,1),
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_resources_type ON learning_resources(resource_type);
CREATE INDEX idx_resources_difficulty ON learning_resources(difficulty_level);

-- Learning Pathways Table
CREATE TABLE IF NOT EXISTS learning_pathways (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL,
    target_job_id BIGINT,
    target_role VARCHAR(200),
    weekly_plan JSONB,
    skill_gaps JSONB,
    resources_assigned JSONB,
    progress_percentage INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (target_job_id) REFERENCES jobs(id) ON DELETE SET NULL
);

CREATE INDEX idx_pathway_student ON learning_pathways(student_id);

-- Student Resource Progress Table
CREATE TABLE IF NOT EXISTS student_resource_progress (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL,
    resource_id BIGINT NOT NULL,
    pathway_id BIGINT,
    status VARCHAR(50) CHECK (status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED')) DEFAULT 'PENDING',
    completion_percentage INT DEFAULT 0,
    time_spent_minutes INT DEFAULT 0,
    notes TEXT,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (resource_id) REFERENCES learning_resources(id) ON DELETE CASCADE,
    FOREIGN KEY (pathway_id) REFERENCES learning_pathways(id) ON DELETE CASCADE,
    UNIQUE(student_id, resource_id, pathway_id)
);

CREATE INDEX idx_progress_student ON student_resource_progress(student_id);
CREATE INDEX idx_progress_resource ON student_resource_progress(resource_id);

-- Real-time Notifications Table
CREATE TABLE IF NOT EXISTS real_time_notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    notification_type VARCHAR(50),
    title VARCHAR(500),
    message TEXT,
    related_entity_id BIGINT,
    related_entity_type VARCHAR(50),
    is_read BOOLEAN DEFAULT FALSE,
    priority VARCHAR(20) DEFAULT 'NORMAL',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_notif_user ON real_time_notifications(user_id);
CREATE INDEX idx_notif_read ON real_time_notifications(is_read);
CREATE INDEX idx_notif_created ON real_time_notifications(created_at);

-- Resource Ratings Table
CREATE TABLE IF NOT EXISTS resource_ratings (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    resource_id BIGINT NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    feedback TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (resource_id) REFERENCES learning_resources(id) ON DELETE CASCADE,
    UNIQUE(user_id, resource_id)
);

CREATE INDEX idx_rating_resource ON resource_ratings(resource_id);

-- Job Match Scores Table
CREATE TABLE IF NOT EXISTS job_match_scores (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL,
    job_id BIGINT NOT NULL,
    match_score DECIMAL(5,2),
    skill_match_percentage DECIMAL(5,2),
    experience_match BOOLEAN,
    cgpa_match BOOLEAN,
    location_match BOOLEAN,
    explanation TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    UNIQUE(student_id, job_id)
);

CREATE INDEX idx_match_student ON job_match_scores(student_id);
CREATE INDEX idx_match_score ON job_match_scores(match_score DESC);

-- Pathway Progress Logs
CREATE TABLE IF NOT EXISTS pathway_progress_logs (
    id BIGSERIAL PRIMARY KEY,
    pathway_id BIGINT NOT NULL,
    student_id BIGINT NOT NULL,
    week_number INT,
    day_number INT,
    topic_completed VARCHAR(500),
    hours_spent DECIMAL(4,1),
    notes TEXT,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pathway_id) REFERENCES learning_pathways(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

CREATE INDEX idx_logs_pathway ON pathway_progress_logs(pathway_id);
