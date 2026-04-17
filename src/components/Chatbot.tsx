/// <reference types="vite/client" />
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { Button } from './ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../hooks/useData';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { userProfile } = useAuth();
  const { tasks, users } = useData();

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Build context for the AI
      const systemPrompt = `
        You are Collab AI, a friendly and concise assistant for a team task management app.
        Persona: Short, sweet, helpful, and professional.
        Constraints:
        1. Keep responses very brief (1-2 sentences maximum).
        2. Use PLAIN TEXT ONLY. DO NOT use markdown like **bold**, *italics*, or lists.
        3. Never use symbols like ** for emphasis.
        4. Focus on providing direct answers or quick status updates.
        
        Current User: ${userProfile?.name || 'User'} (${userProfile?.role || 'Member'})
        
        System Data for Context:
        - Tasks: ${tasks.length} total.
        - Team Members: ${users.length} total.
        
        Data Details:
        Tasks: ${tasks.map(t => `${t.title} (${t.status})`).join(', ')}
        Members: ${users.map(u => `${u.name} (${u.role})`).join(', ')}
      `;

      const chat = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: systemPrompt,
        }
      });

      // Replay previous messages for context
      for (const msg of messages) {
        if (msg.role === 'user') {
          await chat.sendMessage({ message: msg.content });
        }
      }

      const response = await chat.sendMessage({ message: userMessage.content });
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: response.text || 'Sorry, I could not generate a response.'
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error generating response:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: "Sorry, I encountered an error while processing your request."
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 h-14 w-14 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-lg shadow-blue-500/30 flex items-center justify-center transition-all duration-300 z-40 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100 hover:scale-110'}`}
      >
        <MessageSquare className="h-6 w-6" />
      </button>

      {/* Chat Window */}
      <div 
        className={`fixed bottom-6 right-6 w-80 sm:w-96 h-[500px] max-h-[calc(100vh-48px)] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl flex flex-col transition-all duration-300 z-50 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 rounded-t-2xl transition-colors duration-300">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-blue-100 dark:bg-blue-500/20 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-200">Collab AI</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Your personal assistant</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-slate-500 mt-10">
              <Bot className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p className="text-sm">Hi {userProfile?.name?.split(' ')[0] || 'there'}! I can help you manage tasks, check team performance, or answer questions about your projects.</p>
            </div>
          )}
          
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300' : 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400'}`}>
                {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>
              <div className={`px-4 py-2 rounded-2xl max-w-[75%] text-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-sm'}`}>
                {msg.content}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3">
              <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                <Bot className="h-4 w-4" />
              </div>
              <div className="px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-sm flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-blue-600 dark:text-blue-400" />
                <span className="text-sm text-slate-500 dark:text-slate-400">Thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 rounded-b-2xl transition-colors duration-300">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-full px-4 py-2 text-sm text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors duration-300"
            />
            <Button 
              type="submit" 
              disabled={!input.trim() || isLoading}
              className="h-9 w-9 p-0 rounded-full flex items-center justify-center flex-shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
