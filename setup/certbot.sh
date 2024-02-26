#!/bin/bash

# Check if the MVP_LOGS_DIR environment variable is set
if [ -z "${MVP_LOGS_DIR}" ]; then
    echo "Warning: MVP_LOGS_DIR is not set. Exiting..."
    exit 1
fi

LOG_FILE="$MVP_LOGS_DIR/setup.log"
mkdir -p "$(dirname $LOG_FILE)" && touch $LOG_FILE

echo "Starting certbot setup on $(date)" | tee -a $LOG_FILE

# Install certbot for SSL certificates if not present
if ! which certbot > /dev/null 2>&1; then
    sudo snap install --classic certbot | tee -a $LOG_FILE
    sudo ln -s /snap/bin/certbot /usr/bin/certbot | tee -a $LOG_FILE
    echo "Certbot has been installed." | tee -a $LOG_FILE
fi

# Obtain and Install SSL certificates for your domains
sudo certbot --nginx -d coordinator.windingtree.com -d node.windingtree.com -d mvp.windingtree.com | tee -a $LOG_FILE

# Restart nginx to apply changes
sudo systemctl restart nginx | tee -a $LOG_FILE

# Log the setup process
echo "Certbot setup completed on $(date)" | tee -a $LOG_FILE
