import axios from "axios";

// Configure base URL - adjust port if your backend runs on different port
const API_BASE_URL = "http://localhost:3002/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(
      `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`
    );
    return config;
  },
  (error) => {
    console.error("❌ API Request Error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for logging
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error(
      "❌ API Response Error:",
      error.response?.status,
      error.message
    );
    return Promise.reject(error);
  }
);

export const chatService = {
  // Send a chat message to Bedrock
  async sendMessage(message, sessionId) {
    try {
      const response = await api.post("/bedrock/chat", {
        message,
        sessionId,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || error.message);
    }
  },

  // Stream chat responses (for real-time updates)
  async streamMessage(message, sessionId, onUpdate) {
    try {
      const response = await fetch(`${API_BASE_URL}/bedrock/chat/stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, sessionId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              onUpdate(data);
            } catch (e) {
              console.warn("Failed to parse SSE data:", line);
            }
          }
        }
      }
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Test Bedrock connection
  async testConnection() {
    try {
      const response = await api.get("/bedrock/test");
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || error.message);
    }
  },

  // Get reasoning history for a session
  async getReasoningHistory(sessionId) {
    try {
      const response = await api.get(`/bedrock/reasoning/${sessionId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || error.message);
    }
  },
};

export const healthService = {
  // Check backend health
  async checkHealth() {
    try {
      const response = await api.get("/health");
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || error.message);
    }
  },
};

export default api;
