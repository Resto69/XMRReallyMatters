import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Shield,
  Star,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
  Edit3,
  Camera,
  Key,
  Globe,
  MessageSquare,
  Award,
  Activity,
} from 'lucide-react';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { Input } from '../components/UI/Input';
import { Modal } from '../components/UI/Modal';
import { useAppContext } from '../context/AppContext';

export function Profile() {
  const { state, dispatch } = useAppContext();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPGPModal, setShowPGPModal] = useState(false);
  const [editForm, setEditForm] = useState({
    bio: '',
    location: '',
    languages: '',
    timezone: '',
  });

  if (!state.user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="p-8">
            <Shield className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-4">Login Required</h2>
            <p className="text-gray-400 mb-6">You must be logged in to view your profile.</p>
            <Button onClick={() => window.location.href = '/login'}>
              Login to Continue
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const achievements = [
    { id: 1, name: 'First Trade', description: 'Completed your first trade', icon: '🎯', earned: true },
    { id: 2, name: 'Trusted Trader', description: '50+ successful trades', icon: '🏆', earned: true },
    { id: 3, name: 'Speed Demon', description: 'Average release time under 15 minutes', icon: '⚡', earned: true },
    { id: 4, name: 'Volume Master', description: 'Traded over 100 XMR', icon: '💎', earned: false },
    { id: 5, name: 'Perfect Score', description: '100% success rate with 25+ trades', icon: '⭐', earned: false },
  ];

  const recentActivity = [
    { id: 1, type: 'trade', description: 'Completed trade with CryptoTrader99', timestamp: '2 hours ago' },
    { id: 2, type: 'offer', description: 'Created new sell offer', timestamp: '1 day ago' },
    { id: 3, type: 'review', description: 'Received 5-star review', timestamp: '2 days ago' },
    { id: 4, type: 'trade', description: 'Started trade with MoneroMaster', timestamp: '3 days ago' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
          <p className="text-gray-300">Manage your trading profile and reputation</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Overview */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-8">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                      <span className="text-3xl font-bold text-white">
                        {state.user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center border-2 border-gray-700 hover:bg-gray-700 transition-colors">
                      <Camera className="w-4 h-4 text-gray-300" />
                    </button>
                  </div>

                  {/* Profile Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold text-white">{state.user.username}</h2>
                      {state.user.verified && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-green-600/20 text-green-400 rounded-full text-sm">
                          <Shield className="w-4 h-4" />
                          <span>Verified</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 text-yellow-500 fill-current" />
                        <span className="text-lg font-semibold text-white">{state.user.reputation.toFixed(1)}</span>
                        <span className="text-gray-400">rating</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>Joined {new Date(state.user.joinDate).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-500">{state.user.totalTrades}</div>
                        <div className="text-sm text-gray-400">Total Trades</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-500">{state.user.successRate}%</div>
                        <div className="text-sm text-gray-400">Success Rate</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-500">{state.user.avgReleaseTime}</div>
                        <div className="text-sm text-gray-400">Avg Release</div>
                      </div>
                    </div>

                    <Button
                      onClick={() => setShowEditModal(true)}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit Profile
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                  <Award className="w-5 h-5 text-orange-500" />
                  Achievements
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        achievement.earned
                          ? 'border-orange-600/50 bg-orange-600/10'
                          : 'border-gray-700 bg-gray-800/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`text-2xl ${achievement.earned ? '' : 'grayscale opacity-50'}`}>
                          {achievement.icon}
                        </span>
                        <div>
                          <h4 className={`font-semibold ${achievement.earned ? 'text-white' : 'text-gray-400'}`}>
                            {achievement.name}
                          </h4>
                          <p className="text-sm text-gray-400">{achievement.description}</p>
                        </div>
                        {achievement.earned && (
                          <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-orange-500" />
                  Recent Activity
                </h3>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-4 p-3 bg-gray-800/30 rounded-lg">
                      <div className="w-10 h-10 bg-orange-600/20 rounded-full flex items-center justify-center">
                        {activity.type === 'trade' && <TrendingUp className="w-5 h-5 text-orange-500" />}
                        {activity.type === 'offer' && <MessageSquare className="w-5 h-5 text-blue-500" />}
                        {activity.type === 'review' && <Star className="w-5 h-5 text-yellow-500" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-white">{activity.description}</p>
                        <p className="text-sm text-gray-400">{activity.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Security Settings */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-orange-500" />
                  Security
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Two-Factor Auth</span>
                    <span className="text-green-400 text-sm">Enabled</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">PGP Key</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPGPModal(true)}
                    >
                      <Key className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Tor Connection</span>
                    <span className="text-green-400 text-sm">Active</span>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Trading Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-orange-500" />
                  Trading Stats
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">This Month</span>
                      <span className="text-white">12 trades</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: '75%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Volume (XMR)</span>
                      <span className="text-white">45.2</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '60%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Response Time</span>
                      <span className="text-white">8 min avg</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '90%' }} />
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-orange-500" />
                  Contact Info
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-400">Location:</span>
                    <span className="text-white ml-2">Not specified</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Languages:</span>
                    <span className="text-white ml-2">English</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Timezone:</span>
                    <span className="text-white ml-2">UTC-5</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Edit Profile Modal */}
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="Edit Profile"
          size="md"
        >
          <div className="space-y-4">
            <Input
              label="Bio"
              type="text"
              value={editForm.bio}
              onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
              placeholder="Tell others about yourself..."
            />
            <Input
              label="Location"
              type="text"
              value={editForm.location}
              onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
              placeholder="Your general location"
            />
            <Input
              label="Languages"
              type="text"
              value={editForm.languages}
              onChange={(e) => setEditForm({ ...editForm, languages: e.target.value })}
              placeholder="Languages you speak"
            />
            <Input
              label="Timezone"
              type="text"
              value={editForm.timezone}
              onChange={(e) => setEditForm({ ...editForm, timezone: e.target.value })}
              placeholder="Your timezone (e.g., UTC-5)"
            />
            <div className="flex gap-3">
              <Button
                variant="ghost"
                onClick={() => setShowEditModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button className="flex-1">
                Save Changes
              </Button>
            </div>
          </div>
        </Modal>

        {/* PGP Modal */}
        <Modal
          isOpen={showPGPModal}
          onClose={() => setShowPGPModal(false)}
          title="PGP Public Key"
          size="lg"
        >
          <div className="space-y-4">
            <p className="text-gray-400">
              Your PGP public key allows other users to send you encrypted messages.
            </p>
            <textarea
              className="w-full h-40 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono text-sm"
              placeholder="Paste your PGP public key here..."
            />
            <div className="flex gap-3">
              <Button variant="ghost" onClick={() => setShowPGPModal(false)} className="flex-1">
                Cancel
              </Button>
              <Button className="flex-1">Save PGP Key</Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}