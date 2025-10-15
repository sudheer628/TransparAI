import React from "react";
import { Handle, Position } from "reactflow";
import { motion } from "framer-motion";

const CustomNode = ({ data, selected }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "border-green-400 bg-green-500/20";
      case "processing":
        return "border-yellow-400 bg-yellow-500/20";
      case "error":
        return "border-red-400 bg-red-500/20";
      default:
        return "border-cyan-400 bg-cyan-500/20";
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      className={`px-4 py-3 rounded-lg border-2 backdrop-blur-sm min-w-[120px] ${getStatusColor(
        data.status
      )} ${selected ? "ring-2 ring-white/50" : ""}`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-2 h-2 bg-blue-400"
      />

      <div className="text-center">
        <div className="text-2xl mb-1">{data.icon}</div>
        <div className="text-sm font-semibold text-white">{data.label}</div>
        {data.action && (
          <div className="text-xs text-white/70 mt-1">{data.action}</div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2 h-2 bg-blue-400"
      />
    </motion.div>
  );
};

export default CustomNode;
