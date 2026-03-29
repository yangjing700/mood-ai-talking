# 启动指南

## 快速启动

Windows用户可以直接双击运行 `start.bat`

## 手动启动步骤

### 1. 启动后端

**第一个终端窗口：**

```bash
cd backend
venv\Scripts\activate
python app.py
```

后端将在 http://localhost:5000 启动

### 2. 启动前端

**第二个终端窗口：**

```bash
cd frontend
npm run dev
```

前端将在 http://localhost:3000 启动

## 访问应用

打开浏览器访问：http://localhost:3000

## 测试

### 测试后端健康检查

在浏览器中访问：http://localhost:5000/api/health

应返回：
```json
{
  "status": "ok",
  "message": "服务运行正常"
}
```

### 测试聊天功能

在前端界面中：
1. 选择模式（情绪/毒舌/治愈）
2. 输入消息
3. 点击发送
4. 查看AI回复

## 停止服务

在每个终端窗口按 `Ctrl + C` 停止服务

## 故障排除

### 问题：后端无法启动

**解决方案：**
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

### 问题：前端无法启动

**解决方案：**
```bash
cd frontend
npm install
npm run dev
```

### 问题：无法连接后端

**检查：**
1. 后端是否已启动（访问 http://localhost:5000/api/health）
2. 浏览器控制台是否有错误（F12）
3. 端口是否被占用（使用 `netstat -ano | findstr 5000`）

### 问题：AI回复报错

**解决方案：**
1. 检查API密钥是否正确
2. 查看后端控制台日志
3. 确认网络连接正常

## 项目结构

```
AItest/
├── backend/              # Flask后端
│   ├── app.py          # 主应用
│   ├── venv/           # Python虚拟环境
│   └── requirements.txt # 依赖列表
├── frontend/            # React前端
│   ├── src/
│   │   ├── components/  # React组件
│   │   ├── App.tsx     # 主应用
│   │   └── main.tsx    # 入口文件
│   ├── node_modules/    # npm依赖
│   └── package.json    # 前端配置
├── start.bat           # Windows启动脚本
└── README.md           # 项目文档
```

## 功能说明

### 情绪模式
- 实时情绪指示器（浓度、距离、脉冲）
- 记忆管理和展示
- 智能情绪调节

### 毒舌模式
- 毒舌有趣风格
- 一针见血回应
- 深色星空背景

### 治愈模式
- 温暖治愈风格
- 鼓励和陪伴
- 明亮阳光背景

## 技术栈

- **后端**: Flask + Python 3.14
- **前端**: React 18 + TypeScript + Vite
- **UI**: TailwindCSS + Framer Motion
- **AI**: 阿里云通义千问API

## 开发建议

- 使用浏览器开发者工具（F12）调试前端
- 查看后端控制台日志调试后端
- 使用 `npm run build` 构建生产版本
- 使用 `gunicorn` 部署生产环境后端

## 许可证

MIT License

---

祝你使用愉快！
