#!/bin/bash

# Check if the MVP_LOGS_DIR environment variable is set
if [ -z "${MVP_LOGS_DIR}" ]; then
    echo "Warning: MVP_LOGS_DIR is not set. Exiting..."
    exit 1
fi

LOG_FILE="$MVP_LOGS_DIR/setup.log"
mkdir -p "$(dirname $LOG_FILE)" && touch $LOG_FILE

echo "Starting Nginx setup on $(date)" | tee -a $LOG_FILE

# Check for Nginx and install if not present
if ! which nginx > /dev/null 2>&1; then
    sudo apt-get update && sudo apt-get install -y nginx | tee -a $LOG_FILE
    echo "Nginx has been installed." | tee -a $LOG_FILE
fi

# Set up Nginx configuration
sudo cp /path/to/your/nginx.conf /etc/nginx/sites-available/your_project | tee -a $LOG_FILE
sudo ln -s /etc/nginx/sites-available/your_project /etc/nginx/sites-enabled/ | tee -a $LOG_FILE
sudo systemctl restart nginx

# Ensure nginx is enabled and running
sudo systemctl enable nginx | tee -a $LOG_FILE
sudo systemctl start nginx | tee -a $LOG_FILE

# Log the setup process
echo "Nginx setup completed on $(date)" | tee -a $LOG_FILE
