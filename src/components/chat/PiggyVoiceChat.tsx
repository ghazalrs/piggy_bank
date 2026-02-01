import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mic, MicOff, Volume2, Square } from 'lucide-react';
import { useGame } from '@/context/GameContext';
import { generatePiggyResponse } from '@/services/gemini';
import { speakText, stopSpeaking } from '@/services/elevenlabs';

// Web Speech API type declarations
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}

interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: ((this: ISpeechRecognition, ev: Event) => void) | null;
  onresult: ((this: ISpeechRecognition, ev: SpeechRecognitionEvent) => void) | null;
  onerror: ((this: ISpeechRecognition, ev: SpeechRecognitionErrorEvent) => void) | null;
  onend: ((this: ISpeechRecognition, ev: Event) => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => ISpeechRecognition;
    webkitSpeechRecognition: new () => ISpeechRecognition;
  }
}

interface PiggyVoiceChatProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type VoiceChatState = 'idle' | 'listening' | 'processing' | 'speaking' | 'done';

export function PiggyVoiceChat({ open, onOpenChange }: PiggyVoiceChatProps) {
  const { state } = useGame();
  const [chatState, setChatState] = useState<VoiceChatState>('idle');
  const [transcript, setTranscript] = useState('');
  const [piggyResponse, setPiggyResponse] = useState('');
  const [conversationHistory, setConversationHistory] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<ISpeechRecognition | null>(null);

  // Check for browser speech recognition support
  const hasSpeechRecognition = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;

  // Cleanup on unmount or close
  useEffect(() => {
    if (!open) {
      stopListening();
      stopSpeaking();
      setChatState('idle');
      setTranscript('');
      setError(null);
    }
  }, [open]);

  const startListening = () => {
    if (!hasSpeechRecognition) {
      setError('Speech recognition not supported in this browser. Try Chrome!');
      return;
    }

    setError(null);
    setTranscript('');
    setPiggyResponse('');

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();

    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onstart = () => {
      setChatState('listening');
    };

    recognitionRef.current.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      setTranscript(finalTranscript || interimTranscript);

      if (finalTranscript) {
        handleUserSpeech(finalTranscript);
      }
    };

    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'no-speech') {
        setError("I didn't hear anything. Try again!");
      } else if (event.error === 'not-allowed') {
        setError('Microphone access denied. Please allow microphone access.');
      } else {
        setError('Something went wrong. Try again!');
      }
      setChatState('idle');
    };

    recognitionRef.current.onend = () => {
      if (chatState === 'listening') {
        // If we're still in listening state and it ended, there was no speech
        setChatState('idle');
      }
    };

    recognitionRef.current.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
  };

  const handleUserSpeech = async (userSpeech: string) => {
    stopListening();
    setChatState('processing');

    try {
      // Get response from Gemini
      const response = await generatePiggyResponse(
        userSpeech,
        state,
        conversationHistory
      );

      setPiggyResponse(response);

      // Update conversation history
      setConversationHistory(prev => [
        ...prev,
        { role: 'user', content: userSpeech },
        { role: 'assistant', content: response }
      ]);

      // Speak the response
      setChatState('speaking');
      try {
        await speakText(response);
      } catch (speakError) {
        console.error('TTS error:', speakError);
        // Even if TTS fails, we still show the response
      }

      // Keep showing the response (don't go back to idle immediately)
      setChatState('done');
    } catch (error) {
      console.error('Error processing voice:', error);
      setError("Oink! I had trouble understanding. Try again!");
      setChatState('idle');
    }
  };

  const handleMicClick = () => {
    if (chatState === 'listening') {
      stopListening();
      setChatState('idle');
    } else if (chatState === 'idle' || chatState === 'done') {
      startListening();
    } else if (chatState === 'speaking') {
      stopSpeaking();
      setChatState('done');
    }
  };

  const getStatusText = () => {
    switch (chatState) {
      case 'listening':
        return transcript || 'Listening...';
      case 'processing':
        return 'Thinking...';
      case 'speaking':
      case 'done':
        return piggyResponse;
      default:
        return error || 'Tap the microphone to ask Piggy a question!';
    }
  };

  const getButtonColor = () => {
    switch (chatState) {
      case 'listening':
        return 'bg-red-500 shadow-red-500/30';
      case 'processing':
        return 'bg-yellow-500 shadow-yellow-500/30';
      case 'speaking':
        return 'bg-green-500 shadow-green-500/30';
      case 'done':
      default:
        return 'gradient-bg shadow-purple-500/30';
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
          onClick={(e) => e.target === e.currentTarget && onOpenChange(false)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', damping: 20 }}
            className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="gradient-bg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={chatState === 'speaking' ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.5, repeat: chatState === 'speaking' ? Infinity : 0 }}
                  className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-2xl"
                >
                  🐷
                </motion.div>
                <div>
                  <h2 className="text-white font-bold">Talk to Piggy</h2>
                  <p className="text-white/80 text-xs">
                    {chatState === 'speaking' ? 'Piggy is talking...' :
                     chatState === 'listening' ? 'Listening to you...' :
                     chatState === 'processing' ? 'Thinking...' :
                     chatState === 'done' ? 'Tap mic to continue' :
                     'Tap mic to speak'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onOpenChange(false)}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              >
                <X className="h-5 w-5 text-white" />
              </button>
            </div>

            {/* Main Content */}
            <div className="p-8 flex flex-col items-center">
              {/* Piggy Avatar */}
              <motion.div
                animate={
                  chatState === 'listening'
                    ? { scale: [1, 1.05, 1] }
                    : chatState === 'speaking'
                    ? { rotate: [-5, 5, -5] }
                    : chatState === 'processing'
                    ? { y: [0, -5, 0] }
                    : {}
                }
                transition={{ duration: 0.5, repeat: Infinity }}
                className="w-32 h-32 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center text-7xl mb-6 shadow-lg"
              >
                🐷
              </motion.div>

              {/* Status Text */}
              <div className="text-center mb-6 min-h-[80px] max-w-full px-4">
                {chatState === 'listening' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <p className="text-gray-600 font-medium">{getStatusText()}</p>
                    <div className="flex justify-center gap-1 mt-2">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ scaleY: [1, 2, 1] }}
                          transition={{
                            duration: 0.4,
                            repeat: Infinity,
                            delay: i * 0.1
                          }}
                          className="w-1 h-4 bg-purple-400 rounded-full"
                        />
                      ))}
                    </div>
                  </motion.div>
                )}

                {chatState === 'processing' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-8 h-8 border-3 border-purple-200 border-t-purple-500 rounded-full"
                    />
                    <p className="text-gray-500">Piggy is thinking...</p>
                  </motion.div>
                )}

                {chatState === 'speaking' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <div className="flex items-center gap-2 text-purple-600 mb-2">
                      <Volume2 className="h-5 w-5" />
                      <p className="font-medium">Piggy is speaking</p>
                    </div>
                    <p className="text-gray-600 text-sm">{piggyResponse}</p>
                  </motion.div>
                )}

                {chatState === 'done' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <p className="text-purple-600 font-medium mb-1">Piggy said:</p>
                    <p className="text-gray-600 text-sm">{piggyResponse}</p>
                    <p className="text-gray-400 text-xs mt-2">Tap mic to ask another question</p>
                  </motion.div>
                )}

                {chatState === 'idle' && (
                  <p className={`${error ? 'text-red-500' : 'text-gray-500'}`}>
                    {getStatusText()}
                  </p>
                )}
              </div>

              {/* Mic Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleMicClick}
                disabled={chatState === 'processing'}
                className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all ${getButtonColor()} ${chatState === 'processing' ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {chatState === 'listening' ? (
                  <MicOff className="h-8 w-8 text-white" />
                ) : chatState === 'speaking' ? (
                  <Square className="h-8 w-8 text-white" />
                ) : (
                  <Mic className="h-8 w-8 text-white" />
                )}
              </motion.button>

              <p className="text-xs text-gray-400 mt-4">
                {chatState === 'listening' ? 'Tap to stop' :
                 chatState === 'speaking' ? 'Tap to stop Piggy' :
                 chatState === 'done' ? 'Tap to ask another question' :
                 'Tap to start talking'}
              </p>
            </div>

            {/* Footer Tip */}
            <div className="bg-purple-50 p-4 text-center">
              <p className="text-purple-700 text-sm">
                {!hasSpeechRecognition
                  ? '⚠️ Use Chrome for voice features'
                  : '💡 Try asking: "How can I save more money?"'}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
