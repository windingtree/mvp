#!/bin/bash

LOG_FILE="/path/to/logs/setup.log"
mkdir -p $LOG_FILE

# Ensure npm is installed
if ! command -v npm &> /dev/null; then
    echo "npm is not installed. Please install it first." | tee -a $LOG_FILE
    exit 1
fi

# PM2 install using npm
if ! command -v pm2 &> /dev/null; then
    npm install pm2@latest -g | tee -a $LOG_FILE
    echo "pm2 has been installed." | tee -a $LOG_FILE
else
    echo "pm2 is already installed." | tee -a $LOG_FILE
fi

# Logrotate plugin setup for PM2
pm2 install pm2-logrotate | tee -a $LOG_FILE
pm2 set pm2-logrotate:max_size 10M | tee -a $LOG_FILE
pm2 set pm2-logrotate:retain 100 | tee -a $LOG_FILE
pm2 set pm2-logrotate:rotateInterval '0 0 * * *' | tee -a $LOG_FILE

# Autorun setup
AUTOSTART_CMD=$(pm2 startup systemd -u $(whoami) --hp $(echo $HOME))
echo "Executing autorun setup command: $AUTOSTART_CMD" | tee -a $LOG_FILE
eval $AUTOSTART_CMD | tee -a $LOG_FILE

# Logging setup completion
echo "PM2 setup completed on $(date)" | tee -a $LOG_FILE

