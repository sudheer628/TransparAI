# AWS Bedrock Setup Guide for TransparAI

## Prerequisites

- AWS Account with administrative access
- AWS CLI installed and configured
- Node.js 18+ installed

## Step 1: Enable Amazon Bedrock

### 1.1 Access Bedrock Console

1. Log into AWS Console
2. Navigate to Amazon Bedrock service
3. Select your preferred region (us-east-1 or us-west-2 recommended)

### 1.2 Request Model Access

1. Go to "Model access" in the left sidebar
2. Request access for these models:

   - **Claude 3 Sonnet** (Anthropic)
   - **Claude 3 Haiku** (Anthropic)
   - **Amazon Nova Pro** (when available)
   - **Amazon Titan Text G1 - Express** (fallback)

3. Fill out the use case form:
   - Use case: Educational AI reasoning visualization
   - Description: Building a tool to help students understand LLM reasoning processes

### 1.3 Wait for Approval

- Model access typically takes 5-15 minutes
- Check status in the Model access page

## Step 2: Create IAM Roles

### 2.1 Bedrock Agent Execution Role

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "bedrock.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

### 2.2 Lambda Execution Role

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeAgent",
        "bedrock:InvokeModel",
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "*"
    }
  ]
}
```

## Step 3: Verify Setup

Run the verification script once you complete the setup:

```bash
cd backend
npm run verify-aws-setup
```

## Next Steps

1. Complete this AWS setup
2. Return to the main project for backend development
3. Configure Bedrock Agent with knowledge base
