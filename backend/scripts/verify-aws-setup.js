const {
  BedrockRuntimeClient,
  ListFoundationModelsCommand,
} = require("@aws-sdk/client-bedrock-runtime");
const {
  BedrockAgentClient,
  ListAgentsCommand,
} = require("@aws-sdk/client-bedrock-agent");

async function verifyAWSSetup() {
  console.log("🔍 Verifying AWS Bedrock setup...\n");

  try {
    // Initialize clients
    const bedrockRuntime = new BedrockRuntimeClient({
      region: process.env.AWS_REGION || "us-east-1",
    });
    const bedrockAgent = new BedrockAgentClient({
      region: process.env.AWS_REGION || "us-east-1",
    });

    // Check available models
    console.log("📋 Checking available foundation models...");
    const modelsCommand = new ListFoundationModelsCommand({});
    const modelsResponse = await bedrockRuntime.send(modelsCommand);

    const claudeModels =
      modelsResponse.modelSummaries?.filter(
        (model) =>
          model.modelName?.includes("Claude") ||
          model.modelName?.includes("claude")
      ) || [];

    const novaModels =
      modelsResponse.modelSummaries?.filter(
        (model) =>
          model.modelName?.includes("Nova") || model.modelName?.includes("nova")
      ) || [];

    console.log(`✅ Found ${claudeModels.length} Claude models`);
    console.log(`✅ Found ${novaModels.length} Nova models`);

    if (claudeModels.length === 0 && novaModels.length === 0) {
      console.log(
        "⚠️  No Claude or Nova models found. Please request model access in Bedrock console."
      );
    }

    // Check agents
    console.log("\n🤖 Checking Bedrock agents...");
    const agentsCommand = new ListAgentsCommand({});
    const agentsResponse = await bedrockAgent.send(agentsCommand);

    console.log(
      `✅ Found ${agentsResponse.agentSummaries?.length || 0} existing agents`
    );

    console.log("\n🎉 AWS Bedrock verification complete!");
    console.log("\nNext steps:");
    console.log("1. If no models found, request access in AWS Bedrock console");
    console.log("2. Create your first Bedrock agent");
    console.log("3. Update .env file with your agent ID");
  } catch (error) {
    console.error("❌ AWS setup verification failed:");
    console.error(error.message);
    console.log("\nTroubleshooting:");
    console.log("1. Check AWS credentials are configured");
    console.log("2. Verify AWS region is correct");
    console.log("3. Ensure Bedrock service is available in your region");
  }
}

verifyAWSSetup();
