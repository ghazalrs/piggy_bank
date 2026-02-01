import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/context/GameContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export function WelcomeScreen() {
  const { dispatch } = useGame();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [step, setStep] = useState<'intro' | 'name'>('intro');
  
  const handleStart = () => {
    if (name.trim()) {
      dispatch({ type: 'SET_PLAYER_NAME', payload: name.trim() });
      dispatch({ type: 'START_GAME' });
      navigate('/dashboard');
    }
  };
  
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm text-center space-y-8"
      >
        {step === 'intro' ? (
          <>
            {/* Piggy Animation */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="text-8xl"
            >
              🐷
            </motion.div>
            
            <div className="space-y-3">
              <h1 className="text-3xl font-bold text-foreground">
                Piggy Bank
              </h1>
              <p className="text-muted-foreground">
                Learn to save, spend, and grow your money with Piggy!
              </p>
            </div>
            
            {/* Features */}
            <div className="space-y-3 text-left">
              <div className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border">
                <span className="text-2xl">💰</span>
                <div>
                  <p className="text-sm font-semibold text-foreground">$100/month allowance</p>
                  <p className="text-xs text-muted-foreground">Manage your money for 12 months</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border">
                <span className="text-2xl">🏦</span>
                <div>
                  <p className="text-sm font-semibold text-foreground">Save & Invest</p>
                  <p className="text-xs text-muted-foreground">Watch your money grow!</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border">
                <span className="text-2xl">🛡️</span>
                <div>
                  <p className="text-sm font-semibold text-foreground">Stay Safe</p>
                  <p className="text-xs text-muted-foreground">Learn to spot scams</p>
                </div>
              </div>
            </div>
            
            <Button
              onClick={() => setStep('name')}
              size="lg"
              className="w-full rounded-full text-base font-semibold"
            >
              Let's Go! 🚀
            </Button>
          </>
        ) : (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-6xl"
            >
              🐷
            </motion.div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">
                Hi there! I'm Piggy!
              </h2>
              <p className="text-muted-foreground">
                What's your name?
              </p>
            </div>
            
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-center text-lg h-12 rounded-xl"
                maxLength={20}
                onKeyDown={(e) => e.key === 'Enter' && handleStart()}
              />
              
              <Button
                onClick={handleStart}
                disabled={!name.trim()}
                size="lg"
                className="w-full rounded-full text-base font-semibold"
              >
                Start My Journey
              </Button>
            </div>
            
            <button
              onClick={() => setStep('intro')}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Go back
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
}
