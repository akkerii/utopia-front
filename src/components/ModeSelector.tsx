"use client";

import React, { useState } from "react";
import {
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Target,
  Rocket,
  Brain,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Mode } from "@/types";
import { AnimatedLogo } from "@/components/AnimatedLogo";

interface ModeSelectorProps {
  onModeSelect: (mode: Mode) => void;
}

const FEATURES = {
  entrepreneur: [
    {
      icon: CheckCircle,
      title: "Idea Incubation",
      description: "Transform rough concepts into viable business ideas",
    },
    {
      icon: Target,
      title: "Market Intelligence",
      description: "Identify and understand your perfect customers",
    },
    {
      icon: TrendingUp,
      title: "Growth Blueprint",
      description: "Build scalable business models and strategies",
    },
  ],
  consultant: [
    {
      icon: CheckCircle,
      title: "Deep Diagnosis",
      description: "Uncover root causes of business challenges",
    },
    {
      icon: Target,
      title: "Strategic Solutions",
      description: "Get actionable plans to overcome obstacles",
    },
    {
      icon: TrendingUp,
      title: "Performance Boost",
      description: "Optimize operations and accelerate growth",
    },
  ],
};

const Card = ({
  mode,
  title,
  description,
  icon: Icon,
  features,
  isHovered,
  onHover,
  onSelect,
}: {
  mode: Mode;
  title: string;
  description: string;
  icon: any;
  features: typeof FEATURES.entrepreneur;
  isHovered: boolean;
  onHover: (isHovered: boolean) => void;
  onSelect: () => void;
}) => (
  <div
    className={`relative group ${isHovered ? "z-20" : "z-10"}`}
    onMouseEnter={() => onHover(true)}
    onMouseLeave={() => onHover(false)}
  >
    <div className="h-full bg-white rounded-2xl p-6 sm:p-8 transition-all duration-200 border border-gray-200 hover:border-blue-200 hover:shadow-lg">
      <div className="flex flex-col h-full">
        {/* Header Section */}
        <div className="flex-none">
          <div className="mb-6 sm:mb-8">
            <div className="relative inline-block">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-tr from-blue-600 to-blue-700 rounded-xl flex items-center justify-center transform transition-transform group-hover:scale-105">
                <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="absolute inset-0 bg-blue-600 rounded-xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity" />
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
            {title}
          </h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Features Section */}
        <div className="flex-1 my-6 sm:my-8">
          <div className="space-y-3 sm:space-y-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="relative flex-shrink-0 mt-1">
                  <feature.icon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 text-sm sm:text-base">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-gray-600 mt-0.5">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Section */}
        <div className="flex-none">
          <button
            onClick={onSelect}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-xl transition-all duration-200 group/btn flex items-center justify-center"
          >
            <span className="text-base sm:text-lg font-medium flex items-center">
              {mode === Mode.ENTREPRENEUR ? (
                <>
                  Launch My Startup
                  <Rocket className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </>
              ) : (
                <>
                  Solve My Challenge
                  <Brain className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </>
              )}
            </span>
          </button>

          {/* Badge */}
          <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3">
            <div className="px-3 py-1 sm:px-4 sm:py-1.5 bg-blue-600 text-white text-xs sm:text-sm font-medium rounded-full shadow-md flex items-center">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              {mode === Mode.ENTREPRENEUR ? "POPULAR" : "PRO"}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ModeSelector: React.FC<ModeSelectorProps> = ({ onModeSelect }) => {
  const [hoveredMode, setHoveredMode] = useState<Mode | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10 sm:mb-16">
            <div className="inline-flex items-center justify-center px-3 py-1 mb-6 sm:mb-8 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
              <Sparkles className="w-4 h-4 mr-1.5" />
              Powered by AI
            </div>
           
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Select the mode that best fits your needs and let our AI guide you
            </p>
          </div>

          {/* Mode Selection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
            <Card
              mode={Mode.ENTREPRENEUR}
              title="Entrepreneur Mode"
              description="Transform your spark of inspiration into a thriving business. Our AI guides you through every step of your entrepreneurial journey."
              icon={Rocket}
              features={FEATURES.entrepreneur}
              isHovered={hoveredMode === Mode.ENTREPRENEUR}
              onHover={(isHovered) =>
                setHoveredMode(isHovered ? Mode.ENTREPRENEUR : null)
              }
              onSelect={() => onModeSelect(Mode.ENTREPRENEUR)}
            />

            <Card
              mode={Mode.CONSULTANT}
              title="Consultant Mode"
              description="Overcome challenges and unlock growth. Our AI consultant provides expert strategies tailored to your business needs."
              icon={Brain}
              features={FEATURES.consultant}
              isHovered={hoveredMode === Mode.CONSULTANT}
              onHover={(isHovered) =>
                setHoveredMode(isHovered ? Mode.CONSULTANT : null)
              }
              onSelect={() => onModeSelect(Mode.CONSULTANT)}
            />
          </div>

          {/* Footer */}
        
        </div>
      </div>
    </div>
  );
};

export default ModeSelector;
