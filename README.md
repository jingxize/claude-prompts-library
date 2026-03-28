# Claude 提示词模板库 - MVP

基于 Toolify.ai 榜单分析，我们正在构建一个中文用户的 Claude 提示词分享平台。

## 项目结构

```
claude-prompts-library/
├── prisma/
│   ├── schema.prisma          # 数据库模型定义
│   └── seed.ts               # 种子数据脚本
├── src/
│   ├── app/                  # Next.js 14 App Router
│   │   ├── layout.tsx        # 根布局
│   │   ├── page.tsx          # 首页
│   │   ├── category/
│   │   │   └── [slug]/
│   │   │       └── page.tsx  # 分类页
│   │   ├── prompt/
│   │   │   └── [id]/
│   │   │       └── page.tsx  # 详情页
│   │   ├── search/
│   │   │   └── page.tsx      # 搜索页
│   │   └── api/              # API 路由
│   │       ├── prompts/
│   │       │   └── [id]/
│   │       │       └── route.ts
│   │       └── categories/
│   │           └── route.ts
│   ├── components/           # 可复用组件
│   │   ├── PromptCard.tsx    # 提示词卡片
│   │   ├── CategoryBadge.tsx # 分类标签
│   │   ├── CopyButton.tsx    # 复制按钮
│   │   ├── SearchBox.tsx     # 搜索框
│   │   ├── Header.tsx        # 顶部导航
│   │   └── Footer.tsx        # 页脚
│   ├── lib/
│   │   └── types.ts          # 类型定义
│   └── globals.css           # 全局样式
├── package.json
└── README.md
```

## MVP 功能完成情况

### 阶段 1: 数据库设置 (P0) ✅
- [x] 创建 `prisma/schema.prisma` 文件，包含以下模型:
  - User (用户)
  - Prompt (提示词模板 - 核心表)
  - Category (分类 - 5 大分类)
  - PromptCategory (多对多关系)
  - Tag (标签)
  - PromptTag (多对多关系)
- [x] 创建种子数据脚本 `prisma/seed.ts`:
  - 5 个分类 (写作、编程、分析、创意、日常)
  - 21 个示例提示词模板

### 阶段 2: 核心页面组件 (P0) ✅
- [x] **首页** (`src/app/page.tsx`):
  - 搜索框
  - 热门分类展示
  - 热门提示词卡片 (6 个)
  - 最新提示词卡片 (2 个)
- [x] **分类页** (`src/app/category/[slug]/page.tsx`):
  - 分类标题和描述
  - 提示词列表
- [x] **详情页** (`src/app/prompt/[id]/page.tsx`):
  - 提示词标题、分类、难度
  - 提示词内容 (代码块展示)
  - 一键复制按钮
  - 使用示例
  - 作者信息
- [x] **搜索页** (`src/app/search/page.tsx`):
  - 搜索框
  - 搜索结果列表
  - 空状态提示

### 阶段 3: 组件库 (P0) ✅
- [x] `PromptCard.tsx` - 提示词卡片
- [x] `CategoryBadge.tsx` - 分类标签
- [x] `CopyButton.tsx` - 复制按钮 (带 Toast 提示)
- [x] `SearchBox.tsx` - 搜索框
- [x] `Header.tsx` - 顶部导航
- [x] `Footer.tsx` - 页脚

### 阶段 4: API 路由 (P1) ✅
- [x] `GET /api/prompts` - 获取提示词列表 (支持筛选/分页)
- [x] `GET /api/prompts/:id` - 获取单个提示词详情
- [x] `GET /api/categories` - 获取分类列表
- [x] `POST /api/prompts/:id/copy` - 增加复制计数

## 技术栈
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL (数据库设计)

## 开发说明

1. 项目遵循 `docs/ui-design.md` 的设计规范
2. 使用响应式设计 (移动优先)
3. 所有代码包含 TypeScript 类型定义
4. 组件可复用，遵循原子设计理念

## 运行项目

```bash
npm install
npx prisma generate
npm run dev
```

## 下一步

- 集成真实的数据库连接
- 添加用户认证系统
- 实现提示词提交功能
- 完善搜索功能