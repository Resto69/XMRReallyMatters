import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Eye, EyeOff, Lock, User } from 'lucide-react';
import { Button } from '../components/UI/Button';
import { Input } from '../components/UI/Input';
import { Card } from '../components/UI/Card';
import { useAppContext } from '../context/AppContext';
import { apiService } from '../services/api';

export function Login() {
  const navigate = useNavigate();
  const { dispatch } = useAppContext();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const usernameInputRef = React.useRef<HTMLInputElement>(null);
  const passwordInputRef = React.useRef<HTMLInputElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      // Focus first error field
      if (errors.username && usernameInputRef.current) usernameInputRef.current.focus();
      else if (errors.password && passwordInputRef.current) passwordInputRef.current.focus();
      return;
    }
    setLoading(true);
    setErrors({});
    try {
      const { user } = await apiService.login(formData.username, formData.password);
      dispatch({ type: 'SET_USER', payload: user });
      setLoading(false);
      navigate('/');
    } catch (err) {
      setLoading(false);
      setErrors({ general: err instanceof Error ? err.message : 'Login failed. Please check your credentials and try again.' });
      if (usernameInputRef.current) usernameInputRef.current.focus();
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
            <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-gray-400">Sign in to your secure trading account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" aria-label="Login form">
            <Input
              ref={usernameInputRef}
              label="Username"
              type="text"
              value={formData.username}
              onChange={e => setFormData({ ...formData, username: e.target.value })}
              placeholder="Enter your username"
              error={errors.username}
              autoComplete="username"
              required
              aria-invalid={!!errors.username}
              aria-describedby={errors.username ? 'username-error' : undefined}
            />
            <Input
              ref={passwordInputRef}
              label="Password"
              type="password"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              placeholder="Enter your password"
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword(v => !v)}
              error={errors.password}
              autoComplete="current-password"
              required
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'password-error' : undefined}
            />
            {errors.general && (
              <div className="text-sm text-red-500" role="alert">{errors.general}</div>
            )}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              disabled={loading || !formData.username || !formData.password}
              className="w-full"
              aria-label="Sign in securely"
            >
              {loading ? 'Signing in...' : 'Sign In Securely'}
            </Button>
            <div className="mt-2 text-center">
              <a
                href="/forgot-password"
                className="text-sm text-orange-500 hover:underline focus:outline-none focus:ring-2 focus:ring-orange-500"
                tabIndex={0}
                aria-label="Forgot password"
              >
                Forgot Password?
              </a>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-orange-500 hover:text-orange-400 transition-colors">
                Create Account
              </Link>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-800">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
              <Lock className="w-4 h-4" />
              <span>Your connection is secured with Tor</span>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}