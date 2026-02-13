import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChatBubbleLeftRightIcon, 
  XMarkIcon, 
  PaperAirplaneIcon,
  UserIcon,
  ComputerDesktopIcon 
} from '@heroicons/react/24/outline';

interface LiveChatProps {
  children: React.ReactNode;
}

interface Message {
  id: string;
  type: 'user' | 'agent';
  content: string;
  timestamp: Date;
}

export const LiveChat = ({ children }: LiveChatProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'agent',
      content: '👋 Hi there! Welcome to Goodwill Medical Supplies. How can I help you today?',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate agent response
    setTimeout(() => {
      setIsTyping(false);
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'agent',
        content: getAutoResponse(inputMessage),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, agentMessage]);
    }, 1500);
  };

  const getAutoResponse = (message: string): string => {
    const lowerMsg = message.toLowerCase();
    
    if (lowerMsg.includes('shipping') || lowerMsg.includes('delivery')) {
      return 'Standard shipping takes 2-3 business days. Express shipping (1-2 days) is available at checkout. Free shipping on orders over $500!';
    }
    if (lowerMsg.includes('return')) {
      return 'We offer 30-day returns on most items in unused condition. Would you like me to email you our return policy?';
    }
    if (lowerMsg.includes('price') || lowerMsg.includes('cost') || lowerMsg.includes('bulk')) {
      return 'For bulk pricing and volume discounts, please contact our sales team at sales@goodwillmedical.com or request a quote through our website.';
    }
    if (lowerMsg.includes('fda') || lowerMsg.includes('certified')) {
      return 'Yes, all our medical devices are FDA approved and meet strict quality standards. You can find certification documents on each product page.';
    }
    if (lowerMsg.includes('warranty')) {
      return 'Most products come with a 1-2 year manufacturer warranty. Check the product specifications for exact warranty details.';
    }
    
    return 'Thank you for your message. One of our medical equipment specialists will respond shortly. Is there anything specific about our products you\'d like to know?';
  };

  return (
    <>
      {/* Chat Button */}
      <div onClick={() => setIsOpen(true)}>
        {children}
      </div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 z-50 lg:hidden"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Chat Container */}
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed bottom-4 right-4 left-4 lg:left-auto lg:right-4 lg:w-96 
                       bg-white rounded-2xl shadow-2xl border border-gray-200 z-50
                       flex flex-col h-[600px] lg:h-[500px]"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-medical-blue to-medical-blue-dark rounded-t-2xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <ChatBubbleLeftRightIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Live Chat</h3>
                    <p className="text-xs text-blue-100">Online • Usually replies instantly</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <XMarkIcon className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start space-x-2 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                                    ${message.type === 'user' 
                                      ? 'bg-medical-blue/10' 
                                      : 'bg-soft-gray'}`}>
                        {message.type === 'user' ? (
                          <UserIcon className="w-4 h-4 text-medical-blue" />
                        ) : (
                          <ComputerDesktopIcon className="w-4 h-4 text-slate-600" />
                        )}
                      </div>
                      <div>
                        <div className={`rounded-2xl px-4 py-2 text-sm
                                      ${message.type === 'user'
                                        ? 'bg-medical-blue text-white'
                                        : 'bg-soft-gray text-slate-800'
                                      }`}>
                          {message.content}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-soft-gray rounded-full flex items-center justify-center">
                        <ComputerDesktopIcon className="w-4 h-4 text-slate-600" />
                      </div>
                      <div className="bg-soft-gray rounded-2xl px-4 py-3">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-medical-blue focus:border-transparent"
                  />
                  <button
                    type="submit"
                    disabled={!inputMessage.trim()}
                    className="p-2 bg-medical-blue text-white rounded-lg 
                             hover:bg-medical-blue-dark transition-colors
                             disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <PaperAirplaneIcon className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-2 text-center">
                  Live chat support • 24/7
                </p>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
