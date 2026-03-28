'use client';

import React from 'react';
import Link from 'next/link';
import { Difficulty, PromptWithRelations } from '@/lib/types';

interface PromptCardProps {
  prompt: PromptWithRelations;
}

// 定义难度映射
const difficultyMap: Record<Difficulty, { label: string; color: string }> = {
  BEGINNER: { label: '初级', color: 'text-green-600 bg-green-100' },
  INTERMEDIATE: { label: '中级', color: 'text-yellow-600 bg-yellow-100' },
  ADVANCED: { label: '高级', color: 'text-red-600 bg-red-100' },
};

const PromptCard: React.FC<PromptCardProps> = ({ prompt }) => {
  const difficultyInfo = difficultyMap[prompt.difficulty];

  return (
    <Link href={`/prompt/${prompt.id}`} className="block">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200 h-full flex flex-col">
        <div className="p-5 flex-1 flex flex-col">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            {/* 分类标签 */}
            {prompt.categories.slice(0, 2).map((pc) => (
              <span 
                key={pc.category.id} 
                className="px-2 py-1 text-xs font-medium text-indigo-800 bg-indigo-100 rounded-full"
              >
                {pc.category.name}
              </span>
            ))}
            
            {/* 难度标签 */}
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${difficultyInfo.color}`}>
              {difficultyInfo.label}
            </span>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {prompt.title}
          </h3>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
            {prompt.description}
          </p>
          
          <div className="mt-auto pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <span className="text-yellow-500">⭐</span>
                <span>{prompt.rating?.toFixed(1) || '0.0'}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <span className="text-blue-500">📋</span>
                <span>{prompt.copies?.toLocaleString() || '0'} 次复制</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PromptCard;