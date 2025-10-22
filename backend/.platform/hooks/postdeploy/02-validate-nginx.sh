#!/bin/bash

# TransparAI nginx configuration validation and restart script
echo "Validating nginx configuration..."

# Test nginx configuration
if nginx -t -c /var/proxy/staging/nginx/nginx.conf; then
    echo "Nginx configuration is valid"
    
    # Restart nginx
    systemctl restart nginx
    
    if systemctl is-active --quiet nginx; then
        echo "Nginx restarted successfully"
    else
        echo "Failed to restart nginx"
        exit 1
    fi
else
    echo "Nginx configuration test failed"
    exit 1
fi

echo "Nginx configuration updated successfully"