#!/bin/bash
cd ~/projects/clhear-platform
echo "Setting up CLHEAR..." && \
git init && git add . && git commit -m "init" 2>/dev/null; \
cd backend && python3 -m venv venv && source venv/bin/activate && \
echo "fastapi
uvicorn[standard]
anthropic
requests
python-dotenv" > requirements.txt && pip install -q -r requirements.txt && \
echo "ANTHROPIC_API_KEY=your-key" > .env && \
cd .. && echo "version: '3.8'
services:
  postgres:
    image: postgres:16-alpine
    ports: ['5432:5432']
    environment:
      POSTGRES_DB: clhear
      POSTGRES_USER: clhear_user  
      POSTGRES_PASSWORD: dev123
volumes: [postgres_data:]" > docker-compose.yml && \
docker-compose up -d && \
echo "✓ Done! Run: cd backend && source venv/bin/activate"
