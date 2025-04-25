'use client';

import { useState, useRef, useEffect } from 'react';
import { Inter } from 'next/font/google';
import ReactMarkdown from 'react-markdown';

const inter = Inter({ subsets: ['latin'] });

// Function to extract response from message
function extractResponse(message: string) {
  if (!message) return '';
  
  const parts = message.split('---');
  if (parts.length > 2 && parts[2]) {
    return parts[2].trim();
  } else {
    return message;
  }
}

export default function Home() {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
  const [response, setResponse] = useState('');
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Update response and scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].role === 'assistant') {
      setResponse(extractResponse(messages[messages.length - 1].content));
    }
    
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          messages: [...messages, { role: 'user', content: userMessage }]
        }),
      });

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, there was an error processing your request.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={`min-h-screen p-4 md:p-8 bg-gradient-to-br from-indigo-50 to-blue-50 ${inter.className}`}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-indigo-700">Career Path Advisor</h1>
          <p className="text-gray-600">AI-powered guidance for your professional journey</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl p-5 mb-6 h-[65vh] overflow-y-auto border border-indigo-100">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-indigo-100 rounded-full mx-auto flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M9 4v4m6-4v4M3 8h18v8a4 4 0 01-4 4H7a4 4 0 01-4-4V8zm4-4h10" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold mb-3 text-indigo-700">Welcome to Career Path Advisor!</h2>
              <p className="text-gray-600 max-w-lg mx-auto">
                I can help you discover the perfect career path based on your interests, skills, and education.
                Share a bit about yourself, and let's explore your professional possibilities together!
              </p>
              <div className="mt-6 space-y-2">
                <p className="text-sm text-gray-500">Try asking:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <button 
                    onClick={() => setInput("I love programming and solving problems. I have a degree in computer science.")}
                    className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full text-sm transition"
                  >
                    "I love programming and solving problems..."
                  </button>
                  <button 
                    onClick={() => setInput("I'm creative and enjoy designing things. What careers could suit me?")}
                    className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full text-sm transition"
                  >
                    "I'm creative and enjoy designing things..."
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`p-4 rounded-2xl max-w-[85%] ${
                      message.role === 'user'
                        ? 'bg-indigo-600 text-white rounded-tr-none'
                        : 'bg-gray-100 text-gray-800 rounded-tl-none'
                    }`}
                  >
                    {message.role === 'assistant' ? (
                      <div className="prose prose-sm max-w-none">
                        <ReactMarkdown>
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <div>{message.content}</div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 p-4 rounded-2xl rounded-tl-none">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '600ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Share your interests, skills, or education..."
            className="flex-1 p-3 border border-indigo-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-indigo-600 text-white px-6 py-2 rounded-xl hover:bg-indigo-700 transition disabled:bg-indigo-300 shadow-sm"
          >
            {isLoading ? 'Thinking...' : 'Ask'}
          </button>
        </form>
        
        <p className="text-xs text-center mt-6 text-gray-500">
          Powered by Mixtral via Hugging Face • Your personal AI career advisor
        </p>
      </div>
    </main>
  );
} 