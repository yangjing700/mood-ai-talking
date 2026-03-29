# 快速启动指南

## 一键启动（推荐）

**Windows用户：**
```
双击运行 start.bat
```

脚本会自动：
- ✅ 检查Python和Node.js环境
- ✅ 安装所需依赖
- ✅ 启动后端服务（http://localhost:5000）
- ✅ 启动前端服务（http://localhost:3000）
- ✅ 自动打开浏览器

## 手动启动

如果脚本无法运行，可以手动启动：

### 1. 启动后端

**打开第一个命令行窗口：**
```bash
cd backend
venv\Scripts\activate
python app.py
```

看到以下信息表示启动成功：
```
Emotion Chat AI Backend Starting...
API URL: http://localhost:5000
Running on http://0.0.0.0:5000
```

### 2. 启动前端

**打开第二个命令行窗口：**
```bash
cd frontend
npm run dev
```

看到以下信息表示启动成功：
```
  VITE v6.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://192.168.x.x:3000/
```

## 访问应用

在浏览器中打开：
```
http://localhost:3000
```

## 使用功能

### 切换模式
点击页面顶部的三个按钮切换模式：
- 💜 **情绪模式**：复杂情绪系统，实时显示AI情绪状态和记忆
- 🔮 **毒舌模式**：毒舌有趣，一针见血
- ✨ **治愈模式**：温柔治愈，温暖陪伴

### 发送消息
1. 在输入框中输入消息
2. 点击发送按钮或按Enter键
3. 查看AI回复

### 查看情绪状态（情绪模式）
- 顶部显示当前的情绪状态
- 三个进度条显示：浓度、距离、主动脉冲
- 点击📋按钮可以查看历史记忆

## 停止服务

### 一键停止
直接关闭两个命令行窗口即可

### 手动停止
在每个命令行窗口按 `Ctrl + C`

## 环境检查

### 检查Python版本
```bash
py --version
```
需要：Python 3.8+ （当前版本：3.14.3）

### 检查Node.js版本
```bash
node --version
```
需要：Node.js 18+ （当前版本：24.13.0）

## 常见问题

### 问题1：启动脚本报错 "未检测到Python"

**解决方案：**
系统使用 `py` 命令而不是 `python`，脚本已修复，请重新运行 `start.bat`

### 问题2：后端无法启动

**症状：** 端口5000被占用

**解决方案：**
```bash
netstat -ano | findstr 5000
```
找到进程ID后，使用以下命令关闭：
```bash
taskkill /PID <进程ID> /F
```

### 问题3：前端无法启动

**症状：** 端口3000被占用

**解决方案：**
修改 `frontend/vite.config.ts` 中的端口配置：
```typescript
server: {
  port: 3001,  // 改为其他端口
  proxy: {
    '/api': {
      target: 'http://localhost:5000',
      changeOrigin: true,
    }
  }
}
```

### 问题4：无法连接后端

**检查步骤：**
1. 确认后端已启动：访问 http://localhost:5000/api/health
2. 检查防火墙设置
3. 查看浏览器控制台（F12）的错误信息

### 问题5：AI回复报错

**解决方案：**
1. 检查API密钥是否正确
2. 查看后端控制台日志
3. 确认网络连接正常
4. 确认通义千问API服务可用

## 测试API

### 测试健康检查
在浏览器中访问：
```
http://localhost:5000/api/health
```

应返回：
```json
{
  "status": "ok",
  "message": "服务运行正常"
}
```

### 测试聊天API
使用curl或Postman：
```bash
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "你好", "mode": "emotion"}'
```

## 项目文件说明

```
AItest/
├── start.bat          # Windows一键启动脚本（已修复）
├── README.md          # 项目完整文档
├── START.md          # 启动详细指南
├── backend/          # 后端服务
│   ├── app.py       # Flask应用
│   ├── venv/        # Python虚拟环境
│   └── requirements.txt
├── frontend/         # 前端应用
│   ├── src/
│   │   ├── components/  # React组件
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── node_modules/    # npm依赖
│   └── package.json
└── emotion-chat-prototype.html  # HTML原型
```

## 技术支持

如遇问题，请：
1. 查看本文档的常见问题部分
2. 查看命令行窗口的错误信息
3. 查看浏览器控制台（F12）的错误信息
4. 查看 `README.md` 和 `START.md` 获取更多信息

---

**祝你使用愉快！** 🎉
