import React, { useState } from "react";
import ChatInterface from "./components/ChatInterface";
import FlowVisualization from "./components/FlowVisualization";
import Header from "./components/Header";
import "./App.css";

function App() {
  const [currentFlow, setCurrentFlow] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleNewFlow = (flowData) => {
    setCurrentFlow(flowData);
  };

  return (
    <div className="app">
      <Header />
      <div className="main-container">
        <div className="chat-section">
          <ChatInterface
            onNewFlow={handleNewFlow}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        </div>
        <div className="flow-section">
          <FlowVisualization flowData={currentFlow} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}

export default App;
