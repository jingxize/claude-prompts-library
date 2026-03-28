'use client';

import React, { useState } from 'react';

interface CopyButtonProps {
  text: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onCopy?: () => void;
}

const CopyButton: React.FC<CopyButtonProps> = ({ 
  text, 
  variant = 'primary', 
  size = 'md',
  onCopy 
}) => {
  const [copied, setCopied] = useState(false);

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const variantClasses = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
    secondary: 'bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-50',
    ghost: 'text-indigo-600 hover:bg-indigo-50'
  };

  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      
      if (onCopy) {
        onCopy();
      }
      
      // 重置复制状态
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`
        inline-flex items-center gap-2 rounded-lg font-medium transition-colors duration-200
        ${sizeClasses[size]} ${variantClasses[variant]}
        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
      disabled={copied}
    >
      {copied ? (
        <>
          <span className="material-icons text-lg">✓</span>
          已复制!
        </>
      ) : (
        <>
          <span className="material-icons text-lg">content_copy</span>
          {size === 'sm' ? '' : copied ? '已复制!' : '复制'}
        </>
      )}
    </button>
  );
};

export default CopyButton;