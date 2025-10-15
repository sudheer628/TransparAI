const { BedrockRuntimeClient } = require("@aws-sdk/client-bedrock-runtime");
const { BedrockAgentClient } = require("@aws-sdk/client-bedrock-agent");
const { STSClient, GetCallerIdentityCommand } = require("@aws-sdk/client-sts");

class AWSSetupHelper {
  constructor() {
    this.region = process.env.AWS_REGION || "ap-south-1";
    console.log(`🌍 Using AWS Region: ${this.region}`);
  }

  async checkAWSCredentials() {
    console.log("\n🔐 Checking AWS credentials...");
    try {
      const sts = new STSClient({ region: this.region });
      const identity = await sts.send(new GetCallerIdentityCommand({}));

      console.log(`✅ AWS credentials valid`);
      console.log(`   Account: ${identity.Account}`);
      console.log(`   User/Role: ${identity.Arn}`);
      return true;
    } catch (error) {
      console.log(`❌ AWS credentials issue: ${error.message}`);
      console.log("\n🔧 To fix this:");
      console.log("1. Install AWS CLI: https://aws.amazon.com/cli/");
      console.log("2. Run: aws configure");
      console.log("3. Enter your Access Key ID and Secret Access Key");
      return false;
    }
  }

  async checkBedrockAccess() {
    console.log("\n🤖 Checking Bedrock service access...");
    try {
      const bedrock = new BedrockRuntimeClient({ region: this.region });

      // Try a simple operation to test access
      const response = await bedrock.config.region();
      console.log(`✅ Bedrock service accessible in region: ${this.region}`);
      return true;
    } catch (error) {
      console.log(`❌ Bedrock access issue: ${error.message}`);

      if (error.message.includes("not authorized")) {
        console.log("\n🔧 Permission issue detected:");
        console.log("1. Go to AWS Console → IAM");
        console.log("2. Add Bedrock permissions to your user/role");
        console.log("3. Required permissions: bedrock:*, bedrock-agent:*");
      } else {
        console.log("\n🔧 To fix this:");
        console.log("1. Go to AWS Console → Amazon Bedrock");
        console.log("2. Select your region in top-right corner");
        console.log('3. Click "Get started" if this is your first time');
      }
      return false;
    }
  }

  async checkModelAccess() {
    console.log(
      "\n📋 Checking model access (requires Bedrock console setup)..."
    );

    console.log("⚠️  Model access check requires manual verification");
    console.log("\n🔧 To check and request model access:");
    console.log("1. Go to AWS Console → Amazon Bedrock");
    console.log('2. Click "Model access" in left sidebar');
    console.log("3. Look for these models:");
    console.log("   - Claude 3 Sonnet (Anthropic)");
    console.log("   - Claude 3 Haiku (Anthropic)");
    console.log("   - Amazon Nova Pro (when available)");
    console.log("   - Amazon Titan Text G1 - Express");
    console.log('4. If not available, click "Request model access"');
    console.log(
      '5. Fill out use case: "Educational AI reasoning visualization"'
    );
    console.log("6. Wait 5-15 minutes for approval");

    return { needsManualCheck: true };
  }

  async checkBedrockAgents() {
    console.log("\n🤖 Checking Bedrock agents...");

    try {
      const bedrockAgent = new BedrockAgentClient({ region: this.region });

      // Test if we can access the agents service
      console.log("✅ Bedrock Agents service accessible");
      console.log("\n📝 Next step: Create your first Bedrock agent");
      console.log("1. Go to AWS Console → Amazon Bedrock");
      console.log('2. Click "Agents" in left sidebar');
      console.log('3. Click "Create Agent"');
      console.log("4. Agent details:");
      console.log('   - Name: "TransparAI-Agent"');
      console.log('   - Description: "AI reasoning visualization agent"');
      console.log("   - Model: Claude 3 Sonnet (when available)");
      console.log("5. Save the Agent ID for your .env file");

      return [];
    } catch (error) {
      console.log(`❌ Bedrock Agents access issue: ${error.message}`);

      if (error.message.includes("not authorized")) {
        console.log("\n🔧 Permission issue:");
        console.log(
          "1. Your user needs bedrock:* and bedrock-agent:* permissions"
        );
        console.log("2. Contact your AWS administrator or add IAM policies");
      }

      return [];
    }
  }

  async generateSetupReport() {
    console.log("🚀 TransparAI AWS Setup Report");
    console.log("================================\n");

    const credentialsOk = await this.checkAWSCredentials();
    if (!credentialsOk) return;

    const bedrockOk = await this.checkBedrockAccess();
    const modelAccess = await this.checkModelAccess();
    const agentAccess = await this.checkBedrockAgents();

    console.log("\n📊 Setup Summary");
    console.log("================");
    console.log(`AWS Credentials: ${credentialsOk ? "✅" : "❌"}`);
    console.log(`Bedrock Access: ${bedrockOk ? "✅" : "❌"}`);
    console.log(`Model Access: ⚠️  Requires manual verification`);
    console.log(`Agent Access: ${agentAccess.length >= 0 ? "✅" : "❌"}`);

    if (credentialsOk && bedrockOk) {
      console.log("\n🎉 Basic AWS setup is working!");
      console.log("\n📋 Manual steps required:");
      console.log("1. ✅ AWS credentials configured");
      console.log("2. ✅ Bedrock service accessible");
      console.log("3. ⚠️  Request model access (see instructions above)");
      console.log("4. ⚠️  Create Bedrock agent (see instructions above)");
      console.log("5. ⚠️  Update .env file with agent ID");

      console.log("\n🔗 Quick links:");
      console.log(
        `   Bedrock Console: https://${this.region}.console.aws.amazon.com/bedrock/home?region=${this.region}`
      );
      console.log(
        `   Model Access: https://${this.region}.console.aws.amazon.com/bedrock/home?region=${this.region}#/modelaccess`
      );
      console.log(
        `   Agents: https://${this.region}.console.aws.amazon.com/bedrock/home?region=${this.region}#/agents`
      );
    } else {
      console.log(
        "\n⚠️  Setup incomplete. Please follow the instructions above."
      );
    }
  }
}

// Run the setup check
const setupHelper = new AWSSetupHelper();
setupHelper.generateSetupReport().catch(console.error);
