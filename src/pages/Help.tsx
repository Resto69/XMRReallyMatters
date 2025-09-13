import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  ChevronDown,
  ChevronRight,
  Shield,
  Lock,
  Eye,
  Zap,
  HelpCircle,
  Book,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  Users,
  Wallet,
} from 'lucide-react';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { Input } from '../components/UI/Input';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export function Help() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const categories = [
    { id: 'all', name: 'All Topics', icon: Book },
    { id: 'getting-started', name: 'Getting Started', icon: Zap },
    { id: 'trading', name: 'Trading', icon: Users },
    { id: 'security', name: 'Security & Privacy', icon: Shield },
    { id: 'wallet', name: 'Wallet', icon: Wallet },
    { id: 'disputes', name: 'Disputes', icon: AlertTriangle },
  ];

  const faqs: FAQItem[] = [
    {
      id: '1',
      category: 'getting-started',
      question: 'How do I get started with MoneroTrader?',
      answer: `Getting started is easy:

1. Create an account with just a username and password
2. Set up your Monero wallet (create new or import existing)
3. Browse available offers or create your own
4. Start trading with built-in escrow protection

No KYC or identity verification required - your privacy is protected from day one.`
    },
    {
      id: '2',
      category: 'security',
      question: 'How does the escrow system work?',
      answer: `Our escrow system uses Monero's multisig technology:

1. When a trade starts, a 2-of-3 multisig wallet is created
2. The seller deposits XMR into this escrow wallet
3. Both parties and our arbitrator hold keys
4. XMR is only released when both parties agree, or an arbitrator decides

This ensures neither party can steal funds, and disputes can be resolved fairly.`
    },
    {
      id: '3',
      category: 'trading',
      question: 'What payment methods are supported?',
      answer: `We support a wide variety of payment methods:

• Bank transfers (domestic and international)
• Digital payments (PayPal, Wise, Revolut, etc.)
• Cash in person meetings
• Gift cards and vouchers
• Other cryptocurrencies
• Custom payment methods

Each trader can specify which methods they accept in their offers.`
    },
    {
      id: '4',
      category: 'security',
      question: 'How is my privacy protected?',
      answer: `Privacy is our top priority:

• All connections routed through Tor network
• No KYC or identity verification required
• End-to-end encrypted chat messages
• Monero provides transaction privacy by default
• No personal information stored on our servers
• Optional PGP encryption for sensitive communications

Your trading activity remains completely anonymous.`
    },
    {
      id: '5',
      category: 'wallet',
      question: 'Do I need to trust you with my Monero?',
      answer: `No! MoneroTrader is completely non-custodial:

• You control your own wallet and private keys
• We never have access to your funds outside of active trades
• Escrow funds are held in multisig wallets where you hold one key
• You can withdraw your XMR at any time when not in active trades

Your funds are always under your control.`
    },
    {
      id: '6',
      category: 'trading',
      question: 'How do I create a good trading offer?',
      answer: `Tips for successful offers:

• Set competitive prices (check market rates)
• Be clear about payment methods and requirements
• Write detailed terms and conditions
• Respond quickly to trade requests
• Build reputation through successful trades
• Consider offering multiple payment options

Good offers attract more traders and build your reputation faster.`
    },
    {
      id: '7',
      category: 'disputes',
      question: 'What happens if there\'s a dispute?',
      answer: `Our dispute resolution process:

1. Either party can open a dispute during a trade
2. An experienced arbitrator reviews the evidence
3. Both parties can present their case and evidence
4. The arbitrator makes a binding decision
5. Funds are released according to the decision

Most disputes are resolved within 24-48 hours. Keep good records of your trades!`
    },
    {
      id: '8',
      category: 'security',
      question: 'How do I stay safe while trading?',
      answer: `Security best practices:

• Only trade with users who have good reputation
• Always use the platform's escrow system
• Never share your wallet seed phrase
• Verify payment before releasing XMR
• Use strong, unique passwords
• Enable Tor for all connections
• Be cautious of too-good-to-be-true offers

When in doubt, ask questions before proceeding with a trade.`
    },
    {
      id: '9',
      category: 'wallet',
      question: 'Can I use my existing Monero wallet?',
      answer: `Yes! You can:

• Import your existing wallet using your seed phrase
• Connect hardware wallets (Ledger, Trezor)
• Use view-only wallets for monitoring
• Create multiple wallets for different purposes

The platform supports all standard Monero wallet formats and provides full compatibility with existing wallets.`
    },
    {
      id: '10',
      category: 'trading',
      question: 'What are the trading fees?',
      answer: `Our fee structure is simple and transparent:

• 0.5% fee for sellers (deducted from escrow)
• 0% fee for buyers
• No deposit or withdrawal fees
• No monthly or subscription fees
• Network fees apply for blockchain transactions

Fees are only charged on successful completed trades.`
    }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = searchTerm === '' || 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const guides = [
    {
      title: 'Complete Trading Guide',
      description: 'Step-by-step guide to your first trade',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Security Best Practices',
      description: 'Keep your funds and data safe',
      icon: Shield,
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Wallet Setup Guide',
      description: 'Create and secure your Monero wallet',
      icon: Wallet,
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Privacy Features',
      description: 'Maximize your anonymity',
      icon: Eye,
      color: 'from-orange-500 to-orange-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4">Help & Support</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Everything you need to know about secure, private Monero trading
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="p-6">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search for help topics, guides, or questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 text-lg py-4"
              />
            </div>
          </Card>
        </motion.div>

        {/* Quick Guides */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Quick Start Guides</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {guides.map((guide, index) => (
              <motion.div
                key={guide.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card hover className="p-6 h-full cursor-pointer">
                  <div className={`w-12 h-12 bg-gradient-to-br ${guide.color} rounded-lg flex items-center justify-center mb-4`}>
                    <guide.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{guide.title}</h3>
                  <p className="text-gray-400 text-sm">{guide.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1"
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                      selectedCategory === category.id
                        ? 'bg-orange-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800'
                    }`}
                  >
                    <category.icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{category.name}</span>
                  </button>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* FAQ Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-3"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  Frequently Asked Questions
                </h2>
                <span className="text-sm text-gray-400">
                  {filteredFAQs.length} questions found
                </span>
              </div>

              {filteredFAQs.length === 0 ? (
                <Card className="p-8 text-center">
                  <HelpCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
                  <p className="text-gray-400">
                    Try adjusting your search terms or browse different categories
                  </p>
                </Card>
              ) : (
                filteredFAQs.map((faq, index) => (
                  <motion.div
                    key={faq.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <Card className="overflow-hidden">
                      <button
                        onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                        className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-800/50 transition-colors"
                      >
                        <h3 className="text-lg font-semibold text-white pr-4">
                          {faq.question}
                        </h3>
                        {expandedFAQ === faq.id ? (
                          <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        )}
                      </button>
                      
                      {expandedFAQ === faq.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="px-6 pb-6"
                        >
                          <div className="border-t border-gray-800 pt-4">
                            <div className="prose prose-invert max-w-none">
                              <pre className="whitespace-pre-wrap text-gray-300 leading-relaxed font-sans">
                                {faq.answer}
                              </pre>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>

        {/* Contact Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12"
        >
          <Card className="p-8 text-center">
            <MessageSquare className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-4">Still need help?</h3>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              Can't find what you're looking for? Our support team is here to help you with any questions about trading, security, or technical issues.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Contact Support
              </Button>
              <Button variant="outline" size="lg" className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Community Forum
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}