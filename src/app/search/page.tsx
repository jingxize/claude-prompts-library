// src/app/search/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchBox from '@/components/SearchBox';
import PromptCard from '@/components/PromptCard';
import { Prompt } from '@/lib/types';

const SearchPage: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const initialQuery = searchParams?.get('q') || '';
  const initialSort = searchParams?.get('sort') || 'relevance';
  
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState(initialSort);

  useEffect(() => {
    async function searchPrompts() {
      if (!query.trim()) {
        setResults([]);
        return;
      }
      
      setLoading(true);
      try {
        const params = new URLSearchParams({
          q: query,
          sort: sortBy
        });
        
        const res = await fetch(`/api/prompts?${params.toString()}`);
        const data = await res.json();
        
        if (data.success) {
          setResults(data.data.prompts);
        }
      } catch (err) {
        console.error('Search failed:', err);
      } finally {
        setLoading(false);
      }
    }
    
    const debounceTimer = setTimeout(searchPrompts, 300);
    return () => clearTimeout(debounceTimer);
  }, [query, sortBy]);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    router.push(`/search?q=${encodeURIComponent(searchQuery)}&sort=${sortBy}`);
  };

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
    router.push(`/search?q=${encodeURIComponent(query)}&sort=${newSort}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search Header */}
          <section className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">搜索提示词</h1>
            <div className="max-w-2xl">
              <SearchBox 
                placeholder="搜索提示词、标签或分类..." 
                onSearch={handleSearch}
                defaultValue={query}
              />
            </div>
          </section>
          
          {/* Results Info & Sort */}
          {query && (
            <section className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-gray-700">
                  {loading ? (
                    <span className="text-gray-500">搜索中...</span>
                  ) : (
                    <>
                      找到 <span className="font-semibold text-indigo-600">{results.length}</span> 个相关提示词
                      {query && (
                        <span className="text-gray-500"> - 搜索关键词："{query}"</span>
                      )}
                    </>
                  )}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">排序：</span>
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="relevance">相关度</option>
                  <option value="popular">热门</option>
                  <option value="newest">最新</option>
                  <option value="rating">评分</option>
                </select>
              </div>
            </section>
          )}
          
          {/* Results */}
          <section>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
                    <div className="flex gap-2 mb-3">
                      <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
                      <div className="h-6 w-12 bg-gray-200 rounded-full"></div>
                    </div>
                    <div className="h-5 w-3/4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 w-full bg-gray-200 rounded mb-4"></div>
                    <div className="flex justify-between mt-4">
                      <div className="h-4 w-20 bg-gray-200 rounded"></div>
                      <div className="h-4 w-20 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : results.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((prompt) => (
                  <PromptCard key={prompt.id} prompt={prompt} />
                ))}
              </div>
            ) : query ? (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                <div className="text-6xl mb-4">😕</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">未找到相关结果</h3>
                <p className="text-gray-500 mb-4">试试其他关键词，或者浏览热门分类</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {['写作', '编程', '分析', '创意'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => router.push(`/category/${cat}`)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">输入关键词开始搜索</h3>
                <p className="text-gray-500">
                  试试搜索 "文案"、"Python"、"数据分析" 等关键词
                </p>
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
