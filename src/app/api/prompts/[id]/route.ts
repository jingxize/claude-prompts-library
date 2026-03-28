// src/app/api/prompts/[id]/route.ts
import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { ApiResponse, PromptWithRelations } from '@/lib/types';

// Mock data for demonstration
const mockCategories = [
  { id: '1', name: '写作', slug: 'writing', description: '文案、文章、邮件、报告' },
  { id: '2', name: '编程', slug: 'coding', description: '代码生成、调试、解释' },
  { id: '3', 'name': '分析', slug: 'analysis', description: '数据分析、总结、洞察' },
  { id: '4', name: '创意', slug: 'creative', description: '头脑风暴、创意生成' },
  { id: '5', name: '日常', slug: 'daily', description: '翻译、润色、学习' },
];

const mockPrompts: PromptWithRelations[] = [
  {
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
    createdAt: new Date(Date.now() - 86400000),
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
    createdAt: new Date(Date.now() - 172800000),
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
    createdAt: new Date(Date.now() - 259200000),
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
    createdAt: new Date(Date.now() - 345600000),
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
    createdAt: new Date(Date.now() - 432000000),
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
    createdAt: new Date(Date.now() - 518400000),
    updatedAt: new Date(),
    categories: [{ category: mockCategories[0] }],
    tags: [{ tag: { id: '7', name: '职场', slug: 'career' } }]
  }
];

// Helper function to find a prompt by ID
function findPromptById(id: string): PromptWithRelations | undefined {
  return mockPrompts.find(prompt => prompt.id === id);
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Find the prompt by ID
    const prompt = findPromptById(id);
    
    if (!prompt) {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: '提示词未找到'
        }
      };
      
      return NextResponse.json(errorResponse, { status: 404 });
    }
    
    // In a real application, you would increment the view count here
    // await incrementViewCount(id);
    
    const response: ApiResponse<PromptWithRelations> = {
      success: true,
      data: prompt
    };
    
    return NextResponse.json(response);
  } catch (error) {
    const errorResponse: ApiResponse<null> = {
      success: false,
      error: {
        code: 'FETCH_ERROR',
        message: '获取提示词详情失败',
        details: [(error as Error).message]
      }
    };
    
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// POST route to increment copy count
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Find the prompt by ID
    const prompt = findPromptById(id);
    
    if (!prompt) {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: '提示词未找到'
        }
      };
      
      return NextResponse.json(errorResponse, { status: 404 });
    }
    
    // In a real application, you would increment the copy count in the database
    // const updatedPrompt = await incrementCopyCount(id);
    
    // For this mock implementation, we'll just return success
    const response: ApiResponse<{ message: string }> = {
      success: true,
      data: {
        message: '复制计数已增加'
      }
    };
    
    return NextResponse.json(response);
  } catch (error) {
    const errorResponse: ApiResponse<null> = {
      success: false,
      error: {
        code: 'UPDATE_ERROR',
        message: '更新复制计数失败',
        details: [(error as Error).message]
      }
    };
    
    return NextResponse.json(errorResponse, { status: 500 });
  }
}