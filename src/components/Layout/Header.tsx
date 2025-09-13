import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Bell, User, Settings, LogOut, Check, X, AlertTriangle, Info } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

interface Notification {
  id: string;
  type: 'trade' | 'system' | 'security' | 'payment';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
}

export function Header() {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Mock notifications data
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'trade',
      title: 'Trade Completed',
      message: 'Your trade with CryptoTrader99 has been completed successfully.',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      read: false,
      priority: 'high'
    },
    {
      id: '2',
      type: 'payment',
      title: 'Payment Received',
      message: 'Payment of $396.25 has been received via PayPal.',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      read: false,
      priority: 'medium'
    },
    {
      id: '3',
      type: 'security',
      title: 'Security Alert',
      message: 'New login detected from a different location.',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      read: true,
      priority: 'high'
    },
    {
      id: '4',
      type: 'system',
      title: 'System Maintenance',
      message: 'Scheduled maintenance will occur tonight at 2 AM UTC.',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      read: true,
      priority: 'low'
    }
  ]);

  const handleLogout = () => {
    dispatch({ type: 'SET_USER', payload: null });
    dispatch({ type: 'SET_WALLET', payload: null });
    navigate('/');
    setShowProfileMenu(false);
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'trade': return '💰';
      case 'payment': return '💳';
      case 'security': return '🔒';
      case 'system': return '⚙️';
      default: return '📢';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-blue-500';
      default: return 'border-l-gray-500';
    }
  };

  return (
    <header className="bg-black/20 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-orange-500/25 transition-all duration-300">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-white tracking-tight">XMRMatters</span>
              <span className="text-xs text-orange-400 font-medium">Privacy First Trading</span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {[
              { to: '/browse', label: 'Browse Offers' },
              { to: '/create-offer', label: 'Create Offer' },
              { to: '/trades', label: 'My Trades' },
              { to: '/help', label: 'Help' }
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 font-medium"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-3">
            {/* Tor Status */}
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1 bg-gray-800/50 rounded-full">
              <div className={`w-2 h-2 rounded-full ${state.torConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-xs text-gray-400 font-medium">
                {state.torConnected ? 'Tor Active' : 'Tor Inactive'}
              </span>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-400 hover:text-orange-500 hover:bg-white/10 rounded-lg transition-all duration-200"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-96 bg-gray-900 rounded-xl shadow-2xl border border-gray-800 overflow-hidden"
                  >
                    {/* Header */}
                    <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white">Notifications</h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-sm text-orange-500 hover:text-orange-400 font-medium"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center">
                          <Bell className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                          <p className="text-gray-400">No notifications</p>
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 border-l-4 ${getPriorityColor(notification.priority)} ${
                              !notification.read ? 'bg-gray-800/30' : 'bg-transparent'
                            } hover:bg-gray-800/50 transition-colors`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-3 flex-1">
                                <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center space-x-2">
                                    <h4 className="text-sm font-semibold text-white truncate">
                                      {notification.title}
                                    </h4>
                                    {!notification.read && (
                                      <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0" />
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                                    {notification.message}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-2">
                                    {new Date(notification.timestamp).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-1 ml-2">
                                {!notification.read && (
                                  <button
                                    onClick={() => markAsRead(notification.id)}
                                    className="p-1 text-gray-400 hover:text-green-500 transition-colors"
                                    title="Mark as read"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                )}
                                <button
                                  onClick={() => deleteNotification(notification.id)}
                                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                  title="Delete"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Footer */}
                    <div className="p-3 border-t border-gray-800 bg-gray-800/30">
                      <Link
                        to="/notifications"
                        className="block text-center text-sm text-orange-500 hover:text-orange-400 font-medium"
                        onClick={() => setShowNotifications(false)}
                      >
                        View all notifications
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Menu */}
            {state.user ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/10 transition-all duration-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {state.user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm text-gray-300 font-medium hidden sm:block">
                    {state.user.username}
                  </span>
                </button>
                
                {/* Profile Dropdown */}
                <AnimatePresence>
                  {showProfileMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-64 bg-gray-900 rounded-xl shadow-2xl border border-gray-800 overflow-hidden"
                    >
                      {/* Profile Header */}
                      <div className="p-4 border-b border-gray-800">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold">
                              {state.user.username.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-white">{state.user.username}</h3>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-400">
                                ⭐ {state.user.reputation.toFixed(1)}
                              </span>
                              {state.user.verified && (
                                <Shield className="w-4 h-4 text-green-500" />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <Link
                          to="/profile"
                          className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <User className="w-4 h-4" />
                          <span>My Profile</span>
                        </Link>
                        <Link
                          to="/wallet"
                          className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <Settings className="w-4 h-4" />
                          <span>Wallet & Settings</span>
                        </Link>
                        <div className="border-t border-gray-800 my-2" />
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-red-400 hover:bg-gray-800 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white rounded-lg transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-orange-500/25"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside handlers */}
      {(showNotifications || showProfileMenu) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowNotifications(false);
            setShowProfileMenu(false);
          }}
        />
      )}
    </header>
  );
}