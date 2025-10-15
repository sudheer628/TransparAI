const express = require("express");
const BedrockService = require("../services/bedrockService");
const router = express.Router();

// Initialize Bedrock service
let bedrockService;
try {
  bedrockService = new BedrockService();
} catch (error) {
  console.error("❌ Failed to initialize Bedrock service:", error.message);
}

// Test Bedrock connection
router.get("/test", async (req, res) => {
  try {
    if (!bedrockService) {
      return res.status(500).json({
        success: false,
        error: "Bedrock service not initialized",
      });
    }

    const testResult = await bedrockService.testConnection();
    res.json(testResult);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Main chat endpoint - this is where the magic happens!
router.post("/chat", async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message) {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    if (!bedrockService) {
      return res.status(500).json({
        error: "Bedrock service not initialized",
      });
    }

    console.log(`💬 Processing chat message: ${message.substring(0, 50)}...`);

    // Invoke Bedrock Agent with reasoning traces
    const result = await bedrockService.invokeAgent(message, sessionId);

    // Return both the response and the reasoning visualization data
    res.json({
      success: true,
      data: {
        response: result.response,
        sessionId: result.sessionId,
        reasoning: {
          steps: result.reasoning,
          flowData: result.flowData,
          stepCount: result.reasoning.length,
        },
        metadata: result.metadata,
      },
    });
  } catch (error) {
    console.error("❌ Chat endpoint error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      details: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});

// Get reasoning flow for a specific session
router.get("/reasoning/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;

    // In a production app, you'd store reasoning traces in a database
    // For now, we'll return a placeholder response
    res.json({
      success: true,
      sessionId,
      message: "Reasoning history retrieval not implemented yet",
      note: "This would fetch stored reasoning traces from database",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Stream chat responses (for real-time updates)
router.post("/chat/stream", async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message) {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    // Set up Server-Sent Events
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
    });

    // Send initial message
    res.write(
      `data: ${JSON.stringify({
        type: "start",
        message: "Processing your request...",
      })}\n\n`
    );

    try {
      const result = await bedrockService.invokeAgent(message, sessionId);

      // Send reasoning steps as they're processed
      result.reasoning.forEach((step, index) => {
        res.write(
          `data: ${JSON.stringify({
            type: "reasoning",
            step: index + 1,
            data: step,
          })}\n\n`
        );
      });

      // Send final response
      res.write(
        `data: ${JSON.stringify({
          type: "response",
          data: result.response,
          flowData: result.flowData,
          sessionId: result.sessionId,
        })}\n\n`
      );

      res.write(`data: ${JSON.stringify({ type: "end" })}\n\n`);
    } catch (error) {
      res.write(
        `data: ${JSON.stringify({
          type: "error",
          error: error.message,
        })}\n\n`
      );
    }

    res.end();
  } catch (error) {
    console.error("❌ Stream endpoint error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
