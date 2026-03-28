#!/bin/bash
# Local Development Runner for Shingi AI
# Runs the .NET Backend, Python Agent, and React Frontend in parallel

set -e

# Setup colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}▶ Starting Shingi AI Multi-Agent Enterprise Stack...${NC}\n"

# Start the Agent
echo -e "${YELLOW}Starting Python LangGraph Agent...${NC}"
cd src/agent
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi
source venv/bin/activate
pip install -r requirements.txt > /dev/null 2>&1
uvicorn app.main:app --host 0.0.0.0 --port 8000 &
AGENT_PID=$!
cd ../..

# Start the Backend
echo -e "${YELLOW}Starting .NET API Backend...${NC}"
cd src/backend
# Assuming ShingiAI.Api is the start project
dotnet run --project ShingiAI.Api/ShingiAI.Api.csproj --urls "http://localhost:5000" &
BACKEND_PID=$!
cd ../..

# Start the Frontend
echo -e "${YELLOW}Starting React Frontend...${NC}"
cd src/frontend
npm install > /dev/null 2>&1
npm run dev -- --port 3000 &
FRONTEND_PID=$!
cd ../..

echo -e "\n${GREEN}✔ All systems are running!${NC}"
echo -e "Frontend: http://localhost:3000"
echo -e "Backend API: http://localhost:5000"
echo -e "Agent API: http://localhost:8000"
echo -e "\nPress [CTRL+C] to stop all services."

# Trap SIGINT (Ctrl+C) to kill background processes cleanly
trap "echo -e '\nStopping all services...'; kill $AGENT_PID $BACKEND_PID $FRONTEND_PID; exit" SIGINT

# Wait for children to exit
wait
