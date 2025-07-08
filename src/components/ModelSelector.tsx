"use client";

import React, { useState, useEffect, useRef } from "react";
import { OpenAIModel, ModelInfo, AvailableModelsResponse } from "@/types";
import { chatApi } from "@/lib/api";
import {
  ChevronDown,
  ChevronUp,
  Bot,
  Zap,
  Crown,
  Gauge,
  DollarSign,
  Check,
  Loader2,
} from "lucide-react";

interface ModelSelectorProps {
  selectedModel?: OpenAIModel;
  currentModel?: OpenAIModel;
  onModelSelect: (model: OpenAIModel) => void;
  disabled?: boolean;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedModel,
  currentModel,
  onModelSelect,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get model info with enhanced descriptions and icons
  const getModelInfo = (
    modelId: OpenAIModel,
    description: string,
    isDefault: boolean = false
  ): ModelInfo => {
    const modelInfoMap: Record<
      OpenAIModel,
      Omit<ModelInfo, "id" | "description" | "isDefault">
    > = {
      [OpenAIModel.GPT_4O]: {
        name: "GPT-4o",
      },
      [OpenAIModel.GPT_4O_MINI]: {
        name: "GPT-4o mini",
      },
      [OpenAIModel.GPT_4_TURBO]: {
        name: "GPT-4 Turbo",
      },
      [OpenAIModel.GPT_4]: {
        name: "GPT-4",
      },
      [OpenAIModel.GPT_3_5_TURBO]: {
        name: "GPT-3.5 Turbo",
      },
    };

    return {
      id: modelId,
      ...modelInfoMap[modelId],
      description,
      isDefault,
    };
  };

  // Minimal model icon designs
  const getModelIcon = (modelId: OpenAIModel) => {
    const iconClasses = "w-4 h-4 flex-shrink-0";
    switch (modelId) {
      case OpenAIModel.GPT_4O:
        return <Crown className={`${iconClasses} text-gray-600`} />;
      case OpenAIModel.GPT_4_TURBO:
        return <Zap className={`${iconClasses} text-gray-600`} />;
      case OpenAIModel.GPT_4:
        return <Bot className={`${iconClasses} text-gray-600`} />;
      case OpenAIModel.GPT_4O_MINI:
        return <Gauge className={`${iconClasses} text-gray-600`} />;
      case OpenAIModel.GPT_3_5_TURBO:
        return <Bot className={`${iconClasses} text-gray-600`} />;
      default:
        return <Bot className={`${iconClasses} text-gray-600`} />;
    }
  };

  // Modern badge styling
  const getModelBadge = (modelId: OpenAIModel) => {
    switch (modelId) {
      case OpenAIModel.GPT_4O:
        return "text-purple-600";
      case OpenAIModel.GPT_4_TURBO:
        return "text-blue-600";
      case OpenAIModel.GPT_4:
        return "text-green-600";
      case OpenAIModel.GPT_4O_MINI:
        return "text-orange-600";
      case OpenAIModel.GPT_3_5_TURBO:
        return "text-gray-600";
      default:
        return "text-gray-600";
    }
  };

  // Load available models
  useEffect(() => {
    const loadModels = async () => {
      try {
        setLoading(true);
        const response: AvailableModelsResponse = await chatApi.getModels();

        const modelInfos = response.models.map((modelId) =>
          getModelInfo(
            modelId,
            response.modelDescriptions[modelId] || "AI model",
            modelId === response.defaultModel
          )
        );

        setModels(modelInfos);
        setError(null);
      } catch (err) {
        console.error("Failed to load models:", err);
        setError("Failed to load models");
      } finally {
        setLoading(false);
      }
    };

    loadModels();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeModel = selectedModel || currentModel;
  const activeModelInfo = models.find((m) => m.id === activeModel);

  const handleModelSelect = (model: OpenAIModel) => {
    onModelSelect(model);
    setIsOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center space-x-2 px-3 py-2.5 min-h-[36px]">
        <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
        <span className="text-sm text-gray-400">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center space-x-2 px-3 py-2.5 text-gray-400 min-h-[36px]">
        <Bot className="w-4 h-4" />
        <span className="text-sm">Error loading models</span>
      </div>
    );
  }

  return (
    <div className="relative select-none" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`flex items-center justify-between w-full px-3 py-2.5 bg-white transition-colors duration-150 min-h-[36px] ${
          isOpen ? "bg-gray-50" : "hover:bg-gray-50"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <div className="flex items-center min-w-0">
          <div className="flex items-center space-x-2 flex-shrink-0">
            {activeModelInfo && getModelIcon(activeModelInfo.id)}
            <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
              {activeModelInfo?.name || "Select Model"}
            </span>
          </div>
          {currentModel && currentModel === activeModel && (
            <span className="text-xs text-gray-400 ml-2 truncate">Active</span>
          )}
        </div>
        {!disabled && (
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform duration-150 ml-2 flex-shrink-0 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        )}
      </button>

      {isOpen && !disabled && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 shadow-sm z-50 overflow-hidden rounded-sm max-h-[280px] overflow-y-auto">
          <div className="py-1">
            {models.map((model, index) => (
              <button
                key={model.id}
                onClick={() => handleModelSelect(model.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 hover:bg-gray-50 text-left ${
                  index !== models.length - 1 ? "border-b border-gray-50" : ""
                }`}
              >
                <div className="flex items-center min-w-0 flex-1">
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    {getModelIcon(model.id)}
                    <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                      {model.name}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 ml-2 text-xs text-gray-400 truncate">
                    {model.isDefault && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                        <span>Default</span>
                      </>
                    )}
                    {currentModel === model.id && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                        <span>Active</span>
                      </>
                    )}
                  </div>
                </div>
                {selectedModel === model.id && (
                  <Check className="w-4 h-4 text-gray-600 ml-2 flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
          <div className="px-3 py-2 bg-gray-50 border-t border-gray-100">
            <p className="text-xs text-gray-400 text-center">
              Model preferences are saved per session
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelSelector;
