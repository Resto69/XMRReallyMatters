import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Star,
  Shield,
  Clock,
  MapPin,
  DollarSign,
  AlertTriangle,
  Users,
  CheckCircle,
} from 'lucide-react';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { Input } from '../components/UI/Input';
import { Modal } from '../components/UI/Modal';
import { apiService } from '../services/api';
import { useAppContext } from '../context/AppContext';
import { Offer } from '../types';

export function OfferDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state } = useAppContext();
  const [offer, setOffer] = useState<Offer | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [tradeAmount, setTradeAmount] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  useEffect(() => {
    if (id) {
      fetchOffer(id);
    }
  }, [id]);

  const fetchOffer = async (offerId: string) => {
    setLoading(true);
    try {
      // For demo, create a mock detailed offer
      const mockOffer: Offer = {
        id: offerId,
        sellerId: 'user1',
        seller: {
          id: 'user1',
          username: 'CryptoTrader99',
          reputation: 4.8,
          totalTrades: 127,
          successRate: 98.4,
          avgReleaseTime: '14 minutes',
          joinDate: '2022-03-15',
          verified: true,
          preferences: {
            notifications: true,
            privacy: 'high',
            autoAccept: false,
          },
        },
        type: 'sell',
        amount: { min: 0.1, max: 10 },
        price: 158.50,
        priceType: 'fixed',
        currency: 'USD',
        paymentMethods: [
          {
            id: 'paypal',
            name: 'PayPal',
            type: 'digital',
            processingTime: 'Instant',
            icon: '💳',
            fees: '2.9% + $0.30',
          },
        ],
        location: 'United States',
        terms: `Welcome to my trading terms:

1. Payment must be completed within 30 minutes of trade initiation
2. Only verified PayPal accounts accepted
3. Include trade ID in payment notes
4. No chargebacks or disputes after XMR is released
5. Contact me via encrypted chat if you have questions

I've been trading XMR for over 2 years with 100% positive feedback. Looking forward to a smooth transaction!`,
        timeLimit: 30,
        requiresVerification: true,
        autoReply: 'Hello! Please send payment within 30 minutes and include the trade ID in your payment notes.',
        createdAt: new Date().toISOString(),
        status: 'active',
        tags: ['trusted', 'fast', 'verified'],
      };
      
      setOffer(mockOffer);
    } catch (error) {
      console.error('Failed to fetch offer:', error);
    }
    setLoading(false);
  };

  const handleStartTrade = async () => {
    if (!offer || !state.user) return;

    const amount = parseFloat(tradeAmount);
    if (amount < offer.amount.min || amount > offer.amount.max) {
      alert(`Amount must be between ${offer.amount.min} and ${offer.amount.max} XMR`);
      return;
    }

    try {
      const trade = await apiService.startTrade(offer.id, amount);
      navigate(`/trade/${trade.id}`);
    } catch (error) {
      console.error('Failed to start trade:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 animate-pulse">
            <div className="h-8 bg-gray-800 rounded w-1/3 mb-4" />
            <div className="h-4 bg-gray-800 rounded w-2/3 mb-6" />
            <div className="space-y-3">
              <div className="h-4 bg-gray-800 rounded" />
              <div className="h-4 bg-gray-800 rounded w-5/6" />
              <div className="h-4 bg-gray-800 rounded w-4/6" />
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="p-8">
            <h2 className="text-xl font-semibold text-white mb-4">Offer Not Found</h2>
            <p className="text-gray-400 mb-6">The offer you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/browse')}>
              Browse Other Offers
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Browse
          </Button>
          
          <h1 className="text-3xl font-bold text-white mb-2">
            {offer.type === 'sell' ? 'Buy' : 'Sell'} XMR from {offer.seller.username}
          </h1>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Offer Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-orange-600/20 text-orange-400 text-sm rounded-full font-medium">
                      {offer.type === 'buy' ? 'BUYING' : 'SELLING'} XMR
                    </span>
                    <span className={`px-3 py-1 text-sm rounded-full font-medium ${
                      offer.status === 'active'
                        ? 'bg-green-600/20 text-green-400'
                        : 'bg-gray-600/20 text-gray-400'
                    }`}>
                      {offer.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <div className="flex items-center gap-2 text-gray-300 mb-2">
                      <DollarSign className="w-4 h-4" />
                      <span className="font-medium">Price</span>
                    </div>
                    <div className="text-2xl font-bold text-orange-500">
                      ${offer.price.toFixed(2)} per XMR
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-gray-300 mb-2">
                      <Users className="w-4 h-4" />
                      <span className="font-medium">Amount Range</span>
                    </div>
                    <div className="text-xl text-white">
                      {offer.amount.min} - {offer.amount.max} XMR
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-gray-300 mb-2">
                      <Clock className="w-4 h-4" />
                      <span className="font-medium">Payment Time</span>
                    </div>
                    <div className="text-lg text-white">{offer.timeLimit} minutes</div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-gray-300 mb-2">
                      <MapPin className="w-4 h-4" />
                      <span className="font-medium">Location</span>
                    </div>
                    <div className="text-lg text-white">{offer.location}</div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Payment Methods</h3>
                  <div className="space-y-2">
                    {offer.paymentMethods.map((method) => (
                      <div key={method.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{method.icon}</span>
                          <div>
                            <div className="font-medium text-white">{method.name}</div>
                            <div className="text-sm text-gray-400">
                              Processing: {method.processingTime}
                            </div>
                          </div>
                        </div>
                        {method.fees && (
                          <div className="text-sm text-gray-400">
                            Fees: {method.fees}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Terms and Conditions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <h3 className="text-lg font-semibold text-white mb-4">Terms and Conditions</h3>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <pre className="whitespace-pre-wrap text-gray-300 leading-relaxed text-sm font-mono">
                    {offer.terms}
                  </pre>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Seller Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <h3 className="text-lg font-semibold text-white mb-4">Seller Information</h3>
                
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {offer.seller.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{offer.seller.username}</span>
                      {offer.seller.verified && (
                        <Shield className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      <span>{offer.seller.reputation} rating</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Trades</span>
                    <span className="text-white">{offer.seller.totalTrades}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Success Rate</span>
                    <span className="text-green-400">{offer.seller.successRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Avg. Release Time</span>
                    <span className="text-white">{offer.seller.avgReleaseTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Member Since</span>
                    <span className="text-white">
                      {new Date(offer.seller.joinDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Trade Action */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <h3 className="text-lg font-semibold text-white mb-4">Start Trade</h3>
                
                {!state.user ? (
                  <div className="text-center">
                    <p className="text-gray-400 mb-4">You must be logged in to trade</p>
                    <Button onClick={() => navigate('/login')} className="w-full">
                      Login to Trade
                    </Button>
                  </div>
                ) : (
                  <>
                    <Input
                      label={`Amount (${offer.amount.min} - ${offer.amount.max} XMR)`}
                      type="number"
                      value={tradeAmount}
                      onChange={(e) => setTradeAmount(e.target.value)}
                      placeholder={`Min: ${offer.amount.min}`}
                      className="mb-4"
                    />
                    
                    {tradeAmount && (
                      <div className="mb-4 p-3 bg-gray-800 rounded-lg">
                        <div className="text-sm text-gray-400 mb-1">You will pay:</div>
                        <div className="text-xl font-bold text-orange-500">
                          ${(parseFloat(tradeAmount) * offer.price).toFixed(2)}
                        </div>
                      </div>
                    )}

                    <Button
                      onClick={() => setShowTradeModal(true)}
                      disabled={!tradeAmount || parseFloat(tradeAmount) < offer.amount.min || parseFloat(tradeAmount) > offer.amount.max}
                      className="w-full mb-4"
                    >
                      {offer.type === 'sell' ? 'Buy XMR' : 'Sell XMR'}
                    </Button>

                    <div className="flex items-start gap-2 text-xs text-gray-400">
                      <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span>
                        Trades are secured by multisig escrow. Only trade with trusted users
                        and follow platform guidelines.
                      </span>
                    </div>
                  </>
                )}
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Trade Confirmation Modal */}
        <Modal
          isOpen={showTradeModal}
          onClose={() => setShowTradeModal(false)}
          title="Confirm Trade"
          size="md"
        >
          <div className="space-y-4">
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-500 mb-1">Security Warning</h4>
                  <p className="text-sm text-gray-300">
                    This trade will be secured by multisig escrow. Make sure you understand
                    the seller's terms before proceeding.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Selling</span>
                <span className="text-white">{tradeAmount} XMR</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Price per XMR</span>
                <span className="text-white">${offer?.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Payment Method</span>
                <span className="text-white">{offer?.paymentMethods[0].name}</span>
              </div>
              <div className="flex justify-between font-semibold border-t border-gray-800 pt-3">
                <span className="text-white">Total</span>
                <span className="text-orange-500">
                  ${tradeAmount ? (parseFloat(tradeAmount) * offer!.price).toFixed(2) : '0.00'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="agreeTerms"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="rounded border-gray-700 bg-gray-800 text-orange-600 focus:ring-orange-500"
              />
              <label htmlFor="agreeTerms" className="text-sm text-gray-300">
                I agree to the seller's terms and conditions
              </label>
            </div>

            <div className="flex gap-3">
              <Button
                variant="ghost"
                onClick={() => setShowTradeModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleStartTrade}
                disabled={!agreeToTerms}
                className="flex-1"
              >
                Start Escrow Trade
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}