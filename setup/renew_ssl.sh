#!/bin/bash
# Renew the SSL certificates
certbot renew --non-interactive --post-hook "sudo systemctl reload nginx"

# Log the renewal process
echo "SSL certificates renewed on $(date)" >> /path/to/logs/ssl-renew.log
