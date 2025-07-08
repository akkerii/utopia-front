// Modes of operation
export enum Mode {
  ENTREPRENEUR = "entrepreneur",
  CONSULTANT = "consultant",
}

// Available OpenAI models
export enum OpenAIModel {
  GPT_4O = "gpt-4o",
  GPT_4O_MINI = "gpt-4o-mini",
  GPT_4_TURBO = "gpt-4-turbo",
  GPT_4 = "gpt-4",
  GPT_3_5_TURBO = "gpt-3.5-turbo",
}

// Model information interface
export interface ModelInfo {
  id: OpenAIModel;
  name: string;
  description: string;
  isDefault?: boolean;
}

// Available models response
export interface AvailableModelsResponse {
  models: OpenAIModel[];
  defaultModel: OpenAIModel;
  modelDescriptions: Record<string, string>;
}

// AI Agent types
export enum AgentType {
  IDEA = "idea",
  STRATEGY = "strategy",
  FINANCE = "finance",
  OPERATIONS = "operations",
}

// Business modules
export enum ModuleType {
  IDEA_CONCEPT = "idea_concept",
  TARGET_MARKET = "target_market",
  VALUE_PROPOSITION = "value_proposition",
  BUSINESS_MODEL = "business_model",
  MARKETING_STRATEGY = "marketing_strategy",
  OPERATIONS_PLAN = "operations_plan",
  FINANCIAL_PLAN = "financial_plan",
}

// Context bucket for module data
export interface ContextBucket {
  id: string;
  moduleType: ModuleType;
  data: any;
  summary?: string;
  lastUpdated: Date;
  completionStatus: "empty" | "in_progress" | "completed";
}

// Conversation message
export interface ConversationMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  agent?: AgentType;
  module?: ModuleType;
  timestamp: Date;
  // Track which model generated this message
  model?: OpenAIModel;
  // New fields for structured questions
  structuredQuestions?: StructuredQuestion[];
  structuredResponses?: StructuredResponse[];
}

// New interfaces for structured questions and responses
export interface StructuredQuestion {
  id: string;
  question: string;
  type: "text" | "textarea" | "select" | "multiselect" | "buttons";
  options?: string[];
  required?: boolean;
  placeholder?: string;
}

export interface StructuredResponse {
  questionId: string;
  question: string;
  response: string | string[];
}

// Module update info
export interface ModuleUpdate {
  moduleType: ModuleType;
  data: any;
  summary: string;
  completionStatus: "empty" | "in_progress" | "completed";
}

// Chat request interface
export interface ChatRequest {
  message: string;
  sessionId?: string;
  mode?: Mode;
  // New field for structured responses
  structuredResponses?: StructuredResponse[];
  // Add model selection
  model?: OpenAIModel;
}

// Chat response interface
export interface ChatResponse {
  sessionId: string;
  message: string;
  agent: AgentType;
  currentModule?: ModuleType;
  updatedModules?: ModuleUpdate[];
  suggestedNextModule?: ModuleType;
  isModuleTransition?: boolean;
  structuredQuestions?: StructuredQuestion[];
  // Add current model to response
  currentModel?: OpenAIModel;
}

// Session data interface
export interface SessionData {
  sessionId: string;
  mode: Mode;
  currentAgent: AgentType;
  currentModule?: ModuleType;
  modules: {
    moduleType: ModuleType;
    data: any;
    summary?: string;
    completionStatus: "empty" | "in_progress" | "completed";
    lastUpdated: Date;
  }[];
  conversationHistory: ConversationMessage[];
}

// UI State interfaces
export interface ChatState {
  messages: ConversationMessage[];
  isLoading: boolean;
  sessionId?: string;
  mode?: Mode;
  currentAgent?: AgentType;
  currentModule?: ModuleType;
  // Add selected model to state
  selectedModel?: OpenAIModel;
  currentModel?: OpenAIModel;
}

export interface DashboardModule {
  type: ModuleType;
  title: string;
  description: string;
  icon: string;
  status: "empty" | "in_progress" | "completed";
  summary?: string;
  data?: any;
}
