// Scam phone call simulation - teaches kids about phone scams
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, PhoneOff, AlertTriangle, Shield, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CallScam } from '@/data/scams';
import { useGame } from '@/context/GameContext';

interface ScamCallProps {
  scam: CallScam;
  open: boolean;
  onClose: () => void;
}

type CallState = 'ringing' | 'talking' | 'result';

export function ScamCall({ scam, open, onClose }: ScamCallProps) {
  const { dispatch } = useGame();
  const [callState, setCallState] = useState<CallState>('ringing');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [fellFor, setFellFor] = useState(false);
  const [callerResponse, setCallerResponse] = useState('');

  const handleAnswer = () => {
    setCallState('talking');
  };

  const handleDecline = () => {
    dispatch({ type: 'SCAM_AVOIDED' });
    setFellFor(false);
    setCallState('result');
  };

  const handleOptionSelect = (optionIndex: number) => {
    const playerEntry = scam?.dialogue?.[1];
    if (playerEntry?.options) {
      const option = playerEntry.options[optionIndex];
      setSelectedOption(optionIndex);
      setCallerResponse(option.response);
      
      if (!option.isSafe) {
        setFellFor(true);
        dispatch({ type: 'SCAM_FELL_FOR', payload: 25 });
      } else {
        dispatch({ type: 'SCAM_AVOIDED' });
      }
      
      // Show result after a delay
      setTimeout(() => {
        setCallState('result');
      }, 2000);
    }
  };

  const handleClose = () => {
    setCallState('ringing');
    setSelectedOption(null);
    setFellFor(false);
    setCallerResponse('');
    onClose();
  };

  // Early return if no scam data
  if (!scam || !open) {
    return null;
  }

  // Get caller message (first dialogue) and player options (second dialogue)
  const callerDialogue = scam.dialogue?.[0];
  const playerDialogue = scam.dialogue?.[1];
  const playerOptions = playerDialogue?.options;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
        >
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="w-full max-w-sm"
          >
            {callState === 'ringing' && (
              <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-3xl p-8 text-center shadow-2xl">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-5xl shadow-lg shadow-green-500/30"
                >
                  {scam.callerIcon}
                </motion.div>
                
                <h2 className="text-white text-2xl font-bold mb-2">{scam.callerName}</h2>
                <p className="text-gray-400 mb-8">Incoming call...</p>
                
                <div className="flex justify-center gap-8">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleDecline}
                    className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center shadow-lg shadow-red-500/30"
                  >
                    <PhoneOff className="h-7 w-7 text-white" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    onClick={handleAnswer}
                    className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/30"
                  >
                    <Phone className="h-7 w-7 text-white" />
                  </motion.button>
                </div>

                <p className="text-gray-500 text-sm mt-6">
                  Tap 🔴 to decline or 🟢 to answer
                </p>
              </div>
            )}

            {callState === 'talking' && (
              <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">
                {/* Call Header */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4 text-center">
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl">
                      {scam.callerIcon}
                    </div>
                    <div className="text-left">
                      <h2 className="text-white font-bold">{scam.callerName}</h2>
                      <p className="text-green-100 text-sm">On call 📞</p>
                    </div>
                  </div>
                </div>

                {/* Dialogue */}
                <div className="p-6">
                  {/* Caller Message */}
                  {callerDialogue && (
                    <div className="mb-4">
                      <div className="bg-gray-100 rounded-2xl rounded-tl-none p-4 max-w-[85%]">
                        <p className="text-gray-800 text-sm">{callerDialogue.text}</p>
                      </div>
                    </div>
                  )}

                  {/* Player Response or Options */}
                  {selectedOption !== null ? (
                    <>
                      <div className="flex justify-end mb-4">
                        <div className="bg-blue-500 text-white rounded-2xl rounded-tr-none p-4 max-w-[85%]">
                          <p className="text-sm">{playerOptions?.[selectedOption]?.text}</p>
                        </div>
                      </div>
                      <div className="mb-4">
                        <div className={`rounded-2xl rounded-tl-none p-4 max-w-[85%] ${
                          fellFor ? 'bg-red-100' : 'bg-green-100'
                        }`}>
                          <p className={`text-sm ${fellFor ? 'text-red-800' : 'text-green-800'}`}>
                            {callerResponse}
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    playerOptions && (
                      <div className="space-y-2">
                        <p className="text-gray-500 text-xs text-center mb-3">What do you say?</p>
                        {playerOptions.map((option, index) => (
                          <motion.button
                            key={index}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleOptionSelect(index)}
                            className="w-full p-3 rounded-xl text-left text-sm font-medium bg-blue-50 hover:bg-blue-100 text-blue-700 border-2 border-blue-200 transition-colors"
                          >
                            "{option.text}"
                          </motion.button>
                        ))}
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {callState === 'result' && (
              <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
                <div className={`p-4 text-center ${fellFor ? 'bg-red-500' : 'bg-green-500'}`}>
                  <div className="flex items-center justify-center gap-2 text-white">
                    {fellFor ? (
                      <>
                        <AlertTriangle className="h-6 w-6" />
                        <h2 className="font-bold text-lg">Oh no! That was a scam call! 📞😰</h2>
                      </>
                    ) : (
                      <>
                        <Shield className="h-6 w-6" />
                        <h2 className="font-bold text-lg">Smart move! You stayed safe! 🛡️📞</h2>
                      </>
                    )}
                  </div>
                </div>

                <div className="p-6">
                  {fellFor && (
                    <div className="bg-red-50 rounded-xl p-3 mb-4 text-center">
                      <p className="text-red-600 font-bold">-$25 lost to phone scam 📞💸</p>
                    </div>
                  )}

                  <div className="bg-blue-50 rounded-xl p-4 mb-4">
                    <p className="text-blue-800 text-sm font-medium">
                      {scam.explanation}
                    </p>
                  </div>

                  <div className="mb-4">
                    <h3 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
                      <span className="text-red-500">🚩</span> Red Flags:
                    </h3>
                    <ul className="space-y-1">
                      {scam.redFlags.map((flag, i) => (
                        <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-orange-400">•</span>
                          {flag}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-purple-50 rounded-xl p-3 mb-4">
                    <p className="text-purple-800 text-sm font-medium">
                      💡 <strong>Pro Tip:</strong> Always ask an adult before sharing ANY personal information on the phone!
                    </p>
                  </div>

                  <Button 
                    onClick={handleClose}
                    className="w-full gradient-bg text-white font-bold"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Got it!
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
