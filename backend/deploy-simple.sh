#!/bin/bash

echo "🔧 TransparAI Deployment Script - Simplified Configuration"
echo "=========================================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the backend directory"
    exit 1
fi

echo "📋 Pre-deployment checklist:"
echo "- ✅ Removed rate limiting from nginx configuration"
echo "- ✅ Simplified nginx.conf to avoid shared memory zone errors"
echo "- ✅ Updated server configuration to remove problematic directives"
echo "- ✅ Cleaned up .ebextensions configuration"

echo ""
echo "🏗️  Current configuration files:"
echo "- .platform/nginx/nginx.conf (simplified)"
echo "- .platform/nginx/conf.d/transperai.conf (no rate limiting)"
echo "- .platform/nginx/conf.d/simple.conf (fallback configuration)"
echo "- .ebextensions/01-nginx-proxy.config (minimal commands)"

echo ""
echo "🚀 Ready to deploy!"
echo ""
echo "Next steps:"
echo "1. git add ."
echo "2. git commit -m 'Fix nginx configuration - remove rate limiting'"
echo "3. eb deploy"
echo "4. eb health --refresh"

echo ""
echo "📊 Expected results after deployment:"
echo "- ✅ No more 'zero size shared memory zone' errors"
echo "- ✅ Elastic Beanstalk health should change from Degraded to OK"
echo "- ✅ All application functionality should work"
echo "- ⚠️  Rate limiting temporarily disabled (can re-add later)"

echo ""
echo "🔍 Monitor deployment with:"
echo "eb health --refresh"
echo "eb logs --all"