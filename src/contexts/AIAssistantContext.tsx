
import React, { createContext, useContext, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

interface AIAssistantContextType {
  messages: Message[];
  isLoading: boolean;
  sendMessage: (message: string, context?: string) => Promise<void>;
  clearMessages: () => void;
}

const AIAssistantContext = createContext<AIAssistantContextType | undefined>(undefined);

export const AIAssistantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendMessage = useCallback(async (message: string, context?: string) => {
    if (!message.trim()) return;

    // Add user message to the conversation
    const userMessage: Message = { role: 'user', content: message };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Get only the last 10 messages to stay within token limits
      const messageHistory = [...messages.slice(-10)];
      
      const { data, error } = await supabase.functions.invoke('ai-assistant', {
        body: {
          query: message,
          history: messageHistory,
          context: context || ""
        }
      });

      if (error) throw new Error(error.message || 'Error calling AI assistant');

      // Add assistant response to the conversation
      const assistantMessage: Message = { role: 'assistant', content: data.response };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      toast({
        variant: "destructive",
        title: "AI Assistant Error",
        description: error instanceof Error ? error.message : "Failed to get a response",
      });
    } finally {
      setIsLoading(false);
    }
  }, [messages, toast]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return (
    <AIAssistantContext.Provider value={{ messages, isLoading, sendMessage, clearMessages }}>
      {children}
    </AIAssistantContext.Provider>
  );
};

export const useAIAssistant = () => {
  const context = useContext(AIAssistantContext);
  if (context === undefined) {
    throw new Error('useAIAssistant must be used within an AIAssistantProvider');
  }
  return context;
};
