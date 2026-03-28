// src/app/prompt/[id]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CopyButton from '@/components/CopyButton';
import { Prompt, User } from '@/lib/types';

interface PromptPageProps {
  params: {
    id: string;
  };
}

const PromptPage: React.FC<PromptPageProps> = () => {
  const params = useParams();
  const id = params?.id as string;
  
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [author, setAuthor] = useState<User | null>(null);
  const [relatedPrompts, setRelatedPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchPrompt() {
      try {
        setLoading(true);
        
        // 获取提示词详情
        const res = await fetch(`/api/prompts/${id}`);
        const data = await res.json();
        
        if (data.success) {
          setPrompt(data.data.prompt);
          setAuthor(data.data.author);
          
          // 获取相关推荐
          if (data.data.prompt.categories?.[0]) {
            const categorySlug = data.data.prompt.categories[0].category.slug;
            const relatedRes = await fetch(`/api/prompts?category=${categorySlug}&limit=3`);
            const relatedData = await relatedRes.json();
            if (relatedData.success) {
              setRelatedPrompts(relatedData.data.prompts.filter((p: Prompt) => p.id !== id));
            }
          }
        }
      } catch (err) {
        console.error('Failed to fetch prompt:', err);
      } finally {
        setLoading(false);
      }
    }
    
    if (id) {
      fetchPrompt();
    }
  }, [id]);

  const handleCopy = async () => {
    if (prompt) {
      try {
        await navigator.clipboard.writeText(prompt.content);
        setCopied(true);
        
        // 调用 API 增加复制计数
        await fetch(`/api/prompts/${id}/copy`, { method: 'POST' });
        
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">加载中...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!prompt) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">😕</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">提示词不存在</h1>
            <p className="text-gray-600 mb-4">找不到该提示词模板</p>
            <button 
              onClick={() => window.location.href = '/'}
              className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
            >
              返回首页
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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
                    {prompt.categories?.map((pc, index) => (
                      <a
                        key={index}
                        href={`/category/${pc.category.slug}`}
                        className="px-3 py-1 text-sm font-medium text-indigo-800 bg-indigo-100 rounded-full hover:bg-indigo-200 transition-colors"
                      >
                        {pc.category.name}
                      </a>
                    ))}
                    
                    {/* Tag badges */}
                    {prompt.tags?.map((pt, index) => (
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
                    <pre className="whitespace-pre-wrap break-words text-gray-800 font-sans text-sm leading-relaxed">
                      {prompt.content}
                    </pre>
                  </div>
                  
                  {/* Copy Button */}
                  <div className="mt-4 flex justify-end">
                    <CopyButton 
                      text={prompt.content} 
                      variant="primary" 
                      size="lg"
                      onCopy={handleCopy}
                    />
                  </div>
                </div>
                
                {/* Example usage section */}
                <div className="border-t border-gray-200 pt-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">💡 使用示例</h2>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h3 className="font-medium text-blue-800 mb-2">示例输入：</h3>
                    <p className="text-gray-700 mb-3">产品是天然有机蜂蜜，目标群体是 25-35 岁注重健康的女性</p>
                    
                    <h3 className="font-medium text-blue-800 mb-2">示例输出：</h3>
                    <div className="text-gray-700 bg-white p-3 rounded border border-blue-100">
                      <p className="font-semibold">🔥超滋润天然蜂蜜，解锁水光肌密码！</p>
                      <br />
                      <p>姐妹们！这款蜂蜜真的太惊喜了！</p>
                      <p>✨源自深山野花蜜，纯净无污染</p>
                      <p>✨富含多种维生素，美容养颜一把好</p>
                      <p>✨温水冲泡，每天一杯元气满满</p>
                      <br />
                      <p>真实体验：坚持喝了一个月，皮肤真的透亮了好多！</p>
                      <p className="text-blue-600">#天然蜂蜜 #美容养颜 #健康生活 #每日推荐</p>
                    </div>
                  </div>
                </div>
                
                {/* Usage tips */}
                <div className="border-t border-gray-200 pt-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">📖 使用说明</h2>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    <li>将提示词内容完整复制到 Claude 对话框中</li>
                    <li>替换方括号 <code className="bg-gray-100 px-1 rounded">[...]</code> 中的内容为你实际的需求</li>
                    <li>根据需要调整语气、风格等参数</li>
                    <li>如果结果不理想，可以尝试调整输入或添加更多细节</li>
                  </ul>
                </div>
              </article>
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Author Info */}
              {author && (
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">👤 作者</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-lg">
                      {author.name?.[0]?.toUpperCase() || 'A'}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{author.name || '匿名用户'}</p>
                      <p className="text-sm text-gray-500">
                        {author.role === 'ADMIN' ? '🏅 管理员' : '✅ 认证用户'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Stats */}
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 统计</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">浏览次数</span>
                    <span className="font-medium text-gray-900">{prompt.views.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">复制次数</span>
                    <span className="font-medium text-gray-900">{prompt.copies.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">评分</span>
                    <span className="font-medium text-yellow-600">⭐ {prompt.rating.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">创建时间</span>
                    <span className="font-medium text-gray-900 text-sm">
                      {new Date(prompt.createdAt).toLocaleDateString('zh-CN')}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Related Prompts */}
              {relatedPrompts.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">🔗 相关推荐</h3>
                  <div className="space-y-4">
                    {relatedPrompts.map((related) => (
                      <a
                        key={related.id}
                        href={`/prompt/${related.id}`}
                        className="block group"
                      >
                        <div className="p-3 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors">
                          <h4 className="font-medium text-gray-900 group-hover:text-indigo-600 line-clamp-2 mb-1">
                            {related.title}
                          </h4>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {related.description}
                          </p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <span>📋</span> {related.copies}
                            </span>
                            <span className="flex items-center gap-1">
                              <span>⭐</span> {related.rating.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PromptPage;
