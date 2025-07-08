"use client";

import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import {
  ConversationMessage,
  StructuredQuestion,
  StructuredResponse,
  AgentType,
  ModuleType,
  SessionData,
  OpenAIModel,
} from "@/types";
import { getModuleTitle, getAgentColor } from "@/lib/modules";
import { AnimatedLogo } from "./AnimatedLogo";
import ClientDate from "./ClientDate";
import ModelSelector from "./ModelSelector";
import {
  Send,
  Loader2,
  CheckCircle,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Bot,
  ArrowRight,
  Sparkles,
  Settings,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const ChatContext = React.createContext<{
  onSendMessage?: (
    message: string,
    structuredResponses?: StructuredResponse[],
    model?: OpenAIModel
  ) => void;
}>({});

interface ChatInterfaceProps {
  messages: ConversationMessage[];
  isLoading: boolean;
  onSendMessage: (
    message: string,
    structuredResponses?: StructuredResponse[],
    model?: OpenAIModel
  ) => void;
  currentAgent?: AgentType;
  currentModule?: ModuleType;
  sessionData?: SessionData;
  selectedModel?: OpenAIModel;
  currentModel?: OpenAIModel;
  onModelSelect: (model: OpenAIModel) => void;
}

const StructuredQuestionRenderer: React.FC<{
  questions: StructuredQuestion[];
  onSubmit: (responses: StructuredResponse[]) => void;
  isLoading?: boolean;
}> = ({ questions, onSubmit, isLoading }) => {
  const [responses, setResponses] = useState<Record<string, string | string[]>>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);

  const handleInputChange = (questionId: string, value: string | string[]) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }));
    setActiveQuestion(questionId);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const structuredResponses: StructuredResponse[] = questions.map((q) => ({
      questionId: q.id,
      question: q.question,
      response: responses[q.id] || "",
    }));

    try {
      await onSubmit(structuredResponses);
      setResponses({});
    } catch (error) {
      console.error("Failed to submit structured responses:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const allRequiredAnswered = questions.every(
    (q) => !q.required || (responses[q.id] && responses[q.id] !== "")
  );

  const answeredCount = Object.values(responses).filter(
    (r) => r && r !== ""
  ).length;

  const renderInput = (question: StructuredQuestion) => {
    const value = responses[question.id] || "";
    const isActive = activeQuestion === question.id;

    switch (question.type) {
      case "textarea":
        return (
          <div className="relative">
            <textarea
              value={value as string}
              onChange={(e) => handleInputChange(question.id, e.target.value)}
              onFocus={() => setActiveQuestion(question.id)}
              placeholder={question.placeholder}
              rows={3}
              className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 resize-none ${
                isActive
                  ? "border-blue-500 ring-2 ring-blue-100"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              disabled={isSubmitting}
            />
            {value && (
              <div className="absolute right-3 top-3 text-green-500">
                <CheckCircle className="w-4 h-4" />
              </div>
            )}
          </div>
        );

      case "buttons":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {question.options?.map((option) => {
                const isSelected = value === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleInputChange(question.id, option)}
                    disabled={isSubmitting}
                    className={`group relative px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border ${
                      isSelected
                        ? "bg-blue-600 text-white border-blue-600 shadow-md transform scale-[1.02]"
                        : "bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option}</span>
                      <div
                        className={`transition-all duration-200 ${
                          isSelected
                            ? "opacity-100"
                            : "opacity-0 group-hover:opacity-50"
                        }`}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="relative">
              <input
                type="text"
                value={
                  typeof value === "string" &&
                  !question.options?.includes(value)
                    ? value
                    : ""
                }
                onChange={(e) => handleInputChange(question.id, e.target.value)}
                onFocus={() => setActiveQuestion(question.id)}
                placeholder="Or describe your specific situation..."
                className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 ${
                  isActive
                    ? "border-blue-500 ring-2 ring-blue-100"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                disabled={isSubmitting}
              />
              {typeof value === "string" &&
                !question.options?.includes(value) &&
                value.trim() && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                )}
            </div>
          </div>
        );

      default:
        return (
          <div className="relative">
            <input
              type="text"
              value={value as string}
              onChange={(e) => handleInputChange(question.id, e.target.value)}
              onFocus={() => setActiveQuestion(question.id)}
              placeholder={question.placeholder}
              className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 ${
                isActive
                  ? "border-blue-500 ring-2 ring-blue-100"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              disabled={isSubmitting}
            />
            {value && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
                <CheckCircle className="w-4 h-4" />
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="bg-white">
      <div
        className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsMinimized(!isMinimized)}
      >
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <MessageSquare className="w-3 h-3 text-white" />
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-gray-900">
              Quick Questions
            </span>
            <div className="flex items-center space-x-2">
              <div className="h-1 w-16 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-500"
                  style={{
                    width: `${(answeredCount / questions.length) * 100}%`,
                  }}
                />
              </div>
              <span className="text-xs text-gray-500">
                {answeredCount}/{questions.length}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {answeredCount === questions.length && (
            <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">
              Ready
            </span>
          )}
          {isMinimized ? (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </div>

      <div
        className={`transition-all duration-300 ease-in-out ${
          isMinimized
            ? "max-h-0 overflow-hidden"
            : "max-h-[400px] overflow-y-auto"
        }`}
      >
        <div className="px-4 py-3 space-y-4 overflow-y-auto">
          {questions.map((question, index) => (
            <div
              key={question.id}
              className={`space-y-2 transition-all duration-300 ${
                activeQuestion === question.id ? "transform scale-[1.02]" : ""
              }`}
            >
              <label className="block text-sm font-medium text-gray-900">
                {index + 1}. {question.question}
                {question.required && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </label>
              {renderInput(question)}
            </div>
          ))}

          <div className="flex justify-end pt-2">
            <button
              onClick={handleSubmit}
              disabled={!allRequiredAnswered || isSubmitting || isLoading}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                !allRequiredAnswered || isSubmitting || isLoading
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-[1.02] active:scale-[0.98]"
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const TypingIndicator = () => (
  <div className="flex justify-start mb-4 chat-message">
    <div className="flex items-start space-x-3">
      <div className="flex-shrink-0">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center shadow-inner border border-blue-500/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0,rgba(255,255,255,0.15),transparent)]" />
          <Bot className="w-4 h-4 text-white relative z-10" />
        </div>
      </div>
      <div className="px-4 py-2.5 bg-white rounded-2xl border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex items-center">
        <div className="flex space-x-1">
          <div
            className="w-1.5 h-1.5 bg-blue-500/40 rounded-full animate-pulse"
            style={{ animationDelay: "0ms" }}
          />
          <div
            className="w-1.5 h-1.5 bg-blue-500/40 rounded-full animate-pulse"
            style={{ animationDelay: "150ms" }}
          />
          <div
            className="w-1.5 h-1.5 bg-blue-500/40 rounded-full animate-pulse"
            style={{ animationDelay: "300ms" }}
          />
        </div>
        <span className="ml-2 text-sm text-gray-500">Thinking...</span>
      </div>
    </div>
  </div>
);

const MessageBubble: React.FC<{
  message: ConversationMessage;
  isLastMessage: boolean;
  onSendMessage?: (
    message: string,
    structuredResponses?: StructuredResponse[],
    model?: OpenAIModel
  ) => void;
  selectedModel?: OpenAIModel;
}> = ({ message, isLastMessage, onSendMessage, selectedModel }) => {
  const isUser = message.role === "user";
  const bubbleClass = isUser
    ? "bg-blue-600 text-white"
    : "bg-white border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)]";
  const wrapperClass = isUser ? "justify-end" : "justify-start";

  // Special rendering for user's structured responses
  if (isUser && message.structuredResponses) {
    return (
      <div className={`flex ${wrapperClass} space-x-2 chat-message`}>
        <div className="max-w-[85%] md:max-w-[75%] space-y-1">
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
            <p className="text-sm font-medium text-blue-700 mb-2">
              You submitted the following answers:
            </p>
            <div className="space-y-2">
              {message.structuredResponses.map((r) => (
                <div key={r.questionId}>
                  <p className="text-xs text-blue-600/80">{r.question}</p>
                  <p className="text-sm text-blue-900 font-medium">
                    {r.response}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center text-xs text-gray-400 justify-end">
            <ClientDate date={message.timestamp} />
            {message.model && (
              <>
                <span className="mx-1">•</span>
                <span className="font-medium text-gray-500">
                  {message.model.replace("gpt-", "GPT-")}
                </span>
              </>
            )}
          </div>
        </div>
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
    );
  }

  // Hide placeholder message bubbles
  if (isUser && !message.content && !message.structuredResponses) {
    return null;
  }

  return (
    <div className={`flex ${wrapperClass} space-x-2 chat-message`}>
      {!isUser && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center shadow-inner border border-blue-500/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0,rgba(255,255,255,0.15),transparent)]" />
            <Bot className="w-4 h-4 text-white relative z-10" />
          </div>
        </div>
      )}
      <div className="max-w-[85%] md:max-w-[75%] space-y-1">
        <div
          className={`rounded px-4 py-2 ${bubbleClass} ${
            isLastMessage && "animate-fade-in"
          }`}
        >
          {message.structuredResponses ? (
            <div className="space-y-2">
              {message.structuredResponses.map((r) => (
                <div key={r.questionId} className="bg-gray-100 rounded-md p-2">
                  <div className="font-medium text-gray-800 mb-1">
                    {r.question}
                  </div>
                  <div className="text-gray-700">{r.response}</div>
                </div>
              ))}
            </div>
          ) : message.content ? (
            <div className="prose prose-sm max-w-none text-gray-800">
              <ReactMarkdown>
                {message.content
                  .replace(
                    /\[STRUCTURED_QUESTIONS\][\s\S]*?\[\/STRUCTURED_QUESTIONS\]/g,
                    ""
                  )
                  .replace(/\(textarea\)/gi, "")
                  .replace(/\(buttons:\s*[^)]*\)/gi, "")
                  .replace(/\d+\.\s*[^(]*\([^)]*\)/g, "")
                  .replace(/^\s*\n/gm, "")
                  .trim()}
              </ReactMarkdown>
            </div>
          ) : null}
        </div>

        {/* Render structured questions inline if assistant message */}
        {!isUser &&
          message.structuredQuestions &&
          message.structuredQuestions.length > 0 && (
            <div className="mt-3">
              <StructuredQuestionRenderer
                questions={message.structuredQuestions}
                onSubmit={(responses) => {
                  if (onSendMessage) {
                    onSendMessage(
                      "User has submitted structured responses.",
                      responses,
                      selectedModel
                    );
                  }
                }}
                isLoading={false}
              />
            </div>
          )}
        <div
          className={`flex items-center text-xs text-gray-400 ${
            isUser ? "justify-end" : "justify-start"
          }`}
        >
          <ClientDate date={message.timestamp} />
          {isUser && message.model && (
            <>
              <span className="mx-1">•</span>
              <span className="font-medium text-gray-500">
                {message.model.replace("gpt-", "GPT-")}
              </span>
            </>
          )}
        </div>
      </div>
      {isUser && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-white" />
          </div>
        </div>
      )}
    </div>
  );
};

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  isLoading,
  onSendMessage,
  currentAgent,
  currentModule,
  sessionData,
  selectedModel,
  currentModel,
  onModelSelect,
}) => {
  const [inputMessage, setInputMessage] = useState("");
  const [pendingStructuredQuestions, setPendingStructuredQuestions] = useState<
    StructuredQuestion[] | null
  >(null);
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [modelDisplayKey, setModelDisplayKey] = useState(0);
  const [showModuleOverview, setShowModuleOverview] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Debug logging for model props
  useEffect(() => {
    console.log("🎯 ChatInterface model props updated:", {
      selectedModel,
      currentModel,
      timestamp: new Date().toISOString(),
    });
    // Force re-render of model display when selectedModel changes
    setModelDisplayKey((prev) => prev + 1);
  }, [selectedModel, currentModel]);

  // Get the display model (prioritize selectedModel)
  const displayModel = selectedModel || currentModel || "gpt-4o";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    // Structured questions are now rendered inline within messages
    // No need to track pending questions separately
    setPendingStructuredQuestions(null);
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() && !isLoading) {
      onSendMessage(inputMessage.trim(), undefined, selectedModel);
      setInputMessage("");
    }
  };

  const handleStructuredResponseSubmit = (responses: StructuredResponse[]) => {
    // Send a placeholder message to satisfy backend validation
    onSendMessage(
      "User has submitted structured responses.",
      responses,
      selectedModel
    );
    setPendingStructuredQuestions(null);
  };

  const getAgentName = (agent?: AgentType): string => {
    if (!agent) return "AI Assistant";
    return `${agent.charAt(0).toUpperCase() + agent.slice(1)} Agent`;
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Always visible header with model selection */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-gray-900">
                {currentModule
                  ? getModuleTitle(currentModule)
                  : "Utopia AI Assistant"}
              </h1>
              <p className="text-sm text-gray-600">
                {currentAgent && getAgentName(currentAgent)}
                {/* Always show the active model prominently - prioritize selectedModel */}
                {(currentAgent || selectedModel || currentModel) && (
                  <span className="text-gray-400"> • </span>
                )}
                <span
                  key={`model-display-${modelDisplayKey}`}
                  className="text-blue-600 font-semibold bg-blue-50 px-2 py-1 rounded-md border border-blue-200"
                >
                  🤖 {displayModel.replace("gpt-", "GPT-").toUpperCase()}
                </span>
              </p>
            </div>
          </div>

          {/* Always visible model selector */}
          <div className="flex items-center space-x-3">
            {/* Module overview toggle */}
            {sessionData &&
              currentModule &&
              (() => {
                const mod = sessionData.modules.find(
                  (m) => m.moduleType === currentModule
                );
                const hasContent =
                  (mod?.summary && mod.summary.trim() !== "") ||
                  (mod?.data && Object.keys(mod.data).length > 0);

                if (!hasContent) return null;

                return (
                  <button
                    onClick={() => setShowModuleOverview(!showModuleOverview)}
                    className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                    title={
                      showModuleOverview
                        ? "Hide module overview"
                        : "Show module overview"
                    }
                  >
                    {showModuleOverview ? (
                      <>
                        <ChevronUp className="w-4 h-4" />
                        <span className="text-sm font-medium hidden md:inline">
                          Hide Overview
                        </span>
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4" />
                        <span className="text-sm font-medium hidden md:inline">
                          Show Overview
                        </span>
                      </>
                    )}
                  </button>
                );
              })()}

            <div className="hidden md:block">
              <ModelSelector
                selectedModel={selectedModel}
                currentModel={currentModel}
                onModelSelect={onModelSelect}
                disabled={isLoading}
              />
            </div>

            {/* Mobile model selector toggle */}
            <button
              onClick={() => setShowModelSelector(!showModelSelector)}
              className="md:hidden flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
            >
              <Zap className="w-4 h-4" />
              <span className="text-sm font-medium">
                {displayModel.replace("gpt-", "GPT-")}
              </span>
              {showModelSelector ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Model change notification banner */}
        {selectedModel && selectedModel !== currentModel && (
          <div className="mt-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center">
                  <Zap className="w-3 h-3 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-amber-800">
                    Model Change Pending
                  </p>
                  <p className="text-xs text-amber-600">
                    Switching from{" "}
                    <span className="font-semibold">
                      {(currentModel || "gpt-4o").replace("gpt-", "GPT-")}
                    </span>{" "}
                    to{" "}
                    <span className="font-semibold text-amber-700">
                      {selectedModel.replace("gpt-", "GPT-")}
                    </span>{" "}
                    on next message
                  </p>
                </div>
              </div>
              <button
                onClick={() =>
                  onModelSelect(currentModel || ("gpt-4o" as OpenAIModel))
                }
                className="text-amber-600 hover:text-amber-700 text-xs font-medium px-2 py-1 rounded hover:bg-amber-100 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Mobile model selector panel */}
        {showModelSelector && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-200">
            <div className="max-w-md">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Choose AI Model
              </label>
              <ModelSelector
                selectedModel={selectedModel}
                currentModel={currentModel}
                onModelSelect={(model) => {
                  onModelSelect(model);
                  setShowModelSelector(false);
                }}
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500 mt-2">
                Changes take effect on your next message
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Module summary panel */}
      {showModuleOverview &&
        sessionData &&
        currentModule &&
        (() => {
          const mod = sessionData.modules.find(
            (m) => m.moduleType === currentModule
          );
          if (!mod) return null;
          const hasContent =
            (mod.summary && mod.summary.trim() !== "") ||
            (mod.data && Object.keys(mod.data).length > 0);
          if (!hasContent) return null;

          return (
            <div className="bg-gradient-to-br from-white to-gray-50/30 border-b border-gray-200 shadow-sm animate-in slide-in-from-top duration-200">
              <div className="px-6 py-5 max-h-[500px] overflow-y-auto">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <h2 className="text-base font-semibold text-gray-900">
                    {getModuleTitle(currentModule)} Overview
                  </h2>
                  {mod.data?.generated_at && (
                    <span className="text-xs text-gray-500 bg-green-100 px-2 py-1 rounded-full">
                      AI Generated
                    </span>
                  )}
                  <div className="flex-1"></div>
                  <button
                    onClick={() => setShowModuleOverview(false)}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    title="Hide overview"
                  >
                    <ChevronUp className="w-4 h-4 text-gray-500" />
                  </button>
                </div>

                {/* Show full content if available, otherwise summary, otherwise data */}
                {mod.data?.full_content ? (
                  <div className="space-y-4">
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                      <div className="prose prose-sm max-w-none text-gray-800">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeRaw]}
                        >
                          {mod.data.full_content}
                        </ReactMarkdown>
                      </div>
                    </div>
                    {mod.summary && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-blue-900 mb-2">
                          Quick Summary
                        </h3>
                        <div className="prose prose-sm max-w-none text-blue-800 prose-p:text-blue-800 prose-strong:text-blue-900">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeRaw]}
                          >
                            {mod.summary}
                          </ReactMarkdown>
                        </div>
                      </div>
                    )}
                  </div>
                ) : mod.summary ? (
                  <div className="space-y-4">
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                      <div className="prose prose-base max-w-none text-gray-800">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeRaw]}
                        >
                          {mod.summary}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          );
        })()}

      {/* Messages container with enhanced styling */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#fcfcfc]">
        {messages.length === 0 ? (
          <div className="text-center py-16 fade-in">
            <div className="group">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-inner group-hover:shadow-lg transition-all duration-300 border border-blue-500/20 relative overflow-hidden mb-8">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0,rgba(255,255,255,0.15),transparent)] group-hover:translate-y-[-25%] transition-transform duration-700" />
                <Bot className="w-12 h-12 text-white relative z-10" />
              </div>
            </div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-3">
              Welcome to Utopia AI
            </h2>
            <p className="text-sm text-slate-500 max-w-lg mx-auto">
              I'm here to help you build your business plan. What would you like
              to explore?
            </p>
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <MessageBubble
                key={
                  typeof message.timestamp === "string"
                    ? message.timestamp
                    : new Date(message.timestamp).toISOString()
                }
                message={message}
                isLastMessage={index === messages.length - 1}
                onSendMessage={onSendMessage}
                selectedModel={selectedModel}
              />
            ))}
            {isLoading && <TypingIndicator />}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Structured questions section */}
      {pendingStructuredQuestions && false && (
        <div className="border-t border-gray-100">
          <div className="max-w-4xl mx-auto">
            <StructuredQuestionRenderer
              questions={pendingStructuredQuestions || []}
              onSubmit={handleStructuredResponseSubmit}
              isLoading={isLoading}
            />
          </div>
        </div>
      )}

      {/* Enhanced input area */}
      <div className="border-t border-gray-100 bg-white p-4">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="relative flex items-center">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 pr-12 transition-all duration-200"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className={`absolute right-2 p-2 rounded ${
                !inputMessage.trim() || isLoading
                  ? "text-gray-400"
                  : "text-blue-600 hover:bg-blue-50"
              } transition-colors duration-200`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
