import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '@/context/GameContext';
import { Header } from '@/components/layout/Header';
import { TabBar } from '@/components/layout/TabBar';
import { BottomNav } from '@/components/layout/BottomNav';
import { HomeTab } from '@/components/tabs/HomeTab';
import { SpendTab } from '@/components/tabs/SpendTab';
import { InvestTab } from '@/components/tabs/InvestTab';
import { ShopModal } from '@/components/modals/ShopModal';
import { TransferModal } from '@/components/modals/TransferModal';
import { ActivityModal } from '@/components/modals/ActivityModal';
import { ScamPopup } from '@/components/scams/ScamPopup';
import { ScamCall } from '@/components/scams/ScamCall';
import { PiggyChatModal } from '@/components/chat/PiggyChatModal';
import { PiggyVoiceChat } from '@/components/chat/PiggyVoiceChat';
import { useScamTrigger } from '@/hooks/useScamTrigger';
import { toast } from 'sonner';

export function DashboardScreen() {
  const { state, dispatch } = useGame();
  const [showShop, setShowShop] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [transferType, setTransferType] = useState<'save' | 'invest'>('save');
  const [showActivity, setShowActivity] = useState(false);
  const [showPiggyChat, setShowPiggyChat] = useState(false);
  const [showPiggyVoice, setShowPiggyVoice] = useState(false);
  // Scam trigger system - triggers scams every 4 "Next Month" clicks
  const { 
    popupScam, 
    callScam, 
    showPopup, 
    showCall, 
    closeScam,
    trackClick 
  } = useScamTrigger();
  
  const handleNextMonth = () => {
    if (state.currentMonth >= 12) {
      toast.info('Game complete! Check your final report.');
      return;
    }
    dispatch({ type: 'NEXT_MONTH' });
    toast.success(`Month ${state.currentMonth + 1} started! 💰 $100 allowance added.`);
    
    // Track click for scam trigger
    trackClick();
  };
  
  const handleOpenTransfer = (type: 'save' | 'invest') => {
    setTransferType(type);
    setShowTransfer(true);
  };
  
  const renderTab = () => {
    switch (state.currentTab) {
      case 'spend':
        return (
          <SpendTab
            onShopClick={() => setShowShop(true)}
            onSaveClick={() => handleOpenTransfer('save')}
            onSubscribeClick={() => setShowShop(true)}
          />
        );
      case 'invest':
        return (
          <InvestTab onInvestClick={() => handleOpenTransfer('invest')} />
        );
      case 'home':
      default:
        return <HomeTab />;
    }
  };
  
  return (
    <div className="min-h-screen bg-background pb-24">
      <Header
        onPiggyClick={() => setShowPiggyVoice(true)}
      />
      
      <TabBar />
      
      <AnimatePresence mode="wait">
        <motion.main
          key={state.currentTab}
          initial={{ opacity: 0, x: state.currentTab === 'spend' ? -20 : state.currentTab === 'invest' ? 20 : 0 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {renderTab()}
        </motion.main>
      </AnimatePresence>
      
      <BottomNav
        onMoveMoneyClick={() => handleOpenTransfer('save')}
        onActivityClick={() => setShowActivity(true)}
        onDiscoverClick={() => setShowPiggyChat(true)}
        onNextMonthClick={handleNextMonth}
      />
      
      {/* Modals */}
      <ShopModal open={showShop} onOpenChange={setShowShop} />
      <TransferModal
        open={showTransfer}
        onOpenChange={setShowTransfer}
        type={transferType}
      />
      <ActivityModal open={showActivity} onOpenChange={setShowActivity} />
      
      {/* Scam Training */}
      {popupScam && (
        <ScamPopup 
          scam={popupScam} 
          open={showPopup} 
          onClose={closeScam} 
        />
      )}
      {callScam && (
        <ScamCall 
          scam={callScam} 
          open={showCall} 
          onClose={closeScam} 
        />
      )}
      
      {/* Piggy Chat */}
      <PiggyChatModal open={showPiggyChat} onOpenChange={setShowPiggyChat} />
      
      {/* Piggy Voice */}
      <PiggyVoiceChat open={showPiggyVoice} onOpenChange={setShowPiggyVoice} />
    </div>
  );
}
