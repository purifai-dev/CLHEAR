from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

load_dotenv()

engine = create_engine('postgresql://clhear_user:dev123@localhost:5432/clhear')

with engine.connect() as conn:
    result = conn.execute(text("SELECT obligation_code, obligation_title, regulator FROM regulatory_obligations"))
    
    print("\n📋 FINRA Rules in Database:")
    print("=" * 60)
    for row in result:
        print(f"  {row.obligation_code}: {row.obligation_title}")
    print("=" * 60)
