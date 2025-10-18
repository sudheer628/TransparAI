import React from "react";
import { Handle, Position } from "reactflow";
import { motion } from "framer-motion";

const CustomNode = ({ data, selected }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "border-green-400 bg-green-500/20 shadow-green-400/20";
      case "processing":
        return "border-yellow-400 bg-yellow-500/20 shadow-yellow-400/20";
      case "error":
        return "border-red-400 bg-red-500/20 shadow-red-400/20";
      default:
        return "border-cyan-400 bg-cyan-500/20 shadow-cyan-400/20";
    }
  };

  const getServiceTypeStyle = (service) => {
    const serviceStyles = {
      bedrock: "border-purple-400 bg-purple-500/20",
      sagemaker: "border-orange-400 bg-orange-500/20",
      lambda: "border-yellow-400 bg-yellow-500/20",
      search: "border-blue-400 bg-blue-500/20",
      nova: "border-pink-400 bg-pink-500/20",
      claude: "border-indigo-400 bg-indigo-500/20",
      user: "border-green-400 bg-green-500/20",
      response: "border-emerald-400 bg-emerald-500/20",
    };

    const serviceKey = service?.toLowerCase() || "";
    return serviceStyles[serviceKey] || "border-cyan-400 bg-cyan-500/20";
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
      className={`
        px-4 py-3 rounded-lg border-2 backdrop-blur-sm shadow-lg
        ${getServiceTypeStyle(data.service)}
        ${selected ? "ring-2 ring-white/50" : ""}
        transition-all duration-200 hover:shadow-xl
        min-w-[180px] max-w-[220px]
      `}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-cyan-400 border-2 border-white/20 hover:bg-cyan-300 transition-colors"
      />

      <div className="text-center">
        <div className="text-2xl mb-2 filter drop-shadow-sm">{data.icon}</div>
        <div className="text-sm font-semibold text-white leading-tight px-1">
          {data.label}
        </div>
        {data.action && (
          <div className="text-xs text-white/70 mt-2 px-1 leading-tight">
            {data.action}
          </div>
        )}
        {data.stepNumber && (
          <div className="text-xs text-cyan-300 mt-1 font-mono">
            Step {data.stepNumber}
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-cyan-400 border-2 border-white/20 hover:bg-cyan-300 transition-colors"
      />

      {/* Status indicator */}
      {data.status && (
        <div
          className={`
          absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-slate-800
          ${
            data.status === "completed"
              ? "bg-green-400"
              : data.status === "processing"
              ? "bg-yellow-400 animate-pulse"
              : data.status === "error"
              ? "bg-red-400"
              : "bg-cyan-400"
          }
        `}
        />
      )}
    </motion.div>
  );
};

export default CustomNode;
