const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const bedrockRoutes = require("./routes/bedrock");
const healthRoutes = require("./routes/health");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? ["https://your-frontend-domain.com"]
        : ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/health", healthRoutes);
app.use("/api/bedrock", bedrockRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({
    error: "Internal server error",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Something went wrong",
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`🚀 TransparAI Backend running on port ${PORT}`);
  console.log(`🌍 Region: ${process.env.AWS_REGION}`);
  console.log(`🤖 Agent ID: ${process.env.BEDROCK_AGENT_ID}`);
});
