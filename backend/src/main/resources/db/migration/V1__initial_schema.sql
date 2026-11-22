-- V1__initial_schema.sql: Initial schema for AirWise AI

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'USER',
    persona VARCHAR(50) DEFAULT 'WORKING_PROFESSIONAL',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User Preferences
CREATE TABLE IF NOT EXISTS user_preferences (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    default_city VARCHAR(100) DEFAULT 'New Delhi',
    default_lat DOUBLE PRECISION DEFAULT 28.6139,
    default_lon DOUBLE PRECISION DEFAULT 77.2090,
    has_infants BOOLEAN DEFAULT FALSE,
    has_elderly BOOLEAN DEFAULT FALSE,
    has_respiratory_issues BOOLEAN DEFAULT FALSE,
    preferred_commute VARCHAR(50) DEFAULT 'METRO',
    notify_smog_alerts BOOLEAN DEFAULT TRUE,
    notify_morning_briefing BOOLEAN DEFAULT TRUE,
    notify_purifier_reminders BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_user_pref UNIQUE (user_id)
);

-- Saved Locations / Stations
CREATE TABLE IF NOT EXISTS locations (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    country VARCHAR(100),
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    timezone VARCHAR(50),
    is_favorite BOOLEAN DEFAULT FALSE,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Air Quality Readings snapshot
CREATE TABLE IF NOT EXISTS air_quality_readings (
    id BIGSERIAL PRIMARY KEY,
    location_name VARCHAR(150) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    aqi_us INTEGER NOT NULL,
    aqi_category VARCHAR(50) NOT NULL,
    dominant_pollutant VARCHAR(50),
    temperature DOUBLE PRECISION,
    humidity DOUBLE PRECISION,
    wind_speed DOUBLE PRECISION,
    source_name VARCHAR(100) DEFAULT 'Open-Meteo Air Intelligence',
    recorded_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Pollutant Measurements breakdown
CREATE TABLE IF NOT EXISTS pollutant_measurements (
    id BIGSERIAL PRIMARY KEY,
    reading_id BIGINT REFERENCES air_quality_readings(id) ON DELETE CASCADE,
    pollutant_type VARCHAR(20) NOT NULL, -- PM2.5, PM10, NO2, O3, SO2, CO
    value DOUBLE PRECISION NOT NULL,
    unit VARCHAR(20) NOT NULL,
    threshold_category VARCHAR(50)
);

-- Daily Routines
CREATE TABLE IF NOT EXISTS daily_routines (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    routine_date DATE NOT NULL,
    summary VARCHAR(500),
    overall_exposure_risk VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Routine Activities
CREATE TABLE IF NOT EXISTS routine_activities (
    id BIGSERIAL PRIMARY KEY,
    routine_id BIGINT NOT NULL REFERENCES daily_routines(id) ON DELETE CASCADE,
    time_slot VARCHAR(50) NOT NULL, -- e.g. "07:00 - 08:30"
    activity_type VARCHAR(100) NOT NULL, -- "Morning Jogging", "Office Commute"
    suggested_activity VARCHAR(255) NOT NULL,
    reason TEXT NOT NULL,
    exposure_level VARCHAR(50) NOT NULL, -- "LOW", "MODERATE", "SEVERE"
    alternative_action TEXT,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Chat Sessions
CREATE TABLE IF NOT EXISTS chat_sessions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) DEFAULT 'Air Quality Consultation',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Chat Messages
CREATE TABLE IF NOT EXISTS chat_messages (
    id BIGSERIAL PRIMARY KEY,
    session_id BIGINT NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
    sender_role VARCHAR(20) NOT NULL, -- "USER", "ASSISTANT", "SYSTEM"
    message_content TEXT NOT NULL,
    aqi_context INTEGER,
    location_context VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Saved Recommendations
CREATE TABLE IF NOT EXISTS saved_recommendations (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL, -- "INDOOR", "ROUTINE", "SUSTAINABILITY", "HEALTH"
    content TEXT NOT NULL,
    action_item VARCHAR(255),
    saved_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Environmental Impact / Commute logs
CREATE TABLE IF NOT EXISTS environmental_impact (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    trip_date DATE NOT NULL,
    transport_mode VARCHAR(50) NOT NULL, -- "METRO", "BUS", "BICYCLE", "WALKING", "CARPOOL"
    distance_km DOUBLE PRECISION NOT NULL,
    co2_saved_kg DOUBLE PRECISION NOT NULL,
    pm25_avoided_g DOUBLE PRECISION NOT NULL,
    notes VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    alert_type VARCHAR(50) NOT NULL, -- "SMOG_SPIKE", "PURIFIER_CLEAN", "DAILY_BRIEF"
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_aq_readings_loc_time ON air_quality_readings(location_name, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_routine_user_date ON daily_routines(user_id, routine_date);
CREATE INDEX IF NOT EXISTS idx_impact_user ON environmental_impact(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_session ON chat_messages(session_id);
