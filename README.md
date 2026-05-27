使用前提：windows系统，具备python与node.js

# 情绪聊天AI - 完整应用

一个基于AI的情绪化聊天应用，支持三种不同的AI人格模式，具有智能记忆管理和实时情绪感知功能。

## 🌟 项目特色

- **2种AI人格**
  
  - 😈 毒舌模式：毒舌有趣，一针见血
  - ✨ 治愈模式：温柔治愈，温暖陪伴

- **智能功能**
  - 💾 跨会话长期记忆
  - 📊 实时情绪状态可视化
  - 🎭 动态情绪调节
  - 💬 自然流畅的对话体验

- **现代化界面**
  - 🎨 精美的渐变背景和动画效果
  - 📱 响应式设计
  - ⚡ 流畅的用户体验

## 🏗️ 技术架构

### 后端
- **框架**: Flask
- **语言**: Python
- **AI服务**: 阿里云通义千问API
- **跨域**: Flask-CORS

### 前端
- **框架**: React 18 + TypeScript
- **构建工具**: Vite 6
- **UI**: TailwindCSS
- **动画**: Framer Motion (motion/react)
- **图标**: Lucide React

## 📁 项目结构

```
AItest/
├── backend/                 # 后端服务
│   ├── app.py              # Flask应用主文件
│   ├── requirements.txt    # Python依赖
│   ├── memory.json         # 记忆存储文件
│   └── README.md           # 后端文档
├── frontend/                # 前端应用
│   ├── src/
│   │   ├── components/     # React组件
│   │   │   ├── EmotionPage.tsx
│   │   │   ├── DemonPage.tsx
│   │   │   └── AngelPage.tsx
│   │   ├── App.tsx        # 主应用
│   │   ├── main.tsx       # 入口文件
│   │   └── index.css      # 全局样式
│   ├── index.html         # HTML模板
│   ├── package.json       # 项目配置
│   └── README.md          # 前端文档
├── chat.py                 # 原始Python脚本
└── README.md               # 主文档
```

## 🚀 快速开始

### 前置要求

- Python 3.8+
- Node.js 18+
- npm 或 yarn

### 安装后端依赖

```bash
cd backend
pip install -r requirements.txt
```

### 安装前端依赖

```bash
cd frontend
npm install
```

### 启动后端服务

```bash
cd backend
python app.py
```

后端将在 http://localhost:5000 启动

### 启动前端服务

**打开新的终端窗口**，然后：

```bash
cd frontend
npm run dev
```

前端将在 http://localhost:3000 启动

## 📖 使用说明

1. 访问 http://localhost:3000
2. 选择AI模式（情绪模式/毒舌模式/治愈模式）
3. 在输入框中输入消息
4. 点击发送按钮或按Enter键发送
5. 查看AI的回复和情绪状态（情绪模式下）

## 🔧 配置说明

### 后端配置

在 `backend/app.py` 中修改以下配置：

```python
API_KEY = "your-api-key"  # 替换为实际的通义千问API密钥
API_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions"
MODEL_NAME = "qwen-plus-latest"
MEMORY_FILE = "memory.json"
MAX_MEMORY = 3  # 每次最多注入几条记忆
```

### 前端配置

在 `frontend/vite.config.ts` 中修改后端代理地址：

```typescript
server: {
  port: 3000,
  proxy: {
    '/api': {
      target: 'http://localhost:5000',  // 后端地址
      changeOrigin: true,
    }
  }
}
```

## 🎯 功能说明



### 毒舌模式

- **毒舌风格**: 用讽刺、调侃的语气回应
- **一针见血**: 直接说出真相，不拐弯抹角
- **有趣互动**: 让用户既无语又被戳中

### 治愈模式

- **温柔陪伴**: 用温暖的语气回应
- **鼓励肯定**: 肯定用户的努力和勇气
- **理解倾听**: 认真听用户说，不急于给建议

## 🔌 API文档

### POST /api/chat
发送聊天消息

**请求体**:
```json
{
  "message": "你好",
  "mode": "emotion"
}
```

**响应**:
```json
{
  "reply": "AI的回复内容",
  "emotion_state": {
    "concentration": 7.2,
    "distance": 6.5,
    "pulse": 5.8,
    "mood": "平静试探",
    "last_updated": "2024-03-29T10:40:00"
  },
  "memory": "情绪：平静试探 | 意愿：中 | 锚：hello后停顿两秒",
  "mode": "emotion"
}
```

### GET /api/emotion
获取当前情绪状态

### GET /api/memories
获取所有记忆

### DELETE /api/memories
清除所有记忆

### GET /api/health
健康检查

## 🐛 故障排除

### 后端无法启动
- 检查Python版本是否为3.8+
- 确认已安装所有依赖：`pip install -r requirements.txt`
- 检查端口5000是否被占用

### 前端无法连接后端
- 确认后端已启动：访问 http://localhost:5000/api/health
- 检查防火墙设置
- 确认前后端配置的端口一致

### API调用失败
- 检查API密钥是否正确
- 确认通义千问API服务可用
- 查看后端日志获取详细错误信息

## 📝 开发计划

- [ ] 添加用户登录和认证
- [ ] 实现消息历史记录
- [ ] 添加语音输入/输出
- [ ] 支持多语言
- [ ] 添加表情包和贴纸
- [ ] 实现深色模式
- [ ] 添加分享功能

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📮 联系方式

如有问题或建议，请通过以下方式联系：
- 提交Issue
- 发送邮件

---

**祝使用愉快！** 🎉
