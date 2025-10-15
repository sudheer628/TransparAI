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
        enableTrace: true, // This is crucial for TransparAI - enables reasoning traces!
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
    let nodeId = 1;

    // Create nodes for each reasoning step
    reasoningTrace.forEach((trace, index) => {
      const node = {
        id: nodeId.toString(),
        type: "reasoning",
        position: { x: index * 200, y: 100 },
        data: {
          label: trace.step,
          type: trace.type,
          details: trace.details,
          timestamp: trace.timestamp,
          service: this.getServiceFromTrace(trace),
        },
      };

      nodes.push(node);

      // Create edge to previous node
      if (nodeId > 1) {
        edges.push({
          id: `e${nodeId - 1}-${nodeId}`,
          source: (nodeId - 1).toString(),
          target: nodeId.toString(),
          type: "smoothstep",
        });
      }

      nodeId++;
    });

    // Add final response node
    if (nodes.length > 0) {
      nodes.push({
        id: nodeId.toString(),
        type: "output",
        position: { x: (nodeId - 1) * 200, y: 100 },
        data: {
          label: "Final Response",
          type: "output",
          service: "bedrock",
        },
      });

      edges.push({
        id: `e${nodeId - 1}-${nodeId}`,
        source: (nodeId - 1).toString(),
        target: nodeId.toString(),
        type: "smoothstep",
      });
    }

    return { nodes, edges };
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
