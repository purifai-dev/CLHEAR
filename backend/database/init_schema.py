"""
Initialize CLHEAR database schema
"""
from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

load_dotenv()

engine = create_engine(os.getenv('DATABASE_URL', 'postgresql://clhear_user:dev123@localhost:5432/clhear'))

schema_sql = """
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS regulatory_obligations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    obligation_code VARCHAR(100) UNIQUE,
    regulator VARCHAR(100) NOT NULL,
    rule_reference VARCHAR(200) NOT NULL,
    obligation_title TEXT,
    obligation_text TEXT,
    obligation_summary TEXT,
    effective_date DATE,
    category VARCHAR(100),
    pillar_id INTEGER,
    severity VARCHAR(50),
    severity_reasoning TEXT,
    source_url TEXT,
    source_rule_number VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB
);

CREATE INDEX IF NOT EXISTS idx_obligations_code ON regulatory_obligations(obligation_code);
CREATE INDEX IF NOT EXISTS idx_obligations_regulator ON regulatory_obligations(regulator);
CREATE INDEX IF NOT EXISTS idx_obligations_source_rule ON regulatory_obligations(source_rule_number)
    WHERE source_rule_number IS NOT NULL;

CREATE TABLE IF NOT EXISTS regulatory_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    regulator VARCHAR(100) NOT NULL,
    series VARCHAR(50),
    series_title TEXT,
    subseries VARCHAR(50),
    subseries_title TEXT,
    rule_number VARCHAR(50) NOT NULL,
    rule_title TEXT NOT NULL,
    raw_text TEXT NOT NULL,
    source_url TEXT,
    effective_date DATE,
    last_amended DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_sources_regulator_rule ON regulatory_sources(regulator, rule_number);
CREATE INDEX IF NOT EXISTS idx_sources_regulator ON regulatory_sources(regulator);
CREATE INDEX IF NOT EXISTS idx_sources_series ON regulatory_sources(series);
CREATE INDEX IF NOT EXISTS idx_sources_fts ON regulatory_sources
    USING gin(to_tsvector('english', coalesce(rule_title, '') || ' ' || coalesce(raw_text, '')));

-- Enhanced audit log with user tracking and severity
CREATE TABLE IF NOT EXISTS audit_log (
    id BIGSERIAL PRIMARY KEY,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    action VARCHAR(100),
    entity_type VARCHAR(100),
    entity_id TEXT,
    user_context VARCHAR(200) DEFAULT 'system',
    severity VARCHAR(20) DEFAULT 'info',
    description TEXT,
    changes JSONB,
    metadata JSONB
);

CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_log(timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_log(action);
CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_log(entity_type);
CREATE INDEX IF NOT EXISTS idx_audit_severity ON audit_log(severity);

-- Scheduler jobs for automated regulatory scans
CREATE TABLE IF NOT EXISTS scheduler_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    regulator VARCHAR(100) NOT NULL,
    job_type VARCHAR(50) NOT NULL DEFAULT 'regulatory_scan',
    schedule_cron VARCHAR(100) NOT NULL DEFAULT '0 6 * * *',
    enabled BOOLEAN NOT NULL DEFAULT true,
    last_run TIMESTAMP,
    last_status VARCHAR(50),
    last_result JSONB,
    next_run TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    config JSONB
);

CREATE INDEX IF NOT EXISTS idx_scheduler_enabled ON scheduler_jobs(enabled);
CREATE INDEX IF NOT EXISTS idx_scheduler_regulator ON scheduler_jobs(regulator);

-- Regulatory news / updates from regulators
CREATE TABLE IF NOT EXISTS regulatory_news (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    regulator VARCHAR(100) NOT NULL,
    title TEXT NOT NULL,
    summary TEXT,
    content TEXT,
    source_url TEXT,
    published_date TIMESTAMP,
    category VARCHAR(100),
    importance VARCHAR(20) DEFAULT 'medium',
    is_read BOOLEAN DEFAULT false,
    scraped_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB
);

CREATE INDEX IF NOT EXISTS idx_news_regulator ON regulatory_news(regulator);
CREATE INDEX IF NOT EXISTS idx_news_published ON regulatory_news(published_date DESC);
CREATE INDEX IF NOT EXISTS idx_news_importance ON regulatory_news(importance);
CREATE INDEX IF NOT EXISTS idx_news_read ON regulatory_news(is_read);
CREATE INDEX IF NOT EXISTS idx_news_fts ON regulatory_news
    USING gin(to_tsvector('english', coalesce(title, '') || ' ' || coalesce(summary, '') || ' ' || coalesce(content, '')));

-- Email subscriptions for regulatory news alerts
CREATE TABLE IF NOT EXISTS email_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(320) NOT NULL,
    name VARCHAR(200),
    regulators JSONB DEFAULT '[]',
    importance_filter JSONB DEFAULT '["critical", "high", "medium"]',
    frequency VARCHAR(20) NOT NULL DEFAULT 'daily',
    enabled BOOLEAN NOT NULL DEFAULT true,
    last_sent TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    config JSONB
);

CREATE INDEX IF NOT EXISTS idx_email_sub_enabled ON email_subscriptions(enabled);
CREATE INDEX IF NOT EXISTS idx_email_sub_email ON email_subscriptions(email);
"""

# Columns that may need to be added to existing tables (safe ALTER IF NOT EXISTS)
alter_sql = """
DO $$
BEGIN
    -- Add new columns to audit_log if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='audit_log' AND column_name='entity_id') THEN
        ALTER TABLE audit_log ADD COLUMN entity_id TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='audit_log' AND column_name='user_context') THEN
        ALTER TABLE audit_log ADD COLUMN user_context VARCHAR(200) DEFAULT 'system';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='audit_log' AND column_name='severity') THEN
        ALTER TABLE audit_log ADD COLUMN severity VARCHAR(20) DEFAULT 'info';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='audit_log' AND column_name='description') THEN
        ALTER TABLE audit_log ADD COLUMN description TEXT;
    END IF;
END $$;
"""

with engine.connect() as conn:
    # First, run ALTER to add new columns to existing audit_log table
    conn.execute(text(alter_sql))
    conn.commit()

with engine.connect() as conn:
    # Then run the full schema (CREATE TABLE IF NOT EXISTS is safe for all tables)
    conn.execute(text(schema_sql))
    conn.commit()
    print("Database schema created/updated successfully!")
