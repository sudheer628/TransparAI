import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { chatService } from "../services/api";

const ChatInterface = ({ onNewFlow, isLoading, setIsLoading }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      content:
        "Hello! I'm TransparAI. Ask me any ML or AI question, and I'll show you how I think through the answer using AWS services.",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [sessionId] = useState(() => `session_${Date.now()}`);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await chatService.sendMessage(inputMessage, sessionId);

      if (response.success) {
        const botMessage = {
          id: Date.now() + 1,
          type: "bot",
          content: response.data.response,
          timestamp: new Date(),
          reasoning: response.data.reasoning,
        };

        setMessages((prev) => [...prev, botMessage]);

        // Send flow data to parent component
        console.log("🔍 Full API response:", response.data);
        console.log("🔍 Reasoning data:", response.data.reasoning);
        console.log("🔍 Flow data:", response.data.reasoning?.flowData);

        if (response.data.reasoning?.flowData) {
          console.log(
            "✅ Sending flow data to visualization:",
            response.data.reasoning.flowData
          );
          onNewFlow(response.data.reasoning.flowData);
        } else {
          console.log("❌ No flow data found in response");
        }
      } else {
        throw new Error(response.error || "Failed to get response");
      }
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage = {
        id: Date.now() + 1,
        type: "bot",
        content: `Sorry, I encountered an error: ${error.message}. Please make sure the backend is running on port 3002.`,
        timestamp: new Date(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-cyan-500/30 h-full flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b border-white/20">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Bot className="w-5 h-5" />
          AI Chat Interface
        </h2>
        <p className="text-sm text-white/70">
          Ask questions about ML, AI, or AWS services
        </p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex gap-3 ${
                message.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex gap-3 max-w-[80%] ${
                  message.type === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === "user"
                      ? "bg-blue-500"
                      : message.isError
                      ? "bg-red-500"
                      : "bg-green-500"
                  }`}
                >
                  {message.type === "user" ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>
                <div
                  className={`rounded-lg p-3 ${
                    message.type === "user"
                      ? "bg-blue-500 text-white"
                      : message.isError
                      ? "bg-red-500/20 text-red-200 border border-red-500/30"
                      : "bg-white/10 text-white border border-white/20"
                  }`}
                >
                  <div className="message-content">
                    {message.type === "bot" && !message.isError ? (
                      <div
                        className="prose prose-invert prose-sm max-w-none"
                        dangerouslySetInnerHTML={{
                          __html: message.content
                            .replace(
                              /\*\*(.*?)\*\*/g,
                              '<strong class="font-semibold text-blue-200">$1</strong>'
                            )
                            .replace(/\n/g, "<br/>"),
                        }}
                      />
                    ) : (
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    )}
                  </div>
                  {message.reasoning && (
                    <div className="mt-2 pt-2 border-t border-white/20">
                      <p className="text-xs text-white/70">
                        Reasoning steps: {message.reasoning.stepCount}
                      </p>
                    </div>
                  )}
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3 justify-start"
          >
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white/10 text-white border border-white/20 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Thinking through your question...</span>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-white/20">
        <div className="flex gap-2">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about machine learning, AI, or AWS services..."
            className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows="2"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white rounded-lg px-4 py-2 transition-colors flex items-center justify-center"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
