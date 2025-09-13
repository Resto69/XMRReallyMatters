import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Clock,
  CheckCircle,
  AlertTriangle,
  MessageSquare,
  Shield,
  TrendingUp,
  Filter,
  Search,
  Eye,
} from 'lucide-react';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { Input } from '../components/UI/Input';
import { useAppContext } from '../context/AppContext';
import { Trade } from '../types';

export function Trades() {
  const { state } = useAppContext();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTrades();
  }, []);

  const fetchTrades = async () => {
    setLoading(true);
    
    // Mock trades data
    const mockTrades: Trade[] = [
      {
        id: 'trade-1',
        offerId: 'offer-1',
        offer: {
          id: 'offer-1',
          sellerId: 'seller-1',
          seller: {
            id: 'seller-1',
            username: 'CryptoTrader99',
            reputation: 4.8,
            totalTrades: 127,
            successRate: 98.4,
            avgReleaseTime: '14 minutes',
            joinDate: '2022-03-15',
            verified: true,
            preferences: { notifications: true, privacy: 'high', autoAccept: false },
          },
          type: 'sell',
          amount: { min: 0.1, max: 10 },
          price: 158.50,
          priceType: 'fixed',
          currency: 'USD',
          paymentMethods: [{
            id: 'paypal',
            name: 'PayPal',
            type: 'digital',
            processingTime: 'Instant',
            icon: '💳',
          }],
          location: 'United States',
          terms: 'Fast and reliable trading.',
          timeLimit: 30,
          requiresVerification: true,
          autoReply: 'Hello! Please send payment within 30 minutes.',
          createdAt: new Date().toISOString(),
          status: 'active',
          tags: ['trusted', 'fast'],
        },
        buyerId: state.user?.id || 'current-user',
        buyer: state.user || {
          id: 'current-user',
          username: 'You',
          reputation: 0,
          totalTrades: 0,
          successRate: 0,
          avgReleaseTime: 'N/A',
          joinDate: new Date().toISOString(),
          verified: false,
          preferences: { notifications: true, privacy: 'high', autoAccept: false },
        },
        sellerId: 'seller-1',
        seller: {
          id: 'seller-1',
          username: 'CryptoTrader99',
          reputation: 4.8,
          totalTrades: 127,
          successRate: 98.4,
          avgReleaseTime: '14 minutes',
          joinDate: '2022-03-15',
          verified: true,
          preferences: { notifications: true, privacy: 'high', autoAccept: false },
        },
        amount: 2.5,
        totalPrice: 396.25,
        currency: 'USD',
        paymentMethod: {
          id: 'paypal',
          name: 'PayPal',
          type: 'digital',
          processingTime: 'Instant',
          icon: '💳',
        },
        status: 'paid',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        timeline: [
          {
            id: '1',
            type: 'created',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            actor: 'buyer',
            description: 'Trade initiated',
          },
          {
            id: '2',
            type: 'funded',
            timestamp: new Date(Date.now() - 3300000).toISOString(),
            actor: 'seller',
            description: 'Escrow funded with XMR',
          },
          {
            id: '3',
            type: 'payment_sent',
            timestamp: new Date(Date.now() - 1800000).toISOString(),
            actor: 'buyer',
            description: 'Payment sent via PayPal',
          },
        ],
        chatMessages: [],
        escrowAddress: '48JjKVkwjk39kKJJCHHSsHRJzwvQF4bK7SQYGbh8vJjVVQ9QJRaAaJGCBVnfbBDfKGFLfcjzgSF7wfkWyTGVh5C9MultiSig',
      },
      {
        id: 'trade-2',
        offerId: 'offer-2',
        offer: {
          id: 'offer-2',
          sellerId: 'seller-2',
          seller: {
            id: 'seller-2',
            username: 'MoneroMaster',
            reputation: 4.9,
            totalTrades: 89,
            successRate: 99.1,
            avgReleaseTime: '12 minutes',
            joinDate: '2021-08-20',
            verified: true,
            preferences: { notifications: true, privacy: 'high', autoAccept: false },
          },
          type: 'sell',
          amount: { min: 0.5, max: 5 },
          price: 159.75,
          priceType: 'fixed',
          currency: 'USD',
          paymentMethods: [{
            id: 'bank',
            name: 'Bank Transfer',
            type: 'bank',
            processingTime: '1-2 hours',
            icon: '🏦',
          }],
          location: 'Europe',
          terms: 'Bank transfer only, verified accounts.',
          timeLimit: 60,
          requiresVerification: true,
          autoReply: 'Please provide bank transfer receipt.',
          createdAt: new Date().toISOString(),
          status: 'active',
          tags: ['verified', 'europe'],
        },
        buyerId: state.user?.id || 'current-user',
        buyer: state.user || {
          id: 'current-user',
          username: 'You',
          reputation: 0,
          totalTrades: 0,
          successRate: 0,
          avgReleaseTime: 'N/A',
          joinDate: new Date().toISOString(),
          verified: false,
          preferences: { notifications: true, privacy: 'high', autoAccept: false },
        },
        sellerId: 'seller-2',
        seller: {
          id: 'seller-2',
          username: 'MoneroMaster',
          reputation: 4.9,
          totalTrades: 89,
          successRate: 99.1,
          avgReleaseTime: '12 minutes',
          joinDate: '2021-08-20',
          verified: true,
          preferences: { notifications: true, privacy: 'high', autoAccept: false },
        },
        amount: 1.0,
        totalPrice: 159.75,
        currency: 'USD',
        paymentMethod: {
          id: 'bank',
          name: 'Bank Transfer',
          type: 'bank',
          processingTime: '1-2 hours',
          icon: '🏦',
        },
        status: 'completed',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        timeline: [
          {
            id: '1',
            type: 'created',
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            actor: 'buyer',
            description: 'Trade initiated',
          },
          {
            id: '2',
            type: 'funded',
            timestamp: new Date(Date.now() - 86100000).toISOString(),
            actor: 'seller',
            description: 'Escrow funded with XMR',
          },
          {
            id: '3',
            type: 'payment_sent',
            timestamp: new Date(Date.now() - 82800000).toISOString(),
            actor: 'buyer',
            description: 'Bank transfer completed',
          },
          {
            id: '4',
            type: 'released',
            timestamp: new Date(Date.now() - 79200000).toISOString(),
            actor: 'seller',
            description: 'XMR released to buyer',
          },
        ],
        chatMessages: [],
        escrowAddress: '48JjKVkwjk39kKJJCHHSsHRJzwvQF4bK7SQYGbh8vJjVVQ9QJRaAaJGCBVnfbBDfKGFLfcjzgSF7wfkWyTGVh5C9MultiSig',
      },
    ];

    setTrades(mockTrades);
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-400 bg-yellow-400/20';
      case 'funded': return 'text-blue-400 bg-blue-400/20';
      case 'paid': return 'text-orange-400 bg-orange-400/20';
      case 'released': return 'text-green-400 bg-green-400/20';
      case 'completed': return 'text-green-400 bg-green-400/20';
      case 'disputed': return 'text-red-400 bg-red-400/20';
      case 'cancelled': return 'text-gray-400 bg-gray-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'funded': return <Shield className="w-4 h-4" />;
      case 'paid': return <CheckCircle className="w-4 h-4" />;
      case 'released': return <CheckCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'disputed': return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const filteredTrades = trades.filter(trade => {
    if (filter !== 'all' && trade.status !== filter) return false;
    if (searchTerm && !trade.seller.username.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  if (!state.user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="p-8">
            <Shield className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-4">Login Required</h2>
            <p className="text-gray-400 mb-6">You must be logged in to view your trades.</p>
            <Button onClick={() => window.location.href = '/login'}>
              Login to Continue
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">My Trades</h1>
          <p className="text-gray-300">
            Track your active and completed trades
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card className="p-6 text-center">
            <TrendingUp className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white mb-1">
              {trades.length}
            </div>
            <div className="text-sm text-gray-400">Total Trades</div>
          </Card>
          
          <Card className="p-6 text-center">
            <Clock className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white mb-1">
              {trades.filter(t => ['pending', 'funded', 'paid'].includes(t.status)).length}
            </div>
            <div className="text-sm text-gray-400">Active</div>
          </Card>
          
          <Card className="p-6 text-center">
            <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white mb-1">
              {trades.filter(t => t.status === 'completed').length}
            </div>
            <div className="text-sm text-gray-400">Completed</div>
          </Card>
          
          <Card className="p-6 text-center">
            <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white mb-1">
              {trades.filter(t => t.status === 'disputed').length}
            </div>
            <div className="text-sm text-gray-400">Disputed</div>
          </Card>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <Card className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search by trader username..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2">
                {['all', 'pending', 'funded', 'paid', 'completed', 'disputed'].map((status) => (
                  <Button
                    key={status}
                    variant={filter === status ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setFilter(status)}
                    className="capitalize"
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Trades List */}
        <div className="space-y-4">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="h-4 bg-gray-800 rounded w-32 mb-2" />
                    <div className="h-6 bg-gray-800 rounded w-48 mb-4" />
                    <div className="h-4 bg-gray-800 rounded w-64" />
                  </div>
                  <div className="h-10 bg-gray-800 rounded w-24" />
                </div>
              </Card>
            ))
          ) : filteredTrades.length === 0 ? (
            <Card className="p-12 text-center">
              <TrendingUp className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No trades found</h3>
              <p className="text-gray-400 mb-6">
                {filter === 'all' 
                  ? "You haven't started any trades yet. Browse offers to get started!"
                  : `No ${filter} trades found. Try adjusting your filters.`
                }
              </p>
              <Link to="/browse">
                <Button>Browse Offers</Button>
              </Link>
            </Card>
          ) : (
            filteredTrades.map((trade, index) => (
              <motion.div
                key={trade.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover className="p-6">
                  <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
                    {/* Left side - Trade details */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(trade.status)}`}>
                          {getStatusIcon(trade.status)}
                          {trade.status.toUpperCase()}
                        </span>
                        <span className="text-sm text-gray-400">
                          {new Date(trade.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 mb-4">
                        <h3 className="text-lg font-semibold text-white">
                          {trade.offer.type === 'sell' ? 'Buying' : 'Selling'} {trade.amount} XMR
                        </h3>
                        <span className="text-sm text-gray-400">
                          from {trade.seller.username}
                        </span>
                        {trade.seller.verified && (
                          <Shield className="w-4 h-4 text-green-500" />
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <div className="text-sm text-gray-400">Total Price</div>
                          <div className="text-lg font-semibold text-orange-500">
                            ${trade.totalPrice.toFixed(2)}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-400">Payment Method</div>
                          <div className="text-white flex items-center gap-2">
                            <span>{trade.paymentMethod.icon}</span>
                            {trade.paymentMethod.name}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-400">Escrow Address</div>
                          <div className="text-xs text-gray-300 font-mono">
                            {trade.escrowAddress.slice(0, 12)}...{trade.escrowAddress.slice(-8)}
                          </div>
                        </div>
                      </div>

                      {/* Timeline */}
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>Last update: {new Date(trade.timeline[trade.timeline.length - 1].timestamp).toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Right side - Actions */}
                    <div className="flex flex-col gap-3">
                      <Link to={`/trade/${trade.id}`}>
                        <Button className="w-full flex items-center gap-2">
                          <Eye className="w-4 h-4" />
                          View Trade
                        </Button>
                      </Link>
                      
                      {['pending', 'funded', 'paid'].includes(trade.status) && (
                        <Link to={`/trade/${trade.id}#chat`}>
                          <Button variant="outline" className="w-full flex items-center gap-2">
                            <MessageSquare className="w-4 h-4" />
                            Chat
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}