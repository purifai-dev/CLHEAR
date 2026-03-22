"""
CLHEAR Schema Migration v3
- regulatory_items: AI-extracted compliance items (obligations, licensing, roles, etc.)
- scrape_runs: FINRA scrape + analysis pipeline progress
Safe to run multiple times (IF NOT EXISTS).
"""
from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

load_dotenv()

engine = create_engine(os.getenv("DATABASE_URL", "postgresql://clhear_user:dev123@localhost:5432/clhear"))

migration_sql = """
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
"""

with engine.connect() as conn:
    conn.execute(text(migration_sql))
    conn.commit()
    print("✓ Migration v3 complete: regulatory_items + scrape_runs.")
