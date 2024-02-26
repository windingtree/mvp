#!/bin/bash

LOG_FILE="/path/to/logs/setup.log"
mkdir -p "$(dirname $LOG_FILE)" && touch $LOG_FILE

echo "Starting certbot setup on $(date)" | tee -a $LOG_FILE

# Install certbot for SSL certificates if not present
if ! which certbot > /dev/null 2>&1; then
    sudo snap install --classic certbot | tee -a $LOG_FILE
    sudo ln -s /snap/bin/certbot /usr/bin/certbot | tee -a $LOG_FILE
    echo "Certbot has been installed." | tee -a $LOG_FILE
fi

# Obtain and Install SSL certificates for your domains
# Replace domain names with your actual domain names
sudo certbot --nginx -d example.com -d www.example.com -d coordinator.windingtree.com -d node.windingtree.com -d mvp.windingtree.com | tee -a $LOG_FILE

# Restart nginx to apply changes
sudo systemctl restart nginx | tee -a $LOG_FILE

# Log the setup process
echo "Certbot setup completed on $(date)" | tee -a $LOG_FILE
