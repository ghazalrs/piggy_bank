interface AccountTileProps {
  icon: string;
  title: string;
  balance: number;
  subtitle?: string;
  change?: number;
  changeLabel?: string;
  onClick?: () => void;
  variant?: 'wallet' | 'savings' | 'investments';
}

const variantStyles = {
  wallet: 'from-fun-yellow/20 to-fun-coral/20 hover:from-fun-yellow/30 hover:to-fun-coral/30',
  savings: 'from-fun-mint/20 to-primary/20 hover:from-fun-mint/30 hover:to-primary/30',
  investments: 'from-fun-purple/20 to-fun-blue/20 hover:from-fun-purple/30 hover:to-fun-blue/30',
};

const iconBgStyles = {
  wallet: 'bg-gradient-to-br from-fun-yellow to-fun-coral',
  savings: 'bg-gradient-to-br from-fun-mint to-primary',
  investments: 'bg-gradient-to-br from-fun-purple to-fun-blue',
};

export function AccountTile({
  icon,
  title,
  balance,
  subtitle,
  change,
  changeLabel,
  onClick,
  variant = 'wallet',
}: AccountTileProps) {
  const isPositive = change !== undefined && change >= 0;
  
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-4 bg-gradient-to-r ${variantStyles[variant]} rounded-2xl transition-all text-left hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]`}
    >
      <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${iconBgStyles[variant]} text-2xl shadow-md`}>
        {icon}
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-bold text-foreground">{title}</h3>
        {subtitle && (
          <p className="text-xs text-muted-foreground font-medium">{subtitle}</p>
        )}
      </div>
      
      <div className="text-right">
        <p className="text-lg font-extrabold text-foreground money-display">
          ${balance.toLocaleString()}
        </p>
        {change !== undefined && (
          <p className={`text-xs font-bold ${isPositive ? 'text-primary' : 'text-destructive'}`}>
            {isPositive ? '🚀' : '📉'} ${Math.abs(change)} {changeLabel}
          </p>
        )}
      </div>
    </button>
  );
}
