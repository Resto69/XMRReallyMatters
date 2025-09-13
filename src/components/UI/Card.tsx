import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function Card({ children, className = '', hover = false, onClick }: CardProps) {
  const Component = motion.div;

  return (
    <Component
      whileHover={hover ? { y: -2 } : undefined}
      className={`bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-xl p-6 shadow-xl ${
        hover ? 'cursor-pointer hover:border-orange-500/50' : ''
      } ${className}`}
      onClick={onClick}
      tabIndex={hover ? 0 : undefined}
      role="group"
      aria-label="Card"
    >
      {children}
    </Component>
  );
}

export function GlassCard({ children, className = '', ...props }: CardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-2xl ${className}`}
      tabIndex={0}
      role="group"
      aria-label="Glass Card"
      {...props}
    >
      {children}
    </motion.div>
  );
}