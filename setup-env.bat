@echo off
echo 🚀 Setting up TransparAI environment...
echo.

REM Copy environment file
if not exist backend\.env (
    echo 📝 Creating .env file from template...
    copy backend\.env.example backend\.env
    echo ✅ .env file created
    echo.
    echo ⚠️  IMPORTANT: Edit backend\.env and add your:
    echo    - AWS credentials
    echo    - Bedrock Agent ID
    echo    - External API keys
    echo.
) else (
    echo ✅ .env file already exists
)

REM Set region environment variable for current session
set AWS_REGION=ap-south-1
echo 🌍 AWS Region set to: ap-south-1

echo.
echo 📋 Next steps:
echo 1. Complete AWS Bedrock setup in console
echo 2. Update backend\.env with your Agent ID
echo 3. Run: npm run dev
echo.
pause