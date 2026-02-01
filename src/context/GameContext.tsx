// Game state management for the financial simulation
import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface Transaction {
  id: string;
  type: 'purchase' | 'subscription' | 'transfer' | 'interest' | 'investment' | 'allowance';
  description: string;
  amount: number;
  month: number;
  icon: string;
}

export interface Subscription {
  id: string;
  name: string;
  cost: number;
  icon: string;
}

export interface GameState {
  playerName: string;
  currentMonth: number;
  currentTab: 'spend' | 'home' | 'invest';
  wallet: number;
  savings: number;
  investments: number;
  subscriptions: Subscription[];
  transactions: Transaction[];
  scamsAvoided: number;
  scamsFellFor: number;
  totalEarned: number;
  totalSpent: number;
  gameStarted: boolean;
  gameEnded: boolean;
  wealthHistory: number[];
}

type GameAction =
  | { type: 'SET_PLAYER_NAME'; payload: string }
  | { type: 'START_GAME' }
  | { type: 'SET_TAB'; payload: 'spend' | 'home' | 'invest' }
  | { type: 'BUY_ITEM'; payload: { name: string; cost: number; icon: string } }
  | { type: 'ADD_SUBSCRIPTION'; payload: Subscription }
  | { type: 'REMOVE_SUBSCRIPTION'; payload: string }
  | { type: 'TRANSFER_TO_SAVINGS'; payload: number }
  | { type: 'TRANSFER_TO_WALLET'; payload: number }
  | { type: 'TRANSFER_TO_INVESTMENTS'; payload: number }
  | { type: 'NEXT_MONTH' }
  | { type: 'SCAM_AVOIDED' }
  | { type: 'SCAM_FELL_FOR'; payload: number }
  | { type: 'RESET_GAME' };

const initialState: GameState = {
  playerName: '',
  currentMonth: 1,
  currentTab: 'home',
  wallet: 100,
  savings: 0,
  investments: 0,
  subscriptions: [],
  transactions: [],
  scamsAvoided: 0,
  scamsFellFor: 0,
  totalEarned: 100,
  totalSpent: 0,
  gameStarted: false,
  gameEnded: false,
  wealthHistory: [100],
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_PLAYER_NAME':
      return { ...state, playerName: action.payload };

    case 'START_GAME':
      return { ...state, gameStarted: true };

    case 'SET_TAB':
      return { ...state, currentTab: action.payload };

    case 'BUY_ITEM': {
      const { name, cost, icon } = action.payload;
      if (state.wallet < cost) return state;
      
      const transaction: Transaction = {
        id: `txn-${Date.now()}`,
        type: 'purchase',
        description: name,
        amount: -cost,
        month: state.currentMonth,
        icon,
      };
      
      return {
        ...state,
        wallet: state.wallet - cost,
        totalSpent: state.totalSpent + cost,
        transactions: [transaction, ...state.transactions],
      };
    }

    case 'ADD_SUBSCRIPTION': {
      const alreadyHas = state.subscriptions.some(s => s.id === action.payload.id);
      if (alreadyHas || state.wallet < action.payload.cost) return state;
      
      const transaction: Transaction = {
        id: `txn-${Date.now()}`,
        type: 'subscription',
        description: action.payload.name,
        amount: -action.payload.cost,
        month: state.currentMonth,
        icon: action.payload.icon,
      };
      
      return {
        ...state,
        wallet: state.wallet - action.payload.cost,
        totalSpent: state.totalSpent + action.payload.cost,
        subscriptions: [...state.subscriptions, action.payload],
        transactions: [transaction, ...state.transactions],
      };
    }

    case 'REMOVE_SUBSCRIPTION':
      return {
        ...state,
        subscriptions: state.subscriptions.filter(s => s.id !== action.payload),
      };

    case 'TRANSFER_TO_SAVINGS': {
      const amount = Math.min(action.payload, state.wallet);
      if (amount <= 0) return state;
      
      const transaction: Transaction = {
        id: `txn-${Date.now()}`,
        type: 'transfer',
        description: 'Transfer to Savings',
        amount: amount,
        month: state.currentMonth,
        icon: '🏦',
      };
      
      return {
        ...state,
        wallet: state.wallet - amount,
        savings: state.savings + amount,
        transactions: [transaction, ...state.transactions],
      };
    }

    case 'TRANSFER_TO_WALLET': {
      const amount = Math.min(action.payload, state.savings);
      if (amount <= 0) return state;
      
      const transaction: Transaction = {
        id: `txn-${Date.now()}`,
        type: 'transfer',
        description: 'Transfer to Wallet',
        amount: amount,
        month: state.currentMonth,
        icon: '💰',
      };
      
      return {
        ...state,
        savings: state.savings - amount,
        wallet: state.wallet + amount,
        transactions: [transaction, ...state.transactions],
      };
    }

    case 'TRANSFER_TO_INVESTMENTS': {
      const amount = Math.min(action.payload, state.wallet);
      if (amount <= 0) return state;
      
      const transaction: Transaction = {
        id: `txn-${Date.now()}`,
        type: 'investment',
        description: 'Invested',
        amount: amount,
        month: state.currentMonth,
        icon: '📈',
      };
      
      return {
        ...state,
        wallet: state.wallet - amount,
        investments: state.investments + amount,
        transactions: [transaction, ...state.transactions],
      };
    }

    case 'NEXT_MONTH': {
      if (state.currentMonth >= 12) {
        return { ...state, gameEnded: true };
      }

      // Monthly allowance
      const allowance = 100;
      
      // Savings interest (2% monthly)
      const interest = Math.round(state.savings * 0.02);
      
      // Investment returns (-15% to +20%)
      const investmentReturn = Math.round(
        state.investments * (Math.random() * 0.35 - 0.15)
      );
      
      // Subscription charges
      const subTotal = state.subscriptions.reduce((sum, s) => sum + s.cost, 0);
      
      const newTransactions: Transaction[] = [];
      
      // Add allowance transaction
      newTransactions.push({
        id: `txn-allowance-${Date.now()}`,
        type: 'allowance',
        description: 'Monthly Allowance',
        amount: allowance,
        month: state.currentMonth + 1,
        icon: '💵',
      });
      
      // Add interest if any
      if (interest > 0) {
        newTransactions.push({
          id: `txn-interest-${Date.now()}`,
          type: 'interest',
          description: 'Savings Interest',
          amount: interest,
          month: state.currentMonth + 1,
          icon: '✨',
        });
      }
      
      // Add investment return
      if (state.investments > 0) {
        newTransactions.push({
          id: `txn-invest-${Date.now()}`,
          type: 'investment',
          description: investmentReturn >= 0 ? 'Investment Gains' : 'Investment Loss',
          amount: investmentReturn,
          month: state.currentMonth + 1,
          icon: investmentReturn >= 0 ? '📈' : '📉',
        });
      }
      
      // Add subscription charges
      state.subscriptions.forEach(sub => {
        newTransactions.push({
          id: `txn-sub-${sub.id}-${Date.now()}`,
          type: 'subscription',
          description: sub.name,
          amount: -sub.cost,
          month: state.currentMonth + 1,
          icon: sub.icon,
        });
      });
      
      const newWallet = state.wallet + allowance - subTotal;
      const newSavings = state.savings + interest;
      const newInvestments = Math.max(0, state.investments + investmentReturn);
      const totalWealth = newWallet + newSavings + newInvestments;
      
      return {
        ...state,
        currentMonth: state.currentMonth + 1,
        wallet: newWallet,
        savings: newSavings,
        investments: newInvestments,
        totalEarned: state.totalEarned + allowance + interest + (investmentReturn > 0 ? investmentReturn : 0),
        totalSpent: state.totalSpent + subTotal,
        transactions: [...newTransactions, ...state.transactions],
        wealthHistory: [...state.wealthHistory, totalWealth],
      };
    }

    case 'SCAM_AVOIDED':
      return { ...state, scamsAvoided: state.scamsAvoided + 1 };

    case 'SCAM_FELL_FOR': {
      const loss = Math.min(action.payload, state.wallet);
      const transaction: Transaction = {
        id: `txn-scam-${Date.now()}`,
        type: 'purchase',
        description: 'Scam Loss',
        amount: -loss,
        month: state.currentMonth,
        icon: '🚨',
      };
      
      return {
        ...state,
        wallet: state.wallet - loss,
        totalSpent: state.totalSpent + loss,
        scamsFellFor: state.scamsFellFor + 1,
        transactions: [transaction, ...state.transactions],
      };
    }

    case 'RESET_GAME':
      return initialState;

    default:
      return state;
  }
}

interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  totalWealth: number;
  monthlyChange: number;
  monthlyChangePercent: number;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  
  const totalWealth = state.wallet + state.savings + state.investments;
  const previousWealth = state.wealthHistory[state.wealthHistory.length - 2] || state.wealthHistory[0] || 100;
  const monthlyChange = totalWealth - previousWealth;
  const monthlyChangePercent = previousWealth > 0 ? (monthlyChange / previousWealth) * 100 : 0;
  
  return (
    <GameContext.Provider value={{ state, dispatch, totalWealth, monthlyChange, monthlyChangePercent }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
