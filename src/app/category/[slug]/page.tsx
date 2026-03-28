// src/app/category/[slug]/page.tsx
'use client';

import React from 'react';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PromptCard from '@/components/PromptCard';
import CategoryBadge from '@/components/CategoryBadge';
import { PromptWithRelations } from '@/lib/types';

// Mock data for demonstration
const mockCategories = [
  { id: '1', name: '写作', slug: 'writing', description: '文案、文章、邮件、报告' },
  { id: '2', name: '编程', slug: 'coding', description: '代码生成、调试、解释' },
  { id: '3', name: '分析', slug: 'analysis', description: '数据分析、总结、洞察' },
  { id: '4', name: '创意', slug: 'creative', description: '头脑风暴、创意生成' },
  { id: '5', name: '日常', slug: 'daily', description: '翻译、润色、学习' },
];

// Mock prompts data
const mockPrompts: PromptWithRelations[] = [
  {
    id: '1',
    title: '小红书爆款文案生成器',
    description: '帮助快速生成小红书风格的产品文案',
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
    tags: [{ tag: { id: '1', name: '文案', slug: 'copywriting' } }]
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
    tags: [{ tag: { id: '2', name: 'Python', slug: 'python' } }]
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
    tags: [{ tag: { id: '3', name: '数据分析', slug: 'data-analysis' } }]
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
    tags: [{ tag: { id: '4', name: '品牌', slug: 'branding' } }]
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
    tags: [{ tag: { id: '5', name: '翻译', slug: 'translation' } }]
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
    tags: [{ tag: { id: '6', name: '职场', slug: 'career' } }]
  }
];

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

const CategoryPage: React.FC<CategoryPageProps> = ({ params }) => {
  const category = mockCategories.find(cat => cat.slug === params.slug);
  
  if (!category) {
    notFound();
  }

  // Filter prompts by category
  const categoryPrompts = mockPrompts.filter(prompt => 
    prompt.categories.some(pc => pc.category.slug === params.slug)
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Category Header */}
          <section className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
              <CategoryBadge name={category.name} slug={category.slug} isActive={true} />
            </div>
            <p className="text-lg text-gray-600 max-w-3xl">
              {category.description}
            </p>
            <div className="mt-2 text-sm text-gray-500">
              {categoryPrompts.length} 个相关提示词模板
            </div>
          </section>
          
          {/* Other Categories */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">其他分类</h2>
            <div className="flex flex-wrap gap-3">
              {mockCategories
                .filter(cat => cat.slug !== params.slug)
                .map((otherCat) => (
                  <CategoryBadge 
                    key={otherCat.id} 
                    name={otherCat.name} 
                    slug={otherCat.slug} 
                    onClick={() => window.location.href = `/category/${otherCat.slug}`}
                  />
                ))}
            </div>
          </section>
          
          {/* Category Prompts */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {category.name} 相关提示词
            </h2>
            
            {categoryPrompts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryPrompts.map((prompt) => (
                  <PromptCard key={prompt.id} prompt={prompt} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-5xl mb-4">🔍</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">暂无提示词</h3>
                <p className="text-gray-500">该分类下还没有提示词模板，欢迎提交您的模板！</p>
                <button 
                  className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
                  onClick={() => window.location.href = '/submit'}
                >
                  提交模板
                </button>
              </div>
            )}
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CategoryPage;