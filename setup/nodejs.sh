#!/bin/bash

LOG_FILE="/path/to/logs/setup.log"
mkdir -p $LOG_FILE

# Start logging
echo "Starting NVM and Node.js installation and configuration on $(date)" | tee $LOG_FILE

# Install NVM (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash 2>&1 | tee -a $LOG_FILE

# Add NVM initialization script to .bashrc
{
    echo 'export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"'
    echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm'
} >> ~/.bashrc 2>&1 | tee -a $LOG_FILE

# Load NVM script to use NVM in the current session
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm

# Verify if NVM was successfully installed
echo "Verifying NVM installation..." | tee -a $LOG_FILE
command -v nvm | tee -a $LOG_FILE

# Install the latest version of Node.js
echo "Installing the latest version of Node.js..." | tee -a $LOG_FILE
nvm install node 2>&1 | tee -a $LOG_FILE

# Install specific version of Node.js
echo "Installing specific version of Node.js (20)..." | tee -a $LOG_FILE
nvm install 20 2>&1 | tee -a $LOG_FILE

# Use the installed version
echo "Using Node.js version 20..." | tee -a $LOG_FILE
nvm use 20 2>&1 | tee -a $LOG_FILE

# Set the default Node.js version
echo "Setting default Node.js version to 20..." | tee -a $LOG_FILE
nvm alias default 20 2>&1 | tee -a $LOG_FILE

# Install pnpm utility
echo "Installing pnpm utility..." | tee -a $LOG_FILE
npm install pnpm -g 2>&1 | tee -a $LOG_FILE

# Log the setup process completion
echo "NVM, Node.js, and pnpm setup completed on $(date)" | tee -a $LOG_FILE
