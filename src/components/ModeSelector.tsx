import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Target,
  Rocket,
  Brain,
  Sparkles,
  Star,
  Zap,
  Globe,
  Users,
  BarChart3,
  Lightbulb,
  Shield,
  Crown,
  ArrowUpRight,
  Play,
  ChevronRight,
  Award,
  Briefcase,
  LineChart,
  Building2,
  Layers,
  Calculator,
} from "lucide-react";
import { Mode } from "@/types";

interface ModeSelectorProps {
  onModeSelect: (mode: Mode) => void;
}

const FEATURES = {
  entrepreneur: [
    {
      icon: Lightbulb,
      title: "AI-Powered Ideation",
      description:
        "Advanced algorithms analyze market opportunities and validate concepts",
      stat: "96% Success Rate",
    },
    {
      icon: LineChart,
      title: "Predictive Analytics",
      description:
        "Machine learning models forecast market trends and customer behavior",
      stat: "87% Accuracy",
    },
    {
      icon: Building2,
      title: "Business Architecture",
      description:
        "Automated framework generation for scalable business models",
      stat: "10x Faster",
    },
  ],
  consultant: [
    {
      icon: Brain,
      title: "Deep Analysis Engine",
      description:
        "AI diagnostics identify bottlenecks and optimization opportunities",
      stat: "99.2% Precision",
    },
    {
      icon: Shield,
      title: "Strategic Intelligence",
      description:
        "Enterprise-grade algorithms deliver actionable strategic insights",
      stat: "500+ Companies",
    },
    {
      icon: Calculator,
      title: "Performance Optimization",
      description:
        "Advanced metrics and KPI tracking with automated recommendations",
      stat: "40% Avg. Growth",
    },
  ],
};

const TrustIndicators = () => (
  <div className="flex items-center justify-center space-x-8 mb-8 text-slate-600">
    <div className="flex items-center space-x-2">
      <Shield className="w-5 h-5 text-blue-600" />
      <span className="text-sm font-medium">Enterprise Security</span>
    </div>
    <div className="flex items-center space-x-2">
      <Award className="w-5 h-5 text-blue-600" />
      <span className="text-sm font-medium">ISO 27001 Certified</span>
    </div>
    <div className="flex items-center space-x-2">
      <Users className="w-5 h-5 text-blue-600" />
      <span className="text-sm font-medium">10K+ Businesses</span>
    </div>
  </div>
);

const Card = ({
  mode,
  title,
  description,
  icon: Icon,
  features,
  isHovered,
  onHover,
  onSelect,
  index,
}: {
  mode: Mode;
  title: string;
  description: string;
  icon: any;
  features: typeof FEATURES.entrepreneur;
  isHovered: boolean;
  onHover: (isHovered: boolean) => void;
  onSelect: () => void;
  index: number;
}) => (
  <div
    className={`relative group transition-all duration-500 ease-out h-full cursor-pointer ${
      isHovered ? "z-20 scale-[1.02]" : "z-10 scale-100"
    }`}
    onMouseEnter={() => onHover(true)}
    onMouseLeave={() => onHover(false)}
    onClick={onSelect}
  >
    {/* Professional glow effect */}
    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-indigo-600/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />

    {/* Main card container */}
    <div className="relative h-full bg-white rounded-2xl border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.08)] group-hover:shadow-[0_8px_40px_rgba(0,0,0,0.12)] group-hover:border-blue-200/60 transition-all duration-500 overflow-hidden">
      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

      <div className="relative h-full p-8 flex flex-col">
        {/* Header Section */}
        <div className="flex-none">
          <div className="flex items-start justify-between mb-6">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-50 rounded-xl flex items-center justify-center shadow-inner group-hover:shadow-lg transition-all duration-300 border border-slate-200/50">
                <Icon className="w-8 h-8 text-slate-700 group-hover:text-blue-600 transition-colors duration-300" />
              </div>
            </div>

            {/* Professional badge */}
            <div className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full border border-slate-200/50 uppercase tracking-wide">
              {mode === Mode.ENTREPRENEUR ? "GROWTH" : "ENTERPRISE"}
            </div>
          </div>

          <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-3 group-hover:text-blue-900 transition-colors duration-300">
            {title}
          </h2>
          <p className="text-slate-600 text-base leading-relaxed mb-6">
            {description}
          </p>
        </div>

        {/* Features Section */}
        <div className="flex-1 space-y-4 mb-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group/feature p-4 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-all duration-300 border border-slate-200/30 hover:border-slate-200/60"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm border border-slate-200/50 group-hover/feature:border-blue-200/60 group-hover/feature:bg-blue-50/50 transition-all duration-300">
                    <feature.icon className="w-5 h-5 text-slate-600 group-hover/feature:text-blue-600 transition-colors duration-300" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-slate-900 text-sm">
                      {feature.title}
                    </h4>
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                      {feature.stat}
                    </span>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Professional CTA */}
        <div className="flex-none">
          <button className="relative w-full group/btn bg-slate-900 hover:bg-slate-800 text-white py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:translate-y-[-1px] font-semibold text-base">
            <div className="flex items-center justify-center space-x-3">
              <span>
                {mode === Mode.ENTREPRENEUR
                  ? "Launch Business Intelligence"
                  : "Access Strategic Insights"}
              </span>
              <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-300" />
            </div>
          </button>
        </div>

        {/* Subtle power indicator */}
        <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="flex items-center space-x-1 text-xs text-slate-400">
            <Zap className="w-3 h-3" />
            <span>AI-Powered</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ModeSelector: React.FC<ModeSelectorProps> = ({ onModeSelect }) => {
  const [hoveredMode, setHoveredMode] = useState<Mode | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/50 relative">
      {/* Subtle professional background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_200px,rgba(59,130,246,0.03),transparent)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* Content */}
      <div className="relative min-h-screen flex items-center justify-center">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Professional Header */}
          <div
            className={`text-center mb-12 transition-all duration-1000 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {/* Company credibility */}
            <div className="inline-flex items-center justify-center px-4 py-2 mb-6 bg-white rounded-full shadow-sm border border-slate-200/80 text-slate-700 text-sm font-medium">
              <Brain className="w-4 h-4 mr-2 text-blue-600" />
              Utopia AI Agent Platform
            </div>

            {/* Trust indicators */}
            <TrustIndicators />
          </div>

          {/* Mode Selection Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div
              className={`transition-all duration-700 ${
                isLoaded
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <Card
                mode={Mode.ENTREPRENEUR}
                title="Entrepreneur Intelligence"
                description="Advanced AI system designed to accelerate startup growth and market entry. Deploy machine learning models for business optimization and strategic planning."
                icon={Rocket}
                features={FEATURES.entrepreneur}
                isHovered={hoveredMode === Mode.ENTREPRENEUR}
                onHover={(isHovered) =>
                  setHoveredMode(isHovered ? Mode.ENTREPRENEUR : null)
                }
                onSelect={() => onModeSelect(Mode.ENTREPRENEUR)}
                index={0}
              />
            </div>

            <div
              className={`transition-all duration-700 ${
                isLoaded
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: "100ms" }}
            >
              <Card
                mode={Mode.CONSULTANT}
                title="Strategic Consultant AI"
                description="Enterprise-grade AI consultant providing deep business analysis and strategic recommendations. Leverage advanced algorithms for competitive advantage."
                icon={Briefcase}
                features={FEATURES.consultant}
                isHovered={hoveredMode === Mode.CONSULTANT}
                onHover={(isHovered) =>
                  setHoveredMode(isHovered ? Mode.CONSULTANT : null)
                }
                onSelect={() => onModeSelect(Mode.CONSULTANT)}
                index={1}
              />
            </div>
          </div>

          {/* Professional footer note */}
          <div className="text-center mt-12 text-slate-500 text-sm">
            <p>
              Powered by advanced machine learning • SOC 2 Type II Compliant •
              99.9% Uptime SLA
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModeSelector;
