// src/app/api/categories/route.ts
import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { ApiResponse, Category } from '@/lib/types';

// Mock data for demonstration
const mockCategories: Category[] = [
  { id: '1', name: '写作', slug: 'writing', description: '文案、文章、邮件、报告' },
  { id: '2', name: '编程', slug: 'coding', description: '代码生成、调试、解释' },
  { id: '3', name: '分析', slug: 'analysis', description: '数据分析、总结、洞察' },
  { id: '4', name: '创意', slug: 'creative', description: '头脑风暴、创意生成' },
  { id: '5', name: '日常', slug: 'daily', description: '翻译、润色、学习' },
];

export async function GET(request: NextRequest) {
  try {
    const response: ApiResponse<Category[]> = {
      success: true,
      data: mockCategories
    };
    
    return NextResponse.json(response);
  } catch (error) {
    const errorResponse: ApiResponse<null> = {
      success: false,
      error: {
        code: 'FETCH_ERROR',
        message: '获取分类列表失败',
        details: [(error as Error).message]
      }
    };
    
    return NextResponse.json(errorResponse, { status: 500 });
  }
}