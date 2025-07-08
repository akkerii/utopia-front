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
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-2.5 flex items-center justify-between">
      {/* Left side - Logo and navigation */}
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center shadow-inner border border-blue-500/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0,rgba(255,255,255,0.15),transparent)]" />
            <Brain className="w-4 h-4 text-white relative z-10" />
          </div>
          <div>
            <div className="flex items-center space-x-1">
              <span className="text-base font-semibold text-gray-900">
                Utopia AI
              </span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
            <span className="text-xs text-gray-500">Enterprise Platform</span>
          </div>
        </div>

        {mode && (
          <div className="flex items-center space-x-1">
            <div className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full">
              {mode.toUpperCase()} MODE
            </div>
            {currentAgent && (
              <>
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <div className="flex items-center space-x-2 px-2 py-1 bg-blue-50 rounded-full">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                  <span className="text-xs font-medium text-blue-700">
                    {currentAgent.charAt(0).toUpperCase() +
                      currentAgent.slice(1)}{" "}
                    Agent
                  </span>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Right side - Session info and actions */}
      <div className="flex items-center space-x-3">
        {sessionId && (
          <div className="flex items-center space-x-2 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-200">
            <span className="text-xs text-gray-600">Session ID:</span>
            <span className="text-xs font-medium text-gray-900">
              {sessionId.slice(0, 8)}...
            </span>
          </div>
        )}

        <div className="flex items-center space-x-2">
          {onHome && (
            <button
              onClick={onHome}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Home className="w-4 h-4" />
              <span className="text-sm">Home</span>
            </button>
          )}

          {onReset && (
            <button
              onClick={onReset}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="text-sm">Reset</span>
            </button>
          )}

          <button className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
