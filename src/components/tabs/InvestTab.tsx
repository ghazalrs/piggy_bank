// Invest tab - investment tracking and risk education
import { useGame } from '@/context/GameContext';
import { AlertTriangle, TrendingUp } from 'lucide-react';

interface InvestTabProps {
  onInvestClick?: () => void;
}

export function InvestTab({ onInvestClick }: InvestTabProps) {
  const { state } = useGame();
  
  // Calculate investment performance
  const investmentTransactions = state.transactions.filter(
    t => t.type === 'investment'
  );
  
  const totalInvested = investmentTransactions
    .filter(t => t.description === 'Invested')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalGains = investmentTransactions
    .filter(t => t.description.includes('Gains') || t.description.includes('Loss'))
    .reduce((sum, t) => sum + t.amount, 0);
  
  const percentChange = totalInvested > 0 
    ? ((state.investments - totalInvested) / totalInvested) * 100 
    : 0;
  
  return (
    <div className="px-4 py-6 space-y-6">
      {/* Investment Balance */}
      <div className="text-center space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Investments</p>
        <h1 className="text-5xl font-extrabold text-foreground money-display">
          ${state.investments.toLocaleString()}
        </h1>
        {totalInvested > 0 && (
          <p className={`text-sm font-semibold ${
            totalGains >= 0 ? 'text-primary' : 'text-destructive'
          }`}>
            {totalGains >= 0 ? '↑' : '↓'} ${Math.abs(totalGains)} ({percentChange.toFixed(1)}%) all time
          </p>
        )}
      </div>
      
      {/* Investment Chart */}
      {state.investments > 0 && (
        <div className="bg-card rounded-2xl p-4 border border-border">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Investment Performance
          </h3>
          <div className="h-24 flex items-end justify-center gap-1">
            {investmentTransactions
              .filter(t => t.description.includes('Gains') || t.description.includes('Loss'))
              .slice(-6)
              .map((txn, i) => {
                const isPositive = txn.amount >= 0;
                const height = Math.min(Math.abs(txn.amount) * 2, 80);
                
                return (
                  <div
                    key={i}
                    className={`w-8 rounded-t-md ${
                      isPositive ? 'bg-primary' : 'bg-destructive'
                    }`}
                    style={{ height: `${height}%` }}
                  />
                );
              })}
          </div>
        </div>
      )}
      
      {/* Risk Warning */}
      <div className="bg-warning/10 rounded-2xl p-4 border border-warning/20">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-1">
              Risk Warning
            </h3>
            <p className="text-sm text-muted-foreground">
              Investments can go up AND down! You might lose some money, but you could also earn more than savings.
            </p>
          </div>
        </div>
      </div>
      
      {/* Add Investment Button */}
      <button
        onClick={onInvestClick}
        className="w-full flex items-center justify-center gap-2 p-4 bg-primary text-primary-foreground rounded-2xl font-semibold hover:bg-primary/90 transition-colors"
      >
        <TrendingUp className="h-5 w-5" />
        <span>Add to Investments</span>
      </button>
      
      {/* Piggy's Tip */}
      <div className="bg-fun-pink/20 rounded-2xl p-4 border border-fun-pink/30">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🐷</span>
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-1">
              Piggy's Tip
            </h3>
            <p className="text-sm text-muted-foreground">
              "Only invest money you won't need soon! It's like planting a seed — it takes time to grow."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
