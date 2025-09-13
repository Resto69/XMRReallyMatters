import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Star,
  Clock,
  Shield,
  MapPin,
  DollarSign,
  Users,
  ChevronDown,
  RefreshCw,
} from 'lucide-react';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { Input } from '../components/UI/Input';
import { apiService } from '../services/api';
import { Offer, PaymentMethod } from '../types';
import { Link } from 'react-router-dom';

export function Browse() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: 'all', // 'all', 'buy', 'sell'
    minAmount: '',
    maxAmount: '',
    minPrice: '',
    maxPrice: '',
    paymentMethod: 'all',
    location: '',
    verified: false,
  });

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const data = await apiService.getOffers(filters);
      setOffers(data);
    } catch (error) {
      console.error('Failed to fetch offers:', error);
    }
    setLoading(false);
  };

  const filteredOffers = offers.filter((offer) => {
    if (searchTerm && !offer.seller.username.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (filters.type !== 'all' && offer.type !== filters.type) {
      return false;
    }
    if (filters.verified && !offer.seller.verified) {
      return false;
    }
    return true;
  });

  const paymentMethods = [
    { id: 'all', name: 'All Methods' },
    { id: 'paypal', name: 'PayPal' },
    { id: 'bank', name: 'Bank Transfer' },
    { id: 'crypto', name: 'Cryptocurrency' },
    { id: 'cash', name: 'Cash' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Browse Offers</h1>
          <p className="text-gray-300">
            Find the best XMR trading opportunities from verified sellers
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search by username..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filters
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </Button>
              <Button
                variant="secondary"
                onClick={fetchOffers}
                disabled={loading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="border-t border-gray-800 pt-4 mt-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Offer Type
                    </label>
                    <select
                      value={filters.type}
                      onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="all">All Types</option>
                      <option value="buy">Buy XMR</option>
                      <option value="sell">Sell XMR</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Payment Method
                    </label>
                    <select
                      value={filters.paymentMethod}
                      onChange={(e) => setFilters({ ...filters, paymentMethod: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      {paymentMethods.map((method) => (
                        <option key={method.id} value={method.id}>
                          {method.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Input
                    label="Min Amount (XMR)"
                    type="number"
                    value={filters.minAmount}
                    onChange={(e) => setFilters({ ...filters, minAmount: e.target.value })}
                    placeholder="0.1"
                  />

                  <Input
                    label="Max Amount (XMR)"
                    type="number"
                    value={filters.maxAmount}
                    onChange={(e) => setFilters({ ...filters, maxAmount: e.target.value })}
                    placeholder="100"
                  />
                </div>

                <div className="flex items-center mt-4">
                  <input
                    type="checkbox"
                    id="verified"
                    checked={filters.verified}
                    onChange={(e) => setFilters({ ...filters, verified: e.target.checked })}
                    className="rounded border-gray-700 bg-gray-800 text-orange-600 focus:ring-orange-500"
                  />
                  <label htmlFor="verified" className="ml-2 text-sm text-gray-300">
                    Show only verified sellers
                  </label>
                </div>
              </motion.div>
            )}
          </Card>
        </motion.div>

        {/* Offers List */}
        <div className="grid gap-6">
          {loading ? (
            // Loading state
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="h-4 bg-gray-800 rounded w-32 mb-2" />
                    <div className="h-6 bg-gray-800 rounded w-48 mb-4" />
                    <div className="h-4 bg-gray-800 rounded w-64" />
                  </div>
                  <div className="h-10 bg-gray-800 rounded w-24" />
                </div>
              </Card>
            ))
          ) : filteredOffers.length === 0 ? (
            // Empty state
            <Card className="p-12 text-center">
              <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No offers found</h3>
              <p className="text-gray-400 mb-6">
                Try adjusting your search criteria or refresh the page
              </p>
              <Button onClick={fetchOffers}>Refresh Offers</Button>
            </Card>
          ) : (
            // Offers list
            filteredOffers.map((offer, index) => (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover className="p-6">
                  <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
                    {/* Left side - Offer details */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-semibold text-white">
                            {offer.seller.username}
                          </span>
                          {offer.seller.verified && (
                            <Shield className="w-4 h-4 text-green-500" />
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm text-gray-300">
                            {offer.seller.reputation}
                          </span>
                        </div>
                        <span className="px-2 py-1 bg-orange-600/20 text-orange-400 text-xs rounded-full font-medium">
                          {offer.type === 'buy' ? 'BUYING' : 'SELLING'} XMR
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-gray-300">
                          <DollarSign className="w-4 h-4" />
                          <span className="text-sm">
                            ${offer.price.toFixed(2)} per XMR
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                          <Users className="w-4 h-4" />
                          <span className="text-sm">
                            {offer.amount.min} - {offer.amount.max} XMR
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">{offer.timeLimit} min limit</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-300">{offer.location}</span>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {offer.paymentMethods.map((method) => (
                          <span
                            key={method.id}
                            className="px-3 py-1 bg-gray-800 text-gray-300 text-xs rounded-full"
                          >
                            {method.name}
                          </span>
                        ))}
                      </div>

                      <p className="text-sm text-gray-400 line-clamp-2">
                        {offer.terms}
                      </p>
                    </div>

                    {/* Right side - Actions */}
                    <div className="flex flex-col gap-3">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-orange-500">
                          ${(offer.amount.min * offer.price).toFixed(0)}
                        </div>
                        <div className="text-sm text-gray-400">
                          Min: ${(offer.amount.min * offer.price).toFixed(0)}
                        </div>
                      </div>
                      <Link to={`/offer/${offer.id}`}>
                        <Button className="w-full">
                          {offer.type === 'sell' ? 'Buy XMR' : 'Sell XMR'}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </div>

        {/* Pagination could go here */}
      </div>
    </div>
  );
}