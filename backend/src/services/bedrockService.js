const {
  BedrockAgentRuntimeClient,
  InvokeAgentCommand,
} = require("@aws-sdk/client-bedrock-agent-runtime");
const { v4: uuidv4 } = require("uuid");

class BedrockService {
  constructor() {
    this.client = new BedrockAgentRuntimeClient({
      region: process.env.AWS_REGION || "ap-south-1",
    });

    this.agentId = process.env.BEDROCK_AGENT_ID;
    this.agentAliasId = process.env.BEDROCK_AGENT_ALIAS_ID || "TSTALIASID";

    if (!this.agentId) {
      throw new Error("BEDROCK_AGENT_ID is required");
    }

    console.log("✅ Bedrock Agent Service initialized");
    console.log(`   Agent ID: ${this.agentId}`);
    console.log(`   Region: ${process.env.AWS_REGION || "ap-south-1"}`);
  }

  async invokeAgent(inputText, sessionId = null) {
    try {
      const sessionIdToUse = sessionId || uuidv4();

      console.log(`🤖 Invoking Bedrock Agent: ${this.agentId}`);
      console.log(`📝 Input: ${inputText.substring(0, 100)}...`);

      const command = new InvokeAgentCommand({
        agentId: this.agentId,
        agentAliasId: this.agentAliasId,
        sessionId: sessionIdToUse,
        inputText: inputText,
        enableTrace: true,
        endSession: false,
      });

      const response = await this.client.send(command);

      // Process the streaming response
      const result = await this.processAgentResponse(response);

      return {
        sessionId: sessionIdToUse,
        response: result.finalResponse,
        reasoning: result.reasoningTrace,
        flowData: result.flowData,
        metadata: {
          agentId: this.agentId,
          timestamp: new Date().toISOString(),
          inputLength: inputText.length,
          responseLength: result.finalResponse.length,
        },
      };
    } catch (error) {
      console.error("❌ Bedrock Agent Error:", error);
      throw new Error(`Bedrock Agent failed: ${error.message}`);
    }
  }

  async processAgentResponse(response) {
    let finalResponse = "";
    let reasoningTrace = [];
    let flowData = { nodes: [], edges: [] };

    try {
      // Process the streaming response
      for await (const chunk of response.completion) {
        if (chunk.chunk && chunk.chunk.bytes) {
          const chunkText = new TextDecoder().decode(chunk.chunk.bytes);
          finalResponse += chunkText;
        }

        // Extract reasoning traces for visualization
        if (chunk.trace) {
          const traceData = this.extractReasoningTrace(chunk.trace);
          if (traceData) {
            reasoningTrace.push(traceData);
          }
        }
      }

      // Generate flow diagram data from reasoning traces
      flowData = this.generateFlowData(reasoningTrace);

      console.log(`📊 Flow data generated:`, {
        nodes: flowData.nodes?.length || 0,
        edges: flowData.edges?.length || 0,
        reasoningSteps: reasoningTrace.length,
      });

      return {
        finalResponse: finalResponse.trim(),
        reasoningTrace,
        flowData,
      };
    } catch (error) {
      console.error("❌ Error processing agent response:", error);
      return {
        finalResponse: finalResponse || "Error processing response",
        reasoningTrace: [],
        flowData: { nodes: [], edges: [] },
      };
    }
  }

  extractReasoningTrace(trace) {
    try {
      // Extract different types of traces
      if (trace.preProcessingTrace) {
        return {
          type: "preprocessing",
          step: "Input Processing",
          details: trace.preProcessingTrace,
          timestamp: new Date().toISOString(),
        };
      }

      if (trace.orchestrationTrace) {
        return {
          type: "orchestration",
          step: "Agent Orchestration",
          details: trace.orchestrationTrace,
          timestamp: new Date().toISOString(),
        };
      }

      if (trace.postProcessingTrace) {
        return {
          type: "postprocessing",
          step: "Response Generation",
          details: trace.postProcessingTrace,
          timestamp: new Date().toISOString(),
        };
      }

      return null;
    } catch (error) {
      console.error("Error extracting trace:", error);
      return null;
    }
  }

  generateFlowData(reasoningTrace) {
    const nodes = [];
    const edges = [];

    console.log(
      `🎨 Generating flow data with ${reasoningTrace.length} reasoning traces`
    );

    // Always create a basic flow showing the AI reasoning process

    // 1. User Input Node
    nodes.push({
      id: "user-input",
      type: "input",
      data: {
        label: "User Question",
        service: "user",
        status: "completed",
      },
    });

    // 2. Bedrock Agent Node
    nodes.push({
      id: "bedrock-agent",
      type: "agent",
      data: {
        label: "Bedrock Agent",
        service: "bedrock-agent",
        status: "completed",
      },
    });

    // 3. Add reasoning step nodes if we have traces
    let lastNodeId = "bedrock-agent";
    reasoningTrace.forEach((trace, index) => {
      const nodeId = `reasoning-${index + 1}`;
      nodes.push({
        id: nodeId,
        type: "reasoning",
        data: {
          label: trace.step,
          service: this.getServiceFromTrace(trace),
          details: trace.details,
          status: "completed",
        },
      });

      // Connect to previous node
      edges.push({
        id: `${lastNodeId}-${nodeId}`,
        source: lastNodeId,
        target: nodeId,
        type: "smoothstep",
        animated: true,
      });

      lastNodeId = nodeId;
    });

    // 4. Nova Pro Model Node
    nodes.push({
      id: "nova-pro",
      type: "model",
      data: {
        label: "Nova Pro Model",
        service: "nova",
        status: "completed",
      },
    });

    // 5. Final Response Node
    nodes.push({
      id: "final-response",
      type: "output",
      data: {
        label: "AI Response",
        service: "response",
        status: "completed",
      },
    });

    // Create connections
    edges.push(
      {
        id: "user-input-bedrock-agent",
        source: "user-input",
        target: "bedrock-agent",
        type: "smoothstep",
        animated: true,
      },
      {
        id: `${lastNodeId}-nova-pro`,
        source: lastNodeId,
        target: "nova-pro",
        type: "smoothstep",
        animated: true,
      },
      {
        id: "nova-pro-final-response",
        source: "nova-pro",
        target: "final-response",
        type: "smoothstep",
        animated: true,
      }
    );

    console.log(
      `✅ Generated flow: ${nodes.length} nodes, ${edges.length} edges`
    );

    return {
      nodes,
      edges,
      metadata: {
        totalNodes: nodes.length,
        totalEdges: edges.length,
        reasoningSteps: reasoningTrace.length,
      },
    };
  }

  getServiceFromTrace(trace) {
    // Map trace types to AWS services for visualization
    switch (trace.type) {
      case "preprocessing":
        return "bedrock-agent";
      case "orchestration":
        return "bedrock-runtime";
      case "postprocessing":
        return "bedrock-agent";
      default:
        return "bedrock";
    }
  }

  // Test connection to Bedrock Agent
  async testConnection() {
    try {
      const testResponse = await this.invokeAgent(
        "Hello, can you introduce yourself?"
      );
      return {
        success: true,
        agentId: this.agentId,
        response: testResponse.response.substring(0, 100) + "...",
        reasoningSteps: testResponse.reasoning.length,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        agentId: this.agentId,
      };
    }
  }
}

module.exports = BedrockService;
