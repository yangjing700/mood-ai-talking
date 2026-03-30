import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send } from "lucide-react";

interface Message {
  id: number;
  role: "user" | "ai";
  content: string;
  time: string;
  memory?: string;
}

interface DemonPageProps {
  messages: Message[];
  setMessages: (messages: Message[] | ((prev: Message[]) => Message[])) => void;
}

const Stars = () => {
  const stars = Array.from({ length: 85 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2.2 + 0.6,
    opacity: Math.random() * 0.65 + 0.15,
    duration: Math.random() * 2.5 + 2,
    delay: Math.random() * 4,
  }));

  const sparkles = Array.from({ length: 14 }, (_, i) => ({
    id: i,
    x: Math.random() * 85 + 5,
    y: Math.random() * 75 + 5,
    size: Math.random() * 8 + 8,
    duration: Math.random() * 2 + 2.5,
    delay: Math.random() * 4,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            boxShadow: `0 0 ${s.size * 2.5}px rgba(255,255,255,0.8)`,
          }}
          animate={{ opacity: [s.opacity, s.opacity * 0.2, s.opacity] }}
          transition={{
            duration: s.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: s.delay,
          }}
        />
      ))}
      {sparkles.map((sp) => (
        <motion.div
          key={`sp-${sp.id}`}
          className="absolute text-yellow-200/80 select-none"
          style={{
            left: `${sp.x}%`,
            top: `${sp.y}%`,
            fontSize: `${sp.size}px`,
          }}
          animate={{
            opacity: [0, 0.9, 0],
            scale: [0.4, 1.2, 0.4],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: sp.duration,
            repeat: Infinity,
            delay: sp.delay,
            ease: "easeInOut",
          }}
        >
          ✦
        </motion.div>
      ))}
    </div>
  );
};

export default function DemonPage({ messages, setMessages }: DemonPageProps) {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: inputText,
      time: new Date().toLocaleTimeString("zh-CN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.content,
          mode: "demon",
        }),
      });

      if (!response.ok) throw new Error("发送失败");

      const data = await response.json();

      const demonMessage: Message = {
        id: Date.now() + 1,
        role: "ai",
        content: data.reply,
        time: new Date().toLocaleTimeString("zh-CN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, demonMessage]);
    } catch (error) {
      console.error("发送消息失败:", error);
      alert("发送消息失败，请检查后端服务");
    } finally {
      setIsLoading(false);
      setTimeout(() => scrollToBottom(), 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const autoResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  };

  return (
    <div className="w-full h-screen relative overflow-hidden bg-gradient-to-br from-[#0f0520] via-purple-900/50 to-[#1a0a2e]">
      {/* 背景星空 */}
      <Stars />

      {/* 主内容区 */}
      <div className="relative z-10 h-full flex flex-col">
        {/* 顶部标题 */}
        <div className="px-6 pt-20 pb-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-white mb-2"
          >
            🌙 毒舌小恶魔
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-purple-300 text-sm"
          >
            被怼也是一种陪伴
          </motion.p>
        </div>

        {/* 聊天消息区 */}
        <div className="flex-1 px-6 pb-4 overflow-y-auto">
          <div className="max-w-3xl mx-auto space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-purple-600 text-white"
                        : "bg-white/10 backdrop-blur-md text-purple-100 border border-purple-500/30"
                    }`}
                  >
                    <div className="text-sm leading-relaxed">{message.content}</div>
                    <div className="text-xs mt-1 opacity-70">{message.time}</div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-white/10 backdrop-blur-md rounded-2xl px-4 py-3 border border-purple-500/30">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                    <div
                      className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <div
                      className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* 输入区 */}
        <div className="px-6 pb-6">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-purple-500/30 flex items-end gap-2">
              <textarea
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  autoResize(e);
                }}
                onKeyDown={handleKeyDown}
                placeholder="找骂就来..."
                className="flex-1 bg-transparent text-white placeholder-purple-300/50 resize-none outline-none px-4 py-3 text-sm min-h-[44px]"
                rows={1}
                style={{ maxHeight: "120px" }}
              />
              <button
                onClick={handleSend}
                disabled={!inputText.trim() || isLoading}
                className="w-11 h-11 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
