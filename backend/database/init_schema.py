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

-- FINRA pipeline: structured regulatory items (AI-extracted) + scrape run tracking
CREATE TABLE IF NOT EXISTS regulatory_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_code VARCHAR(100) UNIQUE NOT NULL,
    regulator VARCHAR(100) NOT NULL,
    item_type VARCHAR(50) NOT NULL,
    rule_reference VARCHAR(200),
    source_rule_number VARCHAR(50),
    source_url TEXT,
    title TEXT,
    description TEXT,
    summary TEXT,
    category VARCHAR(100),
    pillar_id INTEGER,
    importance VARCHAR(20),
    importance_reasoning TEXT,
    evidence_excerpt TEXT,
    tags JSONB,
    applicability JSONB,
    content_hash VARCHAR(64),
    analysis_version VARCHAR(20),
    scraped_at TIMESTAMP,
    analyzed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB
);

CREATE INDEX IF NOT EXISTS idx_items_regulator ON regulatory_items(regulator);
CREATE INDEX IF NOT EXISTS idx_items_type ON regulatory_items(item_type);
CREATE INDEX IF NOT EXISTS idx_items_category ON regulatory_items(category);
CREATE INDEX IF NOT EXISTS idx_items_importance ON regulatory_items(importance);
CREATE INDEX IF NOT EXISTS idx_items_source_rule ON regulatory_items(source_rule_number)
    WHERE source_rule_number IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_items_pillar ON regulatory_items(pillar_id);
CREATE INDEX IF NOT EXISTS idx_items_fts ON regulatory_items
    USING gin(to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '')));

CREATE TABLE IF NOT EXISTS scrape_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    run_type VARCHAR(50) NOT NULL DEFAULT 'finra_full',
    status VARCHAR(30) NOT NULL DEFAULT 'pending',
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    rules_total INTEGER DEFAULT 0,
    rules_done INTEGER DEFAULT 0,
    items_created INTEGER DEFAULT 0,
    items_updated INTEGER DEFAULT 0,
    sources_new INTEGER DEFAULT 0,
    sources_updated INTEGER DEFAULT 0,
    error_message TEXT,
    progress JSONB,
    metadata JSONB
);

CREATE INDEX IF NOT EXISTS idx_scrape_runs_status ON scrape_runs(status);
CREATE INDEX IF NOT EXISTS idx_scrape_runs_started ON scrape_runs(started_at DESC);

-- ---------------------------------------------------------------------------
-- CLHEAR framework reference + compliance program (v4)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS verticals (
    id SERIAL PRIMARY KEY,
    vertical_number INTEGER NOT NULL UNIQUE,
    name VARCHAR(300) NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS pillars (
    pillar_number INTEGER PRIMARY KEY CHECK (pillar_number BETWEEN 1 AND 18),
    vertical_id INTEGER NOT NULL REFERENCES verticals(id),
    name VARCHAR(400) NOT NULL,
    description TEXT
);

CREATE INDEX IF NOT EXISTS idx_pillars_vertical ON pillars(vertical_id);

CREATE TABLE IF NOT EXISTS regulators (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(300) NOT NULL,
    jurisdiction VARCHAR(200),
    website TEXT,
    scraper_type VARCHAR(20) NOT NULL DEFAULT 'none',
    scraper_config JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reference_standards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(400) NOT NULL,
    category VARCHAR(60),
    primary_focus TEXT,
    clhear_relevance TEXT,
    sort_order INTEGER
);

CREATE TABLE IF NOT EXISTS compliance_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_number INTEGER NOT NULL UNIQUE CHECK (role_number BETWEEN 1 AND 39),
    title VARCHAR(400) NOT NULL,
    line_of_defence VARCHAR(30),
    reports_to VARCHAR(300),
    tier VARCHAR(30),
    description TEXT
);

CREATE TABLE IF NOT EXISTS role_pillar_map (
    role_id UUID NOT NULL REFERENCES compliance_roles(id) ON DELETE CASCADE,
    pillar_number INTEGER NOT NULL REFERENCES pillars(pillar_number) ON DELETE CASCADE,
    PRIMARY KEY (role_id, pillar_number)
);

CREATE TABLE IF NOT EXISTS governance_bodies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    body_number INTEGER NOT NULL UNIQUE CHECK (body_number BETWEEN 1 AND 20),
    name VARCHAR(500) NOT NULL,
    tier VARCHAR(40),
    chair_role_id UUID REFERENCES compliance_roles(id),
    meeting_frequency VARCHAR(200),
    description TEXT,
    key_standards TEXT
);

CREATE TABLE IF NOT EXISTS governance_pillar_map (
    governance_body_id UUID NOT NULL REFERENCES governance_bodies(id) ON DELETE CASCADE,
    pillar_number INTEGER NOT NULL REFERENCES pillars(pillar_number) ON DELETE CASCADE,
    PRIMARY KEY (governance_body_id, pillar_number)
);

CREATE TABLE IF NOT EXISTS role_standards (
    role_id UUID NOT NULL REFERENCES compliance_roles(id) ON DELETE CASCADE,
    standard_id UUID NOT NULL REFERENCES reference_standards(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, standard_id)
);

CREATE TABLE IF NOT EXISTS control_frameworks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(400) NOT NULL,
    description TEXT,
    firm_type VARCHAR(120),
    jurisdiction VARCHAR(200),
    status VARCHAR(30) DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB
);

CREATE TABLE IF NOT EXISTS controls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    control_code VARCHAR(120) NOT NULL,
    framework_id UUID NOT NULL REFERENCES control_frameworks(id) ON DELETE CASCADE,
    pillar_number INTEGER REFERENCES pillars(pillar_number),
    vertical_id INTEGER REFERENCES verticals(id),
    title VARCHAR(600) NOT NULL,
    description TEXT,
    control_type VARCHAR(40),
    frequency VARCHAR(120),
    owner_role_id UUID REFERENCES compliance_roles(id),
    status VARCHAR(40),
    effectiveness_rating VARCHAR(60),
    last_tested DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB,
    UNIQUE (framework_id, control_code)
);

CREATE INDEX IF NOT EXISTS idx_controls_framework ON controls(framework_id);
CREATE INDEX IF NOT EXISTS idx_controls_pillar ON controls(pillar_number);

CREATE TABLE IF NOT EXISTS control_obligations (
    control_id UUID NOT NULL REFERENCES controls(id) ON DELETE CASCADE,
    regulatory_item_id UUID NOT NULL REFERENCES regulatory_items(id) ON DELETE CASCADE,
    coverage VARCHAR(30),
    notes TEXT,
    PRIMARY KEY (control_id, regulatory_item_id)
);

CREATE TABLE IF NOT EXISTS control_role_assignments (
    control_id UUID NOT NULL REFERENCES controls(id) ON DELETE CASCADE,
    compliance_role_id UUID NOT NULL REFERENCES compliance_roles(id) ON DELETE CASCADE,
    responsibility VARCHAR(40),
    PRIMARY KEY (control_id, compliance_role_id)
);

CREATE TABLE IF NOT EXISTS procedures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    procedure_code VARCHAR(120) NOT NULL,
    control_id UUID NOT NULL REFERENCES controls(id) ON DELETE CASCADE,
    pillar_number INTEGER REFERENCES pillars(pillar_number),
    title VARCHAR(600),
    description TEXT,
    trigger_text TEXT,
    steps JSONB,
    decision_points JSONB,
    sla VARCHAR(200),
    frequency VARCHAR(120),
    last_reviewed DATE,
    status VARCHAR(40),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (control_id, procedure_code)
);

CREATE TABLE IF NOT EXISTS compliance_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_code VARCHAR(120) NOT NULL,
    framework_id UUID NOT NULL REFERENCES control_frameworks(id) ON DELETE CASCADE,
    name VARCHAR(400) NOT NULL,
    asset_type VARCHAR(40),
    description TEXT,
    owner VARCHAR(300),
    criticality VARCHAR(30),
    vertical_id INTEGER REFERENCES verticals(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (framework_id, asset_code)
);

CREATE TABLE IF NOT EXISTS asset_controls (
    asset_id UUID NOT NULL REFERENCES compliance_assets(id) ON DELETE CASCADE,
    control_id UUID NOT NULL REFERENCES controls(id) ON DELETE CASCADE,
    scope_notes TEXT,
    PRIMARY KEY (asset_id, control_id)
);

CREATE TABLE IF NOT EXISTS risk_register (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    risk_code VARCHAR(120) NOT NULL,
    framework_id UUID NOT NULL REFERENCES control_frameworks(id) ON DELETE CASCADE,
    pillar_number INTEGER REFERENCES pillars(pillar_number),
    title VARCHAR(600),
    description TEXT,
    inherent_likelihood INTEGER,
    inherent_impact INTEGER,
    residual_likelihood INTEGER,
    residual_impact INTEGER,
    risk_score INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (framework_id, risk_code)
);

CREATE INDEX IF NOT EXISTS idx_risk_fw ON risk_register(framework_id);

CREATE TABLE IF NOT EXISTS risk_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    risk_id UUID NOT NULL REFERENCES risk_register(id) ON DELETE CASCADE,
    control_id UUID NOT NULL REFERENCES controls(id) ON DELETE CASCADE,
    assessment_date DATE,
    effectiveness VARCHAR(60),
    gap_description TEXT,
    remediation_plan TEXT,
    due_date DATE,
    status VARCHAR(40),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_risk_assess_risk ON risk_assessments(risk_id);
CREATE INDEX IF NOT EXISTS idx_risk_assess_ctrl ON risk_assessments(control_id);

CREATE TABLE IF NOT EXISTS control_evidence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    control_id UUID NOT NULL REFERENCES controls(id) ON DELETE CASCADE,
    evidence_type VARCHAR(60),
    title VARCHAR(600),
    description TEXT,
    file_ref TEXT,
    collected_at TIMESTAMP,
    collected_by VARCHAR(300),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB
);

CREATE TABLE IF NOT EXISTS regulatory_item_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    regulatory_item_id UUID REFERENCES regulatory_items(id) ON DELETE SET NULL,
    version_number INTEGER NOT NULL DEFAULT 1,
    previous_hash VARCHAR(64),
    new_hash VARCHAR(64),
    diff_summary TEXT,
    changed_fields JSONB,
    detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    source_rule_number VARCHAR(80),
    regulator VARCHAR(80),
    batch_id UUID
);

CREATE INDEX IF NOT EXISTS idx_riv_rule ON regulatory_item_versions(source_rule_number, regulator);
CREATE INDEX IF NOT EXISTS idx_riv_item ON regulatory_item_versions(regulatory_item_id);
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

# Run after core + v4 tables exist (references regulators)
alter_sql_regulators = """
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='regulatory_obligations' AND column_name='regulator_id') THEN
        ALTER TABLE regulatory_obligations ADD COLUMN regulator_id UUID REFERENCES regulators(id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='regulatory_sources' AND column_name='regulator_id') THEN
        ALTER TABLE regulatory_sources ADD COLUMN regulator_id UUID REFERENCES regulators(id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='regulatory_items' AND column_name='regulator_id') THEN
        ALTER TABLE regulatory_items ADD COLUMN regulator_id UUID REFERENCES regulators(id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='regulatory_news' AND column_name='regulator_id') THEN
        ALTER TABLE regulatory_news ADD COLUMN regulator_id UUID REFERENCES regulators(id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='scheduler_jobs' AND column_name='regulator_id') THEN
        ALTER TABLE scheduler_jobs ADD COLUMN regulator_id UUID REFERENCES regulators(id);
    END IF;
END $$;
"""

def run_schema_migrations():
    """Apply DDL (safe to run multiple times)."""
    with engine.connect() as conn:
        conn.execute(text(alter_sql))
        conn.commit()

    with engine.connect() as conn:
        conn.execute(text(schema_sql))
        conn.commit()

    with engine.connect() as conn:
        conn.execute(text(alter_sql_regulators))
        conn.commit()
    print("Database schema created/updated successfully!")


if __name__ == "__main__":
    run_schema_migrations()
