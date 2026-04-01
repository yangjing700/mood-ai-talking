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

const DemonCharacter = () => (
  <div className="relative w-full h-full flex items-end justify-center">
    {/* 深红色发光效果 */}
    <div
      className="absolute pointer-events-none"
      style={{
        bottom: "10%",
        left: "50%",
        transform: "translateX(-50%)",
        width: "85%",
        height: "70%",
        background:
          "radial-gradient(ellipse, rgba(180,20,40,0.32) 0%, rgba(100,10,20,0.14) 45%, transparent 70%)",
        filter: "blur(28px)",
      }}
    />
    {/* 角色图片 - 上下浮动效果 */}
    <motion.div
      className="relative w-full h-full flex items-end justify-center"
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
    >
      <img
        src="/demon-character.png"
        alt="毒舌小恶魔"
        style={{
          filter:
            "drop-shadow(0 0 32px rgba(220,20,60,0.55))",
          objectFit: "contain",
          width: "100%",
          height: "100%",
          maxHeight: "100%",
          transform: "rotate(-8deg) translateX(8%)",
          transformOrigin: "center bottom",
        }}
      />
    </motion.div>
  </div>
);

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
        memory: data.memory || undefined,
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
    <div
      className="relative w-full h-screen overflow-hidden"
      style={{
        background: "linear-gradient(140deg, #0a0118 0%, #16042e 35%, #0f0520 65%, #0d0420 100%)",
      }}
    >
      <Stars />

      {/* 紫色星云光晕 */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: "10%",
          top: "20%",
          width: "300px",
          height: "200px",
          background: "radial-gradient(ellipse, rgba(139,92,246,0.08) 0%, transparent 70%)",
          filter: "blur(30px)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          right: "5%",
          bottom: "20%",
          width: "250px",
          height: "200px",
          background: "radial-gradient(ellipse, rgba(168,85,247,0.07) 0%, transparent 70%)",
          filter: "blur(25px)",
        }}
      />

      <div className="relative z-10 flex h-full">
        {/* 左侧：恶魔角色 */}
        <div className="w-[38%] md:w-[36%] h-full flex items-end justify-center pb-0 px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-[90%] w-auto max-w-[280px]"
          >
            <DemonCharacter />
          </motion.div>
        </div>

        {/* 右侧：聊天框 */}
        <div className="flex-1 h-full flex items-center py-16 pr-8 pl-4">
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
            className="relative w-full h-full"
          >
            {/* 对话框主体 */}
            <div
              className="w-full h-full rounded-[2rem] border flex flex-col overflow-hidden"
              style={{
                borderColor: "rgba(139,92,246,0.3)",
                background:
                  "linear-gradient(145deg, rgba(76,29,149,0.18) 0%, rgba(45,16,96,0.22) 100%)",
                backdropFilter: "blur(20px)",
                boxShadow:
                  "0 0 80px rgba(139,92,246,0.12), 0 0 30px rgba(139,92,246,0.08), inset 0 0 60px rgba(139,92,246,0.04)",
              }}
            >
              {/* 头部 */}
              <div
                className="px-6 py-4 flex items-center gap-3 shrink-0"
                style={{ borderBottom: "1px solid rgba(139,92,246,0.2)" }}
              >
                {/* 恶魔三叉戟图标 - 使用图片（小尺寸） */}
                <motion.div
                  animate={{ rotate: [0, 5, 0, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <img
                    src="/trident.png"
                    alt="恶魔三叉戟"
                    style={{
                      width: "20px",
                      height: "20px",
                      filter: "drop-shadow(0 0 4px rgba(220,38,38,0.5))",
                    }}
                  />
                </motion.div>
                <motion.div
                  className="w-2.5 h-2.5 rounded-full bg-purple-400"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span
                  className="text-purple-300/90 text-sm tracking-[0.2em] uppercase select-none"
                  style={{ fontFamily: "serif" }}
                >
                  毒舌小恶魔 · 悄悄话
                </span>
              </div>

              {/* 消息区域 */}
              <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(139,92,246,0.3) transparent" }}>
                <AnimatePresence initial={false}>
                  {messages.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-center mt-10 select-none"
                    >
                      {/* 恶魔三叉戟图标 - 使用图片 */}
                      <motion.div
                        className="mb-4 flex justify-center"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <img
                          src="/trident.png"
                          alt="恶魔三叉戟"
                          style={{
                            width: "64px",
                            height: "64px",
                            filter: "drop-shadow(0 0 8px rgba(220,38,38,0.6))",
                          }}
                        />
                      </motion.div>
                      <p className="text-purple-400/80 text-sm leading-relaxed">
                        嗯？终于鼓起勇气来找我了？
                      </p>
                      <p className="text-purple-600/60 text-xs mt-2">
                        说吧，有什么想问的……如果你敢的话
                      </p>
                    </motion.div>
                  )}

                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {message.role === "ai" && (
                        <div className="w-7 h-7 rounded-full bg-purple-800/60 border border-purple-500/40 flex items-center justify-center text-xs mr-2 mt-1 shrink-0 select-none">
                          😈
                        </div>
                      )}
                      <div
                        className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                          message.role === "user"
                            ? "rounded-tr-sm text-purple-100"
                            : "rounded-tl-sm text-purple-200"
                        }`}
                        style={
                          message.role === "user"
                            ? {
                                background:
                                  "linear-gradient(135deg, rgba(147,51,234,0.65) 0%, rgba(109,40,217,0.55) 100%)",
                                border: "1px solid rgba(167,139,250,0.3)",
                              }
                            : {
                                background: "rgba(45,16,96,0.45)",
                                border: "1px solid rgba(139,92,246,0.25)",
                              }
                        }
                      >
                        <div className="text-sm leading-relaxed">{message.content}</div>
                        <div className="text-xs mt-1 opacity-70">{message.time}</div>
                        {message.memory && (
                          <div className="mt-2 text-xs bg-purple-500/20 rounded px-2 py-1 border border-purple-400/30">
                            💾 记住你了：{message.memory}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}

                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex justify-start"
                    >
                      <div className="w-7 h-7 rounded-full bg-purple-800/60 border border-purple-500/40 flex items-center justify-center text-xs mr-2 mt-1 shrink-0">
                        😈
                      </div>
                      <div
                        className="px-4 py-3 rounded-2xl rounded-tl-sm"
                        style={{
                          background: "rgba(45,16,96,0.45)",
                          border: "1px solid rgba(139,92,246,0.25)",
                        }}
                      >
                        <div className="flex gap-1.5 items-center">
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              className="w-1.5 h-1.5 rounded-full bg-purple-400"
                              animate={{ y: [0, -5, 0] }}
                              transition={{
                                duration: 0.55,
                                repeat: Infinity,
                                delay: i * 0.18,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>

              {/* 输入框 */}
              <div className="px-4 pb-4 pt-3 shrink-0" style={{ borderTop: "1px solid rgba(139,92,246,0.18)" }}>
                <div className="flex gap-3 items-end">
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onInput={autoResize}
                    placeholder="说说你的烦恼……（如果你敢的话）"
                    rows={1}
                    className="flex-1 rounded-2xl px-4 py-3 text-sm text-purple-100 placeholder-purple-700/60 resize-none focus:outline-none transition-colors"
                    style={{
                      background: "rgba(45,16,96,0.4)",
                      border: "1px solid rgba(139,92,246,0.3)",
                    }}
                  />
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={handleSend}
                    disabled={!inputText.trim() || isLoading}
                    className="p-3.5 rounded-xl text-purple-200 disabled:opacity-35 transition-colors shrink-0"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(147,51,234,0.7) 0%, rgba(109,40,217,0.6) 100%)",
                      border: "1px solid rgba(167,139,250,0.4)",
                    }}
                  >
                    <Send size={17} />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
