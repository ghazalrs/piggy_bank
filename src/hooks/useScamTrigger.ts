import { useState, useCallback } from 'react';
import { Scam, getRandomPopupScam, getRandomCallScam, PopupScam, CallScam } from '@/data/scams';

export function useScamTrigger() {
  const [currentScam, setCurrentScam] = useState<Scam | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showCall, setShowCall] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const triggerRandomScam = useCallback(() => {
    const isCall = Math.random() > 0.5;
    
    if (isCall) {
      setCurrentScam(getRandomCallScam());
      setShowCall(true);
    } else {
      setCurrentScam(getRandomPopupScam());
      setShowPopup(true);
    }
  }, []);

  const triggerPopupScam = useCallback(() => {
    setCurrentScam(getRandomPopupScam());
    setShowPopup(true);
  }, []);

  const triggerCallScam = useCallback(() => {
    setCurrentScam(getRandomCallScam());
    setShowCall(true);
  }, []);

  const closeScam = useCallback(() => {
    setShowPopup(false);
    setShowCall(false);
    setCurrentScam(null);
  }, []);

  // Track clicks and trigger scam every 3 clicks
  const trackClick = useCallback(() => {
    setClickCount(prev => {
      const newCount = prev + 1;
      if (newCount >= 3) {
        // Trigger scam on next tick to avoid state conflicts
        setTimeout(() => triggerRandomScam(), 100);
        return 0;
      }
      return newCount;
    });
  }, [triggerRandomScam]);

  return {
    currentScam,
    showPopup,
    showCall,
    clickCount,
    popupScam: showPopup ? (currentScam as PopupScam) : null,
    callScam: showCall ? (currentScam as CallScam) : null,
    triggerRandomScam,
    triggerPopupScam,
    triggerCallScam,
    closeScam,
    trackClick,
  };
}
