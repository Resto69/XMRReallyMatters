import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  DollarSign,
  Clock,
  MapPin,
  CreditCard,
  FileText,
  Shield,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { Input } from '../components/UI/Input';
import { useAppContext } from '../context/AppContext';

interface OfferFormData {
  type: 'buy' | 'sell';
  minAmount: string;
  maxAmount: string;
  price: string;
  priceType: 'fixed' | 'margin';
  margin: string;
  currency: string;
  paymentMethods: string[];
  location: string;
  terms: string;
  timeLimit: string;
  requiresVerification: boolean;
  autoReply: string;
}

export function CreateOffer() {
  const navigate = useNavigate();
  const { state } = useAppContext();
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<OfferFormData>({
    type: 'sell',
    minAmount: '',
    maxAmount: '',
    price: '',
    priceType: 'fixed',
    margin: '',
    currency: 'EUR', // Default value set to Euro
    paymentMethods: [],
    location: '',
    terms: '',
    timeLimit: '30',
    requiresVerification: false,
    autoReply: '',
  });

  const paymentMethodOptions = [
    { id: 'paypal', name: 'PayPal', icon: '💳' },
    { id: 'bank', name: 'Bank Transfer', icon: '🏦' },
    { id: 'wise', name: 'Wise', icon: '💸' },
    { id: 'revolut', name: 'Revolut', icon: '🔄' },
    { id: 'cash', name: 'Cash in Person', icon: '💵' },
    { id: 'crypto', name: 'Other Crypto', icon: '₿' },
  ];

  const steps = [
    { number: 1, title: 'Basic Info', description: 'Offer type and amounts' },
    { number: 2, title: 'Pricing', description: 'Set your price and currency' },
    { number: 3, title: 'Payment', description: 'Choose payment methods' },
    { number: 4, title: 'Terms', description: 'Set terms and conditions' },
    { number: 5, title: 'Review', description: 'Review and publish' },
  ];

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePaymentMethodToggle = (methodId: string) => {
    setFormData(prev => ({
      ...prev,
      paymentMethods: prev.paymentMethods.includes(methodId)
        ? prev.paymentMethods.filter(id => id !== methodId)
        : [...prev.paymentMethods, methodId]
    }));
  };

  const handlePublish = () => {
    // Here you would submit the offer to the API
    console.log('Publishing offer:', formData);
    navigate('/browse');
  };

  if (!state.user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="p-8">
            <Shield className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-4">Login Required</h2>
            <p className="text-gray-400 mb-6">You must be logged in to create an offer.</p>
            <Button onClick={() => navigate('/login')}>
              Login to Continue
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
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          
          <h1 className="text-3xl font-bold text-white mb-2">Create New Offer</h1>
          <p className="text-gray-300">
            Set up your trading offer with custom terms and pricing
          </p>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="p-6">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentStep >= step.number
                        ? 'bg-orange-600 text-white'
                        : 'bg-gray-700 text-gray-400'
                    }`}>
                      {currentStep > step.number ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        step.number
                      )}
                    </div>
                    <div className="mt-2 text-center">
                      <div className="text-sm font-medium text-white">{step.title}</div>
                      <div className="text-xs text-gray-400">{step.description}</div>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-1 mx-4 ${
                      currentStep > step.number ? 'bg-orange-600' : 'bg-gray-700'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Form Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-8">
            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-6">Basic Information</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-4">
                    What do you want to do?
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, type: 'sell' })}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        formData.type === 'sell'
                          ? 'border-orange-600 bg-orange-600/10'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <div className="text-lg font-semibold text-white mb-2">Sell XMR</div>
                      <div className="text-sm text-gray-400">I want to sell Monero for fiat</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, type: 'buy' })}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        formData.type === 'buy'
                          ? 'border-orange-600 bg-orange-600/10'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <div className="text-lg font-semibold text-white mb-2">Buy XMR</div>
                      <div className="text-sm text-gray-400">I want to buy Monero with fiat</div>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Minimum Amount (XMR)"
                    type="number"
                    value={formData.minAmount}
                    onChange={(e) => setFormData({ ...formData, minAmount: e.target.value })}
                    placeholder="0.1"
                    step="0.01"
                  />
                  <Input
                    label="Maximum Amount (XMR)"
                    type="number"
                    value={formData.maxAmount}
                    onChange={(e) => setFormData({ ...formData, maxAmount: e.target.value })}
                    placeholder="10.0"
                    step="0.01"
                  />
                </div>

                <Input
                  label="Location"
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., United States, Europe, Worldwide"
                />
              </div>
            )}

            {/* Step 2: Pricing */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-6">Pricing</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-4">
                    Pricing Method
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, priceType: 'fixed' })}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        formData.priceType === 'fixed'
                          ? 'border-orange-600 bg-orange-600/10'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <div className="text-lg font-semibold text-white mb-2">Fixed Price</div>
                      <div className="text-sm text-gray-400">Set a specific price per XMR</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, priceType: 'margin' })}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        formData.priceType === 'margin'
                          ? 'border-orange-600 bg-orange-600/10'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <div className="text-lg font-semibold text-white mb-2">Market Margin</div>
                      <div className="text-sm text-gray-400">Price based on market rate +/- margin</div>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Currency
                    </label>
                    <select
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="CAD">CAD - Canadian Dollar</option>
                      <option value="AUD">AUD - Australian Dollar</option>
                    </select>
                  </div>

                  {formData.priceType === 'fixed' ? (
                    <Input
                      label="Price per XMR"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="158.50"
                      step="0.01"
                    />
                  ) : (
                    <Input
                      label="Margin (%)"
                      type="number"
                      value={formData.margin}
                      onChange={(e) => setFormData({ ...formData, margin: e.target.value })}
                      placeholder="2.5"
                      step="0.1"
                    />
                  )}
                </div>

                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="flex items-start gap-2">
                    <DollarSign className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-500 mb-1">Pricing Tip</h4>
                      <p className="text-sm text-gray-300">
                        {formData.priceType === 'fixed' 
                          ? 'Fixed prices give you full control but may become outdated quickly.'
                          : 'Margin pricing automatically adjusts with market rates. Positive margins increase your price above market rate.'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Payment Methods */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-6">Payment Methods</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-4">
                    Select accepted payment methods
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {paymentMethodOptions.map((method) => (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => handlePaymentMethodToggle(method.id)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          formData.paymentMethods.includes(method.id)
                            ? 'border-orange-600 bg-orange-600/10'
                            : 'border-gray-700 hover:border-gray-600'
                        }`}
                      >
                        <div className="text-2xl mb-2">{method.icon}</div>
                        <div className="text-sm font-medium text-white">{method.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <Input
                  label="Payment Time Limit (minutes)"
                  type="number"
                  value={formData.timeLimit}
                  onChange={(e) => setFormData({ ...formData, timeLimit: e.target.value })}
                  placeholder="30"
                />

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="requiresVerification"
                    checked={formData.requiresVerification}
                    onChange={(e) => setFormData({ ...formData, requiresVerification: e.target.checked })}
                    className="rounded border-gray-700 bg-gray-800 text-orange-600 focus:ring-orange-500"
                  />
                  <label htmlFor="requiresVerification" className="text-sm text-gray-300">
                    Require identity verification from buyers
                  </label>
                </div>
              </div>
            )}

            {/* Step 4: Terms */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-6">Terms & Conditions</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Trading Terms
                  </label>
                  <textarea
                    value={formData.terms}
                    onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                    placeholder="Enter your trading terms and conditions..."
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors h-32 resize-none"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Be clear about payment instructions, requirements, and any special conditions.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Auto-Reply Message
                  </label>
                  <textarea
                    value={formData.autoReply}
                    onChange={(e) => setFormData({ ...formData, autoReply: e.target.value })}
                    placeholder="This message will be sent automatically when someone starts a trade with you..."
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors h-24 resize-none"
                  />
                </div>

                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-yellow-500 mb-1">Important</h4>
                      <p className="text-sm text-gray-300">
                        Make sure your terms are clear and fair. Unreasonable terms may result in disputes
                        or negative feedback from other users.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Review */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-6">Review Your Offer</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Offer Details</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Type:</span>
                          <span className="text-white capitalize">{formData.type} XMR</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Amount Range:</span>
                          <span className="text-white">{formData.minAmount} - {formData.maxAmount} XMR</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Price:</span>
                          <span className="text-white">
                            {formData.priceType === 'fixed' 
                              ? `${formData.price} ${formData.currency}`
                              : `Market ${formData.margin > '0' ? '+' : ''}${formData.margin}%`
                            }
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Location:</span>
                          <span className="text-white">{formData.location}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Time Limit:</span>
                          <span className="text-white">{formData.timeLimit} minutes</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Payment Methods</h3>
                      <div className="flex flex-wrap gap-2">
                        {formData.paymentMethods.map((methodId) => {
                          const method = paymentMethodOptions.find(m => m.id === methodId);
                          return method ? (
                            <span key={methodId} className="px-3 py-1 bg-gray-800 text-gray-300 text-sm rounded-full">
                              {method.icon} {method.name}
                            </span>
                          ) : null;
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Terms</h3>
                      <div className="p-3 bg-gray-800/50 rounded-lg">
                        <p className="text-sm text-gray-300 whitespace-pre-wrap">
                          {formData.terms || 'No specific terms set'}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">Auto-Reply</h3>
                      <div className="p-3 bg-gray-800/50 rounded-lg">
                        <p className="text-sm text-gray-300 whitespace-pre-wrap">
                          {formData.autoReply || 'No auto-reply message set'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-green-500 mb-1">Ready to Publish</h4>
                      <p className="text-sm text-gray-300">
                        Your offer looks good! Once published, it will be visible to all users and you can start receiving trade requests.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-800">
              <Button
                variant="ghost"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>

              {currentStep < 5 ? (
                <Button
                  onClick={handleNext}
                  className="flex items-center gap-2"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handlePublish}
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Publish Offer
                </Button>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}