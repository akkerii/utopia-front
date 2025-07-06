import {
  ChatRequest,
  ChatResponse,
  SessionData,
  QuestionResponse,
} from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const api = {
  // Send a chat message
  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Chat API error: ${response.statusText}`);
    }

    return response.json();
  },

  // Send a question response
  async sendQuestionResponse(
    sessionId: string,
    questionId: string,
    answer: string
  ): Promise<ChatResponse> {
    const response = await fetch(`${API_BASE_URL}/api/question-response`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sessionId,
        questionId,
        answer,
      }),
    });

    if (!response.ok) {
      throw new Error(`Question response API error: ${response.statusText}`);
    }

    return response.json();
  },

  // Get session data
  async getSession(sessionId: string): Promise<SessionData> {
    const response = await fetch(`${API_BASE_URL}/api/session/${sessionId}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Session API error: ${response.statusText}`);
    }

    return response.json();
  },

  // Clear session
  async clearSession(sessionId: string): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/api/session/${sessionId}/clear`,
      {
        method: "POST",
      }
    );

    if (!response.ok) {
      throw new Error(`Clear session API error: ${response.statusText}`);
    }
  },

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const response = await fetch(`${API_BASE_URL}/api/health`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Health check API error: ${response.statusText}`);
    }

    return response.json();
  },
};
