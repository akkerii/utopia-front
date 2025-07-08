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

  // Helper function to validate and normalize module values
  const getValidModule = (
    module: ModuleType | undefined
  ): ModuleType | undefined => {
    if (!module) return undefined;

    // Check if the module exists in our config
    if (moduleConfig[module]) {
      return module;
    }

    // Try to find a matching module by value comparison
    const moduleValues = Object.values(ModuleType);
    const foundModule = moduleValues.find((m) => m === module);
    if (foundModule && moduleConfig[foundModule]) {
      return foundModule;
    }

    console.error("Invalid module value received:", module);
    console.error("Available modules:", Object.keys(moduleConfig));
    return undefined;
  };

  // Get validated current module
  const validCurrentModule = getValidModule(currentModule);

  // Debug logging and validation
  React.useEffect(() => {
    console.log(
      "Dashboard received currentModule:",
      currentModule,
      typeof currentModule
    );
    console.log("Validated currentModule:", validCurrentModule);
    if (currentModule && !validCurrentModule) {
      console.error("Invalid currentModule value:", currentModule);
      console.error("Expected one of:", Object.keys(moduleConfig));
    }
  }, [currentModule, validCurrentModule]);

  const getModuleStatus = (moduleType: ModuleType) => {
    if (!sessionData) return "empty";
    const moduleData = sessionData.modules.find(
      (m) => m.moduleType === moduleType
    );
    const status = moduleData?.completionStatus || "empty";
    // Normalize backend status naming to UI expectations
    return status === "in_progress" ? "partial" : status;
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

  const getStartedModules = (): ModuleType[] => {
    if (!sessionData) return [];
    return sessionData.modules
      .filter(
        (m) =>
          m.completionStatus === "completed" ||
          m.completionStatus === "in_progress"
      )
      .map((m) => m.moduleType);
  };

  // Backward compatibility for progress bar
  const getCompletedModules = (): ModuleType[] => {
    if (!sessionData) return [];
    return sessionData.modules
      .filter((m) => m.completionStatus === "completed")
      .map((m) => m.moduleType);
  };

  const handleModuleClick = (moduleType: ModuleType) => {
    const summary = getModuleSummary(moduleType);
    const moduleData = getModuleData(moduleType);
    const hasData =
      summary || (moduleData && Object.keys(moduleData).length > 0);
    const accessible =
      isModuleAccessible(moduleType, startedModules) || hasData;

    if (accessible && onModuleClick) {
      onModuleClick(moduleType);
    }
  };

  const startedModules = getStartedModules();
  const completedModules = getCompletedModules();
  const currentModuleIndex = validCurrentModule
    ? getModuleIndex(validCurrentModule)
    : -1;
  const nextModule = validCurrentModule
    ? getNextModule(validCurrentModule)
    : null;

  const getProgressPercentage = (completedModules: ModuleType[]): number => {
    if (!sessionData || completedModules.length === 0) return 0;
    const totalModules = modules.length;
    const completed = completedModules.length;
    return (completed / totalModules) * 100;
  };

  return (
    <div className="w-72 bg-white border-r border-gray-100 h-full flex flex-col">
      {/* Header */}
      <div className="px-4 py-4 border-b border-gray-100 bg-white">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center shadow-inner border border-blue-500/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0,rgba(255,255,255,0.15),transparent)]" />
            <Building className="w-4 h-4 text-white relative z-10" />
          </div>
          <div>
            <h2 className="text-base font-medium text-gray-900">
              Business Plan
            </h2>
            {sessionData && (
              <div className="flex items-center mt-0.5">
                <span className="text-xs text-gray-500">
                  {sessionData.mode.charAt(0).toUpperCase() +
                    sessionData.mode.slice(1)}{" "}
                  Mode
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Current Module Indicator */}
      {validCurrentModule && (
        <div className="px-4 py-3 bg-blue-50/50 border-b border-blue-100/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse" />
              <span className="text-xs font-medium text-blue-700">
                Current Module
              </span>
            </div>
            {currentAgent && (
              <span className="text-xs font-medium text-gray-600">
                {currentAgent.charAt(0).toUpperCase() + currentAgent.slice(1)}{" "}
                Agent
              </span>
            )}
          </div>
          <div className="mt-1 text-sm font-medium text-gray-900">
            {moduleConfig[validCurrentModule].title}
          </div>
        </div>
      )}

      {/* Modules List */}
      <div className="flex-1 overflow-y-auto">
        <div className="py-2">
          {modules.map((moduleType, index) => {
            const config = moduleConfig[moduleType];
            if (!config) return null;

            const status = getModuleStatus(moduleType);
            const summary = getModuleSummary(moduleType);
            const moduleData = getModuleData(moduleType);
            const Icon = iconMap[config.icon as keyof typeof iconMap] || Circle;
            const isCurrent = validCurrentModule === moduleType;
            const hasData =
              summary || (moduleData && Object.keys(moduleData).length > 0);
            const isAccessible =
              isModuleAccessible(moduleType, startedModules) || hasData;
            const isCompleted = status === "completed";

            return (
              <div key={moduleType} className="relative">
                {/* Connection Line */}
                {index < modules.length - 1 && (
                  <div
                    className={cn(
                      "absolute left-[22px] top-[38px] w-px h-4",
                      isCompleted ? "bg-green-500" : "bg-gray-200"
                    )}
                  />
                )}

                <div
                  onClick={() => isAccessible && handleModuleClick(moduleType)}
                  className={cn(
                    "mx-3 px-3 py-2 rounded-lg transition-all duration-150",
                    isCurrent
                      ? "bg-blue-50 border border-blue-100"
                      : isCompleted
                      ? "hover:bg-gray-50"
                      : isAccessible
                      ? "hover:bg-gray-50"
                      : "opacity-60",
                    isAccessible ? "cursor-pointer" : "cursor-not-allowed"
                  )}
                >
                  <div className="flex items-start space-x-3">
                    {/* Module Number/Status */}
                    <div
                      className={cn(
                        "flex items-center justify-center w-6 h-6 rounded-md text-xs font-medium flex-shrink-0",
                        isCompleted
                          ? "bg-green-500 text-white"
                          : isCurrent
                          ? "bg-blue-500 text-white"
                          : isAccessible
                          ? "bg-gray-100 text-gray-600"
                          : "bg-gray-100 text-gray-400"
                      )}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-3.5 h-3.5" />
                      ) : (
                        <span>{index + 1}</span>
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
                              ? "text-gray-900"
                              : "text-gray-500"
                          )}
                        >
                          {config.title}
                        </h3>
                        {!isAccessible && (
                          <Lock className="w-3 h-3 text-gray-400 flex-shrink-0" />
                        )}
                      </div>

                      {hasData && (
                        <div className="mt-2 text-xs bg-white rounded-md border border-gray-100 p-2">
                          {summary ? (
                            <p className="text-gray-600 line-clamp-3">
                              {summary}
                            </p>
                          ) : (
                            moduleData && (
                              <div className="space-y-1.5 text-gray-600">
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
                                  <div className="text-gray-400 text-xs mt-1">
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
            );
          })}
        </div>
      </div>

      {/* Progress Footer */}
      {sessionData && (
        <div className="px-4 py-4 border-t border-gray-100 bg-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-700">Progress</span>
            <span className="text-xs font-medium text-blue-600">
              {Math.round(getProgressPercentage(completedModules))}%
            </span>
          </div>

          <div className="relative">
            <div className="w-full bg-gray-100 rounded-full h-1">
              <div
                className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                style={{
                  width: `${getProgressPercentage(completedModules)}%`,
                }}
              />
            </div>
          </div>

          <div className="mt-2 flex justify-between items-center">
            <span className="text-xs text-gray-500">
              {completedModules.length} of {modules.length} complete
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
