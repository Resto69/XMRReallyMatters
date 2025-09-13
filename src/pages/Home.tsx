import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield,
  Users,
  TrendingUp,
  Lock,
  Eye,
  Zap,
  Globe,
  Star,
} from 'lucide-react';
import { Button } from '../components/UI/Button';
import { Card, GlassCard } from '../components/UI/Card';
import { apiService } from '../services/api';
import { MarketStats } from '../types';

export function Home() {
  const [stats, setStats] = useState<MarketStats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const marketStats = await apiService.getMarketStats();
        setStats(marketStats);
      } catch (error) {
        console.error('Failed to fetch market stats:', error);
      }
    };

    fetchStats();
  }, []);

  const features = [
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Complete anonymity with Tor integration and end-to-end encryption',
    },
    {
      icon: Lock,
      title: 'Secure Escrow',
      description: 'Multi-signature escrow system protects both buyers and sellers',
    },
    {
      icon: Eye,
      title: 'No KYC Required',
      description: 'Trade without identity verification or personal information',
    },
    {
      icon: Zap,
      title: 'Fast Settlements',
      description: 'Quick transaction processing with Monero\'s privacy features',
    },
    {
      icon: Globe,
      title: 'Global Access',
      description: 'Trade with users worldwide using various payment methods',
    },
    {
      icon: Star,
      title: 'Reputation System',
      description: 'Build trust through verified trading history and reviews',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-600/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Privacy-First
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">
                {' '}Monero{' '}
              </span>
              Trading
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Trade Monero (XMR) peer-to-peer with complete privacy and security. 
              No KYC, no tracking, just secure anonymous transactions.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="px-8 py-4">
                <Link to="/browse" className="flex items-center">
                  Browse Offers
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-4">
                <Link to="/register" className="flex items-center">
                  Start Trading
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            <GlassCard className="text-center">
              <div className="text-3xl font-bold text-orange-500 mb-2">
                {stats?.activeOffers.toLocaleString() || '---'}
              </div>
              <div className="text-gray-300">Active Offers</div>
            </GlassCard>
            
            <GlassCard className="text-center">
              <div className="text-3xl font-bold text-orange-500 mb-2">
                {stats?.totalVolume.toLocaleString() || '---'} XMR
              </div>
              <div className="text-gray-300">Total Volume</div>
            </GlassCard>
            
            <GlassCard className="text-center">
              <div className="text-3xl font-bold text-orange-500 mb-2">
                {stats?.totalUsers.toLocaleString() || '---'}
              </div>
              <div className="text-gray-300">Trusted Users</div>
            </GlassCard>
            
            <GlassCard className="text-center">
              <div className="text-3xl font-bold text-orange-500 mb-2">
                ${stats?.avgPrice.toFixed(2) || '---'}
              </div>
              <div className="text-gray-300">Average Price</div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Built with privacy, security, and user experience in mind
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <Card hover className="h-full">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mr-4">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 to-orange-500/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center"
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Start Trading?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of users already trading Monero privately and securely
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="px-8 py-4">
                <Link to="/register">Create Account</Link>
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-4">
                <Link to="/help">Learn More</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}