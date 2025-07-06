"use client";

import React from "react";
import { RotateCcw, Settings, Home, Brain, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Mode, AgentType } from "@/types";
import { getAgentColor } from "@/lib/modules";

interface HeaderProps {
  mode?: Mode;
  currentAgent?: AgentType;
  sessionId?: string;
  onReset?: () => void;
  onHome?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  mode,
  currentAgent,
  sessionId,
  onReset,
  onHome,
}) => {
  const getAgentName = (agent?: AgentType): string => {
    if (!agent) return "";
    return `${agent.charAt(0).toUpperCase() + agent.slice(1)} Agent`;
  };

  return (
    <header className="bg-white border-b border-slate-200/80 px-6 py-4 shadow-[0_4px_20px_rgba(0,0,0,0.08)] relative z-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_-100px,rgba(59,130,246,0.08),transparent)]" />
      <div className="relative flex items-center justify-between">
        {/* Left side - Logo and breadcrumb */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-inner group-hover:shadow-lg transition-all duration-300 border border-blue-500/20 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0,rgba(255,255,255,0.15),transparent)] group-hover:translate-y-[-25%] transition-transform duration-700" />
              <Brain className="w-6 h-6 text-white relative z-10" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:to-indigo-700 transition-all duration-300">
                Utopia AI
              </h1>
              <div className="text-xs text-slate-500">Enterprise Platform</div>
            </div>
          </div>

          {mode && (
            <div className="flex items-center space-x-2 text-sm">
              <ChevronRight className="w-4 h-4 text-slate-400" />
              <div className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full border border-slate-200/50 uppercase tracking-wide hover:bg-slate-200/50 transition-colors duration-300">
                {mode} Mode
              </div>
              {currentAgent && (
                <>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                  <div className="flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full border border-blue-100 hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 group">
                    <div
                      className={`w-2 h-2 rounded-full ${getAgentColor(
                        currentAgent
                      )} group-hover:animate-pulse`}
                    />
                    <span className="text-xs font-medium bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
                      {getAgentName(currentAgent)}
                    </span>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center space-x-3">
          {sessionId && (
            <div className="px-3 py-1.5 bg-gradient-to-r from-slate-50 to-white rounded-full border border-slate-200/50 shadow-sm hover:shadow transition-all duration-300">
              <div className="text-xs text-slate-600 hidden md:block">
                Session ID:{" "}
                <span className="font-medium bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {sessionId.slice(0, 8)}...
                </span>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2">
            {onHome && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onHome}
                className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all duration-300 rounded-lg px-4"
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            )}

            {onReset && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onReset}
                className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all duration-300 rounded-lg px-4"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all duration-300 rounded-lg relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-indigo-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg" />
              <Settings className="w-4 h-4 relative z-10" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
