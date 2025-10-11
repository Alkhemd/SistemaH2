'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse'
}) => {
  const baseClasses = 'bg-gray-200 rounded';
  
  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg'
  };

  const animationVariants = {
    pulse: {
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    },
    wave: {
      backgroundPosition: ['-200px 0', '200px 0'],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'linear'
      }
    },
    none: {}
  };

  const style: React.CSSProperties = {
    width: width || undefined,
    height: height || undefined,
  };

  if (animation === 'wave') {
    style.background = 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)';
    style.backgroundSize = '200px 100%';
  }

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${
        animation === 'pulse' ? 'animate-pulse' : ''
      } ${className}`}
      style={style}
    />
  );
};

// Componentes de skeleton predefinidos
export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`p-6 bg-white rounded-2xl border border-gray-100 ${className}`}>
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <Skeleton className="h-5 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <Skeleton variant="circular" className="w-8 h-8" />
    </div>
    <div className="space-y-2">
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-5/6" />
      <Skeleton className="h-3 w-4/6" />
    </div>
  </div>
);

export const SkeletonTable: React.FC<{ rows?: number; className?: string }> = ({ 
  rows = 5, 
  className = '' 
}) => (
  <div className={`bg-white rounded-2xl border border-gray-100 overflow-hidden ${className}`}>
    {/* Header */}
    <div className="p-4 border-b border-gray-100">
      <div className="flex space-x-4">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
      </div>
    </div>
    
    {/* Rows */}
    {Array.from({ length: rows }).map((_, index) => (
      <div key={index} className="p-4 border-b border-gray-50 last:border-b-0">
        <div className="flex space-x-4 items-center">
          <Skeleton className="h-3 w-1/4" />
          <Skeleton className="h-3 w-1/4" />
          <Skeleton className="h-3 w-1/4" />
          <Skeleton className="h-3 w-1/4" />
        </div>
      </div>
    ))}
  </div>
);

export const SkeletonDashboard: React.FC = () => (
  <div className="space-y-8">
    {/* Header */}
    <div className="space-y-2">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-6 w-96" />
    </div>
    
    {/* Stats Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="p-6 bg-white rounded-2xl border border-gray-100">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton variant="circular" className="w-12 h-12" />
          </div>
          <div className="flex items-end space-x-1 h-8">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="flex-1 h-full" />
            ))}
          </div>
        </div>
      ))}
    </div>
    
    {/* Activity Section */}
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl">
            <div className="flex items-center space-x-4">
              <Skeleton variant="circular" className="w-3 h-3" />
              <div>
                <Skeleton className="h-4 w-48 mb-1" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
            <div className="text-right space-y-1">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-5 w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const SkeletonForm: React.FC = () => (
  <div className="space-y-6 p-6">
    <div className="border-b border-gray-200 pb-4">
      <Skeleton className="h-6 w-32 mb-2" />
      <Skeleton className="h-4 w-64" />
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <Skeleton className="h-5 w-32 mb-2" />
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-12 w-full" />
          </div>
        ))}
      </div>
      
      <div className="space-y-4">
        <Skeleton className="h-5 w-32 mb-2" />
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-12 w-full" />
          </div>
        ))}
      </div>
    </div>
    
    <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
      <Skeleton className="h-10 w-20" />
      <Skeleton className="h-10 w-24" />
    </div>
  </div>
);
