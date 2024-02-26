#!/bin/bash

# Define the line to add
LINE="export MVP_LOGS_DIR=\"\$HOME/logs\""

# Define the target shell configuration file
SHELL_CONFIG="$HOME/.bashrc"

# Check if the line already exists in the configuration file
if grep -qF -- "$LINE" "$SHELL_CONFIG"; then
    echo "Line already exists in $SHELL_CONFIG"
else
    # If the line does not exist, add it to the file
    echo "$LINE" >> "$SHELL_CONFIG"
    echo "Line added to $SHELL_CONFIG"
fi
