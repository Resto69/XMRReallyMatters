export interface User {
  id: string;
  username: string;
  reputation: number;
  totalTrades: number;
  successRate: number;
  avgReleaseTime: string;
  joinDate: string;
  verified: boolean;
  avatar?: string;
  pgpKey?: string;
  preferences: {
    notifications: boolean;
    privacy: 'low' | 'medium' | 'high';
    autoAccept: boolean;
  };
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'bank' | 'crypto' | 'cash' | 'digital';
  processingTime: string;
  icon: string;
  fees?: string;
}

export interface Offer {
  id: string;
  sellerId: string;
  seller: User;
  type: 'buy' | 'sell';
  amount: {
    min: number;
    max: number;
  };
  price: number;
  priceType: 'fixed' | 'margin';
  margin?: number;
  currency: string;
  paymentMethods: PaymentMethod[];
  location: string;
  terms: string;
  timeLimit: number; // in minutes
  requiresVerification: boolean;
  autoReply: string;
  createdAt: string;
  status: 'active' | 'paused' | 'completed';
  tags: string[];
}

export interface Trade {
  id: string;
  offerId: string;
  offer: Offer;
  buyerId: string;
  buyer: User;
  sellerId: string;
  seller: User;
  amount: number;
  totalPrice: number;
  currency: string;
  paymentMethod: PaymentMethod;
  status: 'pending' | 'funded' | 'paid' | 'released' | 'disputed' | 'completed' | 'cancelled';
  createdAt: string;
  timeline: TradeEvent[];
  chatMessages: ChatMessage[];
  escrowAddress: string;
  disputeReason?: string;
  arbitrator?: User;
}

export interface TradeEvent {
  id: string;
  type: 'created' | 'funded' | 'payment_sent' | 'payment_received' | 'released' | 'disputed' | 'resolved';
  timestamp: string;
  actor: 'buyer' | 'seller' | 'arbitrator' | 'system';
  description: string;
}

export interface ChatMessage {
  id: string;
  tradeId: string;
  senderId: string;
  message: string;
  encrypted: boolean;
  timestamp: string;
  attachments?: FileAttachment[];
}

export interface FileAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

export interface Dispute {
  id: string;
  tradeId: string;
  trade: Trade;
  reason: string;
  description: string;
  evidence: FileAttachment[];
  status: 'open' | 'investigating' | 'resolved';
  arbitrator?: User;
  resolution?: string;
  createdAt: string;
}

export interface WalletData {
  address: string;
  balance: {
    total: number;
    available: number;
    pending: number;
  };
  mnemonic?: string;
  isConnected: boolean;
  height: number;
}

export interface Transaction {
  id: string;
  hash: string;
  type: 'incoming' | 'outgoing';
  amount: number;
  fee: number;
  confirmations: number;
  timestamp: string;
  address: string;
  note?: string;
}

export interface MarketStats {
  activeOffers: number;
  totalVolume: number;
  totalUsers: number;
  avgPrice: number;
  priceChange: number;
}