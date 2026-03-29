# 情绪聊天AI - 前端应用

## 简介

基于React + Vite的现代化前端应用，支持三种AI聊天模式：
- **情绪模式**：复杂情绪系统，实时显示AI情绪状态和记忆
- **毒舌模式**：毒舌有趣，一针见血的恶魔风格
- **治愈模式**：温柔治愈，温暖陪伴的天使风格

## 技术栈

- **框架**: React 18 + TypeScript
- **构建工具**: Vite 6
- **UI**: TailwindCSS
- **动画**: Framer Motion (motion/react)
- **图标**: Lucide React

## 安装依赖

```bash
npm install
```

## 运行开发服务器

```bash
npm run dev
```

服务将在 http://localhost:3000 启动

## 构建生产版本

```bash
npm run build
```

## 预览生产构建

```bash
npm run preview
```

## 项目结构

```
frontend/
├── src/
│   ├── components/
│   │   ├── EmotionPage.tsx      # 情绪模式页面
│   │   ├── DemonPage.tsx        # 毒舌模式页面
│   │   └── AngelPage.tsx        # 治愈模式页面
│   ├── App.tsx                  # 主应用组件
│   ├── main.tsx                 # 入口文件
│   └── index.css                # 全局样式
├── index.html                   # HTML模板
├── package.json                 # 项目配置
├── vite.config.ts              # Vite配置
├── tsconfig.json               # TypeScript配置
└── tailwind.config.js          # Tailwind配置
```

## 功能特性

### 情绪模式
- ✨ 实时情绪指示器（浓度、距离、脉冲）
- 💾 记忆管理和展示
- 🎨 渐变背景和动画效果
- 💬 智能聊天对话

### 毒舌模式
- 🌙 深色星空背景
- 😈 毒舌风格AI回应
- ✨ 闪烁星星动画
- 💬 流畅的对话体验

### 治愈模式
- ☀️ 阳光主题背景
- 🌸 温暖治愈风格
- ✨ 柔和的光线动画
- 💬 温暖的对话体验

## API集成

前端通过以下端点与后端通信：

- `POST /api/chat` - 发送聊天消息
- `GET /api/emotion` - 获取情绪状态
- `GET /api/memories` - 获取记忆列表
- `DELETE /api/memories` - 清除记忆

## 注意事项

1. 确保后端服务已启动（运行在 http://localhost:5000）
2. 前端配置了代理，可以直接使用 `/api/*` 路径
3. 如果后端地址不同，请修改 `vite.config.ts` 中的代理配置

## 开发建议

- 使用 TypeScript 进行类型检查
- 遵循 React Hooks 最佳实践
- 保持组件的单一职责原则
- 使用 Framer Motion 实现流畅的动画效果
