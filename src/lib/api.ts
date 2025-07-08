import axios from "axios";
import {
  ChatRequest,
  ChatResponse,
  SessionData,
  AvailableModelsResponse,
} from "@/types";

// Use localhost for development, allow override via env var
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

// Ensure the URL is using HTTPS and no double slashes
const ensureValidUrl = (url: string) => {
  // First ensure HTTPS
  let validUrl = url.startsWith("http://")
    ? url.replace("http://", "http://")
    : url;
  // Remove any double slashes (except after protocol)
  validUrl = validUrl.replace(/([^:]\/)\/+/g, "$1");
  return validUrl;
};

const api = axios.create({
  baseURL: ensureValidUrl(API_BASE_URL),
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "ngrok-skip-browser-warning": "true",
  },
  timeout: 300000, // 300 second timeout for AI responses (5 minutes)
});

// Add request/response interceptors for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log the full error for debugging
    console.error("API Error Details:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: {
        url: error.config?.url,
        method: error.config?.method,
      },
    });

    if (error.code === "ECONNABORTED" && error.message.includes("timeout")) {
      throw new Error(
        "The AI is taking longer than usual to respond. Please try again."
      );
    }

    if (
      error.code === "NETWORK_ERROR" ||
      error.message?.includes("Mixed Content")
    ) {
      throw new Error(
        "Unable to connect to the server. Please check your connection and try again."
      );
    }

    if (error.response?.status === 404) {
      throw new Error(
        "API endpoint not found. Please check the server configuration."
      );
    }

    if (error.response?.status === 500) {
      throw new Error("Server error occurred. Please try again.");
    }

    if (error.response?.status === 429) {
      throw new Error(
        "Service is currently rate limited. Please wait a moment and try again."
      );
    }

    // Generic error message for other cases
    throw new Error(
      error.response?.data?.message ||
        "An unexpected error occurred. Please try again."
    );
  }
);

export const chatApi = {
  sendMessage: async (request: ChatRequest): Promise<ChatResponse> => {
    try {
      const response = await api.post("/chat", request);
      return response.data;
    } catch (error: any) {
      console.error("Chat API Error:", error);
      throw error;
    }
  },

  getModels: async (): Promise<AvailableModelsResponse> => {
    try {
      const response = await api.get("/models");
      return response.data;
    } catch (error: any) {
      console.error("Models API Error:", error);
      throw error;
    }
  },

  getSession: async (sessionId: string): Promise<SessionData> => {
    try {
      const response = await api.get(`/session/${sessionId}`);
      return response.data;
    } catch (error: any) {
      console.error("Session API Error:", error);
      throw error;
    }
  },

  clearSession: async (sessionId: string): Promise<void> => {
    try {
      await api.post(`/session/${sessionId}/clear`);
    } catch (error: any) {
      console.error("Clear Session API Error:", error);
      throw error;
    }
  },

  healthCheck: async (): Promise<{ status: string }> => {
    try {
      const response = await api.get("/health");
      return response.data;
    } catch (error: any) {
      console.error("Health Check API Error:", error);
      throw error;
    }
  },
};

export default api;
