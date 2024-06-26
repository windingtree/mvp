#!/bin/bash

# Check if the MVP_LOGS_DIR environment variable is set
if [ -z "${MVP_LOGS_DIR}" ]; then
    echo "Warning: MVP_LOGS_DIR is not set. Exiting..."
    exit 1
fi

LOG_FILE="$MVP_LOGS_DIR/deploy.log"
mkdir -p "$(dirname $LOG_FILE)" && touch $LOG_FILE

# Navigate to project directory
cd /path/to/project || { echo "Failed to enter project directory"; exit 1; }

# Pull latest code from repository
git pull
if [ $? -ne 0 ]; then
    echo "git pull failed, aborting script execution"
    exit 1
fi
echo "Project pulled from repo on $(date)" | tee -a $LOG_FILE

# Update of the pnpm
npm i -g pnpm

# Install dependencies
pnpm install
echo "Dependencies are installed on $(date)" | tee -a $LOG_FILE

# Build the project
pnpm run build:main
pnpm run build:dapp:supplier
pnpm run build:dapp:client
cp -r /path/to/project/packages/dapp-client/dist /var/www/client
cp -r /path/to/project/packages/dapp-supplier/dist /var/www/node
echo "Client and Manager static files are moved to nginx on $(date)" | tee -a $LOG_FILE

# Stop all PM2 processes
pm2 stop all | tee -a $LOG_FILE
echo "PM2 stopped on $(date)" | tee -a $LOG_FILE

# Start services using PM2
pm2 start ecosystem.config.js | tee -a $LOG_FILE
echo "PM2 started on $(date)" | tee -a $LOG_FILE

# Log the startup process
echo "Project started on $(date)" | tee -a $LOG_FILE
