"use client";

import React, { useState } from "react";
import { Question, QuestionResponse } from "@/types";
import { Button } from "@/components/ui/button";
import { Send, Check, X, MessageCircle, Hash, HelpCircle } from "lucide-react";

interface QuestionCardProps {
  question: Question;
  onAnswer: (answer: string) => void;
  isLoading?: boolean;
  existingResponse?: QuestionResponse;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onAnswer,
  isLoading = false,
  existingResponse,
}) => {
  const [answer, setAnswer] = useState("");
  const [selectedChoice, setSelectedChoice] = useState<string>("");
  const [showInput, setShowInput] = useState(!existingResponse);

  const handleSubmit = () => {
    let finalAnswer = "";

    switch (question.type) {
      case "open":
      case "numeric":
        finalAnswer = answer.trim();
        break;
      case "choice":
        finalAnswer = selectedChoice;
        break;
      case "yes_no":
        finalAnswer = selectedChoice;
        break;
    }

    if (finalAnswer) {
      onAnswer(finalAnswer);
      setShowInput(false);
    }
  };

  const handleYesNoClick = (value: string) => {
    setSelectedChoice(value);
    onAnswer(value);
    setShowInput(false);
  };

  const handleChoiceClick = (choice: string) => {
    setSelectedChoice(choice);
    onAnswer(choice);
    setShowInput(false);
  };

  const getQuestionIcon = () => {
    switch (question.type) {
      case "open":
        return <MessageCircle className="w-4 h-4" />;
      case "choice":
        return <HelpCircle className="w-4 h-4" />;
      case "numeric":
        return <Hash className="w-4 h-4" />;
      case "yes_no":
        return <Check className="w-4 h-4" />;
      default:
        return <MessageCircle className="w-4 h-4" />;
    }
  };

  if (existingResponse && !showInput) {
    return (
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 mt-3">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <Check className="w-4 h-4 text-green-600" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-green-800 mb-1">
              Question answered
            </div>
            <div className="text-sm text-green-700 mb-2">{question.text}</div>
            <div className="text-sm font-medium text-green-900 bg-green-100 px-3 py-1 rounded">
              {existingResponse.answer}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mt-3 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 opacity-50" />

      <div className="relative">
        <div className="flex items-start space-x-3 mb-4">
          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            {getQuestionIcon()}
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-blue-800 mb-1">
              Quick Response
            </div>
            <div className="text-sm text-blue-700 font-medium">
              {question.text}
            </div>
          </div>
        </div>

        {showInput && (
          <div className="space-y-3">
            {question.type === "open" && (
              <div className="space-y-2">
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Type your answer here..."
                  className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                  disabled={isLoading}
                />
                <div className="flex justify-end">
                  <Button
                    onClick={handleSubmit}
                    disabled={!answer.trim() || isLoading}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    size="sm"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            )}

            {question.type === "numeric" && (
              <div className="space-y-2">
                <input
                  type="number"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Enter a number..."
                  className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading}
                />
                <div className="flex justify-end">
                  <Button
                    onClick={handleSubmit}
                    disabled={!answer.trim() || isLoading}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    size="sm"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            )}

            {question.type === "yes_no" && (
              <div className="flex space-x-2">
                <Button
                  onClick={() => handleYesNoClick("Yes")}
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-2 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  size="sm"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Yes
                </Button>
                <Button
                  onClick={() => handleYesNoClick("No")}
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white py-2 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  size="sm"
                >
                  <X className="w-4 h-4 mr-2" />
                  No
                </Button>
              </div>
            )}

            {question.type === "choice" && question.options && (
              <div className="space-y-2">
                {question.options.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => handleChoiceClick(option)}
                    disabled={isLoading}
                    className="w-full bg-white hover:bg-blue-50 text-blue-700 border border-blue-300 hover:border-blue-400 py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-left justify-start"
                    size="sm"
                  >
                    {option}
                  </Button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
