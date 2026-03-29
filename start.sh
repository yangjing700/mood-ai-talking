#!/bin/bash

echo "========================================"
echo "  情绪聊天AI - 启动脚本"
echo "========================================"
echo ""

# 检查Python是否安装
if ! command -v python3 &> /dev/null; then
    echo "❌ 错误: 未检测到Python，请先安装Python 3.8+"
    exit 1
fi

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未检测到Node.js，请先安装Node.js 18+"
    exit 1
fi

echo "✅ 检测到Python和Node.js"
echo ""

# 检查后端依赖
if [ ! -f "backend/requirements.txt" ]; then
    echo "❌ 错误: 找不到backend/requirements.txt"
    exit 1
fi

# 检查前端依赖
if [ ! -f "frontend/package.json" ]; then
    echo "❌ 错误: 找不到frontend/package.json"
    exit 1
fi

echo "📦 正在检查依赖..."
echo ""

# 安装后端依赖（如果需要）
if [ ! -d "backend/venv" ]; then
    echo "正在安装后端依赖..."
    cd backend
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    cd ..
    echo "✅ 后端依赖安装完成"
    echo ""
fi

# 安装前端依赖（如果需要）
if [ ! -d "frontend/node_modules" ]; then
    echo "正在安装前端依赖..."
    cd frontend
    npm install
    cd ..
    echo "✅ 前端依赖安装完成"
    echo ""
fi

echo "========================================"
echo "  启动服务"
echo "========================================"
echo ""

# 创建logs目录
mkdir -p logs

echo "🚀 正在启动后端服务..."
cd backend
if [ -f "venv/bin/activate" ]; then
    source venv/bin/activate
fi
nohup python app.py > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
cd ..

sleep 3

echo "🌐 正在启动前端服务..."
cd frontend
nohup npm run dev > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

echo ""
echo "========================================"
echo "  ✅ 服务启动成功！"
echo "========================================"
echo ""
echo "📱 前端地址: http://localhost:3000"
echo "🔌 后端地址: http://localhost:5000"
echo ""
echo "💡 提示: 查看日志文件了解服务状态"
echo "   后端日志: logs/backend.log"
echo "   前端日志: logs/frontend.log"
echo ""
echo "🛑 停止服务: 运行 ./stop.sh"
echo ""

# 保存PID
echo $BACKEND_PID > logs/backend.pid
echo $FRONTEND_PID > logs/frontend.pid

# 自动打开浏览器
if command -v xdg-open &> /dev/null; then
    xdg-open http://localhost:3000
elif command -v open &> /dev/null; then
    open http://localhost:3000
fi

echo "按Ctrl+C退出"
wait
