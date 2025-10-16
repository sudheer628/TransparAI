import React, { useCallback, useEffect, useState } from "react";
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";
import { motion } from "framer-motion";
import { Eye, GitBranch, Zap } from "lucide-react";
import CustomNode from "./CustomNode";

const nodeTypes = {
  custom: CustomNode,
};

// Calculate better node positions to avoid overlapping
const calculateNodePosition = (node, index, allNodes, allEdges) => {
  const horizontalSpacing = 320;
  const verticalSpacing = 150;
  const centerX = 500;

  // Define fixed positions for key nodes
  const fixedPositions = {
    "user-input": { x: centerX, y: 50 },
    "agentcore-entry": { x: centerX, y: 200 },
    "nova-pro": { x: centerX, y: 800 },
    "final-response": { x: centerX, y: 950 },
    "decision-synthesis": { x: centerX, y: 650 },
  };

  // Check if this is a fixed position node
  if (fixedPositions[node.id]) {
    return fixedPositions[node.id];
  }

  // Handle reasoning trace nodes (sim_trace_*)
  if (node.id.startsWith("sim_trace_")) {
    const reasoningNodes = allNodes.filter((n) =>
      n.id.startsWith("sim_trace_")
    );
    const nodeIndex = reasoningNodes.findIndex((n) => n.id === node.id);
    const totalNodes = reasoningNodes.length;

    // Arrange in rows of 3
    const nodesPerRow = 3;
    const row = Math.floor(nodeIndex / nodesPerRow);
    const col = nodeIndex % nodesPerRow;

    // Center the nodes in each row
    const rowWidth = Math.min(totalNodes - row * nodesPerRow, nodesPerRow);
    const startX = centerX - ((rowWidth - 1) * horizontalSpacing) / 2;

    return {
      x: startX + col * horizontalSpacing,
      y: 350 + row * verticalSpacing,
    };
  }

  // Handle knowledge base nodes (kb-*)
  if (node.id.startsWith("kb-")) {
    const kbNodes = allNodes.filter((n) => n.id.startsWith("kb-"));
    const nodeIndex = kbNodes.findIndex((n) => n.id === node.id);
    const totalNodes = kbNodes.length;

    const startX = centerX - ((totalNodes - 1) * horizontalSpacing) / 2;
    return {
      x: startX + nodeIndex * horizontalSpacing,
      y: 500,
    };
  }

  // Handle tool nodes (tool-*)
  if (node.id.startsWith("tool-")) {
    const toolNodes = allNodes.filter((n) => n.id.startsWith("tool-"));
    const nodeIndex = toolNodes.findIndex((n) => n.id === node.id);
    const totalNodes = toolNodes.length;

    const startX = centerX - ((totalNodes - 1) * horizontalSpacing) / 2;
    return {
      x: startX + nodeIndex * horizontalSpacing,
      y: 500,
    };
  }

  // Default positioning for any other nodes
  const row = Math.floor(index / 3);
  const col = index % 3;
  return {
    x: centerX - horizontalSpacing + col * horizontalSpacing,
    y: 350 + row * verticalSpacing,
  };
};

const FlowVisualization = ({ flowData, isLoading }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
  }, []);

  // Convert flow data to React Flow format
  useEffect(() => {
    if (!flowData) {
      console.log("❌ No flow data received");
      return;
    }

    console.log("📊 Flow data received:", flowData);
    console.log("📊 Flow data structure:", JSON.stringify(flowData, null, 2));
    console.log("📊 Nodes:", flowData.nodes?.length || 0);
    console.log("📊 Edges:", flowData.edges?.length || 0);
    console.log("📊 Metadata:", flowData.metadata);

    const flowNodes =
      flowData.nodes?.map((node, index) => ({
        id: node.id,
        type: "custom",
        position: calculateNodePosition(
          node,
          index,
          flowData.nodes,
          flowData.edges
        ),
        data: {
          label: node.data?.label || node.label || node.id,
          service: node.data?.service || node.service,
          action: node.data?.action || node.action,
          details: node.data?.details || node.details,
          status: node.data?.status || node.status || "completed",
          icon: getServiceIcon(node.data?.service || node.service),
          agentCorePhase: node.data?.agentCorePhase,
          reasoning: node.data?.reasoning,
          confidence: node.data?.confidence,
          stepNumber: index + 1,
        },
      })) || [];

    const flowEdges =
      flowData.edges?.map((edge) => ({
        id: `${edge.source}-${edge.target}`,
        source: edge.source,
        target: edge.target,
        type: "smoothstep",
        animated: true,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "#06b6d4",
        },
        style: {
          stroke: "#06b6d4",
          strokeWidth: 2,
        },
      })) || [];

    setNodes(flowNodes);
    setEdges(flowEdges);
  }, [flowData, setNodes, setEdges]);

  const getServiceIcon = (service) => {
    const icons = {
      Bedrock: "🧠",
      S3: "🪣",
      Lambda: "λ",
      SageMaker: "🤖",
      Cohere: "🔤",
      WebSearch: "🔍",
      Claude: "🎭",
      Nova: "⭐",
      "API Gateway": "🚪",
      DynamoDB: "🗄️",
    };
    return icons[service] || "⚙️";
  };

  if (!flowData && !isLoading) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-cyan-500/30 h-full flex items-center justify-center">
        <div className="text-center text-white/70">
          <GitBranch className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold mb-2">AI Reasoning Flow</h3>
          <p className="text-sm">
            Send a message to see how AI thinks through the answer
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-cyan-500/30 h-full flex flex-col">
      {/* Flow Header */}
      <div className="p-4 border-b border-cyan-500/30">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Eye className="w-5 h-5" />
          Reasoning Visualization
        </h2>
        <p className="text-sm text-white/70">
          {isLoading
            ? "AgentCore processing reasoning steps..."
            : flowData?.agentCoreMetadata
            ? `AgentCore Flow: ${flowData.agentCoreMetadata.reasoningSteps} reasoning steps • ${flowData.agentCoreMetadata.agentName}`
            : "AWS services orchestration flow"}
        </p>
      </div>

      {/* Flow Area */}
      <div className="flex-1 relative">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="text-white/70"
            >
              <Zap className="w-8 h-8" />
            </motion.div>
          </div>
        ) : (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
            attributionPosition="bottom-left"
          >
            <Controls className="bg-slate-800/50 border-cyan-500/30" />
            <Background variant="dots" gap={12} size={1} color="#06b6d420" />
          </ReactFlow>
        )}
      </div>

      {/* Node Details Panel */}
      {selectedNode && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 border-t border-cyan-500/30 bg-slate-900/30"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <span className="text-lg">{selectedNode.data.icon}</span>
              {selectedNode.data.label}
            </h3>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-white/50 hover:text-white"
            >
              ✕
            </button>
          </div>
          {selectedNode.data.agentCorePhase && (
            <p className="text-sm text-cyan-200 mb-1">
              <span className="text-white/50">AgentCore Phase:</span>{" "}
              {selectedNode.data.agentCorePhase}
            </p>
          )}
          {selectedNode.data.reasoning && (
            <p className="text-sm text-blue-200 mb-1">
              <span className="text-white/50">Reasoning:</span>{" "}
              {selectedNode.data.reasoning}
            </p>
          )}
          {selectedNode.data.stepNumber && (
            <p className="text-sm text-green-200 mb-1">
              <span className="text-white/50">Step:</span>{" "}
              {selectedNode.data.stepNumber}
            </p>
          )}
          {selectedNode.data.confidence && (
            <div className="mb-2">
              <p className="text-xs text-white/50 mb-1">
                Confidence: {Math.round(selectedNode.data.confidence * 100)}%
              </p>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                  className="bg-cyan-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${selectedNode.data.confidence * 100}%` }}
                />
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default FlowVisualization;
