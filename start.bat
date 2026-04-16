@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion

echo ========================================
echo   情绪聊天AI - 一键启动脚本
echo ========================================
echo.

REM ============ 检查Python ============
python --version >nul 2>&1
if errorlevel 1 (
    python3 --version >nul 2>&1
    if errorlevel 1 (
        py --version >nul 2>&1
        if errorlevel 1 (
            echo [错误] 未检测到Python，请先安装 Python 3.8+
            echo 下载地址: https://www.python.org/downloads/
            pause
            exit /b 1
        )
        set PYTHON_CMD=py
    ) else (
        set PYTHON_CMD=python3
    )
) else (
    set PYTHON_CMD=python
)

REM ============ 检查Node.js ============
node --version >nul 2>&1
if errorlevel 1 (
    echo [错误] 未检测到Node.js，请先安装 Node.js 18+
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Python 和 Node.js 已就绪
echo.

REM ============ 创建后端虚拟环境 ============
if not exist "backend\venv" (
    echo [1/4] 正在创建后端虚拟环境...
    cd backend
    %PYTHON_CMD% -m venv venv
    cd ..
    echo [OK] 虚拟环境创建完成
    echo.
) else (
    echo [跳过] 后端虚拟环境已存在
    echo.
)

REM ============ 安装后端依赖 ============
echo [2/4] 正在安装后端依赖...
cd backend
call venv\Scripts\activate.bat
pip install --upgrade pip -q
pip install -r requirements.txt -q
if errorlevel 1 (
    echo [警告] pip安装失败，尝试重试...
    pip install -r requirements.txt
)
cd ..
echo [OK] 后端依赖安装完成
echo.

REM ============ 检查/设置API Key ============
echo [3/4] 正在检查API Key配置...
cd backend
call venv\Scripts\activate.bat

REM 检查API Key是否存在
python -c "import keyring; exit(0 if keyring.get_password('emotion_chat_ai', 'dashscope_api_key') else 1)" >nul 2>&1
if errorlevel 1 (
    echo.
    echo ========================================
    echo   首次使用需要设置 API Key
    echo ========================================
    echo.
    echo 请前往以下网址获取通义千问API Key:
    echo   https://dashscope.console.aliyun.com/
    echo.
    set /p API_KEY="请输入您的 API Key: "
    if "!API_KEY!"=="" (
        echo [错误] API Key 不能为空
        pause
        exit /b 1
    )
    
    REM 存储API Key到Windows凭据管理器
    python -c "import keyring; keyring.set_password('emotion_chat_ai', 'dashscope_api_key', '%API_KEY%')"
    if errorlevel 1 (
        echo [错误] API Key存储失败
        pause
        exit /b 1
    )
    echo [OK] API Key 已安全存储到 Windows凭据管理器
) else (
    echo [跳过] API Key 已配置
)
cd ..
echo.

REM ============ 安装前端依赖 ============
echo [4/4] 正在安装前端依赖...
if not exist "frontend\node_modules" (
    cd frontend
    call npm install
    cd ..
    echo [OK] 前端依赖安装完成
) else (
    echo [跳过] 前端依赖已存在
)
echo.

REM ============ 启动服务 ============
echo ========================================
echo   启动服务中...
echo ========================================
echo.

REM 启动后端
start "后端服务" cmd /k "cd /d %CD%\backend && call venv\Scripts\activate.bat && python app.py"

REM 等待后端启动
timeout /t 2 /nobreak >nul

REM 启动前端
start "前端服务" cmd /k "cd /d %CD%\frontend && npm run dev"

REM 等待启动完成
timeout /t 2 /nobreak >nul

REM 自动打开浏览器
start http://localhost:3000

echo ========================================
echo   启动完成！
echo ========================================
echo.
echo 前端地址: http://localhost:3000
echo 后端地址: http://localhost:5000
echo.
echo 提示: 请保持两个服务窗口开启
echo 停止服务: 直接关闭命令行窗口
echo.
echo ========================================
echo.
pause
