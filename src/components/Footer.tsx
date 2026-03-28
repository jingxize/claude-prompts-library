import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Claude 提示词库
            </h3>
            <p className="text-gray-600 text-sm">
              发现、分享、学习 Claude AI 提示词模板，覆盖写作、编程、分析、创意等场景
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              产品
            </h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-600 hover:text-indigo-600 text-sm">首页</Link></li>
              <li><Link href="/categories" className="text-gray-600 hover:text-indigo-600 text-sm">分类浏览</Link></li>
              <li><Link href="/search" className="text-gray-600 hover:text-indigo-600 text-sm">搜索</Link></li>
              <li><Link href="/submit" className="text-gray-600 hover:text-indigo-600 text-sm">提交模板</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              支持
            </h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-600 hover:text-indigo-600 text-sm">帮助中心</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-indigo-600 text-sm">社区</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-indigo-600 text-sm">反馈</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-indigo-600 text-sm">联系我们</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              法律
            </h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-600 hover:text-indigo-600 text-sm">隐私政策</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-indigo-600 text-sm">服务条款</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-indigo-600 text-sm">版权说明</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-indigo-600 text-sm">Cookie政策</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-600 text-sm">
            &copy; 2026 Claude 提示词库. 保留所有权利。
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;