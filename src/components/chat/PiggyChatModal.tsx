// Piggy chatbot - AI-powered financial education companion
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGame } from '@/context/GameContext';
import { generatePiggyResponse } from '@/services/gemini';
import { speakText, stopSpeaking, isSpeaking } from '@/services/elevenlabs';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface PiggyChatModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PiggyChatModal({ open, onOpenChange }: PiggyChatModalProps) {
  const { state } = useGame();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hi ${state.playerName || 'there'}! I'm Piggy, your money buddy! Ask me anything about saving, spending, or staying safe from scams!`
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Stop speaking when modal closes
  useEffect(() => {
    if (!open) {
      stopSpeaking();
      setSpeakingMessageId(null);
    }
  }, [open]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsTyping(true);

    try {
      // Build conversation history for context
      const conversationHistory = messages.map(m => ({
        role: m.role,
        content: m.content
      }));

      // Get response from Gemini
      const response = await generatePiggyResponse(
        currentInput,
        state,
        conversationHistory
      );

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error getting Piggy response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Oink! I got a little confused there. Can you try asking again?"
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSpeak = async (message: Message) => {
    // If already speaking this message, stop it
    if (speakingMessageId === message.id && isSpeaking()) {
      stopSpeaking();
      setSpeakingMessageId(null);
      return;
    }

    // Stop any current speech
    stopSpeaking();
    setSpeakingMessageId(message.id);

    try {
      await speakText(message.content);
    } catch (error) {
      console.error('Error speaking message:', error);
    } finally {
      setSpeakingMessageId(null);
    }
  };

  const suggestedQuestions = [
    'How do I save money?',
    'What is a scam?',
    'Should I invest?',
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50"
          onClick={(e) => e.target === e.currentTarget && onOpenChange(false)}
        >
          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20 }}
            className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
          >
            {/* Header */}
            <div className="gradient-bg p-4 flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-3xl"
              >
                🐷
              </motion.div>
              <div className="flex-1">
                <h2 className="text-white font-bold text-lg">Piggy</h2>
                <p className="text-white/80 text-xs flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Your Money Buddy
                </p>
              </div>
              <button
                onClick={() => onOpenChange(false)}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              >
                <X className="h-5 w-5 text-white" />
              </button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className="flex flex-col gap-1 max-w-[85%]">
                      <div
                        className={`rounded-2xl px-4 py-3 ${
                          message.role === 'user'
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-tr-none'
                            : 'bg-gray-100 text-gray-800 rounded-tl-none'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                      {/* Speaker button for assistant messages */}
                      {message.role === 'assistant' && (
                        <button
                          onClick={() => handleSpeak(message)}
                          className="self-start ml-1 p-1.5 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-purple-500"
                          title={speakingMessageId === message.id ? 'Stop speaking' : 'Read aloud'}
                        >
                          {speakingMessageId === message.id ? (
                            <VolumeX className="h-4 w-4" />
                          ) : (
                            <Volume2 className="h-4 w-4" />
                          )}
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-gray-100 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1">
                      <span className="text-lg">🐷</span>
                      <motion.div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            animate={{ y: [0, -5, 0] }}
                            transition={{
                              duration: 0.5,
                              repeat: Infinity,
                              delay: i * 0.15
                            }}
                            className="w-2 h-2 bg-gray-400 rounded-full"
                          />
                        ))}
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </div>
            </ScrollArea>

            {/* Suggested Questions */}
            {messages.length <= 1 && (
              <div className="px-4 pb-2">
                <p className="text-xs text-gray-500 mb-2">Try asking:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedQuestions.map((question) => (
                    <motion.button
                      key={question}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setInput(question)}
                      className="px-3 py-1.5 text-xs bg-purple-50 text-purple-600 rounded-full hover:bg-purple-100 transition-colors"
                    >
                      {question}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 border-t border-gray-100">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask Piggy anything..."
                  disabled={isTyping}
                  className="flex-1 rounded-full border-2 border-purple-200 focus:border-purple-400 px-4"
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="rounded-full w-12 h-12 p-0 gradient-bg hover:opacity-90 disabled:opacity-50"
                >
                  <Send className="h-5 w-5 text-white" />
                </Button>
              </div>
              <p className="text-xs text-gray-400 text-center mt-2">
                Piggy uses AI to help you learn about money!
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
