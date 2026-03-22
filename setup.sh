#!/bin/bash
set -e
cd ~/projects/clhear-platform
echo "Setting up CLHEAR..."
git init || true
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -q fastapi uvicorn anthropic requests python-dotenv
echo "ANTHROPIC_API_KEY=your-key" > .env
cd ..
cat > docker-compose.yml << 'DOCKEREND'
version: "3.8"
services:
  postgres:
    image: postgres:16-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: clhear
      POSTGRES_USER: clhear_user
      POSTGRES_PASSWORD: dev123
volumes:
  postgres_data:
DOCKEREND
docker-compose up -d
echo "✓ Setup complete!"

#!/bin/bash
set -e
cd ~/projects/clhear-platform
echo "Setting up CLHEAR..."
git init || true
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -q fastapi uvicorn anthropic requests python-dotenv
echo "ANTHROPIC_API_KEY=your-key" > .env
cd ..
cat > docker-compose.yml << 'DOCKEREND'
version: "3.8"
services:
  postgres:
    image: postgres:16-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: clhear
      POSTGRES_USER: clhear_user
      POSTGRES_PASSWORD: dev123
volumes:
  postgres_data:
DOCKEREND
docker-compose up -d
echo "✓ Setup complete!"


