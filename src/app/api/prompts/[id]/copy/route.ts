// src/app/api/prompts/[id]/copy/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse } from '@/lib/types';

// 在真实应用中，这里会使用数据库更新复制计数
// 目前使用内存存储模拟
const copyCounts = new Map<string, number>();

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // 增加复制计数
    const currentCount = copyCounts.get(id) || 0;
    copyCounts.set(id, currentCount + 1);
    
    // 在真实应用中，这里会更新数据库
    // await prisma.prompt.update({
    //   where: { id },
    //   data: { copies: { increment: 1 } }
    // });
    
    const response: ApiResponse<{ copies: number }> = {
      success: true,
      data: {
        copies: currentCount + 1
      }
    };
    
    return NextResponse.json(response);
  } catch (error) {
    const errorResponse: ApiResponse<null> = {
      success: false,
      error: {
        code: 'COPY_ERROR',
        message: '增加复制计数失败',
        details: [(error as Error).message]
      }
    };
    
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
