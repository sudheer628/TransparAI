#!/bin/bash

# TransparAI nginx pre-deployment setup script
echo "🔧 Setting up nginx configuration for TransparAI..."

# Ensure the nginx configuration directory exists
mkdir -p /var/proxy/staging/nginx/conf.d

# Copy our main nginx configuration
echo "📋 Copying main nginx configuration..."
if [ -f "/var/app/staging/.platform/nginx/nginx.conf" ]; then
    cp /var/app/staging/.platform/nginx/nginx.conf /var/proxy/staging/nginx/nginx.conf
    echo "✅ Main nginx.conf copied successfully"
else
    echo "❌ Main nginx.conf not found in staging area"
    exit 1
fi

# Copy server configuration
echo "📋 Copying server configuration..."
if [ -f "/var/app/staging/.platform/nginx/conf.d/transperai.conf" ]; then
    cp /var/app/staging/.platform/nginx/conf.d/transperai.conf /var/proxy/staging/nginx/conf.d/
    echo "✅ Server configuration copied successfully"
else
    echo "❌ Server configuration not found in staging area"
    exit 1
fi

# Test the configuration
echo "🧪 Testing nginx configuration..."
if /usr/sbin/nginx -t -c /var/proxy/staging/nginx/nginx.conf; then
    echo "✅ Nginx configuration test passed"
else
    echo "❌ Nginx configuration test failed"
    exit 1
fi

echo "🎉 Nginx configuration setup completed successfully"