import { useGame } from '@/context/GameContext';
import { AccountTile } from '@/components/ui/AccountTile';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface HomeTabProps {
  onAccountClick?: (account: 'wallet' | 'savings' | 'investments') => void;
}

export function HomeTab({ onAccountClick }: HomeTabProps) {
  const { state, totalWealth, monthlyChange, monthlyChangePercent } = useGame();
  
  const isPositive = monthlyChange >= 0;
  
  return (
    <div className="px-4 py-6 space-y-6">
      {/* Total Wealth Display */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 bg-secondary px-4 py-1.5 rounded-full">
          <span className="text-lg">✨</span>
          <p className="text-sm font-bold text-fun-purple">Total Wealth</p>
        </div>
        <h1 className="text-5xl font-extrabold gradient-text money-display">
          ${totalWealth.toLocaleString()}
        </h1>
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${
          isPositive ? 'bg-green-light text-primary' : 'bg-red-light text-destructive'
        }`}>
          {isPositive ? (
            <TrendingUp className="h-4 w-4" />
          ) : (
            <TrendingDown className="h-4 w-4" />
          )}
          <span>
            {isPositive ? '+' : ''}${monthlyChange} this month ({monthlyChangePercent.toFixed(1)}%)
          </span>
          {isPositive && <span>🎉</span>}
        </div>
      </div>
      
      {/* Performance Graph */}
      <div className="bg-card rounded-3xl p-5 border-2 border-border shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">📊</span>
          <h3 className="text-sm font-bold text-foreground">Your Journey</h3>
        </div>
        <div className="flex items-end justify-between h-28 gap-1.5">
          {state.wealthHistory.map((wealth, i) => {
            const maxWealth = Math.max(...state.wealthHistory, 100);
            const heightPx = (wealth / maxWealth) * 100; // Calculate as pixels within the 112px (h-28) container
            const isLast = i === state.wealthHistory.length - 1;
            
            return (
              <div
                key={i}
                className="flex-1 flex flex-col items-center justify-end gap-1 h-full"
              >
                <div
                  className={`w-full rounded-lg transition-all ${
                    isLast ? 'gradient-bg shadow-md' : 'bg-fun-purple/30'
                  }`}
                  style={{ height: `${Math.max(heightPx, 10)}px` }}
                />
                <span className={`text-[10px] font-bold ${isLast ? 'text-fun-purple' : 'text-muted-foreground'}`}>
                  {i + 1}
                </span>
              </div>
            );
          })}
          {/* Empty slots for remaining months */}
          {Array.from({ length: 12 - state.wealthHistory.length }).map((_, i) => (
            <div key={`empty-${i}`} className="flex-1 flex flex-col items-center justify-end gap-1 h-full">
              <div className="w-full h-2 rounded-lg bg-muted/50" />
              <span className="text-[10px] text-muted-foreground/50 font-medium">
                {state.wealthHistory.length + i + 1}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Accounts Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">🏦</span>
          <h2 className="text-sm font-bold text-foreground uppercase tracking-wide">
            My Accounts
          </h2>
        </div>
        
        <div className="space-y-3">
          <AccountTile
            icon="💰"
            title="Wallet"
            balance={state.wallet}
            subtitle="Spending money"
            variant="wallet"
            onClick={() => onAccountClick?.('wallet')}
          />
          
          <AccountTile
            icon="🐷"
            title="Savings"
            balance={state.savings}
            subtitle="+2% monthly interest"
            change={state.savings > 0 ? Math.round(state.savings * 0.02) : undefined}
            changeLabel="next month"
            variant="savings"
            onClick={() => onAccountClick?.('savings')}
          />
          
          <AccountTile
            icon="🚀"
            title="Investments"
            balance={state.investments}
            subtitle="High risk, high reward"
            variant="investments"
            onClick={() => onAccountClick?.('investments')}
          />
        </div>
      </div>
    </div>
  );
}
