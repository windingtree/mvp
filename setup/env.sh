#!/bin/bash

run_with_env() {
    # Path to script to execute
    local script_path="$1"
    shift
    # Script execution with current env
    eval "$script_path"
}


# Check if the MVP_LOGS_DIR environment variable is set
if [ -z "${MVP_LOGS_DIR}" ]; then
    echo "Warning: MVP_LOGS_DIR is not set. Exiting..."
    exit 1
fi

LOG_FILE="$MVP_LOGS_DIR/deploy.log"
mkdir -p "$(dirname $LOG_FILE)" && touch $LOG_FILE

# Load environment variables

# Specify the path to the .env file
ENV_FILE="/root/setup/.env"

# Check if the file exists
if [ ! -f "$ENV_FILE" ]; then
    echo "The .env file was not found at the path $ENV_FILE"
    exit 1
fi

# Read each line in the file
while IFS='=' read -r key value
do
  # Skip lines starting with # (comments)
  [[ "$key" =~ ^#.*$ ]] && continue
  # Skip empty lines
  [ -z "$key" ] && continue
  # Export variables to the environment
  export $key="$value"
done < "$ENV_FILE"

echo "All variables from $ENV_FILE have been exported to the environment."
