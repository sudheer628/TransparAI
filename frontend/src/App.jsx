import React, { useState } from "react";
import ChatInterface from "./components/ChatInterface";
import FlowVisualization from "./components/FlowVisualization";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./App.css";

function App() {
  const [currentFlow, setCurrentFlow] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFlowFullscreen, setIsFlowFullscreen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      content:
        "Hello! I'm TransparAI. Ask me any ML or AI question, and I'll show you how I think through the answer using AWS services.",
      timestamp: new Date(),
    },
  ]);

  const handleNewFlow = (flowData) => {
    setCurrentFlow(flowData);
  };

  const toggleFlowFullscreen = () => {
    setIsFlowFullscreen(!isFlowFullscreen);
  };

  return (
    <div className="app">
      {!isFlowFullscreen && <Header />}

      {isFlowFullscreen ? (
        // Fullscreen Flow Mode
        <div className="fullscreen-flow">
          <FlowVisualization
            flowData={currentFlow}
            isLoading={isLoading}
            isFullscreen={true}
            onToggleFullscreen={toggleFlowFullscreen}
          />
        </div>
      ) : (
        // Normal Split Layout
        <>
          <div className="main-container">
            <div className="chat-section">
              <ChatInterface
                onNewFlow={handleNewFlow}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                messages={messages}
                setMessages={setMessages}
              />
            </div>
            <div className="flow-section">
              <FlowVisualization
                flowData={currentFlow}
                isLoading={isLoading}
                isFullscreen={false}
                onToggleFullscreen={toggleFlowFullscreen}
              />
            </div>
          </div>
          <Footer />
        </>
      )}
    </div>
  );
}

export default App;
