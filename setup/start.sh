#!/bin/bash
# Load environment variables
set -a
source /path/to/.env
set +a

# Navigate to project directory
cd /path/to/your/project

# Pull latest code from repository
git pull

# Install dependencies
pnpm install

# Build the project
pnpm run build

# Stop all PM2 processes
pm2 stop all

# Start services using PM2
pm2 start ecosystem.config.js

# Log the startup process
echo "Project started on $(date)" >> /path/to/logs/startup.log
