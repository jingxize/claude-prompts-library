# 技术架构文档 - Claude 提示词模板库

## 1. 技术栈选型

### 1.1 核心技术栈

| 层级 | 技术 | 版本 | 选型理由 |
|------|------|------|----------|
| **框架** | Next.js | 14.x | SSR/SEO 友好、App Router、API Routes |
| **语言** | TypeScript | 5.x | 类型安全、开发体验好 |
| **样式** | Tailwind CSS | 3.x | 快速开发、响应式友好 |
| **ORM** | Prisma | 5.x | 类型安全、迁移方便 |
| **数据库** | PostgreSQL | 15.x | 成熟稳定、全文搜索 |
| **认证** | NextAuth.js | 4.x | 支持多 Provider、易集成 |
| **部署** | Vercel | - | 零配置、自动 CI/CD |

### 1.2 备选方案

| 用途 | 首选 | 备选 | 说明 |
|------|------|------|------|
| 部署 | Vercel | Railway/Docker | Vercel 最快上线 |
| 数据库 | PostgreSQL | MySQL/SQLite | PG 全文搜索更强 |
| 认证 | NextAuth | Clerk/Auth0 | NextAuth 免费够用 |

---

## 2. 数据库设计

### 2.1 ER 图

```
┌─────────────┐       ┌─────────────┐
│    User     │       │   Category  │
├─────────────┤       ├─────────────┤
│ id          │       │ id          │
│ email       │       │ name        │
│ name        │       │ slug        │
│ image       │       │ description │
│ role        │       └─────────────┘
└─────────────┘              │
       │                     │
       │  1:N                │  1:N
       ▼                     ▼
┌─────────────┐       ┌─────────────┐
│   Prompt    │──────▶│PromptCategory│
├─────────────┤       └─────────────┘
│ id          │
│ title       │       ┌─────────────┐
│ description │       │    Tag      │
│ content     │       ├─────────────┤
│ difficulty  │       │ id          │
│ status      │       │ name        │
│ views       │       │ slug        │
│ copies      │       └─────────────┘
│ rating      │              │
│ authorId    │              │ N:M
└─────────────┘              │
       │                     │
       │ N:M                 │
       ▼                     ▼
┌─────────────┐       ┌─────────────┐
│   Comment   │       │PromptTag    │
├─────────────┤       └─────────────┘
│ id          │
│ content     │       ┌─────────────┐
│ promptId    │       │   Favorite  │
│ userId      │       ├─────────────┤
│ parentId    │       │ userId      │
│ createdAt   │       │ promptId    │
└─────────────┘       └─────────────┘
```

### 2.2 Prisma Schema

```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// 用户
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  image         String?
  role          Role      @default(USER)
  prompts       Prompt[]
  favorites     Favorite[]
  comments      Comment[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

enum Role {
  USER
  ADMIN
}

// 提示词模板
model Prompt {
  id          String   @id @default(cuid())
  title       String
  description String
  content     String   @db.Text
  difficulty  Difficulty @default(BEGINNER)
  status      Status   @default(PENDING)
  views       Int      @default(0)
  copies      Int      @default(0)
  rating      Float    @default(0)
  ratingCount Int      @default(0)
  
  authorId    String
  author      User     @relation(fields: [authorId], references: [id])
  
  categories  PromptCategory[]
  tags        PromptTag[]
  favorites   Favorite[]
  comments    Comment[]
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([status])
  @@index([authorId])
  @@index([createdAt])
}

enum Difficulty {
  BEGINNER    // 初级
  INTERMEDIATE // 中级
  ADVANCED    // 高级
}

enum Status {
  PENDING     // 待审核
  APPROVED    // 已通过
  REJECTED    // 已拒绝
  DRAFT       // 草稿
}

// 分类
model Category {
  id          String   @id @default(cuid())
  name        String   @unique
  slug        String   @unique
  description String?
  prompts     PromptCategory[]
  
  @@index([slug])
}

// 标签
model Tag {
  id      String   @id @default(cuid())
  name    String   @unique
  slug    String   @unique
  prompts PromptTag[]
  
  @@index([slug])
}

// 提示词 - 分类关联表
model PromptCategory {
  promptId   String
  categoryId String
  prompt     Prompt   @relation(fields: [promptId], references: [id], onDelete: Cascade)
  category   Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  
  @@id([promptId, categoryId])
}

// 提示词 - 标签关联表
model PromptTag {
  promptId String
  tagId    String
  prompt   Prompt @relation(fields: [promptId], references: [id], onDelete: Cascade)
  tag      Tag    @relation(fields: [tagId], references: [id], onDelete: Cascade)
  
  @@id([promptId, tagId])
}

// 收藏
model Favorite {
  userId    String
  promptId  String
  user      User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  prompt    Prompt @relation(fields: [promptId], references: [id], onDelete: Cascade)
  
  @@id([userId, promptId])
}

// 评论
model Comment {
  id        String   @id @default(cuid())
  content   String   @db.Text
  promptId  String
  userId    String
  parentId  String?
  
  prompt    Prompt   @relation(fields: [promptId], references: [id], onDelete: Cascade)
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  parent    Comment? @relation("CommentReplies", fields: [parentId], references: [id])
  replies   Comment[] @relation("CommentReplies")
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([promptId])
  @@index([userId])
}
```

### 2.3 种子数据

```prisma
// seed.ts - 初始分类数据

const categories = [
  { name: '写作', slug: 'writing', description: '文案、文章、邮件、报告' },
  { name: '编程', slug: 'coding', description: '代码生成、调试、解释' },
  { name: '分析', slug: 'analysis', description: '数据分析、总结、洞察' },
  { name: '创意', slug: 'creative', description: '头脑风暴、创意生成' },
  { name: '日常', slug: 'daily', description: '翻译、润色、学习' },
];
```

---

## 3. API 设计

### 3.1 公开接口（无需认证）

| 方法 | 路径 | 描述 | 参数 |
|------|------|------|------|
| GET | `/api/prompts` | 获取提示词列表 | `?category=&tag=&difficulty=&page=&limit=` |
| GET | `/api/prompts/:id` | 获取提示词详情 | - |
| GET | `/api/prompts/hot` | 获取热门提示词 | `?limit=10` |
| GET | `/api/prompts/latest` | 获取最新提示词 | `?limit=10` |
| GET | `/api/categories` | 获取分类列表 | - |
| GET | `/api/tags` | 获取标签列表 | - |
| GET | `/api/search` | 搜索提示词 | `?q=` |

### 3.2 认证接口

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | `/api/auth/register` | 用户注册 |
| POST | `/api/auth/login` | 用户登录 |
| POST | `/api/auth/logout` | 用户登出 |
| GET | `/api/auth/me` | 获取当前用户 |

### 3.3 用户接口（需登录）

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | `/api/prompts` | 创建提示词 |
| PUT | `/api/prompts/:id` | 更新提示词 |
| DELETE | `/api/prompts/:id` | 删除提示词 |
| POST | `/api/prompts/:id/copy` | 复制提示词（计数） |
| POST | `/api/prompts/:id/rate` | 评分 |
| POST | `/api/favorites/:promptId` | 收藏/取消收藏 |
| GET | `/api/favorites` | 获取我的收藏 |
| POST | `/api/comments` | 发表评论 |
| DELETE | `/api/comments/:id` | 删除评论 |

### 3.4 管理接口（需 Admin）

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/api/admin/prompts` | 获取待审核列表 |
| PUT | `/api/admin/prompts/:id/approve` | 通过审核 |
| PUT | `/api/admin/prompts/:id/reject` | 拒绝审核 |
| GET | `/api/admin/users` | 用户管理 |
| PUT | `/api/admin/users/:id/role` | 修改用户角色 |

### 3.5 API 响应格式

**成功响应：**
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100
  }
}
```

**错误响应：**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "标题不能为空",
    "details": [...]
  }
}
```

---

## 4. 项目目录结构

```
claude-prompts-library/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── src/
│   ├── app/                    # Next.js 14 App Router
│   │   ├── layout.tsx
│   │   ├── page.tsx           # 首页
│   │   ├── category/
│   │   │   └── [slug]/
│   │   │       └── page.tsx
│   │   ├── prompt/
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── submit/
│   │   │   └── page.tsx
│   │   ├── search/
│   │   │   └── page.tsx
│   │   └── api/               # API Routes
│   │       ├── prompts/
│   │       ├── categories/
│   │       ├── tags/
│   │       ├── auth/
│   │       ├── favorites/
│   │       ├── comments/
│   │       └── admin/
│   ├── components/
│   │   ├── ui/                # 基础 UI 组件
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Toast.tsx
│   │   │   └── Skeleton.tsx
│   │   ├── layout/            # 布局组件
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Sidebar.tsx
│   │   └── prompt/            # 提示词相关组件
│   │       ├── PromptCard.tsx
│   │       ├── PromptList.tsx
│   │       ├── PromptDetail.tsx
│   │       └── PromptForm.tsx
│   ├── lib/
│   │   ├── prisma.ts          # Prisma 客户端
│   │   ├── auth.ts            # 认证配置
│   │   ├── utils.ts           # 工具函数
│   │   └── validations.ts     # Zod 验证
│   ├── hooks/
│   │   ├── useToast.ts
│   │   └── useCopy.ts
│   └── styles/
│       ├── globals.css
│       └── variables.css
├── public/
│   ├── favicon.ico
│   └── og-image.png
├── .env.local
├── .env.example
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── package.json
└── README.md
```

---

## 5. 部署方案

### 5.1 方案 A：Vercel（推荐）

**优势：**
- 零配置部署
- 自动 CI/CD
- 全球 CDN
- 免费额度充足

**步骤：**
```bash
# 1. 安装 Vercel CLI
npm i -g vercel

# 2. 登录
vercel login

# 3. 部署
vercel

# 4. 生产环境
vercel --prod
```

**环境变量：**
```
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=https://your-domain.com
```

**成本：** $0（个人免费额度）

### 5.2 方案 B：Railway

**优势：**
- 一键部署数据库 + 应用
- 可视化面板
- 自动 SSL

**步骤：**
1. 连接 GitHub 仓库
2. 添加 PostgreSQL 插件
3. 配置环境变量
4. 自动部署

**成本：** $5/月起

### 5.3 方案 C：Docker 自部署

**Dockerfile：**
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx prisma generate
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

**docker-compose.yml：**
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/prompts
    depends_on:
      - db

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=prompts
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

**成本：** 服务器费用（约 $5-10/月）

---

## 6. SEO 优化策略

### 6.1 Meta 标签

```tsx
// app/layout.tsx
export const metadata = {
  title: 'Claude 提示词模板库 - 高质量中文提示词分享',
  description: '发现、分享、学习 Claude AI 提示词模板，覆盖写作、编程、分析、创意等场景',
  keywords: ['Claude', '提示词', 'Prompt', 'AI', '模板'],
  openGraph: {
    title: 'Claude 提示词模板库',
    description: '高质量中文提示词分享平台',
    image: '/og-image.png',
  },
};
```

### 6.2 动态 Meta（详情页）

```tsx
// app/prompt/[id]/page.tsx
export async function generateMetadata({ params }) {
  const prompt = await getPrompt(params.id);
  return {
    title: `${prompt.title} - Claude 提示词库`,
    description: prompt.description,
  };
}
```

### 6.3 Sitemap

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://your-domain.com</loc>
    <changefreq>daily</changefreq>
  </url>
  <url>
    <loc>https://your-domain.com/category/writing</loc>
    <changefreq>weekly</changefreq>
  </url>
  <!-- 动态生成提示词详情页 -->
</urlset>
```

### 6.4 结构化数据

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Claude 提示词模板库",
  "url": "https://your-domain.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://your-domain.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

---

## 7. 开发时间估算

| 阶段 | 任务 | 时间 |
|------|------|------|
| **Day 1** | 项目初始化、数据库配置、基础组件 | 8h |
| **Day 2** | 首页、分类页开发 | 8h |
| **Day 3** | 详情页、复制功能 | 8h |
| **Day 4** | 用户认证、提交流程 | 8h |
| **Day 5** | 搜索、筛选功能 | 8h |
| **Day 6** | 收藏、评分、评论 | 8h |
| **Day 7** | 测试、优化、部署 | 8h |

**总计：** 约 40-50 小时（7 天）

---

## 8. 零成本启动方案

### 8.1 免费额度利用

| 服务 | 免费额度 | 是否够用 |
|------|----------|----------|
| Vercel | 100GB 带宽/月 | ✅ 初期足够 |
| PostgreSQL (Neon) | 0.5GB 存储 | ✅ 初期足够 |
| NextAuth | 完全免费 | ✅ |
| GitHub | 无限 | ✅ |

### 8.2 月度成本预估

| 阶段 | 月访问量 | 预估成本 |
|------|----------|----------|
| **初期** | < 10,000 | $0 |
| **成长期** | 10k-100k | $0-20 |
| **成熟期** | > 100k | $20-100 |

---

## 9. 风险与应对

| 风险 | 影响 | 应对措施 |
|------|------|----------|
| 数据库连接数限制 | 高 | 使用连接池、升级套餐 |
| SEO 竞争激烈 | 中 | 长尾关键词、内容质量 |
| 用户增长缓慢 | 中 | 社交媒体推广、SEO 优化 |
| 内容版权问题 | 高 | 用户协议、侵权投诉机制 |

---

## 10. 下一步行动

1. **初始化项目**
   ```bash
   npx create-next-app@latest claude-prompts-library --typescript --tailwind --app
   ```

2. **配置数据库**
   ```bash
   cd claude-prompts-library
   npm install prisma @prisma-client-js
   npx prisma init
   ```

3. **开发环境启动**
   ```bash
   npm run dev
   ```

4. **按开发计划推进**（见 PRD 第 6 节）
