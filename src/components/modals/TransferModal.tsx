import { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { toast } from 'sonner';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface TransferModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'save' | 'invest';
}

export function TransferModal({ open, onOpenChange, type }: TransferModalProps) {
  const { state, dispatch } = useGame();
  const [amount, setAmount] = useState([0]);
  
  const maxAmount = state.wallet;
  const isSave = type === 'save';
  
  const handleTransfer = () => {
    if (amount[0] <= 0) {
      toast.error('Enter an amount to transfer!');
      return;
    }
    
    if (isSave) {
      dispatch({ type: 'TRANSFER_TO_SAVINGS', payload: amount[0] });
      toast.success(`Saved $${amount[0]} to your savings! 🏦`);
    } else {
      dispatch({ type: 'TRANSFER_TO_INVESTMENTS', payload: amount[0] });
      toast.success(`Invested $${amount[0]}! 📈`);
    }
    
    setAmount([0]);
    onOpenChange(false);
  };
  
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-auto rounded-t-3xl">
        <SheetHeader className="text-center pb-4">
          <SheetTitle className="flex items-center justify-center gap-2 text-xl">
            {isSave ? '🏦 Save Money' : '📈 Invest Money'}
          </SheetTitle>
        </SheetHeader>
        
        <div className="space-y-6 pb-6">
          {/* Amount Display */}
          <div className="text-center">
            <p className="text-5xl font-extrabold text-foreground money-display">
              ${amount[0]}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Available: ${state.wallet}
            </p>
          </div>
          
          {/* Slider */}
          <div className="px-4">
            <Slider
              value={amount}
              onValueChange={setAmount}
              max={maxAmount}
              step={5}
              className="w-full"
            />
          </div>
          
          {/* Quick Amount Buttons */}
          <div className="flex gap-2 justify-center">
            {[10, 25, 50].map((quickAmount) => (
              <button
                key={quickAmount}
                onClick={() => setAmount([Math.min(quickAmount, maxAmount)])}
                disabled={maxAmount < quickAmount}
                className="px-4 py-2 bg-muted rounded-full text-sm font-semibold text-foreground hover:bg-muted/80 transition-colors disabled:opacity-50"
              >
                ${quickAmount}
              </button>
            ))}
            <button
              onClick={() => setAmount([maxAmount])}
              className="px-4 py-2 bg-muted rounded-full text-sm font-semibold text-foreground hover:bg-muted/80 transition-colors"
            >
              Max
            </button>
          </div>
          
          {/* Info Box */}
          <div className={`p-4 rounded-xl ${isSave ? 'bg-primary/10' : 'bg-warning/10'}`}>
            <p className="text-sm text-foreground">
              {isSave ? (
                <>
                  <strong>Savings earn 2% interest every month!</strong>
                  <br />
                  <span className="text-muted-foreground">
                    Your money grows while you sleep. 💤
                  </span>
                </>
              ) : (
                <>
                  <strong>Investments can go up or down!</strong>
                  <br />
                  <span className="text-muted-foreground">
                    Higher risk, but could earn more than savings. 📊
                  </span>
                </>
              )}
            </p>
          </div>
          
          {/* Transfer Button */}
          <Button
            onClick={handleTransfer}
            disabled={amount[0] <= 0}
            size="lg"
            className="w-full rounded-full text-base font-semibold"
          >
            {isSave ? 'Save Money' : 'Invest Money'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
