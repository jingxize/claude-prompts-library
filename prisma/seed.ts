import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const { hash } = bcrypt;

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 开始种子数据填充...');

  // 创建分类
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'writing' },
      update: {},
      create: {
        name: '写作',
        slug: 'writing',
        description: '文案、文章、邮件、报告'
      },
    }),
    prisma.category.upsert({
      where: { slug: 'coding' },
      update: {},
      create: {
        name: '编程',
        slug: 'coding',
        description: '代码生成、调试、解释'
      },
    }),
    prisma.category.upsert({
      where: { slug: 'analysis' },
      update: {},
      create: {
        name: '分析',
        slug: 'analysis',
        description: '数据分析、总结、洞察'
      },
    }),
    prisma.category.upsert({
      where: { slug: 'creative' },
      update: {},
      create: {
        name: '创意',
        slug: 'creative',
        description: '头脑风暴、创意生成'
      },
    }),
    prisma.category.upsert({
      where: { slug: 'daily' },
      update: {},
      create: {
        name: '日常',
        slug: 'daily',
        description: '翻译、润色、学习'
      },
    }),
  ]);

  console.log('✅ 分类创建完成');

  // 创建一个默认用户
  const defaultUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  console.log('✅ 默认用户创建完成');

  // 创建示例提示词模板
  const promptsData = [
    {
      title: '小红书爆款文案生成器',
      description: '帮助快速生成小红书风格的产品文案',
      content: `你是一位资深的小红书博主，擅长创作爆款笔记。请帮我创作一篇关于[产品/主题]的小红书文案。

要求：
1. 使用小红书常见的标题格式（如"保姆级教程"、"宝藏推荐"等）
2. 内容包含使用体验和真实感受
3. 使用emoji增加亲和力
4. 包含2-3个小标题分段
5. 结尾加上互动问题引导点赞收藏

产品/主题：[在这里填入具体产品或主题]`,
      difficulty: 'BEGINNER',
      categories: ['writing'],
      tags: ['文案', '营销', '小红书']
    },
    {
      title: 'Python代码解释器',
      description: '解释Python代码的功能和逻辑',
      content: `请详细解释以下Python代码的功能和每一行的作用：

\`\`\`python
[在这里粘贴Python代码]
\`\`\`

请提供：
1. 代码整体功能概述
2. 每一行或每一段代码的具体作用
3. 如果有函数，请说明参数和返回值
4. 代码中使用的算法或逻辑原理
5. 可能的改进或优化建议`,
      difficulty: 'INTERMEDIATE',
      categories: ['coding'],
      tags: ['Python', '代码解释', '学习']
    },
    {
      title: 'Excel数据分析助手',
      description: '分析Excel数据并提供洞察',
      content: `你是一位专业的数据分析师，请分析以下Excel数据并提供洞察：

数据内容：[在这里描述或粘贴Excel数据的主要内容]

请提供：
1. 数据概览（总行数、主要字段、数据类型）
2. 关键指标分析（平均值、最大值、最小值、趋势等）
3. 异常值识别
4. 数据可视化建议
5. 业务洞察和改进建议

如果可能，请推荐适合的Excel公式或函数来自动化这些分析。`,
      difficulty: 'ADVANCED',
      categories: ['analysis'],
      tags: ['数据分析', 'Excel', '商业智能']
    },
    {
      title: '品牌名创意思维导图',
      description: '为新产品生成品牌名和创意方向',
      content: `请为[产品/服务类别]生成创新的品牌名和市场定位方案。

要求：
1. 提供5-10个原创品牌名建议
2. 每个名字附带命名理念说明
3. 提供目标受众画像
4. 制定初步的品牌定位策略
5. 建议品牌视觉风格方向

产品/服务类别：[在这里填入具体的产品或服务]`,
      difficulty: 'INTERMEDIATE',
      categories: ['creative'],
      tags: ['品牌', '创意', '命名']
    },
    {
      title: '中英互译及润色',
      description: '提供高质量的中英文互译和润色服务',
      content: `请帮我翻译以下内容，并进行润色使其更自然地道：

原文：
[在这里粘贴需要翻译的内容]

要求：
1. 准确传达原意
2. 保持原文风格和语调
3. 符合目标语言的习惯表达
4. 如有文化差异，提供适当的本地化调整
5. 解释翻译中的关键决策

源语言：[中文/英文]
目标语言：[英文/中文]`,
      difficulty: 'BEGINNER',
      categories: ['daily'],
      tags: ['翻译', '润色', '语言']
    },
    {
      title: '周报生成助手',
      description: '根据工作内容生成结构化的周报',
      content: `请帮我整理本周的工作内容，生成一份专业的周报。

本周工作内容：
[在这里详细列出本周完成的工作任务]

要求：
1. 按项目或任务类型分类
2. 突出关键成果和数据指标
3. 说明遇到的问题及解决方案
4. 列出下周工作计划
5. 语言正式且简洁

岗位/部门：[在这里填入岗位或部门信息]`,
      difficulty: 'BEGINNER',
      categories: ['writing'],
      tags: ['周报', '工作总结', '职场']
    },
    {
      title: 'JavaScript调试专家',
      description: '帮助调试JavaScript代码中的错误',
      content: `请帮我找出以下JavaScript代码中的错误并提供修复方案：

\`\`\`javascript
[在这里粘贴JavaScript代码]
\`\`\`

请提供：
1. 错误类型和位置
2. 错误原因分析
3. 修复建议和代码
4. 如有性能问题，提供优化建议
5. 代码最佳实践建议

运行环境：[浏览器/node.js等]`,
      difficulty: 'INTERMEDIATE',
      categories: ['coding'],
      tags: ['JavaScript', '调试', '前端']
    },
    {
      title: '会议纪要整理器',
      description: '将会议录音或笔记整理成结构化纪要',
      content: `请将以下会议内容整理成结构化的会议纪要：

会议主题：[会议主题]
参与人员：[列出参与人员]
会议时间：[会议时间]

会议内容：
[在这里填入会议的详细内容、讨论要点、发言摘要等]

请整理为：
1. 会议基本信息
2. 主要议题及讨论结果
3. 决策事项
4. 待办事项及负责人
5. 下次会议安排`,
      difficulty: 'BEGINNER',
      categories: ['analysis'],
      tags: ['会议纪要', '整理', '职场']
    },
    {
      title: '社交媒体广告文案',
      description: '创作吸引人的社交媒体广告文案',
      content: `请为[产品/服务]创作社交媒体广告文案，适用于[平台名称]。

产品/服务：[详细描述产品或服务]
目标受众：[描述目标受众特征]
平台：[微博/微信/抖音等]
期望效果：[提升品牌知名度/促进销售转化等]

要求：
1. 标题吸引眼球
2. 突出核心卖点
3. 包含明确的行动号召
4. 符合平台调性
5. 长度控制在合适范围内`,
      difficulty: 'INTERMEDIATE',
      categories: ['creative'],
      tags: ['广告', '营销', '社交媒体']
    },
    {
      title: '英语语法检查器',
      description: '检查并修正英语文本中的语法错误',
      content: `请检查以下英文文本的语法、拼写和表达方式，并提供修正版本：

原文：
[在这里粘贴英文文本]

请提供：
1. 修正后的文本
2. 指出所有语法和拼写错误
3. 解释错误原因
4. 提供更好的表达建议
5. 保持原文的整体意思不变`,
      difficulty: 'BEGINNER',
      categories: ['daily'],
      tags: ['英语', '语法', '学习']
    },
    {
      title: '产品说明书撰写',
      description: '撰写专业的产品说明书',
      content: `请为[产品名称]撰写一份详细的产品说明书。

产品信息：
- 产品名称：[产品名称]
- 产品功能：[详细描述产品功能]
- 技术参数：[列出技术参数]
- 目标用户：[描述目标用户群体]
- 使用场景：[描述典型使用场景]

要求包括：
1. 产品概述
2. 功能特点详细介绍
3. 使用方法和步骤
4. 注意事项和维护保养
5. 常见问题解答`,
      difficulty: 'INTERMEDIATE',
      categories: ['writing'],
      tags: ['说明书', '文档', '产品']
    },
    {
      title: 'SQL查询优化器',
      description: '优化SQL查询语句的性能',
      content: `请分析以下SQL查询语句的性能，并提供优化建议：

\`\`\`sql
[在这里粘贴SQL查询语句]
\`\`\`

表结构信息：
[描述相关表的结构，包括字段、索引等]

请提供：
1. 当前查询的性能瓶颈分析
2. 优化后的SQL语句
3. 索引建议
4. 执行计划分析
5. 预期性能提升`,
      difficulty: 'ADVANCED',
      categories: ['coding'],
      tags: ['SQL', '数据库', '性能优化']
    },
    {
      title: '销售数据分析报告',
      description: '分析销售数据并生成分析报告',
      content: `请分析以下销售数据并生成详细的分析报告：

销售数据概要：
- 时间范围：[时间段]
- 产品/服务：[涉及的产品或服务]
- 销售额：[销售额数据]
- 订单数量：[订单数]
- 客户数量：[客户数]

请提供：
1. 销售业绩总体分析
2. 产品/服务销售排名
3. 客户购买行为分析
4. 时间趋势分析
5. 问题点和机会点识别
6. 改进建议`,
      difficulty: 'INTERMEDIATE',
      categories: ['analysis'],
      tags: ['销售', '数据分析', '商业']
    },
    {
      title: '故事大纲创作',
      description: '创作吸引人的故事大纲',
      content: `请为[故事类型]创作一个完整的故事大纲。

故事要求：
- 故事类型：[悬疑/爱情/科幻/奇幻等]
- 主要角色：[主角设定]
- 故事背景：[时代、地点等背景信息]
- 主题思想：[想要表达的主题]
- 目标长度：[短篇/中篇/长篇]

请提供：
1. 故事基本设定
2. 主要角色介绍
3. 情节大纲（开端、发展、高潮、结局）
4. 冲突和转折点
5. 主题表达方式`,
      difficulty: 'INTERMEDIATE',
      categories: ['creative'],
      tags: ['故事', '创作', '文学']
    },
    {
      title: '邮件礼仪顾问',
      description: '协助撰写专业得体的商务邮件',
      content: `请帮我撰写一封关于[邮件主题]的商务邮件。

收件人：[收件人身份和关系]
邮件目的：[具体目的，如请求、通知、感谢等]
背景信息：[必要的背景说明]

要求：
1. 语气专业得体
2. 结构清晰（开头、正文、结尾）
3. 考虑文化差异
4. 适当的礼貌用语
5. 明确的行动指引（如适用）`,
      difficulty: 'BEGINNER',
      categories: ['daily'],
      tags: ['邮件', '商务', '职场']
    },
    {
      title: '博客文章大纲生成',
      description: '生成结构清晰的博客文章大纲',
      content: `请为[主题]生成一个详细的博客文章大纲。

主题：[具体的博客主题]
目标读者：[描述目标读者群体]
文章长度：[期望的文章长度]
写作风格：[教育性/娱乐性/专业性等]

要求包括：
1. 引言部分
2. 主体内容分段（至少3-5个要点）
3. 每个要点的详细说明
4. 结论部分
5. SEO关键词建议`,
      difficulty: 'BEGINNER',
      categories: ['writing'],
      tags: ['博客', '大纲', 'SEO']
    },
    {
      title: 'React组件文档生成',
      description: '为React组件生成详细的文档',
      content: `请为以下React组件生成详细的文档：

\`\`\`jsx
[在这里粘贴React组件代码]
\`\`\`

请提供：
1. 组件概述
2. Props说明（类型、默认值、是否必需）
3. 使用示例
4. 注意事项
5. 可能的扩展方式

组件功能：[简述组件的主要功能]`,
      difficulty: 'INTERMEDIATE',
      categories: ['coding'],
      tags: ['React', '文档', '前端']
    },
    {
      title: '竞品分析报告',
      description: '生成详细的竞品分析报告',
      content: `请对[产品/服务]进行竞品分析。

分析对象：[主要竞争对手及其产品]
分析维度：
- 功能对比
- 用户体验
- 定价策略
- 市场表现
- 优劣势分析

请提供：
1. 竞品概况
2. 详细对比分析
3. 机会点识别
4. 建议策略
5. 数据支撑`,
      difficulty: 'ADVANCED',
      categories: ['analysis'],
      tags: ['竞品分析', '市场研究', '商业']
    },
    {
      title: '诗歌创作助手',
      description: '根据主题创作诗歌',
      content: `请根据[主题/情感]创作一首[诗歌类型]。

主题：[具体主题或要表达的情感]
诗歌类型：[古体诗/现代诗/自由诗等]
风格要求：[优雅/豪放/清新等]
长度要求：[短诗/中等长度/长诗]

请考虑：
1. 语言的韵律美
2. 意境的营造
3. 情感的表达
4. 修辞手法的运用`,
      difficulty: 'INTERMEDIATE',
      categories: ['creative'],
      tags: ['诗歌', '创作', '文学']
    },
    {
      title: '学习计划制定',
      description: '制定个性化的学习计划',
      content: `请帮我制定[技能/知识领域]的学习计划。

学习目标：[具体的学习目标]
时间安排：[可用学习时间，如每天1小时，持续3个月等]
当前水平：[初学者/有一定基础等]
学习偏好：[理论学习/实践操作/视频课程等]

要求：
1. 学习路径规划
2. 阶段性目标设定
3. 学习资源推荐
4. 实践练习安排
5. 进度评估方法`,
      difficulty: 'BEGINNER',
      categories: ['daily'],
      tags: ['学习计划', '教育', '自我提升']
    },
    {
      title: '新闻稿撰写',
      description: '撰写专业的新闻稿',
      content: `请撰写一篇关于[事件/发布/成就]的新闻稿。

新闻要素：
- 新闻事件：[详细描述新闻事件]
- 时间地点：[发生的时间和地点]
- 关键人物：[涉及的关键人物]
- 重要意义：[事件的重要性和影响]

要求：
1. 新闻稿标准格式
2. 客观中立的表述
3. 引用关键人物观点
4. 背景信息补充
5. 联系方式`,
      difficulty: 'INTERMEDIATE',
      categories: ['writing'],
      tags: ['新闻稿', '公关', '媒体']
    }
  ];

  // 创建提示词
  for (const promptData of promptsData) {
    const prompt = await prisma.prompt.create({
      data: {
        title: promptData.title,
        description: promptData.description,
        content: promptData.content,
        difficulty: promptData.difficulty,
        authorId: defaultUser.id,
        status: 'APPROVED', // 设置为已批准，便于演示
        categories: {
          create: promptData.categories.map(categorySlug => ({
            category: {
              connect: {
                slug: categorySlug
              }
            }
          }))
        },
        tags: {
          create: promptData.tags.map(tagName => {
            // 先尝试查找标签，如果不存在则创建
            return {
              tag: {
                connectOrCreate: {
                  where: { name: tagName },
                  create: {
                    name: tagName,
                    slug: tagName.toLowerCase().replace(/\s+/g, '-'),
                  }
                }
              }
            };
          })
        }
      }
    });
    
    console.log(`✅ 提示词 "${prompt.title}" 创建完成`);
  }

  console.log('🎉 种子数据填充完成！');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });