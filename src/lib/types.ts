// 定义与Prisma schema匹配的类型

// Difficulty枚举类型
export type Difficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

// Status枚举类型
export type Status = 'PENDING' | 'APPROVED' | 'REJECTED' | 'DRAFT';

// 基础User类型
export interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
  role: 'USER' | 'ADMIN';
  createdAt: Date;
  updatedAt: Date;
}

// 基础Category类型
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

// 基础Tag类型
export interface Tag {
  id: string;
  name: string;
  slug: string;
}

// PromptCategory关联类型
export interface PromptCategory {
  category: Category;
}

// PromptTag关联类型
export interface PromptTag {
  tag: Tag;
}

// 基础Prompt类型
export interface Prompt {
  id: string;
  title: string;
  description: string;
  content: string;
  difficulty: Difficulty;
  status: Status;
  views: number;
  copies: number;
  rating: number;
  ratingCount: number;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  author?: User;
}

// 带有关联关系的Prompt类型
export interface PromptWithRelations extends Prompt {
  categories: PromptCategory[];
  tags: PromptTag[];
  author?: User;
}

// API响应类型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any[];
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}