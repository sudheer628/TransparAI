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
import {
  Eye,
  GitBranch,
  Zap,
  Maximize2,
  RotateCcw,
  Minimize2,
  X,
} from "lucide-react";
import CustomNode from "./CustomNode";

const nodeTypes = {
  custom: CustomNode,
};

// Simple and effective layout algorithm to prevent overlapping
const calculateNodePosition = (
  node,
  index,
  allNodes,
  allEdges,
  layoutMode = "grid",
  isFullscreen = false
) => {
  switch (layoutMode) {
    case "hierarchical":
      return calculateHierarchicalLayout(node, index, allNodes, isFullscreen);
    case "grid":
    default:
      return calculateGridLayout(node, index, allNodes, isFullscreen);
  }
};

// Simple grid layout with guaranteed no overlapping
const calculateGridLayout = (node, index, allNodes, isFullscreen = false) => {
  const totalNodes = allNodes?.length || 1;
  const cols = Math.min(isFullscreen ? 6 : 4, Math.ceil(Math.sqrt(totalNodes))); // More columns in fullscreen
  const horizontalSpacing = isFullscreen ? 400 : 300; // More spacing in fullscreen
  const verticalSpacing = isFullscreen ? 200 : 150;

  const row = Math.floor(index / cols);
  const col = index % cols;

  // Calculate actual nodes in this row
  const remainingNodes = totalNodes - row * cols;
  const nodesInThisRow = Math.min(cols, remainingNodes);

  // Center each row
  const rowWidth = (nodesInThisRow - 1) * horizontalSpacing;
  const centerX = isFullscreen ? 960 : 600; // Wider center for fullscreen
  const startX = centerX - rowWidth / 2;

  return {
    x: startX + col * horizontalSpacing,
    y: 150 + row * verticalSpacing,
  };
};

// Simple hierarchical layout - much cleaner
const calculateHierarchicalLayout = (
  node,
  index,
  allNodes,
  isFullscreen = false
) => {
  const horizontalSpacing = isFullscreen ? 450 : 350; // More spacing in fullscreen
  const verticalSpacing = isFullscreen ? 200 : 160;
  const centerX = isFullscreen ? 960 : 600; // Wider center for fullscreen

  // Define simple fixed positions for common node types
  const nodeId = node.id.toLowerCase();
  const nodeLabel = (node.data?.label || node.label || "").toLowerCase();

  // Input nodes at top
  if (
    nodeId.includes("user") ||
    nodeId.includes("input") ||
    nodeLabel.includes("user")
  ) {
    return { x: centerX, y: 80 };
  }

  // Output nodes at bottom
  if (
    nodeId.includes("response") ||
    nodeId.includes("output") ||
    nodeLabel.includes("response")
  ) {
    return { x: centerX, y: 800 };
  }

  // Model nodes near bottom
  if (
    nodeId.includes("nova") ||
    nodeId.includes("claude") ||
    nodeId.includes("model") ||
    nodeLabel.includes("nova") ||
    nodeLabel.includes("claude") ||
    nodeLabel.includes("model")
  ) {
    return { x: centerX, y: 650 };
  }

  // Group remaining nodes by type and arrange them in layers
  const middleNodes =
    allNodes?.filter((n) => {
      const id = n.id.toLowerCase();
      const label = (n.data?.label || n.label || "").toLowerCase();
      return (
        !id.includes("user") &&
        !id.includes("input") &&
        !label.includes("user") &&
        !id.includes("response") &&
        !id.includes("output") &&
        !label.includes("response") &&
        !id.includes("nova") &&
        !id.includes("claude") &&
        !id.includes("model") &&
        !label.includes("nova") &&
        !label.includes("claude") &&
        !label.includes("model")
      );
    }) || [];

  const nodeIndexInMiddle = middleNodes.findIndex((n) => n.id === node.id);

  if (nodeIndexInMiddle === -1) {
    // Fallback position
    return { x: centerX, y: 400 };
  }

  // Arrange middle nodes in rows
  const nodesPerRow = 3;
  const row = Math.floor(nodeIndexInMiddle / nodesPerRow);
  const col = nodeIndexInMiddle % nodesPerRow;

  // Calculate nodes in this row for centering
  const remainingNodes = middleNodes.length - row * nodesPerRow;
  const nodesInThisRow = Math.min(nodesPerRow, remainingNodes);

  const rowWidth = (nodesInThisRow - 1) * horizontalSpacing;
  const startX = centerX - rowWidth / 2;

  return {
    x: startX + col * horizontalSpacing,
    y: 250 + row * verticalSpacing,
  };
};

const FlowVisualization = ({
  flowData,
  isLoading,
  isFullscreen = false,
  onToggleFullscreen,
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [layoutMode, setLayoutMode] = useState("grid"); // 'hierarchical', 'grid'
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
  }, []);

  const onInit = useCallback((instance) => {
    setReactFlowInstance(instance);
  }, []);

  const handleFitView = useCallback(() => {
    if (reactFlowInstance) {
      reactFlowInstance.fitView({ padding: 0.1, duration: 800 });
    }
  }, [reactFlowInstance]);

  const handleResetLayout = useCallback(() => {
    setLayoutMode("grid");
    setTimeout(() => {
      if (reactFlowInstance) {
        reactFlowInstance.fitView({
          padding: isFullscreen ? 0.05 : 0.1,
          duration: 800,
        });
      }
    }, 100);
  }, [reactFlowInstance, isFullscreen]);

  // Keyboard shortcut for fullscreen toggle
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "f" && event.ctrlKey && onToggleFullscreen) {
        event.preventDefault();
        onToggleFullscreen();
      }
      if (event.key === "Escape" && isFullscreen && onToggleFullscreen) {
        event.preventDefault();
        onToggleFullscreen();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isFullscreen, onToggleFullscreen]);

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
          flowData.edges,
          layoutMode,
          isFullscreen
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
      flowData.edges?.map((edge, index) => ({
        id: `${edge.source}-${edge.target}`,
        source: edge.source,
        target: edge.target,
        type: layoutMode === "circular" ? "straight" : "smoothstep",
        animated: true,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "#06b6d4",
          width: 20,
          height: 20,
        },
        style: {
          stroke: "#06b6d4",
          strokeWidth: 2,
          strokeDasharray: edge.type === "conditional" ? "5,5" : undefined,
        },
        label: edge.label,
        labelStyle: {
          fill: "#ffffff",
          fontSize: 10,
          fontWeight: 500,
        },
        labelBgStyle: {
          fill: "#1e293b",
          fillOpacity: 0.8,
          rx: 4,
          ry: 4,
        },
      })) || [];

    setNodes(flowNodes);
    setEdges(flowEdges);
  }, [flowData, layoutMode, isFullscreen, setNodes, setEdges]);

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
    <div
      className={`bg-slate-800/50 backdrop-blur-md border border-cyan-500/30 h-full flex flex-col ${
        isFullscreen ? "rounded-none" : "rounded-xl"
      }`}
    >
      {/* Flow Header */}
      <div className="p-4 border-b border-cyan-500/30">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Reasoning Visualization
            {isFullscreen && (
              <span className="text-xs bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded-full ml-2">
                Fullscreen Mode
              </span>
            )}
          </h2>

          {/* Layout Controls */}
          <div className="flex items-center gap-3">
            {!isLoading && flowData && (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/50">Layout:</span>
                  <select
                    value={layoutMode}
                    onChange={(e) => setLayoutMode(e.target.value)}
                    className="bg-slate-700/50 border border-cyan-500/30 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="grid">Grid</option>
                    <option value="hierarchical">Hierarchical</option>
                  </select>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={handleFitView}
                    className="p-1.5 bg-slate-700/50 border border-cyan-500/30 rounded hover:bg-slate-600/50 transition-colors"
                    title="Fit to view"
                  >
                    <Maximize2 className="w-3 h-3 text-white/70" />
                  </button>
                  <button
                    onClick={handleResetLayout}
                    className="p-1.5 bg-slate-700/50 border border-cyan-500/30 rounded hover:bg-slate-600/50 transition-colors"
                    title="Reset layout"
                  >
                    <RotateCcw className="w-3 h-3 text-white/70" />
                  </button>
                </div>
              </>
            )}

            {/* Fullscreen Toggle */}
            {onToggleFullscreen && (
              <div className="flex items-center gap-1 ml-2 pl-2 border-l border-cyan-500/30">
                <button
                  onClick={onToggleFullscreen}
                  className={`p-2 border border-cyan-500/30 rounded hover:bg-slate-600/50 transition-colors ${
                    isFullscreen
                      ? "bg-cyan-500/20 text-cyan-300"
                      : "bg-slate-700/50 text-white/70"
                  }`}
                  title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                >
                  {isFullscreen ? (
                    <Minimize2 className="w-4 h-4" />
                  ) : (
                    <Maximize2 className="w-4 h-4" />
                  )}
                </button>
                {isFullscreen && (
                  <button
                    onClick={onToggleFullscreen}
                    className="p-2 bg-red-500/20 border border-red-500/30 rounded hover:bg-red-500/30 transition-colors text-red-300"
                    title="Close fullscreen"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

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
            onInit={onInit}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{
              padding: isFullscreen ? 0.05 : 0.1,
              minZoom: 0.5,
              maxZoom: isFullscreen ? 2 : 1.5,
              includeHiddenNodes: false,
            }}
            minZoom={0.3}
            maxZoom={2}
            attributionPosition="bottom-left"
            proOptions={{ hideAttribution: true }}
            nodesDraggable={true}
            nodesConnectable={false}
            elementsSelectable={true}
          >
            <Controls
              className="bg-slate-800/80 border-cyan-500/30 backdrop-blur-sm rounded-lg"
              showInteractive={false}
            />
            <Background
              variant="dots"
              gap={20}
              size={1.5}
              color="#06b6d415"
              className="opacity-60"
            />
          </ReactFlow>
        )}
      </div>

      {/* Enhanced Node Details Panel */}
      {selectedNode && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 border-t border-cyan-500/30 bg-slate-900/30 max-h-80 overflow-y-auto"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <span className="text-lg">{selectedNode.data.icon}</span>
              {selectedNode.data.label}
            </h3>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-white/50 hover:text-white text-xl"
            >
              ✕
            </button>
          </div>

          {/* Educational Information */}
          {selectedNode.data.educationalInfo && (
            <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <h4 className="text-sm font-semibold text-blue-300 mb-2">
                🎓 Educational Info
              </h4>
              <p className="text-xs text-blue-200 mb-2">
                <span className="font-medium">Purpose:</span>{" "}
                {selectedNode.data.educationalInfo.purpose}
              </p>
              <p className="text-xs text-blue-200 mb-2">
                <span className="font-medium">How it works:</span>{" "}
                {selectedNode.data.educationalInfo.technicalDetails}
              </p>
              <p className="text-xs text-cyan-200 mb-1">
                <span className="font-medium">AWS Service:</span>{" "}
                {selectedNode.data.educationalInfo.awsService}
              </p>
              {selectedNode.data.educationalInfo.learningPoint && (
                <p className="text-xs text-green-200 mt-2 italic">
                  💡 {selectedNode.data.educationalInfo.learningPoint}
                </p>
              )}
            </div>
          )}

          {/* Technical Details */}
          {selectedNode.data.details && (
            <div className="mb-3 p-3 bg-slate-800/50 border border-slate-600/30 rounded-lg">
              <h4 className="text-sm font-semibold text-slate-300 mb-2">
                🔧 Technical Details
              </h4>
              {Object.entries(selectedNode.data.details).map(([key, value]) => (
                <p key={key} className="text-xs text-slate-300 mb-1">
                  <span className="text-white/70 capitalize">
                    {key.replace(/([A-Z])/g, " $1")}:
                  </span>{" "}
                  <span className="text-cyan-200">
                    {Array.isArray(value) ? value.join(", ") : value}
                  </span>
                </p>
              ))}
            </div>
          )}

          {/* Data Flow */}
          {selectedNode.data.educationalInfo?.dataFlow && (
            <div className="mb-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <h4 className="text-sm font-semibold text-green-300 mb-2">
                🔄 Data Flow
              </h4>
              <p className="text-xs text-green-200">
                {selectedNode.data.educationalInfo.dataFlow}
              </p>
            </div>
          )}

          {/* Legacy fields for backward compatibility */}
          {selectedNode.data.reasoning &&
            !selectedNode.data.educationalInfo && (
              <p className="text-sm text-blue-200 mb-1">
                <span className="text-white/50">Reasoning:</span>{" "}
                {selectedNode.data.reasoning}
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
