// src/app/search/page.tsx
'use client';

import React from 'react';
import { PromptWithRelations } from '@/lib/types';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchBox from '@/components/SearchBox';
import PromptCard from '@/components/PromptCard';

// Mock data for demonstration
const mockCategories = [
  { id: '1', name: '写作', slug: 'writing', description: '文案、文章、邮件、报告' },
  { id: '2', name: '编程', slug: 'coding', description: '代码生成、调试、解释' },
  { id: '3', name: '分析', slug: 'analysis', description: '数据分析、总结、洞察' },
  { id: '4', name: '创意', slug: 'creative', description: '头脑风暴、创意生成' },
  { id: '5', name: '日常', slug: 'daily', description: '翻译、润色、学习' },
];

// Mock search results
const mockSearchResults: PromptWithRelations[] = [
  {
    id: '1',
    title: '小红书爆款文案生成器',
    description: '帮助快速生成小红书风格的产品文案，包含标题、内容和标签',
    content: '你是一位资深的小红书博主...',
    difficulty: 'BEGINNER',
    status: 'APPROVED',
    views: 5623,
    copies: 1234,
    rating: 4.8,
    ratingCount: 120,
    authorId: 'user1',
    createdAt: new Date(),
    updatedAt: new Date(),
    categories: [{ category: mockCategories[0] }],
    tags: [
      { tag: { id: '1', name: '文案', slug: 'copywriting' } },
      { tag: { id: '2', name: '小红书', slug: 'xiaohongshu' } }
    ]
  },
  {
    id: '2',
    title: 'Python代码解释器',
    description: '解释Python代码的功能和逻辑',
    content: '请详细解释以下Python代码...',
    difficulty: 'INTERMEDIATE',
    status: 'APPROVED',
    views: 4210,
    copies: 980,
    rating: 4.7,
    ratingCount: 89,
    authorId: 'user2',
    createdAt: new Date(),
    updatedAt: new Date(),
    categories: [{ category: mockCategories[1] }],
    tags: [{ tag: { id: '3', name: 'Python', slug: 'python' } }]
  },
  {
    id: '3',
    title: 'Excel数据分析助手',
    description: '分析Excel数据并提供洞察',
    content: '你是一位专业的数据分析师...',
    difficulty: 'ADVANCED',
    status: 'APPROVED',
    views: 3876,
    copies: 856,
    rating: 4.9,
    ratingCount: 156,
    authorId: 'user3',
    createdAt: new Date(),
    updatedAt: new Date(),
    categories: [{ category: mockCategories[2] }],
    tags: [{ tag: { id: '4', name: '数据分析', slug: 'data-analysis' } }]
  },
  {
    id: '4',
    title: '品牌名创意思维导图',
    description: '为新产品生成品牌名和创意方向',
    content: '请为产品生成创新的品牌名...',
    difficulty: 'INTERMEDIATE',
    status: 'APPROVED',
    views: 3542,
    copies: 721,
    rating: 4.6,
    ratingCount: 72,
    authorId: 'user4',
    createdAt: new Date(),
    updatedAt: new Date(),
    categories: [{ category: mockCategories[3] }],
    tags: [{ tag: { id: '5', name: '品牌', slug: 'branding' } }]
  },
  {
    id: '5',
    title: '中英互译及润色',
    description: '提供高质量的中英文互译和润色服务',
    content: '请帮我翻译以下内容...',
    difficulty: 'BEGINNER',
    status: 'APPROVED',
    views: 3120,
    copies: 689,
    rating: 4.5,
    ratingCount: 95,
    authorId: 'user5',
    createdAt: new Date(),
    updatedAt: new Date(),
    categories: [{ category: mockCategories[4] }],
    tags: [{ tag: { id: '6', name: '翻译', slug: 'translation' } }]
  },
  {
    id: '6',
    title: '周报生成助手',
    description: '根据工作内容生成结构化的周报',
    content: '请帮我整理本周的工作内容...',
    difficulty: 'BEGINNER',
    status: 'APPROVED',
    views: 2987,
    copies: 621,
    rating: 4.4,
    ratingCount: 68,
    authorId: 'user6',
    createdAt: new Date(),
    updatedAt: new Date(),
    categories: [{ category: mockCategories[0] }],
    tags: [{ tag: { id: '7', name: '职场', slug: 'career' } }]
  }
];

const SearchPage: React.FC = () => {
  const handleSearch = (query: string) => {
    console.log('Searching for:', query);
    // In a real app, this would trigger a new search
    alert(`搜索: ${query}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search Box */}
          <section className="mb-10">
            <div className="max-w-2xl mx-auto">
              <SearchBox onSearch={handleSearch} placeholder="搜索提示词..." />
            </div>
          </section>
          
          {/* Search Results */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                搜索结果 <span className="text-gray-500 font-normal">({mockSearchResults.length} 个结果)</span>
              </h1>
              
              <div className="flex items-center gap-4">
                <span className="text-gray-600">排序:</span>
                <select className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option>相关性</option>
                  <option>最新</option>
                  <option>最热</option>
                  <option>评分</option>
                </select>
              </div>
            </div>
            
            {mockSearchResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockSearchResults.map((prompt) => (
                  <PromptCard key={prompt.id} prompt={prompt} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-gray-400 text-6xl mb-6">🔍</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">未找到相关结果</h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  很抱歉，没有找到与您搜索关键词相关的提示词模板。请尝试其他关键词或浏览我们的分类。
                </p>
                
                <div className="space-x-4">
                  <button 
                    className="bg-indigo-600 text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-700 transition-colors"
                    onClick={() => window.location.href = '/'}
                  >
                    返回首页
                  </button>
                  <button 
                    className="bg-white text-gray-700 border border-gray-300 px-6 py-3 rounded-md font-medium hover:bg-gray-50 transition-colors"
                    onClick={() => window.location.href = '/categories'}
                  >
                    浏览分类
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SearchPage;