import { ArrowLeftRight, Clock, Search, Play } from 'lucide-react';
import { useGame } from '@/context/GameContext';

interface BottomNavProps {
  onMoveMoneyClick?: () => void;
  onActivityClick?: () => void;
  onDiscoverClick?: () => void;
  onNextMonthClick?: () => void;
}

const navItems = [
  { id: 'move', icon: ArrowLeftRight, label: 'Move', emoji: '💸' },
  { id: 'activity', icon: Clock, label: 'Activity', emoji: '📋' },
  { id: 'discover', icon: Search, label: 'Discover', emoji: '🔍' },
  { id: 'next', icon: Play, label: 'Next Month', emoji: '⏭️' },
] as const;

export function BottomNav({
  onMoveMoneyClick,
  onActivityClick,
  onDiscoverClick,
  onNextMonthClick,
}: BottomNavProps) {
  const { state } = useGame();
  
  const handleClick = (id: string) => {
    switch (id) {
      case 'move':
        onMoveMoneyClick?.();
        break;
      case 'activity':
        onActivityClick?.();
        break;
      case 'discover':
        onDiscoverClick?.();
        break;
      case 'next':
        onNextMonthClick?.();
        break;
    }
  };
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-t-2 border-border safe-area-inset-bottom">
      <div className="flex items-stretch justify-around px-3 py-2">
        {navItems.map((item) => {
          const isNextMonth = item.id === 'next';
          
          return (
            <button
              key={item.id}
              onClick={() => handleClick(item.id)}
              disabled={isNextMonth && state.gameEnded}
              className={`flex flex-col items-center justify-center gap-0.5 px-4 py-2 rounded-2xl transition-all min-w-[70px] ${
                isNextMonth
                  ? 'gradient-bg text-white shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary active:scale-95'
              }`}
            >
              <span className="text-xl">{item.emoji}</span>
              <span className="text-[10px] font-bold text-center leading-tight">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
