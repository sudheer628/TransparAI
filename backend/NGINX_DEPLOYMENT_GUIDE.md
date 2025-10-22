# TransparAI Nginx Configuration Deployment Guide

## Current Issue Resolution

The deployment is failing due to nginx configuration errors:
- `nginx: [emerg] zero size shared memory zone "api"`
- Rate limiting zones not properly defined

## Configuration Changes Made

### 1. Fixed nginx.conf (`.platform/nginx/nginx.conf`)
- ✅ Moved `types_hash` settings to `http{}` block
- ✅ Defined rate limiting zones in `http{}` block before server blocks
- ✅ Simplified configuration structure for EB compatibility

### 2. Updated Server Configuration (`.platform/nginx/conf.d/transperai.conf`)  
- ✅ Added upstream block for better connection pooling
- ✅ Ensured rate limiting zones are referenced correctly
- ✅ Maintained all security and CORS settings

### 3. Enhanced .ebextensions (`.ebextensions/01-nginx-proxy.config`)
- ✅ Added fallback rate limiting zone definitions
- ✅ Added commands to ensure proper nginx configuration
- ✅ Added backup and validation steps

### 4. Created Deployment Hooks
- ✅ Pre-build hook to setup nginx configuration
- ✅ Post-deploy validation and verification scripts
- ✅ Error recovery and rollback mechanisms

## Key Fixes Applied

1. **Rate Limiting Zones**: Now properly defined in `http{}` block before any server blocks
2. **Types Hash**: Moved from server to http context with proper values
3. **Upstream Definition**: Added for better Node.js connection handling
4. **EB Compatibility**: Simplified configuration structure for Elastic Beanstalk

## Deployment Steps

1. **Commit all changes:**
   ```bash
   git add .
   git commit -m "Fix nginx configuration for EB deployment"
   ```

2. **Deploy to Elastic Beanstalk:**
   ```bash
   eb deploy
   ```

3. **Monitor deployment:**
   ```bash
   eb health --refresh
   eb logs
   ```

## Expected Results After Deployment

- ✅ Elastic Beanstalk health status should change from "Degraded" to "OK"
- ✅ No more "zero size shared memory zone" errors
- ✅ Rate limiting should work correctly for API and static content
- ✅ All TransparAI application features should be accessible

## Validation Commands (Post-Deployment)

```bash
# Check EB health
eb health

# View recent logs
eb logs --all

# Test application endpoints
curl -I https://your-app-url.elasticbeanstalk.com/
curl -I https://your-app-url.elasticbeanstalk.com/api/health
```

## Rollback Plan (If Issues Persist)

If deployment still fails:

1. **Quick rollback:**
   ```bash
   eb deploy --version=previous
   ```

2. **Alternative approach:**
   - Disable custom nginx configuration temporarily
   - Use default EB proxy configuration
   - Gradually re-introduce custom settings

## Configuration File Locations

```
backend/
├── .platform/
│   ├── nginx/
│   │   ├── nginx.conf                    # Main nginx configuration
│   │   └── conf.d/
│   │       ├── transperai.conf          # Server block configuration
│   │       └── elasticbeanstalk.conf    # Alternative EB-specific config
│   └── hooks/
│       ├── prebuild/
│       │   └── 01-setup-nginx.sh        # Pre-deployment setup
│       └── postdeploy/
│           ├── 01-restart-nginx.sh      # Nginx restart and validation
│           ├── 02-validate-nginx.sh     # Configuration validation
│           └── 03-verify-nginx.sh       # Final verification
└── .ebextensions/
    └── 01-nginx-proxy.config            # EB configuration with fallbacks
```

## Next Steps

1. Deploy the updated configuration
2. Monitor EB health dashboard
3. Test all application functionality
4. Document any additional optimizations needed

The configuration is now properly structured for Elastic Beanstalk compatibility while maintaining all the security, performance, and functionality requirements for TransparAI.