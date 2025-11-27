-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Departments Table
CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    capacity INTEGER NOT NULL,
    current_occupancy INTEGER NOT NULL,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Operational Metrics Table (Historical Data)
CREATE TABLE IF NOT EXISTS metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    admissions_count INTEGER NOT NULL,
    discharges_count INTEGER NOT NULL,
    emergency_wait_time INTEGER, -- in minutes
    bed_shortages INTEGER DEFAULT 0
);

-- Active Alerts Table
CREATE TABLE IF NOT EXISTS alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message TEXT NOT NULL,
    severity VARCHAR(50) NOT NULL, -- 'critical', 'warning', 'info'
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    location VARCHAR(100)
);

-- AI Predictions Table
CREATE TABLE IF NOT EXISTS predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    prediction_type VARCHAR(100) NOT NULL, -- 'surge', 'staffing', 'capacity'
    confidence_score DECIMAL(5, 2),
    details TEXT,
    status VARCHAR(50) -- 'pending', 'verified', 'dismissed'
);

-- Staffing Table
CREATE TABLE IF NOT EXISTS staffing (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    department_id UUID REFERENCES departments(id),
    shift_id VARCHAR(50),
    nurses_on_duty INTEGER,
    doctors_on_duty INTEGER,
    efficiency_rating DECIMAL(5, 2), -- 0-100
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Initial Seed Data for Departments
INSERT INTO departments (name, capacity, current_occupancy) VALUES
('Cardiology', 45, 39),
('Oncology', 38, 27),
('ICU', 20, 18),
('Pediatrics', 32, 21),
('Emergency', 50, 39)
ON CONFLICT DO NOTHING;
