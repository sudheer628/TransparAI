import React from "react";
import { Award, User } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-900/60 backdrop-blur-sm border-t border-cyan-500/20 px-6 py-3">
      <div className="flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Award className="w-3 h-3" />
            <span>AWS AI Agent Global Hackathon powered by DEVPOST</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <User className="w-3 h-3" />
          <span>Created by Sai Sudheer K</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
