import React, { useCallback, useEffect, useState } from "react";
import ReactFlow, {
  MiniMap,
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
    if (!flowData) return;

    const flowNodes =
      flowData.nodes?.map((node, index) => ({
        id: node.id,
        type: "custom",
        position: {
          x: (index % 3) * 200 + 100,
          y: Math.floor(index / 3) * 150 + 100,
        },
        data: {
          label: node.service || node.label,
          service: node.service,
          action: node.action,
          details: node.details,
          status: node.status || "completed",
          icon: getServiceIcon(node.service),
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
            ? "Processing reasoning steps..."
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
            <MiniMap
              className="bg-slate-800/50 border-cyan-500/30"
              nodeColor="#06b6d4"
              maskColor="rgba(6, 182, 212, 0.1)"
            />
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
          {selectedNode.data.action && (
            <p className="text-sm text-blue-200 mb-1">
              Action: {selectedNode.data.action}
            </p>
          )}
          {selectedNode.data.details && (
            <p className="text-sm text-white/70">{selectedNode.data.details}</p>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default FlowVisualization;
