# TransparAI Web Search Lambda Deployment Script
Write-Host "🚀 Deploying TransparAI Web Search Lambda Function..." -ForegroundColor Green

# Set variables
$FUNCTION_NAME = "transparai-web-search"
$REGION = "ap-south-1"
$ROLE_NAME = "transparai-lambda-execution-role"

# Get AWS Account ID
Write-Host "🔍 Getting AWS Account ID..." -ForegroundColor Yellow
$AWS_ACCOUNT_ID = (aws sts get-caller-identity --query Account --output text)
if (-not $AWS_ACCOUNT_ID) {
    Write-Host "❌ Failed to get AWS Account ID. Please check your AWS credentials." -ForegroundColor Red
    exit 1
}
Write-Host "✅ AWS Account ID: $AWS_ACCOUNT_ID" -ForegroundColor Green

# Create deployment package
Write-Host "📦 Creating deployment package..." -ForegroundColor Yellow
if (Test-Path "function.zip") { Remove-Item "function.zip" }
Compress-Archive -Path "index.js", "package.json" -DestinationPath "function.zip" -Force

# Create IAM role
Write-Host "🔐 Creating IAM role for Lambda..." -ForegroundColor Yellow
$trustPolicy = @"
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
"@

aws iam create-role `
    --role-name $ROLE_NAME `
    --assume-role-policy-document $trustPolicy `
    --region $REGION 2>$null

# Attach execution policy
Write-Host "📋 Attaching basic execution policy..." -ForegroundColor Yellow
aws iam attach-role-policy `
    --role-name $ROLE_NAME `
    --policy-arn "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole" `
    --region $REGION

# Wait for role to be ready
Write-Host "⏳ Waiting for role to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Create Lambda function
Write-Host "🔧 Creating Lambda function..." -ForegroundColor Yellow
$createResult = aws lambda create-function `
    --function-name $FUNCTION_NAME `
    --runtime "nodejs18.x" `
    --role "arn:aws:iam::${AWS_ACCOUNT_ID}:role/$ROLE_NAME" `
    --handler "index.handler" `
    --zip-file "fileb://function.zip" `
    --timeout 30 `
    --memory-size 256 `
    --region $REGION `
    --description "Web search function for TransparAI Bedrock Agent" 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️ Function might already exist, updating instead..." -ForegroundColor Yellow
    aws lambda update-function-code `
        --function-name $FUNCTION_NAME `
        --zip-file "fileb://function.zip" `
        --region $REGION
}

# Test the function
Write-Host "🧪 Testing the function..." -ForegroundColor Yellow
$testPayload = @"
{
  "agent": {},
  "actionGroup": {},
  "function": "webSearch",
  "parameters": {
    "query": "Amazon Nova Pro model"
  }
}
"@

aws lambda invoke `
    --function-name $FUNCTION_NAME `
    --payload $testPayload `
    --region $REGION `
    response.json

Write-Host "📄 Test response:" -ForegroundColor Yellow
Get-Content response.json | ConvertFrom-Json | ConvertTo-Json -Depth 10

Write-Host "✅ Lambda function deployed successfully!" -ForegroundColor Green
Write-Host "📝 Function ARN: arn:aws:lambda:${REGION}:${AWS_ACCOUNT_ID}:function:$FUNCTION_NAME" -ForegroundColor Cyan
Write-Host "🔗 Use this ARN when configuring the Bedrock Agent Action Group" -ForegroundColor Cyan

# Clean up
Remove-Item "function.zip" -ErrorAction SilentlyContinue
Remove-Item "response.json" -ErrorAction SilentlyContinue

Write-Host "🎉 Deployment complete! Next steps:" -ForegroundColor Green
Write-Host "1. Go to AWS Bedrock Console" -ForegroundColor White
Write-Host "2. Open your agent (STQJFYK634)" -ForegroundColor White
Write-Host "3. Add Action Group with the Lambda ARN above" -ForegroundColor White