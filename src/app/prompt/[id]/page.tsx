// src/app/prompt/[id]/page.tsx
'use client';

import React from 'react';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CopyButton from '@/components/CopyButton';
import { PromptWithRelations } from '@/lib/types';

// Mock data for demonstration
const mockCategories = [
  { id: '1', name: '写作', slug: 'writing', description: '文案、文章、邮件、报告' },
  { id: '2', name: '编程', slug: 'coding', description: '代码生成、调试、解释' },
  { id: '3', name: '分析', slug: 'analysis', description: '数据分析、总结、洞察' },
  { id: '4', name: '创意', slug: 'creative', description: '头脑风暴、创意生成' },
  { id: '5', name: '日常', slug: 'daily', description: '翻译、润色、学习' },
];

// Mock prompt data
const mockPrompt: PromptWithRelations = {
  id: '1',
  title: '小红书爆款文案生成器',
  description: '帮助快速生成小红书风格的产品文案，包含标题、内容和标签',
  content: `你是一位资深的小红书博主，擅长创作爆款笔记。请帮我创作一篇关于[产品/主题]的小红书文案。

要求：
1. 使用小红书常见的标题格式（如"保姆级教程"、"宝藏推荐"等）
2. 内容包含使用体验和真实感受
3. 使用emoji增加亲和力
4. 包含2-3个小标题分段
5. 结末加上互动问题引导点赞收藏

产品/主题：[在这里填入具体产品或主题]`,
  difficulty: 'BEGINNER',
  status: 'APPROVED',
  views: 5623,
  copies: 1234,
  rating: 4.8,
  ratingCount: 120,
  authorId: 'user1',
  author: {
    id: 'user1',
    email: 'author@example.com',
    name: '张三',
    image: '',
    role: 'USER',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  createdAt: new Date(Date.now() - 86400000), // 1天前
  updatedAt: new Date(),
  categories: [
    { category: mockCategories[0] },
    { category: { id: '100', name: '营销', slug: 'marketing', description: '营销相关' } }
  ],
  tags: [
    { tag: { id: '1', name: '文案', slug: 'copywriting' } },
    { tag: { id: '2', name: '小红书', slug: 'xiaohongshu' } },
    { tag: { id: '3', name: '营销', slug: 'marketing' } }
  ]
};

// Mock related prompts
const mockRelatedPrompts: PromptWithRelations[] = [
  {
    id: '2',
    title: '微博热点文案创作',
    description: '根据热点事件创作微博文案',
    content: '根据热点事件创作...',
    difficulty: 'BEGINNER',
    status: 'APPROVED',
    views: 2341,
    copies: 567,
    rating: 4.5,
    ratingCount: 45,
    authorId: 'user2',
    createdAt: new Date(),
    updatedAt: new Date(),
    categories: [{ category: mockCategories[0] }],
    tags: [{ tag: { id: '4', name: '社交媒体', slug: 'social-media' } }]
  },
  {
    id: '3',
    title: '抖音短视频脚本',
    description: '创作吸引人的抖音短视频脚本',
    content: '创作短视频脚本...',
    difficulty: 'INTERMEDIATE',
    status: 'APPROVED',
    views: 3452,
    copies: 789,
    rating: 4.6,
    ratingCount: 67,
    authorId: 'user3',
    createdAt: new Date(),
    updatedAt: new Date(),
    categories: [{ category: mockCategories[0] }],
    tags: [{ tag: { id: '5', name: '短视频', slug: 'short-video' } }]
  },
  {
    id: '4',
    title: '品牌故事撰写',
    description: '为品牌撰写吸引人的品牌故事',
    content: '撰写品牌故事...',
    difficulty: 'INTERMEDIATE',
    status: 'APPROVED',
    views: 1987,
    copies: 432,
    rating: 4.7,
    ratingCount: 34,
    authorId: 'user4',
    createdAt: new Date(),
    updatedAt: new Date(),
    categories: [{ category: mockCategories[0] }],
    tags: [{ tag: { id: '6', name: '品牌', slug: 'branding' } }]
  }
];

interface PromptPageProps {
  params: {
    id: string;
  };
}

const PromptPage: React.FC<PromptPageProps> = ({ params }) => {
  // In a real app, we would fetch the prompt by ID
  // For now, we'll use the mock data
  const prompt = mockPrompt;

  if (!prompt) {
    notFound();
  }

  // Handle copy action
  const handleCopy = () => {
    // Increment copy count in a real app
    console.log('Prompt copied!');
  };

  // Calculate difficulty display
  const difficultyLabels: Record<string, { label: string; color: string }> = {
    BEGINNER: { label: '初级', color: 'bg-green-100 text-green-800' },
    INTERMEDIATE: { label: '中级', color: 'bg-yellow-100 text-yellow-800' },
    ADVANCED: { label: '高级', color: 'bg-red-100 text-red-800' }
  };
  
  const difficulty = difficultyLabels[prompt.difficulty] || { label: '', color: '' };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <div className="mb-6">
            <button 
              onClick={() => window.history.back()}
              className="inline-flex items-center text-indigo-600 hover:text-indigo-800 text-sm font-medium"
            >
              ← 返回首页
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <article className="bg-white rounded-xl shadow-sm p-6">
                <div className="mb-6">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">{prompt.title}</h1>
                  
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    {/* Category badges */}
                    {prompt.categories.map((pc, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 text-sm font-medium text-indigo-800 bg-indigo-100 rounded-full"
                      >
                        {pc.category.name}
                      </span>
                    ))}
                    
                    {/* Tag badges */}
                    {prompt.tags.map((pt, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-full"
                      >
                        {pt.tag.name}
                      </span>
                    ))}
                    
                    {/* Difficulty badge */}
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${difficulty.color}`}>
                      {difficulty.label}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">⭐</span>
                      <span>{prompt.rating.toFixed(1)} ({prompt.ratingCount} 人评分)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-blue-500">📋</span>
                      <span>{prompt.copies.toLocaleString()} 次复制</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-gray-500">👁️</span>
                      <span>{prompt.views.toLocaleString()} 次浏览</span>
                    </div>
                  </div>
                </div>
                
                <div className="prose max-w-none mb-8">
                  <p className="text-gray-700 mb-6">{prompt.description}</p>
                  
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 mt-8">📝 提示词内容</h2>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <pre className="whitespace-pre-wrap break-words text-gray-800 font-sans">
                      {prompt.content}
                    </pre>
                  </div>
                </div>
                
                {/* Example usage section */}
                <div className="border-t border-gray-200 pt-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">💡 使用示例</h2>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h3 className="font-medium text-blue-800 mb-2">示例输入：</h3>
                    <p className="text-gray-700 mb-3">产品是天然有机蜂蜜，目标群体是25-35岁注重健康的女性</p>
                    
                    <h3 className="font-medium text-blue-800 mb-2">示例输出：</h3>
                    <p className="text-gray-700">
                      🔥超滋润天然蜂蜜，解锁水光肌密码！<br /><br />
                      姐妹们！这款蜂蜜真的太惊喜了！<br />
                      ✨源自深山野花蜜，纯净无污染<br />
                      ✨富含多种维生素，美容养颜一把好<br />
                      ✨温水冲泡，每天一杯元气满满<br /><br />
                      真实体验：坚持喝了一个月，皮肤真的透亮了好多！<br />
                      #天然蜂蜜 #美容养颜 #健康生活 #每日推荐
                    </p>
                  </div>
                </div>
                
                {/* Usage tips */}
                <div className="border-t border-gray-200 pt-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">📖 使用说明</h2>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    <li>将方括号中的内容替换为您具体的场景或产品</li>
                    <li>根据您的品牌调性调整语言风格</li>
                    <li>注意控制文案长度，确保符合平台要求</li>
                    <li>可以结合当前热点话题提升传播效果</li>
                  </ul>
                </div>
              </article>
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                {/* Action buttons */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="space-y-4">
                    <CopyButton 
                      text={prompt.content} 
                      variant="primary" 
                      size="lg"
                      onCopy={handleCopy}
                    />
                    
                    <button className="w-full flex items-center justify-center gap-2 bg-white text-indigo-600 border border-indigo-600 rounded-lg px-4 py-3 font-medium hover:bg-indigo-50 transition-colors">
                      <span>⭐</span>
                      收藏
                    </button>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="font-medium text-gray-900 mb-3">👤 作者信息</h3>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-indigo-600 font-medium">
                          {prompt.author?.name?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{prompt.author?.name || '匿名用户'}</p>
                        <p className="text-sm text-gray-500">发布了 {Math.floor(prompt.author?.id.length % 10) + 1} 个模板</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="font-medium text-gray-900 mb-3">📊 统计数据</h3>
                    <div className="space-y-2 text-sm text-gray-700">
                      <div className="flex justify-between">
                        <span>浏览量</span>
                        <span className="font-medium">{prompt.views.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>复制量</span>
                        <span className="font-medium">{prompt.copies.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>评分</span>
                        <span className="font-medium">{prompt.rating.toFixed(1)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>发布时间</span>
                        <span className="font-medium">
                          {prompt.createdAt.toLocaleDateString('zh-CN')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Related prompts */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">🔗 相关推荐</h3>
                  <div className="space-y-4">
                    {mockRelatedPrompts.map((relatedPrompt) => (
                      <div 
                        key={relatedPrompt.id}
                        className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => window.location.href = `/prompt/${relatedPrompt.id}`}
                      >
                        <h4 className="font-medium text-gray-900 line-clamp-1">{relatedPrompt.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">{relatedPrompt.copies} 次复制</span>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="text-xs text-gray-500">⭐ {relatedPrompt.rating.toFixed(1)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PromptPage;