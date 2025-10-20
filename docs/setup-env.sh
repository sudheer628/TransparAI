#!/bin/bash

echo "🚀 Setting up TransparAI environment..."
echo

# Copy environment file
if [ ! -f backend/.env ]; then
    echo "📝 Creating .env file from template..."
    cp backend/.env.example backend/.env
    echo "✅ .env file created"
    echo
    echo "⚠️  IMPORTANT: Edit backend/.env and add your:"
    echo "   - AWS credentials"
    echo "   - Bedrock Agent ID"
    echo "   - External API keys"
    echo
else
    echo "✅ .env file already exists"
fi

# Set region environment variable
export AWS_REGION=ap-south-1
echo "🌍 AWS Region set to: ap-south-1"

echo
echo "📋 Next steps:"
echo "1. Complete AWS Bedrock setup in console"
echo "2. Update backend/.env with your Agent ID"
echo "3. Run: npm run dev"
echo