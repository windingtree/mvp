#!/bin/bash

# Install Git
echo "Installing Git..."
sudo apt update
sudo apt install git -y
echo "Git has been installed."

# Check Git version
git --version

# Global Git configuration
# Replace "Your Name" and "youremail@domain.com" with your actual name and email address.
echo "Configuring Git..."
git config --global user.name "Your Name"
git config --global user.email "youremail@domain.com"

# Configure colorful UI for Git
git config --global color.ui auto

# Configure aliases for convenience (optional)
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit

# Check configurations
echo "Git configuration:"
git config --list

# Result output
echo "Git setup completed on $(date)" >> /path/to/logs/setup.log
