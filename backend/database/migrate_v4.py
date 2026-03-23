"""
CLHEAR v4 migration: schema + seed reference data.
Run from backend: python -m database.migrate_v4
"""
import os
import sys

BACKEND = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BACKEND)

from dotenv import load_dotenv  # noqa: E402

load_dotenv()

from database.init_schema import engine, run_schema_migrations  # noqa: E402
from database.clhear_framework_seed import run_clhear_seed  # noqa: E402


def main():
    print("Applying schema migrations...")
    run_schema_migrations()
    print("Seeding CLHEAR framework reference data...")
    counts = run_clhear_seed(engine)
    print("Seed complete:", counts)


if __name__ == "__main__":
    main()
