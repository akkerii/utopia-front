import React, { useState } from "react";
import {
  Brain,
  User,
  Lightbulb,
  Target,
  TrendingUp,
  DollarSign,
  Cog,
  CheckCircle,
  Circle,
  ArrowRight,
  Sparkles,
  MessageCircle,
  BarChart3,
} from "lucide-react";

interface ModuleProgress {
  moduleType: string;
  data: any;
  summary: string;
  completionStatus: "empty" | "partial" | "completed";
  lastUpdated: Date;
}

interface CollaborativeProgressProps {
  modules: ModuleProgress[];
  currentModule?: string;
  questioningStrategy: string;
  totalInsights: number;
  confidenceLevel: number;
  conversationDepth: number;
}

const CollaborativeProgress: React.FC<CollaborativeProgressProps> = ({
  modules,
  currentModule,
  questioningStrategy,
  totalInsights,
  confidenceLevel,
  conversationDepth,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const getModuleIcon = (moduleType: string) => {
    switch (moduleType) {
      case "IDEA_CONCEPT":
        return <Lightbulb className="w-4 h-4" />;
      case "TARGET_MARKET":
        return <Target className="w-4 h-4" />;
      case "VALUE_PROPOSITION":
        return <TrendingUp className="w-4 h-4" />;
      case "BUSINESS_MODEL":
        return <DollarSign className="w-4 h-4" />;
      case "MARKETING_STRATEGY":
        return <MessageCircle className="w-4 h-4" />;
      case "OPERATIONS_PLAN":
        return <Cog className="w-4 h-4" />;
      case "FINANCIAL_PLAN":
        return <BarChart3 className="w-4 h-4" />;
      default:
        return <Circle className="w-4 h-4" />;
    }
  };

  const getModuleTitle = (moduleType: string) => {
    switch (moduleType) {
      case "IDEA_CONCEPT":
        return "Business Idea";
      case "TARGET_MARKET":
        return "Target Market";
      case "VALUE_PROPOSITION":
        return "Value Proposition";
      case "BUSINESS_MODEL":
        return "Business Model";
      case "MARKETING_STRATEGY":
        return "Marketing Strategy";
      case "OPERATIONS_PLAN":
        return "Operations Plan";
      case "FINANCIAL_PLAN":
        return "Financial Plan";
      default:
        return moduleType.replace("_", " ");
    }
  };

  const getStatusColor = (status: string, isCurrent: boolean) => {
    if (isCurrent) return "bg-blue-500 text-white";
    switch (status) {
      case "completed":
        return "bg-green-500 text-white";
      case "partial":
        return "bg-yellow-500 text-white";
      default:
        return "bg-gray-300 text-gray-600";
    }
  };

  const getStrategyEmoji = (strategy: string) => {
    switch (strategy) {
      case "bucket_building":
        return "🪣";
      case "gap_filling":
        return "🔍";
      case "depth_diving":
        return "🏊‍♂️";
      case "connection_making":
        return "🔗";
      case "validation_seeking":
        return "✅";
      case "expansion_driving":
        return "🚀";
      default:
        return "🤝";
    }
  };

  const getStrategyDescription = (strategy: string) => {
    switch (strategy) {
      case "bucket_building":
        return "Building foundational understanding together";
      case "gap_filling":
        return "Addressing missing pieces";
      case "depth_diving":
        return "Exploring details deeply";
      case "connection_making":
        return "Connecting the dots";
      case "validation_seeking":
        return "Validating our assumptions";
      case "expansion_driving":
        return "Expanding possibilities";
      default:
        return "Collaborative discovery";
    }
  };

  const getProgressPhase = () => {
    if (conversationDepth < 3) return "Getting Started";
    if (conversationDepth < 10) return "Building Understanding";
    if (conversationDepth < 20) return "Refining Ideas";
    return "Finalizing Strategy";
  };

  const completedModules = modules.filter(
    (m) => m.completionStatus === "completed"
  ).length;
  const partialModules = modules.filter(
    (m) => m.completionStatus === "partial"
  ).length;
  const overallProgress =
    modules.length > 0
      ? (completedModules + partialModules * 0.5) / modules.length
      : 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                Collaborative Progress
              </h3>
              <p className="text-sm text-gray-600">
                {getProgressPhase()} • {conversationDepth} exchanges •{" "}
                {totalInsights} insights
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              {Math.round(overallProgress * 100)}%
            </div>
            <div className="text-sm text-gray-500">Complete</div>
          </div>
        </div>

        {/* Current Strategy */}
        <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">
              {getStrategyEmoji(questioningStrategy)}
            </div>
            <div>
              <div className="font-medium text-gray-900">Current Strategy</div>
              <div className="text-sm text-gray-600">
                {getStrategyDescription(questioningStrategy)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="p-6">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {completedModules}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {partialModules}
            </div>
            <div className="text-sm text-gray-600">In Progress</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {Math.round(confidenceLevel * 100)}%
            </div>
            <div className="text-sm text-gray-600">Confidence</div>
          </div>
        </div>

        {/* Module Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-900">Module Progress</h4>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {showDetails ? "Hide Details" : "Show Details"}
            </button>
          </div>

          {modules.map((module, index) => {
            const isCurrent = module.moduleType === currentModule;
            const isNext =
              !isCurrent &&
              index > 0 &&
              modules[index - 1].completionStatus === "completed";

            return (
              <div key={module.moduleType} className="relative">
                <div
                  className={`flex items-center p-3 rounded-lg transition-all ${
                    isCurrent
                      ? "bg-blue-50 ring-2 ring-blue-500"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${getStatusColor(
                        module.completionStatus,
                        isCurrent
                      )}`}
                    >
                      {module.completionStatus === "completed" ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        getModuleIcon(module.moduleType)
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <div className="font-medium text-gray-900">
                          {getModuleTitle(module.moduleType)}
                        </div>
                        {isCurrent && (
                          <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                            <span className="text-xs text-blue-600 font-medium">
                              Current
                            </span>
                          </div>
                        )}
                        {isNext && (
                          <div className="flex items-center space-x-1">
                            <ArrowRight className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">Next</span>
                          </div>
                        )}
                      </div>
                      {showDetails && module.summary && (
                        <p className="text-sm text-gray-600 mt-1">
                          {module.summary}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {module.completionStatus === "completed"
                        ? "100%"
                        : module.completionStatus === "partial"
                        ? "50%"
                        : "0%"}
                    </div>
                    {showDetails && (
                      <div className="text-xs text-gray-500">
                        {new Date(module.lastUpdated).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Collaboration Indicator */}
      <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-purple-50 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <User className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">You</span>
            </div>
            <div className="text-gray-400">+</div>
            <div className="flex items-center space-x-1">
              <Brain className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-600">
                AI Advisor
              </span>
            </div>
            <div className="text-gray-400">=</div>
            <div className="flex items-center space-x-1">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-600">
                Great Ideas
              </span>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Building together, step by step
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollaborativeProgress;
