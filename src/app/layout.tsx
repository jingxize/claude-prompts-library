import './globals.css';

export const metadata = {
  title: 'Claude 提示词模板库 - 高质量中文提示词分享',
  description: '发现、分享、学习 Claude AI 提示词模板，覆盖写作、编程、分析、创意等场景',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}