// Scam training popup - teaches kids to recognize online scams
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, CheckCircle, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PopupScam } from '@/data/scams';
import { useGame } from '@/context/GameContext';

interface ScamPopupProps {
  scam: PopupScam;
  open: boolean;
  onClose: () => void;
}

export function ScamPopup({ scam, open, onClose }: ScamPopupProps) {
  const { dispatch } = useGame();
  const [showResult, setShowResult] = useState(false);
  const [fellFor, setFellFor] = useState(false);

  const handleClick = () => {
    setFellFor(true);
    setShowResult(true);
    dispatch({ type: 'SCAM_FELL_FOR', payload: 25 });
  };

  const handleClose = () => {
    if (!showResult) {
      setFellFor(false);
      setShowResult(true);
      dispatch({ type: 'SCAM_AVOIDED' });
    } else {
      setShowResult(false);
      setFellFor(false);
      onClose();
    }
  };

  const dangerColors = {
    low: 'from-yellow-400 to-orange-400',
    medium: 'from-orange-400 to-red-400',
    high: 'from-red-400 to-red-600'
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
          onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
          <motion.div
            initial={{ scale: 0.5, rotate: -5 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', damping: 15 }}
            className="relative w-full max-w-sm"
          >
            {!showResult ? (
              // Scam Popup
              <div className="bg-white rounded-2xl overflow-hidden shadow-2xl border-4 border-red-400">
                {/* Flashing Header */}
                <motion.div
                  animate={{ 
                    backgroundColor: ['#ef4444', '#f59e0b', '#ef4444'],
                  }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="p-3 text-center"
                >
                  <h2 className="text-white font-black text-lg">{scam.title}</h2>
                </motion.div>

                {/* Content */}
                <div className="p-6 text-center">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="text-6xl mb-4"
                  >
                    {scam.icon}
                  </motion.div>
                  
                  <p className="text-gray-800 font-medium mb-6 text-sm">
                    {scam.message}
                  </p>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleClick}
                    className={`w-full py-3 px-6 rounded-xl font-bold text-white bg-gradient-to-r ${dangerColors[scam.dangerLevel]} shadow-lg`}
                  >
                    {scam.buttonText}
                  </motion.button>
                </div>

                {/* Close Button */}
                <button
                  onClick={handleClose}
                  className="absolute top-2 right-2 p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                >
                  <X className="h-4 w-4 text-gray-600" />
                </button>

                {/* Fake "Ads" text */}
                <div className="bg-gray-100 py-2 text-center">
                  <span className="text-xs text-gray-400">ADVERTISEMENT</span>
                </div>
              </div>
            ) : (
              // Result Screen
              <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
                <div className={`p-4 text-center ${fellFor ? 'bg-red-500' : 'bg-green-500'}`}>
                  <div className="flex items-center justify-center gap-2 text-white">
                    {fellFor ? (
                      <>
                        <AlertTriangle className="h-6 w-6" />
                        <h2 className="font-bold text-lg">Oops! That was a scam! 😰</h2>
                      </>
                    ) : (
                      <>
                        <Shield className="h-6 w-6" />
                        <h2 className="font-bold text-lg">Great job! You avoided a scam! 🛡️</h2>
                      </>
                    )}
                  </div>
                </div>

                <div className="p-6">
                  {fellFor && (
                    <div className="bg-red-50 rounded-xl p-3 mb-4 text-center">
                      <p className="text-red-600 font-bold">-$25 lost to scam 💸</p>
                    </div>
                  )}

                  <div className="bg-blue-50 rounded-xl p-4 mb-4">
                    <p className="text-blue-800 text-sm font-medium">
                      {scam.explanation}
                    </p>
                  </div>

                  <div className="mb-4">
                    <h3 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
                      <span className="text-red-500">🚩</span> Red Flags to Watch For:
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
