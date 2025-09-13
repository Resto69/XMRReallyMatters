import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Check, X, Filter, Search, Archive, Trash2, Settings, AlertTriangle, Info, CheckCircle, Clock } from 'lucide-react'; 
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { Input } from '../components/UI/Input';

interface Notification {
  id: string;
  type: 'trade' | 'system' | 'security' | 'payment' | 'offer';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  category: string;
}

export function Notifications() {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'trade',
      title: 'Trade Completed Successfully',
      message: 'Your trade with CryptoTrader99 for 2.5 XMR has been completed. The funds have been released to your wallet.',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      read: false,
      priority: 'high',
      category: 'Trading'
    },
    {
      id: '2',
      type: 'payment',
      title: 'Payment Received',
      message: 'Payment of $396.25 has been received via PayPal from buyer MoneroMaster.',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      read: false,
      priority: 'medium',
      category: 'Payments'
    },
    {
      id: '3',
      type: 'security',
      title: 'New Login Detected',
      message: 'A new login to your account was detected from IP 192.168.1.100. If this wasn\'t you, please secure your account immediately.',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      read: true,
      priority: 'high',
      category: 'Security'
    },
    {
      id: '4',
      type: 'offer',
      title: 'New Offer Match',
      message: 'A new offer matching your preferences has been posted by TrustedSeller.',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      read: true,
      priority: 'medium',
      category: 'Offers'
    },
    {
      id: '5',
      type: 'system',
      title: 'Scheduled Maintenance',
      message: 'The platform will undergo scheduled maintenance tonight from 2:00 AM to 4:00 AM UTC. Trading will be temporarily unavailable.',
      timestamp: new Date(Date.now() - 14400000).toISOString(),
      read: true,
      priority: 'low',
      category: 'System'
    },
    {
      id: '6',
      type: 'trade',
      title: 'Trade Dispute Opened',
      message: 'A dispute has been opened for trade #TR-2024-001. An arbitrator will review the case within 24 hours.',
      timestamp: new Date(Date.now() - 21600000).toISOString(),
      read: false,
      priority: 'high',
      category: 'Trading'
    }
  ]);

  const getNotificationIcon = (type: string, priority: string) => {
    const iconClass = priority === 'high' ? 'text-red-500' : priority === 'medium' ? 'text-yellow-500' : 'text-blue-500';
    
    switch (type) {
      case 'trade':
        return <CheckCircle className={`w-5 h-5 ${iconClass}`} />;
      case 'payment':
        return <CheckCircle className={`w-5 h-5 text-green-500`} />;
      case 'security':
        return <AlertTriangle className={`w-5 h-5 text-red-500`} />;
      case 'system':
        return <Info className={`w-5 h-5 ${iconClass}`} />;
      case 'offer':
        return <Bell className={`w-5 h-5 ${iconClass}`} />;
      default:
        return <Bell className={`w-5 h-5 ${iconClass}`} />;
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

  const filteredNotifications = notifications.filter(notification => {
    if (filter !== 'all' && filter !== 'unread' && notification.type !== filter) return false;
    if (filter === 'unread' && notification.read) return false;
    if (searchTerm && !notification.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !notification.message.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

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

  const toggleSelection = (notificationId: string) => {
    setSelectedNotifications(prev => 
      prev.includes(notificationId) 
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  const deleteSelected = () => {
    setNotifications(prev => prev.filter(notif => !selectedNotifications.includes(notif.id)));
    setSelectedNotifications([]);
  };

  const markSelectedAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => 
        selectedNotifications.includes(notif.id) ? { ...notif, read: true } : notif
      )
    );
    setSelectedNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Notifications</h1>
              <p className="text-gray-300">
                Stay updated with your trading activity and system alerts
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              {unreadCount > 0 && (
                <Button onClick={markAllAsRead} size="sm">
                  Mark All Read
                </Button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
        >
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-500 mb-1">{notifications.length}</div>
            <div className="text-sm text-gray-400">Total</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-red-500 mb-1">{unreadCount}</div>
            <div className="text-sm text-gray-400">Unread</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-500 mb-1">
              {notifications.filter(n => n.priority === 'high').length}
            </div>
            <div className="text-sm text-gray-400">High Priority</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-500 mb-1">
              {notifications.filter(n => n.type === 'trade').length}
            </div>
            <div className="text-sm text-gray-400">Trading</div>
          </Card>
        </motion.div>

        {/* Filters and Search */}
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
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2 flex-wrap">
                {['all', 'unread', 'trade', 'payment', 'security', 'system', 'offer'].map((filterType) => (
                  <Button
                    key={filterType}
                    variant={filter === filterType ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setFilter(filterType)}
                    className="capitalize"
                  >
                    {filterType}
                  </Button>
                ))}
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedNotifications.length > 0 && (
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-800">
                <span className="text-sm text-gray-400">
                  {selectedNotifications.length} selected
                </span>
                <Button variant="ghost" size="sm" onClick={markSelectedAsRead}>
                  <Check className="w-4 h-4 mr-1" />
                  Mark Read
                </Button>
                <Button variant="ghost" size="sm" onClick={deleteSelected}>
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Notifications List */}
        <div className="space-y-2">
          {filteredNotifications.length === 0 ? (
            <Card className="p-12 text-center">
              <Bell className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No notifications found</h3>
              <p className="text-gray-400">
                {filter === 'all' 
                  ? "You don't have any notifications yet."
                  : `No ${filter} notifications found. Try adjusting your filters.`
                }
              </p>
            </Card>
          ) : (
            filteredNotifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={`p-0 overflow-hidden border-l-4 ${getPriorityColor(notification.priority)} ${
                  !notification.read ? 'bg-gray-800/30' : 'bg-transparent'
                } hover:bg-gray-800/50 transition-colors`}>
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Selection Checkbox */}
                      <input
                        type="checkbox"
                        checked={selectedNotifications.includes(notification.id)}
                        onChange={() => toggleSelection(notification.id)}
                        className="mt-1 rounded border-gray-700 bg-gray-800 text-orange-600 focus:ring-orange-500"
                      />

                      {/* Icon */}
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type, notification.priority)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-white">{notification.title}</h3>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-orange-500 rounded-full" />
                              )}
                              <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full">
                                {notification.category}
                              </span>
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed mb-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {new Date(notification.timestamp).toLocaleString()}
                              </span>
                              <span className={`px-2 py-1 rounded-full ${
                                notification.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                                notification.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-blue-500/20 text-blue-400'
                              }`}>
                                {notification.priority} priority
                              </span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1">
                            {!notification.read && (
                              <div title="Mark as read">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markAsRead(notification.id)}
                                >
                                  <Check className="w-4 h-4" />
                                </Button>
                              </div>
                            )}
                            <div title="Delete">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteNotification(notification.id)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </div>

        {/* Load More */}
        {filteredNotifications.length > 0 && (
          <div className="text-center mt-8">
            <Button variant="outline">
              Load More Notifications
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}