const express = require("express");
const router = express.Router();

// Health check endpoint
router.get("/", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    service: "TransparAI Backend",
    version: "1.0.0",
    region: process.env.AWS_REGION,
    agentId: process.env.BEDROCK_AGENT_ID ? "configured" : "missing",
  });
});

// Detailed system check
router.get("/detailed", (req, res) => {
  const config = {
    aws: {
      region: process.env.AWS_REGION || "not-set",
      agentConfigured: !!process.env.BEDROCK_AGENT_ID,
      credentialsConfigured: !!(
        process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
      ),
    },
    server: {
      nodeVersion: process.version,
      platform: process.platform,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    },
  };

  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    config,
  });
});

module.exports = router;
