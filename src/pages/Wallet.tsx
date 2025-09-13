import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Wallet as WalletIcon,
  Plus,
  Minus,
  RefreshCw,
  Copy,
  Eye,
  EyeOff,
  Download,
  Upload,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  Settings,
  Bell,
  Globe,
  Lock,
  Zap,
  DollarSign,
} from 'lucide-react';
import { Card, GlassCard } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { Input } from '../components/UI/Input';
import { Modal } from '../components/UI/Modal';
import { useWallet, useTransactions } from '../hooks/useWallet';
import { useAppContext } from '../context/AppContext';

export function Wallet() {
  const { state } = useAppContext();
  const { wallet, isInitializing, createWallet, restoreWallet, sendTransaction } = useWallet();
  const { transactions, isLoading: transactionsLoading, refetch } = useTransactions();
  
  const [showBalance, setShowBalance] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showMnemonic, setShowMnemonic] = useState(false);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  
  const [createForm, setCreateForm] = useState({ password: '', confirmPassword: '' });
  const [restoreForm, setRestoreForm] = useState({ mnemonic: '', password: '' });
  const [sendForm, setSendForm] = useState({ address: '', amount: '', note: '' });
  
  // Advanced Settings State
  const [settings, setSettings] = useState({
    // Security Settings
    autoLock: true,
    lockTimeout: 15, // minutes
    requirePasswordForSend: true,
    enableBiometric: false,
    
    // Transaction Settings
    defaultPriority: 'normal',
    confirmationsRequired: 10,
    enableRBF: false,
    maxFeeRate: 0.01,
    
    // Display Settings
    currency: 'USD',
    hideSmallBalances: false,
    showFiatValues: true,
    theme: 'dark',
    
    // Privacy Settings
    enableTor: true,
    useSubaddresses: true,
    enableStealth: true,
    mixinCount: 11,
    
    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    tradeAlerts: true,
    priceAlerts: false,
    
    // Backup Settings
    autoBackup: true,
    backupFrequency: 'weekly',
    encryptBackups: true,
  });

  const handleCreateWallet = async () => {
    if (createForm.password !== createForm.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    await createWallet(createForm.password);
    setShowCreateModal(false);
    setCreateForm({ password: '', confirmPassword: '' });
  };

  const handleRestoreWallet = async () => {
    await restoreWallet(restoreForm.mnemonic, restoreForm.password);
    setShowRestoreModal(false);
    setRestoreForm({ mnemonic: '', password: '' });
  };

  const handleSendTransaction = async () => {
    try {
      await sendTransaction(sendForm.address, parseFloat(sendForm.amount));
      setShowSendModal(false);
      setSendForm({ address: '', amount: '', note: '' });
      refetch();
    } catch (error) {
      console.error('Transaction failed:', error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Wallet & Settings</h1>
          <p className="text-gray-300">
            Manage your Monero wallet and privacy settings
          </p>
        </motion.div>

        {!wallet ? (
          // Wallet Setup
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <Card className="p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <WalletIcon className="w-10 h-10 text-white" />
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-4">Set Up Your Monero Wallet</h2>
              <p className="text-gray-400 mb-8 leading-relaxed">
                Create a new wallet or restore an existing one to start trading securely.
                Your wallet is non-custodial and only you control your private keys.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => setShowCreateModal(true)}
                  size="lg"
                  className="flex items-center gap-2"
                  disabled={isInitializing}
                >
                  <Plus className="w-5 h-5" />
                  Create New Wallet
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowRestoreModal(true)}
                  size="lg"
                  className="flex items-center gap-2"
                  disabled={isInitializing}
                >
                  <Upload className="w-5 h-5" />
                  Restore Wallet
                </Button>
              </div>

              <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                  <div className="text-left">
                    <h4 className="font-semibold text-yellow-500 mb-1">Security Notice</h4>
                    <p className="text-sm text-gray-300">
                      Your wallet seed phrase is the only way to recover your funds. 
                      Store it securely offline and never share it with anyone.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ) : (
          // Wallet Dashboard
          <div className="space-y-6">
            {/* Settings Toggle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-end"
            >
              <Button
                variant="outline"
                onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                className="flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                {showAdvancedSettings ? 'Hide' : 'Show'} Advanced Settings
              </Button>
            </motion.div>

            {/* Advanced Settings Panel */}
            {showAdvancedSettings && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {/* Security Settings */}
                <Card>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-orange-500" />
                    Security Settings
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-gray-300">Auto-lock wallet</label>
                      <input
                        type="checkbox"
                        checked={settings.autoLock}
                        onChange={(e) => setSettings({ ...settings, autoLock: e.target.checked })}
                        className="rounded border-gray-700 bg-gray-800 text-orange-600 focus:ring-orange-500"
                      />
                    </div>
                    
                    {settings.autoLock && (
                      <div>
                        <label className="block text-sm text-gray-300 mb-2">Lock timeout (minutes)</label>
                        <select
                          value={settings.lockTimeout}
                          onChange={(e) => setSettings({ ...settings, lockTimeout: parseInt(e.target.value) })}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                          <option value={5}>5 minutes</option>
                          <option value={15}>15 minutes</option>
                          <option value={30}>30 minutes</option>
                          <option value={60}>1 hour</option>
                        </select>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-gray-300">Require password for sends</label>
                      <input
                        type="checkbox"
                        checked={settings.requirePasswordForSend}
                        onChange={(e) => setSettings({ ...settings, requirePasswordForSend: e.target.checked })}
                        className="rounded border-gray-700 bg-gray-800 text-orange-600 focus:ring-orange-500"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-gray-300">Enable biometric unlock</label>
                      <input
                        type="checkbox"
                        checked={settings.enableBiometric}
                        onChange={(e) => setSettings({ ...settings, enableBiometric: e.target.checked })}
                        className="rounded border-gray-700 bg-gray-800 text-orange-600 focus:ring-orange-500"
                      />
                    </div>
                  </div>
                </Card>

                {/* Transaction Settings */}
                <Card>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-orange-500" />
                    Transaction Settings
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Default priority</label>
                      <select
                        value={settings.defaultPriority}
                        onChange={(e) => setSettings({ ...settings, defaultPriority: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="low">Low (Slow, Cheap)</option>
                        <option value="normal">Normal (Balanced)</option>
                        <option value="high">High (Fast, Expensive)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Confirmations required</label>
                      <select
                        value={settings.confirmationsRequired}
                        onChange={(e) => setSettings({ ...settings, confirmationsRequired: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value={1}>1 confirmation</option>
                        <option value={3}>3 confirmations</option>
                        <option value={6}>6 confirmations</option>
                        <option value={10}>10 confirmations</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Max fee rate (XMR)</label>
                      <Input
                        type="number"
                        value={settings.maxFeeRate}
                        onChange={(e) => setSettings({ ...settings, maxFeeRate: parseFloat(e.target.value) })}
                        step="0.001"
                        className="text-sm"
                      />
                    </div>
                  </div>
                </Card>

                {/* Privacy Settings */}
                <Card>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Lock className="w-5 h-5 text-orange-500" />
                    Privacy Settings
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-gray-300">Enable Tor</label>
                      <input
                        type="checkbox"
                        checked={settings.enableTor}
                        onChange={(e) => setSettings({ ...settings, enableTor: e.target.checked })}
                        className="rounded border-gray-700 bg-gray-800 text-orange-600 focus:ring-orange-500"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-gray-300">Use subaddresses</label>
                      <input
                        type="checkbox"
                        checked={settings.useSubaddresses}
                        onChange={(e) => setSettings({ ...settings, useSubaddresses: e.target.checked })}
                        className="rounded border-gray-700 bg-gray-800 text-orange-600 focus:ring-orange-500"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-gray-300">Enable stealth addresses</label>
                      <input
                        type="checkbox"
                        checked={settings.enableStealth}
                        onChange={(e) => setSettings({ ...settings, enableStealth: e.target.checked })}
                        className="rounded border-gray-700 bg-gray-800 text-orange-600 focus:ring-orange-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Mixin count</label>
                      <select
                        value={settings.mixinCount}
                        onChange={(e) => setSettings({ ...settings, mixinCount: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value={11}>11 (Recommended)</option>
                        <option value={16}>16 (Higher privacy)</option>
                        <option value={32}>32 (Maximum privacy)</option>
                      </select>
                    </div>
                  </div>
                </Card>

                {/* Display Settings */}
                <Card>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-orange-500" />
                    Display Settings
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Fiat currency</label>
                      <select
                        value={settings.currency}
                        onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="USD">USD - US Dollar</option>
                        <option value="EUR">EUR - Euro</option>
                        <option value="GBP">GBP - British Pound</option>
                        <option value="CAD">CAD - Canadian Dollar</option>
                        <option value="AUD">AUD - Australian Dollar</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-gray-300">Show fiat values</label>
                      <input
                        type="checkbox"
                        checked={settings.showFiatValues}
                        onChange={(e) => setSettings({ ...settings, showFiatValues: e.target.checked })}
                        className="rounded border-gray-700 bg-gray-800 text-orange-600 focus:ring-orange-500"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-gray-300">Hide small balances</label>
                      <input
                        type="checkbox"
                        checked={settings.hideSmallBalances}
                        onChange={(e) => setSettings({ ...settings, hideSmallBalances: e.target.checked })}
                        className="rounded border-gray-700 bg-gray-800 text-orange-600 focus:ring-orange-500"
                      />
                    </div>
                  </div>
                </Card>

                {/* Notification Settings */}
                <Card>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Bell className="w-5 h-5 text-orange-500" />
                    Notifications
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-gray-300">Email notifications</label>
                      <input
                        type="checkbox"
                        checked={settings.emailNotifications}
                        onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                        className="rounded border-gray-700 bg-gray-800 text-orange-600 focus:ring-orange-500"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-gray-300">Push notifications</label>
                      <input
                        type="checkbox"
                        checked={settings.pushNotifications}
                        onChange={(e) => setSettings({ ...settings, pushNotifications: e.target.checked })}
                        className="rounded border-gray-700 bg-gray-800 text-orange-600 focus:ring-orange-500"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-gray-300">Trade alerts</label>
                      <input
                        type="checkbox"
                        checked={settings.tradeAlerts}
                        onChange={(e) => setSettings({ ...settings, tradeAlerts: e.target.checked })}
                        className="rounded border-gray-700 bg-gray-800 text-orange-600 focus:ring-orange-500"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-gray-300">Price alerts</label>
                      <input
                        type="checkbox"
                        checked={settings.priceAlerts}
                        onChange={(e) => setSettings({ ...settings, priceAlerts: e.target.checked })}
                        className="rounded border-gray-700 bg-gray-800 text-orange-600 focus:ring-orange-500"
                      />
                    </div>
                  </div>
                </Card>

                {/* Backup Settings */}
                <Card>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Download className="w-5 h-5 text-orange-500" />
                    Backup Settings
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-gray-300">Auto backup</label>
                      <input
                        type="checkbox"
                        checked={settings.autoBackup}
                        onChange={(e) => setSettings({ ...settings, autoBackup: e.target.checked })}
                        className="rounded border-gray-700 bg-gray-800 text-orange-600 focus:ring-orange-500"
                      />
                    </div>
                    
                    {settings.autoBackup && (
                      <div>
                        <label className="block text-sm text-gray-300 mb-2">Backup frequency</label>
                        <select
                          value={settings.backupFrequency}
                          onChange={(e) => setSettings({ ...settings, backupFrequency: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                        </select>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-gray-300">Encrypt backups</label>
                      <input
                        type="checkbox"
                        checked={settings.encryptBackups}
                        onChange={(e) => setSettings({ ...settings, encryptBackups: e.target.checked })}
                        className="rounded border-gray-700 bg-gray-800 text-orange-600 focus:ring-orange-500"
                      />
                    </div>
                    
                    <Button variant="outline" className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Create Backup Now
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}

            <div className="grid lg:grid-cols-3 gap-6">
            {/* Balance Overview */}
            <div className="lg:col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <GlassCard className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-white">Balance Overview</h3>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowBalance(!showBalance)}
                      >
                        {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={refetch}
                        disabled={transactionsLoading}
                      >
                        <RefreshCw className={`w-4 h-4 ${transactionsLoading ? 'animate-spin' : ''}`} />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-sm text-gray-400 mb-2">Total Balance</div>
                      <div className="text-3xl font-bold text-orange-500">
                        {showBalance ? `${wallet.balance.total.toFixed(8)} XMR` : '••••••••'}
                      </div>
                      {settings.showFiatValues && (
                        <div className="text-sm text-gray-400 mt-1">
                          {showBalance ? `≈ $${(wallet.balance.total * 158.50).toFixed(2)}` : '••••••'}
                        </div>
                      )}
                    </div>

                    <div className="text-center">
                      <div className="text-sm text-gray-400 mb-2">Available</div>
                      <div className="text-2xl font-semibold text-green-400">
                        {showBalance ? `${wallet.balance.available.toFixed(8)} XMR` : '••••••••'}
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-sm text-gray-400 mb-2">Pending</div>
                      <div className="text-2xl font-semibold text-yellow-400">
                        {showBalance ? `${wallet.balance.pending.toFixed(8)} XMR` : '••••••••'}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <Button
                      onClick={() => setShowSendModal(true)}
                      className="flex-1 flex items-center justify-center gap-2"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                      Send
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => copyToClipboard(wallet.address)}
                      className="flex-1 flex items-center justify-center gap-2"
                    >
                      <ArrowDownLeft className="w-4 h-4" />
                      Receive
                    </Button>
                  </div>
                </GlassCard>
              </motion.div>

              {/* Transaction History */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-white">Recent Transactions</h3>
                    <Button variant="ghost" size="sm">
                      View All
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {transactionsLoading ? (
                      Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg animate-pulse">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-700 rounded-full" />
                            <div>
                              <div className="h-4 bg-gray-700 rounded w-24 mb-2" />
                              <div className="h-3 bg-gray-700 rounded w-32" />
                            </div>
                          </div>
                          <div className="h-4 bg-gray-700 rounded w-20" />
                        </div>
                      ))
                    ) : transactions.length === 0 ? (
                      <div className="text-center py-8">
                        <WalletIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400">No transactions yet</p>
                      </div>
                    ) : (
                      transactions.map((tx) => (
                        <div key={tx.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              tx.type === 'incoming' ? 'bg-green-600/20' : 'bg-red-600/20'
                            }`}>
                              {tx.type === 'incoming' ? (
                                <ArrowDownLeft className="w-5 h-5 text-green-400" />
                              ) : (
                                <ArrowUpRight className="w-5 h-5 text-red-400" />
                              )}
                            </div>
                            <div>
                              <div className="font-medium text-white">
                                {tx.type === 'incoming' ? 'Received' : 'Sent'}
                              </div>
                              <div className="text-sm text-gray-400">
                                {new Date(tx.timestamp).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`font-semibold ${
                              tx.type === 'incoming' ? 'text-green-400' : 'text-red-400'
                            }`}>
                              {tx.type === 'incoming' ? '+' : ''}{tx.amount.toFixed(8)} XMR
                            </div>
                            {settings.showFiatValues && (
                              <div className="text-xs text-gray-500">
                                ≈ ${(Math.abs(tx.amount) * 158.50).toFixed(2)}
                              </div>
                            )}
                            <div className="text-sm text-gray-400 flex items-center gap-1">
                              {tx.confirmations < settings.confirmationsRequired ? (
                                <>
                                  <Clock className="w-3 h-3" />
                                  {tx.confirmations}/{settings.confirmationsRequired}
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="w-3 h-3 text-green-400" />
                                  Confirmed
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Wallet Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card>
                  <h3 className="text-lg font-semibold text-white mb-4">Wallet Information</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-gray-400 mb-2">Wallet Address</div>
                      <div className="flex items-center gap-2">
                        <code className="text-xs text-gray-300 bg-gray-800 p-2 rounded flex-1 break-all">
                          {wallet.address.slice(0, 20)}...{wallet.address.slice(-20)}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(wallet.address)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-400 mb-2">Sync Status</div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-sm text-white">
                          Block {wallet.height.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-400 mb-2">Connection</div>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${settings.enableTor ? 'bg-green-500' : 'bg-red-500'}`} />
                        <span className="text-sm text-white">
                          {settings.enableTor ? 'Connected via Tor' : 'Direct connection'}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Security Settings */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <h3 className="text-lg font-semibold text-white mb-4">Security</h3>
                  
                  <div className="space-y-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowMnemonic(!showMnemonic)}
                      className="w-full flex items-center gap-2"
                    >
                      {showMnemonic ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      {showMnemonic ? 'Hide' : 'Show'} Seed Phrase
                    </Button>

                    {showMnemonic && wallet.mnemonic && (
                      <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                        <div className="flex items-start gap-2 mb-3">
                          <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-yellow-500 mb-1">Seed Phrase</h4>
                            <p className="text-xs text-gray-300">
                              Store this securely. Anyone with access can control your funds.
                            </p>
                          </div>
                        </div>
                        <code className="text-xs text-gray-300 bg-gray-800 p-3 rounded block break-all">
                          {wallet.mnemonic}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(wallet.mnemonic!)}
                          className="mt-2 w-full"
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy to Clipboard
                        </Button>
                      </div>
                    )}

                    <Button
                      variant="outline"
                      className="w-full flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Export Wallet
                    </Button>
                    
                    <div className="pt-4 border-t border-gray-800">
                      <Button
                        variant="outline"
                        className="w-full mb-2"
                      >
                        Save Settings
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full text-red-400 hover:text-red-300"
                      >
                        Reset to Defaults
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
          </div>
        )}

        {/* Create Wallet Modal */}
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create New Wallet"
        >
          <div className="space-y-4">
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-start gap-2">
                <Shield className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-500 mb-1">Wallet Security</h4>
                  <p className="text-sm text-gray-300">
                    Your wallet will be encrypted with your password. Make sure to use a strong password
                    and store your seed phrase securely.
                  </p>
                </div>
              </div>
            </div>

            <Input
              label="Wallet Password"
              type="password"
              value={createForm.password}
              onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
              placeholder="Enter a strong password"
            />

            <Input
              label="Confirm Password"
              type="password"
              value={createForm.confirmPassword}
              onChange={(e) => setCreateForm({ ...createForm, confirmPassword: e.target.value })}
              placeholder="Confirm your password"
            />

            <div className="flex gap-3">
              <Button
                variant="ghost"
                onClick={() => setShowCreateModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateWallet}
                loading={isInitializing}
                className="flex-1"
              >
                Create Wallet
              </Button>
            </div>
          </div>
        </Modal>

        {/* Restore Wallet Modal */}
        <Modal
          isOpen={showRestoreModal}
          onClose={() => setShowRestoreModal(false)}
          title="Restore Wallet"
        >
          <div className="space-y-4">
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-500 mb-1">Restore from Seed</h4>
                  <p className="text-sm text-gray-300">
                    Enter your 25-word seed phrase to restore your wallet. This will replace any existing wallet.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Seed Phrase (25 words)
              </label>
              <textarea
                value={restoreForm.mnemonic}
                onChange={(e) => setRestoreForm({ ...restoreForm, mnemonic: e.target.value })}
                placeholder="Enter your 25-word seed phrase separated by spaces"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors h-24 resize-none"
              />
            </div>

            <Input
              label="Wallet Password"
              type="password"
              value={restoreForm.password}
              onChange={(e) => setRestoreForm({ ...restoreForm, password: e.target.value })}
              placeholder="Enter wallet password"
            />

            <div className="flex gap-3">
              <Button
                variant="ghost"
                onClick={() => setShowRestoreModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleRestoreWallet}
                loading={isInitializing}
                className="flex-1"
              >
                Restore Wallet
              </Button>
            </div>
          </div>
        </Modal>

        {/* Send Transaction Modal */}
        <Modal
          isOpen={showSendModal}
          onClose={() => setShowSendModal(false)}
          title="Send Monero"
        >
          <div className="space-y-4">
            <Input
              label="Recipient Address"
              type="text"
              value={sendForm.address}
              onChange={(e) => setSendForm({ ...sendForm, address: e.target.value })}
              placeholder="Enter XMR address"
            />

            <Input
              label="Amount (XMR)"
              type="number"
              value={sendForm.amount}
              onChange={(e) => setSendForm({ ...sendForm, amount: e.target.value })}
              placeholder="0.00000000"
              step="0.00000001"
            />

            <Input
              label="Note (Optional)"
              type="text"
              value={sendForm.note}
              onChange={(e) => setSendForm({ ...sendForm, note: e.target.value })}
              placeholder="Payment note"
            />

            {sendForm.amount && (
              <div className="p-4 bg-gray-800 rounded-lg">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Amount:</span>
                  <span className="text-white">{sendForm.amount} XMR</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Network Fee:</span>
                  <span className="text-white">~0.0008 XMR</span>
                </div>
                <div className="flex justify-between font-semibold border-t border-gray-700 pt-2">
                  <span className="text-white">Total:</span>
                  <span className="text-orange-500">
                    {(parseFloat(sendForm.amount || '0') + 0.0008).toFixed(8)} XMR
                  </span>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                variant="ghost"
                onClick={() => setShowSendModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSendTransaction}
                disabled={!sendForm.address || !sendForm.amount}
                className="flex-1"
              >
                Send Transaction
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}