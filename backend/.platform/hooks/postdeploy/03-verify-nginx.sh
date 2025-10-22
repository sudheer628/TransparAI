#!/bin/bash

echo "🔍 TransparAI Nginx Configuration Verification"
echo "=============================================="

# Check if nginx is available
if ! command -v nginx &> /dev/null; then
    echo "❌ nginx is not installed or not in PATH"
    echo "This script is intended to run on the deployment server"
    exit 1
fi

echo "📋 Checking configuration files..."

# Check main nginx.conf
NGINX_CONF="../.platform/nginx/nginx.conf"
if [ -f "$NGINX_CONF" ]; then
    echo "✅ Main nginx.conf found"
    
    # Check for rate limiting zones
    if grep -q "limit_req_zone.*zone=api" "$NGINX_CONF"; then
        echo "✅ API rate limiting zone defined"
    else
        echo "❌ API rate limiting zone NOT found"
    fi
    
    if grep -q "limit_req_zone.*zone=static" "$NGINX_CONF"; then
        echo "✅ Static rate limiting zone defined"
    else
        echo "❌ Static rate limiting zone NOT found"
    fi
    
    # Check for types_hash settings
    if grep -q "types_hash_max_size" "$NGINX_CONF"; then
        echo "✅ types_hash_max_size configured"
    else
        echo "❌ types_hash_max_size NOT configured"
    fi
    
else
    echo "❌ Main nginx.conf NOT found at $NGINX_CONF"
fi

# Check server configuration
SERVER_CONF="../.platform/nginx/conf.d/transperai.conf"
if [ -f "$SERVER_CONF" ]; then
    echo "✅ Server configuration found"
    
    # Check for rate limiting usage
    if grep -q "limit_req zone=api" "$SERVER_CONF"; then
        echo "✅ API rate limiting used in server config"
    else
        echo "❌ API rate limiting NOT used in server config"
    fi
    
    if grep -q "limit_req zone=static" "$SERVER_CONF"; then
        echo "✅ Static rate limiting used in server config"
    else
        echo "❌ Static rate limiting NOT used in server config"
    fi
    
else
    echo "❌ Server configuration NOT found at $SERVER_CONF"
fi

echo ""
echo "🧪 Testing nginx configuration syntax..."

# Test the configuration if we can
if [ -f "$NGINX_CONF" ] && [ -f "$SERVER_CONF" ]; then
    # Create a temporary test configuration
    TEMP_DIR="/tmp/nginx-test-$$"
    mkdir -p "$TEMP_DIR/conf.d"
    
    cp "$NGINX_CONF" "$TEMP_DIR/nginx.conf"
    cp "$SERVER_CONF" "$TEMP_DIR/conf.d/"
    
    # Test the configuration
    if nginx -t -c "$TEMP_DIR/nginx.conf" 2>&1; then
        echo "✅ Nginx configuration test PASSED"
    else
        echo "❌ Nginx configuration test FAILED"
    fi
    
    # Cleanup
    rm -rf "$TEMP_DIR"
else
    echo "⚠️  Cannot test configuration - missing files"
fi

echo ""
echo "📊 Configuration Summary:"
echo "========================="
echo "- Rate limiting zones should be defined in main nginx.conf"
echo "- Server blocks should reference these zones"
echo "- types_hash settings should be in http{} block"
echo "- All paths should be relative to deployment environment"

echo ""
echo "🚀 Ready for deployment!"