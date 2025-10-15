# AWS Bedrock Console Setup Guide

## ✅ Current Status

- AWS credentials: **Working**
- Bedrock access: **Working**
- Region: **ap-south-1** (Asia Pacific - Mumbai)

## 🎯 Next Steps (Do these in AWS Console)

### Step 1: Request Model Access (5-10 minutes)

1. **Open Bedrock Console**

   - Click this link: [Bedrock Model Access](https://ap-south-1.console.aws.amazon.com/bedrock/home?region=ap-south-1#/modelaccess)
   - Or go to AWS Console → Services → Amazon Bedrock → Model access

2. **Request Access to Required Models**

   - Click "Request model access" (orange button)
   - Select these models:
     - ✅ **Claude 3 Sonnet** (Anthropic) - Primary model
     - ✅ **Claude 3 Haiku** (Anthropic) - Faster responses
     - ✅ **Amazon Titan Text G1 - Express** - Fallback option
     - ✅ **Amazon Nova Pro** (if available) - Latest model

3. **Fill Out Use Case Form**

   - **Use case**: Educational AI reasoning visualization
   - **Description**: Building a tool to help students understand how LLMs reason through complex problems by visualizing the step-by-step thought process and AWS service interactions.
   - **Industry**: Education/Technology
   - **Submit the request**

4. **Wait for Approval**
   - Usually takes 5-15 minutes
   - You'll get an email confirmation
   - Status will show "Access granted" in the console

### Step 2: Create Your First Bedrock Agent (10-15 minutes)

1. **Navigate to Agents**

   - Click this link: [Bedrock Agents](https://ap-south-1.console.aws.amazon.com/bedrock/home?region=ap-south-1#/agents)
   - Or go to Amazon Bedrock → Agents

2. **Create New Agent**

   - Click "Create Agent"
   - **Agent name**: `TransparAI-Agent`
   - **Agent description**: `AI reasoning visualization agent for educational purposes`
   - **Agent resource role**: Create a new service role (default)

3. **Configure Agent Settings**

   - **Foundation model**: Select Claude 3 Sonnet (once access is granted)
   - **Instructions**:

   ```
   You are an educational AI assistant that helps users understand machine learning and AI concepts. When answering questions, think step-by-step and explain your reasoning process. You have access to various AWS services and external APIs to provide comprehensive answers.
   ```

4. **Save and Note Agent ID**
   - Click "Create Agent"
   - **Important**: Copy the Agent ID (looks like: `ABCDEFGHIJ`)
   - You'll need this for your .env file

### Step 3: Test Your Setup

Once both steps are complete:

1. **Verify Model Access**

   ```bash
   cd backend
   npm run verify-aws-setup
   ```

2. **Update Environment File**
   ```bash
   cp .env.example .env
   # Edit .env and add your Agent ID
   ```

## 🚨 Common Issues & Solutions

### Model Access Denied

- **Issue**: "Access denied" when requesting models
- **Solution**: Make sure you're in the correct AWS region (ap-south-1)
- **Alternative**: Try requesting access in us-east-1 or us-west-2 if ap-south-1 has limited model availability

### Agent Creation Fails

- **Issue**: "Insufficient permissions" error
- **Solution**: Your IAM user needs these permissions:
  - `bedrock:*`
  - `iam:CreateRole`
  - `iam:AttachRolePolicy`

### Long Approval Time

- **Issue**: Model access taking longer than 15 minutes
- **Solution**: This is normal for first-time requests. Can take up to 24 hours in some cases.

### Region-Specific Model Availability

- **Note**: Some models may not be available in ap-south-1 yet
- **Solution**: If Claude 3 isn't available, start with Amazon Titan Text models
- **Alternative**: You can switch to us-east-1 or us-west-2 for full model access

## 📞 Need Help?

If you encounter issues:

1. Check the AWS region (top-right corner of console)
2. Verify you're logged into the correct AWS account
3. Try refreshing the browser page
4. Contact me with any error messages

## ✅ Completion Checklist

- [ ] Model access requested and approved
- [ ] Bedrock agent created successfully
- [ ] Agent ID copied and saved
- [ ] .env file updated with agent ID
- [ ] Verification script runs successfully

Once all items are checked, you're ready for backend development!
