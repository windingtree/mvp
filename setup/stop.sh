#!/bin/bash
# Stop all PM2 processes
pm2 stop all

# Log the stop process
echo "All services stopped on $(date)" >> /path/to/logs/stop.log
