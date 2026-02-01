import { motion } from 'framer-motion';
import { useGame } from '@/context/GameContext';

type Tab = 'spend' | 'home' | 'invest';

const tabs: { id: Tab; label: string; emoji: string }[] = [
  { id: 'spend', label: 'Spend', emoji: '🛍️' },
  { id: 'home', label: 'Home', emoji: '🏠' },
  { id: 'invest', label: 'Invest', emoji: '📈' },
];

export function TabBar() {
  const { state, dispatch } = useGame();
  
  return (
    <div className="flex items-center justify-center gap-2 px-4 py-3">
      <div className="inline-flex items-center rounded-full bg-secondary p-1.5 shadow-inner">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => dispatch({ type: 'SET_TAB', payload: tab.id })}
            className={`relative px-5 py-2.5 text-sm font-bold rounded-full transition-all ${
              state.currentTab === tab.id
                ? 'text-white'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {state.currentTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 gradient-bg rounded-full shadow-lg"
                transition={{ type: 'spring', bounce: 0.25, duration: 0.5 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              <span>{tab.emoji}</span>
              <span>{tab.label}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
