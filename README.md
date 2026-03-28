# Claude 提示词模板库 🎯

一个面向中文用户的 Claude AI 提示词分享平台，帮助用户更好地使用 Claude AI。

## ✨ 特性

- 🎯 **快速上手**：新手找到即用的高质量提示词
- 📚 **学习成长**：从模板中学习提示词编写技巧
- 🔍 **精准搜索**：按场景/难度/分类快速定位
- ✨ **一键复制**：点击即复制到剪贴板

## 🚀 技术栈

- **框架**: Next.js 14.x (App Router)
- **语言**: TypeScript 5.x
- **样式**: Tailwind CSS 3.x
- **ORM**: Prisma 5.x
- **数据库**: PostgreSQL 15.x
- **认证**: NextAuth.js 4.x
- **部署**: Vercel

## 📚 项目文档

- [产品需求文档 (PRD)](./docs/prd.md)
- [UI 设计文档](./docs/ui-design.md)
- [技术架构文档](./docs/tech-architecture.md)

## 🏗️ 功能分类

| 分类 | 描述 | 示例 |
|------|------|------|
| **写作** | 文案、文章、邮件、报告 | 小红书文案、周报、邮件 |
| **编程** | 代码生成、调试、解释 | Python 脚本、SQL 查询 |
| **分析** | 数据分析、总结、洞察 | Excel 分析、会议纪要 |
| **创意** | 头脑风暴、创意生成 | 品牌名、广告语、故事 |
| **日常** | 翻译、润色、学习 | 翻译、语法检查、学习 |

## 🛠️ 开发指南

### 环境要求

- Node.js 18+ 
- npm 或 pnpm
- PostgreSQL 数据库

### 快速开始

```bash
# 安装依赖
npm install

# 配置环境变量
cp .env.example .env.local

# 运行开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

### 数据库设置

```bash
# 初始化 Prisma
npx prisma init

# 运行数据库迁移
npx prisma migrate dev

# 生成 Prisma 客户端
npx prisma generate
```

## 📦 项目结构

```
claude-prompts-library/
├── src/
│   ├── app/           # Next.js App Router 页面
│   ├── components/    # React 组件
│   ├── lib/           # 工具函数
│   └── styles/        # 全局样式
├── docs/              # 项目文档
├── prisma/            # 数据库 Schema
├── public/            # 静态资源
└── package.json
```

## 🎨 UI 设计

- **主色**: Indigo (#6366F1)
- **辅助色**: Emerald (#10B981)
- **强调色**: Amber (#F59E0B)
- **字体**: Inter

详细设计规范请参阅 [UI 设计文档](./docs/ui-design.md)

## 📄 许可证

MIT License

## 👥 贡献

欢迎提交 Issue 和 Pull Request！

---

**Built with ❤️ by jingxize**
