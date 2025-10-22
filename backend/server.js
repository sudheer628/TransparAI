// server.js
const express = require("express");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 8080;

// Trust proxy for HTTPS detection (required for Elastic Beanstalk)
app.set('trust proxy', 1);

// Force HTTPS in production
if (process.env.NODE_ENV === 'production' && process.env.FORCE_HTTPS === 'true') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      return res.redirect(301, `https://${req.header('host')}${req.url}`);
    }
    next();
  });
}

// Security headers middleware
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  }
  next();
});

// Middleware
app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      fontSrc: ["'self'", "data:"],
      connectSrc: ["'self'", "https:"],
    },
  } : false
}));
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// --- Serve frontend build (React) ---
app.use(express.static(path.join(__dirname, "frontend-dist")));

// --- API Routes (adjust paths as per your project) ---
const bedrockRoutes = require("./src/routes/bedrock");
const healthRoutes = require("./src/routes/health");

app.use("/api/health", healthRoutes);
app.use("/api/bedrock", bedrockRoutes);

// Error Handling for API routes only
app.use("/api/*", (err, req, res, next) => {
  console.error("API Error:", err);
  res.status(500).json({ error: "Internal Server Error", message: err.message });
});

// 404 Handler for API routes only
app.use("/api/*", (req, res) => {
  res.status(404).json({ error: "API route not found" });
});

// Catch all handler - serve React app for any non-API routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend-dist", "index.html"));
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 TransparAI Backend running on port ${PORT}`);
  console.log(`🌍 Region: ${process.env.AWS_REGION || "local"}`);
  console.log(`🤖 Agent ID: ${process.env.BEDROCK_AGENT_ID || "none"}`);
});
