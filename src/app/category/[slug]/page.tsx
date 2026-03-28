// src/app/category/[slug]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PromptCard from '@/components/PromptCard';
import CategoryBadge from '@/components/CategoryBadge';
import { Prompt, Category } from '@/lib/types';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

const CategoryPage: React.FC<CategoryPageProps> = () => {
  const params = useParams();
  const slug = params?.slug as string;
  
  const [category, setCategory] = useState<Category | null>(null);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // 获取所有分类
        const categoriesRes = await fetch('/api/categories');
        const categoriesData = await categoriesRes.json();
        
        if (categoriesData.success) {
          setAllCategories(categoriesData.data);
          const foundCategory = categoriesData.data.find((c: Category) => c.slug === slug);
          setCategory(foundCategory || null);
        }
        
        // 获取该分类下的提示词
        const promptsRes = await fetch(`/api/prompts?category=${slug}`);
        const promptsData = await promptsRes.json();
        
        if (promptsData.success) {
          setPrompts(promptsData.data.prompts);
        }
        
        setError(null);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('加载失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    }
    
    if (slug) {
      fetchData();
    }
  }, [slug]);

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

  if (error || !category) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">😕</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">分类不存在</h1>
            <p className="text-gray-600 mb-4">{error || '找不到该分类'}</p>
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
              {prompts.length} 个相关提示词模板
            </div>
          </section>
          
          {/* Other Categories */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">其他分类</h2>
            <div className="flex flex-wrap gap-3">
              {allCategories
                .filter(cat => cat.slug !== slug)
                .map((otherCat) => (
                  <a 
                    key={otherCat.id}
                    href={`/category/${otherCat.slug}`}
                    className="inline-block"
                  >
                    <CategoryBadge 
                      name={otherCat.name} 
                      slug={otherCat.slug} 
                    />
                  </a>
                ))}
            </div>
          </section>
          
          {/* Category Prompts */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {category.name} 相关提示词
            </h2>
            
            {prompts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {prompts.map((prompt) => (
                  <PromptCard key={prompt.id} prompt={prompt} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">暂无提示词</h3>
                <p className="text-gray-500 mb-4">该分类下还没有提示词模板</p>
                <button 
                  onClick={() => window.location.href = '/submit'}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors"
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
