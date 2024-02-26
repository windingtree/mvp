#!/bin/bash

# Check if the MVP_LOGS_DIR environment variable is set
if [ -z "${MVP_LOGS_DIR}" ]; then
    echo "Warning: MVP_LOGS_DIR is not set. Exiting..."
    exit 1
fi

LOG_FILE="$MVP_LOGS_DIR/ssl_renew.log"
mkdir -p "$(dirname $LOG_FILE)" && touch $LOG_FILE

# Renew the SSL certificates
sudo certbot renew --non-interactive --post-hook "sudo systemctl reload nginx" | tee $LOG_FILE

# Log the renewal process
echo "SSL certificates renewed on $(date)" | tee $LOG_FILE
