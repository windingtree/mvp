#!/bin/bash

# Check if the MVP_LOGS_DIR environment variable is set
if [ -z "${MVP_LOGS_DIR}" ]; then
    echo "Warning: MVP_LOGS_DIR is not set. Exiting..."
    exit 1
fi

LOG_FILE="$MVP_LOGS_DIR/deploy.log"
mkdir -p "$(dirname $LOG_FILE)" && touch $LOG_FILE

# Stop all PM2 processes
pm2 stop all

# Log the stop process
echo "All services stopped on $(date)" | tee -a $LOG_FILE
