const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
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
        ? ["https://saisudheer.space"]
        : ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api/health", healthRoutes);
app.use("/api/bedrock", bedrockRoutes);

// ✅ Serve React (Vite) dist folder in production
if (process.env.NODE_ENV === "production") {
  const distPath = path.join(__dirname, "../dist");
  app.use(express.static(distPath));

  // Serve index.html for any non-API route (React Router support)
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
} else {
  // Fallback for non-production environments
  app.get("/", (req, res) => {
    res.send("Backend running in development mode");
  });
}

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

// 404 handler (only for unmatched API routes)
app.use("/api/*", (req, res) => {
  res.status(404).json({ error: "API route not found" });
});

app.listen(PORT, () => {
  console.log(`🚀 TransparAI Backend running on port ${PORT}`);
  console.log(`🌍 Region: ${process.env.AWS_REGION || "us-east-1"}`);
  console.log(`🤖 Agent ID: ${process.env.BEDROCK_AGENT_ID || "QAR6C7B5W4"}`);
});
