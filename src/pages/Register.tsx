import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Eye, EyeOff, Lock, User, Mail, AlertTriangle } from 'lucide-react';
import { Button } from '../components/UI/Button';
import { Input } from '../components/UI/Input';
import { Card } from '../components/UI/Card';
import { useAppContext } from '../context/AppContext';
import { apiService } from '../services/api';

export function Register() {
  const navigate = useNavigate();
  const { dispatch } = useAppContext();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    enableTor: true,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeToTerms) {
      newErrors.terms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;
    setLoading(true);
    try {
      const { user } = await apiService.register(
        formData.username,
        formData.password,
        formData.email
      );
      dispatch({ type: 'SET_USER', payload: user });
      setLoading(false);
      navigate('/wallet');
    } catch (err) {
      setLoading(false);
      setErrors({ general: 'Registration failed. Please try again.' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-gray-400">Join the privacy-first trading community</p>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= 1 ? 'bg-orange-600 text-white' : 'bg-gray-700 text-gray-400'
              }`}>
                1
              </div>
              <div className={`w-16 h-1 mx-2 ${
                currentStep >= 2 ? 'bg-orange-600' : 'bg-gray-700'
              }`} />
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= 2 ? 'bg-orange-600 text-white' : 'bg-gray-700 text-gray-400'
              }`}>
                2
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <Input
                  label="Username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="Choose a unique username"
                  error={errors.username}
                  required
                />

                <Input
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com"
                  error={errors.email}
                  required
                />

                <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-yellow-500 mb-1">Privacy Notice</h4>
                      <p className="text-sm text-gray-300">
                        Your email is only used for account recovery. We recommend using a privacy-focused email service.
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={handleNext}
                  className="w-full"
                  size="lg"
                >
                  Continue
                </Button>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <Input
                  label="Password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Create a strong password"
                  showPassword={showPassword}
                  onTogglePassword={() => setShowPassword(!showPassword)}
                  error={errors.password}
                  required
                />

                <Input
                  label="Confirm Password"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Confirm your password"
                  showPassword={showConfirmPassword}
                  onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
                  error={errors.confirmPassword}
                  required
                />

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="enableTor"
                      checked={formData.enableTor}
                      onChange={(e) => setFormData({ ...formData, enableTor: e.target.checked })}
                      className="rounded border-gray-700 bg-gray-800 text-orange-600 focus:ring-orange-500"
                    />
                    <label htmlFor="enableTor" className="text-sm text-gray-300">
                      Enable Tor connection for enhanced privacy
                    </label>
                  </div>

                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      id="agreeTerms"
                      checked={formData.agreeToTerms}
                      onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                      className="rounded border-gray-700 bg-gray-800 text-orange-600 focus:ring-orange-500 mt-0.5"
                    />
                    <label htmlFor="agreeTerms" className="text-sm text-gray-300">
                      I agree to the{' '}
                      <Link to="/terms" className="text-orange-500 hover:text-orange-400">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link to="/privacy" className="text-orange-500 hover:text-orange-400">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>
                  {errors.terms && <p className="text-sm text-red-500">{errors.terms}</p>}
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleBack}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    loading={loading}
                    className="flex-1"
                    size="lg"
                  >
                    Create Account
                  </Button>
                </div>
              </motion.div>
            )}
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-orange-500 hover:text-orange-400 transition-colors">
                Sign In
              </Link>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-800">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
              <Lock className="w-4 h-4" />
              <span>Your data is encrypted and never shared</span>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}