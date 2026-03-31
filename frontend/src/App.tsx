import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import DemonPage from "./components/DemonPage";
import AngelPage from "./components/AngelPage";

type Mode = "demon" | "angel";

interface Message {
  id: number;
  role: "user" | "ai";
  content: string;
  time: string;
  memory?: string;
}

// 每种模式的独立聊天记录
interface ChatHistory {
  demon: Message[];
  angel: Message[];
}

export default function App() {
  const [mode, setMode] = useState<Mode>("demon");
  const [isLoading, setIsLoading] = useState(true);

  // 每种模式独立的聊天记录
  const [chatHistory, setChatHistory] = useState<ChatHistory>({
    demon: [],
    angel: [],
  });

  // 检查后端连接
  useEffect(() => {
    checkBackendConnection();
  }, []);

  const checkBackendConnection = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/health");
      if (response.ok) {
        console.log("✅ 后端连接成功");
      } else {
        console.warn("⚠️ 后端服务可能未启动");
      }
    } catch (error) {
      console.error("❌ 无法连接到后端:", error);
      alert("无法连接到后端服务，请确保后端已启动 (python backend/app.py)");
    } finally {
      setIsLoading(false);
    }
  };

  // 更新指定模式的聊天记录
  const updateMessages = (mode: Mode, newMessages: Message[] | ((prev: Message[]) => Message[])) => {
    setChatHistory((prev) => ({
      ...prev,
      [mode]: typeof newMessages === 'function' ? newMessages(prev[mode]) : newMessages,
    }));
  };

  // 添加消息到指定模式
  const addMessage = (mode: Mode, message: Message) => {
    setChatHistory((prev) => ({
      ...prev,
      [mode]: [...prev[mode], message],
    }));
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900">
        <div className="text-white text-center">
          <div className="text-4xl mb-4">🚀</div>
          <div className="text-xl">正在连接后端...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen overflow-hidden relative">
      {/* 页面内容 */}
      <AnimatePresence mode="wait">
        {mode === "demon" && (
          <motion.div
            key="demon"
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <DemonPage 
              messages={chatHistory.demon}
              setMessages={(newMessages) => updateMessages("demon", newMessages)}
            />
          </motion.div>
        )}
        {mode === "angel" && (
          <motion.div
            key="angel"
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <AngelPage 
              messages={chatHistory.angel}
              setMessages={(newMessages) => updateMessages("angel", newMessages)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 模式切换器 */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 z-50">
        <motion.div
          className={`flex rounded-full p-1 gap-1 backdrop-blur-md border shadow-lg ${
            mode === "angel"
              ? "border-amber-200/50 bg-white/60"
              : "border-white/20 bg-black/10"
          }`}
          layout
          transition={{ duration: 0.35 }}
        >
          {/* 恶魔模式 */}
          <button
            onClick={() => setMode("demon")}
            className={`relative px-4 py-2 rounded-full text-sm transition-all duration-300 select-none ${
              mode === "demon" ? "" : "hover:bg-white/10"
            }`}
          >
            {mode === "demon" && (
              <motion.div
                layoutId="tab-pill"
                className="absolute inset-0 rounded-full"
                style={{
                  background: "linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)",
                }}
                transition={{ duration: 0.35, type: "spring", bounce: 0.25 }}
              />
            )}
            <span className={`relative z-10 flex items-center gap-2 ${
              mode === "angel" ? "text-amber-800 font-medium" : "text-white"
            }`}>
              <span>🔮</span>
              <span>毒舌小恶魔</span>
            </span>
          </button>

          {/* 分隔线 */}
          <div className={`w-px self-stretch my-1 ${
            mode === "angel" ? "bg-amber-200/50" : "bg-white/20"
          }`} />

          {/* 天使模式 */}
          <button
            onClick={() => setMode("angel")}
            className={`relative px-4 py-2 rounded-full text-sm transition-all duration-300 select-none ${
              mode === "angel" ? "" : "hover:bg-white/10"
            }`}
          >
            {mode === "angel" && (
              <motion.div
                layoutId="tab-pill"
                className="absolute inset-0 rounded-full"
                style={{
                  background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
                }}
                transition={{ duration: 0.35, type: "spring", bounce: 0.25 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2 text-white font-medium">
              <span>✨</span>
              <span>治愈小天使</span>
            </span>
          </button>
        </motion.div>
      </div>
    </div>
  );
}
