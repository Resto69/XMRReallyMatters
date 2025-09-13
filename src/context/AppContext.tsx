import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { User, Trade, WalletData } from '../types';

interface AppState {
  user: User | null;
  wallet: WalletData | null;
  darkMode: boolean;
  torConnected: boolean;
  activeTrades: Trade[];
  notifications: string[];
  isLoading: boolean;
}

type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_WALLET'; payload: WalletData | null }
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'SET_TOR_STATUS'; payload: boolean }
  | { type: 'ADD_TRADE'; payload: Trade }
  | { type: 'UPDATE_TRADE'; payload: { id: string; updates: Partial<Trade> } }
  | { type: 'ADD_NOTIFICATION'; payload: string }
  | { type: 'REMOVE_NOTIFICATION'; payload: number }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: AppState = {
  user: null,
  wallet: null,
  darkMode: true,
  torConnected: false,
  activeTrades: [],
  notifications: [],
  isLoading: false,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_WALLET':
      return { ...state, wallet: action.payload };
    case 'TOGGLE_DARK_MODE':
      return { ...state, darkMode: !state.darkMode };
    case 'SET_TOR_STATUS':
      return { ...state, torConnected: action.payload };
    case 'ADD_TRADE':
      return { ...state, activeTrades: [...state.activeTrades, action.payload] };
    case 'UPDATE_TRADE':
      return {
        ...state,
        activeTrades: state.activeTrades.map(trade =>
          trade.id === action.payload.id
            ? { ...trade, ...action.payload.updates }
            : trade
        ),
      };
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter((_, index) => index !== action.payload),
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}