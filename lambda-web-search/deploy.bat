@echo off
echo 🚀 Deploying TransparAI Web Search Lambda Function...

REM Set variables
set FUNCTION_NAME=transparai-web-search
set REGION=ap-south-1
set ROLE_NAME=transparai-lambda-execution-role

echo 📦 Creating deployment package...
if exist function.zip del function.zip
powershell Compress-Archive -Path index.js,package.json -DestinationPath function.zip -Force

echo 🔐 Creating IAM role for Lambda...
aws iam create-role ^
    --role-name %ROLE_NAME% ^
    --assume-role-policy-document "{\"Version\":\"2012-10-17\",\"Statement\":[{\"Effect\":\"Allow\",\"Principal\":{\"Service\":\"lambda.amazonaws.com\"},\"Action\":\"sts:AssumeRole\"}]}" ^
    --region %REGION%

echo 📋 Attaching basic execution policy...
aws iam attach-role-policy ^
    --role-name %ROLE_NAME% ^
    --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole ^
    --region %REGION%

echo ⏳ Waiting for role to be ready...
timeout /t 10 /nobreak

echo 🔧 Creating Lambda function...
aws lambda create-function ^
    --function-name %FUNCTION_NAME% ^
    --runtime nodejs18.x ^
    --role arn:aws:iam::%AWS_ACCOUNT_ID%:role/%ROLE_NAME% ^
    --handler index.handler ^
    --zip-file fileb://function.zip ^
    --timeout 30 ^
    --memory-size 256 ^
    --region %REGION% ^
    --description "Web search function for TransparAI Bedrock Agent"

if %errorlevel% neq 0 (
    echo ⚠️ Function might already exist, updating instead...
    aws lambda update-function-code ^
        --function-name %FUNCTION_NAME% ^
        --zip-file fileb://function.zip ^
        --region %REGION%
)

echo 🧪 Testing the function...
aws lambda invoke ^
    --function-name %FUNCTION_NAME% ^
    --payload "{\"agent\":{},\"actionGroup\":{},\"function\":\"webSearch\",\"parameters\":{\"query\":\"Amazon Nova Pro model\"}}" ^
    --region %REGION% ^
    response.json

echo 📄 Test response:
type response.json

echo ✅ Lambda function deployed successfully!
echo 📝 Function ARN: arn:aws:lambda:%REGION%:%AWS_ACCOUNT_ID%:function:%FUNCTION_NAME%
echo 🔗 Use this ARN when configuring the Bedrock Agent Action Group

pause