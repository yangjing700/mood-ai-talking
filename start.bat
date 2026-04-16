@echo off
chcp 65001 >nul
echo ========================================
echo   情绪聊天AI - 启动脚本
echo ========================================
echo.

REM 检查Python是否安装（支持python、python3、py命令）
python --version >nul 2>&1
if errorlevel 1 (
    python3 --version >nul 2>&1
    if errorlevel 1 (
        py --version >nul 2>&1
        if errorlevel 1 (
            echo ❌ 错误: 未检测到Python，请先安装Python 3.8+
            pause
            exit /b 1
        )
    )
)

REM 检查Node.js是否安装
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误: 未检测到Node.js，请先安装Node.js 18+
    pause
    exit /b 1
)

echo ✅ 检测到Python和Node.js
echo.

REM 检查后端依赖
if not exist "backend\requirements.txt" (
    echo ❌ 错误: 找不到backend\requirements.txt
    pause
    exit /b 1
)

REM 检查前端依赖
if not exist "frontend\package.json" (
    echo ❌ 错误: 找不到frontend\package.json
    pause
    exit /b 1
)

echo 📦 正在检查依赖...
echo.

REM 创建后端虚拟环境（如不存在）
if not exist "backend\venv" (
    echo 正在创建后端虚拟环境...
    cd backend
    py -m venv venv
    cd ..
)

REM 安装后端依赖（每次都检查更新）
echo 📦 正在安装后端依赖...
cd backend
call venv\Scripts\activate.bat
pip install -r requirements.txt --quiet
if errorlevel 1 (
    echo ⚠️ pip安装失败，尝试更新pip...
    python -m pip install --upgrade pip
    pip install -r requirements.txt --quiet
)
cd ..
echo ✅ 后端依赖安装完成
echo.

REM 安装前端依赖（如果需要）
if not exist "frontend\node_modules" (
    echo 正在安装前端依赖...
    cd frontend
    call npm install
    cd ..
    echo ✅ 前端依赖安装完成
    echo.
)

echo ========================================
echo   启动服务
echo ========================================
echo.
echo 🚀 正在启动后端服务...
start "后端服务" cmd /k "cd backend && if exist venv\Scripts\activate.bat (call venv\Scripts\activate.bat && py app.py) else (py app.py)"

echo 🌐 正在启动前端服务...
timeout /t 3 /nobreak >nul
start "前端服务" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo   ✅ 服务启动成功！
echo ========================================
echo.
echo 📱 前端地址: http://localhost:3000
echo 🔌 后端地址: http://localhost:5000
echo.
echo 💡 提示: 两个服务窗口请保持开启
echo 🛑 停止服务: 直接关闭两个命令行窗口即可
echo.

timeout /t 3 /nobreak >nul
start http://localhost:3000

pause

