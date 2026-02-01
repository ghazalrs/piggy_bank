// Spend tab - wallet balance, quick actions, and purchase history
import { useGame } from '@/context/GameContext';
import { ShoppingBag, PiggyBank, Tv } from 'lucide-react';

interface SpendTabProps {
  onShopClick?: () => void;
  onSaveClick?: () => void;
  onSubscribeClick?: () => void;
}

export function SpendTab({ onShopClick, onSaveClick, onSubscribeClick }: SpendTabProps) {
  const { state } = useGame();
  
  const totalSubscriptionCost = state.subscriptions.reduce((sum, s) => sum + s.cost, 0);
  
  const recentPurchases = state.transactions
    .filter(t => t.type === 'purchase' && t.amount < 0)
    .slice(0, 5);
  
  return (
    <div className="px-4 py-6 space-y-6">
      {/* Wallet Balance */}
      <div className="text-center space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Wallet</p>
        <h1 className="text-5xl font-extrabold text-foreground money-display">
          ${state.wallet.toLocaleString()}
        </h1>
        <p className="text-sm text-muted-foreground">Available to spend</p>
      </div>
      
      {/* Quick Actions */}
      <div className="bg-card rounded-2xl p-4 border border-border">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Quick Actions
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={onShopClick}
            className="flex flex-col items-center gap-2 p-4 bg-secondary rounded-xl hover:bg-muted transition-colors"
          >
            <div className="h-10 w-10 rounded-full bg-fun-yellow/20 flex items-center justify-center">
              <ShoppingBag className="h-5 w-5 text-warning" />
            </div>
            <span className="text-xs font-semibold text-foreground">Shop</span>
          </button>
          
          <button
            onClick={onSaveClick}
            className="flex flex-col items-center gap-2 p-4 bg-secondary rounded-xl hover:bg-muted transition-colors"
          >
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
              <PiggyBank className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xs font-semibold text-foreground">Save</span>
          </button>
          
          <button
            onClick={onSubscribeClick}
            className="flex flex-col items-center gap-2 p-4 bg-secondary rounded-xl hover:bg-muted transition-colors"
          >
            <div className="h-10 w-10 rounded-full bg-fun-purple/20 flex items-center justify-center">
              <Tv className="h-5 w-5 text-fun-purple" />
            </div>
            <span className="text-xs font-semibold text-foreground">Subscribe</span>
          </button>
        </div>
      </div>
      
      {/* Active Subscriptions */}
      {state.subscriptions.length > 0 && (
        <div className="bg-card rounded-2xl p-4 border border-border">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Active Subscriptions
            </h3>
            <span className="text-sm font-bold text-foreground">
              ${totalSubscriptionCost}/month
            </span>
          </div>
          <div className="space-y-2">
            {state.subscriptions.map((sub) => (
              <div
                key={sub.id}
                className="flex items-center justify-between p-3 bg-secondary rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{sub.icon}</span>
                  <span className="text-sm font-medium text-foreground">{sub.name}</span>
                </div>
                <span className="text-sm font-semibold text-muted-foreground">
                  ${sub.cost}/mo
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Recent Purchases */}
      {recentPurchases.length > 0 && (
        <div className="bg-card rounded-2xl p-4 border border-border">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Recent Purchases
          </h3>
          <div className="space-y-2">
            {recentPurchases.map((txn) => (
              <div
                key={txn.id}
                className="flex items-center justify-between py-2"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{txn.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{txn.description}</p>
                    <p className="text-xs text-muted-foreground">Month {txn.month}</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-destructive">
                  -${Math.abs(txn.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Empty State */}
      {state.subscriptions.length === 0 && recentPurchases.length === 0 && (
        <div className="text-center py-8">
          <p className="text-2xl mb-2">🛒</p>
          <p className="text-sm text-muted-foreground">
            No purchases yet. Start shopping!
          </p>
        </div>
      )}
    </div>
  );
}
