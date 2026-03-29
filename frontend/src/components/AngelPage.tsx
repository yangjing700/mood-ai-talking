import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send } from "lucide-react";

interface Message {
  id: number;
  role: "user" | "angel";
  content: string;
  time: string;
}

const SunRays = () => {
  const rays = Array.from({ length: 14 }, (_, i) => ({
    id: i,
    angle: (i * 360) / 14,
    length: Math.random() * 80 + 120,
    width: Math.random() * 2 + 1.5,
    opacity: Math.random() * 0.12 + 0.04,
    duration: Math.random() * 4 + 6,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* 太阳球体 */}
      <div
        className="absolute"
        style={{
          right: "6%",
          top: "-5%",
          width: "280px",
          height: "280px",
          background:
            "radial-gradient(circle, rgba(251,191,36,0.22) 0%, rgba(253,230,138,0.12) 45%, transparent 70%)",
          borderRadius: "50%",
        }}
      />
      {/* 光线 */}
      {rays.map((r) => (
        <motion.div
          key={r.id}
          className="absolute origin-bottom"
          style={{
            right: "14%",
            top: "-2%",
            width: `${r.width}px`,
            height: `${r.length}px`,
            background: `linear-gradient(to top, rgba(251,191,36,${r.opacity}) 0%, transparent 100%)`,
            transformOrigin: "bottom center",
            rotate: `${r.angle}deg`,
          }}
          animate={{ opacity: [r.opacity, r.opacity * 0.5, r.opacity] }}
          transition={{ duration: r.duration, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
      {/* 浮动光粒子 */}
      {Array.from({ length: 18 }, (_, i) => ({
        id: i,
        x: Math.random() * 90 + 5,
        y: Math.random() * 85 + 5,
        size: Math.random() * 3 + 2,
        duration: Math.random() * 3 + 4,
        delay: Math.random() * 5,
      })).map((p) => (
        <motion.div
          key={`p-${p.id}`}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: "radial-gradient(circle, rgba(251,191,36,0.8) 0%, transparent 70%)",
          }}
          animate={{
            opacity: [0, 0.7, 0],
            y: [0, -20, -40],
            scale: [0.8, 1.2, 0.6],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default function AngelPage() {
  const [messages, setMessages] = useState<Message[]>([]);
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
          mode: "angel",
        }),
      });

      if (!response.ok) throw new Error("发送失败");

      const data = await response.json();

      const angelMessage: Message = {
        id: Date.now() + 1,
        role: "angel",
        content: data.reply,
        time: new Date().toLocaleTimeString("zh-CN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, angelMessage]);
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
    <div className="w-full h-screen relative overflow-hidden bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
      {/* 背景阳光 */}
      <SunRays />

      {/* 主内容区 */}
      <div className="relative z-10 h-full flex flex-col">
        {/* 顶部标题 */}
        <div className="px-6 pt-20 pb-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-amber-900 mb-2"
          >
            ✨ 治愈小天使
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-amber-700 text-sm"
          >
            温暖陪伴，治愈心灵
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
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
                        : "bg-white text-gray-900 shadow-sm border border-amber-100"
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
                <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-amber-100">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" />
                    <div
                      className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <div
                      className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"
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
            <div className="bg-white rounded-2xl p-2 shadow-md border border-amber-200 flex items-end gap-2">
              <textarea
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  autoResize(e);
                }}
                onKeyDown={handleKeyDown}
                placeholder="想说点什么..."
                className="flex-1 bg-transparent text-gray-900 placeholder-gray-400 resize-none outline-none px-4 py-3 text-sm min-h-[44px]"
                rows={1}
                style={{ maxHeight: "120px" }}
              />
              <button
                onClick={handleSend}
                disabled={!inputText.trim() || isLoading}
                className="w-11 h-11 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
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
