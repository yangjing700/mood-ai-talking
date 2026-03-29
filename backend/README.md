# 情绪聊天AI - 后端服务

## 简介

基于Flask的情绪化AI聊天后端服务，支持三种模式：
- **天使模式**：温柔治愈，温暖陪伴
- **恶魔模式**：毒舌有趣，一针见血
- **情绪模式**：复杂情绪系统，包含浓度、距离、主动脉冲三个维度

## 核心功能

### 1. 情绪管理 (EmotionManager)
- 管理AI的情绪状态
- 包含三个维度：浓度(0-10)、距离(0-10)、主动脉冲(0-10)
- 实时更新情绪状态

### 2. 记忆管理 (MemoryManager)
- 跨会话长期记忆
- 记忆提取和存储
- 记忆提示构建

### 3. AI聊天服务 (AIChatService)
- 对接阿里云通义千问API
- 智能记忆管理
- 多模式支持

## 安装依赖

```bash
pip install -r requirements.txt
```

## 运行服务

```bash
python app.py
```

服务将在 http://localhost:5000 启动

## API端点

### POST /api/chat
发送聊天消息

**请求体：**
```json
{
  "message": "你好",
  "mode": "emotion"
}
```

**响应：**
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

## 配置

在 `app.py` 中修改API_KEY等配置项。

## 测试

```bash
# 健康检查
curl http://localhost:5000/api/health

# 发送消息
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "你好", "mode": "emotion"}'
```
