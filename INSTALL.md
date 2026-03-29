# 安装和测试指南

## 快速开始（Windows）

1. **一键启动**
   ```
   双击运行 start.bat
   ```
   脚本会自动：
   - 检查Python和Node.js环境
   - 安装所需依赖
   - 启动后端和前端服务
   - 自动打开浏览器

2. **访问应用**
   ```
   http://localhost:3000
   ```

3. **停止服务**
   - 直接关闭两个命令行窗口即可

## 快速开始（Linux/Mac）

1. **添加执行权限**
   ```bash
   chmod +x start.sh stop.sh
   ```

2. **启动服务**
   ```bash
   ./start.sh
   ```

3. **访问应用**
   ```
   http://localhost:3000
   ```

4. **停止服务**
   ```bash
   ./stop.sh
   ```

## 手动安装步骤

### 1. 安装后端

```bash
# 进入后端目录
cd backend

# 创建虚拟环境（推荐）
python -m venv venv

# 激活虚拟环境
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# 安装依赖
pip install -r requirements.txt

# 启动后端服务
python app.py
```

后端将在 http://localhost:5000 启动

### 2. 安装前端

**打开新的终端窗口**

```bash
# 进入前端目录
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

前端将在 http://localhost:3000 启动

## 功能测试

### 测试后端API

1. **健康检查**
   ```bash
   curl http://localhost:5000/api/health
   ```

2. **发送聊天消息（情绪模式）**
   ```bash
   curl -X POST http://localhost:5000/api/chat \
     -H "Content-Type: application/json" \
     -d '{"message": "你好", "mode": "emotion"}'
   ```

3. **发送聊天消息（毒舌模式）**
   ```bash
   curl -X POST http://localhost:5000/api/chat \
     -H "Content-Type: application/json" \
     -d '{"message": "你好", "mode": "demon"}'
   ```

4. **发送聊天消息（治愈模式）**
   ```bash
   curl -X POST http://localhost:5000/api/chat \
     -H "Content-Type: application/json" \
     -d '{"message": "你好", "mode": "angel"}'
   ```

5. **获取情绪状态**
   ```bash
   curl http://localhost:5000/api/emotion
   ```

6. **获取记忆列表**
   ```bash
   curl http://localhost:5000/api/memories
   ```

### 测试前端UI

1. **模式切换测试**
   - 点击顶部的模式切换按钮
   - 测试三种模式的切换
   - 检查背景和动画效果

2. **聊天功能测试**
   - 在输入框中输入消息
   - 点击发送按钮或按Enter键
   - 查看AI回复
   - 检查消息时间显示

3. **情绪模式测试**
   - 切换到情绪模式
   - 查看情绪指示器是否正常显示
   - 检查三个维度的数值变化
   - 查看AI回复中是否包含记忆标签
   - 点击记忆按钮，查看记忆面板

4. **响应式测试**
   - 调整浏览器窗口大小
   - 测试在不同屏幕尺寸下的显示效果

## 常见问题

### 问题1：后端启动失败

**错误信息**：`ModuleNotFoundError: No module named 'flask'`

**解决方案**：
```bash
cd backend
pip install -r requirements.txt
```

### 问题2：前端启动失败

**错误信息**：`Error: Cannot find module 'xxx'`

**解决方案**：
```bash
cd frontend
npm install
```

### 问题3：前后端无法通信

**症状**：前端显示"无法连接到后端"

**解决方案**：
1. 确认后端已启动：访问 http://localhost:5000/api/health
2. 检查防火墙设置
3. 确认端口没有被占用

### 问题4：AI回复报错

**症状**：后端返回API错误

**解决方案**：
1. 检查API密钥是否正确
2. 确认通义千问API服务可用
3. 查看后端控制台日志

### 问题5：内存文件权限错误

**症状**：无法读取或写入memory.json

**解决方案**：
```bash
# 创建memory.json文件
echo '{"recent_emotion_memory": []}' > backend/memory.json

# 或在Python中创建
cd backend
python -c "import json; json.dump({'recent_emotion_memory': []}, open('memory.json', 'w'))"
```

## 开发环境配置

### VS Code推荐扩展

- Python
- Pylance
- ESLint
- Prettier
- Tailwind CSS IntelliSense

### Chrome浏览器调试

1. 打开开发者工具（F12）
2. 切换到Console标签
3. 查看前端日志和错误
4. 切换到Network标签，查看API请求

## 生产部署

### 前端构建

```bash
cd frontend
npm run build
```

构建产物在 `frontend/dist` 目录

### 后端部署

```bash
# 使用gunicorn（推荐）
pip install gunicorn
cd backend
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### 使用Docker

创建 `Dockerfile`：

```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ .

COPY frontend/dist ./frontend/dist

CMD ["python", "app.py"]
```

构建和运行：
```bash
docker build -t emotion-chat .
docker run -p 5000:5000 emotion-chat
```

## 性能优化

### 前端优化

1. 代码分割：使用React.lazy和Suspense
2. 图片优化：使用WebP格式
3. 缓存策略：配置Service Worker
4. CDN加速：使用CDN分发静态资源

### 后端优化

1. 数据库：使用Redis缓存记忆
2. 异步处理：使用Celery处理长时间任务
3. 负载均衡：使用Nginx反向代理
4. 连接池：优化数据库连接池配置

## 安全建议

1. **API密钥保护**
   - 不要将API密钥提交到Git
   - 使用环境变量存储密钥
   - 定期更换API密钥

2. **输入验证**
   - 验证所有用户输入
   - 防止SQL注入
   - 防止XSS攻击

3. **速率限制**
   - 实现API速率限制
   - 防止恶意请求
   - 使用Redis存储计数器

4. **HTTPS**
   - 生产环境使用HTTPS
   - 配置SSL证书
   - 强制HTTPS重定向

## 获取帮助

如果遇到问题：

1. 查看README.md文档
2. 查看backend/README.md和frontend/README.md
3. 检查日志文件
4. 提交Issue到项目仓库

---

祝你使用愉快！🎉
