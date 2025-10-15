import React from "react";
import { Brain, Zap } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-white/10 backdrop-blur-md border-b border-white/20 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Brain className="w-8 h-8 text-blue-300" />
            <Zap className="w-6 h-6 text-yellow-300" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">TransparAI</h1>
            <p className="text-sm text-blue-200">Visualizing How AI Thinks</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-white/80">Powered by AWS Bedrock</p>
          <p className="text-xs text-white/60">Amazon Nova Pro</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
