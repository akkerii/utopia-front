"use client";

import React, { useState } from "react";
import {
  Lightbulb,
  Users,
  Diamond,
  Building,
  Megaphone,
  Cog,
  DollarSign,
  CheckCircle,
  Clock,
  Circle,
  ChevronRight,
  Lock,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { ModuleType, SessionData, AgentType } from "@/types";
import {
  moduleConfig,
  getModulesByOrder,
  isModuleAccessible,
  getNextModule,
  getPreviousModule,
  getModuleIndex,
  getModuleTitle,
  getAgentColor,
} from "@/lib/modules";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface DashboardProps {
  sessionData?: SessionData;
  onModuleClick?: (moduleType: ModuleType) => void;
  onNextModule?: () => void;
  currentModule?: ModuleType;
  currentAgent?: AgentType;
}

const iconMap = {
  lightbulb: Lightbulb,
  users: Users,
  diamond: Diamond,
  building: Building,
  megaphone: Megaphone,
  cog: Cog,
  "dollar-sign": DollarSign,
};

const ModuleTransitionOverlay = ({
  show,
  moduleTitle,
}: {
  show: boolean;
  moduleTitle: string;
}) =>
  show ? (
    <div className="absolute inset-0 bg-blue-500/10 flex items-center justify-center rounded-xl z-10 animate-fade-out">
      <div className="bg-white rounded-lg shadow-lg p-3 flex items-center space-x-2">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
        <span className="text-sm text-gray-700">
          Switching to {moduleTitle}...
        </span>
      </div>
    </div>
  ) : null;

const Dashboard: React.FC<DashboardProps> = ({
  sessionData,
  onModuleClick,
  onNextModule,
  currentModule,
  currentAgent,
}) => {
  const modules = getModulesByOrder();

  const getModuleStatus = (moduleType: ModuleType) => {
    if (!sessionData) return "empty";
    const moduleData = sessionData.modules.find(
      (m) => m.moduleType === moduleType
    );
    return moduleData?.completionStatus || "empty";
  };

  const getModuleSummary = (moduleType: ModuleType) => {
    if (!sessionData) return undefined;
    const moduleData = sessionData.modules.find(
      (m) => m.moduleType === moduleType
    );
    return moduleData?.summary;
  };

  const getModuleData = (moduleType: ModuleType) => {
    if (!sessionData) return undefined;
    const moduleData = sessionData.modules.find(
      (m) => m.moduleType === moduleType
    );
    return moduleData?.data;
  };

  const getCompletedModules = (): ModuleType[] => {
    if (!sessionData) return [];
    return sessionData.modules
      .filter((m) => m.completionStatus === "completed")
      .map((m) => m.moduleType);
  };

  const handleModuleClick = (moduleType: ModuleType) => {
    const accessible = isModuleAccessible(moduleType, completedModules);
    if (accessible && onModuleClick) {
      onModuleClick(moduleType);
    }
  };

  const completedModules = getCompletedModules();
  const currentModuleIndex = currentModule ? getModuleIndex(currentModule) : -1;
  const nextModule = currentModule ? getNextModule(currentModule) : null;

  const getProgressPercentage = (completedModules: ModuleType[]): number => {
    if (!sessionData || completedModules.length === 0) return 0;
    const totalModules = modules.length;
    const completed = completedModules.length;
    return (completed / totalModules) * 100;
  };

  return (
    <div className="w-72 bg-white border-r border-slate-200/80 h-full overflow-y-auto shadow-[4px_0_20px_rgba(0,0,0,0.08)] relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(59,130,246,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(59,130,246,0.02)_1px,transparent_1px)] bg-[size:14px_24px]" />
      {/* Header */}
      <div className="p-4 border-b border-slate-200/80 bg-gradient-to-r from-slate-50 to-white relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_400px_at_50%_-100px,rgba(59,130,246,0.08),transparent)]" />
        <div className="relative">
          <h2 className="text-lg font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Business Plan
          </h2>
          {sessionData && (
            <div className="mt-2 flex items-center space-x-2">
              <span className="text-xs text-slate-500">Mode:</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm relative overflow-hidden group">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0,rgba(255,255,255,0.15),transparent)] group-hover:translate-y-[-25%] transition-transform duration-700" />
                <span className="relative">
                  {sessionData.mode.charAt(0).toUpperCase() +
                    sessionData.mode.slice(1)}
                </span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Current Module Indicator */}
      {currentModule && (
        <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(59,130,246,0.2),transparent)]" />
          <div className="relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs text-blue-700">
                <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-pulse" />
                <span className="font-medium">Current Module</span>
              </div>
              {currentAgent && (
                <div className="flex items-center space-x-2 group">
                  <Sparkles className="w-3 h-3 text-indigo-500 group-hover:animate-bounce transition-transform duration-300" />
                  <span className="text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    {currentAgent.charAt(0).toUpperCase() +
                      currentAgent.slice(1)}{" "}
                    Agent
                  </span>
                </div>
              )}
            </div>
            <div className="mt-1 text-sm font-semibold text-slate-900">
              {moduleConfig[currentModule].title}
            </div>
          </div>
        </div>
      )}

      {/* Modules */}
      <div className="py-3 relative">
        {modules.map((moduleType, index) => {
          const config = moduleConfig[moduleType];
          const status = getModuleStatus(moduleType);
          const summary = getModuleSummary(moduleType);
          const moduleData = getModuleData(moduleType);
          const Icon = iconMap[config.icon as keyof typeof iconMap] || Circle;
          const isCurrent = currentModule === moduleType;
          const isAccessible = isModuleAccessible(moduleType, completedModules);
          const isCompleted = status === "completed";
          const hasData =
            summary || (moduleData && Object.keys(moduleData).length > 0);

          return (
            <div key={moduleType} className="relative">
              {/* Connection Line */}
              {index < modules.length - 1 && (
                <div
                  className={cn(
                    "absolute left-[22px] top-[38px] w-0.5 h-4",
                    isCompleted
                      ? "bg-gradient-to-b from-green-400 to-emerald-500"
                      : "bg-slate-200"
                  )}
                />
              )}

              <div
                onClick={() => isAccessible && handleModuleClick(moduleType)}
                className={cn(
                  "relative mx-3 rounded-xl transition-all duration-300",
                  isCurrent
                    ? "bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/60"
                    : isCompleted
                    ? "hover:bg-green-50/80 border border-slate-200/60"
                    : isAccessible
                    ? "hover:bg-slate-50/80 border border-slate-200/60"
                    : "opacity-60 border border-slate-200/40",
                  isAccessible
                    ? "cursor-pointer transform hover:scale-[1.02] hover:shadow-md"
                    : "cursor-not-allowed"
                )}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0,rgba(255,255,255,0.5),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="p-3 relative">
                  <div className="flex items-start space-x-3">
                    {/* Module Number/Status */}
                    <div
                      className={cn(
                        "flex items-center justify-center w-6 h-6 rounded-lg text-xs font-medium flex-shrink-0 shadow-sm transition-all duration-300 relative overflow-hidden group",
                        isCompleted
                          ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                          : isCurrent
                          ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
                          : isAccessible
                          ? "bg-slate-200 text-slate-700"
                          : "bg-slate-100 text-slate-400"
                      )}
                    >
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0,rgba(255,255,255,0.15),transparent)] group-hover:translate-y-[-25%] transition-transform duration-700" />
                      {isCompleted ? (
                        <CheckCircle className="w-3.5 h-3.5 relative z-10" />
                      ) : (
                        <span className="relative z-10">{index + 1}</span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-2">
                        <h3
                          className={cn(
                            "text-sm font-medium truncate",
                            isCurrent
                              ? "text-blue-700"
                              : isAccessible
                              ? "text-slate-900"
                              : "text-slate-500"
                          )}
                        >
                          {config.title}
                        </h3>
                        {!isAccessible && (
                          <Lock className="w-3 h-3 text-slate-400 flex-shrink-0" />
                        )}
                      </div>

                      {hasData && (
                        <div className="mt-2 text-xs bg-white rounded-lg border border-slate-200/60 p-2.5 shadow-sm relative overflow-hidden group">
                          <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          {summary ? (
                            <p className="text-slate-600 line-clamp-3 relative">
                              {summary}
                            </p>
                          ) : (
                            moduleData && (
                              <div className="space-y-1.5 text-slate-600 relative">
                                {Object.entries(moduleData)
                                  .slice(0, 2)
                                  .map(([key, value]) => (
                                    <div
                                      key={key}
                                      className="flex items-center space-x-1.5"
                                    >
                                      <span className="font-medium capitalize">
                                        {key.replace(/_/g, " ")}:
                                      </span>
                                      <span className="truncate">
                                        {String(value)}
                                      </span>
                                    </div>
                                  ))}
                                {Object.keys(moduleData).length > 2 && (
                                  <div className="text-slate-400 text-xs mt-1">
                                    +{Object.keys(moduleData).length - 2}{" "}
                                    more...
                                  </div>
                                )}
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress Summary */}
      {sessionData && (
        <div className="px-4 py-4 border-t border-slate-200/80 bg-gradient-to-r from-slate-50 to-white relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_150%,rgba(59,130,246,0.08),transparent)]" />
          <div className="relative">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-semibold text-slate-700">
                Progress
              </span>
              <span className="text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {Math.round(getProgressPercentage(completedModules))}%
              </span>
            </div>

            <div className="relative">
              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 h-1.5 rounded-full transition-all duration-500 shadow-sm relative overflow-hidden"
                  style={{
                    width: `${getProgressPercentage(completedModules)}%`,
                  }}
                >
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0)_100%)] animate-[shine_2s_ease-in-out_infinite]" />
                </div>
              </div>
            </div>

            <div className="mt-2.5 flex justify-between items-center">
              <span className="text-xs text-slate-500">
                {completedModules.length} of {modules.length} complete
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
