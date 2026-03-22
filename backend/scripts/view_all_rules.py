from sqlalchemy import create_engine, text
import json
from dotenv import load_dotenv

load_dotenv()

engine = create_engine('postgresql://clhear_user:dev123@localhost:5432/clhear')

with engine.connect() as conn:
    result = conn.execute(text("""
        SELECT 
            obligation_code,
            regulator,
            rule_reference,
            obligation_title,
            obligation_text,
            category,
            pillar_id,
            severity,
            created_at,
            metadata
        FROM regulatory_obligations
        ORDER BY obligation_code
    """))
    
    print("\n" + "="*80)
    print("CLHEAR - Full Regulatory Obligations Database")
    print("="*80 + "\n")
    
    for row in result:
        print(f"📌 {row.obligation_code}")
        print(f"   Regulator: {row.regulator}")
        print(f"   Reference: {row.rule_reference}")
        print(f"   Title: {row.obligation_title}")
        print(f"   Category: {row.category}")
        print(f"   Pillar: {row.pillar_id}")
        print(f"   Severity: {row.severity}")
        print(f"   Created: {row.created_at}")
        print(f"\n   📄 Full Text:")
        print(f"   {'-'*76}")
        # Print text with indentation
        for line in row.obligation_text.split('\n'):
            print(f"   {line}")
        print(f"   {'-'*76}")
        
        if row.metadata:
            meta = json.loads(row.metadata) if isinstance(row.metadata, str) else row.metadata
            print(f"\n   ℹ️  Metadata:")
            print(f"      Content Hash: {meta.get('content_hash', 'N/A')[:16]}...")
            print(f"      Last Updated: {meta.get('last_updated', 'N/A')}")
        
        print("\n" + "="*80 + "\n")
