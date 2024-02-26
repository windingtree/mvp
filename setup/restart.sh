#!/bin/bash

# Check if the MVP_LOGS_DIR environment variable is set
if [ -z "${MVP_LOGS_DIR}" ]; then
    echo "Warning: MVP_LOGS_DIR is not set. Exiting..."
    exit 1
fi

LOG_FILE="$MVP_LOGS_DIR/restart.log"
mkdir -p "$(dirname $LOG_FILE)" && touch $LOG_FILE

# Call the stop script
/path/to/scripts/stop.sh

# Call the start script
/path/to/scripts/deploy.sh

# Log the restart process
echo "Services restarted on $(date)" | tee $LOG_FILE
