import { useGame } from '@/context/GameContext';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

interface ActivityModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ActivityModal({ open, onOpenChange }: ActivityModalProps) {
  const { state } = useGame();
  
  // Group transactions by month
  const transactionsByMonth = state.transactions.reduce((acc, txn) => {
    if (!acc[txn.month]) {
      acc[txn.month] = [];
    }
    acc[txn.month].push(txn);
    return acc;
  }, {} as Record<number, typeof state.transactions>);
  
  const months = Object.keys(transactionsByMonth)
    .map(Number)
    .sort((a, b) => b - a);
  
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl">
        <SheetHeader className="text-center pb-4">
          <SheetTitle className="flex items-center justify-center gap-2 text-xl">
            🕐 Activity
          </SheetTitle>
        </SheetHeader>
        
        <div className="overflow-y-auto max-h-[calc(85vh-100px)] space-y-6 pb-6">
          {months.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-4xl mb-3">📭</p>
              <p className="text-muted-foreground">No activity yet!</p>
            </div>
          ) : (
            months.map((month) => (
              <div key={month}>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  Month {month}
                </h3>
                <div className="space-y-1">
                  {transactionsByMonth[month].map((txn) => {
                    const isPositive = txn.amount >= 0;
                    return (
                      <div
                        key={txn.id}
                        className="flex items-center justify-between py-3 border-b border-border last:border-0"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{txn.icon}</span>
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {txn.description}
                            </p>
                            <p className="text-xs text-muted-foreground capitalize">
                              {txn.type}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`text-sm font-bold ${
                            isPositive ? 'text-primary' : 'text-foreground'
                          }`}
                        >
                          {isPositive ? '+' : '-'}${Math.abs(txn.amount)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
