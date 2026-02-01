// Shop modal for purchasing items and managing subscriptions
import { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { shopItems, subscriptionItems } from '@/data/items';
import { toast } from 'sonner';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

interface ShopModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShopModal({ open, onOpenChange }: ShopModalProps) {
  const { state, dispatch } = useGame();
  const [tab, setTab] = useState<'shop' | 'subscribe'>('shop');
  
  const categories = [
    { id: 'treats', label: 'Treats' },
    { id: 'entertainment', label: 'Entertainment' },
    { id: 'tech', label: 'Tech & Gear' },
    { id: 'goals', label: 'Big Goals 🎯' },
  ];
  
  const handleBuy = (item: typeof shopItems[0]) => {
    if (state.wallet < item.price) {
      toast.error("Not enough money! 😢");
      return;
    }
    dispatch({ type: 'BUY_ITEM', payload: { name: item.name, cost: item.price, icon: item.icon } });
    toast.success(`You bought ${item.name}! ${item.icon}`);
  };
  
  const handleSubscribe = (sub: typeof subscriptionItems[0]) => {
    if (state.subscriptions.some(s => s.id === sub.id)) {
      toast.info("You already have this subscription!");
      return;
    }
    if (state.wallet < sub.cost) {
      toast.error("Not enough money for the first payment! 😢");
      return;
    }
    dispatch({ type: 'ADD_SUBSCRIPTION', payload: sub });
    toast.success(`Subscribed to ${sub.name}! ${sub.icon}`);
  };
  
  const handleUnsubscribe = (sub: typeof subscriptionItems[0]) => {
    dispatch({ type: 'REMOVE_SUBSCRIPTION', payload: sub.id });
    toast.success(`Unsubscribed from ${sub.name}! 👋`);
  };
  
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl">
        <SheetHeader className="text-center pb-4">
          <SheetTitle className="flex items-center justify-center gap-2 text-xl">
            {tab === 'shop' ? '🛒 Shop' : '📺 Subscribe'}
          </SheetTitle>
          <p className="text-sm text-muted-foreground">
            Wallet: <span className="font-bold text-foreground">${state.wallet}</span>
          </p>
        </SheetHeader>
        
        {/* Tab Switcher */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setTab('shop')}
            className={`flex-1 py-2 rounded-full text-sm font-semibold transition-colors ${
              tab === 'shop'
                ? 'bg-foreground text-background'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            Shop
          </button>
          <button
            onClick={() => setTab('subscribe')}
            className={`flex-1 py-2 rounded-full text-sm font-semibold transition-colors ${
              tab === 'subscribe'
                ? 'bg-foreground text-background'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            Subscribe
          </button>
        </div>
        
        <div className="overflow-y-auto max-h-[calc(85vh-180px)] space-y-6 pb-6">
          {tab === 'shop' ? (
            <>
              {categories.map((cat) => {
                const items = shopItems.filter((i) => i.category === cat.id);
                return (
                  <div key={cat.id}>
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                      {cat.label}
                    </h3>
                    <div className="grid grid-cols-4 gap-2">
                      {items.map((item) => {
                        const canAfford = state.wallet >= item.price;
                        return (
                          <button
                            key={item.id}
                            onClick={() => handleBuy(item)}
                            disabled={!canAfford}
                            className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-all ${
                              canAfford
                                ? 'bg-card border-border hover:border-primary hover:shadow-md'
                                : 'bg-muted/50 border-transparent opacity-50'
                            }`}
                          >
                            <span className="text-2xl">{item.icon}</span>
                            <span className="text-[10px] font-medium text-foreground truncate w-full text-center">
                              {item.name}
                            </span>
                            <span className={`text-xs font-bold ${canAfford ? 'text-primary' : 'text-muted-foreground'}`}>
                              ${item.price}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <div className="space-y-2">
              {subscriptionItems.map((sub) => {
                const hasIt = state.subscriptions.some(s => s.id === sub.id);
                const canAfford = state.wallet >= sub.cost;
                
                return (
                  <div
                    key={sub.id}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                      hasIt
                        ? 'bg-primary/10 border-primary'
                        : canAfford
                        ? 'bg-card border-border'
                        : 'bg-muted/50 border-transparent opacity-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{sub.icon}</span>
                      <div className="text-left">
                        <p className="text-sm font-semibold text-foreground">{sub.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {hasIt ? 'Subscribed ✓' : 'Monthly subscription'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${hasIt ? 'text-primary' : 'text-foreground'}`}>
                        ${sub.cost}/mo
                      </span>
                      {hasIt ? (
                        <button
                          onClick={() => handleUnsubscribe(sub)}
                          className="px-3 py-1.5 text-xs font-semibold rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                        >
                          Cancel
                        </button>
                      ) : (
                        <button
                          onClick={() => handleSubscribe(sub)}
                          disabled={!canAfford}
                          className="px-3 py-1.5 text-xs font-semibold rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Subscribe
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
