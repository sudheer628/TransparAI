# IAM Permissions Fix for TransparAI

## 🚨 Issue Detected

Your IAM user `macvscode` needs additional permissions to invoke Bedrock agents.

## 🔧 Quick Fix Options

### Option 1: Add Permissions via AWS Console (Recommended)

1. **Go to IAM Console**: https://console.aws.amazon.com/iam/
2. **Click "Users"** → Find your user `macvscode`
3. **Click "Add permissions"** → "Attach policies directly"
4. **Add these managed policies**:
   - ✅ `AmazonBedrockFullAccess`
   - ✅ `AmazonBedrockAgentFullAccess`

### Option 2: Create Custom Policy (More Secure)

1. **Go to IAM** → **Policies** → **Create Policy**
2. **Use JSON tab** and paste:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeAgent",
        "bedrock:InvokeModel",
        "bedrock:GetAgent",
        "bedrock:ListAgents",
        "bedrock:GetFoundationModel",
        "bedrock:ListFoundationModels"
      ],
      "Resource": "*"
    }
  ]
}
```

3. **Name**: `TransparAI-BedrockAccess`
4. **Attach to your user**: `macvscode`

### Option 3: AWS CLI (If you prefer command line)

```bash
aws iam attach-user-policy \
    --user-name macvscode \
    --policy-arn arn:aws:iam::aws:policy/AmazonBedrockFullAccess
```

## ✅ After Adding Permissions

1. **Wait 1-2 minutes** for permissions to propagate
2. **Test again**: `curl http://localhost:3002/api/bedrock/test`
3. **Should see**: `"success": true`

## 🎯 Expected Success Response

```json
{
  "success": true,
  "agentId": "STQJFYK634",
  "response": "Hello! I'm TransparAI, an educational AI assistant...",
  "reasoningSteps": 3
}
```
