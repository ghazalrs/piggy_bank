import { useGame } from '@/context/GameContext';

interface HeaderProps {
  onPiggyClick?: () => void;
}

export function Header({ onPiggyClick }: HeaderProps) {
  const { state } = useGame();
  
  // Progress percentage for the month indicator
  const progress = (state.currentMonth / 12) * 100;
  
  return (
    <header className="sticky top-0 z-40 bg-card/90 backdrop-blur-md border-b border-border">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-secondary px-3 py-1.5 rounded-full">
            <span className="text-lg">📅</span>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-fun-purple">
                Month {state.currentMonth}
              </span>
              <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full gradient-bg rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
        
        <button
          onClick={onPiggyClick}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-fun-pink hover:scale-110 transition-transform text-xl shadow-lg animate-bounce-gentle"
          aria-label="Talk to Piggy"
        >
          🐷
        </button>
      </div>
    </header>
  );
}
