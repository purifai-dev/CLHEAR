"""
CLHEAR Schema Migration v2
- Creates regulatory_sources table (raw regulatory text)
- Adds severity_reasoning, source_url, source_rule_number to regulatory_obligations
Safe to run multiple times (idempotent via IF NOT EXISTS / ADD COLUMN IF NOT EXISTS).
"""
from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

load_dotenv()

engine = create_engine(os.getenv("DATABASE_URL", "postgresql://clhear_user:dev123@localhost:5432/clhear"))

migration_sql = """
-- New table: raw regulatory source documents
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

CREATE UNIQUE INDEX IF NOT EXISTS idx_sources_regulator_rule
    ON regulatory_sources(regulator, rule_number);

CREATE INDEX IF NOT EXISTS idx_sources_regulator
    ON regulatory_sources(regulator);

CREATE INDEX IF NOT EXISTS idx_sources_series
    ON regulatory_sources(series);

CREATE INDEX IF NOT EXISTS idx_sources_fts
    ON regulatory_sources
    USING gin(to_tsvector('english', coalesce(rule_title, '') || ' ' || coalesce(raw_text, '')));

-- Add new columns to existing obligations table (additive, safe)
ALTER TABLE regulatory_obligations
    ADD COLUMN IF NOT EXISTS severity_reasoning TEXT,
    ADD COLUMN IF NOT EXISTS source_url TEXT,
    ADD COLUMN IF NOT EXISTS source_rule_number VARCHAR(50);

CREATE INDEX IF NOT EXISTS idx_obligations_source_rule
    ON regulatory_obligations(source_rule_number)
    WHERE source_rule_number IS NOT NULL;
"""

with engine.connect() as conn:
    conn.execute(text(migration_sql))
    conn.commit()
    print("✓ Migration v2 complete: regulatory_sources created, regulatory_obligations extended.")
