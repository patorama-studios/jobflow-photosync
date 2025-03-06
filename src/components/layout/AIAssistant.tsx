
import React, { useState, useRef, useEffect } from 'react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Sparkles, X, ArrowUp, Loader2 } from 'lucide-react';
import { useAIAssistant } from '@/contexts/AIAssistantContext';
import { useNavigate } from 'react-router-dom';

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [showPopover, setShowPopover] = useState(false);
  const { messages, isLoading, sendMessage, clearMessages } = useAIAssistant();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      // Small delay to allow the dialog close animation
      setTimeout(() => {
        // Only clear if we actually have messages
        if (messages.length > 0) {
          clearMessages();
        }
        setQuery("");
      }, 300);
    }
  };

  const handleSend = async () => {
    if (query.trim() && !isLoading) {
      await sendMessage(query);
      setQuery("");
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <Popover open={showPopover} onOpenChange={setShowPopover}>
        <PopoverTrigger asChild>
          <button
            className="group flex items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm ring-offset-background transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 dark:border-muted/50 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => setOpen(true)}
          >
            <Sparkles className="h-4 w-4 text-primary" />
            AI Assistant
            <span className="ml-auto w-5 h-5 flex items-center justify-center rounded-md bg-secondary text-secondary-foreground group-hover:bg-muted group-hover:text-muted-foreground">
              ⌘K
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" side="bottom" align="start">
          <div className="p-3 text-sm">
            <h3 className="font-medium mb-1">AI Assistant</h3>
            <p className="text-muted-foreground text-xs">
              Ask me anything about your photography business. I can help you:
            </p>
            <ul className="text-xs mt-2 space-y-1 text-muted-foreground">
              <li>• Schedule new appointments</li>
              <li>• Find customer information</li>
              <li>• Search for orders</li>
              <li>• Change settings</li>
              <li>• Run reports and analytics</li>
            </ul>
          </div>
        </PopoverContent>
      </Popover>

      <CommandDialog open={open} onOpenChange={handleOpenChange}>
        <div className="flex flex-col h-[80vh]">
          <div className="flex items-center border-b px-3">
            <Sparkles className="mr-2 h-4 w-4 shrink-0 text-primary" />
            <CommandInput
              ref={inputRef}
              placeholder="Ask the AI assistant anything..."
              value={query}
              onValueChange={setQuery}
              onKeyDown={handleKeyDown}
              className="flex-1"
            />
            {open && messages.length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={clearMessages}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <CommandList>
                <CommandEmpty>
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <Sparkles className="h-10 w-10 text-muted-foreground mb-2" />
                    <h3 className="text-lg font-medium">How can I help you today?</h3>
                    <p className="text-sm text-muted-foreground mt-1 max-w-md">
                      Ask me anything about your business, orders, scheduling, or settings.
                    </p>
                    <div className="mt-6 grid gap-2">
                      <SuggestionButton
                        text="Find orders for today"
                        onClick={() => sendMessage("Find all orders scheduled for today")}
                      />
                      <SuggestionButton
                        text="Book a new photography session"
                        onClick={() => sendMessage("How do I book a new photography session?")}
                      />
                      <SuggestionButton
                        text="Check customer information"
                        onClick={() => sendMessage("How can I check customer information?")}
                      />
                    </div>
                  </div>
                </CommandEmpty>
                <CommandGroup heading="Quick Navigation">
                  <CommandItem
                    onSelect={() => navigate('/orders')}
                  >
                    View Orders
                  </CommandItem>
                  <CommandItem
                    onSelect={() => navigate('/calendar')}
                  >
                    Open Calendar
                  </CommandItem>
                  <CommandItem
                    onSelect={() => navigate('/customers')}
                  >
                    Manage Customers
                  </CommandItem>
                  <CommandItem
                    onSelect={() => navigate('/settings')}
                  >
                    Settings
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            ) : (
              <div className="space-y-4">
                {messages.filter(m => m.role !== 'system').map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <div className="text-sm whitespace-pre-wrap">
                        {message.content}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg px-4 py-2 text-sm">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {messages.length > 0 && (
            <div className="border-t p-4">
              <div className="flex gap-2">
                <CommandInput
                  placeholder="Type a message..."
                  value={query}
                  onValueChange={setQuery}
                  onKeyDown={handleKeyDown}
                  className="flex-1 border rounded-lg"
                />
                <Button 
                  size="icon" 
                  onClick={handleSend}
                  disabled={isLoading || !query.trim()}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ArrowUp className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </CommandDialog>
    </>
  );
}

function SuggestionButton({ text, onClick }: { text: string; onClick: () => void }) {
  return (
    <button
      className="w-full px-3 py-2 text-sm border rounded-md hover:bg-accent text-left"
      onClick={onClick}
    >
      {text}
    </button>
  );
}
